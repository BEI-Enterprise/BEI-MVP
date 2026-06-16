-- ============================================================
-- BEI MVP 1 - Migration 009
-- Entity: Outcomes
-- Phase: 1A - Core Data Architecture
-- Reference: BEI Master Architecture Section 7, 11 & 13
-- ============================================================

CREATE TABLE outcomes (
    -- Primary identifier
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relationships
    business_id                 UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    deployment_id               UUID NOT NULL REFERENCES deployments(id) ON DELETE CASCADE,
    constraint_id               UUID NOT NULL REFERENCES constraints(id) ON DELETE CASCADE,
    opportunity_id              UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,

    -- Outcome status
    status                      VARCHAR(50) NOT NULL DEFAULT 'measuring' CHECK (
                                    status IN (
                                        'measuring',
                                        'success',
                                        'partial_success',
                                        'no_impact',
                                        'negative_impact',
                                        'inconclusive'
                                    )
                                ),

    -- Measurement windows
    -- Section 7: 7, 30, 60, 90, 180, 365 day windows
    measurement_window_days     INTEGER CHECK (
                                    measurement_window_days IN (
                                        7, 30, 60, 90, 180, 365
                                    )
                                ),
    measurement_due_at          TIMESTAMP WITH TIME ZONE,
    measurement_completed_at    TIMESTAMP WITH TIME ZONE,

    -- Expected vs actual
    expected_revenue_impact     NUMERIC(12,2),
    actual_revenue_impact       NUMERIC(12,2),
    revenue_variance            NUMERIC(12,2),

    expected_profit_impact      NUMERIC(12,2),
    actual_profit_impact        NUMERIC(12,2),
    profit_variance             NUMERIC(12,2),

    expected_capacity_impact    NUMERIC(12,2),
    actual_capacity_impact      NUMERIC(12,2),
    capacity_variance           NUMERIC(12,2),

    -- Deployment success score
    -- Section 7: 0-100 composite score
    deployment_success_score    INTEGER CHECK (
                                    deployment_success_score >= 0 AND
                                    deployment_success_score <= 100
                                ),

    -- Constraint resolution
    constraint_resolved         BOOLEAN DEFAULT FALSE,
    constraint_reduction_score  INTEGER CHECK (
                                    constraint_reduction_score >= 0 AND
                                    constraint_reduction_score <= 100
                                ),

    -- Learning flags
    -- Feeds into Learning Engine Phase 12
    learning_recorded           BOOLEAN DEFAULT FALSE,
    learning_record_id          UUID,
    anomaly_detected            BOOLEAN DEFAULT FALSE,
    anomaly_detail              TEXT,

    -- Outcome narrative
    outcome_summary             TEXT,
    outcome_detail              TEXT,
    lessons_learned             TEXT,

    -- Audit fields
    created_at                  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at                  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX idx_outcomes_business_id ON outcomes(business_id);
CREATE INDEX idx_outcomes_deployment_id ON outcomes(deployment_id);
CREATE INDEX idx_outcomes_constraint_id ON outcomes(constraint_id);
CREATE INDEX idx_outcomes_status ON outcomes(status);
CREATE INDEX idx_outcomes_measurement_due ON outcomes(measurement_due_at);
CREATE INDEX idx_outcomes_learning_recorded ON outcomes(learning_recorded);

-- ============================================================
-- Auto-update timestamp trigger
-- ============================================================

CREATE TRIGGER outcomes_updated_at
    BEFORE UPDATE ON outcomes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Comments
-- ============================================================

COMMENT ON TABLE outcomes IS 'Measures actual business improvement vs expected. Every deployment receives an outcome record. Feeds Learning Engine.';
COMMENT ON COLUMN outcomes.measurement_window_days IS 'Section 7: Measurement windows at 7, 30, 60, 90, 180, 365 days depending on deployment type.';
COMMENT ON COLUMN outcomes.deployment_success_score IS 'Composite 0-100 score. Combines revenue, profit, capacity, constraint reduction, execution quality.';
COMMENT ON COLUMN outcomes.learning_recorded IS 'Flags when outcome has been processed by Learning Engine. Unprocessed outcomes are queued for learning.';
COMMENT ON COLUMN outcomes.anomaly_detected IS 'Flags unexpected variance. Anomalies are as valuable as successes for improving future intelligence.';
