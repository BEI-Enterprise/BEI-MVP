-- ============================================================
-- BEI MVP 1 - Migration 008
-- Entity: Deployments
-- Phase: 1A - Core Data Architecture
-- Reference: BEI Master Architecture Section 7, 7A & 13
-- ============================================================

CREATE TABLE deployments (
    -- Primary identifier
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relationships
    business_id                 UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    opportunity_id              UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
    constraint_id               UUID NOT NULL REFERENCES constraints(id) ON DELETE CASCADE,

    -- Deployment tier
    -- Section 7: Three tier deployment model
    deployment_tier             VARCHAR(20) NOT NULL CHECK (
                                    deployment_tier IN (
                                        'tier_1_automatic',
                                        'tier_2_approval',
                                        'tier_3_recommendation'
                                    )
                                ),

    -- Deployment category
    -- Section 20 MVP 1 allowed deployment categories only
    deployment_category         VARCHAR(50) NOT NULL CHECK (
                                    deployment_category IN (
                                        'crm',
                                        'lead_routing',
                                        'lead_assignment',
                                        'tasks',
                                        'notifications',
                                        'review_system',
                                        'trust_infrastructure',
                                        'seo_content',
                                        'content_publishing',
                                        'internal_linking',
                                        'reporting',
                                        'monitoring'
                                    )
                                ),

    -- Deployment lifecycle
    status                      VARCHAR(50) NOT NULL DEFAULT 'prepared' CHECK (
                                    status IN (
                                        'prepared',
                                        'pending_approval',
                                        'approved',
                                        'rejected',
                                        'executing',
                                        'complete',
                                        'failed',
                                        'rolled_back',
                                        'monitoring'
                                    )
                                ),

    -- Deployment content
    deployment_title            VARCHAR(255) NOT NULL,
    deployment_summary          TEXT,
    deployment_detail           TEXT,
    implementation_steps        TEXT,
    expected_outcome            TEXT,

    -- Approval framework
    -- Section 7: Approval required for Tier 2
    requires_approval           BOOLEAN DEFAULT FALSE,
    approved_by                 UUID REFERENCES users(id),
    approved_at                 TIMESTAMP WITH TIME ZONE,
    rejection_reason            TEXT,

    -- Rollback framework
    -- Section 7: Every automatic deployment must support rollback
    rollback_available          BOOLEAN DEFAULT FALSE,
    rollback_instructions       TEXT,
    rolled_back_at              TIMESTAMP WITH TIME ZONE,
    rolled_back_by              UUID REFERENCES users(id),

    -- Execution tracking
    executed_at                 TIMESTAMP WITH TIME ZONE,
    completed_at                TIMESTAMP WITH TIME ZONE,
    execution_log               TEXT,

    -- Safety checks
    -- These categories are NEVER auto-deployed per architecture
    is_pricing_change           BOOLEAN DEFAULT FALSE,
    is_staffing_decision        BOOLEAN DEFAULT FALSE,
    is_strategic_decision       BOOLEAN DEFAULT FALSE,
    is_management_decision      BOOLEAN DEFAULT FALSE,

    -- Audit fields
    created_at                  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at                  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by                  UUID REFERENCES users(id)
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX idx_deployments_business_id ON deployments(business_id);
CREATE INDEX idx_deployments_opportunity_id ON deployments(opportunity_id);
CREATE INDEX idx_deployments_constraint_id ON deployments(constraint_id);
CREATE INDEX idx_deployments_status ON deployments(status);
CREATE INDEX idx_deployments_tier ON deployments(deployment_tier);
CREATE INDEX idx_deployments_category ON deployments(deployment_category);

-- ============================================================
-- Auto-update timestamp trigger
-- ============================================================

CREATE TRIGGER deployments_updated_at
    BEFORE UPDATE ON deployments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Comments
-- ============================================================

COMMENT ON TABLE deployments IS 'Deployment packages. Three tiers: automatic, approval-based, recommendation only. BEI never deploys directly from a constraint - always creates a deployment package first.';
COMMENT ON COLUMN deployments.deployment_tier IS 'Tier 1: automatic low-risk. Tier 2: BEI prepares, user approves, BEI executes. Tier 3: recommendation only, human executes.';
COMMENT ON COLUMN deployments.rollback_available IS 'Section 7A: Every automatic deployment must support rollback. If rollback unavailable deployment cannot be automatic.';
COMMENT ON COLUMN deployments.is_pricing_change IS 'Safety flag. Pricing changes are NEVER auto-deployed. Recommendation only permanently in MVP 1.';
COMMENT ON COLUMN deployments.is_staffing_decision IS 'Safety flag. Staffing decisions are NEVER auto-deployed. Recommendation only permanently in MVP 1.';
COMMENT ON COLUMN deployments.is_strategic_decision IS 'Safety flag. Strategic decisions are NEVER auto-deployed. Recommendation only permanently in MVP 1.';
