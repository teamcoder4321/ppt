'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import RCTA from '../components/cta';

export default function GeneratedHeroContentView() {
  const router = useRouter();
  const customViewDescription = "{\"headline\":\"Connect Instantly, Anonymously, Globally\",\"subheader\":\"Break through barriers with seamless, private peer-to-peer communication that puts you in control\",\"buttons\":[{\"buttonTitle\":\"Start Chatting\",\"page\":\"2daabbce-26b5-46e0-8939-a9c34758de5f\"}],\"headlineStyle\":{\"fontFamily\":\"Outfit\",\"color\":\"#ffffff\",\"fontSize\":\"text-5xl md:text-7xl lg:text-8xl\",\"fontWeight\":\"800\"},\"subheaderStyle\":{\"fontFamily\":\"Inter\",\"color\":\"#e5e5e5\",\"fontSize\":\"text-xl md:text-2xl\"},\"buttonStyle\":{\"fontFamily\":\"Outfit\",\"color\":\"#ffffff\",\"backgroundColor\":\"#6366f1\",\"rounded\":\"rounded-full\"}}";
  
  const handleNavigate = (pageId: string) => {
    if (!pageId) return;
    
    // Find the page using the pageId and navigate to it
    const pages = [{"id":"8ea87729-c1ce-48ab-9bd5-47239f1153fe","name":"Home"},{"id":"c1d2e3f4-5a6b-7c8d-9e0f-1a2b3c4d5e6f","name":"Get in Touch"},{"id":"d2e3f4a5-6b7c-8d9e-0f1a-2b3c4d5e6f7a","name":"Message Center"},{"id":"53201274-3c89-4cb7-9b98-a0a30d5831c9","name":"Ban Management"},{"id":"0796b37a-16aa-4bc7-ad86-9accec2319e3","name":"Report Center"},{"id":"4349169f-d819-4adc-b3a2-3be3676e35a7","name":"Session Analytics"},{"id":"2daabbce-26b5-46e0-8939-a9c34758de5f","name":"About Synapse"},{"id":"4af88b7c-584c-4422-aa7a-c268371301c0","name":"Help & FAQ"},{"id":"f9d56c9c-7e63-40b5-b0d7-eb610258fcb4","name":"Dashboard"},{"id":"cff1b357-2149-4552-98e8-47173002b73c","name":"Admin Dashboard"},{"id":"fe5c7eb9-87d0-4042-acac-6226460237ae","name":"Login"},{"id":"c224b36d-f6f1-42e8-8719-cb6ed018314c","name":"Terms of Service"},{"id":"86eb50b3-d2a4-4a2f-9370-1821507fc247","name":"Privacy Policy"}];
    const page = pages.find(p => p.id === pageId);
    if (page) {
      // Use page name for URL, replace non-alphanumeric with underscore
      let folderName = page.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_');
      
      // Replace multiple consecutive underscores with a single underscore
      folderName = folderName.replace(/_+/g, '_');
      
      // Remove leading and trailing underscores
      folderName = folderName.replace(/^_+|_+$/g, '');
      
      // If empty or just 'home', use root
      if (!folderName || folderName === 'home') {
        router.push('/');
      } else {
        router.push('/' + folderName);
      }
    }
  };
  
  return <RCTA custom_view_description={customViewDescription} onNavigate={handleNavigate} />;
}