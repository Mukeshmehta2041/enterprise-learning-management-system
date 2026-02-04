-- Create enrollments table
CREATE TABLE lms_enrollment.enrollments (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    course_id UUID NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ENROLLED',
    progress_pct DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    enrolled_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    CONSTRAINT uk_user_course UNIQUE (user_id, course_id)
);

-- Create indexes for enrollments
CREATE INDEX idx_enrollments_user_id ON lms_enrollment.enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON lms_enrollment.enrollments(course_id);
CREATE INDEX idx_enrollments_status ON lms_enrollment.enrollments(status);

-- Create lesson_progress table
CREATE TABLE lms_enrollment.lesson_progress (
    id UUID PRIMARY KEY,
    enrollment_id UUID NOT NULL,
    lesson_id UUID NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMP,
    last_accessed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_lp_enrollment FOREIGN KEY (enrollment_id) REFERENCES lms_enrollment.enrollments(id) ON DELETE CASCADE,
    CONSTRAINT uk_enrollment_lesson UNIQUE (enrollment_id, lesson_id)
);

-- Create index for lesson_progress
CREATE INDEX idx_lp_enrollment_id ON lms_enrollment.lesson_progress(enrollment_id);
