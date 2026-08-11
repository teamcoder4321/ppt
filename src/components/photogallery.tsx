'use client';

import React from 'react';

export interface PhotoGalleryData {
  photos: Array<{
    fileName: string; // Required: filename in library/images
    label?: string; // Optional label/caption
  }>;
  gridConfig?: {
    columns?: number;
    rows?: number;
    gap?: number;
  };
}

export default function RPhotoGallery({ 
  config,
  name 
}: { 
  config: string | PhotoGalleryData;
  name: string;
}) {
  // Parse the gallery data
  let galleryData: PhotoGalleryData;
  
  try {
    if (typeof config === 'string') {
      galleryData = config ? JSON.parse(config) : { photos: [], gridConfig: { columns: 3, gap: 16 } };
    } else {
      galleryData = config;
    }
  } catch (e) {
    console.error('Error parsing photo gallery data:', e);
    galleryData = { photos: [], gridConfig: { columns: 3, gap: 16 } };
  }

  const { photos = [], gridConfig = {} } = galleryData;
  
  // Default grid config
  const columns = gridConfig.columns || 3;
  const gap = gridConfig.gap || 16;
  const rows = gridConfig.rows;
  
  // If no photos, show placeholder
  if (!photos || photos.length === 0) {
    return (
      <div className="w-full">
        <h1>{name}</h1>
        <div className="p-8 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-gray-400">
            <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm font-medium">No photos in gallery</p>
            <p className="text-xs mt-1">Add photos in the editor</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1>{name}</h1>
      <div 
        className="grid w-full"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap: `${gap}px`,
          ...(rows && {
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`
          })
        }}
      >
        {photos.map((photo, index) => (
          <div key={index} className="relative group">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={`/library/images/${photo.fileName}`}
                alt={photo.label || `Photo ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  console.error('Error loading image:', photo.fileName);
                  (e.target as HTMLImageElement).src = '/placeholder.png';
                }}
              />
            </div>
            {photo.label && (
              <p className="mt-2 text-sm text-center text-gray-700 font-medium">
                {photo.label}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
