"""
BEI Business Twin Builder — Phase 3
Builds and persists a full Business Twin from intake answers + connector data.
Aligned with BEI Master Architecture Section 2 — Business Twin.
Writes to business_twins table in Supabase.
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

REVENUE_MONTHLY_MIDPOINTS = {
    "Under £10k": 7500,
    "£10k-£25k": 17500,
    "£25k-£50k": 37500,
    "£50k-£100k": 75000,
    "£100k-£250k": 175000,
    "Over £250k": 350000,
}


def _map_revenue_trend(val: str) -> str:
    mapping = {
        "Growing quickly": "growing",
        "Growing slowly": "growing",
        "Stayed about the same": "stable",
        "Declining slowly": "declining",
        "Declining fast": "declining",
    }
    return mapping.get(val, "unknown")


def _map_founder_dependency(val: str) -> str:
    mapping = {
        "It would stop without me": "critical",
        "It would struggle a lot": "high",
        "It would manage with some issues": "medium",
        "It would mostly be fine": "low",
        "It would run smoothly without me": "low",
    }
    return mapping.get(val, "unknown")


def _map_market_position(val: str) -> str:
    mapping = {
        "Nobody else offers what we do": "leader",
        "Clearly different": "challenger",
        "Somewhat different": "challenger",
        "Slightly different": "follower",
        "Pretty much the same as everyone else": "follower",
    }
    return mapping.get(val, "unknown")


def _map_offer_clarity(val: str) -> str:
    mapping = {
        "Crystal clear": "clear",
        "Clear": "clear",
        "Reasonably clear": "moderate",
        "A bit confusing": "unclear",
        "Not at all clear": "unclear",
    }
    return mapping.get(val, "unknown")


def _map_pricing_strength(val: str) -> str:
    mapping = {
        "Completely confident": "strong",
        "Very confident": "strong",
        "Fairly confident": "moderate",
        "A little unsure": "weak",
        "Not confident at all": "weak",
    }
    return mapping.get(val, "unknown")


def _map_revenue_concentration(val: str) -> str:
    mapping = {
        "Most of it": "critical",
        "Three-fifths to four-fifths": "concentrated",
        "Two-fifths to three-fifths": "moderate",
        "A fifth to two-fifths": "moderate",
        "Less than a fifth": "diversified",
    }
    return mapping.get(val, "unknown")


def _map_cash_position(val: str) -> str:
    mapping = {
        "Very steady": "strong",
        "Fairly steady": "adequate",
        "Okay, some swings": "adequate",
        "Unpredictable": "tight",
        "Very unpredictable": "critical",
    }
    return mapping.get(val, "unknown")


def _map_key_person_risk(val: str) -> str:
    mapping = {
        "Barely any impact": "low",
        "Minor disruption": "low",
        "Noticeable impact": "medium",
        "Serious damage": "high",
        "The business would likely fail": "critical",
    }
    return mapping.get(val, "unknown")


def _map_market_conditions(val: str) -> str:
    mapping = {
        "Growing quickly": "favourable",
        "Growing": "favourable",
        "Staying flat": "neutral",
        "Shrinking": "challenging",
        "Shrinking quickly": "challenging",
    }
    return mapping.get(val, "unknown")


def _extract_lead_volume(val: str) -> int:
    mapping = {
        "0-5": 3,
        "6-20": 13,
        "21-50": 35,
        "51-100": 75,
        "Over 100": 120,
    }
    return mapping.get(val, 0)


def _extract_conversion_rate(val: str) -> float:
    mapping = {
        "Less than 1 in 10": 0.07,
        "1-2 in 10": 0.15,
        "2-4 in 10": 0.30,
        "4-6 in 10": 0.50,
        "More than 6 in 10": 0.70,
    }
    return mapping.get(val, 0.0)


def _extract_team_size(val: str) -> int:
    mapping = {
        "Just me": 1,
        "2-5": 3,
        "6-10": 8,
        "11-25": 18,
        "26-50": 38,
        "Over 50": 60,
    }
    return mapping.get(val, 0)


def _extract_retention_rate(val: str) -> float:
    mapping = {
        "Under 50%": 0.45,
        "50-65%": 0.57,
        "65-80%": 0.72,
        "80-90%": 0.85,
        "Over 90%": 0.93,
    }
    return mapping.get(val, 0.0)


def _calculate_completeness(twin_record: dict) -> int:
    """Calculate what percentage of twin fields are populated."""
    key_fields = [
        "growth_revenue_monthly",
        "growth_revenue_trend",
        "growth_lead_volume",
        "growth_conversion_rate",
        "growth_trust_score",
        "ops_team_size",
        "ops_capacity_utilisation",
        "strategy_market_position",
        "strategy_pricing_strength",
        "strategy_offer_clarity",
        "strategy_founder_dependency",
        "risk_revenue_concentration",
        "risk_cash_position",
        "risk_client_retention_rate",
        "context_market_conditions",
    ]
    populated = sum(1 for f in key_fields if twin_record.get(f) is not None)
    return round((populated / len(key_fields)) * 100)


def build_twin_record(
    business_id: str,
    answers: dict[str, Any],
    revenue_band: str,
    connector_updates: dict[str, Any] = None
) -> dict[str, Any]:
    """
    Build a complete Business Twin record from intake answers
    and optional connector data.
    Returns a dict ready to upsert into business_twins table.
    """

    connector_updates = connector_updates or {}

    # Revenue estimates
    monthly_revenue = REVENUE_MONTHLY_MIDPOINTS.get(
        answers.get("monthly_revenue", ""), 0
    )
    annual_revenue = REVENUE_MIDPOINTS.get(revenue_band, 500000)

    # Conversion rate — prefer connector data
    conversion_rate = _extract_conversion_rate(
        connector_updates.get("sales.conversion_rate") or
        answers.get("conversion_rate", "")
    )

    # Trust score — derive from review count if available
    google_review_count = connector_updates.get("marketing.google_review_count", 0)
    google_rating = connector_updates.get("marketing.google_rating", 0)
    trust_score = min(100, int((google_review_count / 50) * 50 + (google_rating / 5) * 50)) if google_review_count else 20

    twin_record = {
        "business_id": business_id,
        "status": "complete",

        # Growth sub-twin
        "growth_revenue_monthly": monthly_revenue or None,
        "growth_revenue_annual": annual_revenue or None,
        "growth_revenue_trend": _map_revenue_trend(answers.get("revenue_trend", "")),
        "growth_lead_volume": _extract_lead_volume(answers.get("lead_volume", "")),
        "growth_conversion_rate": conversion_rate or None,
        "growth_avg_deal_value": None,
        "growth_review_score": google_rating or None,
        "growth_review_count": google_review_count or None,
        "growth_trust_score": trust_score,

        # Operations sub-twin
        "ops_team_size": _extract_team_size(answers.get("team_size", "")),
        "ops_capacity_utilisation": None,
        "ops_process_maturity": "basic",
        "ops_crm_in_use": False,

        # Strategy sub-twin
        "strategy_market_position": _map_market_position(answers.get("market_position", "")),
        "strategy_pricing_strength": _map_pricing_strength(answers.get("pricing_confidence", "")),
        "strategy_offer_clarity": _map_offer_clarity(answers.get("offer_clarity", "")),
        "strategy_founder_dependency": _map_founder_dependency(answers.get("founder_dependency", "")),

        # Risk sub-twin
        "risk_revenue_concentration": _map_revenue_concentration(answers.get("revenue_concentration", "")),
        "risk_key_person_dependency": _map_key_person_risk(answers.get("key_person_risk", "")),
        "risk_cash_position": _map_cash_position(answers.get("cash_flow_stability", "")),
        "risk_client_retention_rate": _extract_retention_rate(answers.get("client_retention", "")),

        # Context sub-twin
        "context_market_conditions": _map_market_conditions(answers.get("market_growth", "")),
        "context_business_stage": "unknown",
        "context_primary_objective": "unknown",

        # Metadata
        "data_confidence_score": 60,
    }

    # Calculate completeness
    twin_record["completeness_score"] = _calculate_completeness(twin_record)

    # Boost confidence if connector data present
    if connector_updates:
        twin_record["data_confidence_score"] = min(85, twin_record["data_confidence_score"] + 25)

    return twin_record
