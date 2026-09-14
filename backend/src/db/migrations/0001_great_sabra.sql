CREATE TABLE "audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"action" text NOT NULL,
	"target" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "authors" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"title" text NOT NULL,
	"bio" text NOT NULL,
	"boards" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"note_count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "authors_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "bookmarks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" text NOT NULL,
	"path" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "books" (
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
--> statement-breakpoint
CREATE TABLE "classroom_assignments" (
	"id" serial PRIMARY KEY NOT NULL,
	"classroom_id" integer NOT NULL,
	"title" text NOT NULL,
	"exercise_path" text NOT NULL,
	"due_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "classroom_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"classroom_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "classrooms" (
	"id" serial PRIMARY KEY NOT NULL,
	"teacher_user_id" integer NOT NULL,
	"name" text NOT NULL,
	"join_code" text NOT NULL,
	"board_slug" text NOT NULL,
	"class_slug" text NOT NULL,
	"subject_slug" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "classrooms_join_code_unique" UNIQUE("join_code")
);
--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exam_dates" (
	"id" serial PRIMARY KEY NOT NULL,
	"board_slug" text NOT NULL,
	"board_title" text NOT NULL,
	"class_slug" text NOT NULL,
	"class_title" text NOT NULL,
	"title" text NOT NULL,
	"exam_date" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "flashcard_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"chapter_key" text NOT NULL,
	"mastered_indices" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "legal_pages" (
	"slug" text PRIMARY KEY NOT NULL,
	"content" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mcqs" (
	"id" serial PRIMARY KEY NOT NULL,
	"chapter_key" text NOT NULL,
	"question" text NOT NULL,
	"options" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"correct_label" text NOT NULL,
	"reason" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "past_papers" (
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
--> statement-breakpoint
CREATE TABLE "question_comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"user_name" text NOT NULL,
	"page_path" text NOT NULL,
	"question_ref" text DEFAULT '' NOT NULL,
	"body" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quiz_scores" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"chapter_key" text NOT NULL,
	"score" integer NOT NULL,
	"total" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"page_url" text NOT NULL,
	"board_slug" text,
	"question_ref" text,
	"message" text NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"subject_key" text NOT NULL,
	"subject_label" text NOT NULL,
	"visited_chapters" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"total_chapters" integer DEFAULT 0 NOT NULL,
	"last_path" text DEFAULT '' NOT NULL,
	"last_label" text DEFAULT '' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" text DEFAULT 'student' NOT NULL,
	"email_updates" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "summary_ur" text;--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "formulas_ur" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "definitions" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "video_url" text;--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "status" text DEFAULT 'published' NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "question_text_ur" text;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "steps_ur" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classroom_assignments" ADD CONSTRAINT "classroom_assignments_classroom_id_classrooms_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classrooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classroom_members" ADD CONSTRAINT "classroom_members_classroom_id_classrooms_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classrooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classroom_members" ADD CONSTRAINT "classroom_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classrooms" ADD CONSTRAINT "classrooms_teacher_user_id_users_id_fk" FOREIGN KEY ("teacher_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flashcard_progress" ADD CONSTRAINT "flashcard_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_comments" ADD CONSTRAINT "question_comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_scores" ADD CONSTRAINT "quiz_scores_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;