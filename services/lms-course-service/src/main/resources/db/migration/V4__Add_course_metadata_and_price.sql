-- Add category, level, and price columns to courses table
ALTER TABLE lms_course.courses 
ADD COLUMN category VARCHAR(100),
ADD COLUMN level VARCHAR(50),
ADD COLUMN price DECIMAL(10, 2) DEFAULT 0.00;

-- Create indexes for the new columns
CREATE INDEX idx_courses_category ON lms_course.courses(category);
CREATE INDEX idx_courses_level ON lms_course.courses(level);
