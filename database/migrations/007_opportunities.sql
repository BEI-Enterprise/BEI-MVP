
-- ============================================================
-- BEI MVP 1 - Migration 007
-- Entity: Opportunities
-- Phase: 1A - Core Data Architecture
-- Reference: BEI Master Architecture Section 6 & 13
-- ============================================================

CREATE TABLE opportunities (
    -- Primary identifier
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relationships
    business_id                 UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    constraint_id               UUID NOT NULL REFERENCES constraints(id) ON DELETE CASCADE,
    business_twin_id            UUID NOT NULL REFERENCES business_twins(id) ON DELETE CASCADE,

    -- Opportunity type
    opportunity_type            VARCHAR(50) NOT NULL CHECK (
                                    opportunity_type IN (
                                        'revenue',
                                        'profit',
                                        'capacity',
                                        'risk_reduction',
                                        'enterprise_value'
                                    )
                                ),

    -- Opportunity status
    status                      VARCHAR(50) NOT NULL DEFAULT 'identified' CHECK (
                                    status IN (
                                        'identified',
                                        'quantified',
                                        'approved',
                                        'deployed',
                                        'measuring',
                                        'realised',
                                        'missed',
                                        'archived'
                                    )
                                ),

    -- Opportunity value
    -- Section 6: Potential Gain x Confidence = Opportunity Value
    estimated_value             NUMERIC(12,2),
    confidence_score            INTEGER CHECK (
                                    confidence_score >= 0 AND
                                    confidence_score <= 100
                                ),
    opportunity_value           NUMERIC(12,2),
    -- opportunity_value = estimated_value x (confidence_score / 100)

    -- Impact dimensions
    revenue_impact              NUMERIC(12,2),
    profit_impact               NUMERIC(12,2),
    capacity_impact             NUMERIC(12,2),
    risk_reduction_score        INTEGER CHECK (
                                    risk_reduction_score >= 0 AND
                                    risk_reduction_score <= 100
                                ),
    enterprise_value_impact     NUMERIC(12,2),

    -- Time to impact
    time_to_impact_days         INTEGER,
    time_to_impact_band         VARCHAR(20) CHECK (
                                    time_to_impact_band IN (
                                        'immediate',
                                        'short_term',
                                        'medium_term',
                                        'long_term'
                                    )
                                ),
    -- immediate = 0-30 days
    -- short_term = 31-90 days
    -- medium_term = 91-180 days
    -- long_term = 181+ days

    -- Opportunity description
    opportunity_title           VARCHAR(255) NOT NULL,
    opportunity_summary         TEXT,
    opportunity_detail          TEXT,
    recommended_action          TEXT,

    -- Deployment readiness
    deployment_ready            BOOLEAN DEFAULT FALSE,
    deployment_tier             VARCHAR(20) CHECK (
                                    deployment_tier IN (
                                        'tier_1_automatic',
                                        'tier_2_approval',
                                        'tier_3_recommendation'
                                    )
                                ),

    -- Version tracking
    analysis_version            VARCHAR(20) DEFAULT 'v1.0-rules-based',

    -- Audit fields
    identified_at               TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at                 TIMESTAMP WITH TIME ZONE,
    created_at                  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at                  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX idx_opportunities_business_id ON opportunities(business_id);
CREATE INDEX idx_opportunities_constraint_id ON opportunities(constraint_id);
CREATE INDEX idx_opportunities_type ON opportunities(opportunity_type);
CREATE INDEX idx_opportunities_status ON opportunities(status);
CREATE INDEX idx_opportunities_value ON opportunities(opportunity_value DESC);
CREATE INDEX idx_opportunities_deployment_tier ON opportunities(deployment_tier);

-- ============================================================
-- Auto-update timestamp trigger
-- ============================================================

CREATE TRIGGER opportunities_updated_at
    BEFORE UPDATE ON opportunities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Comments
-- ============================================================

COMMENT ON TABLE opportunities IS 'Every verified constraint generates a quantified opportunity. Five dimensions: revenue, profit, capacity, risk reduction, enterprise value.';
COMMENT ON COLUMN opportunities.opportunity_value IS 'Formula: estimated_value x (confidence_score / 100). Calculated at application layer.';
COMMENT ON COLUMN opportunities.deployment_tier IS 'Tier 1: automatic. Tier 2: approval required. Tier 3: recommendation only. Never deploy pricing, staffing or strategic decisions automatically.';
COMMENT ON COLUMN opportunities.analysis_version IS 'v1.0-rules-based until verification and decision intelligence engines are live.';
