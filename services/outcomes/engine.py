"""
BEI Outcome Measurement Engine — Phase 11
Measures actual business improvement from every deployment.
Aligned with BEI Master Architecture Section 11 — Outcome Measurement.
Aligned with BEI Master Context Section 21 — Learning Philosophy.

Golden Rule 7: Learning From Outcomes.
Golden Rule 9: Business Impact Over Activity.
Golden Rule 10: Every Decision Must Be Explainable.
Golden Rule 12: Every Deployment Must Be Measurable.

Every deployment must have:
- A baseline measurement
- An expected outcome
- An actual outcome (recorded at measurement date)
- A variance analysis
- A success score
"""

from typing import Any
from datetime import datetime, timedelta
import uuid


# ============================================================
# MEASUREMENT METRICS PER CONSTRAINT
# Defines what to measure for each constraint type.
# ============================================================

CONSTRAINT_METRICS = {
    "trust_infrastructure_deficit": [
        {
            "metric_key": "google_review_count",
            "metric_name": "Google Review Count",
            "unit": "reviews",
            "direction": "higher_better",
            "measurement_timeframe_days": 90,
        },
        {
            "metric_key": "google_rating",
            "metric_name": "Google Rating",
            "unit": "stars",
            "direction": "higher_better",
            "measurement_timeframe_days": 90,
        },
        {
            "metric_key": "conversion_rate",
            "metric_name": "Enquiry to Client Conversion Rate",
            "unit": "percentage",
            "direction": "higher_better",
            "measurement_timeframe_days": 90,
        },
    ],
    "lead_response_deficit": [
        {
            "metric_key": "avg_response_time_hours",
            "metric_name": "Average Lead Response Time",
            "unit": "hours",
            "direction": "lower_better",
            "measurement_timeframe_days": 30,
        },
        {
            "metric_key": "conversion_rate",
            "metric_name": "Lead to Client Conversion Rate",
            "unit": "percentage",
            "direction": "higher_better",
            "measurement_timeframe_days": 90,
        },
    ],
    "pricing_constraint": [
        {
            "metric_key": "avg_deal_value",
            "metric_name": "Average Deal Value",
            "unit": "GBP",
            "direction": "higher_better",
            "measurement_timeframe_days": 90,
        },
        {
            "metric_key": "gross_margin_pct",
            "metric_name": "Gross Margin Percentage",
            "unit": "percentage",
            "direction": "higher_better",
            "measurement_timeframe_days": 90,
        },
    ],
    "capacity_constraint": [
        {
            "metric_key": "team_utilisation_pct",
            "metric_name": "Team Utilisation Percentage",
            "unit": "percentage",
            "direction": "lower_better",
            "measurement_timeframe_days": 60,
        },
        {
            "metric_key": "revenue_per_team_member",
            "metric_name": "Revenue Per Team Member",
            "unit": "GBP",
            "direction": "higher_better",
            "measurement_timeframe_days": 90,
        },
    ],
    "founder_dependency": [
        {
            "metric_key": "founder_hours_per_week",
            "metric_name": "Founder Hours Per Week In Business",
            "unit": "hours",
            "direction": "lower_better",
            "measurement_timeframe_days": 60,
        },
        {
            "metric_key": "decisions_without_founder_pct",
            "metric_name": "Decisions Made Without Founder",
            "unit": "percentage",
            "direction": "higher_better",
            "measurement_timeframe_days": 90,
        },
    ],
    "revenue_concentration_risk": [
        {
            "metric_key": "top_client_revenue_pct",
            "metric_name": "Top Client Revenue Percentage",
            "unit": "percentage",
            "direction": "lower_better",
            "measurement_timeframe_days": 180,
        },
        {
            "metric_key": "client_count",
            "metric_name": "Active Client Count",
            "unit": "clients",
            "direction": "higher_better",
            "measurement_timeframe_days": 180,
        },
    ],
    "offer_weakness": [
        {
            "metric_key": "offer_page_conversion_rate",
            "metric_name": "Offer Page Conversion Rate",
            "unit": "percentage",
            "direction": "higher_better",
            "measurement_timeframe_days": 60,
        },
        {
            "metric_key": "organic_traffic",
            "metric_name": "Organic Traffic",
            "unit": "visits",
            "direction": "higher_better",
            "measurement_timeframe_days": 90,
        },
    ],
    "staffing_inefficiency": [
        {
            "metric_key": "hours_per_client_delivery",
            "metric_name": "Hours Per Client Delivery",
            "unit": "hours",
            "direction": "lower_better",
            "measurement_timeframe_days": 90,
        },
        {
            "metric_key": "revenue_per_team_member",
            "metric_name": "Revenue Per Team Member",
            "unit": "GBP",
            "direction": "higher_better",
            "measurement_timeframe_days": 90,
        },
    ],
    "management_bottleneck": [
        {
            "metric_key": "delivery_turnaround_days",
            "metric_name": "Delivery Turnaround Time",
            "unit": "days",
            "direction": "lower_better",
            "measurement_timeframe_days": 60,
        },
    ],
    "market_selection_risk": [
        {
            "metric_key": "new_client_acquisition_rate",
            "metric_name": "New Client Acquisition Rate",
            "unit": "clients_per_month",
            "direction": "higher_better",
            "measurement_timeframe_days": 180,
        },
    ],
}


