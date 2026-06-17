"""
BEI Intelligence Feedback Engine — Phase 14
Closes the intelligence loop — applies learning back into every engine.
Aligned with BEI Master Architecture Section 14 — Intelligence Feedback.
Aligned with BEI Master Architecture Section 9.5 — Feedback Architecture.

Core Principle: Every business analysed makes BEI more accurate.

Five feedback channels:
1. Detection Feedback — adjusts detection confidence thresholds
2. Verification Feedback — identifies most predictive tests
3. Decision Feedback — adjusts composite scoring weights
4. Opportunity Feedback — adjusts impact rate multipliers
5. Deployment Feedback — identifies most effective deployments

Every adjustment is versioned and explainable.
Golden Rule 7: Learning From Outcomes.
Golden Rule 8: Accuracy Over Volume.
Golden Rule 10: Every Decision Must Be Explainable.
"""

from typing import Any
from datetime import datetime


# ============================================================
# DETECTION FEEDBACK
# Reads constraint learning records.
# Identifies which constraints are reliably detected.
# Adjusts confidence thresholds per constraint per industry.
# ============================================================

def _calculate_detection_feedback(
    learning_store: Any,
) -> dict[str, Any]:
    """
    Analyse detection accuracy from learning records.
    Returns adjustments to detection confidence thresholds.
    """
    constraint_records = learning_store.get_by_type("constraint")

    if not constraint_records:
        return {
            "status": "insufficient_data",
            "adjustments": {},
            "insight": "No constraint learning records yet. Feedback available after first business analysis.",
        }

    # Group by constraint key
    by_constraint = {}
    for record in constraint_records:
        key = record.get("constraint_key", "")
        industry = record.get("industry", "")
        group_key = f"{key}:{industry}"

        if group_key not in by_constraint:
            by_constraint[group_key] = {
                "constraint_key": key,
                "industry": industry,
                "total": 0,
                "verified": 0,
                "false_positives": 0,
                "avg_detection_score": 0,
                "scores": [],
            }

        entry = by_constraint[group_key]
        entry["total"] += 1
        if record.get("verified"):
            entry["verified"] += 1
        if record.get("false_positive"):
            entry["false_positives"] += 1
        entry["scores"].append(record.get("detection_score", 0))

    adjustments = {}
    insights = []

    for group_key, data in by_constraint.items():
        total = data["total"]
        verified = data["verified"]
        false_positives = data["false_positives"]

        if total == 0:
            continue

        verification_rate = verified / total
        false_positive_rate = false_positives / total
        avg_score = sum(data["scores"]) / len(data["scores"])

        # Determine adjustment
        if verification_rate >= 0.9 and false_positive_rate <= 0.1:
            adjustment = "increase_confidence"
            adjustment_factor = 1.1
            insight = f"{data['constraint_key']} in {data['industry']}: high verification rate ({verification_rate:.0%}) — increase detection confidence."
        elif verification_rate <= 0.5 or false_positive_rate >= 0.3:
            adjustment = "decrease_confidence"
            adjustment_factor = 0.9
            insight = f"{data['constraint_key']} in {data['industry']}: low verification rate ({verification_rate:.0%}) — decrease detection confidence."
        else:
            adjustment = "maintain"
            adjustment_factor = 1.0
            insight = f"{data['constraint_key']} in {data['industry']}: verification rate {verification_rate:.0%} — maintain current confidence."

        adjustments[group_key] = {
            "constraint_key": data["constraint_key"],
            "industry": data["industry"],
            "verification_rate": round(verification_rate, 3),
            "false_positive_rate": round(false_positive_rate, 3),
            "avg_detection_score": round(avg_score, 1),
            "adjustment": adjustment,
            "adjustment_factor": adjustment_factor,
            "sample_size": total,
        }
        insights.append(insight)

    return {
        "status": "calculated",
        "adjustments": adjustments,
        "constraints_analysed": len(adjustments),
        "insights": insights,
    }


# ============================================================
# VERIFICATION FEEDBACK
# Reads verification learning records.
# Identifies which tests are most predictive of good outcomes.
# ============================================================

