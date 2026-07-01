"""
BEI Business Twin Builder — Phase 3
Builds and persists a full Business Twin from intake answers + connector data.
Aligned with BEI Master Architecture Section 2 — Business Twin.
Writes to business_twins table in Supabase.
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

REVENUE_MONTHLY_MIDPOINTS = {
    "Under £10k": 7500,
    "£10k-£25k": 17500,
    "£25k-£50k": 37500,
    "£50k-£100k": 75000,
    "£100k-£250k": 175000,
    "Over £250k": 350000,
}


def _map_revenue_trend(val: str) -> str:
    mapping = {
        "Growing quickly": "growing",
        "Growing slowly": "growing",
        "Stayed about the same": "stable",
        "Declining slowly": "declining",
        "Declining fast": "declining",
    }
    return mapping.get(val, "unknown")


def _map_founder_dependency(val: str) -> str:
    mapping = {
        "It would stop without me": "critical",
        "It would struggle a lot": "high",
        "It would manage with some issues": "medium",
        "It would mostly be fine": "low",
        "It would run smoothly without me": "low",
    }
    return mapping.get(val, "unknown")


def _map_market_position(val: str) -> str:
    mapping = {
        "Nobody else offers what we do": "leader",
        "Clearly different": "challenger",
        "Somewhat different": "challenger",
        "Slightly different": "follower",
        "Pretty much the same as everyone else": "follower",
    }
    return mapping.get(val, "unknown")


def _map_offer_clarity(val: str) -> str:
    mapping = {
        "Crystal clear": "clear",
        "Clear": "clear",
        "Reasonably clear": "moderate",
        "A bit confusing": "unclear",
        "Not at all clear": "unclear",
    }
    return mapping.get(val, "unknown")


def _map_pricing_strength(val: str) -> str:
    mapping = {
        "Completely confident": "strong",
        "Very confident": "strong",
        "Fairly confident": "moderate",
        "A little unsure": "weak",
        "Not confident at all": "weak",
    }
    return mapping.get(val, "unknown")


def _map_revenue_concentration(val: str) -> str:
    mapping = {
        "Most of it": "critical",
        "Three-fifths to four-fifths": "concentrated",
        "Two-fifths to three-fifths": "moderate",
        "A fifth to two-fifths": "moderate",
        "Less than a fifth": "diversified",
    }
    return mapping.get(val, "unknown")


def _map_cash_position(val: str) -> str:
    mapping = {
        "Very steady": "strong",
        "Fairly steady": "adequate",
        "Okay, some swings": "adequate",
        "Unpredictable": "tight",
        "Very unpredictable": "critical",
    }
    return mapping.get(val, "unknown")


def _map_key_person_risk(val: str) -> str:
    mapping = {
        "Barely any impact": "low",
        "Minor disruption": "low",
        "Noticeable impact": "medium",
        "Serious damage": "high",
        "The business would likely fail": "critical",
    }
    return mapping.get(val, "unknown")


def _map_market_conditions(val: str) -> str:
    mapping = {
        "Growing quickly": "favourable",
        "Growing": "favourable",
        "Staying flat": "neutral",
        "Shrinking": "challenging",
        "Shrinking quickly": "challenging",
    }
    return mapping.get(val, "unknown")


def _coerce_int(val, default=None):
    try:
        return int(float(val))
    except (ValueError, TypeError):
        return default


def _coerce_numeric(val, default=None):
    try:
        return float(val)
    except (ValueError, TypeError):
        return default


def _map_tech_maturity(val: str) -> str:
    """Maps free-text or banded maturity descriptions to the
    tech_stack_maturity CHECK constraint values (migration 017)."""
    if not val:
        return "unknown"
    v = str(val).lower()
    if any(x in v for x in ["advanced", "modern", "leading"]):
        return "advanced"
    if any(x in v for x in ["develop", "improving", "moderate"]):
        return "developing"
    if any(x in v for x in ["basic", "legacy", "outdated"]):
        return "basic"
    return "unknown"


def _map_legacy_risk(val: str) -> str:
    """Maps free-text legacy system risk descriptions to the
    tech_legacy_system_risk CHECK constraint values (migration 017)."""
    if not val:
        return "unknown"
    v = str(val).lower()
    if any(x in v for x in ["critical", "severe"]):
        return "critical"
    if "high" in v:
        return "high"
    if "medium" in v or "moderate" in v:
        return "medium"
    if "low" in v:
        return "low"
    return "unknown"


def _map_differentiation_strength(val) -> str:
    """Maps a numeric 1-10 differentiation score (as collected by
    the Brand & Competitive Position manual data section) to the
    context_differentiation_strength CHECK constraint values
    (migration 017)."""
    score = _coerce_numeric(val)
    if score is None:
        return "unknown"
    if score >= 7:
        return "strong"
    if score >= 4:
        return "moderate"
    return "weak"


def _map_automation_level(val) -> str:
    try:
        pct = float(val)
        if pct >= 70: return 'high'
        if pct >= 40: return 'medium'
        if pct >= 15: return 'low'
        return 'none'
    except (ValueError, TypeError):
        pass
    v = str(val).lower()
    if 'high' in v or 'advanced' in v: return 'high'
    if 'medium' in v or 'moderate' in v: return 'medium'
    if 'low' in v or 'basic' in v: return 'low'
    if 'none' in v or 'no' in v: return 'none'
    return 'unknown'


def _map_ai_adoption(val: str) -> str:
    """Maps free-text AI/ML adoption descriptions to the
    tech_ai_ml_adoption CHECK constraint values (migration 017)."""
    if not val:
        return "unknown"
    v = str(val).lower()
    if any(x in v for x in ["advanced", "production", "scaled"]):
        return "advanced"
    if any(x in v for x in ["pilot", "develop", "exploring"]):
        return "developing"
    if any(x in v for x in ["none", "no adoption", "not"]):
        return "none"
    return "unknown"



def _extract_lead_volume(val: str) -> int:
    mapping = {
        "0-5": 3,
        "6-20": 13,
        "21-50": 35,
        "51-100": 75,
        "Over 100": 120,
    }
    return mapping.get(val, 0)


def _extract_conversion_rate(val: str) -> float:
    mapping = {
        "Less than 1 in 10": 0.07,
        "1-2 in 10": 0.15,
        "2-4 in 10": 0.30,
        "4-6 in 10": 0.50,
        "More than 6 in 10": 0.70,
    }
    return mapping.get(val, 0.0)


def _extract_team_size(val: str) -> int:
    mapping = {
        "Just me": 1,
        "2-5": 3,
        "6-10": 8,
        "11-25": 18,
        "26-50": 38,
        "Over 50": 60,
    }
    return mapping.get(val, 0)


def _extract_retention_rate(val: str) -> float:
    mapping = {
        "Under 50%": 0.45,
        "50-65%": 0.57,
        "65-80%": 0.72,
        "80-90%": 0.85,
        "Over 90%": 0.93,
    }
    return mapping.get(val, 0.0)


def _calculate_completeness(twin_record: dict) -> int:
    """Calculate what percentage of twin fields are populated."""
    key_fields = [
        "growth_revenue_monthly",
        "growth_revenue_trend",
        "growth_lead_volume",
        "growth_conversion_rate",
        "growth_trust_score",
        "ops_team_size",
        "ops_capacity_utilisation",
        "strategy_market_position",
        "strategy_pricing_strength",
        "strategy_offer_clarity",
        "strategy_founder_dependency",
        "risk_revenue_concentration",
        "risk_cash_position",
        "risk_client_retention_rate",
        "context_market_conditions",
    ]
    populated = sum(1 for f in key_fields if twin_record.get(f) is not None)
    return round((populated / len(key_fields)) * 100)


def build_twin_record(
    business_id: str,
    answers: dict[str, Any],
    revenue_band: str,
    connector_updates: dict[str, Any] = None
) -> dict[str, Any]:
    """
    Build a complete Business Twin record from intake answers
    and optional connector data.
    Returns a dict ready to upsert into business_twins table.
    """

    connector_updates = connector_updates or {}

    # Revenue estimates
    monthly_revenue = REVENUE_MONTHLY_MIDPOINTS.get(
        answers.get("monthly_revenue", ""), 0
    )
    annual_revenue = REVENUE_MIDPOINTS.get(revenue_band, 500000)

    # Conversion rate — prefer connector data
    conversion_rate = _extract_conversion_rate(
        connector_updates.get("sales.conversion_rate") or
        answers.get("conversion_rate", "")
    )

    # Trust score — derive from review count if available
    google_review_count = connector_updates.get("marketing.google_review_count", 0)
    google_rating = connector_updates.get("marketing.google_rating", 0)
    trust_score = min(100, int((google_review_count / 50) * 50 + (google_rating / 5) * 50)) if google_review_count else 20

    twin_record = {
        "business_id": business_id,
        "status": "complete",

        # Growth sub-twin
        "growth_revenue_monthly": monthly_revenue or None,
        "growth_revenue_annual": annual_revenue or None,
        "growth_revenue_trend": _map_revenue_trend(answers.get("revenue_trend", "")),
        "growth_lead_volume": _extract_lead_volume(answers.get("lead_volume", "")),
        "growth_conversion_rate": conversion_rate or None,
        "growth_avg_deal_value": None,
        "growth_review_score": google_rating or None,
        "growth_review_count": google_review_count or None,
        "growth_trust_score": trust_score,

        # Operations sub-twin
        "ops_team_size": _extract_team_size(answers.get("team_size", "")),
        "ops_capacity_utilisation": None,
        "ops_process_maturity": "basic",
        "ops_crm_in_use": False,

        # Strategy sub-twin
        "strategy_market_position": _map_market_position(answers.get("market_position", "")),
        "strategy_pricing_strength": _map_pricing_strength(answers.get("pricing_confidence", "")),
        "strategy_offer_clarity": _map_offer_clarity(answers.get("offer_clarity", "")),
        "strategy_founder_dependency": _map_founder_dependency(answers.get("founder_dependency", "")),

        # Risk sub-twin
        "risk_revenue_concentration": _map_revenue_concentration(answers.get("revenue_concentration", "")),
        "risk_key_person_dependency": _map_key_person_risk(answers.get("key_person_risk", "")),
        "risk_cash_position": _map_cash_position(answers.get("cash_flow_stability", "")),
        "risk_client_retention_rate": _extract_retention_rate(answers.get("client_retention", "")),

        # Context sub-twin
        "context_market_conditions": _map_market_conditions(answers.get("market_growth", "")),
        "context_business_stage": "unknown",
        "context_primary_objective": "unknown",

        # Extended Strategy sub-twin (migration 017)
        "strategy_revenue_target_12m": _coerce_numeric(answers.get("revenue_target_12m")),
        "strategy_primary_growth_strategy": answers.get("primary_growth_strategy") or None,
        "strategy_strategic_blockers": answers.get("strategic_blockers") or None,
        "strategy_competitive_advantage": answers.get("competitive_advantage") or None,
        "strategy_exit_strategy": answers.get("exit_strategy") or None,
        "strategy_legal_structure": answers.get("legal_structure") or None,
        "strategy_ownership_structure": answers.get("ownership_structure") or None,
        "strategy_board_meeting_frequency": answers.get("board_meeting_frequency") or None,
        "strategy_decision_making_structure": answers.get("decision_making_structure") or None,

        # Extended Risk sub-twin (migration 017)
        "risk_top_client_revenue_pct": _coerce_numeric(answers.get("top_client_revenue_pct")),
        "risk_cyber_incidents_12m": _coerce_int(answers.get("cyber_incidents_12m")),
        "risk_gdpr_compliant": answers.get("gdpr_compliant") or None,
        "risk_pending_litigation": answers.get("pending_litigation") or None,
        "risk_contract_renewal_risk": _coerce_numeric(answers.get("contract_renewal_risk")),

        # Extended Context sub-twin (migration 017)
        "context_years_trading": _coerce_int(answers.get("years_trading")),
        "context_market_share_pct": _coerce_numeric(answers.get("market_share_pct")),
        "context_nps_score": _coerce_int(answers.get("nps_score")),
        "context_brand_awareness_pct": _coerce_numeric(answers.get("brand_awareness_pct")),
        "context_competitive_set": answers.get("competitive_set") or None,
        "context_differentiation_strength": _map_differentiation_strength(answers.get("differentiation_strength")),

        # People sub-twin (new, migration 017)
        "people_total_headcount": _coerce_int(answers.get("total_headcount")),
        "people_employee_engagement_score": _coerce_numeric(answers.get("employee_engagement_score")),
        "people_staff_turnover_12m": _coerce_numeric(answers.get("staff_turnover_12m")),
        "people_c_suite_size": _coerce_int(answers.get("c_suite_size")),
        "people_leadership_vacancies": _coerce_int(answers.get("leadership_vacancies")),
        "people_succession_planning": answers.get("succession_planning") or None,
        "people_avg_leadership_tenure": _coerce_numeric(answers.get("avg_leadership_tenure")),

        # Technology sub-twin (new, migration 017)
        "tech_stack_maturity": _map_tech_maturity(answers.get("tech_stack_maturity", "")),
        "tech_cloud_adoption_pct": _coerce_numeric(answers.get("cloud_adoption_pct")),
        "tech_legacy_system_risk": _map_legacy_risk(answers.get("legacy_system_risk", "")),
        "tech_data_maturity_score": _coerce_numeric(answers.get("data_maturity_score")),
        "tech_ai_ml_adoption": _map_ai_adoption(answers.get("ai_ml_adoption", "")),
        "tech_cyber_security_maturity": _coerce_numeric(answers.get("cyber_security_maturity")),

        # Extended fields -- all wired in engine.py, now persisted (migration 017 + 018)
        "growth_pipeline_value": _coerce_numeric(answers.get("pipeline_value")),
        "growth_pipeline_deals_count": _coerce_int(answers.get("pipeline_deals_count")),
        "growth_average_sales_cycle_days": _coerce_numeric(answers.get("average_sales_cycle_days")),
        "growth_new_clients_last_12m": _coerce_int(answers.get("new_clients_last_12m")),
        "growth_lost_clients_last_12m": _coerce_int(answers.get("lost_clients_last_12m")),
        "growth_expansion_revenue_pct": _coerce_numeric(answers.get("expansion_revenue_pct")),
        "growth_upsell_revenue_pct": _coerce_numeric(answers.get("upsell_revenue_pct")),
        "growth_international_revenue_pct": _coerce_numeric(answers.get("international_revenue_pct")),
        "growth_channel_mix": answers.get("channel_mix") or None,
        "strategy_price_vs_market": answers.get("price_vs_market") or None,
        "strategy_last_price_increase_months": _coerce_int(answers.get("last_price_increase_months")),
        "strategy_avg_discount_pct": _coerce_numeric(answers.get("avg_discount_pct")),
        "strategy_discounting_frequency": answers.get("discounting_frequency") or None,
        "strategy_pricing_model": answers.get("pricing_model") or None,
        "strategy_contract_length_months": _coerce_int(answers.get("contract_length_months")),
        "strategy_pricing_review_frequency": answers.get("pricing_review_frequency") or None,
        "strategy_revenue_target_3yr": _coerce_numeric(answers.get("revenue_target_3yr")),
        "strategy_revenue_target_5yr": _coerce_numeric(answers.get("revenue_target_5yr")),
        "strategy_ma_activity": answers.get("ma_activity") or None,
        "strategy_num_subsidiaries": _coerce_int(answers.get("num_subsidiaries")),
        "strategy_last_valuation": _coerce_numeric(answers.get("last_valuation")),
        "strategy_investment_raised": _coerce_numeric(answers.get("investment_raised")),
        "strategy_strategic_investment_pipeline": answers.get("strategic_investment_pipeline") or None,
        "strategy_board_composition": answers.get("board_composition") or None,
        "strategy_kpi_framework": answers.get("kpi_framework") or None,
        "strategy_management_reporting_cadence": answers.get("management_reporting_cadence") or None,
        "ops_open_roles": _coerce_int(answers.get("open_roles")),
        "ops_revenue_per_head": _coerce_numeric(answers.get("revenue_per_head")),
        "ops_cost_per_head": _coerce_numeric(answers.get("cost_per_head")),
        "ops_documented_processes": answers.get("documented_processes") or None,
        "ops_automation_level": _map_automation_level(answers.get("automation_level", "")),
        "ops_supply_chain_dependencies": answers.get("supply_chain_dependencies") or None,
        "ops_operational_resilience_score": _coerce_numeric(answers.get("operational_resilience_score")),
        "ops_business_continuity_plan": answers.get("business_continuity_plan") or None,
        "ops_billable_team_size": _coerce_int(answers.get("billable_team_size")),
        "ops_avg_tenure_years": _coerce_numeric(answers.get("avg_tenure_years")),
        "ops_contractor_pct": _coerce_numeric(answers.get("contractor_pct")),
        "ops_iso_certified": answers.get("iso_certified") or None,
        "ops_onboarding_time_days": _coerce_int(answers.get("onboarding_time_days")),
        "ops_project_on_time_pct": _coerce_numeric(answers.get("project_on_time_pct")),
        "ops_sla_breach_rate_pct": _coerce_numeric(answers.get("sla_breach_rate_pct")),
        "ops_shared_services": answers.get("shared_services") or None,
        "ops_num_locations": _coerce_int(answers.get("num_locations")),
        "ops_countries_operating": answers.get("countries_operating") or None,
        "ops_outsourced_functions": answers.get("outsourced_functions") or None,
        "sales_win_rate_pct": _coerce_numeric(answers.get("win_rate_pct")),
        "sales_avg_response_time_hours": _coerce_numeric(answers.get("avg_response_time_hours")),
        "sales_total_active_accounts": _coerce_int(answers.get("total_active_accounts")),
        "sales_annual_contract_value": _coerce_numeric(answers.get("annual_contract_value")),
        "sales_converted_leads": _coerce_int(answers.get("converted_leads")),
        "sales_sales_team_size": _coerce_int(answers.get("sales_team_size")),
        "risk_geographic_concentration": answers.get("geographic_concentration") or None,
        "risk_professional_insurance": answers.get("professional_insurance") or None,
        "risk_last_financial_review": _coerce_int(answers.get("last_financial_review")),
        "risk_audit_firm": answers.get("audit_firm") or None,
        "risk_contracts_in_place": answers.get("contracts_in_place") or None,
        "risk_ip_protected": answers.get("ip_protected") or None,
        "risk_third_party_risk_management": answers.get("third_party_risk_management") or None,
        "risk_environmental_risk": answers.get("environmental_risk") or None,
        "risk_scenario_planning": answers.get("scenario_planning") or None,
        "risk_insurance_total_cover": _coerce_numeric(answers.get("insurance_total_cover")),
        "risk_regulatory_bodies": answers.get("regulatory_bodies") or None,
        "risk_regulatory_status": answers.get("regulatory_status") or None,
        "context_referral_revenue_pct": _coerce_numeric(answers.get("referral_revenue_pct")),
        "context_market_geography": answers.get("market_geography") or None,
        "context_awards_accreditations": answers.get("awards_accreditations") or None,
        "context_analyst_coverage": answers.get("analyst_coverage") or None,
        "context_social_following": _coerce_int(answers.get("social_following")),
        "context_media_coverage": answers.get("media_coverage") or None,
        "context_thought_leadership": answers.get("thought_leadership") or None,
        "context_total_addressable_market": _coerce_numeric(answers.get("total_addressable_market")),
        "tech_core_platform": answers.get("core_platform") or None,
        "tech_it_spend_annual": _coerce_numeric(answers.get("it_spend_annual")),
        "tech_it_spend_as_revenue_pct": _coerce_numeric(answers.get("it_spend_as_revenue_pct")),
        "tech_digital_transformation_stage": answers.get("digital_transformation_stage") or None,
        "tech_data_infrastructure": answers.get("data_infrastructure") or None,
        "tech_data_team_size": _coerce_int(answers.get("data_team_size")),
        "tech_data_governance": answers.get("data_governance") or None,
        "tech_api_integration_count": _coerce_int(answers.get("api_integration_count")),
        "tech_proprietary_data_assets": answers.get("proprietary_data_assets") or None,
        "tech_toolstack": answers.get("toolstack") or None,
        "people_absenteeism_rate_pct": _coerce_numeric(answers.get("absenteeism_rate_pct")),
        "people_internal_promotion_rate_pct": _coerce_numeric(answers.get("internal_promotion_rate_pct")),
        "people_training_spend_per_head": _coerce_numeric(answers.get("training_spend_per_head")),
        "people_gender_pay_gap_pct": _coerce_numeric(answers.get("gender_pay_gap_pct")),
        "people_diversity_leadership_pct": _coerce_numeric(answers.get("diversity_leadership_pct")),
        "people_remote_hybrid_split": answers.get("remote_hybrid_split") or None,
        "people_leadership_development_programme": answers.get("leadership_development_programme") or None,
        "financial_annual_revenue": _coerce_numeric(answers.get("annual_revenue")),
        "financial_revenue_last_12m": _coerce_numeric(answers.get("revenue_last_12m")),
        "financial_revenue_growth_rate_pct": _coerce_numeric(answers.get("revenue_growth_rate_pct")),
        "financial_gross_profit": _coerce_numeric(answers.get("gross_profit")),
        "financial_gross_margin_pct": _coerce_numeric(answers.get("gross_margin_pct")),
        "financial_ebitda": _coerce_numeric(answers.get("ebitda")),
        "financial_net_profit": _coerce_numeric(answers.get("net_profit")),
        "financial_total_operating_costs": _coerce_numeric(answers.get("total_operating_costs")),
        "financial_cash_and_equivalents": _coerce_numeric(answers.get("cash_and_equivalents")),
        "financial_total_debt": _coerce_numeric(answers.get("total_debt")),
        "financial_recurring_revenue_pct": _coerce_numeric(answers.get("recurring_revenue_pct")),
        "financial_arr": _coerce_numeric(answers.get("arr")),
        "financial_customer_lifetime_value": _coerce_numeric(answers.get("customer_lifetime_value")),
        "financial_cac": _coerce_numeric(answers.get("cac")),
        "financial_payback_period_months": _coerce_int(answers.get("payback_period_months")),
        "financial_working_capital": _coerce_numeric(answers.get("working_capital")),
        "financial_capex_last_12m": _coerce_numeric(answers.get("capex_last_12m")),
        "financial_rd_spend": _coerce_numeric(answers.get("rd_spend")),
        "financial_revenue_concentration_top_product": _coerce_numeric(answers.get("revenue_concentration_top_product")),
        "financial_cross_sell_rate_pct": _coerce_numeric(answers.get("cross_sell_rate_pct")),
        "financial_num_business_units": _coerce_int(answers.get("num_business_units")),
        # Metadata
        "data_confidence_score": 60,
    }

    # Calculate completeness
    twin_record["completeness_score"] = _calculate_completeness(twin_record)

    # Boost confidence if connector data present
    if connector_updates:
        twin_record["data_confidence_score"] = min(85, twin_record["data_confidence_score"] + 25)

    return twin_record
