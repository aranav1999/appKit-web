import { createClient } from '@supabase/supabase-js';

// This file should only be imported from server components or API routes
// It contains server-side environment variables that shouldn't be exposed to the client

// Debug environment variables
if (process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY) {
  console.log('NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY is defined (first 10 chars):', 
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY.substring(0, 10) + '...');
} else {
  console.warn('NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY is NOT defined, using anon key as fallback');
}

// Create a Supabase client with the service role key for admin access
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  // Use the correctly named environment variable
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Constants
export const APP_IMAGES_BUCKET = 'app-images';

export { supabaseAdmin }; 