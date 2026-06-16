-- ============================================================
-- BEI MVP 1 - Migration 005
-- Entity: Constraints
-- Phase: 1A - Core Data Architecture
-- Reference: BEI Master Architecture Section 3, 4 & 13
-- ============================================================

CREATE TABLE constraints (
    -- Primary identifier
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relationships
    business_id                 UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    business_twin_id            UUID NOT NULL REFERENCES business_twins(id) ON DELETE CASCADE,

    -- Constraint type - locked to MVP 1 constraints only
    constraint_type             VARCHAR(100) NOT NULL CHECK (
                                    constraint_type IN (
                                        'trust_infrastructure_deficit',
                                        'lead_response_deficit',
                                        'pricing_constraint',
                                        'staffing_inefficiency',
                                        'management_bottleneck',
                                        'capacity_constraint',
                                        'founder_dependency',
                                        'revenue_concentration_risk',
                                        'offer_weakness',
                                        'market_selection_risk'
                                    )
                                ),

    -- Constraint lifecycle
    lifecycle_status            VARCHAR(50) NOT NULL DEFAULT 'detected' CHECK (
                                    lifecycle_status IN (
                                        'detected',
                                        'evidence_gathering',
                                        'verification',
                                        'challenge',
                                        'verified',
                                        'rejected',
                                        'primary',
                                        'secondary',
                                        'deployed',
                                        'resolved',
                                        'archived'
                                    )
                                ),

    -- Core scores - Section 3 Universal Constraint Object
    severity_score              INTEGER CHECK (severity_score >= 0 AND severity_score <= 100),
    impact_score                INTEGER CHECK (impact_score >= 0 AND impact_score <= 100),
    confidence_score            INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
    verification_score          INTEGER CHECK (verification_score >= 0 AND verification_score <= 100),
    network_impact_score        INTEGER CHECK (network_impact_score >= 0 AND network_impact_score <= 100),
    opportunity_score           INTEGER CHECK (opportunity_score >= 0 AND opportunity_score <= 100),

    -- Priority scoring - Section 5A formula
    -- (Financial Impact x 0.35) + (Capacity Impact x 0.15) +
    -- (Strategic Impact x 0.20) + (Risk Impact x 0.15) + (Confidence x 0.15)
    priority_score              NUMERIC(6,2),
    priority_tier               VARCHAR(20) CHECK (
                                    priority_tier IN (
                                        'critical',
                                        'high',
                                        'medium',
                                        'low'
                                    )
                                ),

    -- Primary constraint flag
    -- Only one constraint per business may be primary at any time
    is_primary                  BOOLEAN DEFAULT FALSE,

    -- Root cause analysis
    root_cause_depth            INTEGER CHECK (
                                    root_cause_depth >= 1 AND
                                    root_cause_depth <= 5
                                ),
    -- 1=Symptom, 2=Contributing Factor, 3=Root Cause,
    -- 4=Systemic Constraint, 5=Foundational Constraint

    -- Constraint hierarchy
    parent_constraint_id        UUID REFERENCES constraints(id),
    is_root_constraint          BOOLEAN DEFAULT FALSE,

    -- Impact dimensions
    financial_impact            NUMERIC(12,2),
    capacity_impact_score       INTEGER CHECK (capacity_impact_score >= 0 AND capacity_impact_score <= 100),
    strategic_impact_score      INTEGER CHECK (strategic_impact_score >= 0 AND strategic_impact_score <= 100),
    risk_impact_score           INTEGER CHECK (risk_impact_score >= 0 AND risk_impact_score <= 100),

    -- Constraint description
    constraint_summary          TEXT,
    constraint_detail           TEXT,
    evidence_summary            TEXT,

    -- MRI output version tracking
    analysis_version            VARCHAR(20) DEFAULT 'v1.0-rules-based',

    -- Audit fields
    detected_at                 TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified_at                 TIMESTAMP WITH TIME ZONE,
    created_at                  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at                  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX idx_constraints_business_id ON constraints(business_id);
CREATE INDEX idx_constraints_twin_id ON constraints(business_twin_id);
CREATE INDEX idx_constraints_type ON constraints(constraint_type);
CREATE INDEX idx_constraints_lifecycle ON constraints(lifecycle_status);
CREATE INDEX idx_constraints_is_primary ON constraints(is_primary);
CREATE INDEX idx_constraints_priority ON constraints(priority_score DESC);

-- ============================================================
-- Auto-update timestamp trigger
-- ============================================================

CREATE TRIGGER constraints_updated_at
    BEFORE UPDATE ON constraints
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Comments
-- ============================================================

COMMENT ON TABLE constraints IS 'Core constraint entity. MVP 1 locked to 10 constraint types only. Full lifecycle from detected to archived.';
COMMENT ON COLUMN constraints.constraint_type IS 'MVP 1 only: 10 constraint types. No additions until validation complete.';
COMMENT ON COLUMN constraints.is_primary IS 'Only one constraint per business may be primary at any time. Enforced at application layer.';
COMMENT ON COLUMN constraints.root_cause_depth IS '1=Symptom, 2=Contributing Factor, 3=Root Cause, 4=Systemic Constraint, 5=Foundational Constraint';
COMMENT ON COLUMN constraints.verification_score IS 'Must be above 70 AND confidence_score above 70 before constraint can become primary. Golden Rule 1.';
COMMENT ON COLUMN constraints.analysis_version IS 'v1.0-rules-based until verification and decision intelligence engines are live.';
