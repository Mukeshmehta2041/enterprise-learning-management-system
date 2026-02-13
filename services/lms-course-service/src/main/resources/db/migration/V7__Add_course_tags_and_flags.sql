-- Add course thumbnail and feature flags
ALTER TABLE lms_course.courses
  ADD COLUMN IF NOT EXISTS thumbnail_url VARCHAR(512);

ALTER TABLE lms_course.courses
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE lms_course.courses
  ADD COLUMN IF NOT EXISTS is_trending BOOLEAN NOT NULL DEFAULT FALSE;

UPDATE lms_course.courses
SET is_featured = COALESCE(is_featured, FALSE),
    is_trending = COALESCE(is_trending, FALSE);

-- Add course tags table
CREATE TABLE IF NOT EXISTS lms_course.course_tags (
  course_id UUID NOT NULL,
  tag VARCHAR(100) NOT NULL,
  PRIMARY KEY (course_id, tag),
  CONSTRAINT fk_course_tags_course
    FOREIGN KEY (course_id)
    REFERENCES lms_course.courses(id)
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_course_tags_tag ON lms_course.course_tags(tag);
