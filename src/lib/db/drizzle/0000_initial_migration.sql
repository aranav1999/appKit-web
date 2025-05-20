-- Initial migration file
CREATE TABLE IF NOT EXISTS "apps" (
  "id" serial PRIMARY KEY,
  "name" varchar(100) NOT NULL,
  "description" text,
  "icon_url" text,
  "category" varchar(50),
  "price" varchar(20),
  "developer" varchar(100),
  "rating" numeric(3, 1),
  "downloads" varchar(20),
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "screenshots" (
  "id" serial PRIMARY KEY,
  "app_id" integer NOT NULL,
  "image_url" text NOT NULL,
  "sort_order" integer DEFAULT 0,
  "created_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT fk_app FOREIGN KEY("app_id") REFERENCES "apps"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "categories" (
  "id" serial PRIMARY KEY,
  "name" varchar(50) NOT NULL UNIQUE,
  "description" text,
  "icon_url" text,
  "is_active" boolean DEFAULT true,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create indexes
CREATE INDEX idx_app_category ON "apps"("category");
CREATE INDEX idx_screenshot_app_id ON "screenshots"("app_id");
CREATE INDEX idx_category_is_active ON "categories"("is_active"); 