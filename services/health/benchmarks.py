"""
BEI Industry Benchmarks — Phase 4
Defines benchmark scores per industry for each health pillar.
Used to contextualise health scores against industry norms.
Aligned with BEI Master Architecture Section 11 — Business Health.
"""

INDUSTRY_BENCHMARKS = {
    "estate_agency": {
        "growth":     60,
        "operations": 55,
        "strategy":   50,
        "risk":       55,
        "context":    60,
        "overall":    56,
    },
    "marketing_agency": {
        "growth":     55,
        "operations": 50,
        "strategy":   60,
        "risk":       50,
        "context":    55,
        "overall":    54,
    },
    "accountancy_firm": {
        "growth":     50,
        "operations": 65,
        "strategy":   55,
        "risk":       65,
        "context":    55,
        "overall":    58,
    },
    "default": {
        "growth":     55,
        "operations": 55,
        "strategy":   55,
        "risk":       55,
        "context":    55,
        "overall":    55,
    },
}

INDUSTRY_PILLAR_WEIGHTS = {
    "estate_agency": {
        "growth":     0.30,
        "operations": 0.20,
        "strategy":   0.20,
        "risk":       0.15,
        "context":    0.15,
    },
    "marketing_agency": {
        "growth":     0.25,
        "operations": 0.20,
        "strategy":   0.30,
        "risk":       0.15,
        "context":    0.10,
    },
    "accountancy_firm": {
        "growth":     0.20,
        "operations": 0.30,
        "strategy":   0.20,
        "risk":       0.20,
        "context":    0.10,
    },
    "default": {
        "growth":     0.25,
        "operations": 0.20,
        "strategy":   0.20,
        "risk":       0.20,
        "context":    0.15,
    },
}


def get_benchmark(industry: str) -> dict:
    return INDUSTRY_BENCHMARKS.get(industry, INDUSTRY_BENCHMARKS["default"])


def get_weights(industry: str) -> dict:
    return INDUSTRY_PILLAR_WEIGHTS.get(industry, INDUSTRY_PILLAR_WEIGHTS["default"])


def vs_benchmark(score: int, benchmark: int) -> str:
    if score >= benchmark + 5:
        return "above"
    elif score <= benchmark - 5:
        return "below"
    return "at"


def score_to_band(score: int) -> str:
    if score >= 90:
        return "exceptional"
    elif score >= 70:
        return "strong"
    elif score >= 50:
        return "moderate"
    elif score >= 30:
        return "weak"
    return "critical"
