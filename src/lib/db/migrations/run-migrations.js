#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL is not defined in environment variables');
  process.exit(1);
}

// Get the migration file
const migrationFile = path.join(__dirname, 'add-platform-to-waitlist.sql');

if (!fs.existsSync(migrationFile)) {
  console.error(`Migration file ${migrationFile} does not exist`);
  process.exit(1);
}

const migrationSQL = fs.readFileSync(migrationFile, 'utf8');

// Execute the migration
try {
  console.log('Running migration...');
  execSync(`psql "${DATABASE_URL}" -c "${migrationSQL}"`, { stdio: 'inherit' });
  console.log('Migration completed successfully');
} catch (error) {
  console.error('Error running migration:', error);
  process.exit(1);
} 