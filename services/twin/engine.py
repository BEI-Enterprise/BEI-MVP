"""
BEI Business Twin Engine
Builds a structured digital twin from intake form answers.
Aligned with BEI Master Architecture Section 2 — Business Twin.
"""

from typing import Any


REVENUE_MIDPOINTS = {
    "Under £250k": 150000,
    "£250k - £500k": 375000,
    "£500k - £1M": 750000,
    "£1M - £3M": 2000000,
    "£3M - £10M": 6500000,
    "Over £10M": 15000000,
}


def build_twin(answers: dict[str, Any], business_id: str, industry: str, revenue_band: str) -> dict[str, Any]:
    """
    Build a Business Twin from intake answers.
    Returns a structured twin object aligned with the Master Architecture.
    """

    twin = {
        "business_id": business_id,
        "industry": industry,

        # Revenue sub-twin
        "revenue": {
            "band": revenue_band,
            "estimated_annual": REVENUE_MIDPOINTS.get(revenue_band, 500000),
            "monthly_band": answers.get("monthly_revenue", ""),
            "trend": answers.get("revenue_trend", ""),
        },

        # Marketing sub-twin
        "marketing": {
            "lead_volume_band": answers.get("lead_volume", ""),
            "trust_infrastructure": answers.get("trust_infrastructure", ""),
            "market_position": answers.get("market_position", ""),
            "market_growth": answers.get("market_growth", ""),
            "competition_intensity": answers.get("competition_intensity", ""),
        },

        # Sales sub-twin
        "sales": {
            "conversion_rate": answers.get("conversion_rate", ""),
            "avg_client_value": answers.get("avg_client_value", ""),
            "pricing_confidence": answers.get("pricing_confidence", ""),
            "offer_clarity": answers.get("offer_clarity", ""),
        },

        # Operations sub-twin
        "operations": {
            "team_size": answers.get("team_size", ""),
            "capacity_utilisation": answers.get("capacity_utilisation", ""),
            "delivery_bottleneck": answers.get("delivery_bottleneck", ""),
        },

        # Risk sub-twin
        "risk": {
            "founder_dependency": answers.get("founder_dependency", ""),
            "revenue_concentration": answers.get("revenue_concentration", ""),
            "key_person_risk": answers.get("key_person_risk", ""),
            "cash_flow_stability": answers.get("cash_flow_stability", ""),
            "client_retention": answers.get("client_retention", ""),
            "top_client_revenue_pct": answers.get("top_client_revenue_pct", ""),
            "cyber_incidents_12m": answers.get("cyber_incidents_12m", ""),
            "gdpr_compliant": answers.get("gdpr_compliant", ""),
            "pending_litigation": answers.get("pending_litigation", ""),
            "contract_renewal_risk": answers.get("contract_renewal_risk", ""),
        },

        # Context sub-twin
        "context": {
            "biggest_challenge": answers.get("biggest_challenge", ""),
            "years_trading": answers.get("years_trading", ""),
            "business_stage": answers.get("business_stage", ""),
            "market_share_pct": answers.get("market_share_pct", ""),
            "nps_score": answers.get("nps_score", ""),
            "brand_awareness_pct": answers.get("brand_awareness_pct", ""),
            "competitive_set": answers.get("competitive_set", ""),
            "differentiation_strength": answers.get("differentiation_strength", ""),
        },

        # Strategy sub-twin
        "strategy": {
            "revenue_target_12m": answers.get("revenue_target_12m", ""),
            "primary_growth_strategy": answers.get("primary_growth_strategy", ""),
            "strategic_blockers": answers.get("strategic_blockers", ""),
            "competitive_advantage": answers.get("competitive_advantage", ""),
            "exit_strategy": answers.get("exit_strategy", ""),
            "legal_structure": answers.get("legal_structure", ""),
            "ownership_structure": answers.get("ownership_structure", ""),
            "board_meeting_frequency": answers.get("board_meeting_frequency", ""),
            "decision_making_structure": answers.get("decision_making_structure", ""),
        },

        # People sub-twin
        "people": {
            "total_headcount": answers.get("total_headcount", ""),
            "employee_engagement_score": answers.get("employee_engagement_score", ""),
            "staff_turnover_12m": answers.get("staff_turnover_12m", ""),
            "c_suite_size": answers.get("c_suite_size", ""),
            "leadership_vacancies": answers.get("leadership_vacancies", ""),
            "succession_planning": answers.get("succession_planning", ""),
            "avg_leadership_tenure": answers.get("avg_leadership_tenure", ""),
        },

        # Technology sub-twin
        "technology": {
            "tech_stack_maturity": answers.get("tech_stack_maturity", ""),
            "cloud_adoption_pct": answers.get("cloud_adoption_pct", ""),
            "legacy_system_risk": answers.get("legacy_system_risk", ""),
            "data_maturity_score": answers.get("data_maturity_score", ""),
            "ai_ml_adoption": answers.get("ai_ml_adoption", ""),
            "cyber_security_maturity": answers.get("cyber_security_maturity", ""),
        },
    }

    return twin
