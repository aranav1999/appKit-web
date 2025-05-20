// @ts-nocheck

import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { deleteImage } from '@/lib/supabase';

// DELETE /api/screenshots/:id - Delete a screenshot
export async function DELETE(
  _request: NextRequest,
  { params }: any
) {
  try {
    const id = parseInt(params.id);
    
    // First, get the screenshot to find the image URL
    const screenshot = await db.select()
      .from(schema.screenshots)
      .where(eq(schema.screenshots.id, id) as any)
      .limit(1);
    
    if (screenshot.length === 0) {
      return NextResponse.json(
        { error: 'Screenshot not found' },
        { status: 404 }
      );
    }
    
    // Delete the screenshot from the database
    await db.delete(schema.screenshots)
      .where(eq(schema.screenshots.id, id) as any);
    
    // Delete the image from storage
    if (screenshot[0].imageUrl) {
      try {
        // Extract path from the URL
        const path = screenshot[0].imageUrl.split('/').slice(-2).join('/');
        await deleteImage(path);
      } catch (storageError) {
        console.error('Error deleting screenshot from storage:', storageError);
        // Continue execution even if deleting the image fails
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting screenshot:', error);
    return NextResponse.json(
      { error: 'Failed to delete screenshot' },
      { status: 500 }
    );
  }
}

// PATCH /api/screenshots/:id - Update a screenshot (e.g., change sort order)
export async function PATCH(
  request: NextRequest,
  { params }: any
) {
  try {
    const id = parseInt(params.id);
    const { sortOrder } = await request.json();
    
    if (typeof sortOrder !== 'number') {
      return NextResponse.json(
        { error: 'Sort order must be a number' },
        { status: 400 }
      );
    }
    
    // Update the screenshot in the database
    const updatedScreenshot = await db.update(schema.screenshots)
      .set({ sortOrder })
      .where(eq(schema.screenshots.id, id) as any)
      .returning();
    
    if (updatedScreenshot.length === 0) {
      return NextResponse.json(
        { error: 'Screenshot not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedScreenshot[0]);
  } catch (error) {
    console.error('Error updating screenshot:', error);
    return NextResponse.json(
      { error: 'Failed to update screenshot' },
      { status: 500 }
    );
  }
} 