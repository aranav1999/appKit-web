import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, APP_IMAGES_BUCKET } from '@/lib/supabase/server';

// Direct upload to Supabase storage bypassing RLS using the admin client
async function uploadToStorage(file: File, path: string): Promise<string> {
  if (!file || !path) {
    throw new Error('Missing file or path for upload');
  }
  
  const sanitizedPath = path.startsWith('/') ? path.substring(1) : path;
  
  console.log(`Uploading to bucket ${APP_IMAGES_BUCKET}, path: ${sanitizedPath} with server-side admin client`);
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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const fileType = formData.get('type') as string || 'icon'; // icon, banner, screenshot
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Sanitize the filename before upload
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '');
    const fileName = `${timestamp}-${sanitizedName}`;
    
    // Determine the folder path based on file type
    let filePath;
    switch (fileType) {
      case 'banner':
        filePath = `banners/${fileName}`;
        break;
      case 'screenshot':
        filePath = `screenshots/${fileName}`;
        break;
      case 'icon':
      default:
        filePath = `icons/${fileName}`;
    }
    
    console.log(`Uploading ${fileType} to path: ${filePath}`);
    
    // Upload the file to Supabase storage using admin client
    const fileUrl = await uploadToStorage(file, filePath);
    console.log(`Supabase upload successful: ${fileUrl}`);
    
    // Return the URL and path information
    return NextResponse.json({
      url: fileUrl,
      path: filePath,
      type: fileType,
      storage: 'supabase'
    });
    
  } catch (error: any) {
    console.error('Error uploading file:', error);
    
    // Format a better error response
    return NextResponse.json(
      { 
        error: 'Failed to upload file',
        details: error?.message || 'Unknown error',
        code: error?.code || error?.statusCode || 'UNKNOWN'
      },
      { status: 500 }
    );
  }
} 