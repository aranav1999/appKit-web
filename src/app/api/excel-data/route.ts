import { NextResponse } from "next/server";

async function fetchWithRetry(url: string, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Attempt ${i + 1}: Fetching ${url}`);
      const response = await fetch(url, {
        ...options,
        cache: 'no-store', // Prevent caching
        signal: AbortSignal.timeout(30000) // 30-second timeout
      });
      
      console.log(`Attempt ${i + 1}: Status ${response.status}, StatusText: ${response.statusText}`);
      
      if (response.ok) {
        return response;
      }
      
      console.log(`Attempt ${i + 1} failed with status: ${response.status}`);
      // Try to get more error details if available
      try {
        const errorBody = await response.text();
        console.log(`Error body (first 500 chars): ${errorBody.substring(0,500)}`);
      } catch (e) {
        console.log("Could not read error body.");
      }

      if (i < retries - 1) {
        const delay = 1000 * (i + 1);
        console.log(`Waiting ${delay}ms before next attempt...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    } catch (error) {
      console.log(`Attempt ${i + 1} fetch error:`, error);
      if (i === retries - 1) throw error;
      
      const delay = 1000 * (i + 1);
      console.log(`Error occurred. Waiting ${delay}ms before next attempt...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error(`Failed after ${retries} retries`);
}

export async function GET() {
  try {
    const sheetId = "1kQkfCLU-eghBgO3ZpTRVfH_6ByCeG7U1aii-pNxJi88";
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
    
    console.log("Attempting to fetch CSV:", csvUrl);
    
    const response = await fetchWithRetry(csvUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/csv',
        // Sometimes a User-Agent helps, but the 401 suggests a permission issue primarily
        'User-Agent': 'Mozilla/5.0 (Node.js Fetch)/1.0'
      },
    });

    const text = await response.text();
    console.log("CSV response received, length:", text.length);
    
    if (!text || text.trim().length === 0) {
      throw new Error("Received empty or whitespace-only response from Google Sheets CSV export.");
    }
    
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length <= 1 && lines[0]?.split(',').length < 2) { // Check if it's more than just a header with few columns
      console.log("Warning: CSV appears to contain only a header or is effectively empty. Lines:", lines);
      // It might be an HTML error page if the sheet is not truly public
      if (text.toLowerCase().includes("<html")) {
        console.error("Response seems to be an HTML page, not CSV. Check sheet publishing settings.");
        throw new Error("Failed to fetch CSV; received HTML. Ensure sheet is correctly published to web as CSV and allows anonymous access.");
      }
      return NextResponse.json([]); // Return empty if only header or malformed
    }
    
    const headerLine = lines[0];
    const dataLines = lines.slice(1);
    console.log(`Found header: ${headerLine}`);
    console.log(`Found ${dataLines.length} data lines in CSV`);
    
    const protocols = dataLines.map(line => {
      const parts = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
      const columns = parts.map(p => p.replace(/^"|"$/g, '').trim());
      return {
        name: columns[0] || "",
        imageUrl: columns[1] || "",
        link: columns[2] || ""
      };
    }).filter(protocol => protocol.name && protocol.imageUrl);
    
    console.log(`Successfully processed ${protocols.length} protocols`);
    return NextResponse.json(protocols);

  } catch (error) {
    console.error("FINAL CATCH: Error fetching protocols:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch protocols from Google Sheet",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic"; 