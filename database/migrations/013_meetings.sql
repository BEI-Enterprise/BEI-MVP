-- ============================================================
-- BEI MVP 1 - Migration 013
-- Entity: Meetings
-- Phase: 1A - Core Data Architecture
-- Reference: BEI Master Architecture Section 13
-- ============================================================

CREATE TABLE meetings (
        -- Primary identifier
        id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),

        -- Relationship
        business_id         UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,

        -- Meeting type — matches MeetingCentre.tsx session types
        meeting_type        VARCHAR(50) NOT NULL DEFAULT 'monthly' CHECK (
                                                meeting_type IN (
                                                        'onboarding',
                                                        'monthly',
                                                        'strategy',
                                                        'deployment'
                                                )
                                        ),

        -- Scheduling
        requested_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        scheduled_at         TIMESTAMP WITH TIME ZONE,

        -- Status
        status               VARCHAR(50) NOT NULL DEFAULT 'requested' CHECK (
                                                status IN (
                                                        'requested',
                                                        'scheduled',
                                                        'completed',
                                                        'cancelled'
                                                )
                                        ),

        -- Notes from the business, visible to admin/account manager
        notes                TEXT,

        -- Admin-side fields
        admin_notes          TEXT,
        reviewed_by_admin    BOOLEAN DEFAULT FALSE,

        -- Audit fields
        created_at           TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at           TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX idx_meetings_business_id ON meetings(business_id);
CREATE INDEX idx_meetings_status ON meetings(status);
CREATE INDEX idx_meetings_requested_at ON meetings(requested_at DESC);
CREATE INDEX idx_meetings_reviewed ON meetings(reviewed_by_admin) WHERE reviewed_by_admin = FALSE;

-- ============================================================
-- Auto-update timestamp trigger (reuses existing function from 001_business.sql)
-- ============================================================

CREATE TRIGGER meetings_updated_at
        BEFORE UPDATE ON meetings
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Comments
-- ============================================================

COMMENT ON TABLE meetings IS 'Meeting requests and notes from businesses via Meeting Centre. Surfaced live to BEI admin interface.';
COMMENT ON COLUMN meetings.notes IS 'Notes submitted by the business via Meeting Centre, visible to admin only.';
COMMENT ON COLUMN meetings.reviewed_by_admin IS 'Set true once admin has seen the request/notes. Drives the "new" badge on the admin meetings feed.';
