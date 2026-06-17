"""
BEI Intelligence Orchestrator — Phase 3 Update
Runs all engines in sequence to produce a complete intelligence output.
Now includes Business Twin Builder — twin is built and stored.
Aligned with BEI Master Architecture Intelligence Flow.
"""

from typing import Any
from services.twin.engine import build_twin
from services.twin.builder import build_twin_record
from services.health.engine import calculate_health
from services.detection.engine import detect_constraints
from services.verification.engine import verify_constraints
from services.opportunity.engine import calculate_opportunities, calculate_total_opportunity
from services.decision.engine import select_primary_constraint
from services.network.engine import build_constraint_network
from services.deployment.engine import build_deployment_packages


def run_intelligence(
    answers: dict[str, Any],
    business_id: str,
    industry: str,
    revenue_band: str,
    connector_updates: dict[str, Any] = None
) -> dict[str, Any]:
    """
    Full BEI intelligence pipeline.
    Input: intake answers, business metadata, optional connector updates
    Output: complete intelligence result including structured twin record
    """

    connector_updates = connector_updates or {}

    # Step 1 — Build Business Twin (structured object for intelligence)
    twin = build_twin(answers, business_id, industry, revenue_band)

    # Step 1B — Build Twin Record (structured record for database)
    twin_record = build_twin_record(business_id, answers, revenue_band, connector_updates)

    # Step 2 — Calculate Business Health
    health = calculate_health(twin, industry)

    # Step 3 — Detect Constraints (hypotheses only)
    detected = detect_constraints(twin, health, industry)

    # Step 4 — Verify Constraints (challenge framework)
    verified = verify_constraints(detected, twin, health)

    # Step 5 — Calculate Opportunities
    opportunities = calculate_opportunities(verified, twin, industry, revenue_band)

    # Step 5B — Calculate Total Opportunity
    total_opportunity = calculate_total_opportunity(opportunities)

    # Step 6 — Build Constraint Network
    network = build_constraint_network(opportunities, health)

    # Step 7 — Select Primary Constraint
    decision = select_primary_constraint(opportunities, health, network, industry)

    return {
        "business_id": business_id,
        "industry": industry,
        "twin": twin,
        "twin_record": twin_record,
        "health": health,
        "detected_count": len(detected),
        "verified_count": len([c for c in verified if c.get("verified")]),
        "primary_constraint": decision["primary_constraint"],
        "secondary_constraints": decision["secondary_constraints"],
        "unverified_flags": decision["unverified_flags"],
        "decision_explanation": decision["decision_explanation"],
        "confidence": decision["confidence"],
        "decision_score": decision["decision_score"],
        "recommended_focus": decision["recommended_focus"],
        "decision_version": decision["decision_version"],
        "total_opportunity": total_opportunity,
        "twin_completeness": twin_record["completeness_score"],
        "twin_data_confidence": twin_record["data_confidence_score"],
        "version": "BEI Intelligence v1.0",
    }


def run_intelligence_with_deployment(
    answers: dict,
    business_id: str,
    industry: str,
    revenue_band: str,
    connector_updates: dict = None,
) -> dict:
    """
    Full BEI pipeline including deployment packages.
    Extends run_intelligence with deployment engine output.
    """
    result = run_intelligence(answers, business_id, industry, revenue_band, connector_updates)

    primary = result.get("primary_constraint")
    secondary = result.get("secondary_constraints", [])

    if primary:
        deployment_packages = build_deployment_packages(
            primary, secondary, business_id, industry
        )
        result["deployment_packages"] = deployment_packages
    else:
        result["deployment_packages"] = None

    return result
