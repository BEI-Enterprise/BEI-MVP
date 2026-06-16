"""
BEI Constraint Verification Engine
Challenges each detected constraint before it influences recommendations.
Aligned with BEI Master Architecture Section 6 — Constraint Verification.
Golden Rule 2: Verification Before Recommendation.
Golden Rule 11: Every Constraint Must Be Verifiable.
Five tests: Evidence, Alternative Cause, Dependency, Impact, Intervention.
"""

from typing import Any


def _evidence_test(constraint: dict, twin: dict) -> dict:
    """Is there sufficient evidence to support this constraint?"""
    evidence_count = len(constraint.get("evidence", []))
    passes = evidence_count >= 1
    return {
        "test": "evidence",
        "passes": passes,
        "note": f"{evidence_count} evidence item(s) found." if passes else "Insufficient evidence."
    }


def _alternative_cause_test(constraint: dict, twin: dict, all_detected: list) -> dict:
    """Could another constraint better explain the symptom?"""
    key = constraint["key"]
    alternatives = []

    if key == "lead_response_deficit":
        if any(c["key"] == "trust_infrastructure_deficit" for c in all_detected):
            alternatives.append("Trust Infrastructure Deficit may be causing low conversion.")
        if any(c["key"] == "offer_weakness" for c in all_detected):
            alternatives.append("Offer Weakness may be causing low conversion.")

    if key == "capacity_constraint":
        if any(c["key"] == "staffing_inefficiency" for c in all_detected):
            alternatives.append("Staffing Inefficiency may be the root cause of capacity issues.")

    passes = len(alternatives) == 0
    return {
        "test": "alternative_cause",
        "passes": passes,
        "note": "No stronger alternative cause identified." if passes else f"Alternative causes: {'; '.join(alternatives)}",
        "alternatives": alternatives,
    }


def _dependency_test(constraint: dict, twin: dict) -> dict:
    """Does this constraint depend on another constraint being resolved first?"""
    key = constraint["key"]
    dependencies = {
        "capacity_constraint": ["staffing_inefficiency", "founder_dependency"],
        "lead_response_deficit": ["trust_infrastructure_deficit", "offer_weakness"],
        "management_bottleneck": ["founder_dependency"],
    }
    deps = dependencies.get(key, [])
    passes = len(deps) == 0
    return {
        "test": "dependency",
        "passes": passes,
        "note": "No upstream dependencies identified." if passes else f"May depend on resolving: {', '.join(deps)}",
        "dependencies": deps,
    }


def _impact_test(constraint: dict, health: dict) -> dict:
    """Is the impact on business performance material?"""
    score = constraint.get("detection_score", 0)
    passes = score >= 5
    return {
        "test": "impact",
        "passes": passes,
        "note": f"Detection score {score}/10 — {'material impact confirmed' if passes else 'impact insufficient'}.",
    }


def _intervention_test(constraint: dict) -> dict:
    """Is there a realistic intervention available for this constraint?"""
    non_deployable = ["market_selection_risk"]
    key = constraint["key"]
    passes = key not in non_deployable
    return {
        "test": "intervention",
        "passes": passes,
        "note": "Intervention pathway exists." if passes else "No direct deployment intervention available — recommendation only.",
    }


def verify_constraints(
    detected: list[dict[str, Any]],
    twin: dict[str, Any],
    health: dict[str, Any]
) -> list[dict[str, Any]]:
    """
    Run all five verification tests against each detected constraint.
    Returns constraints with verification results attached.
    """

    verified = []

    for constraint in detected:
        tests = [
            _evidence_test(constraint, twin),
            _alternative_cause_test(constraint, twin, detected),
            _dependency_test(constraint, twin),
            _impact_test(constraint, health),
            _intervention_test(constraint),
        ]

        tests_passed = sum(1 for t in tests if t["passes"])
        total_tests = len(tests)
        verification_score = round((tests_passed / total_tests) * 100)

        verified_constraint = {
            **constraint,
            "verification_tests": tests,
            "tests_passed": tests_passed,
            "total_tests": total_tests,
            "verification_score": verification_score,
            "verified": verification_score >= 60,
            "verification_status": "verified" if verification_score >= 60 else "unverified",
        }

        verified.append(verified_constraint)

    verified.sort(key=lambda x: (x["verification_score"], x["detection_score"]), reverse=True)
    return verified
