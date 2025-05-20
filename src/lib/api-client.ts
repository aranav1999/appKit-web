import { App, Category, Screenshot, NewApp } from './db/schema';

/**
 * Fetch all apps from the API
 */
export async function fetchApps(): Promise<App[]> {
  try {
    const response = await fetch('/api/apps');
    if (!response.ok) {
      throw new Error(`Error fetching apps: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching apps:', error);
    throw error;
  }
}

/**
 * Fetch a single app by ID
 */
export async function fetchApp(id: number): Promise<App & { screenshots: Screenshot[] }> {
  try {
    const response = await fetch(`/api/apps/${id}`);
    if (!response.ok) {
      throw new Error(`Error fetching app: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Error fetching app ${id}:`, error);
    throw error;
  }
}

/**
 * Fetch all categories from the API
 */
export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch('/api/categories');
    if (!response.ok) {
      throw new Error(`Error fetching categories: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

/**
 * Create a new app
 */
export async function createApp(app: FormData): Promise<App> {
  try {
    const response = await fetch('/api/apps', {
      method: 'POST',
      body: app,
    });
    
    if (!response.ok) {
      throw new Error(`Error creating app: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error creating app:', error);
    throw error;
  }
}

/**
 * Upload a screenshot for an app
 */
export async function uploadScreenshot(appId: number, imageFile: File, sortOrder: number = 0): Promise<Screenshot> {
  try {
    const formData = new FormData();
    formData.append('appId', appId.toString());
    formData.append('image', imageFile);
    formData.append('sortOrder', sortOrder.toString());
    
    const response = await fetch('/api/screenshots', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Error uploading screenshot: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error uploading screenshot:', error);
    throw error;
  }
}

/**
 * Update an existing app
 */
export async function updateApp(id: number, app: FormData): Promise<App> {
  try {
    const response = await fetch(`/api/apps/${id}`, {
      method: 'PATCH',
      body: app,
    });
    
    if (!response.ok) {
      throw new Error(`Error updating app: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error updating app ${id}:`, error);
    throw error;
  }
}

/**
 * Delete an app
 */
export async function deleteApp(id: number): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`/api/apps/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Error deleting app: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error deleting app ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a screenshot
 */
export async function deleteScreenshot(id: number): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`/api/screenshots/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Error deleting screenshot: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error deleting screenshot ${id}:`, error);
    throw error;
  }
}

/**
 * Upload a file immediately (for better UX)
 */
export async function uploadFile(file: File, type: 'icon' | 'banner' | 'screenshot' = 'icon'): Promise<{ url: string; path: string; type: string }> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.details || `Error uploading file: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
} 