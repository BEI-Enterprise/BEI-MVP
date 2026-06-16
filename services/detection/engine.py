"""
BEI Constraint Detection Engine
Detects constraints from the Business Twin.
Aligned with BEI Master Architecture Section 5 — Constraint Detection.
Golden Rule 1: Detection Is Not Proof.
All detected constraints are hypotheses only until verified.
"""

from typing import Any


def detect_constraints(twin: dict[str, Any], health: dict[str, Any]) -> list[dict[str, Any]]:
    """
    Detect constraints from Business Twin and Health scores.
    Returns a list of detected constraint hypotheses.
    Each constraint includes: key, name, hypothesis, evidence, detection_score.
    """

    detected = []

    # Trust Infrastructure Deficit
    trust = twin["marketing"]["trust_infrastructure"]
    if trust in ["None", "Very little"]:
        detected.append({
            "key": "trust_infrastructure_deficit",
            "name": "Trust Infrastructure Deficit",
            "hypothesis": "Insufficient social proof is limiting new client conversion.",
            "evidence": [
                f"Business reported '{trust}' proof assets (reviews, case studies, testimonials).",
                f"Trust pillar score: {health['pillars']['risk']['score']} — risk elevated."
            ],
            "detection_score": 9 if trust == "None" else 6,
            "severity": "high" if trust == "None" else "medium",
            "verified": False,
        })

    # Lead Response Deficit
    conversion = twin["sales"]["conversion_rate"]
    if conversion in ["Less than 1 in 10", "1-2 in 10"]:
        detected.append({
            "key": "lead_response_deficit",
            "name": "Lead Response Deficit",
            "hypothesis": "Low conversion rate suggests leads are not being responded to effectively.",
            "evidence": [
                f"Enquiry-to-client conversion rate reported as '{conversion}'.",
                "This is below typical benchmarks for the sector.",
            ],
            "detection_score": 8 if conversion == "Less than 1 in 10" else 6,
            "severity": "high" if conversion == "Less than 1 in 10" else "medium",
            "verified": False,
        })

    # Pricing Constraint
    pricing = twin["sales"]["pricing_confidence"]
    if pricing in ["Not confident at all", "A little unsure"]:
        detected.append({
            "key": "pricing_constraint",
            "name": "Pricing Constraint",
            "hypothesis": "Uncertainty in pricing is likely suppressing revenue and margin.",
            "evidence": [
                f"Owner reported being '{pricing}' that pricing is set correctly.",
                f"Strategy pillar score: {health['pillars']['strategy']['score']}.",
            ],
            "detection_score": 8 if pricing == "Not confident at all" else 5,
            "severity": "high" if pricing == "Not confident at all" else "medium",
            "verified": False,
        })

    # Capacity Constraint
    capacity = twin["operations"]["capacity_utilisation"]
    if capacity in ["Fully stretched", "85-95%"]:
        detected.append({
            "key": "capacity_constraint",
            "name": "Capacity Constraint",
            "hypothesis": "Team is operating at or near full capacity, limiting growth.",
            "evidence": [
                f"Capacity utilisation reported as '{capacity}'.",
                f"Operations pillar score: {health['pillars']['operations']['score']}.",
            ],
            "detection_score": 8 if capacity == "Fully stretched" else 6,
            "severity": "high" if capacity == "Fully stretched" else "medium",
            "verified": False,
        })

    # Founder Dependency
    founder = twin["risk"]["founder_dependency"]
    if founder in ["It would stop without me", "It would struggle a lot"]:
        detected.append({
            "key": "founder_dependency",
            "name": "Founder Dependency",
            "hypothesis": "Business is critically dependent on the founder, limiting scalability.",
            "evidence": [
                f"Business reported it '{founder}' if founder took 2 weeks off.",
                "High founder dependency limits capacity, delegation and exit value.",
            ],
            "detection_score": 9 if founder == "It would stop without me" else 7,
            "severity": "high" if founder == "It would stop without me" else "medium",
            "verified": False,
        })

    # Revenue Concentration Risk
    concentration = twin["risk"]["revenue_concentration"]
    if concentration in ["Most of it", "Three-fifths to four-fifths"]:
        detected.append({
            "key": "revenue_concentration_risk",
            "name": "Revenue Concentration Risk",
            "hypothesis": "Over-reliance on a small number of clients creates fragility.",
            "evidence": [
                f"Top 3 clients account for '{concentration}' of total revenue.",
                f"Risk pillar score: {health['pillars']['risk']['score']}.",
            ],
            "detection_score": 8 if concentration == "Most of it" else 6,
            "severity": "high" if concentration == "Most of it" else "medium",
            "verified": False,
        })

    # Offer Weakness
    offer = twin["sales"]["offer_clarity"]
    if offer in ["Not at all clear", "A bit confusing"]:
        detected.append({
            "key": "offer_weakness",
            "name": "Offer Weakness",
            "hypothesis": "Unclear offer is reducing conversion and market differentiation.",
            "evidence": [
                f"Offer rated as '{offer}' to a new visitor.",
                f"Strategy pillar score: {health['pillars']['strategy']['score']}.",
            ],
            "detection_score": 7 if offer == "Not at all clear" else 5,
            "severity": "high" if offer == "Not at all clear" else "medium",
            "verified": False,
        })

    # Market Selection Risk
    market = twin["marketing"]["market_growth"]
    if market in ["Shrinking quickly", "Shrinking"]:
        detected.append({
            "key": "market_selection_risk",
            "name": "Market Selection Risk",
            "hypothesis": "Operating in a declining market creates structural headwinds.",
            "evidence": [
                f"Market reported as '{market}'.",
                f"Context pillar score: {health['pillars']['context']['score']}.",
            ],
            "detection_score": 7 if market == "Shrinking quickly" else 5,
            "severity": "high" if market == "Shrinking quickly" else "medium",
            "verified": False,
        })

    # Management Bottleneck
    bottleneck = twin["operations"]["delivery_bottleneck"]
    if bottleneck == "Managing the team":
        detected.append({
            "key": "management_bottleneck",
            "name": "Management Bottleneck",
            "hypothesis": "Management overhead is slowing delivery and limiting throughput.",
            "evidence": [
                "Owner identified 'managing the team' as the primary delivery bottleneck.",
            ],
            "detection_score": 6,
            "severity": "medium",
            "verified": False,
        })

    # Staffing Inefficiency
    if bottleneck == "Doing the actual work" and twin["operations"]["team_size"] in ["Just me", "2-5"]:
        detected.append({
            "key": "staffing_inefficiency",
            "name": "Staffing Inefficiency",
            "hypothesis": "Small team doing all delivery work is creating a capacity ceiling.",
            "evidence": [
                f"Team size: {twin['operations']['team_size']}.",
                "Primary bottleneck identified as doing the actual work.",
            ],
            "detection_score": 6,
            "severity": "medium",
            "verified": False,
        })

    detected.sort(key=lambda x: x["detection_score"], reverse=True)
    return detected
