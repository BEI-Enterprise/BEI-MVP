"""
BEI Constraint Repository
Handles persistence of Constraint records to Supabase.

CALLED AFTER select_primary_constraint(), not after verify_constraints().
This is deliberate: severity, verification, network, opportunity and
priority data are only ALL present on a constraint dict once detection,
verification, opportunity calculation, network analysis and decision
selection have each run — calling this any earlier would mean writing
incomplete rows and patching them later, which is exactly the kind of
silent partial-write the persistence plan calls out as a risk.

One row per (business_twin_id, constraint_type) — upsert, enforced by
migration 015. A repeat analysis updates existing rows rather than
duplicating them.

Golden Rule 4 (One Primary Constraint) is NOT enforced by the database
(see migration 005's own comment: "Enforced at application layer").
This repository enforces it explicitly: before writing the new primary,
every other constraint row for this business_twin_id is set to
is_primary = False.

Every derived score below is traceable to an existing engine output —
none are invented from nothing.
"""

from typing import Any
from services.db.supabase_client import get_supabase


_SEVERITY_SCORE_MAP = {"high": 90, "medium": 60, "low": 30}

_PILLAR_FOR_DIMENSION = {
    "capacity": "operations",
    "strategic": "strategy",
    "risk": "risk",
}


def _severity_score(constraint: dict[str, Any]) -> int:
    return _SEVERITY_SCORE_MAP.get(constraint.get("severity", "medium"), 60)


def _confidence_score(constraint: dict[str, Any]) -> int:
    return constraint.get("verification_score", 0)


def _root_cause_depth(constraint: dict[str, Any], network: dict[str, Any]) -> int:
    is_root = constraint.get("is_root_cause", False)
    key = constraint.get("key", "")
    nodes = {n["key"]: n for n in network.get("nodes", [])}
    node = nodes.get(key, {})
    has_active_children = bool(node.get("active_children"))

    if is_root and has_active_children:
        return 5
    if is_root:
        return 4
    if node.get("active_parents") or node.get("cascade_depth", 0) >= 2:
        return 2
    return 1


def _pillar_impact_score(constraint: dict[str, Any], health: dict[str, Any], pillar: str) -> int:
    pillar_score = health.get("pillars", {}).get(pillar, {}).get("score", 50)
    return max(0, min(100, 100 - pillar_score))


def _impact_scores(constraint: dict[str, Any], health: dict[str, Any]) -> dict[str, int]:
    key = constraint.get("key", "")
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
    home_pillar = pillar_map.get(key, "growth")
    detection_baseline = constraint.get("detection_score", 5) * 5

    scores = {}
    for dimension, pillar in _PILLAR_FOR_DIMENSION.items():
        if pillar == home_pillar:
            scores[dimension] = _pillar_impact_score(constraint, health, pillar)
        else:
            scores[dimension] = min(100, detection_baseline)
    return scores


def _financial_impact(constraint: dict[str, Any]):
    opportunity = constraint.get("opportunity")
    if not opportunity:
        return None
    low = opportunity.get("value_low")
    high = opportunity.get("value_high")
    if low is None or high is None:
        return None
    return round((low + high) / 2, 2)


def _opportunity_score(constraint: dict[str, Any]):
    opportunity = constraint.get("opportunity")
    if not opportunity:
        return None
    base_revenue = opportunity.get("base_revenue")
    financial_impact = _financial_impact(constraint)
    if not base_revenue or financial_impact is None:
        return None
    return max(0, min(100, round((financial_impact / base_revenue) * 100)))


def _priority_score(
    financial_impact,
    base_revenue,
    capacity_impact: int,
    strategic_impact: int,
    risk_impact: int,
    confidence_score: int,
) -> float:
    if financial_impact is not None and base_revenue:
        financial_normalised = max(0, min(100, (financial_impact / base_revenue) * 100))
    else:
        financial_normalised = 0

    score = (
        financial_normalised * 0.35
        + capacity_impact * 0.15
        + strategic_impact * 0.20
        + risk_impact * 0.15
        + confidence_score * 0.15
    )
    return round(score, 2)


