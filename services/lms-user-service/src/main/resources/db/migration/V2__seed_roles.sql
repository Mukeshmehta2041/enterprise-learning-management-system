SET search_path TO lms_user;

INSERT INTO roles (name, description)
SELECT 'STUDENT', 'Can enroll in courses, view content, submit assignments'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'STUDENT');

INSERT INTO roles (name, description)
SELECT 'INSTRUCTOR', 'Can create and manage courses, grade submissions'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'INSTRUCTOR');

INSERT INTO roles (name, description)
SELECT 'ADMIN', 'Full system access'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'ADMIN');
