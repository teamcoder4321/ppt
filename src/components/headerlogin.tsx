/* 
Sitepaige Components v1.0.0
Sitepaige components are automatically added to your project the first time it is built, and are only added again if the "Build Components" button is 
checked in the system build settings. It is safe to modify this file without it being overwritten unless that setting is selected. 
*/

'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface MenuItem {
  label: string;
  link?: string;
  action?: string;
}

interface UserData {
  userid: string;
  username: string;
  avatarurl: string;
  email: string;
  userlevel: number;
  isadmin: boolean;
}

const getLocalizedText = (text: string, language: string = 'English'): string => {
  // Simple localization - can be expanded
  const translations: { [key: string]: { [key: string]: string } } = {
    'Sample User': { 'English': 'Sample User' },
    'Login': { 'English': 'Login' },
    'Logout': { 'English': 'Logout' }
  };
  
  return translations[text]?.[language] || text;
};

interface LoginSectionProps {
  websiteLanguage?: string;
  textColor?: string;
}

const LoginSection: React.FC<LoginSectionProps> = ({ websiteLanguage = 'English', textColor = '#000000' }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Hardcoded values
  const loginPage = '/login';
  const align = 'Right' as "Left" | "Center" | "Right";
  const mobileViewMode = 'desktop' as 'desktop' | 'phone' | 'sm-tablet' | 'lg-tablet';

  // Build menu items based on user level
  const profileMenuItems: MenuItem[] = [
    { label: 'Dashboard', link: '/dashboard' },
    { label: 'Profile', link: '/profile' }
  ];
  
  // Add Admin Dashboard only if user is an admin (userlevel == 2)
  if (userData?.userlevel === 2) {
    profileMenuItems.push({ label: 'Admin Dashboard', link: '/admin_dashboard' });
  }

  // Fetch user authentication status and data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/Auth', {
          method: 'GET',
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setUserData(data.user);
            setIsAuthenticated(true);
          } else {
            // User is not logged in
            setUserData(null);
            setIsAuthenticated(false);
          }
        } else if (response.status === 500) {
          // Server error - likely database doesn't exist
          const errorData = await response.json();
          if (errorData.error && (errorData.error.includes('no such table') || errorData.error.includes('database'))) {
            // Store error state to show special message
            localStorage.setItem('db_setup_required', 'true');
          }
          setUserData(null);
          setIsAuthenticated(false);
        } else {
          setUserData(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        // Network error or other issues
        setUserData(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      setShowUserMenu(false);
      
      const response = await fetch('/api/Auth', {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setUserData(null);
        setIsAuthenticated(false);
        // Optionally redirect to home page or refresh
        window.location.href = '/';
      } else {
        console.error('Failed to logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleLoginClick = (e: React.MouseEvent) => {
    // Check if database setup is required
    const dbSetupRequired = localStorage.getItem('db_setup_required');
    if (dbSetupRequired === 'true') {
      e.preventDefault();
      alert('Backend generation needs to be completed before you can log in. Please complete the backend generation process first.');
      return;
    }
    // Otherwise, let the link navigate normally
  };

  const handleMenuItemClick = (link?: string) => {
    setShowUserMenu(false);
    if (link) {
      window.location.href = link;
    }
  };

  // Close menu if clicking outside
  useEffect(() => {
    if (!showUserMenu) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  // Determine if we should show mobile view based on mobileViewMode
  const isMobileView = mobileViewMode === 'phone';

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center" style={{
        textAlign: align === 'Left' ? 'left' : align === 'Center' ? 'center' : align === 'Right' ? 'right' : undefined,
        justifyContent: align === 'Left' ? 'flex-start' : align === 'Center' ? 'center' : align === 'Right' ? 'flex-end' : undefined,
      }}>
        <div className="animate-pulse bg-gray-300 rounded-full w-10 h-10"></div>
      </div>
    );
  }

  return (
    isAuthenticated && userData ? (
      <div className="flex" style={{
        textAlign: align === 'Left' ? 'left' : align === 'Center' ? 'center' : align === 'Right' ? 'right' : undefined,
        justifyContent: align === 'Left' ? 'flex-start' : align === 'Center' ? 'center' : align === 'Right' ? 'flex-end' : undefined,
        alignItems: align === 'Left' ? 'start' : align === 'Center' ? 'center' : align === 'Right' ? 'end' : undefined,
        position: 'relative'
      }}>
        <div
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center focus:outline-none relative group cursor-pointer"
          style={{ color: textColor }}
        >
          <span className="mr-2" style={{ color: textColor }}>{userData.username || getLocalizedText('Sample User', websiteLanguage)}</span>
          <div className="relative">
            {userData.avatarurl ? (
              <img
                src={userData.avatarurl}
                alt="User avatar"
                className="w-10 h-10 rounded-full"
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {userData.username ? userData.username.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
          </div>
        </div>

        {/* Desktop user menu */}
        {showUserMenu && (
          <div
            ref={userMenuRef}
            className={`absolute right-0 top-full mt-2 w-64 bg-white shadow-lg py-1 z-10`}
          >
            {profileMenuItems.map((item, index) => (
              item.link ? (
                <Link
                  key={index}
                  href={item.link}
                  onClick={() => handleMenuItemClick(item.link)}
                  className="text-lg px-6 py-2 mx-2 my-1 cursor-pointer text-gray-800 hover:text-blue-600 hover:bg-gray-50 block transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ) : (
                <div
                  key={index}
                  onClick={() => handleMenuItemClick(item.link)}
                  className="text-lg px-6 py-2 mx-2 my-1 cursor-pointer text-gray-800 hover:text-blue-600 hover:bg-gray-50 block transition-colors duration-200"
                >
                  {item.label}
                </div>
              )
            ))}
            <div className="flex justify-end">
              <div
                onClick={handleLogout}
                className="text-lg px-6 py-2 mx-2 my-1 cursor-pointer text-gray-800 hover:text-red-600 hover:bg-gray-50 transition-colors duration-200"
              >
                {getLocalizedText('Logout', websiteLanguage)}
              </div>
            </div>
          </div>
        )}
      </div>
    ) : (
      <div className="flex" style={{
        textAlign: align === 'Left' ? 'left' : align === 'Center' ? 'center' : align === 'Right' ? 'right' : undefined,
        justifyContent: align === 'Left' ? 'flex-start' : align === 'Center' ? 'center' : align === 'Right' ? 'flex-end' : undefined,
        alignItems: align === 'Left' ? 'start' : align === 'Center' ? 'center' : align === 'Right' ? 'end' : undefined,
      }}>
        {/* Always show icon for login */}
        <Link href={loginPage} onClick={handleLoginClick}>
          <button
            className={`px-2 py-2 !bg-transparent`}
            style={{
              color: textColor
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: textColor }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </Link>
      </div>
    )
  );
};

export default LoginSection; 