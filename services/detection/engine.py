"""
BEI Constraint Detection Engine — Phase 5
Detects constraints from the Business Twin.
Aligned with BEI Master Architecture Section 5 — Constraint Detection.

GOLDEN RULE 1: Detection Is Not Proof.
Every detected constraint is a hypothesis only.
Detection triggers verification — never recommendation.

Reads from Business Twin only — twin is the single source of truth.
All 10 MVP constraints covered.
Industry-specific relevance applied.
"""

from typing import Any


INDUSTRY_RELEVANCE = {
    "estate_agency": {
        "trust_infrastructure_deficit": "high",
        "lead_response_deficit": "high",
        "pricing_constraint": "medium",
        "staffing_inefficiency": "low",
        "management_bottleneck": "medium",
        "capacity_constraint": "medium",
        "founder_dependency": "medium",
        "revenue_concentration_risk": "medium",
        "offer_weakness": "medium",
        "market_selection_risk": "low",
        "leadership_capacity_gap": "low",
        "succession_risk": "medium",
        "technology_debt_risk": "medium",
        "cyber_security_exposure": "low",
        "client_concentration_risk_enterprise": "high",
        "governance_maturity_gap": "low",
        "delivery_execution_gap": "medium",
        "systematic_discounting_erosion": "low",
        "weak_gross_margin": "medium",
        "profitability_erosion": "high",
        "cash_runway_risk": "high",
        "unfavourable_cac_ltv_ratio": "medium",
        "excessive_leverage": "high",
        "revenue_growth_stagnation": "medium",
    },
    "marketing_agency": {
        "trust_infrastructure_deficit": "medium",
        "lead_response_deficit": "medium",
        "pricing_constraint": "high",
        "staffing_inefficiency": "medium",
        "management_bottleneck": "medium",
        "capacity_constraint": "high",
        "founder_dependency": "high",
        "revenue_concentration_risk": "medium",
        "offer_weakness": "high",
        "market_selection_risk": "low",
        "leadership_capacity_gap": "high",
        "succession_risk": "high",
        "technology_debt_risk": "low",
        "cyber_security_exposure": "low",
        "client_concentration_risk_enterprise": "medium",
        "governance_maturity_gap": "medium",
        "delivery_execution_gap": "high",
        "systematic_discounting_erosion": "high",
        "weak_gross_margin": "high",
        "profitability_erosion": "high",
        "cash_runway_risk": "high",
        "unfavourable_cac_ltv_ratio": "high",
        "excessive_leverage": "medium",
        "revenue_growth_stagnation": "high",
    },
    "accountancy_firm": {
        "trust_infrastructure_deficit": "medium",
        "lead_response_deficit": "low",
        "pricing_constraint": "medium",
        "staffing_inefficiency": "high",
        "management_bottleneck": "medium",
        "capacity_constraint": "high",
        "founder_dependency": "medium",
        "revenue_concentration_risk": "medium",
        "offer_weakness": "medium",
        "market_selection_risk": "low",
        "leadership_capacity_gap": "medium",
        "succession_risk": "medium",
        "technology_debt_risk": "medium",
        "cyber_security_exposure": "medium",
        "client_concentration_risk_enterprise": "medium",
        "governance_maturity_gap": "medium",
        "delivery_execution_gap": "high",
        "systematic_discounting_erosion": "medium",
        "weak_gross_margin": "high",
        "profitability_erosion": "high",
        "cash_runway_risk": "medium",
        "unfavourable_cac_ltv_ratio": "low",
        "excessive_leverage": "medium",
        "revenue_growth_stagnation": "medium",
    },
    "default": {
        "trust_infrastructure_deficit": "medium",
        "lead_response_deficit": "medium",
        "pricing_constraint": "medium",
        "staffing_inefficiency": "medium",
        "management_bottleneck": "medium",
        "capacity_constraint": "medium",
        "founder_dependency": "medium",
        "revenue_concentration_risk": "medium",
        "offer_weakness": "medium",
        "market_selection_risk": "medium",
        "leadership_capacity_gap": "medium",
        "succession_risk": "medium",
        "technology_debt_risk": "medium",
        "cyber_security_exposure": "medium",
        "client_concentration_risk_enterprise": "medium",
        "governance_maturity_gap": "medium",
        "delivery_execution_gap": "medium",
        "systematic_discounting_erosion": "medium",
        "weak_gross_margin": "medium",
        "profitability_erosion": "high",
        "cash_runway_risk": "high",
        "unfavourable_cac_ltv_ratio": "medium",
        "excessive_leverage": "medium",
        "revenue_growth_stagnation": "medium",
    },
}

