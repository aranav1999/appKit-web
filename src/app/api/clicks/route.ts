import { NextResponse } from 'next/server';
import { db, schema } from '@/lib/db';
import { eq, sql } from 'drizzle-orm';

const COUNTER_NAME = 'coming-soon-clicks';

/**
 * Get the current click count from the database
 */
async function getClickCount(): Promise<number> {
  try {
    // Try to find the existing counter
    const counter = await db.select({
      count: schema.clickCounter.count
    })
    .from(schema.clickCounter)
    .where(eq(schema.clickCounter.name, COUNTER_NAME))
    .limit(1);
    
    // Return the count if found
    if (counter.length > 0) {
      return counter[0].count;
    }
    
    // If not found, create a new counter with 0 count
    await db.insert(schema.clickCounter)
      .values({
        name: COUNTER_NAME,
        count: 0,
      });
    
    return 0;
  } catch (error) {
    console.error('Error getting click count:', error);
    return 0;
  }
}

/**
 * Increment the click count in the database
 */
async function incrementClickCount(): Promise<number> {
  try {
    // Check if counter exists
    const existingCounter = await db.select({
      id: schema.clickCounter.id
    })
    .from(schema.clickCounter)
    .where(eq(schema.clickCounter.name, COUNTER_NAME))
    .limit(1);
    
    if (existingCounter.length === 0) {
      // Create counter if it doesn't exist
      await db.insert(schema.clickCounter)
        .values({
          name: COUNTER_NAME,
          count: 1,
        });
      return 1;
    }
    
    // Update the existing counter
    await db.update(schema.clickCounter)
      .set({
        count: sql`${schema.clickCounter.count} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(schema.clickCounter.name, COUNTER_NAME));
    
    // Get the updated count
    const updated = await db.select({
      count: schema.clickCounter.count
    })
    .from(schema.clickCounter)
    .where(eq(schema.clickCounter.name, COUNTER_NAME))
    .limit(1);
    
    return updated[0].count;
  } catch (error) {
    console.error('Error incrementing click count:', error);
    
    // If we failed to update, at least return the current count
    const currentCount = await getClickCount();
    return currentCount;
  }
}

// GET handler to retrieve current click count
export async function GET() {
  const count = await getClickCount();
  return NextResponse.json({ count });
}

// POST handler to increment click count
export async function POST() {
  const newCount = await incrementClickCount();
  return NextResponse.json({ count: newCount });
} 