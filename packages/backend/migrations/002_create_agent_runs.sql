-- Migration 002: Create agent_runs table
-- SRS §10 Database Schema

CREATE TABLE agent_runs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  agent_name   VARCHAR(50) NOT NULL,   -- 'director' | 'mechanics' | 'asset' | 'audio' | 'debugger'
  status       VARCHAR(50) NOT NULL DEFAULT 'pending',  -- 'pending' | 'running' | 'completed' | 'failed'
  output       JSONB,
  started_at   TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_agent_runs_project_id ON agent_runs(project_id);
CREATE INDEX idx_agent_runs_status     ON agent_runs(status);
