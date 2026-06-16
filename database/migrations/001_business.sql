
-- ============================================================
-- BEI MVP 1 - Migration 001
-- Entity: Business
-- Phase: 1A - Core Data Architecture
-- Reference: BEI Master Architecture Section 13
-- ============================================================

CREATE TABLE businesses (
	-- Primary identifier
	id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),

	-- Core identity
	business_name       VARCHAR(255) NOT NULL,
	trading_name        VARCHAR(255),
	website             VARCHAR(255),
	phone               VARCHAR(50),
	email               VARCHAR(255),

	-- Industry - locked to MVP 1 industries only
	industry            VARCHAR(50) NOT NULL CHECK (
							industry IN (
								'estate_agency',
								'marketing_agency',
								'accountancy_firm'
							)
						),

	-- Business profile
	business_model      VARCHAR(100),
	year_founded        INTEGER,
	employee_count      INTEGER,
	location_city       VARCHAR(100),
	location_country    VARCHAR(100) DEFAULT 'United Kingdom',

	-- Revenue band
	annual_revenue_band VARCHAR(50) CHECK (
							annual_revenue_band IN (
								'under_250k',
								'250k_500k',
								'500k_1m',
								'1m_3m',
								'3m_10m',
								'10m_plus'
							)
						),

	-- Platform status
	status              VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (
							status IN (
								'active',
								'inactive',
								'onboarding',
								'suspended'
							)
						),

	-- MRI tracking
	mri_requested       BOOLEAN DEFAULT FALSE,
	mri_completed       BOOLEAN DEFAULT FALSE,
	mri_version         VARCHAR(20) DEFAULT 'v1.0-rules-based',

	-- Audit fields
	created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	created_by          UUID,
	updated_by          UUID
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX idx_businesses_industry ON businesses(industry);
CREATE INDEX idx_businesses_status ON businesses(status);
CREATE INDEX idx_businesses_created_at ON businesses(created_at);

-- ============================================================
-- Auto-update timestamp trigger
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = NOW();
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER businesses_updated_at
	BEFORE UPDATE ON businesses
	FOR EACH ROW
	EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Comments
-- ============================================================

COMMENT ON TABLE businesses IS 'Core business entity. Every BEI analysis begins here. Industry locked to MVP 1 scope only.';
COMMENT ON COLUMN businesses.industry IS 'MVP 1 only: estate_agency, marketing_agency, accountancy_firm';
COMMENT ON COLUMN businesses.mri_version IS 'Tracks MRI output version. v1.0-rules-based until verification and decision intelligence engines are live.';
