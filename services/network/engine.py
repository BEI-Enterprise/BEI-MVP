"""
BEI Constraint Network Engine — Phase 7
Maps relationships between verified constraints.
Calculates dominance scores, cascade chains, root cause confidence.
Aligned with BEI Master Architecture Sections 14, 15.

Objective: Locate the deepest bottleneck, not the most visible one.
Golden Rule 3: Root Causes Over Symptoms.
Golden Rule 10: Every Decision Must Be Explainable.
"""

from typing import Any


# ============================================================
# CONSTRAINT RELATIONSHIP DEFINITIONS
# Defines the known causal and linked relationships
# between all 10 MVP constraints.
# ============================================================

CONSTRAINT_CHILDREN = {
    "founder_dependency": [
        "management_bottleneck",
        "capacity_constraint",
    ],
    "trust_infrastructure_deficit": [
        "lead_response_deficit",
    ],
    "offer_weakness": [
        "lead_response_deficit",
    ],
    "staffing_inefficiency": [
        "capacity_constraint",
    ],
    "pricing_constraint": [],
    "lead_response_deficit": [],
    "management_bottleneck": [],
    "capacity_constraint": [],
    "revenue_concentration_risk": [],
    "market_selection_risk": [],
}

CONSTRAINT_LINKED = {
    "trust_infrastructure_deficit": ["offer_weakness"],
    "offer_weakness": ["pricing_constraint", "trust_infrastructure_deficit"],
    "pricing_constraint": ["offer_weakness", "revenue_concentration_risk"],
    "revenue_concentration_risk": ["capacity_constraint", "pricing_constraint"],
    "market_selection_risk": ["revenue_concentration_risk", "pricing_constraint"],
    "founder_dependency": ["staffing_inefficiency"],
    "staffing_inefficiency": ["founder_dependency", "capacity_constraint"],
    "capacity_constraint": ["staffing_inefficiency"],
    "lead_response_deficit": ["trust_infrastructure_deficit", "offer_weakness"],
    "management_bottleneck": ["founder_dependency"],
}

