-- Add captions for content items
SET search_path TO lms_content;

CREATE TABLE IF NOT EXISTS content_captions (
  id UUID PRIMARY KEY,
  content_item_id UUID NOT NULL REFERENCES content_items(id),
  language_code VARCHAR(10) NOT NULL,
  label VARCHAR(100) NOT NULL,
  storage_path VARCHAR(1024) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_captions_item_id ON content_captions(content_item_id);
