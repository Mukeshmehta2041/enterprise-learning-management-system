-- Add course_id to payments for course-specific purchases
ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS course_id UUID;
