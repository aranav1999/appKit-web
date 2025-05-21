CREATE TABLE IF NOT EXISTS "click_counter" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" varchar(50) NOT NULL,
  "count" integer DEFAULT 0 NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "click_counter_name_unique" UNIQUE("name")
); 