'use client';

import React from 'react';
import { View } from '../store/blueprint';

interface RsocialbarProps {
  viewData: View;
  views: View[];
  projectId: string;
  textColor: string;
  accentColor: string;
  backgroundColor: string;
}

interface SocialLinks {
  bluesky?: string;
  x?: string;
  facebook?: string;
  youtube?: string;
  instagram?: string;
  discord?: string;
  tiktok?: string;
}

export default function RSocialBar({ viewData, textColor }: RsocialbarProps) {
  let socialLinks: SocialLinks = {};
  
  try {
    if (viewData.custom_view_description) {
      socialLinks = JSON.parse(viewData.custom_view_description);
    }
  } catch (e) {
    // Default to empty object if parsing fails
    socialLinks = {};
  }

  // Icon components for each platform
  const BlueskyIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 360 320">
      <path d="M254.896 184.158c-.87 7.953-4.77 31.007-24.023 49.957-26.237 25.822-56.494 28.516-75.811 26.667-42.688-4.096-41.338-42.87-37.997-65.534 3.559-24.112 9.086-48.223 17.762-75.248 12.756-39.789 31.331-80.562 58.911-80.562 30.906 0 45.511 40.806 56.138 72.694 6.851 20.582 11.936 41.164 16.81 61.402.476 1.963 1.248 5.167 2.019 9.239 1.157 5.492 2.138 10.117.19 13.385Zm-149.792 0c.882 7.953 4.77 31.007 24.035 49.957 26.248 25.822 56.494 28.516 75.811 26.667 42.677-4.096 41.327-42.87 37.986-65.534-3.56-24.112-9.086-48.223-17.762-75.248C212.417 80.211 193.842 39.438 166.262 39.438c-30.906 0-45.51 40.806-56.136 72.694-6.851 20.582-11.936 41.164-16.81 61.402-.477 1.963-1.26 5.167-2.02 9.239-1.156 5.492-2.149 10.117-.202 13.385h.01Z"/>
    </svg>
  );

  const XIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );

  const FacebookIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );

  const YouTubeIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );

  const InstagramIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
    </svg>
  );

  const DiscordIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/>
    </svg>
  );

  const TikTokIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  );

  // Function to render social icon with link
  const renderSocialIcon = (platform: string, url: string | undefined, Icon: React.FC) => {
    // Skip empty URLs and old placeholder URLs
    if (!url || url.trim() === '') return null;
    
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:opacity-80 transition-opacity"
        aria-label={`Visit our ${platform} page`}
      >
        <Icon />
      </a>
    );
  };

  // Apply padding styles
  const paddingStyles = {
    paddingLeft: viewData.paddingLeft ? `${viewData.paddingLeft * 4}px` : undefined,
    paddingRight: viewData.paddingRight ? `${viewData.paddingRight * 4}px` : undefined,
    paddingTop: viewData.paddingTop ? `${viewData.paddingTop * 4}px` : undefined,
    paddingBottom: viewData.paddingBottom ? `${viewData.paddingBottom * 4}px` : undefined,
  };

  // Apply margin styles
  const marginStyles = {
    marginLeft: viewData.marginLeft ? `${viewData.marginLeft * 4}px` : undefined,
    marginRight: viewData.marginRight ? `${viewData.marginRight * 4}px` : undefined,
    marginTop: viewData.marginTop ? `${viewData.marginTop * 4}px` : undefined,
    marginBottom: viewData.marginBottom ? `${viewData.marginBottom * 4}px` : undefined,
  };

  // Apply background color if set
  const backgroundStyles = {
    backgroundColor: viewData.background_color || undefined,
  };

  // Combine all styles
  const containerStyles = {
    ...paddingStyles,
    ...marginStyles,
    ...backgroundStyles,
    color: viewData.text_color || textColor,
  };

  // Check if any social links exist (filter out empty strings and old placeholder URLs)
  const hasAnyLinks = Object.values(socialLinks).some(url => 
    url && url.trim() !== ''
  );

  // Determine flex alignment based on viewData.align
  const getAlignmentClass = () => {
    switch (viewData.align?.toLowerCase()) {
      case 'left':
        return 'justify-start';
      case 'right':
        return 'justify-end';
      case 'center':
      default:
        return 'justify-center';
    }
  };

  return (
    <div
      className={`w-full flex ${getAlignmentClass()} items-center`}
      style={containerStyles}
    >
      {hasAnyLinks ? (
        <div className="flex gap-6 items-center">
          {renderSocialIcon('Bluesky', socialLinks.bluesky, BlueskyIcon)}
          {renderSocialIcon('X', socialLinks.x, XIcon)}
          {renderSocialIcon('Facebook', socialLinks.facebook, FacebookIcon)}
          {renderSocialIcon('YouTube', socialLinks.youtube, YouTubeIcon)}
          {renderSocialIcon('Instagram', socialLinks.instagram, InstagramIcon)}
          {renderSocialIcon('Discord', socialLinks.discord, DiscordIcon)}
          {renderSocialIcon('TikTok', socialLinks.tiktok, TikTokIcon)}
        </div>
      ) : (
        <div className="text-gray-400 text-sm">
          &nbsp;
        </div>
      )}
    </div>
  );
}
