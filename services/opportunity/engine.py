"""
BEI Opportunity Engine — Phase 9
Converts verified constraints into quantified business opportunities.
Aligned with BEI Master Architecture Section 9 — Opportunity Engine.
Aligned with BEI Master Context Section 18 — Opportunity Philosophy.

Golden Rule 5: Opportunity Before Deployment.
Golden Rule 9: Business Impact Over Activity.
Golden Rule 10: Every Decision Must Be Explainable.
Golden Rule 12: Every Deployment Must Be Measurable.

Five opportunity dimensions:
1. Revenue Opportunity
2. Profit Opportunity
3. Capacity Opportunity
4. Risk Reduction Opportunity
5. Enterprise Value Opportunity

Every opportunity carries a confidence level.
Every opportunity carries a plain English explanation.
"""

from typing import Any


# ============================================================
# REVENUE MIDPOINTS
# Used to calculate opportunity values from revenue band.
# ============================================================

REVENUE_MIDPOINTS = {
    "Under £250k":   150000,
    "£250k - £500k": 375000,
    "£500k - £1M":   750000,
    "£1M - £3M":     2000000,
    "£3M - £10M":    6500000,
    "Over £10M":     15000000,
    "Under 250k":    150000,
    "default":       500000,
}


# ============================================================
# INDUSTRY IMPACT RATES
# Defines the opportunity impact rates per constraint per industry.
# Format: (low_rate, high_rate) as decimal fractions of annual revenue.
# ============================================================

