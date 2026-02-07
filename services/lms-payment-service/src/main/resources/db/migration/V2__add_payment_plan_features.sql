-- Add payment_plan_features table for @ElementCollection in PaymentPlan entity
CREATE TABLE IF NOT EXISTS payment_plan_features (
  plan_id BIGINT NOT NULL REFERENCES payment_plans(id) ON DELETE CASCADE,
  feature VARCHAR(255) NOT NULL,
  PRIMARY KEY (plan_id, feature)
);

-- Seed some features for existing plans
INSERT INTO payment_plan_features (plan_id, feature)
SELECT id, 'Basic Course Access' FROM payment_plans WHERE code = 'BASIC'
UNION ALL
SELECT id, 'Limited Support' FROM payment_plans WHERE code = 'BASIC'
UNION ALL
SELECT id, 'Full Course Access' FROM payment_plans WHERE code = 'PRO'
UNION ALL
SELECT id, 'Priority Support' FROM payment_plans WHERE code = 'PRO'
UNION ALL
SELECT id, 'Full Course Access' FROM payment_plans WHERE code = 'ENTERPRISE'
UNION ALL
SELECT id, 'Dedicated Account Manager' FROM payment_plans WHERE code = 'ENTERPRISE'
ON CONFLICT DO NOTHING;
