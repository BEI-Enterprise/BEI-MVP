"""
BEI Connector Registry — Updated
Central manager for all BEI connectors.
Runs connectors, merges data into Business Twin.
Aligned with BEI Master Architecture — Connector Layer.
Golden Rule 8: Accuracy Over Volume — only real verified data enters the pipeline.
"""

from typing import Any
from services.connectors.google_business import GoogleBusinessConnector
from services.connectors.crm_webhook import CRMWebhookConnector
from services.connectors.manual_crm import ManualCRMConnector
from services.connectors.manual_financial import ManualFinancialConnector
from services.connectors.manual_staffing import ManualStaffingConnector
from services.connectors.companies_house import CompaniesHouseConnector
from services.connectors.hubspot import HubSpotConnector
from services.connectors.xero import XeroConnector
from services.connectors.quickbooks import QuickBooksConnector
from services.connectors.salesforce import SalesforceConnector
from services.connectors.hibob import HiBobConnector
from services.connectors.workday import WorkdayConnector
from services.connectors.google_analytics import GoogleAnalyticsConnector


CONNECTOR_MAP = {
    "google_business_profile":  GoogleBusinessConnector,
    "crm_webhook":              CRMWebhookConnector,
    "manual_crm":               ManualCRMConnector,
    "manual_financial":         ManualFinancialConnector,
    "manual_staffing":          ManualStaffingConnector,
    "companies_house":          CompaniesHouseConnector,
    "hubspot":                  HubSpotConnector,
    "xero":                     XeroConnector,
    "quickbooks":               QuickBooksConnector,
    "salesforce":               SalesforceConnector,
    "hibob":                    HiBobConnector,
    "workday":                  WorkdayConnector,
    "google_analytics":         GoogleAnalyticsConnector,
}


def run_connectors(
    business_id: str,
    connector_configs: list[dict[str, Any]]
) -> dict[str, Any]:
    """
    Run all configured connectors for a business.
    Returns merged normalised data and connector statuses.
    Only real data from real systems enters the pipeline.
    """

    results = []
    merged_data = {}
    twin_updates = {}

    for config in connector_configs:
        connector_type = config.get("connector_type", "")
        credentials = config.get("credentials", {})

        connector_class = CONNECTOR_MAP.get(connector_type)
        if not connector_class:
            results.append({
                "connector_type": connector_type,
                "success": False,
                "error": f"Unknown connector type: {connector_type}",
            })
            continue

        connector = connector_class(business_id, credentials)
        result = connector.run()
        results.append(result)

        if result["success"]:
            merged_data[connector_type] = result["data"]
            for field, value in result["data"].get("twin_mappings", {}).items():
                twin_updates[field] = value

    return {
        "business_id": business_id,
        "connectors_run": len(results),
        "connectors_succeeded": sum(1 for r in results if r["success"]),
        "results": results,
        "merged_data": merged_data,
        "twin_updates": twin_updates,
    }


def merge_connector_data_into_answers(
    answers: dict[str, Any],
    twin_updates: dict[str, Any]
) -> dict[str, Any]:
    """
    Merge connector-derived data into intake answers.
    Connector data takes priority over manual intake answers
    where it provides a more accurate verified value.
    Golden Rule 8: Accuracy Over Volume.
    """

    updated = dict(answers)

    field_map = {
        "sales.conversion_rate":              "conversion_rate",
        "operations.lead_response_quality":   "lead_response_quality",
        "growth.monthly_revenue":             "monthly_revenue",
        "growth.revenue_trend":               "revenue_trend",
        "growth.lead_volume":                 "lead_volume",
        "risk.revenue_concentration":         "revenue_concentration",
        "risk.cash_position":                 "cash_flow_stability",
        "ops.team_size":                      "team_size",
        "ops.capacity_utilisation":           "capacity_utilisation",
        "marketing.trust_infrastructure":     "trust_infrastructure",
        "growth.website_conversion_rate":     "website_conversion_rate",
        "growth.traffic_trend":               "traffic_trend",
    }

    for twin_field, answer_key in field_map.items():
        if twin_field in twin_updates:
            updated[answer_key] = twin_updates[twin_field]
            updated[f"{answer_key}_source"] = "connector_verified"

    return updated
