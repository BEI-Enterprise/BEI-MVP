-- ============================================================
-- BEI MVP 1 - Migration 002
-- Entity: Users
-- Phase: 1A - Core Data Architecture
-- Reference: BEI Master Architecture Section 13
-- ============================================================

CREATE TABLE users (
    -- Primary identifier
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Core identity
    full_name           VARCHAR(255) NOT NULL,
    email               VARCHAR(255) NOT NULL UNIQUE,
    phone               VARCHAR(50),

    -- Business relationship
    business_id         UUID REFERENCES businesses(id) ON DELETE SET NULL,

    -- Platform role
    role                VARCHAR(50) NOT NULL DEFAULT 'viewer' CHECK (
                            role IN (
                                'admin',
                                'manager',
                                'viewer',
                                'deployment_approver'
                            )
                        ),

    -- Account status
    status              VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (
                            status IN (
                                'active',
                                'inactive',
                                'pending',
                                'suspended'
                            )
                        ),

    -- Onboarding
    onboarding_complete BOOLEAN DEFAULT FALSE,
    onboarding_step     INTEGER DEFAULT 0,

    -- Audit fields
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at       TIMESTAMP WITH TIME ZONE
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX idx_users_business_id ON users(business_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

-- ============================================================
-- Auto-update
