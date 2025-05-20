CREATE TABLE "apps" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"icon_url" text,
	"category" varchar(50),
	"price" varchar(20),
	"developer" varchar(100),
	"rating" numeric(3, 1),
	"downloads" varchar(20),
	"website_url" text,
	"android_url" text,
	"ios_url" text,
	"solana_mobile_url" text,
	"project_twitter" text,
	"submitter_twitter" text,
	"contract_address" text,
	"feature_banner_url" text,
	"tags" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" text,
	"icon_url" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "screenshots" (
	"id" serial PRIMARY KEY NOT NULL,
	"app_id" integer NOT NULL,
	"image_url" text NOT NULL,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "screenshots" ADD CONSTRAINT "screenshots_app_id_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("id") ON DELETE no action ON UPDATE no action;