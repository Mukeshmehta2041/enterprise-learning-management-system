CREATE TABLE IF NOT EXISTS notification_preferences (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    course_id UUID, -- NULL means global preference
    event_type VARCHAR(100) NOT NULL,
    channel VARCHAR(50) NOT NULL, -- EMAIL, IN_APP, PUSH
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id, event_type, channel)
);

CREATE INDEX idx_notif_pref_user_id ON notification_preferences(user_id);
