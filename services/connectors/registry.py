"""
BEI Connector Registry
Manages all connectors for a business.
Runs connectors, merges data into Business Twin.
Aligned with BEI Master Architecture — Connector Layer.
"""

from typing import Any
from services.connectors.google_business import GoogleBusinessConnector
from services.connectors.crm_webhook import CRMWebhookConnector


CONNECTOR_MAP = {
    "google_business_profile": GoogleBusinessConnector,
    "crm_webhook": CRMWebhookConnector,
}


def run_connectors(
    business_id: str,
    connector_configs: list[dict[str, Any]]
) -> dict[str, Any]:
    """
    Run all configured connectors for a business.
    Returns merged normalised data and connector statuses.
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
            # Collect twin field updates
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
    where it provides a more accurate value.
    """

    updated = dict(answers)

    field_map = {
        "marketing.trust_infrastructure": "trust_infrastructure",
        "sales.conversion_rate": "conversion_rate",
        "operations.lead_response_quality": "lead_response_quality",
    }

    for twin_field, answer_key in field_map.items():
        if twin_field in twin_updates:
            updated[answer_key] = twin_updates[twin_field]
            updated[f"{answer_key}_source"] = "connector"

    return updated
