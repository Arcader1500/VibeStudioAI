-- Migration 001: Create projects table
-- SRS §10 Database Schema

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE projects (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt      TEXT NOT NULL,
  blueprint   JSONB,
  status      VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Index for status-based queries (e.g. "show all pending projects")
CREATE INDEX idx_projects_status ON projects(status);

-- Auto-update updated_at on row modification
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
