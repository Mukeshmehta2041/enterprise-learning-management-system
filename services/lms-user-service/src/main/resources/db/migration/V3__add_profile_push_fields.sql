SET search_path TO lms_user;

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS push_token VARCHAR(500),
  ADD COLUMN IF NOT EXISTS push_platform VARCHAR(50);
