import { StorageClient } from '@supabase/storage-js';
import { createBucketIfNotExists, uploadFileDirect } from './client';

// Ensure we have the required environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables. Please check your .env.local file.');
}

// Create a single instance of the storage client for the entire app
const storageClient = new StorageClient(supabaseUrl || '', {
  apikey: supabaseKey || '',
});

// Bucket name for app images
export const APP_IMAGES_BUCKET = 'app-images';

// Initialize the bucket when the app starts
async function initializeBucket() {
  if (!supabaseUrl || !supabaseKey) {
    console.error('Cannot initialize bucket: Missing Supabase credentials');
    return;
  }

  try {
    // Try using the direct REST API first for reliability
    await createBucketIfNotExists();
  } catch (directError) {
    console.error('Direct bucket initialization failed, trying StorageClient:', directError);
    
    try {
      // Check if bucket exists
      const { data: buckets, error: listError } = await storageClient.listBuckets();
      
      if (listError) {
        console.error('Error listing buckets:', listError);
        return;
      }
      
      const bucketExists = buckets?.find(b => b.name === APP_IMAGES_BUCKET);
      
      if (!bucketExists) {
        // Create the bucket if it doesn't exist
        console.log(`Creating storage bucket: ${APP_IMAGES_BUCKET}`);
        const { error: createError } = await storageClient.createBucket(APP_IMAGES_BUCKET, {
          public: true // Make bucket publicly accessible
        });
        
        if (createError) {
          console.error('Error creating bucket:', createError);
          return;
        }
        
        console.log(`Created storage bucket: ${APP_IMAGES_BUCKET}`);
      }
    } catch (error) {
      console.error('Error initializing storage bucket:', error);
    }
  }
}

// Initialize bucket when this module is imported
initializeBucket().catch(console.error);

/**
 * Upload an image to Supabase Storage
 * @param file The file to upload
 * @param path The path within the bucket where the file should be stored
 * @returns The URL of the uploaded file
 */
export async function uploadImage(file: File, path: string): Promise<string> {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials');
  }

  if (!file) {
    throw new Error('No file provided for upload');
  }
  
  if (!path || path.trim() === '') {
    throw new Error('Invalid file path: Path cannot be empty');
  }
  
  // Ensure path is sanitized (no leading slashes)
  const sanitizedPath = path.startsWith('/') ? path.substring(1) : path;
  
  // Try the direct REST API method first
  try {
    console.log(`Trying direct upload for ${sanitizedPath}...`);
    const directUrl = await uploadFileDirect(file, sanitizedPath);
    
    if (directUrl) {
      console.log(`Direct upload successful for ${sanitizedPath}`);
      return directUrl;
    }
  } catch (directError) {
    console.warn('Direct upload failed, trying StorageClient:', directError);
  }
  
  // Fall back to the StorageClient
  try {
    // Verify the bucket exists before attempting upload
    await verifyBucketExists();
    
    const { data, error } = await storageClient
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

    // Return the public URL for the uploaded file
    return `${supabaseUrl}/storage/v1/object/public/${APP_IMAGES_BUCKET}/${data.path}`;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

/**
 * Verify the bucket exists, creating it if necessary
 */
async function verifyBucketExists(): Promise<void> {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials');
  }

  // Try the direct method first
  const bucketCreated = await createBucketIfNotExists();
  if (bucketCreated) {
    return;
  }

  // Fall back to the StorageClient
  const { data: buckets, error } = await storageClient.listBuckets();
  
  if (error) {
    console.error('Error listing buckets:', error);
    throw error;
  }
  
  const bucketExists = buckets?.find(b => b.name === APP_IMAGES_BUCKET);
  
  if (!bucketExists) {
    console.log(`Creating storage bucket: ${APP_IMAGES_BUCKET}`);
    const { error: createError } = await storageClient.createBucket(APP_IMAGES_BUCKET, {
      public: true
    });
    
    if (createError) {
      console.error('Error creating bucket:', createError);
      throw createError;
    }
    
    console.log(`Created storage bucket: ${APP_IMAGES_BUCKET}`);
  }
}

/**
 * Delete an image from Supabase Storage
 * @param path The path of the file to delete
 */
export async function deleteImage(path: string): Promise<void> {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials');
  }

  if (!path || path.trim() === '') {
    throw new Error('Invalid file path: Path cannot be empty');
  }
  
  try {
    const { error } = await storageClient
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

export { storageClient }; 