-- ============================================================
-- BEI MVP 1 - Migration 010
-- Entity: Learning Records
-- Phase: 1A - Core Data Architecture
-- Reference: BEI Master Architecture Section 9, 9.5 & 13
-- ============================================================

CREATE TABLE learning_records (
    -- Primary identifier
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relationships
    business_id                 UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    outcome_id                  UUID REFERENCES outcomes(id) ON DELETE SET NULL,
    constraint_id               UUID REFERENCES constraints(id) ON DELETE SET NULL,
    deployment_id               UUID REFERENCES deployments(id) ON DELETE SET NULL,

    -- Learning type
    -- Section 9: Five learning systems
    learning_type               VARCHAR(50) NOT NULL CHECK (
                                    learning_type IN (
                                        'constraint_learning',
                                        'decision_learning',
                                        'opportunity_learning',
                                        'deployment_learning',
                                        'industry_learning'
                                    )
                                ),

    -- Learning state
    -- Section 9: Learning States lifecycle
    learning_state              VARCHAR(50) NOT NULL DEFAULT 'captured' CHECK (
                                    learning_state IN (
                                        'captured',
                                        'validated',
                                        'weighted',
                                        'integrated',
                                        'applied',
                                        'monitored',
                                        'retired'
                                    )
                                ),

    -- Industry context
    industry                    VARCHAR(50) CHECK (
                                    industry IN (
                                        'estate_agency',
                                        'marketing_agency',
                                        'accountancy_firm'
                                    )
                                ),

    -- Learning content
    learning_title              VARCHAR(255) NOT NULL,
    learning_summary            TEXT,
    learning_detail             TEXT,

    -- What was learned
    constraint_type_learned     VARCHAR(100),
    detection_insight           TEXT,
    verification_insight        TEXT,
    decision_insight            TEXT,
    opportunity_insight         TEXT,
    deployment_insight          TEXT,

    -- Outcome that generated this learning
    outcome_was_success         BOOLEAN,
    outcome_success_score       INTEGER,
    outcome_was_failure         BOOLEAN DEFAULT FALSE,
    -- Section 9: Failure Database - failed deployments
    -- are as valuable as successes

    -- Learning weight
    -- Section 9: quality x sample size x industry relevance x recency
    quality_score               INTEGER CHECK (
                                    quality_score >= 0 AND
                                    quality_score <= 100
                                ),
    industry_relevance_score    INTEGER CHECK (
                                    industry_relevance_score >= 0 AND
                                    industry_relevance_score <= 100
                                ),
    learning_weight             NUMERIC(5,4) DEFAULT 1.0,

    -- Recency tracking
    -- Section 9: Recency Engine gradually reduces older outcomes
    recency_decay_rate          NUMERIC(5,4) DEFAULT 0.0,
    effective_until             TIMESTAMP WITH TIME ZONE,

    -- Intelligence versioning
    -- Section 9.5: Intelligence Versioning enables rollback
    model_version               VARCHAR(20) DEFAULT 'v1.0',

    -- Audit fields
    created_at                  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at                  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX idx_learning_records_business_id ON learning_records(business_id);
CREATE INDEX idx_learning_records_type ON learning_records(learning_type);
CREATE INDEX idx_learning_records_state ON learning_records(learning_state);
CREATE INDEX idx_learning_records_industry ON learning_records(industry);
CREATE INDEX idx_learning_records_model_version ON learning_records(model_version);
CREATE INDEX idx_learning_records_outcome_id ON learning_records(outcome_id);

-- ============================================================
-- Auto-update timestamp trigger
-- ============================================================

CREATE TRIGGER learning_records_updated_at
    BEFORE UPDATE ON learning_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Comments
-- ============================================================

COMMENT ON TABLE learning_records IS 'Stores intelligence from every business outcome. Five learning types. Powers continuous improvement across all BEI intelligence systems.';
COMMENT ON COLUMN learning_records.outcome_was_failure IS 'Section 9 Failure Database. Failed deployments and incorrect decisions are as valuable as successes for improving future intelligence.';
COMMENT ON COLUMN learning_records.learning_weight IS 'Section 9: quality x sample size x industry relevance x recency. Calculated at application layer.';
COMMENT ON COLUMN learning_records.recency_decay_rate IS 'Section 9 Recency Engine. Older outcomes gradually reduce in influence. Rate applied at application layer.';
COMMENT ON COLUMN learning_records.model_version IS 'Section 9.5 Intelligence Versioning. Enables rollback to previous model if new version degrades accuracy.';
