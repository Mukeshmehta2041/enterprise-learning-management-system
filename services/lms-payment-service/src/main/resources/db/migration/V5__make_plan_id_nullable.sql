-- Make plan_id nullable because payments can be for courses or plans
ALTER TABLE payments ALTER COLUMN plan_id DROP NOT NULL;
