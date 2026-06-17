"""
BEI Constraint Verification Engine — Phase 6
Challenges every detected constraint before it influences any recommendation.
Aligned with BEI Master Architecture Sections 12, 13, 14, 15.

CORE PRINCIPLE:
The purpose is not to prove BEI correct.
The purpose is to prevent BEI being wrong.

Golden Rule 2: Verification Before Recommendation.
Golden Rule 3: Root Causes Over Symptoms.
Golden Rule 10: Every Decision Must Be Explainable.
Golden Rule 11: Every Constraint Must Be Verifiable.

Five tests per constraint:
1. Evidence Test
2. Alternative Cause Test
3. Dependency Test
4. Impact Test
5. Intervention Test

Constraints are tested in context of all other detected constraints.
Parent-child relationships identified and penalised.
Unverified constraints (score < 60) never influence recommendations.
"""

from typing import Any


# ============================================================
# CONSTRAINT RELATIONSHIP MAP
# Defines known parent-child relationships between constraints.
# Child constraints may be symptoms of their parent.
# Parent presence penalises child in verification.
# ============================================================

CONSTRAINT_PARENTS = {
    "management_bottleneck":    ["founder_dependency"],
    "capacity_constraint":      ["staffing_inefficiency", "founder_dependency"],
    "lead_response_deficit":    ["trust_infrastructure_deficit", "offer_weakness"],
    "staffing_inefficiency":    [],
    "offer_weakness":           [],
    "trust_infrastructure_deficit": [],
    "founder_dependency":       [],
    "pricing_constraint":       [],
    "revenue_concentration_risk": [],
    "market_selection_risk":    [],
}

# Constraints with no direct deployment intervention
RECOMMENDATION_ONLY = {
    "market_selection_risk",
    "pricing_constraint",
    "staffing_inefficiency",
    "management_bottleneck",
}

# Minimum evidence items required for evidence test to pass
MIN_EVIDENCE_COUNT = 2


# ============================================================
# TEST 1 — EVIDENCE TEST
# Is there sufficient evidence to support this constraint?
# ============================================================

def _evidence_test(constraint: dict, twin: dict) -> dict:
    evidence = constraint.get("evidence", [])
    count = len(evidence)
    detection_score = constraint.get("detection_score", 0)

    passes = count >= MIN_EVIDENCE_COUNT and detection_score >= 5

    if passes:
        note = f"{count} evidence item(s) found. Detection score {detection_score}/10 confirms signal strength."
    else:
        note = f"Insufficient evidence. {count} item(s) found, detection score {detection_score}/10."

    return {
        "test": "evidence",
        "passes": passes,
        "note": note,
        "evidence_count": count,
        "detection_score": detection_score,
    }


# ============================================================
# TEST 2 — ALTERNATIVE CAUSE TEST
# Could another detected constraint better explain this symptom?
# ============================================================

def _alternative_cause_test(
    constraint: dict,
    all_detected: list[dict],
    twin: dict,
) -> dict:
    key = constraint["key"]
    alternatives = []
    all_keys = [c["key"] for c in all_detected]

    # Lead Response Deficit — could be caused by trust or offer weakness
    if key == "lead_response_deficit":
        if "trust_infrastructure_deficit" in all_keys:
            alternatives.append(
                "Trust Infrastructure Deficit is also present and may be causing low conversion "
                "rather than lead response speed."
            )
        if "offer_weakness" in all_keys:
            alternatives.append(
                "Offer Weakness is also present and may be causing low conversion "
                "rather than a process failure."
            )

    # Capacity Constraint — could be caused by staffing inefficiency
    if key == "capacity_constraint":
        if "staffing_inefficiency" in all_keys:
            alternatives.append(
                "Staffing Inefficiency is also present and may be the root cause "
                "of the capacity ceiling rather than workload alone."
            )

    # Management Bottleneck — could be caused by founder dependency
    if key == "management_bottleneck":
        if "founder_dependency" in all_keys:
            alternatives.append(
                "Founder Dependency is also present and is likely the root cause "
                "of management bottleneck symptoms."
            )

    # Offer Weakness — could be related to pricing
    if key == "offer_weakness":
        if "pricing_constraint" in all_keys:
            alternatives.append(
                "Pricing Constraint is also present. Offer and pricing weaknesses "
                "often share the same strategic root cause."
            )

    passes = len(alternatives) == 0

    return {
        "test": "alternative_cause",
        "passes": passes,
        "note": (
            "No stronger alternative cause identified."
            if passes
            else f"Alternative causes identified: {' | '.join(alternatives)}"
        ),
        "alternatives": alternatives,
    }


# ============================================================
# TEST 3 — DEPENDENCY TEST
# Does this constraint depend on another being resolved first?
# Is this constraint a symptom of a deeper root cause?
# ============================================================

def _dependency_test(
    constraint: dict,
    all_detected: list[dict],
) -> dict:
    key = constraint["key"]
    all_keys = [c["key"] for c in all_detected]
    parents = CONSTRAINT_PARENTS.get(key, [])

    active_parents = [p for p in parents if p in all_keys]

    passes = len(active_parents) == 0

    if passes:
        note = "No upstream root constraints identified. This constraint stands independently."
    else:
        parent_names = []
        for c in all_detected:
            if c["key"] in active_parents:
                parent_names.append(c["name"])
        note = (
            f"This constraint may be a symptom of: {', '.join(parent_names)}. "
            f"Resolving the root cause first may resolve this constraint."
        )

    return {
        "test": "dependency",
        "passes": passes,
        "note": note,
        "active_parents": active_parents,
        "parent_names": [
            c["name"] for c in all_detected if c["key"] in active_parents
        ],
    }


