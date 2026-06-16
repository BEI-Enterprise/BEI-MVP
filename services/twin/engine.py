"""
BEI Business Twin Engine
Builds a structured digital twin from intake form answers.
Aligned with BEI Master Architecture Section 2 — Business Twin.
"""

from typing import Any


REVENUE_MIDPOINTS = {
    "Under £250k": 150000,
    "£250k - £500k": 375000,
    "£500k - £1M": 750000,
    "£1M - £3M": 2000000,
    "£3M - £10M": 6500000,
    "Over £10M": 15000000,
}


def build_twin(answers: dict[str, Any], business_id: str, industry: str, revenue_band: str) -> dict[str, Any]:
    """
    Build a Business Twin from intake answers.
    Returns a structured twin object aligned with the Master Architecture.
    """

    twin = {
        "business_id": business_id,
        "industry": industry,

        # Revenue sub-twin
        "revenue": {
            "band": revenue_band,
            "estimated_annual": REVENUE_MIDPOINTS.get(revenue_band, 500000),
            "monthly_band": answers.get("monthly_revenue", ""),
            "trend": answers.get("revenue_trend", ""),
        },

        # Marketing sub-twin
        "marketing": {
            "lead_volume_band": answers.get("lead_volume", ""),
            "trust_infrastructure": answers.get("trust_infrastructure", ""),
            "market_position": answers.get("market_position", ""),
            "market_growth": answers.get("market_growth", ""),
            "competition_intensity": answers.get("competition_intensity", ""),
        },

        # Sales sub-twin
        "sales": {
            "conversion_rate": answers.get("conversion_rate", ""),
            "avg_client_value": answers.get("avg_client_value", ""),
            "pricing_confidence": answers.get("pricing_confidence", ""),
            "offer_clarity": answers.get("offer_clarity", ""),
        },

        # Operations sub-twin
        "operations": {
            "team_size": answers.get("team_size", ""),
            "capacity_utilisation": answers.get("capacity_utilisation", ""),
            "delivery_bottleneck": answers.get("delivery_bottleneck", ""),
        },

        # Risk sub-twin
        "risk": {
            "founder_dependency": answers.get("founder_dependency", ""),
            "revenue_concentration": answers.get("revenue_concentration", ""),
            "key_person_risk": answers.get("key_person_risk", ""),
            "cash_flow_stability": answers.get("cash_flow_stability", ""),
            "client_retention": answers.get("client_retention", ""),
        },

        # Context sub-twin
        "context": {
            "biggest_challenge": answers.get("biggest_challenge", ""),
        },
    }

    return twin
