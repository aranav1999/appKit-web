import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { uploadImage } from '@/lib/supabase';

// GET /api/categories - Get all categories
export async function GET() {
  try {
    // Fetch all active categories from the database
    const categories = await db.select()
      .from(schema.categories)
      .where(eq(schema.categories.isActive, true));
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract category data
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const isActive = formData.get('isActive') === 'true';
    
    // Get icon file if provided
    const iconFile = formData.get('icon') as File | null;
    let iconUrl = '';
    
    // Upload icon to Supabase if provided
    if (iconFile) {
      const fileName = `${Date.now()}-${iconFile.name}`;
      iconUrl = await uploadImage(iconFile, `category-icons/${fileName}`);
    }
    
    // Create new category in database
    const newCategory = await db.insert(schema.categories).values({
      name,
      description,
      iconUrl,
      isActive,
    }).returning();
    
    return NextResponse.json(newCategory[0], { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
} 