-- Analytics Service Tables
CREATE TABLE IF NOT EXISTS event_snapshots (
  id BIGSERIAL PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  payload TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_event_type ON event_snapshots(event_type);
CREATE INDEX IF NOT EXISTS idx_event_date ON event_snapshots(date);

CREATE TABLE IF NOT EXISTS enrollment_aggregates (
  id BIGSERIAL PRIMARY KEY,
  course_id BIGINT NOT NULL,
  total_enrollments INTEGER DEFAULT 0,
  active_enrollments INTEGER DEFAULT 0,
  completed_enrollments INTEGER DEFAULT 0,
  date DATE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_enrollment_course_id ON enrollment_aggregates(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollment_date ON enrollment_aggregates(date);
