"""
BEI Learning Engine — Phase 12
Stores intelligence from every outcome and builds a self-improving model.
Aligned with BEI Master Architecture Section 12 — Learning Engine.
Aligned with BEI Master Context Section 21 — Learning Philosophy.

Golden Rule 7: Learning From Outcomes.
Golden Rule 8: Accuracy Over Volume.
Golden Rule 10: Every Decision Must Be Explainable.

Every business analysed improves BEI.
Every verified constraint improves the verification model.
Every deployment improves the deployment model.
Every outcome improves the decision model.

Six learning record types:
1. Constraint Learning
2. Verification Learning
3. Decision Learning
4. Opportunity Learning
5. Deployment Learning
6. Industry Learning
"""

from typing import Any
from datetime import datetime
import uuid


# ============================================================
# MODEL VERSION TRACKING
# Every update to the intelligence model is versioned.
# ============================================================

INITIAL_MODEL_VERSION = "v1.0.0"


def _increment_version(current_version: str) -> str:
    """Increment the patch version number."""
    parts = current_version.lstrip("v").split(".")
    parts[-1] = str(int(parts[-1]) + 1)
    return "v" + ".".join(parts)


# ============================================================
# LEARNING RECORD BUILDERS
# One builder per learning type.
# ============================================================

def create_constraint_learning_record(
    constraint: dict[str, Any],
    industry: str,
    all_detected_keys: list[str],
) -> dict[str, Any]:
    """
    Store what was learned about constraint detection accuracy.
    Called after verification completes.
    """
    return {
        "learning_id": str(uuid.uuid4()),
        "learning_type": "constraint",
        "constraint_key": constraint.get("key", ""),
        "constraint_name": constraint.get("name", ""),
        "industry": industry,
        "detection_score": constraint.get("detection_score", 0),
        "confidence_level": constraint.get("confidence_level", "low"),
        "industry_relevance": constraint.get("industry_relevance", "medium"),
        "verified": constraint.get("verified", False),
        "false_positive": not constraint.get("verified", False),
        "verification_score": constraint.get("verification_score", 0),
        "is_root_cause": constraint.get("is_root_cause", False),
        "co_occurring_constraints": [
            k for k in all_detected_keys
            if k != constraint.get("key", "")
        ],
        "severity": constraint.get("severity", "medium"),
        "created_at": datetime.utcnow().isoformat(),
    }


def create_verification_learning_record(
    constraint: dict[str, Any],
    industry: str,
) -> dict[str, Any]:
    """
    Store what was learned about verification accuracy.
    Which tests passed, which failed, which are most predictive.
    """
    tests = constraint.get("verification_tests", [])
    passed_tests = [t["test"] for t in tests if t["passes"]]
    failed_tests = [t["test"] for t in tests if not t["passes"]]

    return {
        "learning_id": str(uuid.uuid4()),
        "learning_type": "verification",
        "constraint_key": constraint.get("key", ""),
        "constraint_name": constraint.get("name", ""),
        "industry": industry,
        "verification_score": constraint.get("verification_score", 0),
        "tests_passed": constraint.get("tests_passed", 0),
        "total_tests": constraint.get("total_tests", 5),
        "passed_tests": passed_tests,
        "failed_tests": failed_tests,
        "verified": constraint.get("verified", False),
        "is_root_cause": constraint.get("is_root_cause", False),
        "active_parents": constraint.get("verification_tests", [{}])[2].get(
            "active_parents", []
        ) if len(constraint.get("verification_tests", [])) > 2 else [],
        "created_at": datetime.utcnow().isoformat(),
    }


def create_decision_learning_record(
    primary_constraint: dict[str, Any],
    decision_score: float,
    confidence: str,
    industry: str,
    outcome_confirmed: bool = None,
) -> dict[str, Any]:
    """
    Store what was learned about decision intelligence accuracy.
    Was the primary constraint selection correct?
    """
    return {
        "learning_id": str(uuid.uuid4()),
        "learning_type": "decision",
        "constraint_key": primary_constraint.get("key", ""),
        "constraint_name": primary_constraint.get("name", ""),
        "industry": industry,
        "decision_score": decision_score,
        "confidence": confidence,
        "verification_score": primary_constraint.get("verification_score", 0),
        "is_root_cause": primary_constraint.get("is_root_cause", False),
        "severity": primary_constraint.get("severity", "medium"),
        "outcome_confirmed_primary": outcome_confirmed,
        "created_at": datetime.utcnow().isoformat(),
    }


