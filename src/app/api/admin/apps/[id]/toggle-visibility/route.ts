import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { updateAppShownStatus } from '@/lib/sheets/sheets-service';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const appId = parseInt(params.id, 10);
    
    if (isNaN(appId)) {
      return NextResponse.json(
        { error: 'Invalid app ID' },
        { status: 400 }
      );
    }

    // Get the current app to check its status
    const currentApp = await db.select({ isShown: schema.apps.isShown })
      .from(schema.apps)
      .where(eq(schema.apps.id, appId))
      .then(res => res[0]);

    if (!currentApp) {
      return NextResponse.json(
        { error: 'App not found' },
        { status: 404 }
      );
    }

    // Toggle the visibility
    const newIsShown = !currentApp.isShown;

    // Update in database
    await db.update(schema.apps)
      .set({ isShown: newIsShown })
      .where(eq(schema.apps.id, appId));

    // Update in Google Sheet if enabled
    const useSheets = process.env.USE_SHEETS_FOR_APPS === 'true';
    if (useSheets) {
      try {
        await updateAppShownStatus(appId, newIsShown);
      } catch (sheetError) {
        console.error('Error updating sheet (continuing):', sheetError);
        // Continue even if sheet update fails
      }
    }

    return NextResponse.json({ success: true, isShown: newIsShown });
  } catch (error) {
    console.error('Error toggling app visibility:', error);
    return NextResponse.json(
      { error: 'Failed to toggle app visibility' },
      { status: 500 }
    );
  }
} 