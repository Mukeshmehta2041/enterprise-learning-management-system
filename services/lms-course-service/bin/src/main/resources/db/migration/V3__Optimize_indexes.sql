-- Enable extension in public schema
CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;

-- Optimize course listing and status-based queries
CREATE INDEX IF NOT EXISTS idx_courses_published_list ON lms_course.courses(status, created_at DESC) WHERE status = 'PUBLISHED';

-- Optimize title searching using explicit search path
SET search_path TO lms_course, public;
CREATE INDEX IF NOT EXISTS idx_courses_title_trgm ON lms_course.courses USING gin (title public.gin_trgm_ops);
