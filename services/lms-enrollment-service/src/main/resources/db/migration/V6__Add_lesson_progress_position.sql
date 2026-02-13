-- Add last playback position tracking to lesson_progress
ALTER TABLE lms_enrollment.lesson_progress
  ADD COLUMN IF NOT EXISTS last_position_secs DOUBLE PRECISION;

UPDATE lms_enrollment.lesson_progress
SET last_position_secs = COALESCE(last_position_secs, 0.0);