# Pillar mapping for network impact scoring
CONSTRAINT_PILLAR = {
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


def _get_active_children(
    constraint_key: str,
    all_verified_keys: list[str],
) -> list[str]:
    """Return children of this constraint that are also detected."""
    children = CONSTRAINT_CHILDREN.get(constraint_key, [])
    return [c for c in children if c in all_verified_keys]


def _get_active_linked(
    constraint_key: str,
    all_verified_keys: list[str],
) -> list[str]:
    """Return linked constraints that are also detected."""
    linked = CONSTRAINT_LINKED.get(constraint_key, [])
    return [l for l in linked if l in all_verified_keys]


def _calculate_dominance_score(
    constraint: dict,
    active_children: list[str],
    active_linked: list[str],
    all_verified: list[dict],
) -> int:
    """
    Calculate how much network influence this constraint has.
    Higher dominance = more of the business is affected by this constraint.
    """
    score = 0

    # Root cause bonus — no parents in active constraints
    is_root = constraint.get("is_root_cause", False)
    if is_root:
        score += 20

    # Each active child adds significant weight
    score += len(active_children) * 15

    # Each active linked constraint adds moderate weight
    score += len(active_linked) * 5

    # Verification score contribution (max 20)
    verification_contribution = round((constraint.get("verification_score", 0) / 100) * 20)
    score += verification_contribution

    # Detection score contribution (max 10)
    detection_contribution = round((constraint.get("detection_score", 0) / 10) * 10)
    score += detection_contribution

    # Severity bonus
    severity = constraint.get("severity", "medium")
    if severity == "high":
        score += 10
    elif severity == "medium":
        score += 5

    return min(100, score)


def _calculate_network_impact(
    constraint: dict,
    active_children: list[str],
    health: dict,
    all_verified: list[dict],
) -> int:
    """
    Calculate how much of the business health is affected.
    Considers primary pillar + downstream pillar effects.
    """
    affected_pillars = set()

    # Primary pillar
    primary_pillar = CONSTRAINT_PILLAR.get(constraint["key"], "growth")
    affected_pillars.add(primary_pillar)

    # Add pillars from active children
    for child_key in active_children:
        child_pillar = CONSTRAINT_PILLAR.get(child_key, "growth")
        affected_pillars.add(child_pillar)

    # Sum pillar deficits (distance below benchmark)
    total_deficit = 0
    for pillar in affected_pillars:
        pillar_data = health["pillars"].get(pillar, {})
        score = pillar_data.get("score", 50)
        benchmark = pillar_data.get("benchmark", 55)
        deficit = max(0, benchmark - score)
        total_deficit += deficit

    # Normalise to 0-100
    max_possible_deficit = len(affected_pillars) * 100
    if max_possible_deficit == 0:
        return 0
    return min(100, round((total_deficit / max_possible_deficit) * 200))


def _calculate_root_cause_confidence(
    constraint: dict,
    active_children: list[str],
    active_linked: list[str],
) -> str:
    """
    Estimate confidence that this is a genuine root cause.
    """
    is_root = constraint.get("is_root_cause", False)
    verification_score = constraint.get("verification_score", 0)
    children_count = len(active_children)

    if not is_root:
        return "low"

    confidence_score = 0

    if is_root:
        confidence_score += 40
    if verification_score >= 80:
        confidence_score += 30
    elif verification_score >= 60:
        confidence_score += 15
    if children_count >= 2:
        confidence_score += 20
    elif children_count == 1:
        confidence_score += 10
    if len(active_linked) >= 2:
        confidence_score += 10

    if confidence_score >= 70:
        return "high"
    elif confidence_score >= 40:
        return "medium"
    return "low"


def _build_cascade_chain(
    constraint_key: str,
    all_verified_keys: list[str],
    depth: int = 0,
    visited: set = None,
) -> list[str]:
    """
    Recursively build the cascade chain from a root constraint.
    Returns list of all downstream constraints this one may be causing.
    """
    if visited is None:
        visited = set()
    if depth > 3 or constraint_key in visited:
        return []

    visited.add(constraint_key)
    children = CONSTRAINT_CHILDREN.get(constraint_key, [])
    active_children = [c for c in children if c in all_verified_keys]

    cascade = list(active_children)
    for child in active_children:
        cascade.extend(
            _build_cascade_chain(child, all_verified_keys, depth + 1, visited)
        )

    return list(dict.fromkeys(cascade))


def build_constraint_network(
    verified_constraints: list[dict[str, Any]],
    health: dict[str, Any],
) -> dict[str, Any]:
    """
    Build the full constraint network from verified constraints.
    Returns network with dominance scores, cascade chains, root ranking.
    Feeds directly into Decision Intelligence Engine.
    """

    # Only work with verified constraints
    verified = [c for c in verified_constraints if c.get("verified")]
    all_verified_keys = [c["key"] for c in verified]

    if not verified:
        return {
            "network_size": 0,
            "root_constraints": [],
            "cascade_chains": {},
            "nodes": [],
            "primary_candidate": None,
            "network_explanation": "No verified constraints found.",
        }

    # Build network nodes
    nodes = []
    for constraint in verified:
        key = constraint["key"]
        active_children = _get_active_children(key, all_verified_keys)
        active_linked = _get_active_linked(key, all_verified_keys)

        dominance_score = _calculate_dominance_score(
            constraint, active_children, active_linked, verified
        )
        network_impact = _calculate_network_impact(
            constraint, active_children, health, verified
        )
        root_cause_confidence = _calculate_root_cause_confidence(
            constraint, active_children, active_linked
        )
        cascade_chain = _build_cascade_chain(key, all_verified_keys)

        node = {
            **constraint,
            "dominance_score": dominance_score,
            "network_impact_score": network_impact,
            "root_cause_confidence": root_cause_confidence,
            "active_children": active_children,
            "active_linked": active_linked,
            "cascade_chain": cascade_chain,
            "cascade_depth": len(cascade_chain),
        }
        nodes.append(node)

    # Sort by dominance score
    nodes.sort(key=lambda x: x["dominance_score"], reverse=True)

    # Identify root constraints
    root_constraints = [n for n in nodes if n.get("is_root_cause")]
    root_constraints.sort(key=lambda x: x["dominance_score"], reverse=True)

    # Primary candidate — highest dominance root constraint
    primary_candidate = root_constraints[0] if root_constraints else nodes[0]

    # Build cascade chains summary
    cascade_chains = {}
    for node in nodes:
        if node["cascade_chain"]:
            cascade_chains[node["key"]] = {
                "name": node["name"],
                "causes": node["cascade_chain"],
                "depth": node["cascade_depth"],
            }

    # Network explanation
    explanation_parts = [
        f"Network contains {len(verified)} verified constraints.",
        f"{len(root_constraints)} root cause(s) identified.",
    ]
    if primary_candidate:
        explanation_parts.append(
            f"Highest dominance: '{primary_candidate['name']}' "
            f"(dominance: {primary_candidate['dominance_score']}/100, "
            f"root cause confidence: {primary_candidate['root_cause_confidence']})."
        )
    if cascade_chains:
        for key, chain in list(cascade_chains.items())[:2]:
            explanation_parts.append(
                f"'{chain['name']}' cascades into: {', '.join(chain['causes'])}."
            )

    return {
        "network_size": len(verified),
        "root_constraints": root_constraints,
        "cascade_chains": cascade_chains,
        "nodes": nodes,
        "primary_candidate": primary_candidate,
        "network_explanation": " ".join(explanation_parts),
    }
