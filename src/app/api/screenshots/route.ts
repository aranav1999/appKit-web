import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/lib/db';
import { uploadImage } from '@/lib/supabase';
import { uploadFile as mockUploadFile } from '@/lib/mock-storage';

// Flag to use mock storage instead of Supabase
const USE_MOCK_STORAGE = true;

// POST /api/screenshots - Add a screenshot to an app
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Get required data
    const appId = parseInt(formData.get('appId') as string);
    const sortOrder = parseInt(formData.get('sortOrder') as string || '0');
    
    // Check if we have a pre-uploaded image URL or a file
    const preUploadedImageUrl = formData.get('imageUrl') as string;
    const imageFile = formData.get('image') as File | null;
    
    if (!appId || (!preUploadedImageUrl && !imageFile)) {
      return NextResponse.json(
        { error: 'Missing required fields (appId and either imageUrl or image file)' },
        { status: 400 }
      );
    }

    let imageUrl = '';

    // Use pre-uploaded URL if available
    if (preUploadedImageUrl) {
      console.log(`Using pre-uploaded image for app ID: ${appId}, URL: ${preUploadedImageUrl}`);
      imageUrl = preUploadedImageUrl;
    } 
    // Otherwise upload the file
    else if (imageFile) {
      console.log(`Processing screenshot upload for app ID: ${appId}, file: ${imageFile.name}`);
      
      // Upload the screenshot
      try {
        // Sanitize the filename before upload
        const timestamp = Date.now();
        const sanitizedName = imageFile.name.replace(/[^a-zA-Z0-9._-]/g, '');
        const fileName = `${timestamp}-${sanitizedName}`;
        const filePath = `screenshots/${fileName}`;
        
        console.log(`Attempting to upload to path: ${filePath}`);
        
        if (USE_MOCK_STORAGE) {
          // Use mock storage for development
          imageUrl = await mockUploadFile(imageFile, filePath);
          console.log(`Mock upload successful: ${imageUrl}`);
        } else {
          // Use Supabase storage for production
          try {
            imageUrl = await uploadImage(imageFile, filePath);
            console.log(`Supabase upload successful: ${imageUrl}`);
          } catch (supabaseError) {
            console.error('Supabase upload failed, falling back to mock storage:', supabaseError);
            imageUrl = await mockUploadFile(imageFile, filePath);
            console.log(`Fallback mock upload successful: ${imageUrl}`);
          }
        }
      } catch (error: any) {
        console.error('Error processing screenshot upload:', error);
        
        // Create a more readable error message
        const errorMessage = error?.message || 'Unknown error during upload';
        const status = error?.status || 500;
        
        return NextResponse.json(
          { 
            error: 'Failed to upload screenshot',
            details: errorMessage,
            path: `screenshots/${imageFile.name}`
          },
          { status }
        );
      }
    }
    
    // Add the screenshot to the database
    const newScreenshot = await db.insert(schema.screenshots).values({
      appId,
      imageUrl,
      sortOrder,
    }).returning();
    
    return NextResponse.json(newScreenshot[0], { status: 201 });
  } catch (error) {
    console.error('Error adding screenshot:', error);
    return NextResponse.json(
      { error: 'Failed to add screenshot' },
      { status: 500 }
    );
  }
} 