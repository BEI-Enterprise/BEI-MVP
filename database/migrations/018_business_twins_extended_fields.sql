-- ============================================================
-- BEI MVP 1 - Migration 018
-- Entity: Business Twin
-- Purpose: Add columns for all extended fields added to
--          build_twin_record() covering the full 166-field
--          enterprise manual data intake.
-- Reference: Enterprise Field Wiring Plan (Session 4)
-- ============================================================

-- Financial sub-twin columns
ALTER TABLE business_twins
ADD COLUMN financial_annual_revenue NUMERIC(14,2),
ADD COLUMN financial_revenue_last_12m NUMERIC(14,2),
ADD COLUMN financial_revenue_growth_rate_pct NUMERIC(5,2),
ADD COLUMN financial_gross_profit NUMERIC(14,2),
ADD COLUMN financial_gross_margin_pct NUMERIC(5,2),
ADD COLUMN financial_ebitda NUMERIC(14,2),
ADD COLUMN financial_net_profit NUMERIC(14,2),
ADD COLUMN financial_total_operating_costs NUMERIC(14,2),
ADD COLUMN financial_cash_and_equivalents NUMERIC(14,2),
ADD COLUMN financial_total_debt NUMERIC(14,2),
ADD COLUMN financial_recurring_revenue_pct NUMERIC(5,2),
ADD COLUMN financial_arr NUMERIC(14,2),
ADD COLUMN financial_customer_lifetime_value NUMERIC(14,2),
ADD COLUMN financial_cac NUMERIC(14,2),
ADD COLUMN financial_payback_period_months INTEGER,
ADD COLUMN financial_working_capital NUMERIC(14,2),
ADD COLUMN financial_capex_last_12m NUMERIC(14,2),
ADD COLUMN financial_rd_spend NUMERIC(14,2),
ADD COLUMN financial_revenue_concentration_top_product NUMERIC(5,2),
ADD COLUMN financial_cross_sell_rate_pct NUMERIC(5,2),
ADD COLUMN financial_num_business_units INTEGER;

-- Growth extended columns
ALTER TABLE business_twins
ADD COLUMN growth_pipeline_value NUMERIC(14,2),
ADD COLUMN growth_pipeline_deals_count INTEGER,
ADD COLUMN growth_average_sales_cycle_days NUMERIC(6,1),
ADD COLUMN growth_new_clients_last_12m INTEGER,
ADD COLUMN growth_lost_clients_last_12m INTEGER,
ADD COLUMN growth_expansion_revenue_pct NUMERIC(5,2),
ADD COLUMN growth_upsell_revenue_pct NUMERIC(5,2),
ADD COLUMN growth_international_revenue_pct NUMERIC(5,2),
ADD COLUMN growth_channel_mix TEXT;

-- Strategy extended columns
ALTER TABLE business_twins
ADD COLUMN strategy_price_vs_market TEXT,
ADD COLUMN strategy_last_price_increase_months INTEGER,
ADD COLUMN strategy_avg_discount_pct NUMERIC(5,2),
ADD COLUMN strategy_discounting_frequency TEXT,
ADD COLUMN strategy_pricing_model TEXT,
ADD COLUMN strategy_contract_length_months INTEGER,
ADD COLUMN strategy_pricing_review_frequency TEXT,
ADD COLUMN strategy_revenue_target_3yr NUMERIC(14,2),
ADD COLUMN strategy_revenue_target_5yr NUMERIC(14,2),
ADD COLUMN strategy_ma_activity TEXT,
ADD COLUMN strategy_num_subsidiaries INTEGER,
ADD COLUMN strategy_last_valuation NUMERIC(14,2),
ADD COLUMN strategy_investment_raised NUMERIC(14,2),
ADD COLUMN strategy_strategic_investment_pipeline TEXT,
ADD COLUMN strategy_board_composition TEXT,
ADD COLUMN strategy_kpi_framework TEXT,
ADD COLUMN strategy_management_reporting_cadence TEXT;

