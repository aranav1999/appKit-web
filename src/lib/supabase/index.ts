import { createClient } from '@supabase/supabase-js';
import { logAllBuckets, checkBucketExists } from './client';

// Ensure we have the required environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// Use the service role key for admin operations
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables. Please check your .env.local file.');
}

// Create the regular client for public operations
export const supabase = createClient(supabaseUrl || '', supabaseKey || '');

// Create an admin client for operations that require bypassing RLS
const adminClient = createClient(supabaseUrl || '', serviceRoleKey || '', {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Bucket name for app images
export const APP_IMAGES_BUCKET = 'app-images';

// No need to create bucket since it already exists
console.log('Using existing Supabase storage bucket:', APP_IMAGES_BUCKET);

// Log all buckets on startup for debugging
logAllBuckets().catch(err => {
  console.error('Error logging buckets:', err);
});

/**
 * Upload an image to Supabase Storage using admin rights to bypass RLS
 * @param file The file to upload
 * @param path The path within the bucket where the file should be stored
 * @returns The URL of the uploaded file
 */
export async function uploadImage(file: File, path: string): Promise<string> {
  if (!supabaseUrl) {
    throw new Error('Missing Supabase URL');
  }

  if (!file) {
    throw new Error('No file provided for upload');
  }
  
  if (!path || path.trim() === '') {
    throw new Error('Invalid file path: Path cannot be empty');
  }
  
  // Ensure path is sanitized (no leading slashes)
  const sanitizedPath = path.startsWith('/') ? path.substring(1) : path;
  
  // Use the admin client to upload (bypasses RLS)
  try {
    console.log(`Uploading to bucket ${APP_IMAGES_BUCKET}, path: ${sanitizedPath}`);
    
    const { data, error } = await adminClient
      .storage
      .from(APP_IMAGES_BUCKET)
      .upload(sanitizedPath, file, {
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
    
    // Return the public URL for the uploaded file
    const { data: urlData } = adminClient.storage.from(APP_IMAGES_BUCKET).getPublicUrl(data.path);
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

/**
 * Delete an image from Supabase Storage
 * @param path The path of the file to delete
 */
export async function deleteImage(path: string): Promise<void> {
  if (!supabaseUrl) {
    throw new Error('Missing Supabase URL');
  }

  if (!path || path.trim() === '') {
    throw new Error('Invalid file path: Path cannot be empty');
  }
  
  try {
    // Use admin client to bypass RLS
    const { error } = await adminClient
      .storage
      .from(APP_IMAGES_BUCKET)
      .remove([path]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}

export { supabase as storageClient }; 