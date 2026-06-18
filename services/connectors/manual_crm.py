"""
BEI Manual CRM Connector
For businesses not on HubSpot or Salesforce.
User enters real numbers from their own CRM or records.
Maps to: Business Twin — Sales, Operations sub-twin.
Golden Rule 8: Accuracy Over Volume — only real data enters the pipeline.
"""

from typing import Any
from services.connectors.base import BaseConnector


class ManualCRMConnector(BaseConnector):

    connector_type = "manual_crm"
    connector_name = "CRM (Manual Entry)"

    def connect(self) -> bool:
        required = ['total_leads', 'converted_leads']
        return all(self.credentials.get(k) for k in required)

    def fetch(self) -> dict[str, Any]:
        return self.credentials

    def normalise(self, raw: dict[str, Any]) -> dict[str, Any]:
        try:
            total_leads = int(raw.get('total_leads', 0))
            converted_leads = int(raw.get('converted_leads', 0))
            avg_response_hours = float(raw.get('avg_response_time_hours', 0))
            avg_deal_value = float(raw.get('avg_deal_value', 0))
            open_deals = int(raw.get('open_deals', 0))
            won_last_90 = int(raw.get('won_deals_last_90', 0))
            lost_last_90 = int(raw.get('lost_deals_last_90', 0))
        except (ValueError, TypeError) as e:
            return {'source': 'manual_crm', 'available': False, 'error': str(e)}

        conversion_rate = converted_leads / total_leads if total_leads > 0 else 0.0

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

        if avg_response_hours <= 1:
            response_quality = "Excellent"
        elif avg_response_hours <= 4:
            response_quality = "Good"
        elif avg_response_hours <= 24:
            response_quality = "Moderate"
        else:
            response_quality = "Poor"

        return {
            'source': 'manual_crm',
            'available': True,
            'total_leads': total_leads,
            'converted_leads': converted_leads,
            'conversion_rate': round(conversion_rate, 3),
            'conversion_band': conversion_band,
            'avg_response_time_hours': avg_response_hours,
            'response_quality': response_quality,
            'avg_deal_value': avg_deal_value,
            'open_deals': open_deals,
            'won_deals_last_90': won_last_90,
            'lost_deals_last_90': lost_last_90,
            'twin_mappings': {
                'sales.conversion_rate': conversion_band,
                'sales.avg_deal_value': avg_deal_value,
                'operations.lead_response_quality': response_quality,
            }
        }
