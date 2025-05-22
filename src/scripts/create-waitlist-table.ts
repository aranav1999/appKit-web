import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config({ path: '.env.local' });

async function createWaitlistTable() {
  console.log('Creating waitlist table...');
  
  // Check for DATABASE_URL
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
  }

  // Create a database connection
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });
  
  try {
    // Read the SQL file
    const sqlPath = path.join(process.cwd(), 'src/lib/db/drizzle/0004_add_waitlist_table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute the SQL
    await pool.query(sql);
    
    console.log('✅ Waitlist table created successfully');
  } catch (error) {
    console.error('❌ Failed to create waitlist table:', error);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the function
createWaitlistTable(); 