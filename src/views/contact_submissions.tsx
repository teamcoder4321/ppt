'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function () {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const formatDate = dateString => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      return dateString;
    }
  };
  const getStatusBadge = status => {
    const styles = {
      new: 'bg-blue-100 text-blue-800',
      read: 'bg-gray-100 text-gray-800',
      replied: 'bg-green-100 text-green-800',
      archived: 'bg-yellow-100 text-yellow-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };
  const fetchMessages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let url = '/api/contactlist';
      if (statusFilter) {
        url += '?status=' + statusFilter;
      }
      const response = await fetch(url, {
        method: 'GET'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data = await response.json();
      if (data.success && data.data) {
        setMessages(data.data);
        setTotalCount(data.total || data.data.length);
      } else {
        setError('fetch-failed');
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('fetch-error');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchMessages();
  }, [statusFilter]);
  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch('/api/contactupdate', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id,
          status: newStatus
        })
      });
      if (response.ok) {
        fetchMessages();
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage({
            ...selectedMessage,
            status: newStatus
          });
        }
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };
  const deleteMessage = async id => {
    if (!confirm("Are you sure you want to delete this message?")) {
      return;
    }
    try {
      const response = await fetch('/api/contactdelete?id=' + id, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchMessages();
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage(null);
        }
      }
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };
  const viewMessage = message => {
    setSelectedMessage(message);
    if (message.status === 'new') {
      updateStatus(message.id, 'read');
    }
  };
  if (isLoading) {
    return <div className='contact-admin-container p-6'><div className='flex justify-center items-center min-h-[400px]'><div className='text-center'><div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4' /><p>Loading messages...</p></div></div></div>;
  }
  if (error) {
    return <div className='contact-admin-container p-6'><div className='max-w-md mx-auto mt-12 bg-red-50 border border-red-200 rounded-lg p-6 text-center'><svg className='w-12 h-12 text-red-600 mx-auto mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' /></svg><h3 className='text-lg font-semibold text-red-800 mb-2'>Error loading messages</h3><button onClick={fetchMessages} className='px-4 py-2 rounded-lg font-medium mt-4'>Retry</button></div></div>;
  }
  const messageModal = selectedMessage && <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'><div className='bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden'><div className='flex justify-between items-center p-6 border-b'><h2 className='text-xl font-bold text-gray-900'>{selectedMessage.subject || "(No subject)"}</h2><button onClick={() => setSelectedMessage(null)} className='p-2 !bg-transparent !text-gray-700 border border-current rounded-lg text-2xl leading-none'>×</button></div><div className='p-6 overflow-y-auto' style={{
        maxHeight: 'calc(90vh - 200px)'
      }}><div className='space-y-4'><div className='flex items-center gap-4'><div className='flex-1'><p className='font-semibold text-gray-900'>{selectedMessage.name}</p><p className='text-gray-600'>{selectedMessage.email}</p></div><span className={'px-3 py-1 rounded-full text-sm font-medium ' + getStatusBadge(selectedMessage.status)}>{selectedMessage.status}</span></div><p className='text-sm text-gray-500'>{formatDate(selectedMessage.created_at)}</p><div className='border-t pt-4'><p className='text-gray-800 whitespace-pre-wrap'>{selectedMessage.message}</p></div></div></div><div className='p-6 border-t flex justify-between items-center gap-3'><div className='flex gap-2'>{selectedMessage.status !== 'replied' && <button onClick={() => updateStatus(selectedMessage.id, 'replied')} className='px-3 py-1.5 !bg-transparent !text-gray-700 border border-current rounded-lg text-sm'>Mark as Replied</button>}{selectedMessage.status !== 'archived' && <button onClick={() => updateStatus(selectedMessage.id, 'archived')} className='px-3 py-1.5 !bg-transparent !text-gray-700 border border-current rounded-lg text-sm'>Archive</button>}</div><button onClick={() => setSelectedMessage(null)} className='px-4 py-2 rounded-lg font-medium'>Close</button></div></div></div>;
  return <div className='contact-admin-container p-6'>{messageModal}<div className='mb-6'><div className='flex justify-between items-start flex-wrap gap-4'><div><h1 className='text-2xl font-bold mb-2'>Contact Submissions</h1><p>Manage and respond to contact form submissions</p></div><div className='text-right'><div className='text-sm mb-1'>Total Messages</div><div className='text-2xl font-bold'>{totalCount.toLocaleString()}</div></div></div></div><div className='mb-6 flex gap-2 flex-wrap'><button onClick={() => setStatusFilter('')} className={'px-4 py-2 rounded-lg text-sm font-medium ' + (statusFilter === '' ? 'bg-blue-600 text-white' : '!bg-transparent !text-gray-700 border border-current')}>All</button><button onClick={() => setStatusFilter('new')} className={'px-4 py-2 rounded-lg text-sm font-medium ' + (statusFilter === 'new' ? 'bg-blue-600 text-white' : '!bg-transparent !text-gray-700 border border-current')}>New</button><button onClick={() => setStatusFilter('read')} className={'px-4 py-2 rounded-lg text-sm font-medium ' + (statusFilter === 'read' ? 'bg-blue-600 text-white' : '!bg-transparent !text-gray-700 border border-current')}>Read</button><button onClick={() => setStatusFilter('replied')} className={'px-4 py-2 rounded-lg text-sm font-medium ' + (statusFilter === 'replied' ? 'bg-blue-600 text-white' : '!bg-transparent !text-gray-700 border border-current')}>Replied</button><button onClick={() => setStatusFilter('archived')} className={'px-4 py-2 rounded-lg text-sm font-medium ' + (statusFilter === 'archived' ? 'bg-blue-600 text-white' : '!bg-transparent !text-gray-700 border border-current')}>Archived</button></div>{messages.length === 0 ? <div className='bg-gray-50 border border-gray-200 rounded-lg p-12 text-center'><svg className='w-16 h-16 mx-auto mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' /></svg><h3 className='text-lg font-semibold mb-2'>No messages yet</h3><p>Contact form submissions will appear here.</p></div> : <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'><div className='overflow-x-auto'><table className='w-full'><thead><tr className='bg-gray-50 border-b border-gray-200'><th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>Name</th><th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>Subject</th><th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>Status</th><th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>Date</th><th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>Actions</th></tr></thead><tbody className='divide-y divide-gray-200'>{messages.map(item => <tr key={item.id} className={item.status === 'new' ? 'bg-blue-50' : ''}><td className='px-6 py-4'><div><div className='text-sm font-medium text-gray-900'>{item.name}</div><div className='text-sm text-gray-500'>{item.email}</div></div></td><td className='px-6 py-4'><div className='text-sm text-gray-900 max-w-xs truncate'>{item.subject || "(No subject)"}</div></td><td className='px-6 py-4'><span className={'px-2 py-1 rounded-full text-xs font-medium ' + getStatusBadge(item.status)}>{item.status}</span></td><td className='px-6 py-4 whitespace-nowrap'><div className='text-sm text-gray-500'>{formatDate(item.created_at)}</div></td><td className='px-6 py-4'><div className='flex gap-2'><button onClick={() => viewMessage(item)} className='px-2 py-1 !bg-transparent !text-gray-700 border border-current rounded-lg text-sm'>View</button><button onClick={() => deleteMessage(item.id)} className='px-2 py-1 !bg-transparent !text-gray-700 border border-current rounded-lg text-sm'>Delete</button></div></td></tr>)}</tbody></table></div></div>}</div>;
}