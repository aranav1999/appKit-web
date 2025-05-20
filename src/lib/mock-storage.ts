import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads');

// Ensure the uploads directory exists
async function ensureUploadsDir() {
  try {
    await fsPromises.mkdir(UPLOADS_DIR, { recursive: true });
    
    // Create subdirectories
    await fsPromises.mkdir(path.join(UPLOADS_DIR, 'icons'), { recursive: true });
    await fsPromises.mkdir(path.join(UPLOADS_DIR, 'banners'), { recursive: true });
    await fsPromises.mkdir(path.join(UPLOADS_DIR, 'screenshots'), { recursive: true });
    
    return true;
  } catch (error) {
    console.error('Error creating uploads directory:', error);
    return false;
  }
}

/**
 * Upload a file to the local filesystem
 * @param file The file to upload
 * @param filePath The path within the uploads directory
 * @returns The URL to access the file
 */
export async function uploadFile(file: File, filePath: string): Promise<string> {
  try {
    // Initialize upload directories
    await ensureUploadsDir();
    
    // Strip any leading slashes from the filePath
    const sanitizedPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
    
    // Get file buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Create full path
    const fullPath = path.join(UPLOADS_DIR, sanitizedPath);
    
    // Ensure the directory exists
    const dir = path.dirname(fullPath);
    await fsPromises.mkdir(dir, { recursive: true });
    
    // Write the file
    await fsPromises.writeFile(fullPath, buffer);
    
    // Return the URL to access the file
    // This will be /uploads/path/to/file.ext
    return `/uploads/${sanitizedPath}`;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
}

/**
 * Delete a file from the local filesystem
 * @param filePath The path of the file to delete
 */
export async function deleteFile(filePath: string): Promise<void> {
  try {
    // Strip any leading slashes from the filePath and '/uploads'
    let sanitizedPath = filePath;
    if (sanitizedPath.startsWith('/uploads/')) {
      sanitizedPath = sanitizedPath.substring('/uploads/'.length);
    } else if (sanitizedPath.startsWith('/')) {
      sanitizedPath = sanitizedPath.substring(1);
    }
    
    const fullPath = path.join(UPLOADS_DIR, sanitizedPath);
    
    // Check if file exists
    const exists = await fsPromises.access(fullPath)
      .then(() => true)
      .catch(() => false);
    
    if (!exists) {
      console.warn(`File not found: ${fullPath}`);
      return;
    }
    
    // Delete the file
    await fsPromises.unlink(fullPath);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
} 