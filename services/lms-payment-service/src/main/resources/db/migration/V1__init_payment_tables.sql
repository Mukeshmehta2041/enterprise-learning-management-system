-- Payment Service Tables
CREATE TABLE IF NOT EXISTS payment_plans (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  duration_days INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  plan_id BIGINT NOT NULL REFERENCES payment_plans(id),
  amount NUMERIC(10, 2) NOT NULL,
  idempotency_key VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(50) NOT NULL,
  payment_intent_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_payment_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_idempotency_key ON payments(idempotency_key);

-- Sample Payment Plans
INSERT INTO payment_plans (code, name, description, price, duration_days, is_active)
VALUES 
  ('BASIC', 'Basic Plan', 'Access to basic courses', 9.99, 30, TRUE),
  ('PRO', 'Professional Plan', 'Access to all courses and premium content', 29.99, 30, TRUE),
  ('ENTERPRISE', 'Enterprise Plan', 'Full access with priority support', 99.99, 30, TRUE)
ON CONFLICT (code) DO NOTHING;