INDUSTRY_SCORE_BOOST = {
    "high": 2,
    "medium": 0,
    "low": -1,
}


def _confidence_level(score: int) -> str:
    if score >= 8:
        return "high"
    elif score >= 5:
        return "medium"
    return "low"


def _get_industry_relevance(constraint_key: str, industry: str) -> str:
    relevance_map = INDUSTRY_RELEVANCE.get(industry, INDUSTRY_RELEVANCE["default"])
    return relevance_map.get(constraint_key, "medium")


def _apply_industry_boost(base_score: int, constraint_key: str, industry: str) -> int:
    relevance = _get_industry_relevance(constraint_key, industry)
    boost = INDUSTRY_SCORE_BOOST.get(relevance, 0)
    return max(1, min(10, base_score + boost))


def _make_constraint(
    key: str,
    name: str,
    hypothesis: str,
    evidence: list[str],
    base_score: int,
    severity: str,
    industry: str,
) -> dict[str, Any]:
    """Build a standardised constraint detection object."""
    score = _apply_industry_boost(base_score, key, industry)
    return {
        "key": key,
        "name": name,
        "hypothesis": hypothesis,
        "evidence": evidence,
        "detection_score": score,
        "confidence_level": _confidence_level(score),
        "industry_relevance": _get_industry_relevance(key, industry),
        "severity": severity,
        "verified": False,
        "source": "twin_detection",
    }


