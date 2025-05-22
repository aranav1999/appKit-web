import { db } from '@/lib/db';
import { waitlist } from '@/lib/db/schema';
import { NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Insert email into waitlist table
    await db.insert(waitlist).values({
      email,
      signupDate: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding to waitlist:', error);
    return NextResponse.json(
      { error: 'Failed to add to waitlist' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get count of waitlist entries
    const result = await db.select({ count: sql`count(*)` }).from(waitlist);
    const count = Number(result[0]?.count || 0);

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error getting waitlist count:', error);
    return NextResponse.json(
      { error: 'Failed to get waitlist count' },
      { status: 500 }
    );
  }
} 