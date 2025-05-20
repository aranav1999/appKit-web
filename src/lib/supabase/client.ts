/**
 * Direct REST API client for Supabase Storage
 * This is used as a fallback when the @supabase/storage-js client isn't working
 */

// Constants
const BUCKET_NAME = 'app-images';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Creates a bucket in Supabase Storage if it doesn't exist
 */
export async function createBucketIfNotExists(): Promise<boolean> {
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
      throw new Error(`Failed to list buckets: ${listResponse.status} ${listResponse.statusText}`);
    }

    const buckets = await listResponse.json();
    const bucketExists = buckets.find((b: any) => b.name === BUCKET_NAME);

    if (bucketExists) {
      return true;
    }

    // Create bucket if it doesn't exist
    const createResponse = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify({
        name: BUCKET_NAME,
        public: true,
        file_size_limit: 5242880 // 5MB limit
      })
    });

    if (!createResponse.ok) {
      throw new Error(`Failed to create bucket: ${createResponse.status} ${createResponse.statusText}`);
    }

    console.log(`Created bucket: ${BUCKET_NAME}`);
    return true;
  } catch (error) {
    console.error('Error in createBucketIfNotExists:', error);
    return false;
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
    // Ensure bucket exists
    const bucketExists = await createBucketIfNotExists();
    if (!bucketExists) {
      throw new Error('Failed to create or verify bucket');
    }

    // Sanitize path (remove leading slashes)
    const sanitizedPath = path.startsWith('/') ? path.substring(1) : path;

    // Upload file
    const formData = new FormData();
    formData.append('file', file);

    const uploadResponse = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET_NAME}/${sanitizedPath}`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      },
      body: formData
    });

    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload file: ${uploadResponse.status} ${uploadResponse.statusText}`);
    }

    const uploadResult = await uploadResponse.json();
    
    // Return the public URL for the uploaded file
    return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${uploadResult.Key}`;
  } catch (error) {
    console.error('Error in uploadFileDirect:', error);
    return null;
  }
} 