'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function () {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [formData, setFormData] = useState({
    chatsessionsid: '',
    duration_seconds: '',
    user1_ip_hash: '',
    user2_ip_hash: '',
    user1_country: '',
    user2_country: '',
    ended_by: ''
  });
  const handleInputChange = function (field, value) {
    setFormData(function (prev) {
      return Object.assign({}, prev, {
        [field]: value
      });
    });
  };
  const handleSubmit = async function () {
    if (!formData.chatsessionsid || !formData.duration_seconds) {
      setModalMessage("Please fill in required fields: Chat Session ID and Duration");
      setShowModal(true);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/savesessionmetadata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chatsessionsid: formData.chatsessionsid,
          duration_seconds: parseInt(formData.duration_seconds, 10),
          user1_ip_hash: formData.user1_ip_hash || undefined,
          user2_ip_hash: formData.user2_ip_hash || undefined,
          user1_country: formData.user1_country || undefined,
          user2_country: formData.user2_country || undefined,
          ended_by: formData.ended_by || undefined
        })
      });
      if (response.status === 401) {
        setModalMessage("Unauthorized. Please log in again.");
        setShowModal(true);
        setIsLoading(false);
        return;
      }
      const data = await response.json();
      if (data.success) {
        const newSession = {
          id: data.metadata_id,
          chatsessionsid: formData.chatsessionsid,
          duration_seconds: parseInt(formData.duration_seconds, 10),
          user1_ip_hash: formData.user1_ip_hash,
          user2_ip_hash: formData.user2_ip_hash,
          user1_country: formData.user1_country,
          user2_country: formData.user2_country,
          ended_by: formData.ended_by,
          created_at: new Date().toISOString()
        };
        setSessions(function (prev) {
          return [newSession].concat(prev);
        });
        setFormData({
          chatsessionsid: '',
          duration_seconds: '',
          user1_ip_hash: '',
          user2_ip_hash: '',
          user1_country: '',
          user2_country: '',
          ended_by: ''
        });
        setModalMessage("Session metadata saved successfully!");
        setShowModal(true);
      } else {
        setModalMessage("Failed to save session metadata.");
        setShowModal(true);
      }
    } catch (error) {
      setModalMessage("Error saving session metadata. Please try again.");
      setShowModal(true);
    }
    setIsLoading(false);
  };
  const formatDuration = function (seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins + ':' + secs.toString().padStart(2, '0');
  };
  const getDurationClass = function (seconds) {
    if (seconds < 60) return 'bg-red-100 text-red-800';
    if (seconds < 300) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };
  const getDurationLabel = function (seconds) {
    if (seconds < 60) return 'Short';
    if (seconds < 300) return 'Medium';
    return 'Long';
  };
  const filteredSessions = sessions.filter(function (session) {
    if (filterCountry) {
      const countries = [session.user1_country, session.user2_country].filter(Boolean);
      if (!countries.some(function (c) {
        return c.toLowerCase().includes(filterCountry.toLowerCase());
      })) {
        return false;
      }
    }
    if (filterDateFrom) {
      const sessionDate = new Date(session.created_at);
      const fromDate = new Date(filterDateFrom);
      if (sessionDate < fromDate) return false;
    }
    if (filterDateTo) {
      const sessionDate = new Date(session.created_at);
      const toDate = new Date(filterDateTo);
      toDate.setHours(23, 59, 59, 999);
      if (sessionDate > toDate) return false;
    }
    return true;
  });
  const totalSessions = filteredSessions.length;
  const avgDuration = totalSessions > 0 ? Math.round(filteredSessions.reduce(function (sum, s) {
    return sum + s.duration_seconds;
  }, 0) / totalSessions) : 0;
  const countryCount = {};
  filteredSessions.forEach(function (s) {
    if (s.user1_country) countryCount[s.user1_country] = (countryCount[s.user1_country] || 0) + 1;
    if (s.user2_country) countryCount[s.user2_country] = (countryCount[s.user2_country] || 0) + 1;
  });
  const topCountries = Object.entries(countryCount).sort(function (a, b) {
    return b[1] - a[1];
  }).slice(0, 3).map(function (entry) {
    return entry[0];
  });
  const closeModal = function () {
    setShowModal(false);
  };
  return <div className='w-full p-2 sm:p-4 md:p-6 lg:p-8'>{showModal ? <div className='fixed inset-0 z-50 flex items-center justify-center p-4'><div className='absolute inset-0 bg-black bg-opacity-50' onClick={closeModal} /><div className='relative bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto text-gray-900'><button onClick={closeModal} className='absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold'>×</button><p className='text-gray-800 mt-4'>{modalMessage}</p></div></div> : null}<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'><div className='bg-white/10 border border-white/20 p-4 rounded-lg'><div className='flex items-center gap-3 mb-2'><svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' /></svg><span className='text-gray-300 text-sm'>Total Sessions</span></div><div className='text-3xl font-bold'>{totalSessions.toString()}</div></div><div className='bg-white/10 border border-white/20 p-4 rounded-lg'><div className='flex items-center gap-3 mb-2'><svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' /></svg><span className='text-gray-300 text-sm'>Average Duration</span></div><div className='text-3xl font-bold'>{formatDuration(avgDuration)}</div></div><div className='bg-white/10 border border-white/20 p-4 rounded-lg'><div className='flex items-center gap-3 mb-2'><svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' /></svg><span className='text-gray-300 text-sm'>Top Countries</span></div><div className='text-xl font-bold'>{topCountries.length > 0 ? topCountries.join(', ') : 'N/A'}</div></div></div><div className='bg-white/10 border border-white/20 p-4 sm:p-6 rounded-lg mb-6'><div className='text-xl font-semibold mb-4'>Add Session Metadata</div><div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'><div className='m-1'><label className='text-gray-200 block mb-1'>Chat Session ID *</label><input type='text' value={formData.chatsessionsid} onChange={function (e) {
            handleInputChange('chatsessionsid', e.target.value);
          }} className='bg-white text-gray-900 border border-gray-300 placeholder-gray-500 p-2 sm:p-3 rounded w-full' placeholder='Enter session ID' /></div><div className='m-1'><label className='text-gray-200 block mb-1'>Duration (seconds) *</label><input type='number' value={formData.duration_seconds} onChange={function (e) {
            handleInputChange('duration_seconds', e.target.value);
          }} className='bg-white text-gray-900 border border-gray-300 placeholder-gray-500 p-2 sm:p-3 rounded w-full' placeholder='Duration in seconds' /></div><div className='m-1'><label className='text-gray-200 block mb-1'>User 1 IP Hash</label><input type='text' value={formData.user1_ip_hash} onChange={function (e) {
            handleInputChange('user1_ip_hash', e.target.value);
          }} className='bg-white text-gray-900 border border-gray-300 placeholder-gray-500 p-2 sm:p-3 rounded w-full' placeholder='Anonymized IP hash' /></div><div className='m-1'><label className='text-gray-200 block mb-1'>User 2 IP Hash</label><input type='text' value={formData.user2_ip_hash} onChange={function (e) {
            handleInputChange('user2_ip_hash', e.target.value);
          }} className='bg-white text-gray-900 border border-gray-300 placeholder-gray-500 p-2 sm:p-3 rounded w-full' placeholder='Anonymized IP hash' /></div><div className='m-1'><label className='text-gray-200 block mb-1'>User 1 Country</label><input type='text' value={formData.user1_country} onChange={function (e) {
            handleInputChange('user1_country', e.target.value);
          }} className='bg-white text-gray-900 border border-gray-300 placeholder-gray-500 p-2 sm:p-3 rounded w-full' placeholder='Country code or name' /></div><div className='m-1'><label className='text-gray-200 block mb-1'>User 2 Country</label><input type='text' value={formData.user2_country} onChange={function (e) {
            handleInputChange('user2_country', e.target.value);
          }} className='bg-white text-gray-900 border border-gray-300 placeholder-gray-500 p-2 sm:p-3 rounded w-full' placeholder='Country code or name' /></div><div className='m-1'><label className='text-gray-200 block mb-1'>Ended By</label><select value={formData.ended_by} onChange={function (e) {
            handleInputChange('ended_by', e.target.value);
          }} className='bg-white text-gray-900 border border-gray-300 p-2 sm:p-3 rounded w-full'><option value=''>Select...</option><option value='user1'>User 1</option><option value='user2'>User 2</option><option value='timeout'>Timeout</option><option value='system'>System</option></select></div></div><div className='mt-4'><button onClick={handleSubmit} disabled={isLoading} className='p-3'>{isLoading ? "Saving..." : "Save Session Metadata"}</button></div></div><div className='bg-white/10 border border-white/20 p-4 rounded-lg mb-6'><div className='text-lg font-semibold mb-3'>Filters</div><div className='flex flex-col lg:flex-row gap-4'><div className='flex-1'><label className='text-gray-200 block mb-1'>Filter by Country</label><input type='text' value={filterCountry} onChange={function (e) {
            setFilterCountry(e.target.value);
          }} className='bg-white text-gray-900 border border-gray-300 placeholder-gray-500 p-2 sm:p-3 rounded w-full' placeholder='Enter country name' /></div><div className='flex-1'><label className='text-gray-200 block mb-1'>Date From</label><input type='date' value={filterDateFrom} onChange={function (e) {
            setFilterDateFrom(e.target.value);
          }} className='bg-white text-gray-900 border border-gray-300 p-2 sm:p-3 rounded w-full' /></div><div className='flex-1'><label className='text-gray-200 block mb-1'>Date To</label><input type='date' value={filterDateTo} onChange={function (e) {
            setFilterDateTo(e.target.value);
          }} className='bg-white text-gray-900 border border-gray-300 p-2 sm:p-3 rounded w-full' /></div></div></div><div className='bg-white/10 border border-white/20 rounded-lg overflow-hidden'><div className='text-lg font-semibold p-4 border-b border-white/20'>Recent Sessions</div>{filteredSessions.length === 0 ? <div className='p-6 text-center text-gray-400'>No sessions recorded yet. Use the form above to add session metadata.</div> : <div className='overflow-x-auto'><table className='w-full'><thead><tr className='border-b border-white/20'><th className='text-left p-3 text-gray-300'>Session ID</th><th className='text-left p-3 text-gray-300'>Duration</th><th className='text-left p-3 text-gray-300'>Countries</th><th className='text-left p-3 text-gray-300'>Ended By</th><th className='text-left p-3 text-gray-300'>Timestamp</th></tr></thead><tbody>{filteredSessions.map(function (session, index) {
              return <tr key={session.id || index} className='border-b border-white/10'><td className='p-3 font-mono text-sm'>{session.chatsessionsid.length > 8 ? session.chatsessionsid.substring(0, 8) + '...' : session.chatsessionsid}</td><td className='p-3'><span className='flex items-center gap-2'>{formatDuration(session.duration_seconds)}<span className={getDurationClass(session.duration_seconds) + ' px-2 py-1 rounded text-xs'}>{getDurationLabel(session.duration_seconds)}</span></span></td><td className='p-3'>{[session.user1_country, session.user2_country].filter(Boolean).join(', ') || 'N/A'}</td><td className='p-3 capitalize'>{session.ended_by || 'N/A'}</td><td className='p-3 text-sm text-gray-400'>{new Date(session.created_at).toLocaleString()}</td></tr>;
            })}</tbody></table></div>}</div></div>;
}