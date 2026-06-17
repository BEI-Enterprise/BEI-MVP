"""
BEI Decision Intelligence Engine — Phase 8
The brain of BEI. Selects the single Primary Constraint.
Aligned with BEI Master Architecture Section 8 — Decision Intelligence.
Aligned with BEI Master Context Section 16, 17.

Core Question:
Out of everything happening inside this business —
what matters most, why does it matter, what is it costing,
and what should happen next?

Golden Rule 2: Verification Before Recommendation.
Golden Rule 3: Root Causes Over Symptoms.
Golden Rule 4: One Primary Constraint.
Golden Rule 8: Accuracy Over Volume.
Golden Rule 9: Business Impact Over Activity.
Golden Rule 10: Every Decision Must Be Explainable.
"""

from typing import Any


# ============================================================
# INDUSTRY PRIORITY WEIGHTS
# Certain constraints carry more weight in specific industries.
# Reflects real-world impact patterns per sector.
# ============================================================

INDUSTRY_CONSTRAINT_WEIGHT = {
    "estate_agency": {
        "trust_infrastructure_deficit": 1.4,
        "lead_response_deficit": 1.3,
        "founder_dependency": 1.1,
        "pricing_constraint": 1.0,
        "capacity_constraint": 1.0,
        "offer_weakness": 1.0,
        "revenue_concentration_risk": 0.9,
        "staffing_inefficiency": 0.8,
        "management_bottleneck": 0.8,
        "market_selection_risk": 0.7,
    },
    "marketing_agency": {
        "founder_dependency": 1.4,
        "capacity_constraint": 1.3,
        "offer_weakness": 1.3,
        "pricing_constraint": 1.2,
        "staffing_inefficiency": 1.1,
        "revenue_concentration_risk": 1.0,
        "trust_infrastructure_deficit": 0.9,
        "lead_response_deficit": 0.9,
        "management_bottleneck": 0.8,
        "market_selection_risk": 0.7,
    },
    "accountancy_firm": {
        "capacity_constraint": 1.4,
        "staffing_inefficiency": 1.3,
        "founder_dependency": 1.2,
        "revenue_concentration_risk": 1.1,
        "pricing_constraint": 1.0,
        "offer_weakness": 1.0,
        "trust_infrastructure_deficit": 0.9,
        "management_bottleneck": 0.9,
        "lead_response_deficit": 0.7,
        "market_selection_risk": 0.6,
    },
    "default": {
        "trust_infrastructure_deficit": 1.0,
        "lead_response_deficit": 1.0,
        "pricing_constraint": 1.0,
        "staffing_inefficiency": 1.0,
        "management_bottleneck": 1.0,
        "capacity_constraint": 1.0,
        "founder_dependency": 1.0,
        "revenue_concentration_risk": 1.0,
        "offer_weakness": 1.0,
        "market_selection_risk": 1.0,
    },
}


def _get_industry_weight(constraint_key: str, industry: str) -> float:
    weights = INDUSTRY_CONSTRAINT_WEIGHT.get(
        industry, INDUSTRY_CONSTRAINT_WEIGHT["default"]
    )
    return weights.get(constraint_key, 1.0)


def _calculate_decision_score(
    constraint: dict,
    network: dict,
    health: dict,
    industry: str,
) -> float:
    """
    Calculate composite decision score for a constraint.
    Combines verification, network, health and industry factors.
    Higher score = stronger case for Primary Constraint selection.
    """

    key = constraint.get("key", "")

    # Factor 1 — Verification score (0-30 points)
    # Reflects how certain we are this constraint is real
    verification = constraint.get("verification_score", 0)
    verification_points = (verification / 100) * 30

    # Factor 2 — Network dominance (0-25 points)
    # Reflects how much of the business this constraint affects
    network_nodes = {n["key"]: n for n in network.get("nodes", [])}
    network_node = network_nodes.get(key, {})
    dominance = network_node.get("dominance_score", 0)
    dominance_points = (dominance / 100) * 25

    # Factor 3 — Root cause status (0-20 points)
    # Root causes score higher than symptoms
    is_root = constraint.get("is_root_cause", False)
    root_points = 20 if is_root else 5

    # Factor 4 — Cascade depth (0-10 points)
    # Constraints that cause other constraints score higher
    cascade_depth = network_node.get("cascade_depth", 0)
    cascade_points = min(10, cascade_depth * 5)

    # Factor 5 — Health pillar deficit (0-10 points)
    # Constraints affecting weak pillars score higher
    pillar_map = {
        "trust_infrastructure_deficit": "risk",
        "lead_response_deficit": "growth",
        "pricing_constraint": "strategy",
        "staffing_inefficiency": "operations",
        "management_bottleneck": "operations",
        "capacity_constraint": "operations",
        "founder_dependency": "strategy",
        "revenue_concentration_risk": "risk",
        "offer_weakness": "strategy",
        "market_selection_risk": "context",
    }
    pillar = pillar_map.get(key, "growth")
    pillar_score = health["pillars"].get(pillar, {}).get("score", 50)
    pillar_benchmark = health["pillars"].get(pillar, {}).get("benchmark", 55)
    pillar_deficit = max(0, pillar_benchmark - pillar_score)
    pillar_points = min(10, (pillar_deficit / 100) * 20)

    # Factor 6 — Severity (0-5 points)
    severity = constraint.get("severity", "medium")
    severity_points = {"high": 5, "medium": 3, "low": 1}.get(severity, 3)

    # Raw score
    raw_score = (
        verification_points
        + dominance_points
        + root_points
        + cascade_points
        + pillar_points
        + severity_points
    )

    # Apply industry weight multiplier
    industry_weight = _get_industry_weight(key, industry)
    final_score = raw_score * industry_weight

    return round(final_score, 2)


