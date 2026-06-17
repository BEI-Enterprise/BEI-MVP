"""
BEI Business Health Engine — Phase 4 Update
Calculates five pillar scores with industry benchmarks and weighted scoring.
Aligned with BEI Master Architecture Section 11 — Business Health.
Health provides visibility. Health does not make decisions.
"""

from typing import Any
from services.health.benchmarks import get_benchmark, get_weights, vs_benchmark, score_to_band


def _score_option(value: str, scale: list[str]) -> float:
    """Score a value against a scale. Returns 0.0 to 1.0."""
    try:
        idx = scale.index(value)
        return idx / (len(scale) - 1)
    except ValueError:
        return 0.5


def calculate_health(twin: dict[str, Any], industry: str = "") -> dict[str, Any]:
    """
    Calculate Business Health scores from Business Twin.
    Returns five pillar scores, bands, benchmark comparison and overall health.
    """

    # Growth Pillar
    trend_score = _score_option(twin["revenue"]["trend"], [
        "Declining fast", "Declining slowly", "Stayed about the same",
        "Growing slowly", "Growing quickly"
    ])
    lead_score = _score_option(twin["marketing"]["lead_volume_band"], [
        "0-5", "6-20", "21-50", "51-100", "Over 100"
    ])
    conversion_score = _score_option(twin["sales"]["conversion_rate"], [
        "Less than 1 in 10", "1-2 in 10", "2-4 in 10",
        "4-6 in 10", "More than 6 in 10"
    ])
    growth_raw = round(((trend_score + lead_score + conversion_score) / 3) * 100)

    # Operations Pillar
    capacity_score = 1.0 - _score_option(twin["operations"]["capacity_utilisation"], [
        "Less than half", "About half to 70%", "70-85%",
        "85-95%", "Fully stretched"
    ])
    founder_score = _score_option(twin["risk"]["founder_dependency"], [
        "It would stop without me", "It would struggle a lot",
        "It would manage with some issues", "It would mostly be fine",
        "It would run smoothly without me"
    ])
    ops_raw = round(((capacity_score + founder_score) / 2) * 100)

    # Strategy Pillar
    pricing_score = _score_option(twin["sales"]["pricing_confidence"], [
        "Not confident at all", "A little unsure", "Fairly confident",
        "Very confident", "Completely confident"
    ])
    offer_score = _score_option(twin["sales"]["offer_clarity"], [
        "Not at all clear", "A bit confusing", "Reasonably clear",
        "Clear", "Crystal clear"
    ])
    position_score = _score_option(twin["marketing"]["market_position"], [
        "Pretty much the same as everyone else", "Slightly different",
        "Somewhat different", "Clearly different",
        "Nobody else offers what we do"
    ])
    strategy_raw = round(((pricing_score + offer_score + position_score) / 3) * 100)

    # Risk Pillar
    concentration_score = _score_option(twin["risk"]["revenue_concentration"], [
        "Most of it", "Three-fifths to four-fifths",
        "Two-fifths to three-fifths", "A fifth to two-fifths",
        "Less than a fifth"
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
    risk_raw = round(((concentration_score + trust_score + cashflow_score + keyperson_score) / 4) * 100)

    # Context Pillar
    market_score = _score_option(twin["marketing"]["market_growth"], [
        "Shrinking quickly", "Shrinking", "Staying flat",
        "Growing", "Growing quickly"
    ])
    competition_score = 1.0 - _score_option(twin["marketing"]["competition_intensity"], [
        "Very little", "A little", "A moderate amount",
        "A lot", "Intense competition"
    ])
    retention_score = _score_option(twin["risk"]["client_retention"], [
        "Under 50%", "50-65%", "65-80%", "80-90%", "Over 90%"
    ])
    context_raw = round(((market_score + competition_score + retention_score) / 3) * 100)

    # Apply industry weights
    weights = get_weights(industry)
    overall = round(
        growth_raw * weights["growth"] +
        ops_raw * weights["operations"] +
        strategy_raw * weights["strategy"] +
        risk_raw * weights["risk"] +
        context_raw * weights["context"]
    )

    # Benchmark comparison
    benchmarks = get_benchmark(industry)

    pillar_scores = {
        "growth": growth_raw,
        "operations": ops_raw,
        "strategy": strategy_raw,
        "risk": risk_raw,
        "context": context_raw,
    }

    pillars = {}
    for pillar, score in pillar_scores.items():
        benchmark = benchmarks[pillar]
        pillars[pillar] = {
            "score": score,
            "label": "Strong" if score >= 70 else "Moderate" if score >= 45 else "Needs Attention",
            "band": score_to_band(score),
            "benchmark": benchmark,
            "vs_benchmark": vs_benchmark(score, benchmark),
            "trend": "unknown",
        }

    industry_benchmark = benchmarks["overall"]

    return {
        "overall": overall,
        "band": score_to_band(overall),
        "vs_benchmark": vs_benchmark(overall, industry_benchmark),
        "industry_benchmark": industry_benchmark,
        "industry": industry or "default",
        "pillars": pillars,
        "weights_applied": weights,
    }
