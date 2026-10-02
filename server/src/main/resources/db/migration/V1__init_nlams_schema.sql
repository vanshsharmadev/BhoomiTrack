-- V1__init_nlams_schema.sql
-- National Land Acquisition & Management System Database Migration

-- Enable PostGIS extension if available
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id BIGSERIAL PRIMARY KEY,
    project_code VARCHAR(50) NOT NULL UNIQUE,
    project_name VARCHAR(200) NOT NULL,
    project_type VARCHAR(50) NOT NULL,
    description TEXT,
    implementing_agency VARCHAR(150) NOT NULL,
    ministry_department VARCHAR(150),
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    estimated_land_requirement NUMERIC(14, 4),
    required_land_unit VARCHAR(20) DEFAULT 'ACRES',
    project_start_date DATE,
    expected_completion_date DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(100)
);

CREATE INDEX IF NOT EXISTS idx_project_state ON projects(state);
CREATE INDEX IF NOT EXISTS idx_project_district ON projects(district);
CREATE INDEX IF NOT EXISTS idx_project_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_project_type ON projects(project_type);

-- 2. Proposals Table
CREATE TABLE IF NOT EXISTS proposals (
    id BIGSERIAL PRIMARY KEY,
    proposal_number VARCHAR(50) NOT NULL UNIQUE,
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    land_required NUMERIC(14, 4) NOT NULL,
    land_unit VARCHAR(20) DEFAULT 'ACRES',
    villages TEXT NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    purpose TEXT NOT NULL,
    proposed_timeline_months INT,
    affected_families_count INT,
    estimated_compensation NUMERIC(16, 2),
    status VARCHAR(40) NOT NULL DEFAULT 'DRAFT',
    remarks TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    submitted_at TIMESTAMP,
    reviewed_at TIMESTAMP,
    submitted_by VARCHAR(100)
);

CREATE INDEX IF NOT EXISTS idx_proposal_project ON proposals(project_id);
CREATE INDEX IF NOT EXISTS idx_proposal_status ON proposals(status);

