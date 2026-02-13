CREATE TABLE export_jobs (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    report_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    download_url VARCHAR(500),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_export_jobs_user_id ON export_jobs(user_id);
