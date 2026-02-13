-- Add lecture engagement analytics table
CREATE TABLE IF NOT EXISTS lecture_engagement (
  id BIGSERIAL PRIMARY KEY,
  lesson_id UUID NOT NULL,
  course_id UUID NOT NULL,
  total_watches INTEGER DEFAULT 0,
  total_completes INTEGER DEFAULT 0,
  total_watch_time_secs BIGINT DEFAULT 0,
  avg_watch_time_secs DOUBLE PRECISION DEFAULT 0.0,
  date DATE NOT NULL,
  UNIQUE (lesson_id, date)
);

CREATE INDEX IF NOT EXISTS idx_lecture_engagement_lesson ON lecture_engagement(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lecture_engagement_course ON lecture_engagement(course_id);
CREATE INDEX IF NOT EXISTS idx_lecture_engagement_date ON lecture_engagement(date);
