-- Books and past papers resource tables
CREATE TABLE IF NOT EXISTS "books" (
  "id" serial PRIMARY KEY NOT NULL,
  "board_slug" text NOT NULL,
  "board_title" text NOT NULL,
  "class_slug" text NOT NULL,
  "class_title" text NOT NULL,
  "subject_slug" text,
  "subject_title" text,
  "title" text NOT NULL,
  "price_label" text DEFAULT 'Free PDF' NOT NULL,
  "pdf_url" text,
  "notes_path" text
);

CREATE TABLE IF NOT EXISTS "past_papers" (
  "id" serial PRIMARY KEY NOT NULL,
  "board_slug" text NOT NULL,
  "board_title" text NOT NULL,
  "class_slug" text NOT NULL,
  "class_title" text NOT NULL,
  "subject_slug" text NOT NULL,
  "subject_title" text NOT NULL,
  "year" text NOT NULL,
  "session_type" text DEFAULT 'annual' NOT NULL,
  "pdf_url" text
);
