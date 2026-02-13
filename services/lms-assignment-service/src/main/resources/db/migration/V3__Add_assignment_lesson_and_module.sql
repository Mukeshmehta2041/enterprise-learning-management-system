-- Add module and lesson references to assignments
ALTER TABLE lms_assignment.assignments
  ADD COLUMN IF NOT EXISTS module_id UUID,
  ADD COLUMN IF NOT EXISTS lesson_id UUID;
