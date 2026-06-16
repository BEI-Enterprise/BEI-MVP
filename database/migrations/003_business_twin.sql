
-- ============================================================
-- BEI MVP 1 - Migration 003
-- Entity: Business Twin
-- Phase: 1A - Core Data Architecture
-- Reference: BEI Master Architecture Section 2 & 13
-- ============================================================

CREATE TABLE business_twins (
	-- Primary identifier
	id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),

	-- Business relationship
	business_id             UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,

	-- Twin status
	status                  VARCHAR(50) NOT NULL DEFAULT 'building' CHECK (
								status IN (
									'building',
									'complete',
									'updating',
									'incomplete'
								)
							),

	-- Completeness tracking
	completeness_score      INTEGER DEFAULT 0 CHECK (
								completeness_score >= 0 AND
								completeness_score <= 100
							),

	-- Growth Twin
	growth_revenue_monthly      NUMERIC(12,2),
	growth_revenue_annual       NUMERIC(12,2),
	growth_revenue_trend        VARCHAR(20) CHECK (
									growth_revenue_trend IN (
										'growing',
										'stable',
										'declining',
										'unknown'
									)
								),
	growth_lead_volume          INTEGER,
	growth_lead_trend           VARCHAR(20),
	growth_conversion_rate      NUMERIC(5,2),
	growth_avg_deal_value       NUMERIC(12,2),
	growth_organic_visibility   VARCHAR(20) CHECK (
									growth_organic_visibility IN (
										'strong',
										'moderate',
										'weak',
										'unknown'
									)
								),
	growth_review_score         NUMERIC(3,2),
	growth_review_count         INTEGER,
	growth_trust_score          INTEGER,

	-- Operations Twin
	ops_team_size               INTEGER,
	ops_capacity_utilisation    NUMERIC(5,2),
	ops_response_time_hours     NUMERIC(8,2),
	ops_process_maturity        VARCHAR(20) CHECK (
									ops_process_maturity IN (
										'advanced',
										'developing',
										'basic',
										'unknown'
									)
								),
	ops_crm_in_use              BOOLEAN DEFAULT FALSE,
	ops_crm_platform            VARCHAR(100),
	ops_automation_level        VARCHAR(20) CHECK (
									ops_automation_level IN (
										'high',
										'medium',
										'low',
										'none',
										'unknown'
									)
								),

	-- Strategy Twin
	strategy_market_position    VARCHAR(20) CHECK (
									strategy_market_position IN (
										'leader',
										'challenger',
										'follower',
										'niche',
										'unknown'
									)
								),
	strategy_pricing_model      VARCHAR(100),
	strategy_pricing_strength   VARCHAR(20) CHECK (
									strategy_pricing_strength IN (
										'strong',
										'moderate',
										'weak',
										'unknown'
									)
								),
	strategy_offer_clarity      VARCHAR(20) CHECK (
									strategy_offer_clarity IN (
										'clear',
										'moderate',
										'unclear',
										'unknown'
									)
								),
	strategy_founder_dependency VARCHAR(20) CHECK (
									strategy_founder_dependency IN (
										'low',
										'medium',
										'high',
										'critical',
										'unknown'
									)
								),

	-- Risk Twin
	risk_revenue_concentration  VARCHAR(20) CHECK (
									risk_revenue_concentration IN (
										'diversified',
										'moderate',
										'concentrated',
										'critical',
										'unknown'
									)
								),
	risk_key_person_dependency  VARCHAR(20) CHECK (
									risk_key_person_dependency IN (
										'low',
										'medium',
										'high',
										'critical',
										'unknown'
									)
								),
	risk_cash_position          VARCHAR(20) CHECK (
									risk_cash_position IN (
										'strong',
										'adequate',
										'tight',
										'critical',
										'unknown'
									)
								),
	risk_client_retention_rate  NUMERIC(5,2),

	-- Context Twin
	context_business_stage      VARCHAR(50) CHECK (
									context_business_stage IN (
										'startup',
										'early_growth',
										'scaling',
										'established',
										'mature',
										'unknown'
									)
								),
	context_primary_objective   VARCHAR(50) CHECK (
									context_primary_objective IN (
										'growth',
										'profit',
										'exit',
										'risk_reduction',
										'unknown'
									)
								),
	context_market_conditions   VARCHAR(20) CHECK (
									context_market_conditions IN (
										'favourable',
										'neutral',
										'challenging',
										'unknown'
									)
								),

	-- Twin metadata
	data_confidence_score       INTEGER DEFAULT 0 CHECK (
									data_confidence_score >= 0 AND
									data_confidence_score <= 100
								),
	last_updated_at             TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

	-- Audit fields
	created_at                  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	updated_at                  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX idx_business_twins_business_id ON business_twins(business_id);
CREATE INDEX idx_business_twins_status ON business_twins(status);

-- ============================================================
-- Auto-update timestamp trigger
-- ============================================================

CREATE TRIGGER business_twins_updated_at
	BEFORE UPDATE ON business_twins
	FOR EACH ROW
	EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Comments
-- ============================================================

COMMENT ON TABLE business_twins IS 'Digital representation of a business. Five sub-twins: Growth, Operations, Strategy, Risk, Context. Single source of truth for all BEI analysis.';
COMMENT ON COLUMN business_twins.completeness_score IS 'Percentage of twin fields populated. Higher score = more accurate analysis.';
COMMENT ON COLUMN business_twins.data_confidence_score IS 'Confidence in data accuracy 0-100. Influences constraint detection confidence.';
COMMENT ON COLUMN business_twins.context_primary_objective IS 'Business objective influences constraint prioritisation. Exit businesses prioritise differently to growth businesses.';