-- Operations extended columns
ALTER TABLE business_twins
ADD COLUMN ops_open_roles INTEGER,
ADD COLUMN ops_revenue_per_head NUMERIC(10,2),
ADD COLUMN ops_cost_per_head NUMERIC(10,2),
ADD COLUMN ops_documented_processes TEXT,
ADD COLUMN ops_automation_level NUMERIC(5,2),
ADD COLUMN ops_supply_chain_dependencies TEXT,
ADD COLUMN ops_operational_resilience_score NUMERIC(5,2),
ADD COLUMN ops_business_continuity_plan TEXT,
ADD COLUMN ops_billable_team_size INTEGER,
ADD COLUMN ops_avg_tenure_years NUMERIC(5,2),
ADD COLUMN ops_contractor_pct NUMERIC(5,2),
ADD COLUMN ops_iso_certified TEXT,
ADD COLUMN ops_onboarding_time_days INTEGER,
ADD COLUMN ops_project_on_time_pct NUMERIC(5,2),
ADD COLUMN ops_sla_breach_rate_pct NUMERIC(5,2),
ADD COLUMN ops_shared_services TEXT,
ADD COLUMN ops_num_locations INTEGER,
ADD COLUMN ops_countries_operating TEXT,
ADD COLUMN ops_outsourced_functions TEXT;

-- Sales extended columns
ALTER TABLE business_twins
ADD COLUMN sales_win_rate_pct NUMERIC(5,2),
ADD COLUMN sales_avg_response_time_hours NUMERIC(6,1),
ADD COLUMN sales_total_active_accounts INTEGER,
ADD COLUMN sales_annual_contract_value NUMERIC(14,2),
ADD COLUMN sales_converted_leads INTEGER,
ADD COLUMN sales_sales_team_size INTEGER;

-- Risk extended columns
ALTER TABLE business_twins
ADD COLUMN risk_geographic_concentration TEXT,
ADD COLUMN risk_professional_insurance TEXT,
ADD COLUMN risk_last_financial_review INTEGER,
ADD COLUMN risk_audit_firm TEXT,
ADD COLUMN risk_contracts_in_place TEXT,
ADD COLUMN risk_ip_protected TEXT,
ADD COLUMN risk_third_party_risk_management TEXT,
ADD COLUMN risk_environmental_risk TEXT,
ADD COLUMN risk_scenario_planning TEXT,
ADD COLUMN risk_insurance_total_cover NUMERIC(14,2),
ADD COLUMN risk_regulatory_bodies TEXT,
ADD COLUMN risk_regulatory_status TEXT;

-- Context extended columns
ALTER TABLE business_twins
ADD COLUMN context_referral_revenue_pct NUMERIC(5,2),
ADD COLUMN context_market_geography TEXT,
ADD COLUMN context_awards_accreditations TEXT,
ADD COLUMN context_analyst_coverage TEXT,
ADD COLUMN context_social_following INTEGER,
ADD COLUMN context_media_coverage TEXT,
ADD COLUMN context_thought_leadership TEXT,
ADD COLUMN context_total_addressable_market NUMERIC(14,2);

-- Technology extended columns
ALTER TABLE business_twins
ADD COLUMN tech_core_platform TEXT,
ADD COLUMN tech_it_spend_annual NUMERIC(14,2),
ADD COLUMN tech_it_spend_as_revenue_pct NUMERIC(5,2),
ADD COLUMN tech_digital_transformation_stage TEXT,
ADD COLUMN tech_data_infrastructure TEXT,
ADD COLUMN tech_data_team_size INTEGER,
ADD COLUMN tech_data_governance TEXT,
ADD COLUMN tech_api_integration_count INTEGER,
ADD COLUMN tech_proprietary_data_assets TEXT,
ADD COLUMN tech_toolstack TEXT;

-- People extended columns
ALTER TABLE business_twins
ADD COLUMN people_absenteeism_rate_pct NUMERIC(5,2),
ADD COLUMN people_internal_promotion_rate_pct NUMERIC(5,2),
ADD COLUMN people_training_spend_per_head NUMERIC(10,2),
ADD COLUMN people_gender_pay_gap_pct NUMERIC(5,2),
ADD COLUMN people_diversity_leadership_pct NUMERIC(5,2),
ADD COLUMN people_remote_hybrid_split TEXT,
ADD COLUMN people_leadership_development_programme TEXT;