# ============================================================
# SUCCESS SCORE CALCULATION
# Scores the outcome 0-100 based on actual vs expected.
# ============================================================

def _calculate_success_score(
    baseline: float,
    expected: float,
    actual: float,
    direction: str,
) -> tuple[int, str]:
    """
    Calculate success score 0-100 and outcome status.
    direction: 'higher_better' or 'lower_better'
    """

    if expected == baseline:
        return 50, "no_change_expected"

    if direction == "higher_better":
        expected_improvement = expected - baseline
        actual_improvement = actual - baseline

        if expected_improvement <= 0:
            return 50, "no_change_expected"

        ratio = actual_improvement / expected_improvement

    else:  # lower_better
        expected_improvement = baseline - expected
        actual_improvement = baseline - actual

        if expected_improvement <= 0:
            return 50, "no_change_expected"

        ratio = actual_improvement / expected_improvement

    if ratio >= 1.2:
        score = 95
        status = "exceeded"
    elif ratio >= 0.9:
        score = 80
        status = "met"
    elif ratio >= 0.6:
        score = 60
        status = "partially_met"
    elif ratio >= 0.2:
        score = 30
        status = "not_met"
    elif ratio >= 0:
        score = 15
        status = "minimal_improvement"
    else:
        score = 5
        status = "negative_outcome"

    return score, status


def _build_outcome_explanation(
    constraint_name: str,
    metric_name: str,
    baseline: float,
    expected: float,
    actual: float,
    unit: str,
    success_score: int,
    outcome_status: str,
    direction: str,
) -> str:
    """Build plain English outcome explanation."""

    status_text = {
        "exceeded": "exceeded expectations",
        "met": "met expectations",
        "partially_met": "partially met expectations",
        "not_met": "did not meet expectations",
        "minimal_improvement": "showed minimal improvement",
        "negative_outcome": "showed a negative outcome",
        "no_change_expected": "no change was expected",
    }.get(outcome_status, "produced an unclear result")

    direction_text = "improved" if (
        (direction == "higher_better" and actual > baseline) or
        (direction == "lower_better" and actual < baseline)
    ) else "worsened"

    return (
        f"Deployment for '{constraint_name}' {status_text}. "
        f"{metric_name} {direction_text} from {baseline} {unit} "
        f"to {actual} {unit} (expected: {expected} {unit}). "
        f"Success score: {success_score}/100."
    )


# ============================================================
# OUTCOME RECORD CREATION
# Called when a deployment is executed.
# ============================================================

