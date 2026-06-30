-- ============================================================
-- BEI MVP 1 - Migration 014
-- Entity: Business Twin
-- Purpose: Enforce one Business Twin per business at the database level
-- Reference: Persistence Layer Plan, Step 1
-- ============================================================

ALTER TABLE business_twins
ADD CONSTRAINT business_twins_business_id_unique UNIQUE (business_id);

COMMENT ON CONSTRAINT business_twins_business_id_unique ON business_twins IS
'Enforces one Business Twin per business. Required for upsert-on-business_id behaviour in the Python backend (services/db).';
