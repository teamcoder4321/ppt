'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function () {
  const router = useRouter();
  const [activeAds, setActiveAds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false);
  useEffect(() => {
    fetchDashboardData();
  }, []);
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const adsResponse = await fetch('/api/getactiveads');
      if (adsResponse.status === 401) {
        setShowUnauthorizedModal(true);
        setIsLoading(false);
        return;
      }
      const adsData = await adsResponse.json();
      if (adsData.success) {
        setActiveAds(adsData.ads || []);
      }
    } catch (err) {
      setError('Failed to load dashboard data');
    }
    setIsLoading(false);
  };
  const navigateToReportCenter = () => {
    router.push('/report_center');
  };
  const navigateToSessionAnalytics = () => {
    router.push('/session_analytics');
  };
  const navigateToBanManagement = () => {
    router.push('/ban_management');
  };
  const navigateToMessageCenter = () => {
    router.push('/message_center');
  };
  const navigateToUserAdmin = () => {
    router.push('/26e8f81f_3658_4f3a_868a_ea1aa63aeceb');
  };
  const adsIcon = <svg className='w-8 h-8' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z' /><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z' /></svg>;
  const reportsIcon = <svg className='w-8 h-8' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' /></svg>;
  const sessionsIcon = <svg className='w-8 h-8' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' /></svg>;
  const banIcon = <svg className='w-8 h-8' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' /></svg>;
  const messagesIcon = <svg className='w-8 h-8' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' /></svg>;
  const usersIcon = <svg className='w-8 h-8' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' /></svg>;
  const createMetricCard = (icon, title, value, bgClass) => {
    return <div className='bg-white/10 border border-white/20 rounded-lg p-4 sm:p-5 md:p-6'><div className='flex items-center gap-4'><div className={bgClass + ' p-3 rounded-lg'}>{icon}</div><div><p className='text-sm opacity-75'>{title}</p><p className='text-2xl font-bold'>{value}</p></div></div></div>;
  };
  const createNavigationCard = (icon, title, description, onClick, bgClass) => {
    return <div className='bg-white/10 border border-white/20 rounded-lg p-4 sm:p-5 md:p-6'><div className='flex items-start gap-4'><div className={bgClass + ' p-3 rounded-lg flex-shrink-0'}>{icon}</div><div className='flex-1'><h3 className='font-semibold text-lg mb-1'>{title}</h3><p className='text-sm opacity-75 mb-3'>{description}</p></div></div><button onClick={onClick} className='w-full mt-2 p-3'>View</button></div>;
  };
  const unauthorizedModal = showUnauthorizedModal ? <div className='fixed inset-0 z-50 flex items-center justify-center p-4'><div className='absolute inset-0 bg-black bg-opacity-50' onClick={() => setShowUnauthorizedModal(false)} /><div className='relative bg-white p-6 w-full max-w-md rounded-lg text-gray-900'><button onClick={() => setShowUnauthorizedModal(false)} className='absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold'>×</button><h2 className='text-xl font-bold mb-4 text-gray-900'>Access Denied</h2><p className='text-gray-700'>You are not authorized to view this content.</p></div></div> : null;
  return <div className='w-full p-2 sm:p-4 md:p-6 lg:p-8'><h1 className='text-2xl sm:text-3xl font-bold mb-2'>Admin Dashboard</h1><p className='opacity-75 mb-6 sm:mb-8'>System overview and quick navigation</p>{isLoading ? <div className='flex items-center justify-center p-8'><div className='text-center'><div className='animate-spin rounded-full h-12 w-12 border-b-2 border-current mx-auto mb-4' /><p>Loading dashboard...</p></div></div> : error ? <div className='bg-white/10 border border-white/20 rounded-lg p-6 text-center'><p className='text-red-400'>{error}</p></div> : <div><h2 className='text-xl font-semibold mb-4'>System Metrics</h2><div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8'>{createMetricCard(adsIcon, "Active Advertisements", activeAds.length.toString(), 'bg-blue-500/20 text-blue-400')}</div><h2 className='text-xl font-semibold mb-4'>Quick Navigation</h2><div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>{createNavigationCard(reportsIcon, "Report Center", "Review and manage user reports", navigateToReportCenter, 'bg-red-500/20 text-red-400')}{createNavigationCard(sessionsIcon, "Session Analytics", "View chat session statistics", navigateToSessionAnalytics, 'bg-purple-500/20 text-purple-400')}{createNavigationCard(banIcon, "Ban Management", "Manage user restrictions", navigateToBanManagement, 'bg-orange-500/20 text-orange-400')}{createNavigationCard(messagesIcon, "Message Center", "View contact submissions", navigateToMessageCenter, 'bg-green-500/20 text-green-400')}{createNavigationCard(usersIcon, "User Administration", "Manage user accounts", navigateToUserAdmin, 'bg-cyan-500/20 text-cyan-400')}</div>{activeAds.length > 0 ? <div className='mt-8'><h2 className='text-xl font-semibold mb-4'>Active Advertisements</h2><div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>{activeAds.slice(0, 6).map((ad, index) => <div key={ad.id || index} className='bg-white/10 border border-white/20 rounded-lg p-4'><h3 className='font-semibold mb-2'>{ad.title || "Advertisement"}</h3>{ad.placement ? <p className='text-sm opacity-75 mb-2'>{ad.placement}</p> : null}<div className='flex gap-4 text-sm'><span>{"Impressions" + ': ' + (ad.impressions || 0)}</span><span>{"Clicks" + ': ' + (ad.clicks || 0)}</span></div></div>)}</div></div> : null}</div>}{unauthorizedModal}</div>;
}