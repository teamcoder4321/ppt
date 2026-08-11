'use client';

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface IntegrationProps {
  componentCode: string;
  projectId: string;
  title?: string;
  viewId: string;
  projectClean: boolean;
  blueprint: any;
  onCreditsChanged?: (credits: number) => void;
  fetchProject: (projectId: string, historyId?: string | null) => Promise<void>;
  isInsideContainer?: boolean;
}

export default function IntegrationComponent({ 
  componentCode, 
  projectId, 
  title = "Generate Integration", 
  viewId, 
  projectClean, 
  blueprint,
  onCreditsChanged,
  fetchProject,
  isInsideContainer = false 
}: IntegrationProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notEnoughCredits, setNotEnoughCredits] = useState(false);
  const [integrationCode, setIntegrationCode] = useState<string | null>(null);
  const [editedPrompt, setEditedPrompt] = useState(componentCode);

  // Check if integration code exists for this view
  useEffect(() => {
    const codeData = blueprint?.code;
    if (codeData?.views) {
      const viewCode = codeData.views.find((v: any) => v.viewID === viewId);
      if (viewCode?.code) {
        setIntegrationCode(viewCode.code);
      }
    }
  }, [blueprint, viewId]);

  const handleGenerateIntegration = async () => {
    if (!projectClean) {
      setError("Please save your project before generating integrations.");
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    setNotEnoughCredits(false);
    
    try {
      const response = await fetch('/api/generateintegration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          description: editedPrompt || 'Create integration code',
          projectId: projectId,
          viewId: viewId
        }),
      });
      
      if (response.status === 402) {
        const errorData = await response.json();
        setError(errorData.error || 'Not enough credits');
        setNotEnoughCredits(true);
        return;
      }
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const result = await response.json();
      setIntegrationCode(result.code);
      fetchProject(projectId);
      if (onCreditsChanged) {
        onCreditsChanged(result.creditsUsed || 1);
      }
    
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  // If inside a container, don't show any visual UI
  if (isInsideContainer) {
    return null;
  }

  // If integration code exists, show a simple indicator
  if (integrationCode) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-700 font-medium">
              Integration: {title || 'Service Integration'}
            </span>
          </div>
          <button
            onClick={handleGenerateIntegration}
            disabled={isGenerating}
            className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="inline w-3 h-3 mr-1 animate-spin" />
                Regenerating...
              </>
            ) : (
              'Regenerate'
            )}
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-600">
          {editedPrompt || 'Integration code is active and running in the background'}
        </p>
      </div>
    );
  }

  // If no integration code, show generate button
  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Integration Required: {title || 'Service Integration'}
          </span>
          <span className="text-xs text-gray-500">Cost: 1 credit</span>
        </div>
        
        <div>
          <label className="block text-xs text-gray-600 mb-1">Integration Description/Prompt:</label>
          <textarea
            value={editedPrompt}
            onChange={(e) => setEditedPrompt(e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            rows={2}
            placeholder="Describe what service to integrate with..."
          />
        </div>

        {error && (
          <div className="p-2 bg-red-50 border border-red-200 rounded">
            <p className="text-sm text-red-600">{error}</p>
            {notEnoughCredits && (
              <a 
                href="/pricing" 
                className="text-sm text-blue-600 hover:text-blue-800 underline mt-1 inline-block"
              >
                Get more credits
              </a>
            )}
          </div>
        )}

        <button
          onClick={handleGenerateIntegration}
          disabled={isGenerating || !editedPrompt?.trim()}
          className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="inline w-4 h-4 mr-2 animate-spin" />
              Generating Integration...
            </>
          ) : (
            'Generate Integration Code'
          )}
        </button>
      </div>
    </div>
  );
}
