'use client';

import React from 'react';

interface CTAButton {
  buttonTitle: string;
  page: string;
}

interface StyleSettings {
  fontFamily?: string;
  color?: string;
  fontSize?: string;
  backgroundColor?: string;
}

interface CTAData {
  headline: string;
  subheader?: string;
  subsubheader?: string;
  buttons?: CTAButton[];
  headlineStyle?: StyleSettings;
  subheaderStyle?: StyleSettings;
  subsubheaderStyle?: StyleSettings;
  buttonStyle?: StyleSettings;
}

interface RCTAProps {
  custom_view_description: string;
  onNavigate: (pageId: string) => void;
}

const RCTA: React.FC<RCTAProps> = ({ custom_view_description, onNavigate }) => {
  let ctaData: CTAData;
  
  try {
    ctaData = JSON.parse(custom_view_description || '{}');
  } catch {
    ctaData = { headline: 'Call to Action' };
  }
  
  // Helper function to convert Tailwind font size classes to CSS values
  const convertFontSize = (fontSize?: string): string | undefined => {
    if (!fontSize) return undefined;
    
    // If it's already a CSS value (contains rem, px, em, etc.), return as is
    if (fontSize.match(/\d+(rem|px|em|%)/)) {
      return fontSize;
    }
    
    // Map of Tailwind classes to CSS values
    const tailwindToCSS: { [key: string]: string } = {
      'text-xs': '0.75rem',
      'text-sm': '0.875rem',
      'text-base': '1rem',
      'text-lg': '1.125rem',
      'text-xl': '1.25rem',
      'text-2xl': '1.5rem',
      'text-3xl': '1.875rem',
      'text-4xl': '2.25rem',
      'text-5xl': '3rem',
      'text-6xl': '3.75rem',
      'text-7xl': '4.5rem',
      'text-8xl': '6rem',
      'text-9xl': '8rem'
    };
    
    // Handle responsive classes (e.g., "text-4xl md:text-5xl")
    const classes = fontSize.split(' ');
    const baseClass = classes.find(c => c.startsWith('text-'));
    
    if (baseClass && tailwindToCSS[baseClass]) {
      return tailwindToCSS[baseClass];
    }
    
    // Default fallback
    return fontSize;
  };
  
  // Helper function to create style object
  const getStyle = (styleSettings?: StyleSettings, defaultStyles?: React.CSSProperties): React.CSSProperties => {
    const style: React.CSSProperties = { ...defaultStyles };
    
    if (styleSettings) {
      if (styleSettings.fontFamily) {
        style.fontFamily = styleSettings.fontFamily;
      }
      if (styleSettings.color) {
        style.color = styleSettings.color;
      }
      if (styleSettings.fontSize) {
        style.fontSize = convertFontSize(styleSettings.fontSize);
      }
      if (styleSettings.backgroundColor) {
        style.backgroundColor = styleSettings.backgroundColor;
      }
    }
    
    return style;
  };

  const handleButtonClick = (pageId: string) => {
    if (pageId) {
      onNavigate(pageId);
    }
  };

  return (
    <div className="text-center py-8 px-4">
        {/* Headline */}
      {ctaData.headline && (
        <h1 
          className="mb-4"
          style={getStyle(ctaData.headlineStyle, { 
            fontSize: '2.5rem', 
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#111827' 
          })}
        >
          {ctaData.headline}
        </h1>
      )}
      
      {/* Subheader */}
      {ctaData.subheader && (
        <h3 
          className="mb-3"
          style={getStyle(ctaData.subheaderStyle, {
            fontSize: '1.25rem',
            fontWeight: '600',
            marginBottom: '0.75rem',
            color: '#374151'
          })}
        >
          {ctaData.subheader}
        </h3>
      )}
      
      {/* Sub-subheader */}
      {ctaData.subsubheader && (
        <p 
          className="mb-6"
          style={getStyle(ctaData.subsubheaderStyle, {
            fontSize: '1.125rem',
            marginBottom: '1.5rem',
            color: '#4B5563'
          })}
        >
          {ctaData.subsubheader}
        </p>
      )}
      
      {/* Buttons */}
      {ctaData.buttons && ctaData.buttons.length > 0 && (
        <div className="flex justify-center gap-4 flex-wrap">
          {ctaData.buttons.map((button, index) => {
            const buttonStyles = getStyle(ctaData.buttonStyle, {
              color: '#FFFFFF',
              backgroundColor: '#3B82F6', // Default blue color
              fontSize: '1rem',
              fontWeight: '500'
            });
            
            // Create hover color based on background color
            const hoverClass = buttonStyles.backgroundColor ? 
              'hover:brightness-110' : 'hover:bg-blue-700';
            
            return (
              <button
                key={index}
                onClick={() => handleButtonClick(button.page)}
                className={`px-6 py-3 rounded-lg transition-all ${hoverClass} ${!button.page ? 'opacity-75 cursor-not-allowed' : ''}`}
                style={buttonStyles}
                disabled={!button.page}
              >
                {button.buttonTitle || 'Button'}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RCTA;
