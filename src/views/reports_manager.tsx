'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function () {
  const [formData, setFormData] = useState({
    reporter_userid: '',
    reported_userid: '',
    chatsessionsid: '',
    reason: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState({
    type: '',
    text: ''
  });
  const [recentReports, setRecentReports] = useState([]);
  const reasonOptions = [{
    value: 'harassment',
    label: 'Harassment'
  }, {
    value: 'inappropriate_content',
    label: 'Inappropriate Content'
  }, {
    value: 'spam',
    label: 'Spam'
  }, {
    value: 'underage',
    label: 'Underage User'
  }, {
    value: 'other',
    label: 'Other'
  }];
  const handleInputChange = function (field, value) {
    setFormData(function (prev) {
      return Object.assign({}, prev, {
        [field]: value
      });
    });
  };
  const handleSubmit = async function () {
    if (!formData.reporter_userid || !formData.reported_userid || !formData.reason) {
      setModalMessage({
        type: 'error',
        text: 'Please fill in all required fields.'
      });
      setShowModal(true);
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/reportuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.status === 401) {
        setModalMessage({
          type: 'error',
          text: 'You are not authorized to submit reports.'
        });
        setShowModal(true);
        setIsSubmitting(false);
        return;
      }
      const data = await response.json();
      if (data.success) {
        setModalMessage({
          type: 'success',
          text: data.message || 'Report submitted successfully.'
        });
        setRecentReports(function (prev) {
          return [{
            id: data.report_id,
            reporter_userid: formData.reporter_userid,
            reported_userid: formData.reported_userid,
            chatsessionsid: formData.chatsessionsid,
            reason: formData.reason,
            description: formData.description,
            status: 'pending',
            created_at: new Date().toISOString()
          }].concat(prev).slice(0, 5);
        });
        setFormData({
          reporter_userid: '',
          reported_userid: '',
          chatsessionsid: '',
          reason: '',
          description: ''
        });
      } else {
        setModalMessage({
          type: 'error',
          text: 'Failed to submit report. Please try again.'
        });
      }
      setShowModal(true);
    } catch (error) {
      setModalMessage({
        type: 'error',
        text: 'An error occurred. Please try again.'
      });
      setShowModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  const closeModal = function () {
    setShowModal(false);
  };
  const getReasonLabel = function (reason) {
    const found = reasonOptions.find(function (r) {
      return r.value === reason;
    });
    return found ? found.label : reason;
  };
  const getReasonBadgeClass = function (reason) {
    const classes = {
      harassment: 'bg-red-600 text-white',
      inappropriate_content: 'bg-orange-500 text-white',
      spam: 'bg-yellow-500 text-gray-900',
      underage: 'bg-purple-600 text-white',
      other: 'bg-gray-500 text-white'
    };
    return classes[reason] || 'bg-gray-500 text-white';
  };
  return <div className='w-full p-2 sm:p-4 md:p-6 lg:p-8'><h1 className='text-2xl font-bold mb-4 sm:mb-6'>Reports Manager</h1><p className='mb-6 text-gray-300'>Submit and track user reports for inappropriate behavior</p><div className='flex flex-col lg:flex-row gap-4 sm:gap-6'><div className='w-full lg:w-1/2 bg-white/10 border border-white/20 p-3 sm:p-4 md:p-6 rounded-lg'><h2 className='text-xl font-semibold mb-4'>Submit New Report</h2><div className='m-2 sm:m-3'><label className='text-gray-200 block mb-1'>Reporter User ID *</label><input type='text' className='bg-white text-gray-900 border border-gray-300 placeholder-gray-500 p-2 sm:p-3 rounded w-full' placeholder='Enter reporter user ID' value={formData.reporter_userid} onChange={function (e) {
            handleInputChange('reporter_userid', e.target.value);
          }} /></div><div className='m-2 sm:m-3'><label className='text-gray-200 block mb-1'>Reported User ID *</label><input type='text' className='bg-white text-gray-900 border border-gray-300 placeholder-gray-500 p-2 sm:p-3 rounded w-full' placeholder='Enter reported user ID' value={formData.reported_userid} onChange={function (e) {
            handleInputChange('reported_userid', e.target.value);
          }} /></div><div className='m-2 sm:m-3'><label className='text-gray-200 block mb-1'>Chat Session ID</label><input type='text' className='bg-white text-gray-900 border border-gray-300 placeholder-gray-500 p-2 sm:p-3 rounded w-full' placeholder='Enter chat session ID (optional)' value={formData.chatsessionsid} onChange={function (e) {
            handleInputChange('chatsessionsid', e.target.value);
          }} /></div><div className='m-2 sm:m-3'><label className='text-gray-200 block mb-1'>Reason *</label><select className='bg-white text-gray-900 border border-gray-300 p-2 sm:p-3 rounded w-full' value={formData.reason} onChange={function (e) {
            handleInputChange('reason', e.target.value);
          }}><option value=''>Select a reason</option>{reasonOptions.map(function (option) {
              return <option key={option.value} value={option.value}>{option.label}</option>;
            })}</select></div><div className='m-2 sm:m-3'><label className='text-gray-200 block mb-1'>Detailed Description</label><textarea className='bg-white text-gray-900 border border-gray-300 placeholder-gray-500 p-2 sm:p-3 rounded w-full' rows={4} placeholder='Provide additional details about the incident...' value={formData.description} onChange={function (e) {
            handleInputChange('description', e.target.value);
          }} /></div><div className='m-2 sm:m-3'><button className='p-3 sm:p-4 w-full rounded-lg font-medium' onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit Report"}</button></div></div><div className='w-full lg:w-1/2 bg-white/10 border border-white/20 p-3 sm:p-4 md:p-6 rounded-lg'><h2 className='text-xl font-semibold mb-4'>Recently Submitted</h2><p className='text-sm text-gray-400 mb-4'>Reports submitted during this session</p>{recentReports.length === 0 ? <div className='text-center py-12'><svg className='w-16 h-16 mx-auto mb-4 text-gray-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' /></svg><p className='text-gray-400'>No reports submitted yet</p></div> : <div className='space-y-3'>{recentReports.map(function (report) {
            return <div key={report.id} className='bg-white/5 border border-white/10 p-3 sm:p-4 rounded-lg'><div className='flex flex-wrap items-center gap-2 mb-3'><span className='px-2 py-1 text-xs rounded-full bg-yellow-500 text-gray-900 font-medium'>Pending</span><span className={'px-2 py-1 text-xs rounded-full ' + getReasonBadgeClass(report.reason)}>{getReasonLabel(report.reason)}</span></div><div className='space-y-1 text-sm'><p><span className='text-gray-400'>Reporter: </span><span className='font-mono text-xs'>{report.reporter_userid}</span></p><p><span className='text-gray-400'>Reported: </span><span className='font-mono text-xs'>{report.reported_userid}</span></p>{report.chatsessionsid && <p><span className='text-gray-400'>Session: </span><span className='font-mono text-xs'>{report.chatsessionsid}</span></p>}{report.description && <p className='mt-2 text-gray-300 italic'>{'"' + report.description.substring(0, 100) + (report.description.length > 100 ? '...' : '') + '"'}</p>}</div><p className='text-xs text-gray-500 mt-2'>{new Date(report.created_at).toLocaleString()}</p></div>;
          })}</div>}</div></div>{showModal && <div className='fixed inset-0 z-50 flex items-center justify-center p-4'><div className='absolute inset-0 bg-black bg-opacity-50' onClick={closeModal} /><div className='relative bg-white p-6 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-lg text-gray-900'><button onClick={closeModal} className='absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold'>×</button><div className='text-center pt-4'>{modalMessage.type === 'success' ? <svg className='w-16 h-16 mx-auto mb-4 text-green-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' /></svg> : <svg className='w-16 h-16 mx-auto mb-4 text-red-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' /></svg>}<h3 className='text-lg font-semibold mb-2 text-gray-900'>{modalMessage.type === 'success' ? "Report Submitted" : "Submission Error"}</h3><p className='text-gray-600'>{modalMessage.text}</p></div></div></div>}</div>;
}