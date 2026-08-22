-- Chapter publish status for CMS workflow
ALTER TABLE "chapters" ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'published' NOT NULL;
