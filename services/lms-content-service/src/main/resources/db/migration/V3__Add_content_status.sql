SET search_path TO lms_content;

ALTER TABLE content_items ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'DRAFT';
CREATE INDEX idx_content_status ON content_items(status);
