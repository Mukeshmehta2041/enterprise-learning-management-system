-- Track assignment completions for enrollments
CREATE TABLE lms_enrollment.assignment_completions (
    id UUID PRIMARY KEY,
    enrollment_id UUID NOT NULL,
    assignment_id UUID NOT NULL,
    lesson_id UUID,
    completed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ac_enrollment FOREIGN KEY (enrollment_id) REFERENCES lms_enrollment.enrollments(id) ON DELETE CASCADE,
    CONSTRAINT uk_ac_enrollment_assignment UNIQUE (enrollment_id, assignment_id)
);

CREATE INDEX idx_ac_enrollment_id ON lms_enrollment.assignment_completions(enrollment_id);
CREATE INDEX idx_ac_assignment_id ON lms_enrollment.assignment_completions(assignment_id);
