# Google Sheets Integration for App Approvals

This module provides integration with Google Sheets to manage the approval process for submitted apps.

## Setup Instructions

1. **Create a Google Sheet** with the following columns in this order:
   - id
   - name
   - description
   - category
   - isShown (use "Yes" or "No" values)
   - websiteUrl
   - androidUrl
   - iosUrl
   - tags (comma-separated)
   - iconUrl
   - featureBannerUrl
   - projectTwitter
   - submitterTwitter
   - createdAt

2. **Create a Google Service Account**:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Google Sheets API
   - Go to "Credentials" and create a service account
   - Download the JSON key for the service account
   - Share your Google Sheet with the service account email (with editor permissions)

3. **Add the following environment variables** to your `.env.local` file:
   ```
   USE_SHEETS_FOR_APPS=true
   GOOGLE_SHEET_ID=your-google-sheet-id
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account-email@example.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key content here\n-----END PRIVATE KEY-----\n"
   ```

   The Sheet ID can be found in the URL of your Google Sheet:
   `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit`

## How It Works

1. When a new app is submitted, it's added to both the database and the Google Sheet
2. The app is set to hidden by default (isShown = false in DB, "No" in the sheet)
3. Admins can review submitted apps in the Google Sheet and change the isShown column to "Yes" to approve them
4. Only apps with isShown = "Yes" will appear on the public apps page
5. Admins can also use the `/admin/apps` page to manage app visibility directly in the application

## Automatic Schema Updates

The system is designed to work even if the database schema doesn't have the `isShown` column yet:

1. A middleware automatically checks for and adds the `isShown` column at startup if it doesn't exist
2. The API endpoints have fallback logic to handle missing columns gracefully
3. When submitting a new app, the system will try to set `isShown` but won't fail if the column doesn't exist

This makes the deployment safer as database migrations don't need to be run immediately.

## Notes

- If the Google Sheets integration is disabled (USE_SHEETS_FOR_APPS=false), the system will fall back to using only the database
- The sheet synchronization is one-way: changes in the database will update the sheet, but not vice versa (except for the isShown status)
- Always make sure the service account has editor permissions on the Google Sheet 