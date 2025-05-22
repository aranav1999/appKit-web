-- Add platform column to waitlist table
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS platform VARCHAR(20) DEFAULT 'ios'; 