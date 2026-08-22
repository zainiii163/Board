-- Bilingual content columns for chapters and questions

ALTER TABLE chapters ADD COLUMN IF NOT EXISTS summary_ur text;
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS formulas_ur jsonb NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE questions ADD COLUMN IF NOT EXISTS question_text_ur text;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS steps_ur jsonb NOT NULL DEFAULT '[]'::jsonb;
