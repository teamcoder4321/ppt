'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function () {
  const [userId, setUserId] = useState('');
  const [banStatus, setBanStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const checkBanStatus = async () => {
    if (!userId.trim()) {
      setError("Please enter a user ID");
      return;
    }
    setIsLoading(true);
    setError(null);
    setBanStatus(null);
    try {
      const response = await fetch('/api/checkuserban?userid=' + encodeURIComponent(userId));
      if (response.status === 401) {
        setError("You are not authorized to perform this action");
        setIsLoading(false);
        return;
      }
      if (!response.ok) {
        throw new Error("Failed to check ban status");
      }
      const data = await response.json();
      setBanStatus(data);
      setHasSearched(true);
    } catch (err) {
      setError(err.message || "An error occurred while checking ban status");
    } finally {
      setIsLoading(false);
    }
  };
  const formatDate = dateString => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };
  const renderStatusBadge = isBanned => {
    if (isBanned) {
      return <span className='bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold'>BANNED</span>;
    }
    return <span className='bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold'>ALLOWED</span>;
  };
  const searchIcon = <svg className='w-16 h-16 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' /></svg>;
  const banIcon = <svg className='w-8 h-8 text-red-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' /></svg>;
  const checkIcon = <svg className='w-8 h-8 text-green-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' /></svg>;
  const warningIcon = <svg className='w-6 h-6 text-red-400 flex-shrink-0 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' /></svg>;
  const largeCheckIcon = <svg className='w-16 h-16 text-green-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' /></svg>;
  const loadingText = "Checking...";
  const checkButtonText = "Check Status";
  return <div className='w-full p-3 sm:p-4 md:p-6 lg:p-8'><div className='mb-6 sm:mb-8'><h1 className='text-2xl sm:text-3xl font-bold mb-2'>User Ban Checker</h1><p className='text-gray-400'>Search for a user to check their ban status</p></div><div className='bg-white/10 border border-white/20 rounded-lg p-4 sm:p-6 mb-6'><div className='flex flex-col sm:flex-row gap-3 sm:gap-4'><div className='flex-1'><label className='text-gray-200 block mb-2 font-medium'>User ID</label><input type='text' value={userId} onChange={e => setUserId(e.target.value)} placeholder='Enter user ID to check...' className='bg-white text-gray-900 border border-gray-300 placeholder-gray-500 p-2 sm:p-3 rounded w-full' onKeyPress={e => e.key === 'Enter' && checkBanStatus()} /></div><div className='flex items-end'><button onClick={checkBanStatus} disabled={isLoading} className='p-2 sm:p-3 md:p-4 w-full sm:w-auto'>{isLoading ? loadingText : checkButtonText}</button></div></div></div>{error ? <div className='bg-red-100 border border-red-300 text-red-800 rounded-lg p-4 mb-6'>{error}</div> : null}{hasSearched && banStatus ? <div className='bg-white/10 border border-white/20 rounded-lg p-4 sm:p-6'><div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-white/10'><div className='flex items-center gap-3'>{banStatus.is_banned ? banIcon : checkIcon}<div><h2 className='text-xl font-semibold'>Ban Status</h2><p className='text-gray-400 text-sm'>{"User ID: " + userId}</p></div></div>{renderStatusBadge(banStatus.is_banned)}</div>{banStatus.is_banned ? <div className='space-y-4'><div className='bg-red-900/20 border border-red-500/30 rounded-lg p-4'><h3 className='font-semibold text-red-300 mb-3'>Ban Details</h3><div className='grid grid-cols-1 md:grid-cols-2 gap-4'><div><p className='text-gray-400 text-sm mb-1'>Reason</p><p className='text-white'>{banStatus.reason || "No reason provided"}</p></div><div><p className='text-gray-400 text-sm mb-1'>Ban Type</p><p>{banStatus.is_permanent ? <span className='bg-red-600 text-white px-2 py-1 rounded text-sm'>Permanent</span> : <span className='bg-yellow-600 text-white px-2 py-1 rounded text-sm'>Temporary</span>}</p></div>{!banStatus.is_permanent ? <div><p className='text-gray-400 text-sm mb-1'>Expires At</p><p className='text-white'>{formatDate(banStatus.expires_at)}</p></div> : null}</div></div>{banStatus.is_permanent ? <div className='bg-red-900/30 border border-red-500/50 rounded-lg p-4 flex items-start gap-3'>{warningIcon}<div><p className='text-red-300 font-semibold'>Permanent Ban</p><p className='text-red-200 text-sm'>This user has been permanently banned and cannot access the platform.</p></div></div> : null}</div> : <div className='bg-green-900/20 border border-green-500/30 rounded-lg p-6 text-center'><div className='flex justify-center mb-4'>{largeCheckIcon}</div><h3 className='text-xl font-semibold text-green-300 mb-2'>User Not Banned</h3><p className='text-green-200'>This user is in good standing and can access all platform features.</p></div>}</div> : null}{!hasSearched && !error ? <div className='bg-white/5 border border-white/10 rounded-lg p-8 text-center'><div className='flex justify-center mb-4'>{searchIcon}</div><h3 className='text-xl font-semibold text-gray-300 mb-2'>Search for a User</h3><p className='text-gray-400'>Enter a user ID above and click Check Status to view their ban information.</p></div> : null}</div>;
}