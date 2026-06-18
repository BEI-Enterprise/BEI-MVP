"""
BEI HubSpot Connector
Real OAuth 2.0 integration with HubSpot CRM API v3.
Pulls: contacts, deals, pipeline data, conversion rates, response times.
Maps to: Business Twin — Sales, Operations sub-twin.
Golden Rule 8: Accuracy Over Volume — only real verified data enters the pipeline.

OAuth flow:
1. Frontend redirects to /oauth/hubspot/start
2. User authorises in HubSpot
3. HubSpot redirects to /oauth/hubspot/callback with code
4. We exchange code for access_token + refresh_token
5. Tokens stored in Supabase connectors table
6. Connector uses access_token to pull data
"""

from typing import Any
from services.connectors.base import BaseConnector
import urllib.request
import urllib.parse
import json


HUBSPOT_API_BASE = "https://api.hubapi.com"


class HubSpotConnector(BaseConnector):

    connector_type = "hubspot"
    connector_name = "HubSpot CRM"

    def connect(self) -> bool:
        return bool(self.credentials.get('access_token'))

    def _api_get(self, path: str, params: dict = None) -> dict:
        access_token = self.credentials['access_token']
        url = f"{HUBSPOT_API_BASE}{path}"
        if params:
            url += '?' + urllib.parse.urlencode(params)
        req = urllib.request.Request(
            url,
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json",
            }
        )
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read().decode())

    def _api_post(self, path: str, body: dict) -> dict:
        access_token = self.credentials['access_token']
        url = f"{HUBSPOT_API_BASE}{path}"
        data = json.dumps(body).encode()
        req = urllib.request.Request(
            url,
            data=data,
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json",
            },
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read().decode())

    def fetch(self) -> dict[str, Any]:
        from datetime import datetime, timedelta
        ninety_days_ago = (datetime.now() - timedelta(days=90)).strftime('%Y-%m-%dT00:00:00.000Z')

        # Fetch deals created in last 90 days
        deals_body = {
            "filterGroups": [{
                "filters": [{
                    "propertyName": "createdate",
                    "operator": "GTE",
                    "value": ninety_days_ago
                }]
            }],
            "properties": [
                "dealname", "amount", "dealstage", "closedate",
                "createdate", "hs_deal_stage_probability"
            ],
            "limit": 200
        }
        deals = self._api_post("/crm/v3/objects/deals/search", deals_body)

        # Fetch contacts created in last 90 days
        contacts_body = {
            "filterGroups": [{
                "filters": [{
                    "propertyName": "createdate",
                    "operator": "GTE",
                    "value": ninety_days_ago
                }]
            }],
            "properties": [
                "firstname", "lastname", "email", "createdate",
                "hs_lead_status", "notes_last_contacted"
            ],
            "limit": 200
        }
        contacts = self._api_post("/crm/v3/objects/contacts/search", contacts_body)

        # Fetch pipeline stages
        try:
            pipelines = self._api_get("/crm/v3/pipelines/deals")
        except Exception:
            pipelines = {}

        return {
            'deals': deals,
            'contacts': contacts,
            'pipelines': pipelines,
        }

    def normalise(self, raw: dict[str, Any]) -> dict[str, Any]:
        deals_data = raw.get('deals', {})
        contacts_data = raw.get('contacts', {})

        deals = deals_data.get('results', [])
        contacts = contacts_data.get('results', [])

        total_deals = len(deals)
        total_contacts = len(contacts)

        closed_won = [
            d for d in deals
            if 'closedwon' in str(d.get('properties', {}).get('dealstage', '')).lower()
            or str(d.get('properties', {}).get('hs_deal_stage_probability', '0')) == '1.0'
        ]
        closed_lost = [
            d for d in deals
            if 'closedlost' in str(d.get('properties', {}).get('dealstage', '')).lower()
            or str(d.get('properties', {}).get('hs_deal_stage_probability', '1')) == '0.0'
        ]

        won_count = len(closed_won)
        lost_count = len(closed_lost)
        conversion_rate = won_count / total_contacts if total_contacts > 0 else 0.0

        deal_amounts = []
        for d in closed_won:
            try:
                amt = float(d.get('properties', {}).get('amount', 0) or 0)
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

        lead_volume = total_contacts
        if lead_volume <= 5:
            lead_band = "0-5"
        elif lead_volume <= 20:
            lead_band = "6-20"
        elif lead_volume <= 50:
            lead_band = "21-50"
        elif lead_volume <= 100:
            lead_band = "51-100"
        else:
            lead_band = "Over 100"

        return {
            'source': 'hubspot',
            'available': True,
            'total_contacts_90d': total_contacts,
            'total_deals_90d': total_deals,
            'won_deals_90d': won_count,
            'lost_deals_90d': lost_count,
            'conversion_rate': round(conversion_rate, 3),
            'conversion_band': conversion_band,
            'avg_deal_value': round(avg_deal_value, 2),
            'lead_band': lead_band,
            'twin_mappings': {
                'sales.conversion_rate': conversion_band,
                'sales.avg_deal_value': avg_deal_value,
                'growth.lead_volume': lead_band,
            }
        }


def exchange_code_for_tokens(code: str, redirect_uri: str, client_id: str, client_secret: str) -> dict:
    """Exchange OAuth authorisation code for access + refresh tokens."""
    url = "https://api.hubapi.com/oauth/v1/token"
    body = urllib.parse.urlencode({
        'grant_type': 'authorization_code',
        'client_id': client_id,
        'client_secret': client_secret,
        'redirect_uri': redirect_uri,
        'code': code,
    }).encode()
    req = urllib.request.Request(
        url,
        data=body,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST"
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode())


def refresh_access_token(refresh_token: str, client_id: str, client_secret: str) -> dict:
    """Refresh an expired HubSpot access token."""
    url = "https://api.hubapi.com/oauth/v1/token"
    body = urllib.parse.urlencode({
        'grant_type': 'refresh_token',
        'client_id': client_id,
        'client_secret': client_secret,
        'refresh_token': refresh_token,
    }).encode()
    req = urllib.request.Request(
        url,
        data=body,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST"
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode())


def get_oauth_url(client_id: str, redirect_uri: str, scopes: list = None) -> str:
    """Generate HubSpot OAuth authorisation URL."""
    if scopes is None:
        scopes = ['crm.objects.deals.read', 'crm.objects.contacts.read', 'crm.schemas.deals.read']
    params = urllib.parse.urlencode({
        'client_id': client_id,
        'redirect_uri': redirect_uri,
        'scope': ' '.join(scopes),
    })
    return f"https://app.hubspot.com/oauth/authorize?{params}"
