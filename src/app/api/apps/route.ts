import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/lib/db';
import { supabaseAdmin, APP_IMAGES_BUCKET } from '@/lib/supabase/server';
import { type NewApp } from '@/lib/db/schema';
import { getApprovedAppsFromSheet, addAppToSheet } from '@/lib/sheets/sheets-service';
import { sql } from 'drizzle-orm';

// Specify Node.js runtime
export const runtime = 'nodejs';

// Direct upload to Supabase storage bypassing RLS
async function uploadToStorage(file: File, path: string): Promise<string> {
  if (!file || !path) {
    throw new Error('Missing file or path for upload');
  }
  
  const sanitizedPath = path.startsWith('/') ? path.substring(1) : path;
  
  console.log(`Uploading app icon to bucket ${APP_IMAGES_BUCKET}, path: ${sanitizedPath}`);
  console.log(`Using service role key: ${process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY?.substring(0, 10)}...`);
  
  try {
    // Convert file to arrayBuffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Upload file using admin client (bypasses RLS)
    const { data, error } = await supabaseAdmin
      .storage
      .from(APP_IMAGES_BUCKET)
      .upload(sanitizedPath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: true,
      });
    
    if (error) {
      console.error('Supabase storage upload error:', error);
      throw error;
    }
    
    if (!data || !data.path) {
      throw new Error('Upload successful but file path was not returned');
    }
    
    console.log('Upload successful:', data);
    
    // Get the public URL
    const { data: urlData } = supabaseAdmin
      .storage
      .from(APP_IMAGES_BUCKET)
      .getPublicUrl(data.path);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Detailed upload error:', error);
    throw error;
  }
}

// GET /api/apps - Get all approved apps from the sheet
export async function GET() {
  try {
    console.log('GET /api/apps - Starting request');
    console.log('Database URL defined:', !!process.env.DATABASE_URL);
    
    // Use the environment variable to determine if we should use sheets or database
    const useSheets = process.env.USE_SHEETS_FOR_APPS === 'true';
    
    if (useSheets) {
      console.log('Fetching approved apps from Google Sheet');
      try {
        // Fetch approved apps from the Google Sheet
        const approvedApps = await getApprovedAppsFromSheet();
        return NextResponse.json(approvedApps);
      } catch (sheetError) {
        console.error('Error fetching from sheet, falling back to database:', sheetError);
      }
    }
    
    // If we're here, either sheets are not enabled or sheet fetch failed
    console.log('Fetching apps from database using raw SQL...');
    
    try {
      // Use raw SQL to avoid schema mismatch issues
      const result = await db.execute(sql`
        SELECT * FROM apps
      `);
      
      console.log(`Successfully fetched ${result.rows.length} apps`);
      return NextResponse.json(result.rows);
    } catch (dbError) {
      console.error('Database query error:', dbError);
      
      // Mock response for development if database is unavailable
      if (process.env.NODE_ENV === 'development') {
        console.log('Returning mock data for development');
        return NextResponse.json([
          {
            id: 1,
            name: 'Mock App',
            description: 'This is a mock app returned when database is unavailable',
            iconUrl: 'https://placehold.co/100',
            category: 'Development',
          }
        ]);
      }
      
      throw dbError;
    }
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
    const featureBannerUrl = formData.get('featureBannerUrl') as string || '';
    
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
          
          // Upload to Supabase storage using admin client
          iconUrl = await uploadToStorage(iconFile, filePath);
          console.log(`Supabase upload successful: ${iconUrl}`);
        } catch (error: any) {
          console.error('Error uploading image:', error);
          // Continue with empty iconUrl rather than failing the entire request
        }
      }
    }
    
    // Create app entry even if icon upload failed
    console.log('Creating database entry');
    
    // Prepare valid insert data (omitting isShown to avoid errors if column doesn't exist)
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
      featureBannerUrl,
      tags,
    };
    
    // Create new app in database
    const newApp = await db.insert(schema.apps).values(insertData).returning();
    
    // Try to set isShown to false separately
    try {
      // Use raw SQL to set isShown to false if the column exists
      await db.execute(
        sql`UPDATE "apps" 
            SET "is_shown" = false 
            WHERE "id" = ${newApp[0]?.id}`
      );
    } catch (columnError) {
      console.warn('Could not set isShown (column might not exist yet):', columnError);
    }
    
    console.log(`Created app with ID: ${newApp[0]?.id}`);
    
    // Add to Google Sheet if feature is enabled
    const useSheets = process.env.USE_SHEETS_FOR_APPS === 'true';
    if (useSheets && newApp[0]) {
      try {
        await addAppToSheet(newApp[0]);
        console.log(`Added app ${newApp[0].id} to Google Sheet`);
      } catch (sheetError) {
        console.error('Error adding to sheet (continuing):', sheetError);
        // Don't fail the request if sheet add fails
      }
    }
    
    return NextResponse.json(newApp[0], { status: 201 });
  } catch (error: any) {
    console.error('Error creating app:', error);
    
    // Format a better error response
    return NextResponse.json(
      { 
        error: 'Failed to create app',
        details: error?.message || 'Unknown error',
        code: error?.code || error?.statusCode || 'UNKNOWN'
      },
      { status: 500 }
    );
  }
} 