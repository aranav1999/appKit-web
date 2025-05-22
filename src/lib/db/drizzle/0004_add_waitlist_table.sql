-- Create waitlist table for SuperApp (if it doesn't exist)
CREATE TABLE IF NOT EXISTS "waitlist" (
  "id" SERIAL PRIMARY KEY,
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "signup_date" TIMESTAMP NOT NULL DEFAULT NOW(),
  "is_notified" BOOLEAN NOT NULL DEFAULT FALSE,
  "notification_date" TIMESTAMP,
  "source" VARCHAR(100),
  "notes" TEXT
); 