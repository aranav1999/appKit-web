'use client';
import React, { useState } from 'react';
import { uploadFile } from '@/lib/api-client';

export default function TestUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{url: string; path: string; type: string} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString().split('T')[1].slice(0, 8)}: ${message}`]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      addLog(`File selected: ${selectedFile.name} (${selectedFile.size} bytes)`);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError(null);
    setUploadResult(null);
    
    try {
      addLog(`Starting upload for ${file.name}...`);
      const type = document.querySelector<HTMLSelectElement>('#fileType')?.value as 'icon' | 'banner' | 'screenshot';
      addLog(`Upload type: ${type}`);
      
      const result = await uploadFile(file, type);
      addLog(`Upload successful: ${result.url}`);
      setUploadResult(result);
    } catch (err) {
      console.error('Upload error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      addLog(`Error: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Upload Test Page</h1>
      
      <div className="mb-6 p-3 bg-yellow-50 border border-yellow-300 rounded text-sm">
        <p className="mb-2 font-medium">⚠️ Supabase Storage Issue</p>
        <p>There appears to be an issue with the Supabase Storage bucket configuration.</p>
        <p className="mt-2">This page is using a <span className="font-semibold">local file storage implementation</span> that saves files to the <code className="bg-gray-100 px-1">public/uploads</code> directory.</p>
      </div>
      
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">Select file type:</label>
        <select 
          id="fileType" 
          className="w-full p-2 border border-gray-300 rounded-md"
          defaultValue="icon"
        >
          <option value="icon">Icon</option>
          <option value="banner">Banner</option>
          <option value="screenshot">Screenshot</option>
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">Choose file:</label>
        <input 
          type="file" 
          onChange={handleFileChange}
          className="w-full p-2 border border-gray-300 rounded-md" 
        />
      </div>
      
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className={`w-full p-2 rounded-md text-white ${
          !file || uploading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {uploading ? 'Uploading...' : 'Upload File'}
      </button>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <p className="font-medium">Error:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {uploadResult && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
          <p className="font-medium">Upload successful!</p>
          <div className="mt-2 space-y-1 text-sm break-all">
            <p><span className="font-medium">URL:</span> {uploadResult.url}</p>
            <p><span className="font-medium">Path:</span> {uploadResult.path}</p>
            <p><span className="font-medium">Type:</span> {uploadResult.type}</p>
          </div>
          {uploadResult.url && (
            <div className="mt-3">
              <p className="font-medium">Preview:</p>
              <img 
                src={uploadResult.url} 
                alt="Uploaded file preview" 
                className="mt-2 max-h-48 border border-gray-200 rounded" 
              />
            </div>
          )}
        </div>
      )}
      
      <div className="mt-6">
        <h2 className="font-medium mb-2">Logs:</h2>
        <div className="bg-gray-100 p-3 rounded-md h-40 overflow-y-auto text-sm font-mono">
          {logs.length === 0 ? (
            <p className="text-gray-500">No logs yet</p>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="mb-1">
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 