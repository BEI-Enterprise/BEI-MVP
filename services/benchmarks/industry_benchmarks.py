"""
BEI Industry Benchmark Data — Extended Edition
Covers 10 industries, all 43 constraint types, and field-level
thresholds for all critical data points collected across the 166-field
enterprise intake. Benchmarks are segmented by revenue band where
material differences exist.

Sources: ICAEW, SRA, FCA, CIMA, Deloitte Human Capital Trends,
McKinsey Global Institute, Gartner, KPMG, PwC industry surveys,
ONS Business Register, IBISWorld UK sector reports.

Every threshold below represents the boundary between acceptable
performance and a constraint-worthy signal. Values are UK-market
calibrated for 2024-25.

Golden Rule 8: Accuracy Over Volume — these are starting points.
The BenchmarkStore evolve() method updates them as real data accumulates.
"""

# ============================================================
# FIELD-LEVEL THRESHOLDS
# Per-industry, per-revenue-band thresholds for the key numeric
# fields collected in the 166-field enterprise intake.
# Structure: FIELD_THRESHOLDS[field][industry][band] = {healthy, warning, constraint}
# ============================================================

REVENUE_BANDS = ["under_1m", "1m_to_10m", "10m_to_50m", "50m_to_100m", "over_100m"]

FIELD_THRESHOLDS = {

    # ── FINANCIAL FIELDS ────────────────────────────────────────────

    "gross_margin_pct": {
        "accountancy_firm":     {"under_1m": {"healthy": 60, "warning": 50, "constraint": 40},
                                  "1m_to_10m": {"healthy": 58, "warning": 48, "constraint": 38},
                                  "10m_to_50m": {"healthy": 55, "warning": 45, "constraint": 35},
                                  "50m_to_100m": {"healthy": 52, "warning": 42, "constraint": 32},
                                  "over_100m": {"healthy": 50, "warning": 40, "constraint": 30}},
        "legal_services":       {"under_1m": {"healthy": 65, "warning": 55, "constraint": 45},
                                  "over_100m": {"healthy": 55, "warning": 45, "constraint": 35}},
        "financial_services":   {"under_1m": {"healthy": 70, "warning": 58, "constraint": 45},
                                  "over_100m": {"healthy": 60, "warning": 48, "constraint": 35}},
        "technology_saas":      {"under_1m": {"healthy": 72, "warning": 60, "constraint": 48},
                                  "over_100m": {"healthy": 68, "warning": 55, "constraint": 42}},
        "professional_services":{"under_1m": {"healthy": 58, "warning": 48, "constraint": 38},
                                  "over_100m": {"healthy": 50, "warning": 40, "constraint": 30}},
        "marketing_agency":     {"under_1m": {"healthy": 55, "warning": 45, "constraint": 35},
                                  "over_100m": {"healthy": 45, "warning": 35, "constraint": 25}},
        "estate_agency":        {"under_1m": {"healthy": 40, "warning": 30, "constraint": 20},
                                  "over_100m": {"healthy": 35, "warning": 25, "constraint": 15}},
        "recruitment":          {"under_1m": {"healthy": 25, "warning": 18, "constraint": 12},
                                  "over_100m": {"healthy": 20, "warning": 14, "constraint": 9}},
        "healthcare":           {"under_1m": {"healthy": 45, "warning": 35, "constraint": 25},
                                  "over_100m": {"healthy": 38, "warning": 28, "constraint": 18}},
        "manufacturing":        {"under_1m": {"healthy": 35, "warning": 25, "constraint": 15},
                                  "over_100m": {"healthy": 28, "warning": 20, "constraint": 12}},
        "default":              {"under_1m": {"healthy": 50, "warning": 38, "constraint": 28},
                                  "over_100m": {"healthy": 42, "warning": 32, "constraint": 22}},
    },

    "ebitda_margin_pct": {
        "accountancy_firm":     {"over_100m": {"healthy": 18, "warning": 12, "constraint": 8}},
        "legal_services":       {"over_100m": {"healthy": 22, "warning": 15, "constraint": 10}},
        "financial_services":   {"over_100m": {"healthy": 25, "warning": 18, "constraint": 12}},
        "technology_saas":      {"over_100m": {"healthy": 20, "warning": 12, "constraint": 5}},
        "professional_services":{"over_100m": {"healthy": 15, "warning": 10, "constraint": 6}},
        "marketing_agency":     {"over_100m": {"healthy": 12, "warning": 8, "constraint": 4}},
        "default":              {"over_100m": {"healthy": 15, "warning": 10, "constraint": 5}},
    },

    "revenue_growth_rate_pct": {
        "accountancy_firm":     {"over_100m": {"healthy": 8,  "warning": 4,  "constraint": 2}},
        "legal_services":       {"over_100m": {"healthy": 7,  "warning": 3,  "constraint": 1}},
        "financial_services":   {"over_100m": {"healthy": 10, "warning": 5,  "constraint": 2}},
        "technology_saas":      {"over_100m": {"healthy": 20, "warning": 10, "constraint": 5}},
        "professional_services":{"over_100m": {"healthy": 8,  "warning": 4,  "constraint": 1}},
        "marketing_agency":     {"over_100m": {"healthy": 10, "warning": 5,  "constraint": 2}},
        "estate_agency":        {"over_100m": {"healthy": 6,  "warning": 2,  "constraint": 0}},
        "recruitment":          {"over_100m": {"healthy": 8,  "warning": 3,  "constraint": 0}},
        "healthcare":           {"over_100m": {"healthy": 7,  "warning": 3,  "constraint": 1}},
        "manufacturing":        {"over_100m": {"healthy": 5,  "warning": 2,  "constraint": 0}},
        "default":              {"over_100m": {"healthy": 8,  "warning": 4,  "constraint": 1}},
    },

    "recurring_revenue_pct": {
        "accountancy_firm":     {"over_100m": {"healthy": 75, "warning": 55, "constraint": 40}},
        "legal_services":       {"over_100m": {"healthy": 60, "warning": 40, "constraint": 25}},
        "financial_services":   {"over_100m": {"healthy": 80, "warning": 60, "constraint": 45}},
        "technology_saas":      {"over_100m": {"healthy": 85, "warning": 65, "constraint": 50}},
        "professional_services":{"over_100m": {"healthy": 65, "warning": 45, "constraint": 30}},
        "marketing_agency":     {"over_100m": {"healthy": 60, "warning": 40, "constraint": 25}},
        "default":              {"over_100m": {"healthy": 65, "warning": 45, "constraint": 30}},
    },

    "debt_to_ebitda": {
        "default": {
            "under_1m":   {"healthy": 1.5, "warning": 2.5, "constraint": 4.0},
            "1m_to_10m":  {"healthy": 2.0, "warning": 3.0, "constraint": 4.5},
            "10m_to_50m": {"healthy": 2.5, "warning": 3.5, "constraint": 5.0},
            "over_100m":  {"healthy": 3.0, "warning": 4.0, "constraint": 6.0},
        },
    },

    "cash_runway_months": {
        "default": {
            "under_1m":  {"healthy": 6,  "warning": 3,  "constraint": 2},
            "over_100m": {"healthy": 12, "warning": 6,  "constraint": 3},
        },
    },

    # ── SALES & PIPELINE FIELDS ───────────────────────────────────

    "lead_to_client_conversion": {
        "accountancy_firm":     {"over_100m": {"healthy": 35, "warning": 20, "constraint": 12}},
        "legal_services":       {"over_100m": {"healthy": 40, "warning": 25, "constraint": 15}},
        "financial_services":   {"over_100m": {"healthy": 30, "warning": 18, "constraint": 10}},
        "technology_saas":      {"over_100m": {"healthy": 25, "warning": 12, "constraint": 6}},
        "professional_services":{"over_100m": {"healthy": 35, "warning": 20, "constraint": 12}},
        "marketing_agency":     {"over_100m": {"healthy": 30, "warning": 15, "constraint": 8}},
        "estate_agency":        {"over_100m": {"healthy": 20, "warning": 10, "constraint": 5}},
        "recruitment":          {"over_100m": {"healthy": 25, "warning": 12, "constraint": 6}},
        "default":              {"over_100m": {"healthy": 28, "warning": 15, "constraint": 8}},
    },

    "win_rate_pct": {
        "accountancy_firm":     {"over_100m": {"healthy": 45, "warning": 30, "constraint": 18}},
        "legal_services":       {"over_100m": {"healthy": 50, "warning": 35, "constraint": 22}},
        "financial_services":   {"over_100m": {"healthy": 40, "warning": 28, "constraint": 18}},
        "technology_saas":      {"over_100m": {"healthy": 25, "warning": 15, "constraint": 8}},
        "professional_services":{"over_100m": {"healthy": 45, "warning": 30, "constraint": 20}},
        "marketing_agency":     {"over_100m": {"healthy": 35, "warning": 22, "constraint": 14}},
        "default":              {"over_100m": {"healthy": 38, "warning": 25, "constraint": 15}},
    },

    "avg_response_time_hours": {
        "default": {
            "under_1m":  {"healthy": 2,  "warning": 4,  "constraint": 8},
            "over_100m": {"healthy": 4,  "warning": 8,  "constraint": 24},
        },
    },

    "average_sales_cycle_days": {
        "accountancy_firm":     {"over_100m": {"healthy": 60,  "warning": 90,  "constraint": 120}},
        "legal_services":       {"over_100m": {"healthy": 90,  "warning": 120, "constraint": 180}},
        "financial_services":   {"over_100m": {"healthy": 90,  "warning": 120, "constraint": 180}},
        "technology_saas":      {"over_100m": {"healthy": 45,  "warning": 75,  "constraint": 120}},
        "professional_services":{"over_100m": {"healthy": 60,  "warning": 90,  "constraint": 150}},
        "marketing_agency":     {"over_100m": {"healthy": 30,  "warning": 60,  "constraint": 90}},
        "default":              {"over_100m": {"healthy": 60,  "warning": 90,  "constraint": 120}},
    },

    "avg_discount_pct": {
        "accountancy_firm":     {"over_100m": {"healthy": 5,  "warning": 10, "constraint": 18}},
        "legal_services":       {"over_100m": {"healthy": 3,  "warning": 8,  "constraint": 15}},
        "financial_services":   {"over_100m": {"healthy": 3,  "warning": 7,  "constraint": 12}},
        "technology_saas":      {"over_100m": {"healthy": 8,  "warning": 15, "constraint": 25}},
        "professional_services":{"over_100m": {"healthy": 5,  "warning": 10, "constraint": 18}},
        "marketing_agency":     {"over_100m": {"healthy": 8,  "warning": 15, "constraint": 22}},
        "estate_agency":        {"over_100m": {"healthy": 5,  "warning": 10, "constraint": 18}},
        "default":              {"over_100m": {"healthy": 5,  "warning": 12, "constraint": 20}},
    },

    "cac_to_ltv_ratio": {
        "accountancy_firm":     {"over_100m": {"healthy": 8,  "warning": 5,  "constraint": 3}},
        "legal_services":       {"over_100m": {"healthy": 7,  "warning": 4,  "constraint": 2.5}},
        "financial_services":   {"over_100m": {"healthy": 6,  "warning": 4,  "constraint": 2.5}},
        "technology_saas":      {"over_100m": {"healthy": 5,  "warning": 3,  "constraint": 2}},
        "professional_services":{"over_100m": {"healthy": 6,  "warning": 4,  "constraint": 2.5}},
        "default":              {"over_100m": {"healthy": 5,  "warning": 3,  "constraint": 2}},
    },

    # ── OPERATIONS FIELDS ───────────────────────────────────────────

    "staff_turnover_12m": {
        "accountancy_firm":     {"over_100m": {"healthy": 12, "warning": 18, "constraint": 25}},
        "legal_services":       {"over_100m": {"healthy": 10, "warning": 16, "constraint": 22}},
        "financial_services":   {"over_100m": {"healthy": 12, "warning": 18, "constraint": 25}},
        "technology_saas":      {"over_100m": {"healthy": 15, "warning": 22, "constraint": 30}},
        "professional_services":{"over_100m": {"healthy": 12, "warning": 18, "constraint": 25}},
        "marketing_agency":     {"over_100m": {"healthy": 18, "warning": 25, "constraint": 35}},
        "estate_agency":        {"over_100m": {"healthy": 20, "warning": 30, "constraint": 40}},
        "recruitment":          {"over_100m": {"healthy": 25, "warning": 35, "constraint": 50}},
        "healthcare":           {"over_100m": {"healthy": 15, "warning": 22, "constraint": 30}},
        "manufacturing":        {"over_100m": {"healthy": 10, "warning": 16, "constraint": 22}},
        "default":              {"over_100m": {"healthy": 14, "warning": 20, "constraint": 28}},
    },

    "avg_utilisation_pct": {
        "accountancy_firm":     {"over_100m": {"healthy": 78, "warning": 85, "constraint": 92}},
        "legal_services":       {"over_100m": {"healthy": 75, "warning": 82, "constraint": 90}},
        "financial_services":   {"over_100m": {"healthy": 75, "warning": 83, "constraint": 90}},
        "technology_saas":      {"over_100m": {"healthy": 70, "warning": 80, "constraint": 88}},
        "professional_services":{"over_100m": {"healthy": 78, "warning": 85, "constraint": 92}},
        "marketing_agency":     {"over_100m": {"healthy": 75, "warning": 85, "constraint": 92}},
        "default":              {"over_100m": {"healthy": 75, "warning": 83, "constraint": 90}},
    },

    "revenue_per_head": {
        "accountancy_firm":     {"over_100m": {"healthy": 180000, "warning": 140000, "constraint": 100000}},
        "legal_services":       {"over_100m": {"healthy": 220000, "warning": 170000, "constraint": 120000}},
        "financial_services":   {"over_100m": {"healthy": 250000, "warning": 190000, "constraint": 140000}},
        "technology_saas":      {"over_100m": {"healthy": 300000, "warning": 220000, "constraint": 150000}},
        "professional_services":{"over_100m": {"healthy": 160000, "warning": 120000, "constraint": 85000}},
        "marketing_agency":     {"over_100m": {"healthy": 120000, "warning": 90000,  "constraint": 65000}},
        "recruitment":          {"over_100m": {"healthy": 100000, "warning": 75000,  "constraint": 55000}},
        "healthcare":           {"over_100m": {"healthy": 85000,  "warning": 65000,  "constraint": 50000}},
        "manufacturing":        {"over_100m": {"healthy": 140000, "warning": 110000, "constraint": 80000}},
        "default":              {"over_100m": {"healthy": 160000, "warning": 120000, "constraint": 85000}},
    },

    "project_on_time_pct": {
        "accountancy_firm":     {"over_100m": {"healthy": 88, "warning": 78, "constraint": 65}},
        "legal_services":       {"over_100m": {"healthy": 85, "warning": 75, "constraint": 62}},
        "technology_saas":      {"over_100m": {"healthy": 85, "warning": 75, "constraint": 62}},
        "professional_services":{"over_100m": {"healthy": 88, "warning": 78, "constraint": 65}},
        "marketing_agency":     {"over_100m": {"healthy": 82, "warning": 72, "constraint": 60}},
        "default":              {"over_100m": {"healthy": 85, "warning": 75, "constraint": 62}},
    },

    "sla_breach_rate_pct": {
        "default": {
            "over_100m": {"healthy": 2, "warning": 5, "constraint": 10},
        },
    },

    "automation_level": {
        "accountancy_firm":     {"over_100m": {"healthy": 55, "warning": 35, "constraint": 20}},
        "legal_services":       {"over_100m": {"healthy": 45, "warning": 28, "constraint": 15}},
        "financial_services":   {"over_100m": {"healthy": 60, "warning": 40, "constraint": 25}},
        "technology_saas":      {"over_100m": {"healthy": 75, "warning": 55, "constraint": 35}},
        "professional_services":{"over_100m": {"healthy": 45, "warning": 28, "constraint": 15}},
        "default":              {"over_100m": {"healthy": 45, "warning": 30, "constraint": 18}},
    },

    # ── PEOPLE FIELDS ────────────────────────────────────────────────

    "employee_engagement_score": {
        "default": {
            "over_100m": {"healthy": 72, "warning": 60, "constraint": 50},
        },
    },

    "absenteeism_rate_pct": {
        "accountancy_firm":     {"over_100m": {"healthy": 3.5, "warning": 5.5, "constraint": 8.0}},
        "legal_services":       {"over_100m": {"healthy": 3.0, "warning": 5.0, "constraint": 7.5}},
        "technology_saas":      {"over_100m": {"healthy": 2.5, "warning": 4.5, "constraint": 7.0}},
        "healthcare":           {"over_100m": {"healthy": 5.5, "warning": 7.5, "constraint": 10.0}},
        "manufacturing":        {"over_100m": {"healthy": 4.5, "warning": 6.5, "constraint": 9.0}},
        "default":              {"over_100m": {"healthy": 3.5, "warning": 5.5, "constraint": 8.0}},
    },

    "leadership_vacancy_rate_pct": {
        "default": {
            "under_1m":  {"healthy": 0,  "warning": 10, "constraint": 20},
            "over_100m": {"healthy": 5,  "warning": 12, "constraint": 20},
        },
    },

    "avg_leadership_tenure": {
        "default": {
            "over_100m": {
                "healthy_min": 3, "healthy_max": 7,
                "risk_threshold": 8,
            },
        },
    },

    # ── RISK FIELDS ─────────────────────────────────────────────────

    "top_client_revenue_pct": {
        "accountancy_firm":     {"over_100m": {"healthy": 10, "warning": 18, "constraint": 25}},
        "legal_services":       {"over_100m": {"healthy": 12, "warning": 20, "constraint": 28}},
        "technology_saas":      {"over_100m": {"healthy": 15, "warning": 25, "constraint": 35}},
        "professional_services":{"over_100m": {"healthy": 10, "warning": 18, "constraint": 25}},
        "estate_agency":        {"over_100m": {"healthy": 8,  "warning": 15, "constraint": 22}},
        "default":              {"over_100m": {"healthy": 10, "warning": 18, "constraint": 25}},
    },

    "top_3_clients_revenue_pct": {
        "accountancy_firm":     {"over_100m": {"healthy": 22, "warning": 35, "constraint": 50}},
        "legal_services":       {"over_100m": {"healthy": 25, "warning": 38, "constraint": 55}},
        "technology_saas":      {"over_100m": {"healthy": 30, "warning": 45, "constraint": 60}},
        "default":              {"over_100m": {"healthy": 25, "warning": 38, "constraint": 52}},
    },

    "cyber_security_maturity": {
        "accountancy_firm":     {"over_100m": {"healthy": 7, "warning": 5, "constraint": 3}},
        "legal_services":       {"over_100m": {"healthy": 7, "warning": 5, "constraint": 3}},
        "financial_services":   {"over_100m": {"healthy": 8, "warning": 6, "constraint": 4}},
        "technology_saas":      {"over_100m": {"healthy": 8, "warning": 6, "constraint": 4}},
        "healthcare":           {"over_100m": {"healthy": 8, "warning": 6, "constraint": 4}},
        "default":              {"over_100m": {"healthy": 7, "warning": 5, "constraint": 3}},
    },

    # ── TECHNOLOGY FIELDS ────────────────────────────────────────────

    "cloud_adoption_pct": {
        "technology_saas":      {"over_100m": {"healthy": 95, "warning": 80, "constraint": 60}},
        "financial_services":   {"over_100m": {"healthy": 75, "warning": 55, "constraint": 35}},
        "accountancy_firm":     {"over_100m": {"healthy": 70, "warning": 50, "constraint": 30}},
        "default":              {"over_100m": {"healthy": 60, "warning": 40, "constraint": 25}},
    },

    "it_spend_as_revenue_pct": {
        "technology_saas":      {"over_100m": {"healthy": 8.0, "warning": 5.0, "constraint": 3.0}},
        "financial_services":   {"over_100m": {"healthy": 5.0, "warning": 3.0, "constraint": 1.5}},
        "accountancy_firm":     {"over_100m": {"healthy": 3.5, "warning": 2.0, "constraint": 1.0}},
        "legal_services":       {"over_100m": {"healthy": 3.0, "warning": 1.8, "constraint": 0.8}},
        "default":              {"over_100m": {"healthy": 3.0, "warning": 1.5, "constraint": 0.8}},
    },

    "data_maturity_score": {
        "financial_services":   {"over_100m": {"healthy": 7, "warning": 5, "constraint": 3}},
        "technology_saas":      {"over_100m": {"healthy": 8, "warning": 6, "constraint": 4}},
        "accountancy_firm":     {"over_100m": {"healthy": 6, "warning": 4, "constraint": 2}},
        "default":              {"over_100m": {"healthy": 6, "warning": 4, "constraint": 2}},
    },
}