def _calculate_verification_feedback(
    learning_store: Any,
) -> dict[str, Any]:
    """
    Analyse which verification tests are most predictive.
    Returns insights on test reliability per constraint.
    """
    verification_records = learning_store.get_by_type("verification")

    if not verification_records:
        return {
            "status": "insufficient_data",
            "test_reliability": {},
            "insight": "No verification learning records yet.",
        }

    # Count how often each test passes and correlates with verified outcome
    test_pass_counts = {}
    test_total_counts = {}

    for record in verification_records:
        passed_tests = record.get("passed_tests", [])
        failed_tests = record.get("failed_tests", [])
        verified = record.get("verified", False)

        all_tests = passed_tests + failed_tests
        for test in all_tests:
            if test not in test_total_counts:
                test_total_counts[test] = 0
                test_pass_counts[test] = 0
            test_total_counts[test] += 1
            if test in passed_tests:
                test_pass_counts[test] += 1

    test_reliability = {}
    for test, total in test_total_counts.items():
        pass_rate = test_pass_counts.get(test, 0) / total if total > 0 else 0
        test_reliability[test] = {
            "pass_rate": round(pass_rate, 3),
            "total_seen": total,
            "reliability": (
                "high" if pass_rate >= 0.8
                else "medium" if pass_rate >= 0.5
                else "low"
            ),
        }

    # Identify most and least reliable tests
    sorted_tests = sorted(
        test_reliability.items(),
        key=lambda x: x[1]["pass_rate"],
        reverse=True
    )

    insights = []
    for test, data in sorted_tests:
        insights.append(
            f"{test}: pass rate {data['pass_rate']:.0%} ({data['reliability']} reliability)"
        )

    return {
        "status": "calculated",
        "test_reliability": test_reliability,
        "most_reliable_test": sorted_tests[0][0] if sorted_tests else None,
        "least_reliable_test": sorted_tests[-1][0] if sorted_tests else None,
        "insights": insights,
    }


# ============================================================
# DECISION FEEDBACK
# Reads decision learning records.
# Analyses whether primary constraint selections were confirmed.
# ============================================================

def _calculate_decision_feedback(
    learning_store: Any,
) -> dict[str, Any]:
    """
    Analyse decision intelligence accuracy.
    Which constraints are most reliably selected as primary?
    """
    decision_records = learning_store.get_by_type("decision")

    if not decision_records:
        return {
            "status": "insufficient_data",
            "adjustments": {},
            "insight": "No decision learning records yet.",
        }

    by_constraint = {}
    for record in decision_records:
        key = record.get("constraint_key", "")
        industry = record.get("industry", "")
        group_key = f"{key}:{industry}"

        if group_key not in by_constraint:
            by_constraint[group_key] = {
                "constraint_key": key,
                "industry": industry,
                "selected_as_primary": 0,
                "outcome_confirmed": 0,
                "avg_decision_score": [],
                "avg_confidence": [],
            }

        entry = by_constraint[group_key]
        entry["selected_as_primary"] += 1
        if record.get("outcome_confirmed_primary"):
            entry["outcome_confirmed"] += 1
        entry["avg_decision_score"].append(record.get("decision_score", 0))

    adjustments = {}
    insights = []

    for group_key, data in by_constraint.items():
        selected = data["selected_as_primary"]
        confirmed = data["outcome_confirmed"]
        avg_score = (
            sum(data["avg_decision_score"]) / len(data["avg_decision_score"])
            if data["avg_decision_score"] else 0
        )

        confirmation_rate = confirmed / selected if selected > 0 else None

        adjustments[group_key] = {
            "constraint_key": data["constraint_key"],
            "industry": data["industry"],
            "times_selected_primary": selected,
            "outcome_confirmed": confirmed,
            "confirmation_rate": confirmation_rate,
            "avg_decision_score": round(avg_score, 1),
        }

        if confirmation_rate is not None:
            insights.append(
                f"{data['constraint_key']} selected {selected}x as primary in {data['industry']} — "
                f"confirmation rate: {confirmation_rate:.0%}"
            )
        else:
            insights.append(
                f"{data['constraint_key']} selected {selected}x as primary in {data['industry']} — "
                f"outcome confirmation pending"
            )

    return {
        "status": "calculated",
        "adjustments": adjustments,
        "insights": insights,
    }


