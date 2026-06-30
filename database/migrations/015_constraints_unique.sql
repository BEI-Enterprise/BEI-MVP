-- ============================================================
-- BEI MVP 1 - Migration 015
-- Entity: Constraints
-- Purpose: Enforce one row per (business_twin_id, constraint_type)
-- Reference: Persistence Layer Plan, Step 2
-- ============================================================

ALTER TABLE constraints
ADD CONSTRAINT constraints_twin_type_unique UNIQUE (business_twin_id, constraint_type);

COMMENT ON CONSTRAINT constraints_twin_type_unique ON constraints IS
'Enforces one row per constraint type per Business Twin. Required for upsert-on-(business_twin_id, constraint_type) behaviour in the Python backend (services/db/constraint_repository.py). A repeat analysis of the same business updates existing constraint rows rather than duplicating them.';
