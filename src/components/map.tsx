'use client';

import React from 'react';

interface MapProps {
  location?: string;
  name: string;
}

export default function Map({ location = '', name }: MapProps) {
  // Default to middle of Sahara Desert if no location provided
  const defaultLocation = 'Sahara Desert, Algeria';
  const mapLocation = location || defaultLocation;
  
  // Encode the location for use in Google Maps embed URL
  const encodedLocation = encodeURIComponent(mapLocation);
  
  return (
    <div className="w-full">
      <h1>{name}</h1>
      <div className="w-full h-full min-h-[400px] relative">
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0, minHeight: '400px' }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://maps.google.com/maps?q=${encodedLocation}&output=embed`}
        />
      </div>
    </div>
  );
}
