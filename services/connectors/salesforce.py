"""
BEI Salesforce Connector
Real OAuth 2.0 integration with Salesforce REST API.
Pulls: leads, opportunities, conversion data, response times.
Maps to: Business Twin — Sales, Operations sub-twin.
Golden Rule 8: Accuracy Over Volume — only real verified data enters the pipeline.
"""

from typing import Any
from services.connectors.base import BaseConnector
import urllib.request
import urllib.parse
import json
from datetime import datetime, timedelta


class SalesforceConnector(BaseConnector):

    connector_type = "salesforce"
    connector_name = "Salesforce"

    def connect(self) -> bool:
        return bool(
            self.credentials.get('access_token') and
            self.credentials.get('instance_url')
        )

    def _soql(self, query: str) -> dict:
        access_token = self.credentials['access_token']
        instance_url = self.credentials['instance_url'].rstrip('/')
        encoded = urllib.parse.quote(query)
        url = f"{instance_url}/services/data/v58.0/query?q={encoded}"
        req = urllib.request.Request(
            url,
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json",
            }
        )
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read().decode())

    def fetch(self) -> dict[str, Any]:
        ninety_days_ago = (datetime.now() - timedelta(days=90)).strftime('%Y-%m-%dT00:00:00Z')

        leads = self._soql(
            f"SELECT Id, Status, CreatedDate, ConvertedDate, IsConverted "
            f"FROM Lead WHERE CreatedDate >= {ninety_days_ago} LIMIT 500"
        )
        opportunities = self._soql(
            f"SELECT Id, Name, Amount, StageName, CloseDate, CreatedDate, IsClosed, IsWon "
            f"FROM Opportunity WHERE CreatedDate >= {ninety_days_ago} LIMIT 500"
        )
        return {'leads': leads, 'opportunities': opportunities}

    def normalise(self, raw: dict[str, Any]) -> dict[str, Any]:
        leads_data = raw.get('leads', {}).get('records', [])
        opps_data = raw.get('opportunities', {}).get('records', [])

        total_leads = len(leads_data)
        converted_leads = sum(1 for l in leads_data if l.get('IsConverted'))
        conversion_rate = converted_leads / total_leads if total_leads > 0 else 0.0

        won_opps = [o for o in opps_data if o.get('IsWon')]
        lost_opps = [o for o in opps_data if o.get('IsClosed') and not o.get('IsWon')]

        deal_amounts = []
        for o in won_opps:
            try:
                amt = float(o.get('Amount', 0) or 0)
                if amt > 0:
                    deal_amounts.append(amt)
            except (ValueError, TypeError):
                pass

        avg_deal_value = sum(deal_amounts) / len(deal_amounts) if deal_amounts else 0.0

        if conversion_rate < 0.1:
            conversion_band = "Less than 1 in 10"
        elif conversion_rate < 0.2:
            conversion_band = "1-2 in 10"
        elif conversion_rate < 0.4:
            conversion_band = "2-4 in 10"
        elif conversion_rate < 0.6:
            conversion_band = "4-6 in 10"
        else:
            conversion_band = "More than 6 in 10"

        if total_leads <= 5:
            lead_band = "0-5"
        elif total_leads <= 20:
            lead_band = "6-20"
        elif total_leads <= 50:
            lead_band = "21-50"
        elif total_leads <= 100:
            lead_band = "51-100"
        else:
            lead_band = "Over 100"

        return {
            'source': 'salesforce',
            'available': True,
            'total_leads_90d': total_leads,
            'converted_leads_90d': converted_leads,
            'conversion_rate': round(conversion_rate, 3),
            'conversion_band': conversion_band,
            'won_opportunities_90d': len(won_opps),
            'lost_opportunities_90d': len(lost_opps),
            'avg_deal_value': round(avg_deal_value, 2),
            'lead_band': lead_band,
            'twin_mappings': {
                'sales.conversion_rate': conversion_band,
                'sales.avg_deal_value': avg_deal_value,
                'growth.lead_volume': lead_band,
            }
        }


def exchange_code_for_tokens(code: str, redirect_uri: str, client_id: str, client_secret: str) -> dict:
    body = urllib.parse.urlencode({
        'grant_type': 'authorization_code',
        'code': code,
        'client_id': client_id,
        'client_secret': client_secret,
        'redirect_uri': redirect_uri,
    }).encode()
    req = urllib.request.Request(
        "https://login.salesforce.com/services/oauth2/token",
        data=body,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST"
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode())


def refresh_access_token(refresh_token: str, client_id: str, client_secret: str) -> dict:
    body = urllib.parse.urlencode({
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': client_id,
        'client_secret': client_secret,
    }).encode()
    req = urllib.request.Request(
        "https://login.salesforce.com/services/oauth2/token",
        data=body,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST"
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode())


def get_oauth_url(client_id: str, redirect_uri: str) -> str:
    params = urllib.parse.urlencode({
        'response_type': 'code',
        'client_id': client_id,
        'redirect_uri': redirect_uri,
    })
    return f"https://login.salesforce.com/services/oauth2/authorize?{params}"