def _build_recommended_focus(
    primary: dict,
    network: dict,
    industry: str,
) -> str:
    """
    Build a plain English recommended focus statement.
    This is what the business should concentrate on.
    Not a deployment instruction — a strategic focus directive.
    """

    name = primary["name"]
    key = primary.get("key", "")
    severity = primary.get("severity", "medium").upper()

    focus_map = {
        "trust_infrastructure_deficit": (
            "Focus on building your trust infrastructure before investing in lead generation. "
            "Collect reviews, build case studies and create visible proof that you deliver results. "
            "New leads will not convert until they can see evidence that you can be trusted."
        ),
        "lead_response_deficit": (
            "Focus on your lead response process. "
            "Every enquiry must be responded to within 1 hour during business hours. "
            "Build a system — not a habit — so speed is guaranteed regardless of who is available."
        ),
        "pricing_constraint": (
            "Focus on understanding and owning your pricing. "
            "Research what your best clients pay elsewhere. "
            "Test higher price points with new enquiries before changing existing clients. "
            "Pricing uncertainty costs you money every single day."
        ),
        "staffing_inefficiency": (
            "Focus on identifying exactly where delivery time is being wasted. "
            "Map your delivery process step by step. "
            "Find the tasks that should not require your most expensive people. "
            "Delegate or systematise the lowest-value work first."
        ),
        "management_bottleneck": (
            "Focus on removing yourself from the daily management loop. "
            "Identify the three decisions your team makes daily that should not need you. "
            "Build a decision framework so your team can act without waiting for approval."
        ),
        "capacity_constraint": (
            "Focus on capacity before taking on new clients. "
            "Either create capacity by removing low-value work or low-value clients, "
            "or build the case for hiring before you are at full stretch — not after."
        ),
        "founder_dependency": (
            "Focus on systematising the three things only you can currently do. "
            "Document the process. Train someone. Test the handover. "
            "The business cannot scale until it can operate without you being the bottleneck."
        ),
        "revenue_concentration_risk": (
            "Focus on reducing client concentration risk. "
            "Set a target that no single client should represent more than 20% of revenue. "
            "Prioritise new business development specifically targeting diversification."
        ),
        "offer_weakness": (
            "Focus on making your offer immediately clear to a stranger. "
            "If someone cannot understand what you do, who it is for and why it matters "
            "within 10 seconds of seeing your website, your offer needs work. "
            "Clarity converts. Confusion does not."
        ),
        "market_selection_risk": (
            "Focus on identifying whether your current market can support your growth targets. "
            "If the market is shrinking, either find a defensible niche within it "
            "or begin positioning for adjacent markets before the decline accelerates."
        ),
    }

    return focus_map.get(key, f"Focus on resolving '{name}' as the primary constraint on business performance.")


