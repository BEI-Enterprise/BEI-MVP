
-- ============================================================
-- BEI MVP 1 - Migration 011
-- Entity: Audit Log
-- Phase: 1A - Core Data Architecture
-- Reference: BEI Master Architecture Section 13
-- ============================================================

CREATE TABLE audit_log (
	-- Primary identifier
	id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),

	-- Who
	user_id                     UUID REFERENCES users(id) ON DELETE SET NULL,
	business_id                 UUID REFERENCES businesses(id) ON DELETE SET NULL,

	-- What
	action                      VARCHAR(100) NOT NULL,
	entity_type                 VARCHAR(100) NOT NULL CHECK (
									entity_type IN (
										'business',
										'user',
										'business_twin',
										'business_health',
										'constraint',
										'constraint_evidence',
										'opportunity',
										'deployment',
										'outcome',
										'learning_record'
									)
								),
	entity_id                   UUID NOT NULL,

	-- Change detail
	previous_state              JSONB,
	new_state                   JSONB,
	change_summary              TEXT,

	-- Context
	ip_address                  VARCHAR(50),
	user_agent                  TEXT,
	session_id                  VARCHAR(255),

	-- System or user action
	action_source               VARCHAR(20) DEFAULT 'user' CHECK (
									action_source IN (
										'user',
										'system',
										'agent',
										'api'
									)
								),

	-- Deployment safety log
	-- Every deployment action must be logged
	is_deployment_action        BOOLEAN DEFAULT FALSE,
	deployment_tier             VARCHAR(20),
	approval_required           BOOLEAN DEFAULT FALSE,
	approval_received           BOOLEAN DEFAULT FALSE,

	-- Timestamp
	created_at                  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX idx_audit_log_business_id ON audit_log(business_id);
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_entity_type ON audit_log(entity_type);
CREATE INDEX idx_audit_log_entity_id ON audit_log(entity_id);
CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at DESC);
CREATE INDEX idx_audit_log_deployment_actions ON audit_log(is_deployment_action)
	WHERE is_deployment_action = TRUE;

-- ============================================================
-- Comments
-- ============================================================

COMMENT ON TABLE audit_log IS 'Immutable audit trail for every action across all BEI entities. Required for deployment safety, compliance and intelligence feedback.';
COMMENT ON COLUMN audit_log.action_source IS 'user: manual action. system: automated BEI action. agent: AI agent action. api: external API action.';
COMMENT ON COLUMN audit_log.is_deployment_action IS 'Every deployment action must be logged with approval status. Non-negotiable per Golden Rule 6.';
COMMENT ON COLUMN audit_log.previous_state IS 'JSONB snapshot of entity before change. Enables rollback and learning from state transitions.';
