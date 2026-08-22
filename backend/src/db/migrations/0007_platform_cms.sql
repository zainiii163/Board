-- Platform CMS tables: authors, comments, exams, legal pages, MCQs

CREATE TABLE IF NOT EXISTS authors (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT NOT NULL,
  boards JSONB NOT NULL DEFAULT '[]'::jsonb,
  note_count INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS question_comments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  page_path TEXT NOT NULL,
  question_ref TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exam_dates (
  id SERIAL PRIMARY KEY,
  board_slug TEXT NOT NULL,
  board_title TEXT NOT NULL,
  class_slug TEXT NOT NULL,
  class_title TEXT NOT NULL,
  title TEXT NOT NULL,
  exam_date TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS legal_pages (
  slug TEXT PRIMARY KEY,
  content JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS mcqs (
  id SERIAL PRIMARY KEY,
  chapter_key TEXT NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  correct_label TEXT NOT NULL,
  reason TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS question_comments_page_path_idx ON question_comments(page_path);
CREATE INDEX IF NOT EXISTS question_comments_status_idx ON question_comments(status);
CREATE INDEX IF NOT EXISTS mcqs_chapter_key_idx ON mcqs(chapter_key);
