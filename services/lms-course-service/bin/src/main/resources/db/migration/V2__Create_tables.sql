-- Create courses table
CREATE TABLE lms_course.courses (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for courses
CREATE INDEX idx_courses_status ON lms_course.courses(status);
CREATE INDEX idx_courses_slug ON lms_course.courses(slug);
CREATE INDEX idx_courses_created_at ON lms_course.courses(created_at DESC);

-- Create modules table
CREATE TABLE lms_course.modules (
    id UUID PRIMARY KEY,
    course_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_module_course FOREIGN KEY (course_id) REFERENCES lms_course.courses(id) ON DELETE CASCADE
);

-- Create index for modules
CREATE INDEX idx_modules_course_id ON lms_course.modules(course_id);
CREATE INDEX idx_modules_sort_order ON lms_course.modules(course_id, sort_order);

-- Create lessons table
CREATE TABLE lms_course.lessons (
    id UUID PRIMARY KEY,
    module_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    duration_minutes INTEGER,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_lesson_module FOREIGN KEY (module_id) REFERENCES lms_course.modules(id) ON DELETE CASCADE
);

-- Create index for lessons
CREATE INDEX idx_lessons_module_id ON lms_course.lessons(module_id);
CREATE INDEX idx_lessons_sort_order ON lms_course.lessons(module_id, sort_order);

-- Create course_instructors table (many-to-many)
CREATE TABLE lms_course.course_instructors (
    course_id UUID NOT NULL,
    user_id UUID NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'INSTRUCTOR',
    assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (course_id, user_id),
    CONSTRAINT fk_ci_course FOREIGN KEY (course_id) REFERENCES lms_course.courses(id) ON DELETE CASCADE
);

-- Create index for course_instructors
CREATE INDEX idx_course_instructors_user_id ON lms_course.course_instructors(user_id);
