/* 
Sitepaige Components v1.0.0
Sitepaige components are automatically added to your project the first time it is built, and are only added again if the "Build Components" button is 
checked in the system build settings. It is safe to modify this file without it being overwritten unless that setting is selected. 
*/

'use client';

import React from 'react';
import Menu from './menu';
import { useState, useEffect } from 'react';

interface Menu {
  id: string;
  name: string;
  font: string;
  fontSize: string;
  untouchable: boolean;
  direction: string | null;
  align?: string | null;
  items: Array<MenuItem>;
}

interface MenuItem {
  id: string;
  name: string;
  page: string | null;
  menu: string | null;
  untouchable: boolean;
  link_type?: 'page' | 'external' | 'file';
  external_url?: string | null;
  file_id?: string | null;
  file_name?: string | null;
  hiddenOnDesktop?: boolean; // New field to hide item on desktop (shows in icon bar instead)
}

interface Page {
  id: string;
  name: string;
  description: string;
  access: string;
  linked_from: string;
  untouchable: boolean;
  is_home: boolean;
  user_tier: string;
}

interface WrappedMenuProps {
  // New interface that views expect
  menuType?: string;
  menuIndex?: number;
  direction?: string;
  // Legacy interface for backward compatibility
  menu?: Menu;
  onClick?: () => void;
  pages?: Array<{id: string, name: string}>;
  // Blueprint data can be passed directly
  blueprintData?: {
    menus?: Menu[];
    pages?: Page[];
  };
}

export default function WrappedMenu({ 
  menuType, 
  menuIndex, 
  direction, 
  menu, 
  onClick, 
  pages,
  blueprintData 
}: WrappedMenuProps) {
  // Initialize state with menu data if available
  const [menuToRender, setMenuToRender] = useState<Menu | null>(menu || null);
  const [pagesToRender, setPagesToRender] = useState<Array<{id: string, name: string}>>(pages || []);


  useEffect(() => {
    // If we have direct menu/pages props, use those (legacy mode)
    if (menu && pages) {
      setMenuToRender(menu);
      setPagesToRender(pages);
      return;
    }

    // If blueprint data is provided directly, use it
    if (blueprintData?.menus && blueprintData?.pages) {
      const menus = blueprintData.menus;
      const pages = blueprintData.pages;
      
      // Get the specific menu based on menuIndex
      let selectedMenu: Menu | null = null;
      if (typeof menuIndex === 'number' && menuIndex >= 0 && menuIndex < menus.length) {
        selectedMenu = menus[menuIndex];
      }
      
      if (selectedMenu) {
        setMenuToRender(selectedMenu);
        setPagesToRender(pages.map((p: Page) => ({ id: p.id, name: p.name })));
        return;
      }
    }

    // Create a basic fallback menu structure
    const fallbackMenu: Menu = {
      id: 'fallback-menu',
      name: 'Navigation Menu',
      font: 'Arial, sans-serif',
      fontSize: 'text-base',
      untouchable: false,
      direction: direction || 'horizontal',
      align: 'Left',
      items: [
        {
          id: 'home',
          name: 'Home',
          page: 'home',
          menu: null,
          untouchable: false,
          link_type: 'page'
        },
        {
          id: 'products',
          name: 'Products',
          page: 'products',
          menu: null,
          untouchable: false,
          link_type: 'page'
        },
        {
          id: 'contact',
          name: 'Contact',
          page: 'contact',
          menu: null,
          untouchable: false,
          link_type: 'page'
        }
      ]
    };
    
    const fallbackPages = [
      { id: 'home', name: 'Home' },
      { id: 'products', name: 'Products' },
      { id: 'contact', name: 'Contact' }
    ];
    
    setMenuToRender(fallbackMenu);
    setPagesToRender(fallbackPages);
  }, [menuType, menuIndex, direction, menu, pages, blueprintData]);

  
  if (!menuToRender) {
    return <div style={{color: 'orange', padding: '10px'}}>WrappedMenu: No menu to render</div>;
  }
  
  return (
    <Menu
      menu={menuToRender}
      onClick={onClick}
      pages={pagesToRender}
    />
  );
}
