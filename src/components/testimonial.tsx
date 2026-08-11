'use client';

import React from 'react';
import { Design } from '../store/blueprint';

interface RTestimonialProps {
  name: string;
  custom_view_description: string;
  design: Design;
}

interface Testimonial {
  id: string;
  text: string;
  attribution: string;
  rating: number | null;
  photoId: string | null;
}

interface TestimonialData {
  testimonials: Testimonial[];
}

export default function RTestimonial({ name, custom_view_description, design }: RTestimonialProps) {
  // Parse testimonial data
  let testimonialData: TestimonialData = {
    testimonials: []
  };

  try {
    if (custom_view_description) {
      testimonialData = JSON.parse(custom_view_description);
    }
  } catch (e) {
    console.error('Error parsing testimonial data:', e);
  }

  // Don't render if no testimonials
  if (!testimonialData.testimonials || testimonialData.testimonials.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <h1>{name}</h1>
        <p>No testimonials to display.</p>
      </div>
    );
  }

  // Render star rating
  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 
          className="text-3xl font-bold text-center mb-12"
          style={{
            color: design.titleColor || design.accentColor,
            fontFamily: design.titleFont || 'inherit'
          }}
        >
          {name}
        </h1>
        
        <div className={`grid gap-8 ${testimonialData.testimonials.length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' : testimonialData.testimonials.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
          {testimonialData.testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id || index}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              style={{
                borderTop: `4px solid ${design.accentColor || '#516ab8'}`
              }}
            >
              <div className="mb-4">
                {testimonial.rating && (
                  <div className="mb-3">
                    {renderStars(testimonial.rating)}
                  </div>
                )}
                
                <blockquote className="text-gray-700 italic mb-4" style={{ fontFamily: design.textFont || 'inherit' }}>
                  <svg
                    className="w-8 h-8 text-gray-200 mb-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-base leading-relaxed">
                    {testimonial.text}
                  </p>
                </blockquote>
              </div>
              
              <div className="flex items-center">
                {testimonial.photoId && (
                  <img
                    src={`/images/${testimonial.photoId}.jpg`}
                    alt={testimonial.attribution}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <div>
                  <p 
                    className="font-semibold"
                    style={{ 
                      color: design.titleColor || design.textColor,
                      fontFamily: design.titleFont || 'inherit'
                    }}
                  >
                    {testimonial.attribution}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