# ============================================================
# EXTENDED SEED BENCHMARKS
# Full 10-industry coverage, all 43 constraint frequencies,
# health pillar baselines, and typical opportunity ranges.
# ============================================================

SEED_BENCHMARKS = {

    "accountancy_firm": {
        "health": {
            "growth": 52, "operations": 65, "strategy": 58,
            "risk": 65, "context": 58, "overall": 60,
        },
        "constraint_frequency": {
            # Original 10
            "capacity_constraint":          0.68,
            "staffing_inefficiency":        0.60,
            "founder_dependency":           0.52,
            "revenue_concentration_risk":   0.48,
            "pricing_constraint":           0.42,
            "offer_weakness":               0.38,
            "trust_infrastructure_deficit": 0.28,
            "management_bottleneck":        0.32,
            "lead_response_deficit":        0.18,
            "market_selection_risk":        0.12,
            # New 33 constraints
            "weak_gross_margin":            0.25,
            "profitability_erosion":        0.30,
            "cash_runway_risk":             0.15,
            "unfavourable_cac_ltv_ratio":   0.20,
            "excessive_leverage":           0.12,
            "revenue_growth_stagnation":    0.35,
            "pipeline_coverage_gap":        0.40,
            "long_sales_cycle":             0.30,
            "client_churn_exceeds_growth":  0.18,
            "low_win_rate":                 0.32,
            "expansion_revenue_shortfall":  0.38,
            "stale_pricing_position":       0.42,
            "stale_price_review":           0.45,
            "low_process_documentation":    0.30,
            "low_automation_coverage":      0.52,
            "low_operational_resilience":   0.22,
            "no_business_continuity_plan":  0.28,
            "high_absenteeism":             0.18,
            "stale_financial_review":       0.10,
            "insufficient_insurance_cover": 0.08,
            "missing_client_contracts":     0.12,
            "weak_data_governance":         0.35,
            "low_cloud_adoption":           0.40,
            "underinvested_in_technology":  0.32,
            "early_stage_digital_transformation": 0.28,
            "leadership_capacity_gap":      0.25,
            "succession_risk":              0.48,
            "technology_debt_risk":         0.35,
            "cyber_security_exposure":      0.20,
            "client_concentration_risk_enterprise": 0.38,
            "governance_maturity_gap":      0.22,
            "delivery_execution_gap":       0.25,
            "systematic_discounting_erosion": 0.20,
        },
        "avg_opportunity": {
            "under_1m":   {"low": 18000,    "high": 50000},
            "1m_to_10m":  {"low": 80000,    "high": 250000},
            "10m_to_50m": {"low": 400000,   "high": 1200000},
            "over_100m":  {"low": 2000000,  "high": 8000000},
        },
    },

    "legal_services": {
        "health": {
            "growth": 50, "operations": 62, "strategy": 58,
            "risk": 68, "context": 60, "overall": 60,
        },
        "constraint_frequency": {
            "capacity_constraint":          0.72,
            "founder_dependency":           0.58,
            "staffing_inefficiency":        0.55,
            "revenue_concentration_risk":   0.45,
            "pricing_constraint":           0.38,
            "management_bottleneck":        0.42,
            "offer_weakness":               0.32,
            "trust_infrastructure_deficit": 0.22,
            "lead_response_deficit":        0.15,
            "market_selection_risk":        0.10,
            "weak_gross_margin":            0.20,
            "profitability_erosion":        0.28,
            "cash_runway_risk":             0.12,
            "revenue_growth_stagnation":    0.40,
            "pipeline_coverage_gap":        0.35,
            "long_sales_cycle":             0.48,
            "low_win_rate":                 0.28,
            "succession_risk":              0.55,
            "leadership_capacity_gap":      0.28,
            "low_automation_coverage":      0.58,
            "weak_data_governance":         0.42,
            "low_cloud_adoption":           0.45,
            "technology_debt_risk":         0.40,
            "governance_maturity_gap":      0.25,
            "stale_pricing_position":       0.35,
            "missing_client_contracts":     0.08,
            "cyber_security_exposure":      0.18,
            "delivery_execution_gap":       0.22,
            "high_absenteeism":             0.15,
            "client_concentration_risk_enterprise": 0.32,
            "expansion_revenue_shortfall":  0.35,
            "stale_price_review":           0.38,
            "systematic_discounting_erosion": 0.15,
            "unfavourable_cac_ltv_ratio":   0.18,
            "excessive_leverage":           0.10,
            "low_process_documentation":    0.28,
            "low_operational_resilience":   0.20,
            "no_business_continuity_plan":  0.25,
            "stale_financial_review":       0.08,
            "insufficient_insurance_cover": 0.06,
            "underinvested_in_technology":  0.35,
            "early_stage_digital_transformation": 0.32,
            "profitability_erosion":        0.22,
        },
        "avg_opportunity": {
            "under_1m":   {"low": 20000,    "high": 60000},
            "over_100m":  {"low": 2500000,  "high": 9000000},
        },
    },

    "financial_services": {
        "health": {
            "growth": 55, "operations": 62, "strategy": 65,
            "risk": 70, "context": 60, "overall": 62,
        },
        "constraint_frequency": {
            "capacity_constraint":          0.55,
            "founder_dependency":           0.45,
            "revenue_concentration_risk":   0.52,
            "pricing_constraint":           0.35,
            "staffing_inefficiency":        0.48,
            "management_bottleneck":        0.38,
            "offer_weakness":               0.30,
            "trust_infrastructure_deficit": 0.25,
            "lead_response_deficit":        0.20,
            "market_selection_risk":        0.12,
            "succession_risk":              0.50,
            "leadership_capacity_gap":      0.30,
            "governance_maturity_gap":      0.28,
            "cyber_security_exposure":      0.22,
            "weak_data_governance":         0.38,
            "low_automation_coverage":      0.42,
            "revenue_growth_stagnation":    0.35,
            "client_concentration_risk_enterprise": 0.45,
            "excessive_leverage":           0.18,
            "stale_pricing_position":       0.30,
            "pipeline_coverage_gap":        0.32,
            "long_sales_cycle":             0.40,
            "low_win_rate":                 0.25,
            "expansion_revenue_shortfall":  0.30,
            "technology_debt_risk":         0.38,
            "low_cloud_adoption":           0.35,
            "underinvested_in_technology":  0.28,
            "weak_gross_margin":            0.18,
            "profitability_erosion":        0.22,
            "cash_runway_risk":             0.10,
            "unfavourable_cac_ltv_ratio":   0.22,
            "systematic_discounting_erosion": 0.12,
            "delivery_execution_gap":       0.18,
            "high_absenteeism":             0.12,
            "stale_financial_review":       0.05,
            "insufficient_insurance_cover": 0.05,
            "missing_client_contracts":     0.08,
            "low_process_documentation":    0.22,
            "low_operational_resilience":   0.18,
            "no_business_continuity_plan":  0.15,
            "stale_price_review":           0.28,
            "early_stage_digital_transformation": 0.25,
        },
        "avg_opportunity": {
            "over_100m": {"low": 3000000, "high": 12000000},
        },
    },

    "technology_saas": {
        "health": {
            "growth": 62, "operations": 58, "strategy": 65,
            "risk": 55, "context": 62, "overall": 60,
        },
        "constraint_frequency": {
            "capacity_constraint":          0.65,
            "founder_dependency":           0.62,
            "staffing_inefficiency":        0.55,
            "revenue_concentration_risk":   0.40,
            "pricing_constraint":           0.38,
            "offer_weakness":               0.42,
            "management_bottleneck":        0.48,
            "trust_infrastructure_deficit": 0.25,
            "lead_response_deficit":        0.30,
            "market_selection_risk":        0.15,
            "pipeline_coverage_gap":        0.50,
            "long_sales_cycle":             0.42,
            "low_win_rate":                 0.40,
            "expansion_revenue_shortfall":  0.35,
            "client_churn_exceeds_growth":  0.30,
            "unfavourable_cac_ltv_ratio":   0.38,
            "revenue_growth_stagnation":    0.28,
            "succession_risk":              0.42,
            "leadership_capacity_gap":      0.35,
            "weak_data_governance":         0.30,
            "cyber_security_exposure":      0.25,
            "technology_debt_risk":         0.32,
            "governance_maturity_gap":      0.22,
            "systematic_discounting_erosion": 0.35,
            "stale_pricing_position":       0.28,
            "stale_price_review":           0.25,
            "high_absenteeism":             0.15,
            "delivery_execution_gap":       0.30,
            "low_automation_coverage":      0.25,
            "low_process_documentation":    0.30,
            "weak_gross_margin":            0.22,
            "profitability_erosion":        0.25,
            "cash_runway_risk":             0.20,
            "excessive_leverage":           0.12,
            "low_cloud_adoption":           0.10,
            "underinvested_in_technology":  0.08,
            "early_stage_digital_transformation": 0.15,
            "low_operational_resilience":   0.18,
            "no_business_continuity_plan":  0.22,
            "stale_financial_review":       0.08,
            "insufficient_insurance_cover": 0.10,
            "missing_client_contracts":     0.15,
            "client_concentration_risk_enterprise": 0.35,
        },
        "avg_opportunity": {
            "over_100m": {"low": 4000000, "high": 15000000},
        },
    },

    "professional_services": {
        "health": {
            "growth": 54, "operations": 60, "strategy": 56,
            "risk": 58, "context": 58, "overall": 57,
        },
        "constraint_frequency": {
            "founder_dependency":           0.68,
            "capacity_constraint":          0.62,
            "staffing_inefficiency":        0.55,
            "revenue_concentration_risk":   0.52,
            "pricing_constraint":           0.48,
            "offer_weakness":               0.42,
            "management_bottleneck":        0.40,
            "trust_infrastructure_deficit": 0.30,
            "lead_response_deficit":        0.22,
            "market_selection_risk":        0.15,
            "succession_risk":              0.52,
            "leadership_capacity_gap":      0.30,
            "pipeline_coverage_gap":        0.42,
            "expansion_revenue_shortfall":  0.38,
            "stale_pricing_position":       0.45,
            "stale_price_review":           0.48,
            "systematic_discounting_erosion": 0.35,
            "low_process_documentation":    0.40,
            "low_automation_coverage":      0.50,
            "delivery_execution_gap":       0.28,
            "weak_gross_margin":            0.28,
            "revenue_growth_stagnation":    0.38,
            "client_concentration_risk_enterprise": 0.42,
            "governance_maturity_gap":      0.28,
            "technology_debt_risk":         0.38,
            "low_cloud_adoption":           0.42,
            "weak_data_governance":         0.40,
            "low_win_rate":                 0.30,
            "long_sales_cycle":             0.35,
            "client_churn_exceeds_growth":  0.22,
            "high_absenteeism":             0.18,
            "profitability_erosion":        0.25,
            "cash_runway_risk":             0.15,
            "unfavourable_cac_ltv_ratio":   0.20,
            "excessive_leverage":           0.12,
            "cyber_security_exposure":      0.18,
            "no_business_continuity_plan":  0.25,
            "low_operational_resilience":   0.22,
            "stale_financial_review":       0.10,
            "insufficient_insurance_cover": 0.08,
            "missing_client_contracts":     0.12,
            "underinvested_in_technology":  0.35,
            "early_stage_digital_transformation": 0.30,
        },
        "avg_opportunity": {
            "over_100m": {"low": 2000000, "high": 7000000},
        },
    },

    "marketing_agency": {
        "health": {
            "growth": 55, "operations": 50, "strategy": 60,
            "risk": 50, "context": 55, "overall": 54,
        },
        "constraint_frequency": {
            "founder_dependency":           0.75,
            "capacity_constraint":          0.70,
            "offer_weakness":               0.60,
            "pricing_constraint":           0.55,
            "staffing_inefficiency":        0.50,
            "revenue_concentration_risk":   0.45,
            "trust_infrastructure_deficit": 0.35,
            "lead_response_deficit":        0.30,
            "management_bottleneck":        0.40,
            "market_selection_risk":        0.15,
            "succession_risk":              0.58,
            "leadership_capacity_gap":      0.35,
            "stale_pricing_position":       0.52,
            "systematic_discounting_erosion": 0.45,
            "pipeline_coverage_gap":        0.48,
            "client_churn_exceeds_growth":  0.35,
            "expansion_revenue_shortfall":  0.40,
            "low_process_documentation":    0.45,
            "low_automation_coverage":      0.48,
            "delivery_execution_gap":       0.35,
            "high_absenteeism":             0.22,
            "revenue_growth_stagnation":    0.32,
            "weak_gross_margin":            0.32,
            "client_concentration_risk_enterprise": 0.48,
            "technology_debt_risk":         0.32,
            "low_cloud_adoption":           0.35,
            "governance_maturity_gap":      0.30,
            "weak_data_governance":         0.38,
            "unfavourable_cac_ltv_ratio":   0.28,
            "long_sales_cycle":             0.30,
            "low_win_rate":                 0.35,
            "stale_price_review":           0.50,
            "profitability_erosion":        0.28,
            "cash_runway_risk":             0.18,
            "cyber_security_exposure":      0.15,
            "excessive_leverage":           0.10,
            "no_business_continuity_plan":  0.30,
            "low_operational_resilience":   0.25,
            "stale_financial_review":       0.12,
            "insufficient_insurance_cover": 0.10,
            "missing_client_contracts":     0.18,
            "underinvested_in_technology":  0.30,
            "early_stage_digital_transformation": 0.28,
        },
        "avg_opportunity": {
            "over_100m": {"low": 1500000, "high": 5000000},
        },
    },

    "estate_agency": {
        "health": {
            "growth": 60, "operations": 55, "strategy": 50,
            "risk": 55, "context": 60, "overall": 56,
        },
        "constraint_frequency": {
            "trust_infrastructure_deficit": 0.70,
            "lead_response_deficit":        0.60,
            "pricing_constraint":           0.45,
            "founder_dependency":           0.50,
            "capacity_constraint":          0.35,
            "offer_weakness":               0.40,
            "revenue_concentration_risk":   0.30,
            "staffing_inefficiency":        0.25,
            "management_bottleneck":        0.30,
            "market_selection_risk":        0.15,
            "succession_risk":              0.42,
            "leadership_capacity_gap":      0.25,
            "stale_pricing_position":       0.38,
            "pipeline_coverage_gap":        0.42,
            "client_churn_exceeds_growth":  0.30,
            "revenue_growth_stagnation":    0.35,
            "systematic_discounting_erosion": 0.35,
            "low_process_documentation":    0.38,
            "low_automation_coverage":      0.42,
            "delivery_execution_gap":       0.28,
            "client_concentration_risk_enterprise": 0.35,
            "technology_debt_risk":         0.35,
            "low_cloud_adoption":           0.38,
            "governance_maturity_gap":      0.25,
            "weak_data_governance":         0.35,
            "high_absenteeism":             0.18,
            "weak_gross_margin":            0.30,
            "profitability_erosion":        0.25,
            "cash_runway_risk":             0.20,
            "unfavourable_cac_ltv_ratio":   0.22,
            "excessive_leverage":           0.15,
            "cyber_security_exposure":      0.18,
            "expansion_revenue_shortfall":  0.30,
            "stale_price_review":           0.42,
            "long_sales_cycle":             0.25,
            "low_win_rate":                 0.30,
            "no_business_continuity_plan":  0.28,
            "low_operational_resilience":   0.22,
            "stale_financial_review":       0.12,
            "insufficient_insurance_cover": 0.10,
            "missing_client_contracts":     0.15,
            "underinvested_in_technology":  0.32,
            "early_stage_digital_transformation": 0.30,
        },
        "avg_opportunity": {
            "over_100m": {"low": 1200000, "high": 4000000},
        },
    },

    "recruitment": {
        "health": {
            "growth": 58, "operations": 52, "strategy": 52,
            "risk": 50, "context": 55, "overall": 53,
        },
        "constraint_frequency": {
            "founder_dependency":           0.65,
            "capacity_constraint":          0.60,
            "revenue_concentration_risk":   0.55,
            "staffing_inefficiency":        0.58,
            "management_bottleneck":        0.45,
            "pricing_constraint":           0.40,
            "offer_weakness":               0.35,
            "trust_infrastructure_deficit": 0.28,
            "lead_response_deficit":        0.38,
            "market_selection_risk":        0.18,
            "client_churn_exceeds_growth":  0.42,
            "pipeline_coverage_gap":        0.45,
            "low_win_rate":                 0.40,
            "expansion_revenue_shortfall":  0.35,
            "succession_risk":              0.48,
            "leadership_capacity_gap":      0.30,
            "high_absenteeism":             0.30,
            "delivery_execution_gap":       0.32,
            "systematic_discounting_erosion": 0.38,
            "revenue_growth_stagnation":    0.35,
            "weak_gross_margin":            0.35,
            "client_concentration_risk_enterprise": 0.45,
            "stale_pricing_position":       0.40,
            "stale_price_review":           0.42,
            "low_process_documentation":    0.42,
            "low_automation_coverage":      0.45,
            "technology_debt_risk":         0.35,
            "low_cloud_adoption":           0.38,
            "governance_maturity_gap":      0.28,
            "weak_data_governance":         0.35,
            "profitability_erosion":        0.28,
            "cash_runway_risk":             0.20,
            "unfavourable_cac_ltv_ratio":   0.25,
            "excessive_leverage":           0.12,
            "cyber_security_exposure":      0.18,
            "long_sales_cycle":             0.28,
            "no_business_continuity_plan":  0.28,
            "low_operational_resilience":   0.25,
            "stale_financial_review":       0.12,
            "insufficient_insurance_cover": 0.10,
            "missing_client_contracts":     0.20,
            "underinvested_in_technology":  0.32,
            "early_stage_digital_transformation": 0.30,
        },
        "avg_opportunity": {
            "over_100m": {"low": 1000000, "high": 3500000},
        },
    },

    "healthcare": {
        "health": {
            "growth": 52, "operations": 60, "strategy": 55,
            "risk": 65, "context": 60, "overall": 58,
        },
        "constraint_frequency": {
            "capacity_constraint":          0.75,
            "staffing_inefficiency":        0.68,
            "founder_dependency":           0.48,
            "revenue_concentration_risk":   0.42,
            "pricing_constraint":           0.35,
            "offer_weakness":               0.28,
            "management_bottleneck":        0.42,
            "trust_infrastructure_deficit": 0.22,
            "lead_response_deficit":        0.18,
            "market_selection_risk":        0.10,
            "high_absenteeism":             0.40,
            "succession_risk":              0.52,
            "leadership_capacity_gap":      0.35,
            "delivery_execution_gap":       0.35,
            "low_process_documentation":    0.35,
            "low_automation_coverage":      0.55,
            "cyber_security_exposure":      0.28,
            "governance_maturity_gap":      0.25,
            "revenue_growth_stagnation":    0.35,
            "weak_gross_margin":            0.30,
            "no_business_continuity_plan":  0.22,
            "low_operational_resilience":   0.25,
            "technology_debt_risk":         0.40,
            "low_cloud_adoption":           0.42,
            "weak_data_governance":         0.38,
            "client_concentration_risk_enterprise": 0.40,
            "stale_pricing_position":       0.30,
            "pipeline_coverage_gap":        0.32,
            "expansion_revenue_shortfall":  0.28,
            "profitability_erosion":        0.25,
            "cash_runway_risk":             0.18,
            "unfavourable_cac_ltv_ratio":   0.18,
            "excessive_leverage":           0.12,
            "systematic_discounting_erosion": 0.15,
            "long_sales_cycle":             0.25,
            "low_win_rate":                 0.22,
            "client_churn_exceeds_growth":  0.20,
            "stale_price_review":           0.32,
            "stale_financial_review":       0.08,
            "insufficient_insurance_cover": 0.08,
            "missing_client_contracts":     0.10,
            "underinvested_in_technology":  0.38,
            "early_stage_digital_transformation": 0.35,
        },
        "avg_opportunity": {
            "over_100m": {"low": 1500000, "high": 5000000},
        },
    },

    "manufacturing": {
        "health": {
            "growth": 50, "operations": 62, "strategy": 52,
            "risk": 58, "context": 52, "overall": 55,
        },
        "constraint_frequency": {
            "capacity_constraint":          0.58,
            "staffing_inefficiency":        0.52,
            "founder_dependency":           0.45,
            "revenue_concentration_risk":   0.50,
            "pricing_constraint":           0.42,
            "offer_weakness":               0.30,
            "management_bottleneck":        0.38,
            "trust_infrastructure_deficit": 0.20,
            "lead_response_deficit":        0.20,
            "market_selection_risk":        0.22,
            "technology_debt_risk":         0.55,
            "low_automation_coverage":      0.48,
            "low_cloud_adoption":           0.50,
            "weak_data_governance":         0.42,
            "succession_risk":              0.48,
            "leadership_capacity_gap":      0.28,
            "revenue_growth_stagnation":    0.42,
            "weak_gross_margin":            0.40,
            "profitability_erosion":        0.32,
            "cash_runway_risk":             0.18,
            "excessive_leverage":           0.20,
            "client_concentration_risk_enterprise": 0.48,
            "delivery_execution_gap":       0.32,
            "low_process_documentation":    0.35,
            "low_operational_resilience":   0.28,
            "no_business_continuity_plan":  0.25,
            "governance_maturity_gap":      0.22,
            "cyber_security_exposure":      0.22,
            "pipeline_coverage_gap":        0.35,
            "long_sales_cycle":             0.38,
            "low_win_rate":                 0.30,
            "expansion_revenue_shortfall":  0.32,
            "stale_pricing_position":       0.38,
            "stale_price_review":           0.40,
            "systematic_discounting_erosion": 0.30,
            "high_absenteeism":             0.25,
            "unfavourable_cac_ltv_ratio":   0.20,
            "stale_financial_review":       0.10,
            "insufficient_insurance_cover": 0.08,
            "missing_client_contracts":     0.15,
            "underinvested_in_technology":  0.40,
            "early_stage_digital_transformation": 0.38,
            "client_churn_exceeds_growth":  0.22,
        },
        "avg_opportunity": {
            "over_100m": {"low": 2000000, "high": 7000000},
        },
    },

    "default": {
        "health": {
            "growth": 54, "operations": 58, "strategy": 55,
            "risk": 58, "context": 57, "overall": 56,
        },
        "constraint_frequency": {
            "founder_dependency":           0.55,
            "capacity_constraint":          0.55,
            "pricing_constraint":           0.45,
            "staffing_inefficiency":        0.48,
            "revenue_concentration_risk":   0.42,
            "offer_weakness":               0.40,
            "management_bottleneck":        0.38,
            "trust_infrastructure_deficit": 0.30,
            "lead_response_deficit":        0.28,
            "market_selection_risk":        0.15,
            "succession_risk":              0.48,
            "leadership_capacity_gap":      0.28,
            "pipeline_coverage_gap":        0.40,
            "expansion_revenue_shortfall":  0.35,
            "stale_pricing_position":       0.40,
            "stale_price_review":           0.42,
            "systematic_discounting_erosion": 0.30,
            "low_process_documentation":    0.38,
            "low_automation_coverage":      0.45,
            "delivery_execution_gap":       0.28,
            "weak_gross_margin":            0.28,
            "revenue_growth_stagnation":    0.35,
            "client_concentration_risk_enterprise": 0.38,
            "technology_debt_risk":         0.38,
            "low_cloud_adoption":           0.40,
            "governance_maturity_gap":      0.25,
            "weak_data_governance":         0.38,
            "unfavourable_cac_ltv_ratio":   0.22,
            "long_sales_cycle":             0.32,
            "low_win_rate":                 0.30,
            "client_churn_exceeds_growth":  0.22,
            "high_absenteeism":             0.18,
            "profitability_erosion":        0.25,
            "cash_runway_risk":             0.15,
            "excessive_leverage":           0.12,
            "cyber_security_exposure":      0.20,
            "no_business_continuity_plan":  0.25,
            "low_operational_resilience":   0.22,
            "stale_financial_review":       0.10,
            "insufficient_insurance_cover": 0.08,
            "missing_client_contracts":     0.12,
            "underinvested_in_technology":  0.32,
            "early_stage_digital_transformation": 0.28,
        },
        "avg_opportunity": {
            "over_100m": {"low": 1500000, "high": 5000000},
        },
    },
}


def get_field_threshold(field: str, industry: str, revenue_band: str) -> dict:
    """
    Returns the healthy/warning/constraint thresholds for a given
    field, industry, and revenue band. Falls back to 'default'
    industry and 'over_100m' band if not found.
    """
    field_data = FIELD_THRESHOLDS.get(field, {})
    industry_data = field_data.get(industry) or field_data.get("default", {})
    band_data = industry_data.get(revenue_band) or industry_data.get("over_100m", {})
    return band_data


def get_constraint_frequency(constraint_key: str, industry: str) -> float:
    """Returns how frequently a constraint appears in an industry."""
    ind_data = SEED_BENCHMARKS.get(industry, SEED_BENCHMARKS["default"])
    return ind_data.get("constraint_frequency", {}).get(constraint_key, 0.25)


def get_avg_opportunity(industry: str, revenue_band: str) -> dict:
    """Returns typical opportunity range for an industry/band."""
    ind_data = SEED_BENCHMARKS.get(industry, SEED_BENCHMARKS["default"])
    opp_data = ind_data.get("avg_opportunity", {})
    return opp_data.get(revenue_band) or opp_data.get("over_100m", {"low": 500000, "high": 2000000})
