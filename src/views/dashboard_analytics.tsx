'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function () {
  const router = useRouter();
  const [activeAds, setActiveAds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState(null);
  useEffect(() => {
    fetchDashboardData();
  }, []);
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const adsResponse = await fetch('/api/getactiveads');
      if (adsResponse.status === 401) {
        setError('unauthorized');
        setIsLoading(false);
        return;
      }
      const adsData = await adsResponse.json();
      if (adsData.success) {
        setActiveAds(adsData.ads || []);
      }
    } catch (err) {
      setError('fetch_error');
    }
    setIsLoading(false);
  };
  const handleContactSubmit = async () => {
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setSubmitStatus('Please fill in all required fields');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactForm.email)) {
      setSubmitStatus('Please enter a valid email address');
      return;
    }
    try {
      const response = await fetch('/api/contactsubmit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contactForm)
      });
      const data = await response.json();
      if (data.success) {
        setSubmitStatus('Message sent successfully!');
        setContactForm({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        setTimeout(() => {
          setShowContactModal(false);
          setSubmitStatus(null);
        }, 2000);
      } else {
        setSubmitStatus('Failed to send message');
      }
    } catch (err) {
      setSubmitStatus('Error sending message');
    }
  };
  const handleRecordImpression = async adId => {
    try {
      await fetch('/api/recordadinteraction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          advertisement_id: adId,
          interaction_type: 'impression'
        })
      });
    } catch (err) {
      console.error('Failed to record impression');
    }
  };
  const navigateTo = (pageId, params) => {
    window.postMessage({
      navigate: pageId,
      ids: params || []
    });
  };
  const createMetricCard = (icon, title, value, color) => {
    return <div className='bg-white/10 border border-white/20 rounded-lg p-3 sm:p-4 md:p-6'><div className='flex items-center gap-3'><div className={'p-2 sm:p-3 rounded-lg ' + color}><svg className='w-6 h-6 sm:w-8 sm:h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>{icon}</svg></div><div><p className='text-sm text-gray-400'>{title}</p><p className='text-xl sm:text-2xl font-bold'>{value}</p></div></div></div>;
  };
  const usersIcon = <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' />;
  const chatIcon = <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />;
  const adIcon = <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z' />;
  const reportIcon = <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' />;
  const quickLinks = [{
    name: "User Administration",
    pageId: '26e8f81f-3658-4f3a-868a-ea1aa63aeceb',
    desc: "Manage user accounts"
  }, {
    name: "Report Center",
    pageId: '0796b37a-16aa-4bc7-ad86-9accec2319e3',
    desc: "Review user reports"
  }, {
    name: "Ban Management",
    pageId: '53201274-3c89-4cb7-9b98-a0a30d5831c9',
    desc: "Manage user restrictions"
  }, {
    name: "Session Analytics",
    pageId: '4349169f-d819-4adc-b3a2-3be3676e35a7',
    desc: "View session data"
  }, {
    name: "Message Center",
    pageId: 'd2e3f4a5-6b7c-8d9e-0f1a-2b3c4d5e6f7a',
    desc: "Contact submissions"
  }];
  return <div className='w-full p-2 sm:p-4 md:p-6 lg:p-8'>{isLoading ? <div className='flex items-center justify-center p-8'><div className='text-center'><svg className='animate-spin h-8 w-8 mx-auto mb-4' fill='none' viewBox='0 0 24 24'><circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' /><path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' /></svg><p>Loading dashboard...</p></div></div> : error === 'unauthorized' ? <div className='bg-white/10 border border-white/20 rounded-lg p-4 sm:p-6 text-center'><p className='text-red-400'>You do not have permission to view this dashboard</p></div> : <div><div className='mb-4 sm:mb-6 md:mb-8'><h1 className='text-xl sm:text-2xl md:text-3xl font-bold mb-2'>Dashboard Analytics</h1><p className='text-gray-400'>Overview of Synapse platform metrics</p></div><div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8'>{createMetricCard(usersIcon, "Platform Status", "Active", 'bg-green-500/20 text-green-400')}{createMetricCard(chatIcon, "Chat System", "Online", 'bg-blue-500/20 text-blue-400')}{createMetricCard(adIcon, "Active Ads", String(activeAds.length), 'bg-purple-500/20 text-purple-400')}{createMetricCard(reportIcon, "Moderation", "Ready", 'bg-orange-500/20 text-orange-400')}</div><div className='grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6'><div className='lg:col-span-2'><div className='bg-white/10 border border-white/20 rounded-lg p-3 sm:p-4 md:p-6'><h2 className='text-lg sm:text-xl font-semibold mb-4'>Quick Access</h2><div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>{quickLinks.map((link, index) => <button key={index} onClick={() => navigateTo(link.pageId)} className='p-3 sm:p-4 bg-white/5 border border-white/10 rounded-lg text-left'><p className='font-medium'>{link.name}</p><p className='text-sm text-gray-400'>{link.desc}</p></button>)}</div></div></div><div className='lg:col-span-1'><div className='bg-white/10 border border-white/20 rounded-lg p-3 sm:p-4 md:p-6'><h2 className='text-lg sm:text-xl font-semibold mb-4'>Quick Actions</h2><div className='flex flex-col gap-3'><button onClick={() => setShowContactModal(true)} className='p-3'>Send Feedback</button><button onClick={() => navigateTo('0796b37a-16aa-4bc7-ad86-9accec2319e3')} className='p-3'>View Reports</button><button onClick={fetchDashboardData} className='p-3'>Refresh Data</button></div></div></div></div>{activeAds.length > 0 && <div className='mt-6 sm:mt-8'><div className='bg-white/10 border border-white/20 rounded-lg p-3 sm:p-4 md:p-6'><h2 className='text-lg sm:text-xl font-semibold mb-4'>Active Advertisements</h2><div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>{activeAds.map((ad, index) => {
              useEffect(() => {
                if (ad.advertisementsid) {
                  handleRecordImpression(ad.advertisementsid);
                }
              }, []);
              return <div key={ad.advertisementsid || index} className='bg-white/5 border border-white/10 rounded-lg p-3'><p className='font-medium truncate'>{ad.title || "Advertisement"}</p><p className='text-sm text-gray-400'>{ad.placement || "General"}</p></div>;
            })}</div></div></div>}</div>}{showContactModal && <div className='fixed inset-0 z-50 flex items-center justify-center p-4'><div className='absolute inset-0 bg-black bg-opacity-50' onClick={() => setShowContactModal(false)} /><div className='relative bg-white rounded-lg p-4 sm:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto text-gray-900'><button onClick={() => setShowContactModal(false)} className='absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold'>×</button><h3 className='text-xl font-semibold mb-4 text-gray-900'>Send Feedback</h3><div className='m-3 sm:m-4'><label className='text-gray-700 block mb-1'>Name *</label><input type='text' value={contactForm.name} onChange={e => setContactForm({
            ...contactForm,
            name: e.target.value
          })} className='bg-white text-gray-900 border border-gray-300 placeholder-gray-500 p-2 sm:p-3 rounded w-full' placeholder='Your name' /></div><div className='m-3 sm:m-4'><label className='text-gray-700 block mb-1'>Email *</label><input type='email' value={contactForm.email} onChange={e => setContactForm({
            ...contactForm,
            email: e.target.value
          })} className='bg-white text-gray-900 border border-gray-300 placeholder-gray-500 p-2 sm:p-3 rounded w-full' placeholder='your@email.com' /></div><div className='m-3 sm:m-4'><label className='text-gray-700 block mb-1'>Subject</label><input type='text' value={contactForm.subject} onChange={e => setContactForm({
            ...contactForm,
            subject: e.target.value
          })} className='bg-white text-gray-900 border border-gray-300 placeholder-gray-500 p-2 sm:p-3 rounded w-full' placeholder='Optional subject' /></div><div className='m-3 sm:m-4'><label className='text-gray-700 block mb-1'>Message *</label><textarea value={contactForm.message} onChange={e => setContactForm({
            ...contactForm,
            message: e.target.value
          })} className='bg-white text-gray-900 border border-gray-300 placeholder-gray-500 p-2 sm:p-3 rounded w-full h-32' placeholder='Your message...' /></div>{submitStatus && <div className='m-3 sm:m-4'><p className={submitStatus.includes('success') ? 'text-green-600' : 'text-red-600'}>{submitStatus}</p></div>}<div className='m-3 sm:m-4 flex gap-3'><button onClick={handleContactSubmit} className='p-3 flex-1'>Send Message</button><button onClick={() => setShowContactModal(false)} className='px-4 py-2 !bg-transparent !text-gray-700 border border-current rounded-lg'>Cancel</button></div></div></div>}</div>;
}