def detect_constraints(
    twin: dict[str, Any],
    health: dict[str, Any],
    industry: str = "",
) -> list[dict[str, Any]]:
    """
    Detect constraints from Business Twin and Health scores.
    Returns a list of detected constraint hypotheses.
    DETECTION IS NOT PROOF — all items are hypotheses only.
    """

    detected = []

    # 1. Trust Infrastructure Deficit
    trust = twin["marketing"].get("trust_infrastructure", "")
    if trust in ["None", "Very little"]:
        detected.append(_make_constraint(
            key="trust_infrastructure_deficit",
            name="Trust Infrastructure Deficit",
            hypothesis="Insufficient social proof is limiting new client conversion and market credibility.",
            evidence=[
                f"Business reported '{trust}' proof assets (reviews, case studies, testimonials).",
                f"Risk pillar score: {health['pillars']['risk']['score']} — below healthy threshold.",
                "Low trust infrastructure is a primary conversion barrier in service businesses.",
            ],
            base_score=9 if trust == "None" else 6,
            severity="high" if trust == "None" else "medium",
            industry=industry,
        ))

    # 2. Lead Response Deficit
    conversion = twin["sales"].get("conversion_rate", "")
    response_time = twin["sales"].get("avg_response_time_hours", "")
    try:
        response_hours = float(response_time) if response_time else None
    except (ValueError, TypeError):
        response_hours = None
    slow_response = response_hours is not None and response_hours > 4
    low_conversion = conversion in ["Less than 1 in 10", "1-2 in 10"]
    if low_conversion or slow_response:
        evidence = []
        if low_conversion:
            evidence.append(f"Enquiry-to-client conversion rate: '{conversion}'.")
            evidence.append("Below typical sector benchmarks for this industry.")
        if slow_response:
            evidence.append(f"Average lead response time: {response_hours} hours -- exceeds the 1-hour response benchmark significantly.")
        evidence.append(f"Growth pillar score: {health['pillars']['growth']['score']} -- conversion drag confirmed.")
        worst_signal_critical = conversion == "Less than 1 in 10" or (response_hours is not None and response_hours > 24)
        detected.append(_make_constraint(
            key="lead_response_deficit",
            name="Lead Response Deficit",
            hypothesis="Low conversion rate and/or slow lead response time indicate leads are not being responded to effectively or quickly enough.",
            evidence=evidence,
            base_score=8 if worst_signal_critical else 6,
            severity="high" if worst_signal_critical else "medium",
            industry=industry,
        ))

    # 3. Pricing Constraint
    pricing = twin["sales"].get("pricing_confidence", "")
    if pricing in ["Not confident at all", "A little unsure"]:
        detected.append(_make_constraint(
            key="pricing_constraint",
            name="Pricing Constraint",
            hypothesis="Pricing uncertainty is likely suppressing revenue, margin and perceived value.",
            evidence=[
                f"Owner reported being '{pricing}' that pricing is set correctly.",
                f"Strategy pillar score: {health['pillars']['strategy']['score']}.",
                "Pricing uncertainty typically leads to discounting and undercharging.",
            ],
            base_score=8 if pricing == "Not confident at all" else 5,
            severity="high" if pricing == "Not confident at all" else "medium",
            industry=industry,
        ))

    # 4. Staffing Inefficiency
    bottleneck = twin["operations"].get("delivery_bottleneck", "")
    team_size = twin["operations"].get("team_size", "")
    if bottleneck == "Doing the actual work" and team_size in ["Just me", "2-5"]:
        detected.append(_make_constraint(
            key="staffing_inefficiency",
            name="Staffing Inefficiency",
            hypothesis="Small team doing all delivery work is creating a capacity ceiling and growth constraint.",
            evidence=[
                f"Team size: '{team_size}'.",
                "Primary bottleneck: doing the actual work.",
                f"Operations pillar score: {health['pillars']['operations']['score']}.",
            ],
            base_score=6,
            severity="medium",
            industry=industry,
        ))

    # 5. Management Bottleneck
    if bottleneck == "Managing the team":
        detected.append(_make_constraint(
            key="management_bottleneck",
            name="Management Bottleneck",
            hypothesis="Management overhead is slowing delivery and limiting throughput and scalability.",
            evidence=[
                "Owner identified 'managing the team' as the primary delivery bottleneck.",
                f"Operations pillar score: {health['pillars']['operations']['score']}.",
            ],
            base_score=6,
            severity="medium",
            industry=industry,
        ))

    # 6. Capacity Constraint
    capacity = twin["operations"].get("capacity_utilisation", "")
    if capacity in ["Fully stretched", "85-95%"]:
        detected.append(_make_constraint(
            key="capacity_constraint",
            name="Capacity Constraint",
            hypothesis="Team is operating at or near full capacity, preventing growth and creating delivery risk.",
            evidence=[
                f"Capacity utilisation: '{capacity}'.",
                "At this level, taking on new work risks quality and retention.",
                f"Operations pillar score: {health['pillars']['operations']['score']}.",
            ],
            base_score=8 if capacity == "Fully stretched" else 6,
            severity="high" if capacity == "Fully stretched" else "medium",
            industry=industry,
        ))

    # 7. Founder Dependency
    founder = twin["risk"].get("founder_dependency", "")
    if founder in ["It would stop without me", "It would struggle a lot"]:
        detected.append(_make_constraint(
            key="founder_dependency",
            name="Founder Dependency",
            hypothesis="Business is critically dependent on the founder, limiting scalability, delegation and enterprise value.",
            evidence=[
                f"Business reported it '{founder}' if founder took 2 weeks off.",
                "High founder dependency is the single biggest constraint on scaling service businesses.",
                f"Strategy pillar score: {health['pillars']['strategy']['score']}.",
            ],
            base_score=9 if founder == "It would stop without me" else 7,
            severity="high" if founder == "It would stop without me" else "medium",
            industry=industry,
        ))

    # 8. Revenue Concentration Risk
    concentration = twin["risk"].get("revenue_concentration", "")
    if concentration in ["Most of it", "Three-fifths to four-fifths"]:
        detected.append(_make_constraint(
            key="revenue_concentration_risk",
            name="Revenue Concentration Risk",
            hypothesis="Over-reliance on a small number of clients creates fragility and existential revenue risk.",
            evidence=[
                f"Top 3 clients account for '{concentration}' of total revenue.",
                "Loss of one major client could cause serious financial damage.",
                f"Risk pillar score: {health['pillars']['risk']['score']}.",
            ],
            base_score=8 if concentration == "Most of it" else 6,
            severity="high" if concentration == "Most of it" else "medium",
            industry=industry,
        ))

    # 9. Offer Weakness
    offer = twin["sales"].get("offer_clarity", "")
    if offer in ["Not at all clear", "A bit confusing"]:
        detected.append(_make_constraint(
            key="offer_weakness",
            name="Offer Weakness",
            hypothesis="Unclear offer is reducing conversion, limiting market differentiation and suppressing growth.",
            evidence=[
                f"Offer rated as '{offer}' to a new visitor.",
                "An unclear offer forces prospects to seek clarity from competitors.",
                f"Strategy pillar score: {health['pillars']['strategy']['score']}.",
            ],
            base_score=7 if offer == "Not at all clear" else 5,
            severity="high" if offer == "Not at all clear" else "medium",
            industry=industry,
        ))

    # 10. Market Selection Risk
    market = twin["marketing"].get("market_growth", "")
    if market in ["Shrinking quickly", "Shrinking"]:
        detected.append(_make_constraint(
            key="market_selection_risk",
            name="Market Selection Risk",
            hypothesis="Operating in a declining market creates structural headwinds that cannot be overcome through execution alone.",
            evidence=[
                f"Market reported as '{market}'.",
                "Declining markets compress margins and increase competitive pressure.",
                f"Context pillar score: {health['pillars']['context']['score']}.",
            ],
            base_score=7 if market == "Shrinking quickly" else 5,
            severity="high" if market == "Shrinking quickly" else "medium",
            industry=industry,
        ))

    # 11. Leadership Capacity Gap
    c_suite_size = twin["people"].get("c_suite_size", "")
    leadership_vacancies = twin["people"].get("leadership_vacancies", "")
    try:
        vacancy_ratio = float(leadership_vacancies) / float(c_suite_size) if c_suite_size and float(c_suite_size) > 0 else 0
    except (ValueError, TypeError):
        vacancy_ratio = 0
    if vacancy_ratio >= 0.15:
        detected.append(_make_constraint(
            key="leadership_capacity_gap",
            name="Leadership Capacity Gap",
            hypothesis="Senior leadership vacancies relative to team size are creating decision-making bottlenecks and limiting execution capacity.",
            evidence=[
                f"C-suite size: '{c_suite_size}', leadership vacancies: '{leadership_vacancies}'.",
                f"Vacancy ratio of {round(vacancy_ratio * 100)}% exceeds the sustainable threshold for senior decision-making capacity.",
                f"Strategy pillar score: {health['pillars']['strategy']['score']}.",
            ],
            base_score=8 if vacancy_ratio >= 0.3 else 6,
            severity="high" if vacancy_ratio >= 0.3 else "medium",
            industry=industry,
        ))

    # 12. Succession Risk
    succession_planning = twin["people"].get("succession_planning", "")
    avg_leadership_tenure = twin["people"].get("avg_leadership_tenure", "")
    try:
        tenure_val = float(avg_leadership_tenure) if avg_leadership_tenure else None
    except (ValueError, TypeError):
        tenure_val = None
    no_succession_plan = str(succession_planning).lower() in ["none", "no", "partial", ""]
    if no_succession_plan and tenure_val is not None and tenure_val >= 5:
        detected.append(_make_constraint(
            key="succession_risk",
            name="Succession Risk",
            hypothesis="Absence of a clear succession plan combined with long-tenured leadership creates enterprise value and continuity risk.",
            evidence=[
                f"Succession planning status: '{succession_planning}'.",
                f"Average leadership tenure: {tenure_val} years — departure risk increases with tenure length.",
                f"Risk pillar score: {health['pillars']['risk']['score']}.",
            ],
            base_score=7 if str(succession_planning).lower() == "none" else 5,
            severity="high" if str(succession_planning).lower() == "none" else "medium",
            industry=industry,
        ))

    # 13. Technology Debt Risk
    tech_maturity = twin["technology"].get("tech_stack_maturity", "")
    legacy_risk = twin["technology"].get("legacy_system_risk", "")
    if str(legacy_risk).lower() in ["high", "critical"] or str(tech_maturity).lower() in ["basic", "legacy"]:
        detected.append(_make_constraint(
            key="technology_debt_risk",
            name="Technology Debt Risk",
            hypothesis="Outdated or high-risk legacy technology infrastructure is constraining operational efficiency, scalability and competitive positioning.",
            evidence=[
                f"Technology stack maturity reported as: '{tech_maturity}'.",
                f"Legacy system risk level: '{legacy_risk}'.",
                f"Operations pillar score: {health['pillars']['operations']['score']}.",
            ],
            base_score=7 if str(legacy_risk).lower() == "critical" else 5,
            severity="high" if str(legacy_risk).lower() == "critical" else "medium",
            industry=industry,
        ))

    # 14. Cyber Security Exposure
    cyber_maturity = twin["technology"].get("cyber_security_maturity", "")
    cyber_incidents = twin["risk"].get("cyber_incidents_12m", "")
    try:
        cyber_score = float(cyber_maturity) if cyber_maturity else None
        incident_count = float(cyber_incidents) if cyber_incidents else 0
    except (ValueError, TypeError):
        cyber_score = None
        incident_count = 0
    if (cyber_score is not None and cyber_score < 5) or incident_count > 0:
        detected.append(_make_constraint(
            key="cyber_security_exposure",
            name="Cyber Security Exposure",
            hypothesis="Insufficient cyber security maturity creates material exposure to data breach, regulatory fines and reputational damage.",
            evidence=[
                f"Cyber security maturity score: {cyber_score if cyber_score is not None else 'not provided'}/10.",
                f"Cyber/data incidents in last 12 months: {incident_count}.",
                f"Risk pillar score: {health['pillars']['risk']['score']}.",
            ],
            base_score=8 if incident_count > 0 else 6,
            severity="high" if incident_count > 0 or (cyber_score is not None and cyber_score < 3) else "medium",
            industry=industry,
        ))

    # 15. Client Concentration Risk (Enterprise)
    top_client_pct = twin["risk"].get("top_client_revenue_pct", "")
    try:
        top_client_val = float(top_client_pct) if top_client_pct else 0
    except (ValueError, TypeError):
        top_client_val = 0
    if top_client_val >= 25:
        detected.append(_make_constraint(
            key="client_concentration_risk_enterprise",
            name="Client Concentration Risk (Enterprise)",
            hypothesis="A single client representing a large share of revenue creates concentrated commercial risk and reduces negotiating leverage.",
            evidence=[
                f"Top client represents {top_client_val}% of total revenue.",
                "Concentration above 25% in a single client significantly increases revenue volatility risk.",
                f"Risk pillar score: {health['pillars']['risk']['score']}.",
            ],
            base_score=8 if top_client_val >= 40 else 6,
            severity="high" if top_client_val >= 40 else "medium",
            industry=industry,
        ))

    # 16. Governance Maturity Gap
    board_frequency = twin["strategy"].get("board_meeting_frequency", "")
    decision_structure = twin["strategy"].get("decision_making_structure", "")
    weak_governance = (
        str(board_frequency).lower() in ["", "none", "ad hoc", "rarely"]
        or "owner only" in str(decision_structure).lower()
    )
    revenue_target = twin["strategy"].get("revenue_target_12m", "")
    try:
        target_val = float(revenue_target) if revenue_target else 0
    except (ValueError, TypeError):
        target_val = 0
    if weak_governance and target_val >= 10000000:
        detected.append(_make_constraint(
            key="governance_maturity_gap",
            name="Governance Maturity Gap",
            hypothesis="Governance structures have not matured in line with business scale, creating decision-making bottlenecks and oversight risk at enterprise scale.",
            evidence=[
                f"Board meeting frequency: '{board_frequency}'.",
                f"Decision making structure: '{decision_structure}'.",
                f"12 month revenue target of £{int(target_val):,} indicates enterprise scale requiring formalised governance.",
            ],
            base_score=6,
            severity="medium",
            industry=industry,
        ))

    # 17. Delivery Execution Gap
    on_time = twin["operations"].get("project_on_time_pct", "")
    try:
        on_time_pct = float(on_time) if on_time else None
    except (ValueError, TypeError):
        on_time_pct = None
    if on_time_pct is not None and on_time_pct < 80:
        detected.append(_make_constraint(
            key="delivery_execution_gap",
            name="Delivery Execution Gap",
            hypothesis="A significant proportion of projects are delivered late, indicating capacity, process or planning weaknesses that damage client trust and increase rework costs.",
            evidence=[
                f"Only {on_time_pct}% of projects delivered on time.",
                "Below the 80% on-time delivery benchmark for healthy operational execution.",
                f"Operations pillar score: {health['pillars']['operations']['score']}.",
            ],
            base_score=8 if on_time_pct < 60 else 6,
            severity="high" if on_time_pct < 60 else "medium",
            industry=industry,
        ))

    # 18. Systematic Discounting Erosion
    discount = twin["strategy"].get("avg_discount_pct", "")
    try:
        discount_pct = float(discount) if discount else None
    except (ValueError, TypeError):
        discount_pct = None
    if discount_pct is not None and discount_pct > 15:
        detected.append(_make_constraint(
            key="systematic_discounting_erosion",
            name="Systematic Discounting Erosion",
            hypothesis="Average discounting above sustainable levels is eroding margin integrity. At scale, every percentage point of average selling price reduction is a direct hit to EBITDA.",
            evidence=[
                f"Average discount offered: {discount_pct}%.",
                "Exceeds the 15% threshold associated with margin-damaging discount habits.",
                f"Strategy pillar score: {health['pillars']['strategy']['score']}.",
            ],
            base_score=7 if discount_pct > 25 else 5,
            severity="high" if discount_pct > 25 else "medium",
            industry=industry,
        ))

    # 19. Weak Gross Margin
    gross_margin = twin["financial"].get("gross_margin_pct", "")
    try:
        gross_margin_pct = float(gross_margin) if gross_margin else None
    except (ValueError, TypeError):
        gross_margin_pct = None
    if gross_margin_pct is not None and gross_margin_pct < 40:
        detected.append(_make_constraint(
            key="weak_gross_margin",
            name="Weak Gross Margin",
            hypothesis="Gross margin below a healthy threshold for this business model indicates pricing, cost-of-delivery or service-mix issues eroding profitability at the most fundamental level.",
            evidence=[
                f"Gross margin: {gross_margin_pct}%.",
                "Below the 40% threshold typical for healthy professional/agency service margins.",
                f"Strategy pillar score: {health['pillars']['strategy']['score']}.",
            ],
            base_score=8 if gross_margin_pct < 25 else 6,
            severity="high" if gross_margin_pct < 25 else "medium",
            industry=industry,
        ))

    # 20. Profitability Erosion
    ebitda = twin["financial"].get("ebitda", "")
    annual_revenue = twin["financial"].get("annual_revenue", "")
    try:
        ebitda_val = float(ebitda) if ebitda else None
        revenue_val = float(annual_revenue) if annual_revenue else None
        ebitda_margin = (ebitda_val / revenue_val * 100) if ebitda_val is not None and revenue_val else None
    except (ValueError, TypeError, ZeroDivisionError):
        ebitda_margin = None
    if ebitda_margin is not None and ebitda_margin < 10:
        detected.append(_make_constraint(
            key="profitability_erosion",
            name="Profitability Erosion",
            hypothesis="EBITDA margin below a sustainable threshold indicates the business is converting revenue into profit far less efficiently than it should be, directly suppressing enterprise value.",
            evidence=[
                f"EBITDA margin: {round(ebitda_margin, 1)}% (EBITDA of {ebitda_val:,.0f} on revenue of {revenue_val:,.0f}).",
                "Below the 10% threshold associated with a financially healthy services business.",
                f"Risk pillar score: {health['pillars']['risk']['score']}.",
            ],
            base_score=8 if ebitda_margin < 0 else 6,
            severity="high" if ebitda_margin < 0 else "medium",
            industry=industry,
        ))

    # 21. Cash Runway Risk
    cash_runway = twin["risk"].get("cash_runway_months", "")
    try:
        runway_months = float(cash_runway) if cash_runway else None
    except (ValueError, TypeError):
        runway_months = None
    if runway_months is not None and runway_months < 6:
        detected.append(_make_constraint(
            key="cash_runway_risk",
            name="Cash Runway Risk",
            hypothesis="Cash runway below a safe threshold at current burn rate creates existential financial risk and limits strategic flexibility.",
            evidence=[
                f"Cash runway at current burn rate: {runway_months} months.",
                "Below the 6-month threshold considered a safe minimum buffer for an enterprise-scale business.",
                f"Risk pillar score: {health['pillars']['risk']['score']}.",
            ],
            base_score=9 if runway_months < 3 else 7,
            severity="high" if runway_months < 3 else "medium",
            industry=industry,
        ))

    # 22. Unfavourable CAC:LTV Ratio
    cac = twin["financial"].get("cac", "")
    ltv = twin["financial"].get("customer_lifetime_value", "")
    try:
        cac_val = float(cac) if cac else None
        ltv_val = float(ltv) if ltv else None
        ltv_cac_ratio = (ltv_val / cac_val) if cac_val and ltv_val is not None else None
    except (ValueError, TypeError, ZeroDivisionError):
        ltv_cac_ratio = None
    if ltv_cac_ratio is not None and ltv_cac_ratio < 3:
        detected.append(_make_constraint(
            key="unfavourable_cac_ltv_ratio",
            name="Unfavourable CAC:LTV Ratio",
            hypothesis="A weak lifetime-value-to-acquisition-cost ratio means growth is structurally expensive or unprofitable, undermining the unit economics of new client acquisition.",
            evidence=[
                f"LTV:CAC ratio: {round(ltv_cac_ratio, 1)}:1 (LTV {ltv_val:,.0f} vs CAC {cac_val:,.0f}).",
                "Below the 3:1 ratio considered the minimum for healthy, scalable acquisition economics.",
                f"Growth pillar score: {health['pillars']['growth']['score']}.",
            ],
            base_score=7 if ltv_cac_ratio < 1.5 else 5,
            severity="high" if ltv_cac_ratio < 1.5 else "medium",
            industry=industry,
        ))

    # 23. Excessive Leverage
    debt_to_ebitda = twin["risk"].get("debt_to_ebitda", "")
    try:
        leverage_multiple = float(debt_to_ebitda) if debt_to_ebitda else None
    except (ValueError, TypeError):
        leverage_multiple = None
    if leverage_multiple is not None and leverage_multiple > 3:
        detected.append(_make_constraint(
            key="excessive_leverage",
            name="Excessive Leverage",
            hypothesis="Debt-to-EBITDA above a sustainable multiple constrains financial flexibility, increases refinancing risk and can suppress valuation multiples at exit.",
            evidence=[
                f"Debt-to-EBITDA ratio: {leverage_multiple}x.",
                "Above the 3x multiple generally considered the upper bound of sustainable leverage for a services business.",
                f"Risk pillar score: {health['pillars']['risk']['score']}.",
            ],
            base_score=8 if leverage_multiple > 5 else 6,
            severity="high" if leverage_multiple > 5 else "medium",
            industry=industry,
        ))

    # 24. Revenue Growth Stagnation
    growth_rate = twin["financial"].get("revenue_growth_rate_pct", "")
    try:
        growth_pct = float(growth_rate) if growth_rate else None
    except (ValueError, TypeError):
        growth_pct = None
    if growth_pct is not None and growth_pct < 5:
        detected.append(_make_constraint(
            key="revenue_growth_stagnation",
            name="Revenue Growth Stagnation",
            hypothesis="Flat or declining revenue growth at this scale signals that existing growth drivers have plateaued and structural intervention is needed, not just incremental sales effort.",
            evidence=[
                f"Revenue growth rate: {growth_pct}%.",
                "Below the 5% threshold considered the minimum healthy growth rate for an enterprise-scale services business.",
                f"Growth pillar score: {health['pillars']['growth']['score']}.",
            ],
            base_score=7 if growth_pct < 0 else 5,
            severity="high" if growth_pct < 0 else "medium",
            industry=industry,
        ))

    # Sort by detection score descending
    detected.sort(key=lambda x: x["detection_score"], reverse=True)
    return detected
