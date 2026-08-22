ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "email_updates" boolean NOT NULL DEFAULT false;
