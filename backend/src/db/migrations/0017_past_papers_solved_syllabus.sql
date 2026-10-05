ALTER TABLE "past_papers" ADD COLUMN IF NOT EXISTS "is_solved" boolean DEFAULT false NOT NULL;
ALTER TABLE "past_papers" ADD COLUMN IF NOT EXISTS "syllabus" text DEFAULT 'new' NOT NULL;