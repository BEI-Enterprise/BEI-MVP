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


def _resolve_concentration_band(answers: dict) -> str:
    """
    Reconciles top_3_clients_revenue_pct (numeric, enterprise manual
    data) with revenue_concentration (banded string, original MRI
    intake) -- both represent the same real-world fact (concentration
    of revenue in top clients) and must not exist as two competing
    signals in the twin. Prefers the numeric when present.
    """
    numeric = answers.get("top_3_clients_revenue_pct", "")
    if numeric:
        try:
            pct = float(numeric)
            if pct < 20:
                return "Less than a fifth"
            if pct < 40:
                return "A fifth to two-fifths"
            if pct < 60:
                return "Two-fifths to three-fifths"
            if pct < 80:
                return "Three-fifths to four-fifths"
            return "Most of it"
        except (ValueError, TypeError):
            pass
    return answers.get("revenue_concentration", "")


def _resolve_capacity_band(answers: dict) -> str:
    """
    Reconciles avg_utilisation_pct (numeric, enterprise manual data)
    with capacity_utilisation (banded string, original MRI intake) --
    both represent the same real-world fact (team capacity load) and
    must not exist as two competing signals in the twin.
    Prefers the numeric when present, since it is more precise;
    falls back to the original banded answer otherwise.
    """
    numeric = answers.get("avg_utilisation_pct", "")
    if numeric:
        try:
            pct = float(numeric)
            if pct < 50:
                return "Less than half"
            if pct < 70:
                return "About half to 70%"
            if pct < 85:
                return "70-85%"
            if pct < 95:
                return "85-95%"
            return "Fully stretched"
        except (ValueError, TypeError):
            pass
    return answers.get("capacity_utilisation", "")


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
            "pipeline_value": answers.get("pipeline_value", ""),
            "pipeline_deals_count": answers.get("pipeline_deals_count", ""),
            "average_sales_cycle_days": answers.get("average_sales_cycle_days", ""),
            "new_clients_last_12m": answers.get("new_clients_last_12m", ""),
            "lost_clients_last_12m": answers.get("lost_clients_last_12m", ""),
            "expansion_revenue_pct": answers.get("expansion_revenue_pct", ""),
            "upsell_revenue_pct": answers.get("upsell_revenue_pct", ""),
            "international_revenue_pct": answers.get("international_revenue_pct", ""),
            "channel_mix": answers.get("channel_mix", ""),
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
            "avg_response_time_hours": answers.get("avg_response_time_hours", ""),
            "total_active_accounts": answers.get("total_active_accounts", ""),
            "annual_contract_value": answers.get("annual_contract_value", ""),
            "win_rate_pct": answers.get("win_rate_pct", ""),
            "sales_team_size": answers.get("sales_team_size", ""),
            "converted_leads": answers.get("converted_leads", ""),
        },

        # Operations sub-twin
        "operations": {
            "team_size": answers.get("team_size", ""),
            "capacity_utilisation": _resolve_capacity_band(answers),
            "delivery_bottleneck": answers.get("delivery_bottleneck", ""),
            "project_on_time_pct": answers.get("project_on_time_pct", ""),
            "open_roles": answers.get("open_roles", ""),
            "revenue_per_head": answers.get("revenue_per_head", ""),
            "cost_per_head": answers.get("cost_per_head", ""),
            "documented_processes": answers.get("documented_processes", ""),
            "automation_level": answers.get("automation_level", ""),
            "supply_chain_dependencies": answers.get("supply_chain_dependencies", ""),
            "operational_resilience_score": answers.get("operational_resilience_score", ""),
            "business_continuity_plan": answers.get("business_continuity_plan", ""),
            "billable_team_size": answers.get("billable_team_size", ""),
            "avg_tenure_years": answers.get("avg_tenure_years", ""),
            "contractor_pct": answers.get("contractor_pct", ""),
            "iso_certified": answers.get("iso_certified", ""),
            "onboarding_time_days": answers.get("onboarding_time_days", ""),
            "shared_services": answers.get("shared_services", ""),
            "num_locations": answers.get("num_locations", ""),
            "countries_operating": answers.get("countries_operating", ""),
            "outsourced_functions": answers.get("outsourced_functions", ""),
        },

        # Risk sub-twin
        "risk": {
            "founder_dependency": answers.get("founder_dependency", ""),
            "revenue_concentration": _resolve_concentration_band(answers),
            "key_person_risk": answers.get("key_person_risk", ""),
            "cash_flow_stability": answers.get("cash_flow_stability", ""),
            "client_retention": answers.get("client_retention", ""),
            "top_client_revenue_pct": answers.get("top_client_revenue_pct", ""),
            "cyber_incidents_12m": answers.get("cyber_incidents_12m", ""),
            "gdpr_compliant": answers.get("gdpr_compliant", ""),
            "pending_litigation": answers.get("pending_litigation", ""),
            "contract_renewal_risk": answers.get("contract_renewal_risk", ""),
            "debt_to_ebitda": answers.get("debt_to_ebitda", ""),
            "net_debt": answers.get("net_debt", ""),
            "credit_facility": answers.get("credit_facility", ""),
            "top_10_clients_revenue_pct": answers.get("top_10_clients_revenue_pct", ""),
            "geographic_concentration": answers.get("geographic_concentration", ""),
            "professional_insurance": answers.get("professional_insurance", ""),
            "insurance_total_cover": answers.get("insurance_total_cover", ""),
            "last_financial_review": answers.get("last_financial_review", ""),
            "audit_firm": answers.get("audit_firm", ""),
            "contracts_in_place": answers.get("contracts_in_place", ""),
            "ip_protected": answers.get("ip_protected", ""),
            "third_party_risk_management": answers.get("third_party_risk_management", ""),
            "environmental_risk": answers.get("environmental_risk", ""),
            "scenario_planning": answers.get("scenario_planning", ""),
            "regulatory_bodies": answers.get("regulatory_bodies", ""),
            "regulatory_status": answers.get("regulatory_status", ""),
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
            "avg_discount_pct": answers.get("avg_discount_pct", ""),
            "price_vs_market": answers.get("price_vs_market", ""),
            "last_price_increase_months": answers.get("last_price_increase_months", ""),
            "discounting_frequency": answers.get("discounting_frequency", ""),
            "pricing_model": answers.get("pricing_model", ""),
            "contract_length_months": answers.get("contract_length_months", ""),
            "pricing_review_frequency": answers.get("pricing_review_frequency", ""),
            "primary_growth_strategy": answers.get("primary_growth_strategy", ""),
            "strategic_blockers": answers.get("strategic_blockers", ""),
            "competitive_advantage": answers.get("competitive_advantage", ""),
            "exit_strategy": answers.get("exit_strategy", ""),
            "legal_structure": answers.get("legal_structure", ""),
            "ownership_structure": answers.get("ownership_structure", ""),
            "board_meeting_frequency": answers.get("board_meeting_frequency", ""),
            "decision_making_structure": answers.get("decision_making_structure", ""),
        },

        # Financial sub-twin (new -- Enterprise Field Wiring Plan)
        "financial": {
            "annual_revenue": answers.get("annual_revenue", ""),
            "revenue_last_12m": answers.get("revenue_last_12m", ""),
            "revenue_growth_rate_pct": answers.get("revenue_growth_rate_pct", ""),
            "gross_profit": answers.get("gross_profit", ""),
            "gross_margin_pct": answers.get("gross_margin_pct", ""),
            "ebitda": answers.get("ebitda", ""),
            "net_profit": answers.get("net_profit", ""),
            "total_operating_costs": answers.get("total_operating_costs", ""),
            "cash_and_equivalents": answers.get("cash_and_equivalents", ""),
            "total_debt": answers.get("total_debt", ""),
            "recurring_revenue_pct": answers.get("recurring_revenue_pct", ""),
            "arr": answers.get("arr", ""),
            "customer_lifetime_value": answers.get("customer_lifetime_value", ""),
            "cac": answers.get("cac", ""),
            "payback_period_months": answers.get("payback_period_months", ""),
            "working_capital": answers.get("working_capital", ""),
            "capex_last_12m": answers.get("capex_last_12m", ""),
            "rd_spend": answers.get("rd_spend", ""),
            "dividend_policy": answers.get("dividend_policy", ""),
            "revenue_by_division": answers.get("revenue_by_division", ""),
            "num_business_units": answers.get("num_business_units", ""),
            "highest_margin_division": answers.get("highest_margin_division", ""),
            "lowest_margin_division": answers.get("lowest_margin_division", ""),
            "investment_divisions": answers.get("investment_divisions", ""),
            "revenue_concentration_top_product": answers.get("revenue_concentration_top_product", ""),
            "cross_sell_rate_pct": answers.get("cross_sell_rate_pct", ""),
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
            "absenteeism_rate_pct": answers.get("absenteeism_rate_pct", ""),
            "internal_promotion_rate_pct": answers.get("internal_promotion_rate_pct", ""),
            "training_spend_per_head": answers.get("training_spend_per_head", ""),
            "gender_pay_gap_pct": answers.get("gender_pay_gap_pct", ""),
            "diversity_leadership_pct": answers.get("diversity_leadership_pct", ""),
            "remote_hybrid_split": answers.get("remote_hybrid_split", ""),
            "leadership_development_programme": answers.get("leadership_development_programme", ""),
        },

        # Technology sub-twin
        "technology": {
            "tech_stack_maturity": answers.get("tech_stack_maturity", ""),
            "cloud_adoption_pct": answers.get("cloud_adoption_pct", ""),
            "legacy_system_risk": answers.get("legacy_system_risk", ""),
            "data_maturity_score": answers.get("data_maturity_score", ""),
            "ai_ml_adoption": answers.get("ai_ml_adoption", ""),
            "cyber_security_maturity": answers.get("cyber_security_maturity", ""),
            "core_platform": answers.get("core_platform", ""),
            "it_spend_annual": answers.get("it_spend_annual", ""),
            "it_spend_as_revenue_pct": answers.get("it_spend_as_revenue_pct", ""),
            "digital_transformation_stage": answers.get("digital_transformation_stage", ""),
            "data_infrastructure": answers.get("data_infrastructure", ""),
            "data_team_size": answers.get("data_team_size", ""),
            "data_governance": answers.get("data_governance", ""),
            "api_integration_count": answers.get("api_integration_count", ""),
            "proprietary_data_assets": answers.get("proprietary_data_assets", ""),
            "toolstack": answers.get("toolstack", ""),
        },
    }

    return twin
