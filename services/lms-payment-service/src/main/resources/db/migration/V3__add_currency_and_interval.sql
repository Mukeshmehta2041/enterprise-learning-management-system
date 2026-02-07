-- Add missing columns to payment_plans
ALTER TABLE payment_plans ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'USD' NOT NULL;
ALTER TABLE payment_plans ADD COLUMN IF NOT EXISTS plan_interval VARCHAR(20) DEFAULT 'MONTHLY' NOT NULL;
