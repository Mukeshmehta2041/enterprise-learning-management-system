SET search_path TO lms_content;

CREATE TABLE content_items (
    id UUID PRIMARY KEY,
    course_id UUID NOT NULL,
    lesson_id UUID NOT NULL,
    type VARCHAR(50) NOT NULL, -- VIDEO, PDF, QUIZ
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE content_versions (
    id UUID PRIMARY KEY,
    content_item_id UUID NOT NULL REFERENCES content_items(id),
    version INTEGER NOT NULL,
    storage_path VARCHAR(1024), -- S3 key or URL
    checksum VARCHAR(255),
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quiz_questions (
    id UUID PRIMARY KEY,
    content_item_id UUID NOT NULL REFERENCES content_items(id),
    question_text TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_option_id VARCHAR(50) NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE content_metadata (
    content_item_id UUID PRIMARY KEY NOT NULL REFERENCES content_items(id),
    duration_secs INTEGER,
    size_bytes BIGINT,
    mime_type VARCHAR(100)
);

CREATE INDEX idx_content_course_id ON content_items(course_id);
CREATE INDEX idx_content_lesson_id ON content_items(lesson_id);
CREATE INDEX idx_content_type ON content_items(type);
CREATE INDEX idx_versions_item_id ON content_versions(content_item_id);
CREATE INDEX idx_quiz_item_id ON quiz_questions(content_item_id);
