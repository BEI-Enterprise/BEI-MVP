-- ============================================================
-- BEI MVP 1 - Migration 017
-- Entity: Business Twin
-- Purpose: Add columns for People, Technology and extended
--          Strategy/Risk/Context fields that build_twin()
--          (services/twin/engine.py) already produces in memory
--          but the database has never had columns for.
-- Reference: BEI Master Architecture Section 2 — Business Twin
-- Naming convention matches migration 003 exactly.
-- ============================================================

-- ── Extended Strategy Twin ──────────────────────────────────
ALTER TABLE business_twins
ADD COLUMN strategy_revenue_target_12m NUMERIC(14,2),
ADD COLUMN strategy_primary_growth_strategy TEXT,
ADD COLUMN strategy_strategic_blockers TEXT,
ADD COLUMN strategy_competitive_advantage TEXT,
ADD COLUMN strategy_exit_strategy TEXT,
ADD COLUMN strategy_legal_structure TEXT,
ADD COLUMN strategy_ownership_structure TEXT,
ADD COLUMN strategy_board_meeting_frequency VARCHAR(100),
ADD COLUMN strategy_decision_making_structure TEXT;

-- ── Extended Risk Twin ───────────────────────────────────────
ALTER TABLE business_twins
ADD COLUMN risk_top_client_revenue_pct NUMERIC(5,2),
ADD COLUMN risk_cyber_incidents_12m INTEGER,
ADD COLUMN risk_gdpr_compliant VARCHAR(50),
ADD COLUMN risk_pending_litigation TEXT,
ADD COLUMN risk_contract_renewal_risk NUMERIC(5,2);

-- ── Extended Context Twin ───────────────────────────────────
ALTER TABLE business_twins
ADD COLUMN context_years_trading INTEGER,
ADD COLUMN context_market_share_pct NUMERIC(5,2),
ADD COLUMN context_nps_score INTEGER CHECK (
    context_nps_score >= -100 AND context_nps_score <= 100
),
ADD COLUMN context_brand_awareness_pct NUMERIC(5,2),
ADD COLUMN context_competitive_set TEXT,
ADD COLUMN context_differentiation_strength VARCHAR(20) CHECK (
    context_differentiation_strength IN (
        'strong', 'moderate', 'weak', 'unknown'
    )
);

-- ── People Twin (new) ────────────────────────────────────────
ALTER TABLE business_twins
ADD COLUMN people_total_headcount INTEGER,
ADD COLUMN people_employee_engagement_score NUMERIC(5,2),
ADD COLUMN people_staff_turnover_12m NUMERIC(5,2),
ADD COLUMN people_c_suite_size INTEGER,
ADD COLUMN people_leadership_vacancies INTEGER,
ADD COLUMN people_succession_planning VARCHAR(50),
ADD COLUMN people_avg_leadership_tenure NUMERIC(5,2);

-- ── Technology Twin (new) ────────────────────────────────────
ALTER TABLE business_twins
ADD COLUMN tech_stack_maturity VARCHAR(20) CHECK (
    tech_stack_maturity IN (
        'advanced', 'developing', 'basic', 'unknown'
    )
),
ADD COLUMN tech_cloud_adoption_pct NUMERIC(5,2),
ADD COLUMN tech_legacy_system_risk VARCHAR(20) CHECK (
    tech_legacy_system_risk IN (
        'low', 'medium', 'high', 'critical', 'unknown'
    )
),
ADD COLUMN tech_data_maturity_score NUMERIC(5,2),
ADD COLUMN tech_ai_ml_adoption VARCHAR(20) CHECK (
    tech_ai_ml_adoption IN (
        'advanced', 'developing', 'none', 'unknown'
    )
),
ADD COLUMN tech_cyber_security_maturity NUMERIC(5,2);

-- ============================================================
-- Comments
-- ============================================================
COMMENT ON COLUMN business_twins.people_total_headcount IS 'People Twin (new sub-twin, migration 017). Supports enterprise-scale businesses up to 10,000+ staff.';
COMMENT ON COLUMN business_twins.tech_stack_maturity IS 'Technology Twin (new sub-twin, migration 017).';
COMMENT ON COLUMN business_twins.strategy_revenue_target_12m IS 'Extended Strategy field (migration 017) — supports enterprise revenue targets up to £150M+.';
