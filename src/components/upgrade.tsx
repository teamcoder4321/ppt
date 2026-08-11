/* 
Sitepaige Components v1.0.0
Sitepaige components are automatically added to your project the first time it is built, and are only added again if the "Build Components" button is 
checked in the system build settings. It is safe to modify this file without it being overwritten unless that setting is selected. 
*/

'use client';

import React from 'react';

interface UpgradeProps {
  featureName?: string;
}

export function Upgrade({ featureName = 'this feature' }: UpgradeProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <svg 
            className="mx-auto h-16 w-16 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
            />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Upgrade Required
        </h2>
        
        <p className="text-gray-600 mb-6">
          You need to upgrade your account to access {featureName}.
        </p>
        
        <button 
          className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200"
          onClick={() => window.location.href = '/pricing'}
        >
          View Upgrade Options
        </button>
        
        <p className="mt-4 text-sm text-gray-500">
          Questions? <a href="/contact" className="text-blue-600 hover:underline">Contact support</a>
        </p>
      </div>
    </div>
  );
}

export default Upgrade;
