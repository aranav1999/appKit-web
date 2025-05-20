'use client';
import { useState, useEffect } from 'react';

export default function SupabaseStatus() {
  const [status, setStatus] = useState<{
    hasUrl: boolean;
    hasKey: boolean;
    url?: string;
    timestamp: number;
    bucketExists?: boolean;
    bucketError?: string;
    clientOk?: boolean;
    clientError?: string;
  }>({
    hasUrl: false,
    hasKey: false,
    timestamp: Date.now()
  });
  
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/supabase-status');
        const data = await response.json();
        setStatus(data);
      } catch (error) {
        console.error('Error checking Supabase status:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkStatus();
  }, []);
  
  return (
    <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h2 className="text-lg font-medium mb-3">Supabase Storage Status</h2>
      
      {loading ? (
        <div className="flex items-center justify-center h-20">
          <svg className="animate-spin h-5 w-5 text-gray-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading status...</span>
        </div>
      ) : (
        <div className="space-y-2 text-sm">
          <div className="flex">
            <span className="font-medium w-40">Supabase URL:</span>
            <span className={status.hasUrl ? 'text-green-600' : 'text-red-600'}>
              {status.hasUrl ? (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Configured
                </span>
              ) : 'Not configured'}
            </span>
          </div>
          
          <div className="flex">
            <span className="font-medium w-40">Supabase API Key:</span>
            <span className={status.hasKey ? 'text-green-600' : 'text-red-600'}>
              {status.hasKey ? (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Configured
                </span>
              ) : 'Not configured'}
            </span>
          </div>
          
          <div className="flex">
            <span className="font-medium w-40">Storage Bucket:</span>
            <span className={status.bucketExists ? 'text-green-600' : 'text-red-600'}>
              {status.bucketExists ? (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Exists
                </span>
              ) : 'Not found'}
            </span>
          </div>
          
          {status.bucketError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-2 mt-2">
              <p className="text-red-700">{status.bucketError}</p>
            </div>
          )}
          
          <div className="flex">
            <span className="font-medium w-40">Client Connection:</span>
            <span className={status.clientOk ? 'text-green-600' : 'text-red-600'}>
              {status.clientOk ? (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  OK
                </span>
              ) : 'Error'}
            </span>
          </div>
          
          {status.clientError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-2 mt-2">
              <p className="text-red-700">{status.clientError}</p>
            </div>
          )}
          
          <div className="text-xs text-gray-500 mt-3">
            Last checked: {new Date(status.timestamp).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
} 