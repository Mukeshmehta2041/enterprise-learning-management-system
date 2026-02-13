-- Add lesson availability and status fields
ALTER TABLE lms_course.lessons
  ADD COLUMN IF NOT EXISTS available_at TIMESTAMP;

ALTER TABLE lms_course.lessons
  ADD COLUMN IF NOT EXISTS status VARCHAR(50) NOT NULL DEFAULT 'PUBLISHED';

UPDATE lms_course.lessons
SET status = COALESCE(status, 'PUBLISHED');