def create_outcome_records(
    deployment_package: dict[str, Any],
    baseline_values: dict[str, float],
    expected_improvements: dict[str, float] = None,
) -> list[dict[str, Any]]:
    """
    Create outcome records at deployment time.
    Stores baseline and expected values.
    Actual values recorded later via update_outcome_record.
    Golden Rule 12: Every Deployment Must Be Measurable.
    """

    constraint_key = deployment_package.get("constraint_key", "")
    deployment_id = deployment_package.get("deployment_id", str(uuid.uuid4()))
    business_id = deployment_package.get("business_id", "")

    metrics = CONSTRAINT_METRICS.get(constraint_key, [])
    records = []
    now = datetime.utcnow()

    for metric in metrics:
        metric_key = metric["metric_key"]
        baseline = baseline_values.get(metric_key, 0.0)
        timeframe = metric["measurement_timeframe_days"]
        measurement_date = now + timedelta(days=timeframe)

        # Calculate expected value
        if expected_improvements and metric_key in expected_improvements:
            expected = expected_improvements[metric_key]
        else:
            # Default expected improvement based on direction
            if metric["direction"] == "higher_better":
                expected = baseline * 1.20  # 20% improvement default
            else:
                expected = baseline * 0.80  # 20% reduction default

        record = {
            "outcome_id": str(uuid.uuid4()),
            "deployment_id": deployment_id,
            "business_id": business_id,
            "constraint_key": constraint_key,
            "metric_key": metric_key,
            "metric_name": metric["metric_name"],
            "unit": metric["unit"],
            "direction": metric["direction"],
            "baseline_value": baseline,
            "expected_value": round(expected, 2),
            "actual_value": None,
            "measurement_date": measurement_date.isoformat(),
            "timeframe_days": timeframe,
            "variance": None,
            "variance_pct": None,
            "outcome_status": "pending",
            "success_score": None,
            "outcome_explanation": None,
            "feeds_learning": True,
            "created_at": now.isoformat(),
            "updated_at": now.isoformat(),
        }
        records.append(record)

    return records


# ============================================================
# OUTCOME RECORD UPDATE
# Called when actual measurement is available.
# ============================================================

def update_outcome_record(
    record: dict[str, Any],
    actual_value: float,
) -> dict[str, Any]:
    """
    Update an outcome record with actual measurement.
    Calculates variance and success score.
    """

    baseline = record["baseline_value"]
    expected = record["expected_value"]
    direction = record["direction"]
    constraint_key = record["constraint_key"]
    metric_name = record["metric_name"]
    unit = record["unit"]

    variance = round(actual_value - baseline, 2)
    variance_pct = round((variance / baseline * 100), 1) if baseline != 0 else 0

    success_score, outcome_status = _calculate_success_score(
        baseline, expected, actual_value, direction
    )

    explanation = _build_outcome_explanation(
        constraint_key.replace("_", " ").title(),
        metric_name,
        baseline,
        expected,
        actual_value,
        unit,
        success_score,
        outcome_status,
        direction,
    )

    updated = {
        **record,
        "actual_value": actual_value,
        "variance": variance,
        "variance_pct": variance_pct,
        "outcome_status": outcome_status,
        "success_score": success_score,
        "outcome_explanation": explanation,
        "updated_at": datetime.utcnow().isoformat(),
    }

    return updated


# ============================================================
# DEPLOYMENT ACCURACY TRACKING
# Aggregates success scores per constraint type.
# Feeds Phase 12 Learning Engine.
# ============================================================

def calculate_deployment_accuracy(
    outcome_records: list[dict[str, Any]],
) -> dict[str, Any]:
    """
    Calculate deployment accuracy across all outcome records.
    Aggregates by constraint type for learning engine input.
    """

    by_constraint = {}

    for record in outcome_records:
        if record.get("success_score") is None:
            continue

        key = record["constraint_key"]
        if key not in by_constraint:
            by_constraint[key] = {
                "constraint_key": key,
                "total_outcomes": 0,
                "total_score": 0,
                "exceeded_count": 0,
                "met_count": 0,
                "not_met_count": 0,
                "negative_count": 0,
            }

        entry = by_constraint[key]
        entry["total_outcomes"] += 1
        entry["total_score"] += record["success_score"]

        status = record.get("outcome_status", "")
        if status == "exceeded":
            entry["exceeded_count"] += 1
        elif status == "met":
            entry["met_count"] += 1
        elif status in ("not_met", "minimal_improvement"):
            entry["not_met_count"] += 1
        elif status == "negative_outcome":
            entry["negative_count"] += 1

    results = []
    for key, data in by_constraint.items():
        avg_score = round(data["total_score"] / data["total_outcomes"])
        results.append({
            **data,
            "avg_success_score": avg_score,
            "accuracy_band": (
                "high" if avg_score >= 70
                else "medium" if avg_score >= 45
                else "low"
            ),
        })

    results.sort(key=lambda x: x["avg_success_score"], reverse=True)

    return {
        "total_outcomes_measured": len(outcome_records),
        "constraints_tracked": len(results),
        "by_constraint": results,
        "overall_accuracy": round(
            sum(r["avg_success_score"] for r in results) / len(results)
        ) if results else 0,
    }
