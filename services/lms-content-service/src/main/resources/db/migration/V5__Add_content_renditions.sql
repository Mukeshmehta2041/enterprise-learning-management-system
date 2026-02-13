-- Add renditions for content versions
SET search_path TO lms_content;

CREATE TABLE IF NOT EXISTS content_renditions (
  id UUID PRIMARY KEY,
  content_version_id UUID NOT NULL REFERENCES content_versions(id),
  quality VARCHAR(50) NOT NULL,
  storage_path VARCHAR(1024) NOT NULL,
  width INTEGER,
  height INTEGER,
  size_bytes BIGINT
);

CREATE INDEX IF NOT EXISTS idx_renditions_version_id ON content_renditions(content_version_id);
