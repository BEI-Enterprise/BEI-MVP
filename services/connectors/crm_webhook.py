"""
BEI CRM Webhook Connector
Receives CRM data via webhook or manual data push.
Aligned with BEI Master Architecture — Connector Layer.
Maps to: Business Twin — Sales, Operations sub-twin.
Supports: HubSpot, Pipedrive, custom CRM exports.
"""

from typing import Any
from services.connectors.base import BaseConnector


class CRMWebhookConnector(BaseConnector):

    connector_type = "crm_webhook"
    connector_name = "CRM (Webhook)"

    def connect(self) -> bool:
        """CRM webhook connector is always available if data is present."""
        return True

    def fetch(self) -> dict[str, Any]:
        """
        For webhook connectors, data is pushed to us.
        Returns whatever data was passed in credentials['data'].
        """
        return self.credentials.get("data", {})

    def normalise(self, raw_data: dict[str, Any]) -> dict[str, Any]:
        """
        Normalise CRM data into BEI twin format.
        Maps to: sales, operations sub-twins.
        """

        if not raw_data:
            return {
                "source": "crm_webhook",
                "available": False,
                "error": "No CRM data received",
            }

        # Extract key CRM metrics
        total_leads = raw_data.get("total_leads", 0)
        converted_leads = raw_data.get("converted_leads", 0)
        avg_response_time_hours = raw_data.get("avg_response_time_hours", 0)
        avg_deal_value = raw_data.get("avg_deal_value", 0)
        open_deals = raw_data.get("open_deals", 0)
        won_deals_last_90 = raw_data.get("won_deals_last_90", 0)
        lost_deals_last_90 = raw_data.get("lost_deals_last_90", 0)

        # Calculate conversion rate
        conversion_rate = 0.0
        if total_leads > 0:
            conversion_rate = converted_leads / total_leads

        # Map conversion rate to BEI scale
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

        # Map response time to lead response quality
        if avg_response_time_hours <= 1:
            response_quality = "Excellent"
        elif avg_response_time_hours <= 4:
            response_quality = "Good"
        elif avg_response_time_hours <= 24:
            response_quality = "Moderate"
        else:
            response_quality = "Poor"

        return {
            "source": "crm_webhook",
            "available": True,
            "total_leads": total_leads,
            "converted_leads": converted_leads,
            "conversion_rate": round(conversion_rate, 3),
            "conversion_band": conversion_band,
            "avg_response_time_hours": avg_response_time_hours,
            "response_quality": response_quality,
            "avg_deal_value": avg_deal_value,
            "open_deals": open_deals,
            "won_deals_last_90": won_deals_last_90,
            "lost_deals_last_90": lost_deals_last_90,
            "twin_mappings": {
                "sales.conversion_rate": conversion_band,
                "sales.avg_deal_value": avg_deal_value,
                "operations.lead_response_quality": response_quality,
            }
        }