-- 3. Proposal Approval History Table
CREATE TABLE IF NOT EXISTS proposal_approval_histories (
    id BIGSERIAL PRIMARY KEY,
    proposal_id BIGINT NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
    from_status VARCHAR(40),
    to_status VARCHAR(40) NOT NULL,
    action VARCHAR(50) NOT NULL,
    reviewed_by VARCHAR(100),
    reviewer_role VARCHAR(50),
    comments TEXT,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_approval_history_proposal ON proposal_approval_histories(proposal_id);

-- 4. Land Parcels Table
CREATE TABLE IF NOT EXISTS land_parcels (
    id BIGSERIAL PRIMARY KEY,
    parcel_number VARCHAR(50) NOT NULL UNIQUE,
    survey_number VARCHAR(50) NOT NULL,
    khasra_number VARCHAR(50),
    village VARCHAR(100) NOT NULL,
    tehsil VARCHAR(100),
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    area NUMERIC(12, 4) NOT NULL,
    area_unit VARCHAR(20) DEFAULT 'ACRES',
    land_type VARCHAR(30) NOT NULL,
    owner_name VARCHAR(150) NOT NULL,
    owner_contact VARCHAR(20),
    owner_aadhaar_masked VARCHAR(20),
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    acquisition_status VARCHAR(30) NOT NULL DEFAULT 'PROPOSED',
    verification_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    geometry TEXT,
    verified_by VARCHAR(100),
    verified_at TIMESTAMP,
    remarks TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_parcel_project ON land_parcels(project_id);
CREATE INDEX IF NOT EXISTS idx_parcel_status ON land_parcels(acquisition_status);
CREATE INDEX IF NOT EXISTS idx_parcel_district ON land_parcels(district);
CREATE INDEX IF NOT EXISTS idx_parcel_village ON land_parcels(village);
CREATE INDEX IF NOT EXISTS idx_parcel_survey ON land_parcels(survey_number);

-- 5. Statutory Notifications Table
CREATE TABLE IF NOT EXISTS statutory_notifications (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL,
    notification_number VARCHAR(100) NOT NULL UNIQUE,
    issue_date DATE NOT NULL,
    publication_date DATE,
    gazette_number VARCHAR(100),
    document_id BIGINT,
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    description TEXT,
    remarks TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notif_project ON statutory_notifications(project_id);
CREATE INDEX IF NOT EXISTS idx_notif_type ON statutory_notifications(notification_type);

-- 6. Awards Table
CREATE TABLE IF NOT EXISTS awards (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    parcel_id BIGINT NOT NULL REFERENCES land_parcels(id) ON DELETE CASCADE,
    award_number VARCHAR(100) NOT NULL UNIQUE,
    award_date DATE NOT NULL,
    assessed_amount NUMERIC(16, 2) NOT NULL,
    market_value NUMERIC(16, 2),
    solatium NUMERIC(16, 2),
    additional_amount NUMERIC(16, 2),
    competent_authority VARCHAR(150) NOT NULL,
    document_id BIGINT,
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    remarks TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_award_project ON awards(project_id);
CREATE INDEX IF NOT EXISTS idx_award_parcel ON awards(parcel_id);

-- 7. Compensations Table
CREATE TABLE IF NOT EXISTS compensations (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    parcel_id BIGINT NOT NULL REFERENCES land_parcels(id) ON DELETE CASCADE,
    beneficiary_name VARCHAR(150) NOT NULL,
    beneficiary_type VARCHAR(50) DEFAULT 'TITLE_HOLDER',
    bank_account_number_masked VARCHAR(30),
    ifsc_code VARCHAR(20),
    assessed_amount NUMERIC(16, 2) NOT NULL,
    approved_amount NUMERIC(16, 2),
    paid_amount NUMERIC(16, 2) DEFAULT 0,
    payment_date DATE,
    payment_status VARCHAR(30) NOT NULL DEFAULT 'ASSESSED',
    transaction_reference VARCHAR(100),
    payment_mode VARCHAR(50),
    remarks TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_comp_project ON compensations(project_id);
CREATE INDEX IF NOT EXISTS idx_comp_parcel ON compensations(parcel_id);
CREATE INDEX IF NOT EXISTS idx_comp_status ON compensations(payment_status);

-- 8. Possessions Table
CREATE TABLE IF NOT EXISTS possessions (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    parcel_id BIGINT NOT NULL REFERENCES land_parcels(id) ON DELETE CASCADE,
    possession_date DATE,
    possession_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    possession_officer VARCHAR(150) NOT NULL,
    inspection_reference VARCHAR(150),
    panchnama_document_id BIGINT,
    remarks TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_possession_project ON possessions(project_id);
CREATE INDEX IF NOT EXISTS idx_possession_parcel ON possessions(parcel_id);

-- 9. Affected Families (R&R) Table
CREATE TABLE IF NOT EXISTS affected_families (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    family_head_name VARCHAR(150) NOT NULL,
    family_member_count INT NOT NULL DEFAULT 1,
    category VARCHAR(30) NOT NULL DEFAULT 'AFFECTED',
    social_category VARCHAR(50),
    village VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    entitlement_details TEXT,
    assistance_amount NUMERIC(14, 2),
    assistance_provided NUMERIC(14, 2) DEFAULT 0,
    alternative_site_allotted BOOLEAN DEFAULT FALSE,
    alternative_site_details VARCHAR(200),
    rehabilitation_status VARCHAR(30) NOT NULL DEFAULT 'IDENTIFIED',
    completion_date DATE,
    remarks TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_af_project ON affected_families(project_id);
CREATE INDEX IF NOT EXISTS idx_af_category ON affected_families(category);
CREATE INDEX IF NOT EXISTS idx_af_status ON affected_families(rehabilitation_status);

-- 10. Project Milestones (Timeline & Workflow) Table
CREATE TABLE IF NOT EXISTS project_milestones (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    milestone VARCHAR(50) NOT NULL,
    custom_name VARCHAR(150),
    sequence_order INT,
    planned_date DATE NOT NULL,
    actual_date DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'NOT_STARTED',
    delay_days BIGINT DEFAULT 0,
    remarks TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_milestone_project ON project_milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_milestone_status ON project_milestones(status);

-- 11. Document Metadata Table
CREATE TABLE IF NOT EXISTS document_metadata (
    id BIGSERIAL PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100),
    file_size BIGINT,
    storage_path VARCHAR(500) NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT NOT NULL,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    uploaded_by VARCHAR(100),
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);

CREATE INDEX IF NOT EXISTS idx_doc_entity ON document_metadata(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_doc_type ON document_metadata(document_type);

-- 12. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    entity_name VARCHAR(100) NOT NULL,
    entity_id BIGINT NOT NULL,
    action VARCHAR(50) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    performed_by VARCHAR(100),
    performed_role VARCHAR(50),
    performed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(100),
    remarks TEXT
);

CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity_name, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_performed_at ON audit_logs(performed_at);