def create_opportunity_learning_record(
    constraint: dict[str, Any],
    industry: str,
    revenue_band: str,
    actual_value: float = None,
) -> dict[str, Any]:
    """
    Store what was learned about opportunity estimation accuracy.
    Was the opportunity range prediction accurate?
    """
    opportunity = constraint.get("opportunity", {})
    predicted_low = opportunity.get("value_low", 0)
    predicted_high = opportunity.get("value_high", 0)

    within_range = None
    accuracy_score = None

    if actual_value is not None:
        within_range = predicted_low <= actual_value <= predicted_high
        if within_range:
            accuracy_score = 90
        elif actual_value < predicted_low:
            gap = predicted_low - actual_value
            accuracy_score = max(0, 70 - int((gap / predicted_low) * 100))
        else:
            gap = actual_value - predicted_high
            accuracy_score = max(0, 70 - int((gap / predicted_high) * 100))

    return {
        "learning_id": str(uuid.uuid4()),
        "learning_type": "opportunity",
        "constraint_key": constraint.get("key", ""),
        "constraint_name": constraint.get("name", ""),
        "industry": industry,
        "revenue_band": revenue_band,
        "dimension": opportunity.get("dimension", "revenue"),
        "predicted_low": predicted_low,
        "predicted_high": predicted_high,
        "actual_value": actual_value,
        "within_range": within_range,
        "accuracy_score": accuracy_score,
        "confidence": opportunity.get("confidence", "indicative"),
        "created_at": datetime.utcnow().isoformat(),
    }


def create_deployment_learning_record(
    deployment_package: dict[str, Any],
    outcome_records: list[dict[str, Any]],
    industry: str,
) -> dict[str, Any]:
    """
    Store what was learned about deployment effectiveness.
    Which deployments worked best for which constraints.
    """
    completed_outcomes = [
        r for r in outcome_records
        if r.get("success_score") is not None
    ]

    avg_success_score = 0
    if completed_outcomes:
        avg_success_score = round(
            sum(r["success_score"] for r in completed_outcomes) /
            len(completed_outcomes)
        )

    overall_status = "pending"
    if completed_outcomes:
        if avg_success_score >= 80:
            overall_status = "exceeded"
        elif avg_success_score >= 60:
            overall_status = "met"
        elif avg_success_score >= 30:
            overall_status = "partially_met"
        else:
            overall_status = "not_met"

    return {
        "learning_id": str(uuid.uuid4()),
        "learning_type": "deployment",
        "deployment_id": deployment_package.get("deployment_id", ""),
        "constraint_key": deployment_package.get("constraint_key", ""),
        "constraint_name": deployment_package.get("constraint_name", ""),
        "industry": industry,
        "tier": deployment_package.get("tier", 3),
        "action_type": deployment_package.get("action_type", ""),
        "action_title": deployment_package.get("action_title", ""),
        "avg_success_score": avg_success_score,
        "overall_status": overall_status,
        "outcomes_measured": len(completed_outcomes),
        "timeframe_days": max(
            (r.get("timeframe_days", 90) for r in outcome_records),
            default=90
        ),
        "created_at": datetime.utcnow().isoformat(),
    }


def create_industry_learning_record(
    industry: str,
    all_constraints: list[dict[str, Any]],
    health: dict[str, Any],
    total_opportunity: dict[str, Any],
    deployment_records: list[dict[str, Any]] = None,
) -> dict[str, Any]:
    """
    Store industry-level intelligence.
    Aggregates patterns across businesses in the same industry.
    """
    verified = [c for c in all_constraints if c.get("verified")]
    constraint_keys = [c["key"] for c in verified]

    most_effective = []
    if deployment_records:
        high_performers = [
            d for d in deployment_records
            if d.get("avg_success_score", 0) >= 70
        ]
        most_effective = [d["action_type"] for d in high_performers[:3]]

    return {
        "learning_id": str(uuid.uuid4()),
        "learning_type": "industry",
        "industry": industry,
        "constraints_detected": constraint_keys,
        "verified_constraint_count": len(verified),
        "overall_health_score": health.get("overall", 0),
        "health_band": health.get("band", "unknown"),
        "vs_benchmark": health.get("vs_benchmark", "unknown"),
        "total_opportunity_low": total_opportunity.get("total_low", 0),
        "total_opportunity_high": total_opportunity.get("total_high", 0),
        "most_effective_deployments": most_effective,
        "businesses_contributing": 1,
        "created_at": datetime.utcnow().isoformat(),
    }


# ============================================================
# LEARNING STORE
# In-memory store for MVP 1.
# Phase 13+ will persist to Supabase learning_records table.
# ============================================================