# ============================================================
# TEST 4 — IMPACT TEST
# Is the impact on business performance material?
# ============================================================

def _impact_test(
    constraint: dict,
    health: dict,
) -> dict:
    detection_score = constraint.get("detection_score", 0)
    severity = constraint.get("severity", "medium")

    # Map constraint to its most relevant health pillar
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

    pillar = pillar_map.get(constraint["key"], "growth")
    pillar_score = health["pillars"].get(pillar, {}).get("score", 50)
    pillar_band = health["pillars"].get(pillar, {}).get("band", "moderate")

    # Impact is material if detection score >= 5 AND pillar score below benchmark
    # OR severity is high
    passes = (
        detection_score >= 5 and pillar_score <= 65
    ) or severity == "high"

    note = (
        f"Detection score {detection_score}/10. "
        f"Related pillar ({pillar}): {pillar_score}/100 ({pillar_band}). "
        f"Severity: {severity.upper()}. "
        f"{'Material impact confirmed.' if passes else 'Impact insufficient to warrant primary consideration.'}"
    )

    return {
        "test": "impact",
        "passes": passes,
        "note": note,
        "related_pillar": pillar,
        "pillar_score": pillar_score,
        "severity": severity,
    }


# ============================================================
# TEST 5 — INTERVENTION TEST
# Is there a realistic intervention available?
# ============================================================

def _intervention_test(constraint: dict) -> dict:
    key = constraint["key"]
    is_recommendation_only = key in RECOMMENDATION_ONLY

    passes = not is_recommendation_only

    if passes:
        note = "Direct intervention pathway exists. Eligible for deployment engine."
    else:
        note = (
            "No direct auto-deployment available for this constraint. "
            "Recommendation-only. Human execution required."
        )

    return {
        "test": "intervention",
        "passes": passes,
        "note": note,
        "deployment_eligible": passes,
        "recommendation_only": is_recommendation_only,
    }


# ============================================================
# VERIFICATION SCORE CALCULATION
# Each test = 20 points. Maximum 100. Verified threshold = 60.
# ============================================================

def _calculate_verification_score(tests: list[dict]) -> int:
    points_per_test = 20
    passed = sum(1 for t in tests if t["passes"])
    return passed * points_per_test


# ============================================================
# VERIFICATION EXPLANATION
# Every verification decision must be fully explainable.
# Golden Rule 10: Every Decision Must Be Explainable.
# ============================================================

def _build_explanation(
    constraint: dict,
    tests: list[dict],
    verification_score: int,
    verified: bool,
) -> str:
    parts = [
        f"'{constraint['name']}' — Verification score: {verification_score}/100.",
    ]

    for test in tests:
        status = "PASS" if test["passes"] else "FAIL"
        parts.append(f"{test['test'].replace('_', ' ').title()}: {status} — {test['note']}")

    if verified:
        parts.append(
            f"VERIFIED: {verification_score}/100 — passed {sum(1 for t in tests if t['passes'])}/5 tests. "
            f"Eligible to proceed to Opportunity Engine."
        )
    else:
        parts.append(
            f"NOT VERIFIED: {verification_score}/100 — insufficient evidence or stronger "
            f"alternative causes identified. Will not influence recommendations."
        )

    return " | ".join(parts)


# ============================================================
# MAIN VERIFICATION FUNCTION
# ============================================================

def verify_constraints(
    detected: list[dict[str, Any]],
    twin: dict[str, Any],
    health: dict[str, Any],
) -> list[dict[str, Any]]:
    """
    Run all five verification tests against each detected constraint.
    Tests run in context of all detected constraints — not in isolation.
    Returns constraints with full verification results attached.
    Unverified constraints (score < 60) are flagged but not removed.
    They will not influence recommendations.
    """

    verified_list = []

    for constraint in detected:
        tests = [
            _evidence_test(constraint, twin),
            _alternative_cause_test(constraint, detected, twin),
            _dependency_test(constraint, detected),
            _impact_test(constraint, health),
            _intervention_test(constraint),
        ]

        tests_passed = sum(1 for t in tests if t["passes"])
        total_tests = len(tests)
        verification_score = _calculate_verification_score(tests)
        verified = verification_score >= 60

        explanation = _build_explanation(constraint, tests, verification_score, verified)

        verified_constraint = {
            **constraint,
            "verification_tests": tests,
            "tests_passed": tests_passed,
            "total_tests": total_tests,
            "verification_score": verification_score,
            "verified": verified,
            "verification_status": "verified" if verified else "unverified",
            "verification_explanation": explanation,
            "is_root_cause": len(_dependency_test(constraint, detected)["active_parents"]) == 0,
        }

        verified_list.append(verified_constraint)

    # Sort: verified first, then by verification score, then detection score
    verified_list.sort(
        key=lambda x: (
            1 if x["verified"] else 0,
            x["verification_score"],
            x["detection_score"],
        ),
        reverse=True,
    )

    return verified_list