IMPACT_RATES = {
    "trust_infrastructure_deficit": {
        "estate_agency":    {"dimension": "revenue",          "low": 0.04, "high": 0.10},
        "marketing_agency": {"dimension": "revenue",          "low": 0.03, "high": 0.08},
        "accountancy_firm": {"dimension": "revenue",          "low": 0.02, "high": 0.06},
        "default":          {"dimension": "revenue",          "low": 0.03, "high": 0.08},
    },
    "lead_response_deficit": {
        "estate_agency":    {"dimension": "revenue",          "low": 0.05, "high": 0.12},
        "marketing_agency": {"dimension": "revenue",          "low": 0.04, "high": 0.10},
        "accountancy_firm": {"dimension": "revenue",          "low": 0.02, "high": 0.05},
        "default":          {"dimension": "revenue",          "low": 0.03, "high": 0.09},
    },
    "pricing_constraint": {
        "estate_agency":    {"dimension": "profit",           "low": 0.05, "high": 0.12},
        "marketing_agency": {"dimension": "profit",           "low": 0.08, "high": 0.15},
        "accountancy_firm": {"dimension": "profit",           "low": 0.06, "high": 0.12},
        "default":          {"dimension": "profit",           "low": 0.05, "high": 0.12},
    },
    "staffing_inefficiency": {
        "estate_agency":    {"dimension": "profit",           "low": 0.03, "high": 0.08},
        "marketing_agency": {"dimension": "profit",           "low": 0.04, "high": 0.10},
        "accountancy_firm": {"dimension": "profit",           "low": 0.05, "high": 0.12},
        "default":          {"dimension": "profit",           "low": 0.03, "high": 0.08},
    },
    "management_bottleneck": {
        "estate_agency":    {"dimension": "capacity",         "low": 0.02, "high": 0.06},
        "marketing_agency": {"dimension": "capacity",         "low": 0.03, "high": 0.08},
        "accountancy_firm": {"dimension": "capacity",         "low": 0.03, "high": 0.07},
        "default":          {"dimension": "capacity",         "low": 0.02, "high": 0.06},
    },
    "capacity_constraint": {
        "estate_agency":    {"dimension": "capacity",         "low": 0.03, "high": 0.08},
        "marketing_agency": {"dimension": "capacity",         "low": 0.05, "high": 0.12},
        "accountancy_firm": {"dimension": "capacity",         "low": 0.04, "high": 0.10},
        "default":          {"dimension": "capacity",         "low": 0.03, "high": 0.09},
    },
    "founder_dependency": {
        "estate_agency":    {"dimension": "enterprise_value", "low": 0.10, "high": 0.25},
        "marketing_agency": {"dimension": "enterprise_value", "low": 0.15, "high": 0.30},
        "accountancy_firm": {"dimension": "enterprise_value", "low": 0.10, "high": 0.20},
        "default":          {"dimension": "enterprise_value", "low": 0.10, "high": 0.25},
    },
    "revenue_concentration_risk": {
        "estate_agency":    {"dimension": "risk_reduction",   "low": 0.08, "high": 0.20},
        "marketing_agency": {"dimension": "risk_reduction",   "low": 0.08, "high": 0.20},
        "accountancy_firm": {"dimension": "risk_reduction",   "low": 0.08, "high": 0.20},
        "default":          {"dimension": "risk_reduction",   "low": 0.08, "high": 0.20},
    },
    "offer_weakness": {
        "estate_agency":    {"dimension": "revenue",          "low": 0.03, "high": 0.08},
        "marketing_agency": {"dimension": "revenue",          "low": 0.05, "high": 0.12},
        "accountancy_firm": {"dimension": "revenue",          "low": 0.02, "high": 0.06},
        "default":          {"dimension": "revenue",          "low": 0.03, "high": 0.08},
    },
    "market_selection_risk": {
        "estate_agency":    {"dimension": "risk_reduction",   "low": 0.05, "high": 0.15},
        "marketing_agency": {"dimension": "risk_reduction",   "low": 0.05, "high": 0.15},
        "accountancy_firm": {"dimension": "risk_reduction",   "low": 0.05, "high": 0.15},
        "default":          {"dimension": "risk_reduction",   "low": 0.05, "high": 0.15},
    },
    "leadership_capacity_gap": {
        "estate_agency":    {"dimension": "enterprise_value", "low": 0.05, "high": 0.15},
        "marketing_agency": {"dimension": "enterprise_value", "low": 0.10, "high": 0.20},
        "accountancy_firm": {"dimension": "enterprise_value", "low": 0.08, "high": 0.18},
        "default":          {"dimension": "enterprise_value", "low": 0.06, "high": 0.16},
    },
    "succession_risk": {
        "estate_agency":    {"dimension": "enterprise_value", "low": 0.08, "high": 0.20},
        "marketing_agency": {"dimension": "enterprise_value", "low": 0.12, "high": 0.25},
        "accountancy_firm": {"dimension": "enterprise_value", "low": 0.10, "high": 0.22},
        "default":          {"dimension": "enterprise_value", "low": 0.08, "high": 0.20},
    },
    "technology_debt_risk": {
        "estate_agency":    {"dimension": "profit",           "low": 0.03, "high": 0.08},
        "marketing_agency": {"dimension": "profit",           "low": 0.04, "high": 0.10},
        "accountancy_firm": {"dimension": "profit",           "low": 0.05, "high": 0.12},
        "default":          {"dimension": "profit",           "low": 0.03, "high": 0.09},
    },
    "cyber_security_exposure": {
        "estate_agency":    {"dimension": "risk_reduction",   "low": 0.05, "high": 0.15},
        "marketing_agency": {"dimension": "risk_reduction",   "low": 0.05, "high": 0.15},
        "accountancy_firm": {"dimension": "risk_reduction",   "low": 0.08, "high": 0.20},
        "default":          {"dimension": "risk_reduction",   "low": 0.05, "high": 0.15},
    },
    "client_concentration_risk_enterprise": {
        "estate_agency":    {"dimension": "risk_reduction",   "low": 0.08, "high": 0.20},
        "marketing_agency": {"dimension": "risk_reduction",   "low": 0.08, "high": 0.20},
        "accountancy_firm": {"dimension": "risk_reduction",   "low": 0.08, "high": 0.20},
        "default":          {"dimension": "risk_reduction",   "low": 0.08, "high": 0.20},
    },
    "governance_maturity_gap": {
        "estate_agency":    {"dimension": "enterprise_value", "low": 0.04, "high": 0.10},
        "marketing_agency": {"dimension": "enterprise_value", "low": 0.04, "high": 0.10},
        "accountancy_firm": {"dimension": "enterprise_value", "low": 0.06, "high": 0.14},
        "default":          {"dimension": "enterprise_value", "low": 0.04, "high": 0.10},
    },
    "delivery_execution_gap": {
        "estate_agency":    {"dimension": "profit",           "low": 0.04, "high": 0.10},
        "marketing_agency": {"dimension": "profit",           "low": 0.05, "high": 0.12},
        "accountancy_firm": {"dimension": "profit",           "low": 0.06, "high": 0.14},
        "default":          {"dimension": "profit",           "low": 0.04, "high": 0.10},
    },
    "systematic_discounting_erosion": {
        "estate_agency":    {"dimension": "profit",           "low": 0.05, "high": 0.12},
        "marketing_agency": {"dimension": "profit",           "low": 0.06, "high": 0.15},
        "accountancy_firm": {"dimension": "profit",           "low": 0.04, "high": 0.10},
        "default":          {"dimension": "profit",           "low": 0.05, "high": 0.12},
    },
    "weak_gross_margin": {
        "estate_agency":    {"dimension": "profit",           "low": 0.04, "high": 0.10},
        "marketing_agency": {"dimension": "profit",           "low": 0.06, "high": 0.14},
        "accountancy_firm": {"dimension": "profit",           "low": 0.06, "high": 0.14},
        "default":          {"dimension": "profit",           "low": 0.04, "high": 0.10},
    },
    "profitability_erosion": {
        "estate_agency":    {"dimension": "profit",           "low": 0.06, "high": 0.15},
        "marketing_agency": {"dimension": "profit",           "low": 0.06, "high": 0.15},
        "accountancy_firm": {"dimension": "profit",           "low": 0.06, "high": 0.15},
        "default":          {"dimension": "profit",           "low": 0.06, "high": 0.15},
    },
    "cash_runway_risk": {
        "estate_agency":    {"dimension": "risk_reduction",   "low": 0.10, "high": 0.25},
        "marketing_agency": {"dimension": "risk_reduction",   "low": 0.10, "high": 0.25},
        "accountancy_firm": {"dimension": "risk_reduction",   "low": 0.08, "high": 0.20},
        "default":          {"dimension": "risk_reduction",   "low": 0.10, "high": 0.25},
    },
    "unfavourable_cac_ltv_ratio": {
        "estate_agency":    {"dimension": "profit",           "low": 0.04, "high": 0.10},
        "marketing_agency": {"dimension": "profit",           "low": 0.06, "high": 0.14},
        "accountancy_firm": {"dimension": "profit",           "low": 0.03, "high": 0.08},
        "default":          {"dimension": "profit",           "low": 0.04, "high": 0.10},
    },
    "excessive_leverage": {
        "estate_agency":    {"dimension": "risk_reduction",   "low": 0.08, "high": 0.20},
        "marketing_agency": {"dimension": "risk_reduction",   "low": 0.06, "high": 0.15},
        "accountancy_firm": {"dimension": "risk_reduction",   "low": 0.06, "high": 0.15},
        "default":          {"dimension": "risk_reduction",   "low": 0.06, "high": 0.15},
    },
    "revenue_growth_stagnation": {
        "estate_agency":    {"dimension": "revenue",          "low": 0.04, "high": 0.10},
        "marketing_agency": {"dimension": "revenue",          "low": 0.06, "high": 0.14},
        "accountancy_firm": {"dimension": "revenue",          "low": 0.03, "high": 0.08},
        "default":          {"dimension": "revenue",          "low": 0.04, "high": 0.10},
    },
}


