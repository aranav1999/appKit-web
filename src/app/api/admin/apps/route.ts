import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/lib/db';

// GET /api/admin/apps - Get all apps (for admin)
export async function GET() {
  try {
    // Fetch all apps from the database, regardless of isShown status
    const apps = await db.select().from(schema.apps).orderBy(schema.apps.createdAt);
    return NextResponse.json(apps);
  } catch (error) {
    console.error('Error fetching apps for admin:', error);
    return NextResponse.json(
      { error: 'Failed to fetch apps' },
      { status: 500 }
    );
  }
} 