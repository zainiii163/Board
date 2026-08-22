-- Per-user flashcard mastery by chapter

CREATE TABLE IF NOT EXISTS flashcard_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  chapter_key TEXT NOT NULL,
  mastered_indices JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, chapter_key)
);

CREATE INDEX IF NOT EXISTS flashcard_progress_user_id_idx ON flashcard_progress(user_id);