# ============================================================
# DIMENSION EXPLANATIONS
# Plain English basis for each opportunity dimension.
# ============================================================

DIMENSION_EXPLANATIONS = {
    "revenue": (
        "Estimated additional annual revenue available by resolving this constraint. "
        "Based on typical conversion and growth improvements seen in similar businesses."
    ),
    "profit": (
        "Estimated annual profit improvement available by resolving this constraint. "
        "Based on margin recovery and cost efficiency improvements in similar businesses."
    ),
    "capacity": (
        "Estimated annual revenue capacity unlocked by resolving this constraint. "
        "Based on typical throughput improvements when capacity bottlenecks are removed."
    ),
    "risk_reduction": (
        "Estimated annual value at risk that could be protected by resolving this constraint. "
        "Based on the financial exposure from the identified risk and typical mitigation impact."
    ),
    "enterprise_value": (
        "Estimated improvement in business enterprise value available by resolving this constraint. "
        "Based on typical valuation multiples and the impact of this constraint on scalability."
    ),
}


def _get_base_revenue(revenue_band: str) -> int:
    return REVENUE_MIDPOINTS.get(revenue_band, REVENUE_MIDPOINTS["default"])


def _get_severity_multiplier(severity: str) -> float:
    return {"high": 1.5, "medium": 1.0, "low": 0.6}.get(severity, 1.0)


def _get_impact_rates(constraint_key: str, industry: str) -> dict:
    constraint_rates = IMPACT_RATES.get(constraint_key, {})
    return constraint_rates.get(industry, constraint_rates.get("default", {
        "dimension": "revenue", "low": 0.02, "high": 0.05
    }))


