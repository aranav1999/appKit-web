import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Schema initialization (runs once at startup)
import { ensureSchema } from './lib/db/ensure-schema';

// Keep track of whether we've initialized yet
let initialized = false;

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // Run the schema check only once during initialization
  if (!initialized) {
    console.log('🚀 Running initial schema check...');
    try {
      await ensureSchema();
      initialized = true;
      console.log('✅ Schema check completed successfully');
    } catch (error) {
      console.error('❌ Schema check failed:', error);
      // Still mark as initialized to avoid repeated failures
      initialized = true;
    }
  }
  
  // Continue with the request
  return NextResponse.next();
}

// Run on specific paths (to avoid running too often)
export const config = {
  matcher: '/api/:path*',
} 