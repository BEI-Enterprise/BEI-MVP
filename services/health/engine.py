"""
BEI Business Health Engine
Calculates five pillar scores and overall health from the Business Twin.
Aligned with BEI Master Architecture Section 11 — Business Health.
"""

from typing import Any


def _score_option(value: str, scale: list[str]) -> float:
    """Score a value against a scale. Returns 0.0 to 1.0."""
    try:
        idx = scale.index(value)
        return idx / (len(scale) - 1)
    except ValueError:
        return 0.5


def calculate_health(twin: dict[str, Any]) -> dict[str, Any]:
    """
    Calculate Business Health scores from Business Twin.
    Returns five pillar scores and overall health.
    """

    # Growth Pillar
    trend_score = _score_option(twin["revenue"]["trend"], [
        "Declining fast", "Declining slowly", "Stayed about the same", "Growing slowly", "Growing quickly"
    ])
    lead_score = _score_option(twin["marketing"]["lead_volume_band"], [
        "0-5", "6-20", "21-50", "51-100", "Over 100"
    ])
    conversion_score = _score_option(twin["sales"]["conversion_rate"], [
        "Less than 1 in 10", "1-2 in 10", "2-4 in 10", "4-6 in 10", "More than 6 in 10"
    ])
    growth_score = round(((trend_score + lead_score + conversion_score) / 3) * 100)

    # Operations Pillar
    capacity_score = 1.0 - _score_option(twin["operations"]["capacity_utilisation"], [
        "Less than half", "About half to 70%", "70-85%", "85-95%", "Fully stretched"
    ])
    founder_score = _score_option(twin["risk"]["founder_dependency"], [
        "It would stop without me", "It would struggle a lot",
        "It would manage with some issues", "It would mostly be fine",
        "It would run smoothly without me"
    ])
    ops_score = round(((capacity_score + founder_score) / 2) * 100)

    # Strategy Pillar
    pricing_score = _score_option(twin["sales"]["pricing_confidence"], [
        "Not confident at all", "A little unsure", "Fairly confident",
        "Very confident", "Completely confident"
    ])
    offer_score = _score_option(twin["sales"]["offer_clarity"], [
        "Not at all clear", "A bit confusing", "Reasonably clear", "Clear", "Crystal clear"
    ])
    position_score = _score_option(twin["marketing"]["market_position"], [
        "Pretty much the same as everyone else", "Slightly different",
        "Somewhat different", "Clearly different", "Nobody else offers what we do"
    ])
    strategy_score = round(((pricing_score + offer_score + position_score) / 3) * 100)

    # Risk Pillar
    concentration_score = _score_option(twin["risk"]["revenue_concentration"], [
        "Most of it", "Three-fifths to four-fifths", "Two-fifths to three-fifths",
        "A fifth to two-fifths", "Less than a fifth"
    ])
    trust_score = _score_option(twin["marketing"]["trust_infrastructure"], [
        "None", "Very little", "Some", "A good amount", "Plenty"
    ])
    cashflow_score = _score_option(twin["risk"]["cash_flow_stability"], [
        "Very unpredictable", "Unpredictable", "Okay, some swings",
        "Fairly steady", "Very steady"
    ])
    keyperson_score = _score_option(twin["risk"]["key_person_risk"], [
        "The business would likely fail", "Serious damage",
        "Noticeable impact", "Minor disruption", "Barely any impact"
    ])
    risk_score = round(((concentration_score + trust_score + cashflow_score + keyperson_score) / 4) * 100)

    # Context Pillar
    market_score = _score_option(twin["marketing"]["market_growth"], [
        "Shrinking quickly", "Shrinking", "Staying flat", "Growing", "Growing quickly"
    ])
    competition_score = 1.0 - _score_option(twin["marketing"]["competition_intensity"], [
        "Very little", "A little", "A moderate amount", "A lot", "Intense competition"
    ])
    retention_score = _score_option(twin["risk"]["client_retention"], [
        "Under 50%", "50-65%", "65-80%", "80-90%", "Over 90%"
    ])
    context_score = round(((market_score + competition_score + retention_score) / 3) * 100)

    overall = round((growth_score + ops_score + strategy_score + risk_score + context_score) / 5)

    def label(score: int) -> str:
        if score >= 70:
            return "Strong"
        elif score >= 45:
            return "Moderate"
        return "Needs Attention"

    return {
        "overall": overall,
        "pillars": {
            "growth": {"score": growth_score, "label": label(growth_score)},
            "operations": {"score": ops_score, "label": label(ops_score)},
            "strategy": {"score": strategy_score, "label": label(strategy_score)},
            "risk": {"score": risk_score, "label": label(risk_score)},
            "context": {"score": context_score, "label": label(context_score)},
        }
    }
