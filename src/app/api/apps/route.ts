import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/lib/db';
import { uploadImage } from '@/lib/supabase';
import { uploadFile as mockUploadFile } from '@/lib/mock-storage';
import { type NewApp } from '@/lib/db/schema';

// Flag to use mock storage instead of Supabase
const USE_MOCK_STORAGE = true;

// GET /api/apps - Get all apps
export async function GET() {
  try {
    // Fetch all apps from the database
    const apps = await db.select().from(schema.apps);
    return NextResponse.json(apps);
  } catch (error) {
    console.error('Error fetching apps:', error);
    return NextResponse.json(
      { error: 'Failed to fetch apps' },
      { status: 500 }
    );
  }
}

// POST /api/apps - Create a new app
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract app data from form
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const price = formData.get('price') as string || 'Free';
    const developer = formData.get('developer') as string || '';
    const ratingStr = formData.get('rating') as string || null;
    const downloads = formData.get('downloads') as string || '0';
    
    // Extract additional fields
    const websiteUrl = formData.get('websiteUrl') as string || '';
    const androidUrl = formData.get('androidUrl') as string || '';
    const iosUrl = formData.get('iosUrl') as string || '';
    const solanaMobileUrl = formData.get('solanaMobileUrl') as string || '';
    const projectTwitter = formData.get('projectTwitter') as string || '';
    const submitterTwitter = formData.get('submitterTwitter') as string || '';
    const contractAddress = formData.get('contractAddress') as string || '';
    
    // Parse tags if present
    let tags: string[] = [];
    const tagsStr = formData.get('tags') as string;
    if (tagsStr) {
      try {
        tags = JSON.parse(tagsStr);
      } catch (e) {
        console.warn('Failed to parse tags:', e);
      }
    }
    
    console.log(`Creating app: ${name}`);
    
    let iconUrl = '';
    
    // Check if iconUrl was provided (pre-uploaded)
    const preUploadedIconUrl = formData.get('iconUrl') as string;
    if (preUploadedIconUrl) {
      iconUrl = preUploadedIconUrl;
      console.log(`Using pre-uploaded icon: ${iconUrl}`);
    } else {
      // Get icon file if provided
      const iconFile = formData.get('icon') as File | null;
      
      // Upload icon if provided
      if (iconFile) {
        try {
          // Sanitize the filename before upload
          const timestamp = Date.now();
          const sanitizedName = iconFile.name.replace(/[^a-zA-Z0-9._-]/g, '');
          const fileName = `${timestamp}-${sanitizedName}`;
          const filePath = `icons/${fileName}`;
          
          console.log(`Uploading icon to path: ${filePath}`);
          
          if (USE_MOCK_STORAGE) {
            // Use mock storage for development
            iconUrl = await mockUploadFile(iconFile, filePath);
            console.log(`Mock upload successful: ${iconUrl}`);
          } else {
            // Use Supabase storage for production
            try {
              iconUrl = await uploadImage(iconFile, filePath);
              console.log(`Supabase upload successful: ${iconUrl}`);
            } catch (supabaseError) {
              console.error('Supabase upload failed, falling back to mock storage:', supabaseError);
              iconUrl = await mockUploadFile(iconFile, filePath);
              console.log(`Fallback mock upload successful: ${iconUrl}`);
            }
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          // Continue with empty iconUrl rather than failing the entire request
        }
      }
    }
    
    // Create app entry even if icon upload failed
    console.log('Creating database entry');
    
    // Prepare valid insert data
    const insertData = {
      name,
      description,
      iconUrl,
      category,
      price,
      developer,
      // Pass rating as string or null to match numeric type
      rating: ratingStr,
      downloads,
      websiteUrl,
      androidUrl,
      iosUrl,
      solanaMobileUrl,
      projectTwitter,
      submitterTwitter,
      contractAddress,
      tags,
    };
    
    // Create new app in database
    const newApp = await db.insert(schema.apps).values(insertData).returning();
    
    console.log(`Created app with ID: ${newApp[0]?.id}`);
    return NextResponse.json(newApp[0], { status: 201 });
  } catch (error: any) {
    console.error('Error creating app:', error);
    
    // Format a better error response
    return NextResponse.json(
      { 
        error: 'Failed to create app',
        details: error?.message || 'Unknown error',
        code: error?.code || 'UNKNOWN'
      },
      { status: 500 }
    );
  }
} 