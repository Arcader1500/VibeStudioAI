-- Migration 003: Create runtime_errors table
-- SRS §10 Database Schema

CREATE TABLE runtime_errors (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  stacktrace  TEXT NOT NULL,
  file_path   TEXT NOT NULL,
  error_type  VARCHAR(50) NOT NULL DEFAULT 'console_error',
  -- 'console_error' | 'uncaught_exception' | 'network_failure' | 'webgl_error' | 'build_failure'
  created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_runtime_errors_project_id ON runtime_errors(project_id);
