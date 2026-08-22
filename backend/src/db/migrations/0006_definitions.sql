-- Chapter glossary / flashcard definitions

ALTER TABLE chapters ADD COLUMN IF NOT EXISTS definitions jsonb NOT NULL DEFAULT '[]'::jsonb;
