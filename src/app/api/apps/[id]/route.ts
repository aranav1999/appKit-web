import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { deleteImage, uploadImage } from '@/lib/supabase';

// GET /api/apps/:id - Get a specific app
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    // Get the app from the database
    const app = await db.select().from(schema.apps)
      .where(eq(schema.apps.id, id))
      .limit(1);
    
    if (app.length === 0) {
      return NextResponse.json(
        { error: 'App not found' },
        { status: 404 }
      );
    }
    
    // Get screenshots for this app
    const screenshots = await db.select().from(schema.screenshots)
      .where(eq(schema.screenshots.appId, id))
      .orderBy(schema.screenshots.sortOrder);
    
    // Return app with screenshots
    return NextResponse.json({
      ...app[0],
      screenshots
    });
  } catch (error) {
    console.error('Error fetching app:', error);
    return NextResponse.json(
      { error: 'Failed to fetch app' },
      { status: 500 }
    );
  }
}

// PATCH /api/apps/:id - Update an app
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const formData = await request.formData();
    
    // Build update values object
    const updateValues: Partial<schema.NewApp> = {};
    
    // Add text fields if they exist
    if (formData.has('name')) updateValues.name = formData.get('name') as string;
    if (formData.has('description')) updateValues.description = formData.get('description') as string;
    if (formData.has('category')) updateValues.category = formData.get('category') as string;
    if (formData.has('price')) updateValues.price = formData.get('price') as string;
    if (formData.has('developer')) updateValues.developer = formData.get('developer') as string;
    if (formData.has('rating')) updateValues.rating = parseFloat(formData.get('rating') as string);
    if (formData.has('downloads')) updateValues.downloads = formData.get('downloads') as string;
    
    // Add URL fields if they exist
    if (formData.has('websiteUrl')) updateValues.websiteUrl = formData.get('websiteUrl') as string;
    if (formData.has('androidUrl')) updateValues.androidUrl = formData.get('androidUrl') as string;
    if (formData.has('iosUrl')) updateValues.iosUrl = formData.get('iosUrl') as string;
    if (formData.has('solanaMobileUrl')) updateValues.solanaMobileUrl = formData.get('solanaMobileUrl') as string;
    if (formData.has('projectTwitter')) updateValues.projectTwitter = formData.get('projectTwitter') as string;
    if (formData.has('submitterTwitter')) updateValues.submitterTwitter = formData.get('submitterTwitter') as string;
    if (formData.has('contractAddress')) updateValues.contractAddress = formData.get('contractAddress') as string;
    
    // Parse tags if present
    const tagsStr = formData.get('tags') as string;
    if (tagsStr) {
      try {
        updateValues.tags = JSON.parse(tagsStr);
      } catch (e) {
        console.warn('Failed to parse tags:', e);
      }
    }
    
    // Handle icon upload if provided
    const iconFile = formData.get('icon') as File | null;
    if (iconFile) {
      try {
        // Sanitize the filename before upload
        const fileName = `${Date.now()}-${iconFile.name.replace(/[^a-zA-Z0-9._-]/g, '')}`;
        updateValues.iconUrl = await uploadImage(iconFile, `icons/${fileName}`);
      } catch (error) {
        console.error('Error uploading icon:', error);
        // Continue with update even if icon upload fails
      }
    }
    
    // Set the updated timestamp
    updateValues.updatedAt = new Date();
    
    // Update the app in the database
    const updatedApp = await db.update(schema.apps)
      .set(updateValues)
      .where(eq(schema.apps.id, id))
      .returning();
    
    return NextResponse.json(updatedApp[0]);
  } catch (error) {
    console.error('Error updating app:', error);
    return NextResponse.json(
      { error: 'Failed to update app' },
      { status: 500 }
    );
  }
}

// DELETE /api/apps/:id - Delete an app
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    // First, get the app to find the icon URL
    const app = await db.select()
      .from(schema.apps)
      .where(eq(schema.apps.id, id))
      .limit(1);
    
    if (app.length === 0) {
      return NextResponse.json(
        { error: 'App not found' },
        { status: 404 }
      );
    }
    
    // Delete related screenshots
    await db.delete(schema.screenshots)
      .where(eq(schema.screenshots.appId, id));
    
    // Delete the app
    await db.delete(schema.apps)
      .where(eq(schema.apps.id, id));
    
    // Delete the icon from storage if it exists
    if (app[0].iconUrl) {
      try {
        // Extract path from the URL - this will depend on your URL structure
        const path = app[0].iconUrl.split('/').slice(-2).join('/');
        await deleteImage(path);
      } catch (storageError) {
        console.error('Error deleting icon from storage:', storageError);
        // Continue execution even if deleting the image fails
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting app:', error);
    return NextResponse.json(
      { error: 'Failed to delete app' },
      { status: 500 }
    );
  }
} 