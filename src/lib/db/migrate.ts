import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables from .env file
dotenv.config();

const runMigrations = async () => {
  console.log('Environment check:');
  console.log(`Current working directory: ${process.cwd()}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  
  // Check if .env.local exists
  const envPath = path.join(process.cwd(), '.env.local');
  console.log(`.env.local exists: ${fs.existsSync(envPath)}`);
  
  // Check if DATABASE_URL is defined
  console.log(`DATABASE_URL defined: ${!!process.env.DATABASE_URL}`);
  
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
  }

  console.log('🔄 Running migrations...');
  
  // Create a database connection
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });
  
  // Initialize Drizzle ORM
  const db = drizzle(pool);
  
  // Run migrations
  try {
    await migrate(db, { migrationsFolder: './src/lib/db/drizzle' });
    console.log('✅ Migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    // Close the pool
    await pool.end();
  }
};

// Run the migration function
runMigrations(); 