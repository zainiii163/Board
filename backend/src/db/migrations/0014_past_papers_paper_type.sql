ALTER TABLE "past_papers" ADD COLUMN IF NOT EXISTS "paper_type" text DEFAULT 'first-annual' NOT NULL;
ALTER TABLE "past_papers" ADD COLUMN IF NOT EXISTS "drive_url" text;
