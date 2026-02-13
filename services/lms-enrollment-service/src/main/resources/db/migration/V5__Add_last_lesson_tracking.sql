-- Add last lesson tracking to enrollments
ALTER TABLE lms_enrollment.enrollments
  ADD COLUMN IF NOT EXISTS last_lesson_id UUID;