# ============================================================
# OPPORTUNITY FEEDBACK
# Reads opportunity learning records.
# Analyses accuracy of opportunity range predictions.
# ============================================================

def _calculate_opportunity_feedback(
    learning_store: Any,
) -> dict[str, Any]:
    """
    Analyse opportunity estimation accuracy.
    Which constraints consistently over or under-estimate?
    """
    opportunity_records = learning_store.get_by_type("opportunity")

    if not opportunity_records:
        return {
            "status": "insufficient_data",
            "adjustments": {},
            "insight": "No opportunity learning records yet.",
        }

    by_constraint = {}
    for record in opportunity_records:
        key = record.get("constraint_key", "")
        industry = record.get("industry", "")
        group_key = f"{key}:{industry}"

        if group_key not in by_constraint:
            by_constraint[group_key] = {
                "constraint_key": key,
                "industry": industry,
                "total": 0,
                "within_range": 0,
                "accuracy_scores": [],
                "dimension": record.get("dimension", "revenue"),
            }

        entry = by_constraint[group_key]
        entry["total"] += 1
        if record.get("within_range"):
            entry["within_range"] += 1
        if record.get("accuracy_score") is not None:
            entry["accuracy_scores"].append(record["accuracy_score"])

    adjustments = {}
    insights = []

    for group_key, data in by_constraint.items():
        total = data["total"]
        within_range = data["within_range"]
        accuracy_scores = data["accuracy_scores"]

        range_accuracy = within_range / total if total > 0 else None
        avg_accuracy = (
            sum(accuracy_scores) / len(accuracy_scores)
            if accuracy_scores else None
        )

        adjustment_factor = 1.0
        if avg_accuracy is not None:
            if avg_accuracy >= 85:
                adjustment_factor = 1.0
            elif avg_accuracy >= 60:
                adjustment_factor = 1.05
            else:
                adjustment_factor = 1.10

        adjustments[group_key] = {
            "constraint_key": data["constraint_key"],
            "industry": data["industry"],
            "dimension": data["dimension"],
            "range_accuracy": range_accuracy,
            "avg_accuracy_score": avg_accuracy,
            "adjustment_factor": adjustment_factor,
            "sample_size": total,
        }

        insights.append(
            f"{data['constraint_key']} ({data['dimension']}) in {data['industry']}: "
            f"{total} opportunity estimate(s) recorded — "
            f"accuracy pending outcome confirmation."
        )

    return {
        "status": "calculated",
        "adjustments": adjustments,
        "insights": insights,
    }


# ============================================================
# DEPLOYMENT FEEDBACK
# Reads deployment learning records.
# Identifies most and least effective deployments.
# ============================================================

def _calculate_deployment_feedback(
    learning_store: Any,
) -> dict[str, Any]:
    """
    Analyse deployment effectiveness.
    Which deployments consistently produce high success scores?
    """
    deployment_records = learning_store.get_by_type("deployment")

    if not deployment_records:
        return {
            "status": "insufficient_data",
            "top_performers": [],
            "underperformers": [],
            "insight": "No deployment learning records yet.",
        }

    by_action = {}
    for record in deployment_records:
        action_type = record.get("action_type", "")
        constraint_key = record.get("constraint_key", "")
        industry = record.get("industry", "")
        group_key = f"{action_type}:{constraint_key}:{industry}"

        if group_key not in by_action:
            by_action[group_key] = {
                "action_type": action_type,
                "constraint_key": constraint_key,
                "industry": industry,
                "tier": record.get("tier", 3),
                "total": 0,
                "success_scores": [],
            }

        entry = by_action[group_key]
        entry["total"] += 1
        score = record.get("avg_success_score", 0)
        if score > 0:
            entry["success_scores"].append(score)

    results = []
    for group_key, data in by_action.items():
        avg_score = (
            sum(data["success_scores"]) / len(data["success_scores"])
            if data["success_scores"] else 0
        )
        results.append({
            **data,
            "avg_success_score": round(avg_score),
            "performance_band": (
                "high" if avg_score >= 70
                else "medium" if avg_score >= 45
                else "low"
            ),
        })

    results.sort(key=lambda x: x["avg_success_score"], reverse=True)
    top_performers = [r for r in results if r["performance_band"] == "high"]
    underperformers = [r for r in results if r["performance_band"] == "low"]

    insights = []
    for r in results[:3]:
        insights.append(
            f"{r['action_type']} for {r['constraint_key']} in {r['industry']}: "
            f"avg success {r['avg_success_score']}/100 ({r['performance_band']})"
        )

    return {
        "status": "calculated",
        "top_performers": top_performers,
        "underperformers": underperformers,
        "all_deployments": results,
        "insights": insights,
    }


