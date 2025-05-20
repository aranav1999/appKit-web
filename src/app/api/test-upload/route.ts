import { NextRequest, NextResponse } from 'next/server';
import { StorageClient } from '@supabase/storage-js';
import { uploadImage } from '@/lib/supabase';
import { createBucketIfNotExists, uploadFileDirect } from '@/lib/supabase/client';

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// POST /api/test-upload
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Generate a unique path for the test upload
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '');
    const fileName = `test-${timestamp}-${sanitizedName}`;
    const filePath = `test/${fileName}`;
    
    // Test results object
    const results = {
      file: {
        name: file.name,
        size: file.size,
        type: file.type
      },
      environment: {
        supabaseUrl: supabaseUrl ? 'Set' : 'Not set',
        supabaseKey: supabaseKey ? 'Set (hidden)' : 'Not set',
      },
      paths: {
        requestedPath: filePath
      },
      tests: {
        directApiUpload: {
          attempted: false,
          success: false,
          url: null,
          error: null
        },
        clientLibUpload: {
          attempted: false,
          success: false,
          url: null,
          error: null
        },
        standardUpload: {
          attempted: false,
          success: false,
          url: null,
          error: null
        }
      }
    };
    
    // Test 1: Direct API upload
    try {
      results.tests.directApiUpload.attempted = true;
      console.log('Testing direct API upload...');
      const directUrl = await uploadFileDirect(file, filePath);
      
      if (directUrl) {
        results.tests.directApiUpload.success = true;
        results.tests.directApiUpload.url = directUrl;
        console.log('Direct API upload successful');
      } else {
        throw new Error('Direct upload failed but did not throw an error');
      }
    } catch (error: any) {
      console.error('Direct API upload failed:', error);
      results.tests.directApiUpload.error = error.message || 'Unknown error';
    }
    
    // Test 2: Storage client library upload
    if (supabaseUrl && supabaseKey) {
      try {
        results.tests.clientLibUpload.attempted = true;
        console.log('Testing Storage client library upload...');
        
        const storageClient = new StorageClient(supabaseUrl, {
          apikey: supabaseKey,
        });
        
        // Try to create bucket first
        try {
          const { data: buckets } = await storageClient.listBuckets();
          const bucketExists = buckets?.find(b => b.name === 'app-images');
          
          if (!bucketExists) {
            console.log('Creating bucket via client library...');
            await storageClient.createBucket('app-images', {
              public: true
            });
          }
        } catch (bucketError: any) {
          results.tests.clientLibUpload.error = `Bucket setup failed: ${bucketError.message}`;
          console.error('Bucket setup failed:', bucketError);
        }
        
        // Try upload
        const { data, error } = await storageClient
          .from('app-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true,
          });
          
        if (error) {
          throw error;
        }
        
        if (data && data.path) {
          results.tests.clientLibUpload.success = true;
          results.tests.clientLibUpload.url = `${supabaseUrl}/storage/v1/object/public/app-images/${data.path}`;
          console.log('Client library upload successful');
        }
      } catch (error: any) {
        console.error('Storage client upload failed:', error);
        results.tests.clientLibUpload.error = error.message || 'Unknown error';
      }
    }
    
    // Test 3: Standard lib function upload
    try {
      results.tests.standardUpload.attempted = true;
      console.log('Testing standard library upload...');
      
      const imageUrl = await uploadImage(file, filePath);
      
      if (imageUrl) {
        results.tests.standardUpload.success = true;
        results.tests.standardUpload.url = imageUrl;
        console.log('Standard library upload successful');
      }
    } catch (error: any) {
      console.error('Standard library upload failed:', error);
      results.tests.standardUpload.error = error.message || 'Unknown error';
    }
    
    // Return all test results
    return NextResponse.json(results);
    
  } catch (error: any) {
    console.error('Test upload fatal error:', error);
    
    return NextResponse.json(
      { 
        error: 'Test failed',
        details: error?.message || 'Unknown error',
        stack: error?.stack || null
      },
      { status: 500 }
    );
  }
} 