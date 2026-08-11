'use client';

import React, { useState } from 'react';

export interface VideoGalleryData {
  videos: Array<{
    type: 'upload' | 'youtube' | 'vimeo' | 'external';
    fileName?: string; // For uploaded videos - filename in library/videos
    url?: string; // For YouTube/Vimeo/external videos
    title?: string;
    description?: string;
    thumbnailFileName?: string; // Optional thumbnail filename in library/videos
  }>;
  gridConfig?: {
    columns?: number;
    gap?: number;
  };
  playerConfig?: {
    autoplay?: boolean;
    muted?: boolean;
    controls?: boolean;
    loop?: boolean;
  };
  displayConfig?: {
    showTitle?: boolean;
    showDescription?: boolean;
  };
}

export default function RVideoGallery({ 
  config,
  name 
}: { 
  config: string | VideoGalleryData;
  name: string;
}) {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  
  // Parse the gallery data
  let galleryData: VideoGalleryData;
  
  try {
    if (typeof config === 'string') {
      galleryData = config ? JSON.parse(config) : { 
        videos: [], 
        gridConfig: { columns: 2, gap: 16 },
        playerConfig: { autoplay: false, muted: false, controls: true, loop: false }
      };
    } else {
      galleryData = config;
    }
  } catch (e) {
    console.error('Error parsing video gallery data:', e);
    galleryData = { 
      videos: [], 
      gridConfig: { columns: 2, gap: 16 },
      playerConfig: { autoplay: false, muted: false, controls: true, loop: false }
    };
  }

  const { 
    videos = [], 
    gridConfig = {}, 
    playerConfig = {},
    displayConfig = {}
  } = galleryData;
  
  // Default config values
  const columns = gridConfig.columns || 2;
  const gap = gridConfig.gap || 16;
  const autoplay = playerConfig.autoplay ?? false;
  const muted = playerConfig.muted ?? false;
  const controls = playerConfig.controls ?? true;
  const loop = playerConfig.loop ?? false;
  const showTitle = displayConfig.showTitle ?? true;
  const showDescription = displayConfig.showDescription ?? true;
  
  // If no videos, show placeholder
  if (!videos || videos.length === 0) {
    return (
      <div className="w-full">
        <h1>{name}</h1>
        <div className="p-8 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-gray-400">
            <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="text-sm font-medium">No videos in gallery</p>
            <p className="text-xs mt-1">Add videos in the editor</p>
          </div>
        </div>
      </div>
    );
  }
  
  const renderVideo = (video: VideoGalleryData['videos'][0], index: number) => {
    const videoKey = `${video.type}-${index}`;
    const isPlaying = playingVideo === videoKey;
    
    if (video.type === 'youtube' && video.url) {
      // Extract YouTube video ID
      const videoId = extractYouTubeId(video.url);
      if (!videoId) return null;
      
      return (
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          {isPlaying ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1${autoplay ? '&mute=1' : ''}${loop ? '&loop=1&playlist=' + videoId : ''}${controls ? '' : '&controls=0'}`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div 
              className="relative w-full h-full cursor-pointer group"
              onClick={() => setPlayingVideo(videoKey)}
            >
              <img
                src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                alt={video.title || 'Video'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to lower quality thumbnail
                  (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-all">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    } else if (video.type === 'vimeo' && video.url) {
      // Extract Vimeo video ID
      const videoId = extractVimeoId(video.url);
      if (!videoId) return null;
      
      return (
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          {isPlaying ? (
            <iframe
              src={`https://player.vimeo.com/video/${videoId}?autoplay=1${muted ? '&muted=1' : ''}${loop ? '&loop=1' : ''}${!controls ? '&controls=0' : ''}`}
              className="w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div 
              className="relative w-full h-full cursor-pointer group"
              onClick={() => setPlayingVideo(videoKey)}
            >
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                  <p className="text-white text-sm">Click to play</p>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    } else if (video.type === 'upload' && video.fileName) {
      // Uploaded video
      const videoSrc = `/library/videos/${video.fileName}`;
      const posterSrc = video.thumbnailFileName ? `/library/videos/${video.thumbnailFileName}` : undefined;
      
      return (
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <video
            src={videoSrc}
            poster={posterSrc}
            controls={controls}
            autoPlay={autoplay}
            muted={autoplay || muted}
            loop={loop}
            className="w-full h-full object-contain"
            onError={(e) => {
              console.error('Error loading video:', video.fileName);
            }}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    } else if (video.type === 'external' && video.url) {
      // External video URL
      return (
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <video
            src={video.url}
            controls={controls}
            autoPlay={autoplay}
            muted={autoplay || muted}
            loop={loop}
            className="w-full h-full object-contain"
            onError={(e) => {
              console.error('Error loading video:', video.url);
            }}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="w-full">
      <h1>{name}</h1>
      <div 
        className="grid w-full"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap: `${gap}px`
        }}
      >
        {videos.map((video, index) => (
          <div key={index} className="relative">
            {renderVideo(video, index)}
            {showTitle && video.title && (
              <h3 className="mt-2 text-lg font-semibold text-gray-800 text-center">
                {video.title}
              </h3>
            )}
            {showDescription && video.description && (
              <p className="mt-1 text-sm text-gray-600 text-center">
                {video.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper functions to extract video IDs
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }
  
  return null;
}

function extractVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}
