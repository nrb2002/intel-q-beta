-- Intel-Q Queue Management System
-- PostgreSQL Database Schema
-- Version: 1.0
-- Last Updated: July 2026

-- =========================================================
-- 1. USERS TABLE
-- =========================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    first_name VARCHAR(100) NOT NULL,

    last_name VARCHAR(100) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,

    password VARCHAR(255) NOT NULL,

    role VARCHAR(20) NOT NULL DEFAULT 'customer',

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT users_role_check
        CHECK (role IN ('customer', 'staff', 'admin'))
);


-- =========================================================
-- 2. BRANCHES TABLE
-- =========================================================

CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(150) NOT NULL,

    address VARCHAR(255) NOT NULL,

    city VARCHAR(100) NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- 3. QUEUE TICKETS TABLE
-- =========================================================

CREATE TABLE queue_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    ticket_number INTEGER NOT NULL,

    customer_id UUID NOT NULL,

    branch_id UUID NOT NULL,

    service_type VARCHAR(150) NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'Waiting',

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    called_at TIMESTAMPTZ,

    completed_at TIMESTAMPTZ,

    CONSTRAINT queue_tickets_status_check
        CHECK (
            status IN (
                'Waiting',
                'In Service',
                'Completed',
                'Cancelled'
            )
        ),

    CONSTRAINT queue_tickets_customer_fk
        FOREIGN KEY (customer_id)
        REFERENCES users(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT queue_tickets_branch_fk
        FOREIGN KEY (branch_id)
        REFERENCES branches(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);


-- =========================================================
-- 4. INDEXES
-- =========================================================

-- Users
CREATE UNIQUE INDEX users_email_unique_idx
    ON users(email);


-- Queue Tickets
CREATE INDEX queue_tickets_ticket_number_idx
    ON queue_tickets(ticket_number);

CREATE INDEX queue_tickets_customer_id_idx
    ON queue_tickets(customer_id);

CREATE INDEX queue_tickets_branch_id_idx
    ON queue_tickets(branch_id);

CREATE INDEX queue_tickets_status_idx
    ON queue_tickets(status);


-- Branches
CREATE INDEX branches_name_idx
    ON branches(name);


-- =========================================================
-- 5. UPDATED_AT TRIGGER
-- =========================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


CREATE TRIGGER update_branches_updated_at
BEFORE UPDATE ON branches
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- =========================================================
-- 6. SAMPLE BRANCH DATA
-- Optional development/test data
-- =========================================================

INSERT INTO branches (
    name,
    address,
    city
)
VALUES (
    'Intel-Q Main Branch',
    '123 Boulevard du 30 Juin',
    'Kinshasa-Gombe'
);


-- =========================================================
-- 7. SAMPLE USER DATA
-- IMPORTANT:
-- Passwords must be hashed by the application.
-- Do not insert plain-text passwords.
-- =========================================================

-- Example only:
-- INSERT INTO users (
--     first_name,
--     last_name,
--     email,
--     password,
--     role
-- )
-- VALUES (
--     'John',
--     'Doe',
--     'john@example.com',
--     '<HASHED_PASSWORD>',
--     'customer'
-- );


-- =========================================================
-- 8. SAMPLE QUEUE TICKET DATA
-- =========================================================

-- Example only:
-- INSERT INTO queue_tickets (
--     ticket_number,
--     customer_id,
--     branch_id,
--     service_type,
--     status
-- )
-- VALUES (
--     1,
--     '<CUSTOMER_UUID>',
--     '<BRANCH_UUID>',
--     'General Enquiry',
--     'Waiting'
-- );