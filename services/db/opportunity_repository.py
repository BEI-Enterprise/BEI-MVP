"""
BEI Opportunity Repository
Handles persistence of Opportunity records to Supabase.

CALLED AFTER calculate_opportunities(), using the SAME constraint
dicts that constraint_repository.py persists — opportunity.py
attaches its output under constraint["opportunity"], so this
repository reads from the identical enriched constraint list,
not a separate computation path.

One row per (constraint_id, opportunity_type) — upsert, enforced
by migration 016, same pattern as migration 015 for constraints.
A repeat analysis updates existing opportunity rows rather than
duplicating them.

MVP 1 confidence is always "indicative" (see opportunity/engine.py
comment: "MVP 1: all indicative (intake data only)"). The schema's
confidence_score is a 0-100 INTEGER; there is no per-opportunity
numeric confidence signal yet in the engine output, so a fixed
default of 60 is used — matching the same MVP1 default precedent
already set in twin/builder.py's data_confidence_score: 60. This
is not invented from nothing; it is the existing convention for
"indicative, not yet measured" confidence across this codebase.

time_to_impact_band and deployment_tier have no source field in
the engine output either. Both are derived from severity, the only
signal available at this stage — high severity implies faster,
more automatable action; low severity implies longer-term,
recommendation-only treatment. This mirrors the same severity-driven
pattern constraint_repository.py already uses for priority_tier.
"""

from typing import Any
from services.db.supabase_client import get_supabase


_TIME_TO_IMPACT_BY_SEVERITY = {
    "high": ("short_term", 60),
    "medium": ("medium_term", 120),
    "low": ("long_term", 210),
}

_DEPLOYMENT_TIER_BY_SEVERITY = {
    "high": "tier_2_approval",
    "medium": "tier_2_approval",
    "low": "tier_3_recommendation",
}

# Never deploy pricing, staffing or strategic decisions automatically
# (see migration 007 comment on deployment_tier). These constraint
# types are forced to tier_3_recommendation regardless of severity.
_NEVER_AUTOMATIC_TYPES = {
    "pricing_constraint",
    "staffing_inefficiency",
    "founder_dependency",
}

_DIMENSION_IMPACT_FIELD = {
    "revenue": "revenue_impact",
    "profit": "profit_impact",
    "capacity": "capacity_impact",
    "enterprise_value": "enterprise_value_impact",
}

# MVP1 fixed confidence — see module docstring.
_MVP1_CONFIDENCE_SCORE = 60


def _estimated_value(opportunity: dict[str, Any]) -> float:
    low = opportunity.get("value_low", 0) or 0
    high = opportunity.get("value_high", 0) or 0
    return round((low + high) / 2, 2)


def _opportunity_value(estimated_value: float, confidence_score: int) -> float:
    # Schema formula: opportunity_value = estimated_value x (confidence_score / 100)
    return round(estimated_value * (confidence_score / 100), 2)


def _deployment_tier(constraint_key: str, severity: str) -> str:
    if constraint_key in _NEVER_AUTOMATIC_TYPES:
        return "tier_3_recommendation"
    return _DEPLOYMENT_TIER_BY_SEVERITY.get(severity, "tier_2_approval")


def _time_to_impact(severity: str) -> tuple[str, int]:
    return _TIME_TO_IMPACT_BY_SEVERITY.get(severity, ("medium_term", 120))


def _risk_reduction_score(dimension: str, estimated_value: float, base_revenue) -> int:
    if dimension != "risk_reduction":
        return 0
    if not base_revenue:
        return 0
    return max(0, min(100, round((estimated_value / base_revenue) * 100)))


