SET search_path TO lms_content;

-- Make lesson_id nullable to allow course-level content (like thumbnails)
ALTER TABLE content_items ALTER COLUMN lesson_id DROP NOT NULL;

-- Update the check constraint or comments if necessary (already handled by schema being dynamic for enum)
COMMENT ON COLUMN content_items.type IS 'VIDEO, PDF, QUIZ, IMAGE';
