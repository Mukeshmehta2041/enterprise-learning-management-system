-- Optimize active enrollment queries
CREATE INDEX idx_enrollments_user_active ON lms_enrollment.enrollments(user_id, status) WHERE status = 'ENROLLED';

-- Optimize lesson progress lookups
CREATE INDEX idx_lp_enrollment_lesson ON lms_enrollment.lesson_progress(enrollment_id, lesson_id);
