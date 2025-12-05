'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SlideshowProps {
  imageIds: string | string[];
  height?: number;
  projectId: string;
  slideType?: 'automatic' | 'manual';
  slideTime?: 5 | 10 | 15; // in seconds
  animationType?: 'slide' | 'fade';
  textColor?: string;
}

export default function Slideshow({ 
  imageIds, 
  height, 
  projectId,
  slideType = 'automatic',
  slideTime = 10,
  animationType = 'slide',
  textColor = '#000000'
}: SlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoadErrors, setImageLoadErrors] = useState<{[key: string]: boolean}>({});

  // Parse the image IDs
  useEffect(() => {
    let parsedImages: string[] = [];
    
    if (typeof imageIds === 'string') {
      try {
        parsedImages = JSON.parse(imageIds);
      } catch {
        parsedImages = [];
      }
    } else if (Array.isArray(imageIds)) {
      parsedImages = imageIds;
    }
    
    setImages(parsedImages);
    
    // Reset to first image if current index is out of bounds
    if (currentIndex >= parsedImages.length && parsedImages.length > 0) {
      setCurrentIndex(0);
    }
  }, [imageIds, currentIndex]);

  // Auto-advance slideshow
  useEffect(() => {
    if (images.length <= 1 || isHovered || slideType === 'manual') return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, slideTime * 1000);
    
    return () => clearInterval(interval);
  }, [images.length, slideTime, isHovered, slideType]);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % images.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (!images || images.length === 0) {
    return (
      <div 
        className="relative h-full w-full flex items-center justify-center bg-black rounded-lg"
        style={{ minHeight: height || 400 }}
      >
        <p className="text-gray-400">No images in slideshow</p>
      </div>
    );
  }

  const currentImageId = images[currentIndex];
  const hasError = imageLoadErrors[currentImageId];

  // Helper function to get image source URL
  const getImageSrc = (imageId: string) => {
    // Default to .jpg since all current images are JPG
    return `/images/${imageId}.jpg`;
  };

  return (
    <div 
      className="relative h-full w-full overflow-hidden rounded-lg bg-black"
      style={{ minHeight: height || 400 }}
    >
      {/* Main image display */}
      <div 
        className="relative w-full h-full flex items-center justify-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {animationType === 'fade' ? (
          // Fade animation - render all images with opacity transitions
          images.map((imageId, index) => (
            <div
              key={imageId}
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 pointer-events-none ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {imageLoadErrors[imageId] ? (
                <div className="flex items-center justify-center w-full h-full bg-gray-200">
                  <p className="text-gray-500">Failed to load image</p>
                </div>
              ) : (
                <img
                  src={getImageSrc(imageId)}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover pointer-events-none"
                  onError={() => {
                    setImageLoadErrors(prev => ({ ...prev, [imageId]: true }));
                  }}
                />
              )}
            </div>
          ))
        ) : (
          // Slide animation - only render current image
          hasError ? (
            <div className="flex items-center justify-center w-full h-full bg-gray-200">
              <p className="text-gray-500">Failed to load image</p>
            </div>
          ) : (
            <img
              src={getImageSrc(currentImageId)}
              alt={`Slide ${currentIndex + 1}`}
              className="w-full h-full object-cover pointer-events-none"
              onError={() => {
                setImageLoadErrors(prev => ({ ...prev, [currentImageId]: true }));
              }}
            />
          )
        )}
        
        {/* Gradient overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

        {/* Navigation arrows - only show if more than one image */}
        {images.length > 1 && isHovered && (
          <>
            <button
              onClick={handlePrevious}
              className={`absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 backdrop-blur-sm border-2 border-white text-white transition-all duration-200 transform hover:scale-110 ${
                isHovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button
              onClick={handleNext}
              className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 backdrop-blur-sm border-2 border-white text-white transition-all duration-200 transform hover:scale-110 ${
                isHovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
      
      {/* Slide indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? '!bg-white w-8' 
                  : '!bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