# ============================================================
# FEEDBACK SUMMARY
# Plain English summary of all feedback.
# ============================================================

def _build_feedback_summary(
    detection: dict,
    verification: dict,
    decision: dict,
    opportunity: dict,
    deployment: dict,
    businesses_contributing: int,
) -> str:
    """Build plain English feedback summary."""

    parts = [
        f"Intelligence Feedback generated from {businesses_contributing} business analysis(es).",
    ]

    if detection.get("status") == "calculated":
        parts.append(
            f"Detection: {detection.get('constraints_analysed', 0)} constraint(s) analysed. "
            f"{len([a for a in detection.get('adjustments', {}).values() if a['adjustment'] == 'increase_confidence'])} "
            f"confidence increase(s) identified."
        )

    if verification.get("status") == "calculated":
        most_reliable = verification.get("most_reliable_test", "unknown")
        parts.append(
            f"Verification: most reliable test is '{most_reliable}'."
        )

    if decision.get("status") == "calculated":
        parts.append(
            f"Decision: {len(decision.get('adjustments', {}))} primary constraint selection(s) recorded."
        )

    if opportunity.get("status") == "calculated":
        parts.append(
            f"Opportunity: {len(opportunity.get('adjustments', {}))} opportunity estimate(s) tracked."
        )

    if deployment.get("status") == "insufficient_data":
        parts.append("Deployment: no deployment outcomes recorded yet.")
    else:
        top = deployment.get("top_performers", [])
        parts.append(
            f"Deployment: {len(top)} high-performing deployment type(s) identified."
        )

    return " ".join(parts)


# ============================================================
# MAIN FEEDBACK FUNCTION
# ============================================================

def generate_intelligence_feedback(
    learning_store: Any,
    benchmark_store: Any,
    businesses_contributing: int = 0,
) -> dict[str, Any]:
    """
    Generate intelligence feedback from learning and benchmark data.
    Closes the intelligence loop.
    Feeds improvements back into every engine.
    """

    detection = _calculate_detection_feedback(learning_store)
    verification = _calculate_verification_feedback(learning_store)
    decision = _calculate_decision_feedback(learning_store)
    opportunity = _calculate_opportunity_feedback(learning_store)
    deployment = _calculate_deployment_feedback(learning_store)

    summary = _build_feedback_summary(
        detection, verification, decision, opportunity, deployment,
        businesses_contributing
    )

    benchmark_summary = benchmark_store.summary() if benchmark_store else {}

    confidence = (
        "high" if businesses_contributing >= 20
        else "medium" if businesses_contributing >= 5
        else "low"
    )

    return {
        "feedback_version": f"v1.0.{businesses_contributing}",
        "generated_at": datetime.utcnow().isoformat(),
        "businesses_contributing": businesses_contributing,
        "confidence": confidence,
        "detection_feedback": detection,
        "verification_feedback": verification,
        "decision_feedback": decision,
        "opportunity_feedback": opportunity,
        "deployment_feedback": deployment,
        "benchmark_summary": benchmark_summary,
        "improvement_summary": summary,
    }
