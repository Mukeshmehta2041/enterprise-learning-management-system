ALTER TABLE lms_content.content_items ADD COLUMN version BIGINT DEFAULT 0;
ALTER TABLE lms_content.content_metadata ADD COLUMN version BIGINT DEFAULT 0;
