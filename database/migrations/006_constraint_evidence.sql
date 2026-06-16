-- ============================================================
-- BEI MVP 1 - Migration 006
-- Entity: Constraint Evidence
-- Phase: 1A - Core Data Architecture
-- Reference: BEI Master Architecture Section 3, 6 & 13
-- ============================================================

CREATE TABLE constraint_evidence (
    -- Primary identifier
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relationships
    business_id                 UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    constraint_id               UUID NOT NULL REFERENCES constraints(id) ON DELETE CASCADE,

    -- Evidence type
    evidence_type               VARCHAR(50) NOT NULL CHECK (
                                    evidence_type IN (
                                        'metric',
                                        'benchmark_gap',
                                        'user_input',
                                        'connector_data',
                                        'historical_pattern',
                                        'industry_reference'
                                    )
                                ),

    -- Evidence content
    evidence_title              VARCHAR(255) NOT NULL,
    evidence_detail             TEXT,
    evidence_value              VARCHAR(255),
    expected_value              VARCHAR(255),
    benchmark_value             VARCHAR(255),
    gap_identified              VARCHAR(255),

    -- Evidence scoring
    -- Section 6: Evidence Score weighted at 25% of verification
    evidence_weight             NUMERIC(5,2) DEFAULT 1.0,
    evidence_strength           VARCHAR(20) CHECK (
                                    evidence_strength IN (
                                        'strong',
                                        'moderate',
                                        'weak',
                                        'inconclusive'
                                    )
                                ),
    evidence_score              INTEGER CHECK (
                                    evidence_score >= 0 AND
                                    evidence_score <= 100
                                ),

    -- Verification stage tracking
    -- Section 6: Five stage Challenge Framework
    supports_detection          BOOLEAN DEFAULT TRUE,
    supports_verification       BOOLEAN DEFAULT FALSE,
    alternative_cause_tested    BOOLEAN DEFAULT FALSE,
    alternative_cause_result    TEXT,

    -- Data source
    data_source                 VARCHAR(100),
    data_source_date            TIMESTAMP WITH TIME ZONE,
    connector_id                UUID,

    -- Audit fields
    created_at                  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at                  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX idx_constraint_evidence_business_id ON constraint_evidence(business_id);
CREATE INDEX idx_constraint_evidence_constraint_id ON constraint_evidence(constraint_id);
CREATE INDEX idx_constraint_evidence_type ON constraint_evidence(evidence_type);
CREATE INDEX idx_constraint_evidence_strength ON constraint_evidence(evidence_strength);

-- ============================================================
-- Auto-update timestamp trigger
-- ============================================================

CREATE TRIGGER constraint_evidence_updated_at
    BEFORE UPDATE ON constraint_evidence
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Comments
-- ============================================================

COMMENT ON TABLE constraint_evidence IS 'Evidence supporting or challenging each detected constraint. Required before any constraint can be verified. Minimum evidence score 70 before proceeding.';
COMMENT ON COLUMN constraint_evidence.evidence_weight IS 'Weighted contribution to overall evidence score. Evidence Score weighted at 25% of total verification score.';
COMMENT ON COLUMN constraint_evidence.alternative_cause_tested IS 'Section 6 Challenge Framework Stage 2. Every piece of evidence must be tested for alternative causes.';
COMMENT ON COLUMN constraint_evidence.evidence_score IS 'Must reach minimum threshold of 70 before constraint can proceed to verification stage.';
