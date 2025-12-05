import React from 'react';

export default function GeneratedLogoView(){
  const logoSrc = "/logo.png";
  const altText = "Nexus";
  const textColor = "#e5e5e5";
  
  return (
    <div className="logo">
      <a href="/">
        {logoSrc && logoSrc === "/logo.png" ? (
          <img src={logoSrc} alt={altText} width="240" height="80" />
        ) : (
          <div className="text-3xl" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: textColor || '#666',
            textAlign: 'center',
            minHeight: '80px'
          }}>
            {altText}
          </div>
        )}
      </a>
    </div>
  );
}