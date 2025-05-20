import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/lib/db';
import { supabaseAdmin, APP_IMAGES_BUCKET } from '@/lib/supabase/server';

// Direct upload to Supabase storage bypassing RLS
async function uploadToStorage(file: File, path: string): Promise<string> {
  if (!file || !path) {
    throw new Error('Missing file or path for upload');
  }
  
  const sanitizedPath = path.startsWith('/') ? path.substring(1) : path;
  
  console.log(`Uploading screenshot to bucket ${APP_IMAGES_BUCKET}, path: ${sanitizedPath}`);
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
        
        // Upload to Supabase storage using admin client
        imageUrl = await uploadToStorage(imageFile, filePath);
        console.log(`Supabase upload successful: ${imageUrl}`);
      } catch (error: any) {
        console.error('Error processing screenshot upload:', error);
        
        // Create a more readable error message
        const errorMessage = error?.message || 'Unknown error during upload';
        const status = error?.status || 500;
        
        return NextResponse.json(
          { 
            error: 'Failed to upload screenshot',
            details: errorMessage,
            code: error?.code || error?.statusCode || 'UNKNOWN',
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
  } catch (error: any) {
    console.error('Error adding screenshot:', error);
    return NextResponse.json(
      { 
        error: 'Failed to add screenshot',
        details: error?.message || 'Unknown error',
        code: error?.code || error?.statusCode || 'UNKNOWN'
      },
      { status: 500 }
    );
  }
} 