def _build_decision_explanation(
    primary: dict,
    secondary: list,
    unverified: list,
    decision_score: float,
    network: dict,
    industry: str,
    confidence: str,
) -> str:
    """
    Build a full plain English decision explanation.
    Golden Rule 10: Every Decision Must Be Explainable.
    """

    name = primary["name"]
    key = primary.get("key", "")
    network_nodes = {n["key"]: n for n in network.get("nodes", [])}
    node = network_nodes.get(key, {})

    parts = []

    # Why this constraint was selected
    parts.append(
        f"'{name}' has been identified as the Primary Constraint for this business."
    )

    # Verification status
    parts.append(
        f"It passed all {primary['tests_passed']} of {primary['total_tests']} "
        f"verification tests with a verification score of "
        f"{primary['verification_score']}/100."
    )

    # Root cause status
    if primary.get("is_root_cause"):
        parts.append(
            "It is a root cause constraint — not a symptom of a deeper issue."
        )

    # Network influence
    dominance = node.get("dominance_score", 0)
    cascade = node.get("cascade_chain", [])
    if dominance > 0:
        parts.append(
            f"Its network dominance score is {dominance}/100, "
            f"meaning it has significant influence across multiple areas of the business."
        )
    if cascade:
        parts.append(
            f"It is likely causing or contributing to: "
            f"{', '.join(cascade)}."
        )

    # Industry relevance
    weight = _get_industry_weight(key, industry)
    if weight >= 1.3:
        parts.append(
            f"This constraint carries elevated importance for businesses in your sector."
        )

    # Why others were not selected as primary
    if secondary:
        runner_up = secondary[0]
        parts.append(
            f"'{runner_up['name']}' was identified as the next highest priority "
            f"but ranked second because "
            + (
                "it may be a downstream symptom of the primary constraint."
                if not runner_up.get("is_root_cause")
                else "the primary constraint has greater network influence and industry relevance."
            )
        )

    # Unverified note
    if unverified:
        parts.append(
            f"{len(unverified)} additional signal(s) were detected but did not pass "
            f"verification and will not influence this recommendation."
        )

    # Confidence
    parts.append(
        f"Overall decision confidence: {confidence.upper()}."
    )

    return " ".join(parts)


def select_primary_constraint(
    opportunities: list[dict[str, Any]],
    health: dict[str, Any],
    network: dict[str, Any] = None,
    industry: str = "",
) -> dict[str, Any]:
    """
    Select the single Primary Constraint.
    The brain of BEI.

    Steps:
    1. Filter to verified constraints only
    2. Prefer root causes over symptoms
    3. Score each constraint using composite decision score
    4. Select highest scoring as Primary
    5. Rank remaining as Secondary (max 3)
    6. Build full explanation
    7. Generate recommended focus
    8. Return complete decision package
    """

    network = network or {}
    verified = [c for c in opportunities if c.get("verified")]
    unverified = [c for c in opportunities if not c.get("verified")]

    if not verified:
        return {
            "primary_constraint": None,
            "secondary_constraints": [],
            "unverified_flags": unverified,
            "decision_score": 0,
            "decision_explanation": (
                "No constraints passed verification. "
                "No primary constraint selected. "
                "Golden Rule 2 enforced — no recommendation without verification."
            ),
            "recommended_focus": (
                "Review the verification results to understand why constraints "
                "did not pass. Consider gathering more data before proceeding."
            ),
            "confidence": "none",
            "decision_version": "v1.0",
            "network_used": bool(network),
        }

    # Separate root causes from symptoms
    root_causes = [c for c in verified if c.get("is_root_cause")]
    symptoms = [c for c in verified if not c.get("is_root_cause")]

    # Score all verified constraints
    scored = []
    for constraint in verified:
        score = _calculate_decision_score(constraint, network, health, industry)
        scored.append((score, constraint))

    # Sort by decision score
    scored.sort(key=lambda x: x[0], reverse=True)

    # Primary = highest scoring verified constraint
    # Strong preference for root causes — if root cause within 15% of top symptom, root cause wins
    primary_score, primary = scored[0]

    if not primary.get("is_root_cause") and root_causes:
        # Check if a root cause is close enough to take priority
        for score, candidate in scored[1:]:
            if candidate.get("is_root_cause") and score >= primary_score * 0.85:
                primary_score = score
                primary = candidate
                break

    secondary = [
        c for s, c in scored
        if c["key"] != primary["key"]
    ][:3]

    # Confidence level
    confidence = (
        "high" if primary["verification_score"] >= 80
        else "medium" if primary["verification_score"] >= 60
        else "low"
    )

    # Build explanation and recommended focus
    explanation = _build_decision_explanation(
        primary, secondary, unverified, primary_score, network, industry, confidence
    )
    recommended_focus = _build_recommended_focus(primary, network, industry)

    return {
        "primary_constraint": primary,
        "secondary_constraints": secondary,
        "unverified_flags": unverified,
        "decision_score": primary_score,
        "decision_explanation": explanation,
        "recommended_focus": recommended_focus,
        "confidence": confidence,
        "decision_version": "v1.0",
        "network_used": bool(network),
    }
