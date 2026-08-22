-- Teacher classrooms (Phase 3)
CREATE TABLE IF NOT EXISTS "classrooms" (
  "id" serial PRIMARY KEY NOT NULL,
  "teacher_user_id" integer NOT NULL REFERENCES "users"("id"),
  "name" text NOT NULL,
  "join_code" text NOT NULL UNIQUE,
  "board_slug" text NOT NULL,
  "class_slug" text NOT NULL,
  "subject_slug" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "classroom_members" (
  "id" serial PRIMARY KEY NOT NULL,
  "classroom_id" integer NOT NULL REFERENCES "classrooms"("id") ON DELETE CASCADE,
  "user_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "joined_at" timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE("classroom_id", "user_id")
);

CREATE TABLE IF NOT EXISTS "classroom_assignments" (
  "id" serial PRIMARY KEY NOT NULL,
  "classroom_id" integer NOT NULL REFERENCES "classrooms"("id") ON DELETE CASCADE,
  "title" text NOT NULL,
  "exercise_path" text NOT NULL,
  "due_date" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "classrooms_teacher_idx" ON "classrooms"("teacher_user_id");
CREATE INDEX IF NOT EXISTS "classrooms_join_code_idx" ON "classrooms"("join_code");
CREATE INDEX IF NOT EXISTS "classroom_members_user_idx" ON "classroom_members"("user_id");
