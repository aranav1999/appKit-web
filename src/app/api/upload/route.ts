import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/supabase';
import { uploadFile as mockUploadFile } from '@/lib/mock-storage';

// Flag to use mock storage instead of Supabase
const USE_MOCK_STORAGE = true;

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
    
    // Upload the file and get the URL
    let fileUrl;
    
    if (USE_MOCK_STORAGE) {
      // Use mock storage for development
      fileUrl = await mockUploadFile(file, filePath);
      console.log(`Mock upload successful: ${fileUrl}`);
    } else {
      // Use Supabase storage for production
      try {
        fileUrl = await uploadImage(file, filePath);
        console.log(`Supabase upload successful: ${fileUrl}`);
      } catch (supabaseError) {
        console.error('Supabase upload failed, falling back to mock storage:', supabaseError);
        fileUrl = await mockUploadFile(file, filePath);
        console.log(`Fallback mock upload successful: ${fileUrl}`);
      }
    }
    
    // Return the URL and path information
    return NextResponse.json({
      url: fileUrl,
      path: filePath,
      type: fileType,
      storage: USE_MOCK_STORAGE ? 'mock' : 'supabase'
    });
    
  } catch (error: any) {
    console.error('Error uploading file:', error);
    
    // Format a better error response
    return NextResponse.json(
      { 
        error: 'Failed to upload file',
        details: error?.message || 'Unknown error',
        code: error?.code || 'UNKNOWN'
      },
      { status: 500 }
    );
  }
} 