class LearningStore:
    """
    Stores and retrieves learning records.
    MVP 1: in-memory store.
    Future: persists to Supabase learning_records table.
    """

    def __init__(self):
        self.records = []
        self.model_version = INITIAL_MODEL_VERSION
        self.businesses_analysed = 0
        self.created_at = datetime.utcnow().isoformat()

    def add(self, record: dict[str, Any]) -> None:
        self.records.append(record)

    def add_many(self, records: list[dict[str, Any]]) -> None:
        self.records.extend(records)

    def get_by_type(self, learning_type: str) -> list[dict[str, Any]]:
        return [r for r in self.records if r.get("learning_type") == learning_type]

    def get_by_constraint(self, constraint_key: str) -> list[dict[str, Any]]:
        return [r for r in self.records if r.get("constraint_key") == constraint_key]

    def get_by_industry(self, industry: str) -> list[dict[str, Any]]:
        return [r for r in self.records if r.get("industry") == industry]

    def increment_model_version(self) -> str:
        self.model_version = _increment_version(self.model_version)
        return self.model_version

    def increment_businesses(self) -> int:
        self.businesses_analysed += 1
        return self.businesses_analysed

    def summary(self) -> dict[str, Any]:
        by_type = {}
        for r in self.records:
            t = r.get("learning_type", "unknown")
            by_type[t] = by_type.get(t, 0) + 1

        constraint_records = self.get_by_type("constraint")
        false_positives = sum(
            1 for r in constraint_records if r.get("false_positive")
        )
        detection_accuracy = round(
            (1 - false_positives / len(constraint_records)) * 100
        ) if constraint_records else 0

        deployment_records = self.get_by_type("deployment")
        avg_deployment_success = round(
            sum(r.get("avg_success_score", 0) for r in deployment_records) /
            len(deployment_records)
        ) if deployment_records else 0

        return {
            "model_version": self.model_version,
            "businesses_analysed": self.businesses_analysed,
            "total_records": len(self.records),
            "records_by_type": by_type,
            "detection_accuracy_pct": detection_accuracy,
            "avg_deployment_success": avg_deployment_success,
            "learning_health": (
                "strong" if detection_accuracy >= 80 and avg_deployment_success >= 70
                else "moderate" if detection_accuracy >= 60
                else "early_stage"
            ),
        }


# ============================================================
# MAIN LEARNING FUNCTION
# Called after full intelligence pipeline runs.
# ============================================================

def record_intelligence_learning(
    result: dict[str, Any],
    store: LearningStore,
    industry: str,
    revenue_band: str,
) -> dict[str, Any]:
    """
    Record all learning from a completed intelligence run.
    Stores constraint, verification, decision, opportunity
    and industry learning records.
    Updates model version.
    Golden Rule 7: Learning From Outcomes.
    """

    all_detected = result.get("secondary_constraints", [])
    primary = result.get("primary_constraint")
    if primary:
        all_detected = [primary] + all_detected

    unverified = result.get("unverified_flags", [])
    all_constraints = all_detected + unverified
    all_keys = [c.get("key", "") for c in all_constraints]

    records_added = []

    # Constraint learning
    for constraint in all_constraints:
        rec = create_constraint_learning_record(constraint, industry, all_keys)
        store.add(rec)
        records_added.append(rec["learning_type"])

    # Verification learning
    for constraint in all_constraints:
        if constraint.get("verification_tests"):
            rec = create_verification_learning_record(constraint, industry)
            store.add(rec)
            records_added.append(rec["learning_type"])

    # Decision learning
    if primary:
        rec = create_decision_learning_record(
            primary,
            result.get("decision_score", 0),
            result.get("confidence", "low"),
            industry,
        )
        store.add(rec)
        records_added.append(rec["learning_type"])

    # Opportunity learning
    for constraint in all_detected:
        if constraint.get("opportunity"):
            rec = create_opportunity_learning_record(
                constraint, industry, revenue_band
            )
            store.add(rec)
            records_added.append(rec["learning_type"])

    # Industry learning
    industry_rec = create_industry_learning_record(
        industry,
        all_constraints,
        result.get("health", {}),
        result.get("total_opportunity", {}),
    )
    store.add(industry_rec)
    records_added.append(industry_rec["learning_type"])

    # Update model version and business count
    store.increment_businesses()
    new_version = store.increment_model_version()

    return {
        "records_created": len(records_added),
        "records_by_type": {t: records_added.count(t) for t in set(records_added)},
        "model_version": new_version,
        "businesses_analysed": store.businesses_analysed,
    }
