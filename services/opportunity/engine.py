"""
BEI Opportunity Engine
Converts verified constraints into quantified opportunity values.
Aligned with BEI Master Architecture Section 9 — Opportunity Engine.
Golden Rule 5: Opportunity Before Deployment.
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

CONSTRAINT_IMPACT_RATES = {
    "trust_infrastructure_deficit":  {"low": 0.03, "high": 0.08, "dimension": "revenue"},
    "lead_response_deficit":         {"low": 0.04, "high": 0.10, "dimension": "revenue"},
    "pricing_constraint":            {"low": 0.05, "high": 0.12, "dimension": "profit"},
    "capacity_constraint":           {"low": 0.03, "high": 0.08, "dimension": "capacity"},
    "founder_dependency":            {"low": 0.02, "high": 0.06, "dimension": "enterprise_value"},
    "revenue_concentration_risk":    {"low": 0.03, "high": 0.08, "dimension": "risk_reduction"},
    "offer_weakness":                {"low": 0.03, "high": 0.07, "dimension": "revenue"},
    "market_selection_risk":         {"low": 0.02, "high": 0.05, "dimension": "risk_reduction"},
    "management_bottleneck":         {"low": 0.02, "high": 0.06, "dimension": "capacity"},
    "staffing_inefficiency":         {"low": 0.02, "high": 0.05, "dimension": "capacity"},
}


def calculate_opportunities(
    verified_constraints: list[dict[str, Any]],
    twin: dict[str, Any]
) -> list[dict[str, Any]]:
    """
    Calculate opportunity value for each verified constraint.
    Returns constraints enriched with opportunity data.
    """

    revenue_band = twin["revenue"]["band"]
    base_revenue = REVENUE_MIDPOINTS.get(revenue_band, 500000)

    opportunities = []

    for constraint in verified_constraints:
        key = constraint["key"]
        rates = CONSTRAINT_IMPACT_RATES.get(key, {"low": 0.02, "high": 0.05, "dimension": "revenue"})

        severity_multiplier = {
            "high": 1.5,
            "medium": 1.0,
            "low": 0.5,
        }.get(constraint.get("severity", "medium"), 1.0)

        opportunity_low = round((base_revenue * rates["low"] * severity_multiplier) / 1000) * 1000
        opportunity_high = round((base_revenue * rates["high"] * severity_multiplier) / 1000) * 1000

        opportunity = {
            **constraint,
            "opportunity": {
                "dimension": rates["dimension"],
                "value_low": opportunity_low,
                "value_high": opportunity_high,
                "basis": f"Estimated {rates['dimension']} impact based on {revenue_band} revenue band.",
                "confidence": "indicative" if not constraint.get("verified") else "low",
            }
        }

        opportunities.append(opportunity)

    return opportunities
