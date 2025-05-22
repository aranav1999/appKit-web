import { db } from './index';
import { sql } from 'drizzle-orm';

/**
 * Ensures that all required columns exist in the database.
 * This is run at app startup to handle cases where migrations haven't been applied.
 */
export async function ensureSchema() {
  try {
    console.log('🔎 Checking database schema...');
    
    // Check if is_shown column exists in apps table
    await ensureColumnExists('apps', 'is_shown', 'boolean', 'false');
    
    console.log('✅ Schema check complete');
  } catch (error) {
    console.error('❌ Error checking schema:', error);
    // Don't crash the app if schema check fails
  }
}

/**
 * Check if a column exists and add it if it doesn't
 */
async function ensureColumnExists(
  table: string, 
  column: string, 
  type: string, 
  defaultValue: string | null = null
) {
  try {
    // Check if column exists
    const checkQuery = sql`
      SELECT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = ${table} 
        AND column_name = ${column}
      ) as exists
    `;
    
    const result = await db.execute(checkQuery);
    const columnExists = result.rows?.[0]?.exists === true;
    
    if (!columnExists) {
      console.log(`🔧 Adding missing column ${column} to ${table} table...`);
      
      // Construct the ALTER TABLE query
      let alterQuery = sql`ALTER TABLE "${table}" ADD COLUMN "${column}" ${sql.raw(type)}`;
      
      if (defaultValue !== null) {
        alterQuery = sql`${alterQuery} DEFAULT ${sql.raw(defaultValue)}`;
      }
      
      await db.execute(alterQuery);
      console.log(`✅ Added ${column} column to ${table} table`);
    } else {
      console.log(`✓ Column ${column} already exists in ${table} table`);
    }
  } catch (error) {
    console.error(`❌ Error ensuring column ${column} in ${table}:`, error);
    throw error;
  }
} 