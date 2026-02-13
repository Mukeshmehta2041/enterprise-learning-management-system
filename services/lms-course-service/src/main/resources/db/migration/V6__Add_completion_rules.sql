-- Add completion rule fields to courses
ALTER TABLE lms_course.courses ADD COLUMN completion_threshold DECIMAL(5, 2) NOT NULL DEFAULT 100.00;
ALTER TABLE lms_course.courses ADD COLUMN require_all_assignments BOOLEAN NOT NULL DEFAULT FALSE;

UPDATE lms_course.courses
SET completion_threshold = 100.00,
    require_all_assignments = FALSE;