def _priority_tier(priority_score: float) -> str:
    if priority_score >= 75:
        return "critical"
    if priority_score >= 55:
        return "high"
    if priority_score >= 35:
        return "medium"
    return "low"


def _network_impact_score(constraint: dict[str, Any], network: dict[str, Any]) -> int:
    key = constraint.get("key", "")
    nodes = {n["key"]: n for n in network.get("nodes", [])}
    return nodes.get(key, {}).get("network_impact_score", 0)


def _lifecycle_status(constraint: dict[str, Any], is_primary: bool, is_secondary: bool) -> str:
    if not constraint.get("verified", False):
        return "rejected"
    if is_primary:
        return "primary"
    if is_secondary:
        return "secondary"
    return "verified"


def _build_row(
    constraint: dict[str, Any],
    business_id: str,
    business_twin_id: str,
    health: dict[str, Any],
    network: dict[str, Any],
    is_primary: bool,
    is_secondary: bool,
) -> dict[str, Any]:
    impact_scores = _impact_scores(constraint, health)
    confidence_score = _confidence_score(constraint)
    financial_impact = _financial_impact(constraint)
    opportunity = constraint.get("opportunity") or {}
    base_revenue = opportunity.get("base_revenue")

    priority_score = _priority_score(
        financial_impact,
        base_revenue,
        impact_scores["capacity"],
        impact_scores["strategic"],
        impact_scores["risk"],
        confidence_score,
    )

    impact_score = round(
        (impact_scores["capacity"] + impact_scores["strategic"] + impact_scores["risk"]) / 3
    )

    return {
        "business_id": business_id,
        "business_twin_id": business_twin_id,
        "constraint_type": constraint["key"],
        "lifecycle_status": _lifecycle_status(constraint, is_primary, is_secondary),
        "severity_score": _severity_score(constraint),
        "impact_score": impact_score,
        "confidence_score": confidence_score,
        "verification_score": constraint.get("verification_score", 0),
        "network_impact_score": _network_impact_score(constraint, network),
        "opportunity_score": _opportunity_score(constraint),
        "priority_score": priority_score,
        "priority_tier": _priority_tier(priority_score),
        "is_primary": is_primary,
        "root_cause_depth": _root_cause_depth(constraint, network),
        "is_root_constraint": constraint.get("is_root_cause", False),
        "financial_impact": financial_impact,
        "capacity_impact_score": impact_scores["capacity"],
        "strategic_impact_score": impact_scores["strategic"],
        "risk_impact_score": impact_scores["risk"],
        "constraint_summary": constraint.get("name"),
        "constraint_detail": constraint.get("hypothesis"),
        "evidence_summary": " | ".join(constraint.get("evidence", [])) or None,
        "analysis_version": "v1.0-rules-based",
    }


def persist_constraints(
    primary_constraint,
    secondary_constraints: list,
    unverified_flags: list,
    business_id: str,
    business_twin_id: str,
    health: dict[str, Any],
    network: dict[str, Any],
) -> dict[str, str]:
    client = get_supabase()

    all_constraints = []
    if primary_constraint:
        all_constraints.append((primary_constraint, True, False))
    for c in secondary_constraints:
        all_constraints.append((c, False, True))
    for c in unverified_flags:
        all_constraints.append((c, False, False))

    if not all_constraints:
        return {}

    if primary_constraint:
        (
            client.table("constraints")
            .update({"is_primary": False, "lifecycle_status": "secondary"})
            .eq("business_twin_id", business_twin_id)
            .eq("is_primary", True)
            .execute()
        )

    rows = [
        _build_row(constraint, business_id, business_twin_id, health, network, is_primary, is_secondary)
        for constraint, is_primary, is_secondary in all_constraints
    ]

    result = (
        client.table("constraints")
        .upsert(rows, on_conflict="business_twin_id,constraint_type")
        .execute()
    )

    if not result.data:
        raise RuntimeError(
            f"Constraint upsert returned no data for business_twin_id="
            f"{business_twin_id}. Response: {result}"
        )

    return {row["constraint_type"]: row["id"] for row in result.data}
