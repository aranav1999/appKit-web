import { NextResponse } from 'next/server';
import { db, schema } from '@/lib/db';
import { eq, sql } from 'drizzle-orm';

const COUNTER_NAME = 'coming-soon-clicks';

/**
 * Get the current click count from the database
 */
async function getClickCount(appName?: string): Promise<number> {
  try {
    const name = appName ? `app-${appName}` : COUNTER_NAME;
    
    // Try to find the existing counter
    const counter = await db.select({
      count: schema.clickCounter.count
    })
    .from(schema.clickCounter)
    .where(eq(schema.clickCounter.name, name))
    .limit(1);
    
    // Return the count if found
    if (counter.length > 0) {
      return counter[0].count;
    }
    
    // If not found, create a new counter with 0 count
    await db.insert(schema.clickCounter)
      .values({
        name,
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
async function incrementClickCount(appName?: string): Promise<number> {
  try {
    const name = appName ? `app-${appName}` : COUNTER_NAME;
    
    // Check if counter exists
    const existingCounter = await db.select({
      id: schema.clickCounter.id
    })
    .from(schema.clickCounter)
    .where(eq(schema.clickCounter.name, name))
    .limit(1);
    
    if (existingCounter.length === 0) {
      // Create counter if it doesn't exist
      await db.insert(schema.clickCounter)
        .values({
          name,
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
      .where(eq(schema.clickCounter.name, name));
    
    // Get the updated count
    const updated = await db.select({
      count: schema.clickCounter.count
    })
    .from(schema.clickCounter)
    .where(eq(schema.clickCounter.name, name))
    .limit(1);
    
    return updated[0].count;
  } catch (error) {
    console.error('Error incrementing click count:', error);
    
    // If we failed to update, at least return the current count
    const currentCount = await getClickCount(appName);
    return currentCount;
  }
}

// GET handler to retrieve current click count
export async function GET(request: Request) {
  // Check if there's an appName query parameter
  const { searchParams } = new URL(request.url);
  const appName = searchParams.get('appName') || undefined;
  
  const count = await getClickCount(appName);
  return NextResponse.json({ count });
}

// POST handler to increment click count
export async function POST(request: Request) {
  // Get the appName from the request body if it exists
  let appName: string | undefined;
  
  try {
    const body = await request.json();
    appName = body.appName;
  } catch (error) {
    // If body parsing fails, continue without an appName
  }
  
  const newCount = await incrementClickCount(appName);
  return NextResponse.json({ count: newCount });
} 