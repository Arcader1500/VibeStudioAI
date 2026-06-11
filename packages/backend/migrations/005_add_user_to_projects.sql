-- Migration 005: Add user_id to projects

ALTER TABLE projects
  ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX idx_projects_user_id ON projects(user_id);
