'use client';

import React from 'react';
import { sanitizeHtml, sanitizeUserInput, createSafeHtml, sanitizeUrl } from '../utils/security';

interface SecureContentProps {
  content: string;
  allowHtml?: boolean;
  allowedTags?: string[];
  className?: string;
}

/**
 * Secure content component that sanitizes user-generated content
 * to prevent XSS attacks
 */
export const SecureContent: React.FC<SecureContentProps> = ({
  content,
  allowHtml = false,
  allowedTags,
  className = '',
}) => {
  if (!content) return null;

  // If HTML is allowed, sanitize it
  if (allowHtml) {
    const sanitizedHtml = createSafeHtml(
      sanitizeHtml(content, allowedTags ? { ALLOWED_TAGS: allowedTags } : undefined)
    );
    
    return (
      <div 
        className={className}
        dangerouslySetInnerHTML={sanitizedHtml}
      />
    );
  }

  // Otherwise, render as plain text (sanitized)
  const sanitizedText = sanitizeUserInput(content);
  
  return <div className={className}>{sanitizedText}</div>;
};

interface SecureLinkProps {
  href: string;
  children: React.ReactNode;
  allowedHosts?: string[];
  className?: string;
  target?: string;
  rel?: string;
}

/**
 * Secure link component that validates URLs before rendering
 */
export const SecureLink: React.FC<SecureLinkProps> = ({
  href,
  children,
  allowedHosts = [],
  className = '',
  target = '_self',
  rel = 'noopener noreferrer',
}) => {
  const sanitizedUrl = sanitizeUrl(href, allowedHosts);
  
  // If URL is invalid, render as span
  if (!sanitizedUrl) {
    console.warn(`Invalid or unsafe URL blocked: ${href}`);
    return <span className={className}>{children}</span>;
  }

  return (
    <a
      href={sanitizedUrl}
      className={className}
      target={target}
      rel={rel}
    >
      {children}
    </a>
  );
};

interface SecureFormProps {
  children: React.ReactNode;
  onSubmit: (data: any) => void;
  className?: string;
}

/**
 * Secure form wrapper that sanitizes all input values
 */
export const SecureForm: React.FC<SecureFormProps> = ({
  children,
  onSubmit,
  className = '',
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const sanitizedData: Record<string, string> = {};
    
    // Sanitize all form inputs
    formData.forEach((value, key) => {
      if (typeof value === 'string') {
        sanitizedData[key] = sanitizeUserInput(value);
      }
    });
    
    onSubmit(sanitizedData);
  };

  return (
    <form className={className} onSubmit={handleSubmit}>
      {children}
    </form>
  );
};

/**
 * Hook for sanitizing user input in real-time
 */
export const useSecureInput = (initialValue: string = '') => {
  const [value, setValue] = React.useState(initialValue);
  
  const handleChange = (newValue: string) => {
    // Sanitize input in real-time
    const sanitized = sanitizeUserInput(newValue);
    setValue(sanitized);
  };
  
  return {
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      handleChange(e.target.value);
    },
    setValue: handleChange,
  };
};
