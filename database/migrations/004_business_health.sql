-- ============================================================
-- BEI MVP 1 - Migration 004
-- Entity: Business Health
-- Phase: 1A - Core Data Architecture
-- Reference: BEI Master Architecture Section 11 & 13
-- ============================================================

CREATE TABLE business_health (
    -- Primary identifier
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relationships
    business_id                 UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    business_twin_id            UUID NOT NULL REFERENCES business_twins(id) ON DELETE CASCADE,

    -- Overall health score
    overall_health_score        INTEGER CHECK (
                                    overall_health_score >= 0 AND
                                    overall_health_score <= 100
                                ),
    overall_health_band         VARCHAR(20) CHECK (
                                    overall_health_band IN (
                                        'exceptional',
                                        'strong',
                                        'moderate',
                                        'weak',
                                        'critical'
                                    )
                                ),

    -- Growth pillar
    growth_score                INTEGER CHECK (growth_score >= 0 AND growth_score <= 100),
    growth_band                 VARCHAR(20) CHECK (
                                    growth_band IN (
                                        'exceptional',
                                        'strong',
                                        'moderate',
                                        'weak',
                                        'critical'
                                    )
                                ),
    growth_trend                VARCHAR(20) CHECK (
                                    growth_trend IN (
                                        'improving',
                                        'stable',
                                        'declining',
                                        'unknown'
                                    )
                                ),

    -- Operations pillar
    operations_score            INTEGER CHECK (operations_score >= 0 AND operations_score <= 100),
    operations_band             VARCHAR(20) CHECK (
                                    operations_band IN (
                                        'exceptional',
                                        'strong',
                                        'moderate',
                                        'weak',
                                        'critical'
                                    )
                                ),
    operations_trend            VARCHAR(20) CHECK (
                                    operations_trend IN (
                                        'improving',
                                        'stable',
                                        'declining',
                                        'unknown'
                                    )
                                ),

    -- Strategy pillar
    strategy_score              INTEGER CHECK (strategy_score >= 0 AND strategy_score <= 100),
    strategy_band               VARCHAR(20) CHECK (
                                    strategy_band IN (
                                        'exceptional',
                                        'strong',
                                        'moderate',
                                        'weak',
                                        'critical'
                                    )
                                ),
    strategy_trend              VARCHAR(20) CHECK (
                                    strategy_trend IN (
                                        'improving',
                                        'stable',
                                        'declining',
                                        'unknown'
                                    )
                                ),

    -- Risk pillar
    risk_score                  INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
    risk_band                   VARCHAR(20) CHECK (
                                    risk_band IN (
                                        'exceptional',
                                        'strong',
                                        'moderate',
                                        'weak',
                                        'critical'
                                    )
                                ),
    risk_trend                  VARCHAR(20) CHECK (
                                    risk_trend IN (
                                        'improving',
                                        'stable',
                                        'declining',
                                        'unknown'
                                    )
                                ),

    -- Context pillar
    context_score               INTEGER CHECK (context_score >= 0 AND context_score <= 100),
    context_band                VARCHAR(20) CHECK (
                                    context_band IN (
                                        'exceptional',
                                        'strong',
                                        'moderate',
                                        'weak',
                                        'critical'
                                    )
                                ),

    -- Benchmark comparison
    industry_benchmark_score    INTEGER,
    vs_benchmark                VARCHAR(20) CHECK (
                                    vs_benchmark IN (
                                        'above',
                                        'at',
                                        'below',
                                        'unknown'
                                    )
                                ),

    -- Health version tracking
    health_version              VARCHAR(20) DEFAULT 'v1.0-rules-based',

    -- Audit fields
    calculated_at               TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at                  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at                  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX idx_business_health_business_id ON business_health(business_id);
CREATE INDEX idx_business_health_twin_id ON business_health(business_twin_id);
CREATE INDEX idx_business_health_overall ON business_health(overall_health_score);

-- ============================================================
-- Auto-update timestamp trigger
-- ============================================================

CREATE TRIGGER business_health_updated_at
    BEFORE UPDATE ON business_health
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Comments
-- ============================================================

COMMENT ON TABLE business_health IS 'BEI five pillar health scoring. Growth, Operations, Strategy, Risk, Context. Visibility layer only - does not make decisions.';
COMMENT ON COLUMN business_health.overall_health_score IS 'Weighted composite score 0-100. Exceptional 90-100, Strong 70-89, Moderate 50-69, Weak 30-49, Critical below 30.';
COMMENT ON COLUMN business_health.health_version IS 'v1.0-rules-based until full intelligence engines are live.';
