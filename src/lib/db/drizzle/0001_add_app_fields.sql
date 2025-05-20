-- Migration to add additional fields to the apps table
ALTER TABLE "apps" ADD COLUMN "website_url" text;
ALTER TABLE "apps" ADD COLUMN "android_url" text;
ALTER TABLE "apps" ADD COLUMN "ios_url" text;
ALTER TABLE "apps" ADD COLUMN "solana_mobile_url" text;
ALTER TABLE "apps" ADD COLUMN "project_twitter" text;
ALTER TABLE "apps" ADD COLUMN "submitter_twitter" text;
ALTER TABLE "apps" ADD COLUMN "contract_address" text;
ALTER TABLE "apps" ADD COLUMN "feature_banner_url" text;
ALTER TABLE "apps" ADD COLUMN "tags" text[]; 