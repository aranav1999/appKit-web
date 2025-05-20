/**
 * Logging and utilities for Supabase Storage
 */

// Constants
const BUCKET_NAME = 'app-images';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Logs all available buckets for debugging
 */
export async function logAllBuckets(): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials');
    return;
  }

  try {
    console.log('SUPABASE_URL:', SUPABASE_URL);
    console.log('SUPABASE_KEY (first 10 chars):', SUPABASE_KEY?.substring(0, 10) + '...');
    
    // List all buckets
    const listResponse = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });

    console.log('Bucket list response status:', listResponse.status, listResponse.statusText);
    
    if (!listResponse.ok) {
      console.error(`Failed to list buckets: ${listResponse.status} ${listResponse.statusText}`);
      return;
    }

    const buckets = await listResponse.json();
    console.log('Available buckets:', JSON.stringify(buckets, null, 2));
    
    // Check if our bucket exists
    const bucketExists = buckets.find((b: any) => b.name === BUCKET_NAME);
    console.log(`Bucket ${BUCKET_NAME} exists:`, !!bucketExists);
    
  } catch (error) {
    console.error('Error listing buckets:', error);
  }
}

/**
 * Checks if a bucket exists in Supabase Storage
 */
export async function checkBucketExists(): Promise<boolean> {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials');
    return false;
  }

  try {
    // Check if bucket exists
    const listResponse = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });

    if (!listResponse.ok) {
      console.error(`Failed to list buckets: ${listResponse.status} ${listResponse.statusText}`);
      // Assume bucket exists if we can't check - safer than trying to create
      return true;
    }

    const buckets = await listResponse.json();
    const bucketExists = buckets.find((b: any) => b.name === BUCKET_NAME);

    if (bucketExists) {
      console.log(`Bucket already exists: ${BUCKET_NAME}`);
      return true;
    }
    
    console.log(`Bucket not found: ${BUCKET_NAME}`);
    return false;
  } catch (error) {
    console.error('Error checking bucket:', error);
    // Assume bucket exists if we can't check - safer than trying to create
    return true;
  }
}

/**
 * Upload a file directly using the REST API
 * @param file The file to upload
 * @param path The path within the bucket
 * @returns The URL of the uploaded file or null on failure
 */
export async function uploadFileDirect(file: File, path: string): Promise<string | null> {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials');
    return null;
  }

  if (!file || !path) {
    console.error('Missing file or path for upload');
    return null;
  }

  try {
    // Log all available buckets for debugging
    await logAllBuckets();
    
    // Sanitize path (remove leading slashes)
    const sanitizedPath = path.startsWith('/') ? path.substring(1) : path;

    // Upload file
    const formData = new FormData();
    formData.append('file', file);

    console.log(`Attempting to upload to bucket: ${BUCKET_NAME} and path: ${sanitizedPath}`);
    
    const uploadResponse = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET_NAME}/${sanitizedPath}`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      },
      body: formData
    });

    console.log('Upload response status:', uploadResponse.status, uploadResponse.statusText);
    
    if (!uploadResponse.ok) {
      // Try to get more details from the response
      try {
        const errorDetails = await uploadResponse.json();
        console.error('Upload error details:', errorDetails);
      } catch (e) {
        // If we can't parse the response as JSON, just log the error
        console.error('Could not parse error response as JSON');
      }
      
      throw new Error(`Failed to upload file: ${uploadResponse.status} ${uploadResponse.statusText}`);
    }

    const uploadResult = await uploadResponse.json();
    console.log('Upload result:', uploadResult);
    
    // Return the public URL for the uploaded file
    return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${uploadResult.Key}`;
  } catch (error) {
    console.error('Error in uploadFileDirect:', error);
    return null;
  }
} 