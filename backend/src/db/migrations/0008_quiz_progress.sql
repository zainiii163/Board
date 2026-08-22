-- Quiz scores and per-user subject progress

CREATE TABLE IF NOT EXISTS quiz_scores (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  chapter_key TEXT NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_key TEXT NOT NULL,
  subject_label TEXT NOT NULL,
  visited_chapters JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_chapters INTEGER NOT NULL DEFAULT 0,
  last_path TEXT NOT NULL DEFAULT '',
  last_label TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, subject_key)
);

CREATE INDEX IF NOT EXISTS quiz_scores_user_id_idx ON quiz_scores(user_id);
CREATE INDEX IF NOT EXISTS quiz_scores_chapter_key_idx ON quiz_scores(chapter_key);
CREATE INDEX IF NOT EXISTS user_progress_user_id_idx ON user_progress(user_id);
