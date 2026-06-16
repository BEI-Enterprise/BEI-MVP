-- BEI Connectors Table
-- Phase 2 — Connector Layer
-- Stores external data source connections per business

CREATE TABLE IF NOT EXISTS connectors (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id           UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  connector_type        VARCHAR NOT NULL,
  connector_name        VARCHAR NOT NULL,
  status                VARCHAR NOT NULL DEFAULT 'pending',
  credentials           JSONB,
  last_synced_at        TIMESTAMP WITH TIME ZONE,
  sync_frequency_hours  INTEGER DEFAULT 24,
  data_snapshot         JSONB,
  error_message         TEXT,
  created_at            TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at            TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_connectors_business_id ON connectors(business_id);
CREATE INDEX IF NOT EXISTS idx_connectors_type ON connectors(connector_type);
CREATE INDEX IF NOT EXISTS idx_connectors_status ON connectors(status);
