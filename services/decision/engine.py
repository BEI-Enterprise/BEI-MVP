"""
BEI Decision Intelligence Engine
Selects the single Primary Constraint from verified, scored constraints.
Aligned with BEI Master Architecture Section 8 — Decision Intelligence.
Golden Rule 4: One Primary Constraint.
Golden Rule 10: Every Decision Must Be Explainable.
"""

from typing import Any


def select_primary_constraint(
    opportunities: list[dict[str, Any]],
    health: dict[str, Any]
) -> dict[str, Any]:
    """
    Select the single Primary Constraint.
    Decision logic:
    1. Only verified constraints are eligible
    2. Ranked by composite score: verification_score + detection_score + opportunity value weight
    3. Primary constraint is the highest ranked verified constraint
    4. All others become secondary constraints
    5. Every decision is fully explainable
    """

    verified = [c for c in opportunities if c.get("verified")]
    unverified = [c for c in opportunities if not c.get("verified")]

    if not verified:
        return {
            "primary_constraint": None,
            "secondary_constraints": [],
            "unverified_flags": unverified,
            "decision_explanation": "No constraints passed verification. No primary constraint selected.",
            "confidence": "none",
        }

    def composite_score(c: dict) -> float:
        verification = c.get("verification_score", 0)
        detection = c.get("detection_score", 0) * 5
        opp_high = c.get("opportunity", {}).get("value_high", 0)
        opp_weight = min(opp_high / 100000, 20)
        severity_bonus = {"high": 15, "medium": 5, "low": 0}.get(c.get("severity", "medium"), 0)
        return verification + detection + opp_weight + severity_bonus

    ranked = sorted(verified, key=composite_score, reverse=True)

    primary = ranked[0]
    secondary = ranked[1:]

    explanation_parts = [
        f"'{primary['name']}' selected as Primary Constraint.",
        f"Verification score: {primary['verification_score']}/100.",
        f"Detection score: {primary['detection_score']}/10.",
        f"Severity: {primary['severity'].upper()}.",
        f"Opportunity range: £{primary['opportunity']['value_low']:,} — £{primary['opportunity']['value_high']:,}.",
        f"Tests passed: {primary['tests_passed']}/{primary['total_tests']}.",
    ]

    if secondary:
        explanation_parts.append(
            f"Secondary constraints identified: {', '.join(c['name'] for c in secondary[:3])}."
        )

    return {
        "primary_constraint": primary,
        "secondary_constraints": secondary[:3],
        "unverified_flags": unverified,
        "decision_explanation": " ".join(explanation_parts),
        "confidence": "high" if primary["verification_score"] >= 80 else "medium" if primary["verification_score"] >= 60 else "low",
    }
