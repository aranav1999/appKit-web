import { google } from 'googleapis';
import type { JWT } from 'google-auth-library';
import { App } from '../db/schema';

// Define the structure for app data in sheets
interface SheetAppData {
  id: number;
  name: string;
  description: string;
  category: string;
  isShown: boolean; // Yes/No in the sheet, converted to boolean
  websiteUrl: string;
  androidUrl: string;
  iosUrl: string;
  tags: string;
  iconUrl: string;
  featureBannerUrl: string;
  projectTwitter: string;
  submitterTwitter: string;
  createdAt: string;
}

let auth: JWT | null = null;

// Initialize the Google Sheets API client
async function getAuthClient() {
  if (auth) return auth;

  try {
    // Create a client using service account credentials
    auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    await auth.authorize();
    return auth;
  } catch (error) {
    console.error('Error initializing Google Sheets auth:', error);
    throw error;
  }
}

// Get the Sheets API instance
async function getSheetsApi() {
  const auth = await getAuthClient();
  return google.sheets({ version: 'v4', auth });
}

// Add a new app to the sheet
export async function addAppToSheet(app: App): Promise<void> {
  try {
    const sheets = await getSheetsApi();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    
    if (!spreadsheetId) {
      throw new Error('Google Sheet ID not configured');
    }

    // Format the tags as a comma-separated string
    const tagsString = Array.isArray(app.tags) ? app.tags.join(', ') : '';
    
    // Prepare the row data
    const values = [
      [
        app.id,
        app.name,
        app.description || '',
        app.category || '',
        'No', // Default to Not Shown
        app.websiteUrl || '',
        app.androidUrl || '',
        app.iosUrl || '',
        tagsString,
        app.iconUrl || '',
        app.featureBannerUrl || '',
        app.projectTwitter || '',
        app.submitterTwitter || '',
        app.createdAt ? new Date(app.createdAt).toISOString() : new Date().toISOString(),
      ],
    ];

    // Append to the sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Apps!A:N', // Adjust range based on your sheet structure
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    });

    console.log(`Added app ${app.id} to sheet successfully`);
  } catch (error) {
    console.error('Error adding app to sheet:', error);
    throw error;
  }
}

// Fetch all apps from the sheet
export async function getAppsFromSheet(): Promise<App[]> {
  try {
    const sheets = await getSheetsApi();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    
    if (!spreadsheetId) {
      throw new Error('Google Sheet ID not configured');
    }

    // Get all data from the sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Apps!A2:N', // Skip header row
    });

    const rows = response.data.values || [];
    
    // Map sheet rows to App objects
    return rows.map((row) => {
      // Check if the isShown field (4th column, index 4) is "Yes"
      const isShown = row[4] === 'Yes';
      
      // Parse tags from comma-separated string to array
      const tagsString = row[8] || '';
      const tags = tagsString.split(',').map((tag: string) => tag.trim()).filter(Boolean);
      
      return {
        id: parseInt(row[0], 10),
        name: row[1],
        description: row[2],
        category: row[3],
        isShown,
        websiteUrl: row[5],
        androidUrl: row[6],
        iosUrl: row[7],
        tags,
        iconUrl: row[9],
        featureBannerUrl: row[10],
        projectTwitter: row[11],
        submitterTwitter: row[12],
        createdAt: new Date(row[13]),
        updatedAt: new Date(),
      } as App;
    });
  } catch (error) {
    console.error('Error fetching apps from sheet:', error);
    throw error;
  }
}

// Fetch only approved apps (isShown = "Yes") from the sheet
export async function getApprovedAppsFromSheet(): Promise<App[]> {
  const allApps = await getAppsFromSheet();
  return allApps.filter(app => app.isShown);
}

// Update the isShown status for an app in the sheet
export async function updateAppShownStatus(appId: number, isShown: boolean): Promise<void> {
  try {
    const sheets = await getSheetsApi();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    
    if (!spreadsheetId) {
      throw new Error('Google Sheet ID not configured');
    }

    // First, find the row with the app ID
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Apps!A2:A', // Just get the ID column
    });

    const rows = response.data.values || [];
    const rowIndex = rows.findIndex(row => parseInt(row[0], 10) === appId);
    
    if (rowIndex === -1) {
      throw new Error(`App with ID ${appId} not found in sheet`);
    }

    // Update the isShown column (column E, index 4) for that row
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Apps!E${rowIndex + 2}`, // +2 because we start from row 2 and indexes are 0-based
      valueInputOption: 'RAW',
      requestBody: {
        values: [[isShown ? 'Yes' : 'No']],
      },
    });

    console.log(`Updated isShown status for app ${appId} to ${isShown}`);
  } catch (error) {
    console.error('Error updating app shown status:', error);
    throw error;
  }
} 