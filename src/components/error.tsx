'use client';

import React from 'react';

export const Error: React.FC = () => {
  return (
    <div className="error-container" style={{ 
      padding: '2rem', 
      margin: '1rem 0', 
      backgroundColor: '#fff1f0', 
      border: '1px solid #ffccc7',
      borderRadius: '4px',
      color: '#cf1322'
    }}>
      <h2 style={{ marginTop: 0 }}>Something went wrong</h2>
      <p>A code error occurred while trying to render this component.</p>
      <p>Please contact the development team for assistance.</p>
    </div>
  );
};