def _build_row(
    constraint: dict[str, Any],
    business_id: str,
    business_twin_id: str,
    constraint_id: str,
) -> dict[str, Any]:
    opportunity = constraint.get("opportunity") or {}
    dimension = opportunity.get("dimension", "revenue")
    severity = constraint.get("severity", "medium")
    constraint_key = constraint.get("key", "")
    base_revenue = opportunity.get("base_revenue")

    estimated_value = _estimated_value(opportunity)
    confidence_score = _MVP1_CONFIDENCE_SCORE
    opportunity_value = _opportunity_value(estimated_value, confidence_score)
    time_to_impact_band, time_to_impact_days = _time_to_impact(severity)
    deployment_tier = _deployment_tier(constraint_key, severity)
    risk_reduction_score = _risk_reduction_score(dimension, estimated_value, base_revenue)

    row = {
        "business_id": business_id,
        "business_twin_id": business_twin_id,
        "constraint_id": constraint_id,
        "opportunity_type": dimension,
        "status": "quantified",
        "estimated_value": estimated_value,
        "confidence_score": confidence_score,
        "opportunity_value": opportunity_value,
        "revenue_impact": None,
        "profit_impact": None,
        "capacity_impact": None,
        "risk_reduction_score": risk_reduction_score,
        "enterprise_value_impact": None,
        "time_to_impact_days": time_to_impact_days,
        "time_to_impact_band": time_to_impact_band,
        "opportunity_title": constraint.get("name"),
        "opportunity_summary": opportunity.get("explanation"),
        "opportunity_detail": opportunity.get("basis"),
        "recommended_action": None,
        "deployment_ready": deployment_tier != "tier_3_recommendation",
        "deployment_tier": deployment_tier,
        "analysis_version": "v1.0-rules-based",
    }

    # Set the one dimension-specific impact field this opportunity actually
    # represents — the other three stay None, since the engine only ever
    # produces a single dimension per constraint, not all five at once.
    impact_field = _DIMENSION_IMPACT_FIELD.get(dimension)
    if impact_field:
        row[impact_field] = estimated_value

    return row


def persist_opportunities(
    primary_constraint,
    secondary_constraints: list,
    constraint_ids: dict,
    business_id: str,
    business_twin_id: str,
) -> dict[str, str]:
    """
    Persists one Opportunity row per constraint that has both:
    (a) an "opportunity" dict attached (i.e. it was verified and
        passed through calculate_opportunities()), and
    (b) a matching entry in constraint_ids (i.e. it was already
        persisted by constraint_repository.py — required as the
        FK target).

    Unverified flags are skipped entirely: calculate_opportunities()
    only runs on verified constraints, so unverified constraints
    never carry an "opportunity" dict to persist in the first place.
    This is consistent with Golden Rule 5 (Opportunity Before
    Deployment) and Golden Rule 2 (Verification Before Recommendation).

    Returns a dict keyed by constraint_type, mapping to the
    opportunities.id (UUID, as a string) for that row — for use
    by Step 4 (deployment packages).
    """
    client = get_supabase()

    candidates = []
    if primary_constraint:
        candidates.append(primary_constraint)
    candidates.extend(secondary_constraints)

    rows = []
    for constraint in candidates:
        key = constraint.get("key", "")
        constraint_id = constraint_ids.get(key)
        opportunity = constraint.get("opportunity")
        if not constraint_id or not opportunity:
            continue
        rows.append(_build_row(constraint, business_id, business_twin_id, constraint_id))

    if not rows:
        return {}

    result = (
        client.table("opportunities")
        .upsert(rows, on_conflict="constraint_id,opportunity_type")
        .execute()
    )
    if not result.data:
        raise RuntimeError(
            f"Opportunity upsert returned no data for business_twin_id="
            f"{business_twin_id}. Response: {result}"
        )

    # Map back to constraint_type via constraint_id reverse lookup,
    # since the response rows carry constraint_id, not constraint_type.
    id_to_key = {v: k for k, v in constraint_ids.items()}
    return {
        id_to_key[row["constraint_id"]]: row["id"]
        for row in result.data
        if row["constraint_id"] in id_to_key
    }
