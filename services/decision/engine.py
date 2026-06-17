"""
BEI Decision Intelligence Engine — Phase 7 Update
Selects the single Primary Constraint using network intelligence.
Aligned with BEI Master Architecture Section 8 — Decision Intelligence.

Golden Rule 4: One Primary Constraint.
Golden Rule 10: Every Decision Must Be Explainable.

Now reads from Constraint Network — not just individual scores.
Network dominance score influences primary selection.
Root cause confidence influences ranking.
"""

from typing import Any


def select_primary_constraint(
    opportunities: list[dict[str, Any]],
    health: dict[str, Any],
    network: dict[str, Any] = None,
) -> dict[str, Any]:
    """
    Select the single Primary Constraint.
    Uses network intelligence when available.

    Decision logic:
    1. Only verified constraints are eligible
    2. Network dominance score is primary ranking factor
    3. Root cause confidence influences ranking
    4. Verification score confirms reliability
    5. Opportunity value confirms business impact
    6. One primary constraint selected — all others secondary
    7. Every decision fully explainable
    """

    verified = [c for c in opportunities if c.get("verified")]
    unverified = [c for c in opportunities if not c.get("verified")]

    if not verified:
        return {
            "primary_constraint": None,
            "secondary_constraints": [],
            "unverified_flags": unverified,
            "decision_explanation": (
                "No constraints passed verification. "
                "No primary constraint selected. "
                "Golden Rule 2 enforced — no recommendation without verification."
            ),
            "confidence": "none",
            "network_used": network is not None,
        }

    # Enrich verified constraints with network scores if available
    network_nodes = {}
    if network and network.get("nodes"):
        for node in network["nodes"]:
            network_nodes[node["key"]] = node

    def composite_score(c: dict) -> float:
        key = c.get("key", "")
        network_node = network_nodes.get(key, {})

        # Base scores
        verification = c.get("verification_score", 0)
        detection = c.get("detection_score", 0) * 5
        opp_high = c.get("opportunity", {}).get("value_high", 0)
        opp_weight = min(opp_high / 100000, 20)

        # Severity bonus
        severity_bonus = {"high": 15, "medium": 5, "low": 0}.get(
            c.get("severity", "medium"), 0
        )

        # Network bonuses
        dominance_bonus = network_node.get("dominance_score", 0) * 0.5
        cascade_bonus = network_node.get("cascade_depth", 0) * 5
        root_confidence_bonus = {
            "high": 20, "medium": 10, "low": 0
        }.get(network_node.get("root_cause_confidence", "low"), 0)

        # Root cause bonus
        root_bonus = 15 if c.get("is_root_cause") else 0

        total = (
            verification
            + detection
            + opp_weight
            + severity_bonus
            + dominance_bonus
            + cascade_bonus
            + root_confidence_bonus
            + root_bonus
        )

        return total

    ranked = sorted(verified, key=composite_score, reverse=True)

    primary = ranked[0]
    secondary = ranked[1:]

    # Build explanation
    primary_network = network_nodes.get(primary.get("key", ""), {})

    explanation_parts = [
        f"'{primary['name']}' selected as Primary Constraint.",
        f"Verification score: {primary['verification_score']}/100.",
        f"Detection score: {primary['detection_score']}/10.",
        f"Severity: {primary['severity'].upper()}.",
        f"Opportunity range: "
        f"£{primary['opportunity']['value_low']:,} — "
        f"£{primary['opportunity']['value_high']:,}.",
        f"Tests passed: {primary['tests_passed']}/{primary['total_tests']}.",
    ]

    if primary_network:
        explanation_parts.append(
            f"Network dominance score: {primary_network.get('dominance_score', 0)}/100."
        )
        explanation_parts.append(
            f"Root cause confidence: {primary_network.get('root_cause_confidence', 'unknown')}."
        )
        cascade = primary_network.get("cascade_chain", [])
        if cascade:
            explanation_parts.append(
                f"Cascades into: {', '.join(cascade)}."
            )

    if secondary:
        explanation_parts.append(
            f"Secondary constraints: "
            f"{', '.join(c['name'] for c in secondary[:3])}."
        )

    confidence = (
        "high" if primary["verification_score"] >= 80
        else "medium" if primary["verification_score"] >= 60
        else "low"
    )

    return {
        "primary_constraint": primary,
        "secondary_constraints": secondary[:3],
        "unverified_flags": unverified,
        "decision_explanation": " ".join(explanation_parts),
        "confidence": confidence,
        "network_used": network is not None,
    }
