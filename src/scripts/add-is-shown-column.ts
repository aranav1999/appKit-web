import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from '../lib/db';
import { sql } from 'drizzle-orm';

// Load environment variables from .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..', '..');
config({ path: path.join(rootDir, '.env.local') });

async function addIsShownColumn() {
  console.log('🔄 Adding isShown column to apps table...');
  console.log('Database URL:', process.env.DATABASE_URL?.substring(0, 25) + '...');
  
  try {
    // Run the SQL directly
    await db.execute(sql`ALTER TABLE "apps" ADD COLUMN IF NOT EXISTS "is_shown" boolean DEFAULT false;`);
    
    console.log('✅ Successfully added isShown column!');
  } catch (error) {
    console.error('❌ Failed to add column:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

// Run the function
addIsShownColumn(); 