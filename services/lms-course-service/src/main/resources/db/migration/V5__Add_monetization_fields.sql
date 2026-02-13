-- Add monetization fields to courses and lessons
ALTER TABLE lms_course.courses ADD COLUMN currency VARCHAR(3) DEFAULT 'USD';
ALTER TABLE lms_course.courses ADD COLUMN is_free BOOLEAN DEFAULT FALSE;
ALTER TABLE lms_course.lessons ADD COLUMN is_preview BOOLEAN DEFAULT FALSE;

-- Update existing data
UPDATE lms_course.courses SET currency = 'USD', is_free = FALSE;
UPDATE lms_course.lessons SET is_preview = FALSE;
