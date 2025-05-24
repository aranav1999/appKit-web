// @ts-nocheck

import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { deleteImage, uploadImage } from '@/lib/supabase';

// Specify Node.js runtime
export const runtime = 'nodejs';

// GET /api/categories/:id - Get a specific category
export async function GET(
  _request: NextRequest,
  { params }: any
) {
  try {
    const id = parseInt(params.id);
    
    // Get the category from the database
    const category = await db.select()
      .from(schema.categories)
      .where(eq(schema.categories.id, id))
      .limit(1);
    
    if (category.length === 0) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(category[0]);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

// PATCH /api/categories/:id - Update a category
export async function PATCH(
  request: NextRequest,
  { params }: any
) {
  try {
    const id = parseInt(params.id);
    const formData = await request.formData();
    
    // Build update values object
    const updateValues: Partial<schema.NewCategory> = {};
    
    // Add fields if they exist
    if (formData.has('name')) updateValues.name = formData.get('name') as string;
    if (formData.has('description')) updateValues.description = formData.get('description') as string;
    if (formData.has('isActive')) updateValues.isActive = formData.get('isActive') === 'true';
    
    // Handle icon upload if provided
    const iconFile = formData.get('icon') as File | null;
    if (iconFile) {
      const fileName = `${Date.now()}-${iconFile.name}`;
      updateValues.iconUrl = await uploadImage(iconFile, `category-icons/${fileName}`);
    }
    
    // Set the updated timestamp
    updateValues.updatedAt = new Date();
    
    // Update the category in the database
    const updatedCategory = await db.update(schema.categories)
      .set(updateValues)
      .where(eq(schema.categories.id, id))
      .returning();
    
    if (updatedCategory.length === 0) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedCategory[0]);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/:id - Delete a category
export async function DELETE(
  _request: NextRequest,
  { params }: any
) {
  try {
    const id = parseInt(params.id);
    
    // First, get the category to find the icon URL
    const category = await db.select()
      .from(schema.categories)
      .where(eq(schema.categories.id, id))
      .limit(1);
    
    if (category.length === 0) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Delete the category from the database
    await db.delete(schema.categories)
      .where(eq(schema.categories.id, id));
    
    // Delete the icon from storage if it exists
    if (category[0].iconUrl) {
      try {
        // Extract path from the URL
        const path = category[0].iconUrl.split('/').slice(-2).join('/');
        await deleteImage(path);
      } catch (storageError) {
        console.error('Error deleting icon from storage:', storageError);
        // Continue execution even if deleting the image fails
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
} 