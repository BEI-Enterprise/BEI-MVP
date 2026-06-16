"""
BEI Intelligence Orchestrator
Runs all engines in sequence to produce a complete intelligence output.
Aligned with BEI Master Architecture Intelligence Flow.
"""

from typing import Any
from services.twin.engine import build_twin
from services.health.engine import calculate_health
from services.detection.engine import detect_constraints
from services.verification.engine import verify_constraints
from services.opportunity.engine import calculate_opportunities
from services.decision.engine import select_primary_constraint


def run_intelligence(
    answers: dict[str, Any],
    business_id: str,
    industry: str,
    revenue_band: str
) -> dict[str, Any]:
    """
    Full BEI intelligence pipeline.
    Input: intake answers, business metadata
    Output: complete intelligence result
    """

    # Step 1 — Build Business Twin
    twin = build_twin(answers, business_id, industry, revenue_band)

    # Step 2 — Calculate Business Health
    health = calculate_health(twin)

    # Step 3 — Detect Constraints (hypotheses only)
    detected = detect_constraints(twin, health)

    # Step 4 — Verify Constraints (challenge framework)
    verified = verify_constraints(detected, twin, health)

    # Step 5 — Calculate Opportunities
    opportunities = calculate_opportunities(verified, twin)

    # Step 6 — Select Primary Constraint
    decision = select_primary_constraint(opportunities, health)

    return {
        "business_id": business_id,
        "industry": industry,
        "twin": twin,
        "health": health,
        "detected_count": len(detected),
        "verified_count": len([c for c in verified if c.get("verified")]),
        "primary_constraint": decision["primary_constraint"],
        "secondary_constraints": decision["secondary_constraints"],
        "unverified_flags": decision["unverified_flags"],
        "decision_explanation": decision["decision_explanation"],
        "confidence": decision["confidence"],
        "version": "BEI Intelligence v1.0",
    }
