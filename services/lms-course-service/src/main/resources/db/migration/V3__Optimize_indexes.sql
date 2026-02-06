-- Optimize course listing and status-based queries
CREATE INDEX idx_courses_published_list ON lms_course.courses(status, created_at DESC) WHERE status = 'PUBLISHED';

-- Optimize title searching
CREATE INDEX idx_courses_title_trgm ON lms_course.courses USING gin (title gin_trgm_ops);
