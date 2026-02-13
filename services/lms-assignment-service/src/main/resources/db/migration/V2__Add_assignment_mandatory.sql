-- Add mandatory flag to assignments
ALTER TABLE lms_assignment.assignments ADD COLUMN is_mandatory BOOLEAN NOT NULL DEFAULT TRUE;

UPDATE lms_assignment.assignments
SET is_mandatory = TRUE;
