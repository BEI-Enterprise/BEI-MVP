-- ============================================================
-- BEI MVP 1 - Migration 016
-- Entity: Opportunities
-- Purpose: Enforce one row per (constraint_id, opportunity_type)
-- Reference: Persistence Layer Plan, Step 3
-- Same pattern as migration 015 (constraints) — required for
-- upsert-on-conflict behaviour in opportunity_repository.py.
-- ============================================================

ALTER TABLE opportunities
ADD CONSTRAINT opportunities_constraint_type_unique UNIQUE (constraint_id, opportunity_type);

COMMENT ON CONSTRAINT opportunities_constraint_type_unique ON opportunities IS
'Enforces one row per opportunity dimension per constraint. Required for upsert-on-(constraint_id, opportunity_type) behaviour in the Python backend (services/db/opportunity_repository.py). A repeat analysis of the same business updates existing opportunity rows rather than duplicating them.';