def _calculate_opportunity_values(
    base_revenue: int,
    rates: dict,
    severity: str,
) -> tuple[int, int]:
    multiplier = _get_severity_multiplier(severity)
    low = round((base_revenue * rates["low"] * multiplier) / 1000) * 1000
    high = round((base_revenue * rates["high"] * multiplier) / 1000) * 1000
    return low, high


def _build_opportunity_explanation(
    constraint_name: str,
    dimension: str,
    value_low: int,
    value_high: int,
    severity: str,
    industry: str,
    revenue_band: str,
) -> str:
    dimension_text = DIMENSION_EXPLANATIONS.get(dimension, "")
    severity_text = {
        "high": "The high severity of this constraint means the opportunity range is elevated.",
        "medium": "The medium severity of this constraint produces a moderate opportunity range.",
        "low": "The lower severity of this constraint produces a conservative opportunity range.",
    }.get(severity, "")

    return (
        f"Resolving '{constraint_name}' could unlock "
        f"£{value_low:,} to £{value_high:,} in {dimension} opportunity annually. "
        f"{dimension_text} "
        f"{severity_text} "
        f"Based on a revenue band of {revenue_band} for a business in the "
        f"{industry.replace('_', ' ')} sector. "
        f"This is an indicative estimate — actual impact will vary."
    )


def calculate_opportunities(
    verified_constraints: list[dict[str, Any]],
    twin: dict[str, Any],
    industry: str = "",
    revenue_band: str = "Under £250k",
) -> list[dict[str, Any]]:
    """
    Calculate opportunity values for all verified constraints.
    Returns constraints enriched with full opportunity data.
    Golden Rule 5: Opportunity Before Deployment.
    """

    base_revenue = _get_base_revenue(revenue_band)
    results = []

    for constraint in verified_constraints:
        key = constraint.get("key", "")
        name = constraint.get("name", "")
        severity = constraint.get("severity", "medium")
        verified = constraint.get("verified", False)

        rates = _get_impact_rates(key, industry)
        dimension = rates.get("dimension", "revenue")
        value_low, value_high = _calculate_opportunity_values(
            base_revenue, rates, severity
        )

        explanation = _build_opportunity_explanation(
            name, dimension, value_low, value_high,
            severity, industry, revenue_band
        )

        # Confidence level
        # MVP 1: all indicative (intake data only)
        # Future: low/medium/high with connector and outcome data
        confidence = "indicative"

        opportunity = {
            **constraint,
            "opportunity": {
                "dimension": dimension,
                "value_low": value_low,
                "value_high": value_high,
                "basis": DIMENSION_EXPLANATIONS.get(dimension, ""),
                "explanation": explanation,
                "confidence": confidence,
                "industry": industry,
                "revenue_band": revenue_band,
                "base_revenue": base_revenue,
                "severity_multiplier": _get_severity_multiplier(severity),
            },
        }

        results.append(opportunity)

    return results


def calculate_total_opportunity(
    opportunities: list[dict[str, Any]],
) -> dict[str, Any]:
    """
    Calculate the total opportunity across all verified constraints.
    Note: opportunities are not simply additive — resolving one
    often reduces others. Total is the primary constraint opportunity
    plus a fraction of secondary opportunities.
    """

    if not opportunities:
        return {
            "total_low": 0,
            "total_high": 0,
            "primary_low": 0,
            "primary_high": 0,
            "note": "No verified constraints found.",
        }

    verified = [o for o in opportunities if o.get("verified")]
    if not verified:
        return {
            "total_low": 0,
            "total_high": 0,
            "primary_low": 0,
            "primary_high": 0,
            "note": "No verified constraints found.",
        }

    primary = verified[0]
    primary_low = primary["opportunity"]["value_low"]
    primary_high = primary["opportunity"]["value_high"]

    # Secondary opportunities at 40% weight — avoid double counting
    secondary_low = sum(
        o["opportunity"]["value_low"] * 0.4
        for o in verified[1:4]
    )
    secondary_high = sum(
        o["opportunity"]["value_high"] * 0.4
        for o in verified[1:4]
    )

    total_low = round((primary_low + secondary_low) / 1000) * 1000
    total_high = round((primary_high + secondary_high) / 1000) * 1000

    return {
        "total_low": total_low,
        "total_high": total_high,
        "primary_low": primary_low,
        "primary_high": primary_high,
        "primary_dimension": primary["opportunity"]["dimension"],
        "constraint_count": len(verified),
        "note": (
            f"Total opportunity combines primary constraint "
            f"(£{primary_low:,}–£{primary_high:,}) with "
            f"secondary constraints at 40% weight to avoid double counting."
        ),
    }
