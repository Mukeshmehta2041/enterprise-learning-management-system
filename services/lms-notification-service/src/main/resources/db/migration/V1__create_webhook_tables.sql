CREATE SCHEMA IF NOT EXISTS lms_notification;

CREATE TABLE lms_notification.webhook_subscriptions (
    id BIGSERIAL PRIMARY KEY,
    event_type VARCHAR(255) NOT NULL,
    target_url TEXT NOT NULL,
    secret VARCHAR(255) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_by VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lms_notification.webhook_history (
    id UUID PRIMARY KEY,
    subscription_id BIGINT REFERENCES lms_notification.webhook_subscriptions(id),
    event_id VARCHAR(255),
    event_type VARCHAR(255),
    payload TEXT,
    response_code INTEGER,
    response_body TEXT,
    sent_at TIMESTAMP WITH TIME ZONE,
    duration_ms BIGINT,
    success BOOLEAN NOT NULL
);

CREATE INDEX idx_webhook_history_subscription ON lms_notification.webhook_history(subscription_id);
CREATE INDEX idx_webhook_history_event ON lms_notification.webhook_history(event_id);
