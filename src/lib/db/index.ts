import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Initialize the database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Create the Drizzle ORM instance with our schema
export const db = drizzle(pool, { schema });

// Export schema for use throughout the app
export { schema }; 