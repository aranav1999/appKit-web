import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import FormData from 'form-data';

async function main() {
  try {
    // Path to the image file
    const imagePath = path.resolve(process.cwd(), 'public/screenshots/Add NFT.png');
    
    console.log(`Testing upload with file: ${imagePath}`);
    console.log(`File exists: ${fs.existsSync(imagePath)}`);
    
    if (!fs.existsSync(imagePath)) {
      throw new Error(`File not found: ${imagePath}`);
    }
    
    // Read the file
    const fileBuffer = fs.readFileSync(imagePath);
    const fileName = path.basename(imagePath);
    const fileStats = fs.statSync(imagePath);
    
    console.log(`File size: ${fileStats.size} bytes`);
    console.log(`File name: ${fileName}`);
    
    // Create form data
    const formData = new FormData();
    formData.append('file', fileBuffer, {
      filename: fileName,
      contentType: 'image/png',
    });
    
    // Send the request to the diagnostic test-upload endpoint for detailed info
    console.log('Sending diagnostic upload request...');
    const testResponse = await fetch('http://localhost:3000/api/test-upload', {
      method: 'POST',
      body: formData as any,
    });
    
    const testResult = await testResponse.json();
    console.log('\n======= DIAGNOSTIC TEST RESULTS =======');
    console.log(JSON.stringify(testResult, null, 2));
    
    // Now test with the actual upload endpoint
    console.log('\n\nSending actual upload request...');
    const formData2 = new FormData();
    formData2.append('file', fileBuffer, {
      filename: fileName,
      contentType: 'image/png',
    });
    formData2.append('type', 'screenshot');
    
    const uploadResponse = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData2 as any,
    });
    
    const uploadResult = await uploadResponse.json();
    console.log('\n======= ACTUAL UPLOAD RESULTS =======');
    console.log(JSON.stringify(uploadResult, null, 2));
    
    // If upload was successful, try to fetch the image to verify
    if (uploadResult.url) {
      console.log('\nAttempting to verify the uploaded file is accessible...');
      try {
        const verifyResponse = await fetch(uploadResult.url, {
          method: 'HEAD'
        });
        console.log(`File accessible: ${verifyResponse.ok} (Status: ${verifyResponse.status})`);
      } catch (verifyError) {
        console.error('Error verifying file accessibility:', verifyError);
      }
    }
    
    return { test: testResult, upload: uploadResult };
  } catch (error) {
    console.error('Error in test upload:', error);
  }
}

main().catch(console.error); 