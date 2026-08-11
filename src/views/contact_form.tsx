'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function () {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const handleInputChange = e => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (submitStatus === 'error') {
      setSubmitStatus(null);
      setErrorMessage('');
    }
  };
  const isValidEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSubmitStatus('error');
      setErrorMessage("Please fill in all required fields");
      return;
    }
    if (!isValidEmail(formData.email)) {
      setSubmitStatus('error');
      setErrorMessage("Please enter a valid email address");
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');
    try {
      const response = await fetch('/api/contactsubmit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim()
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        setSubmitStatus('error');
        setErrorMessage(errorData.message || "We couldn't send your message. Please try again.");
        return;
      }
      const data = await response.json();
      if (data.success) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.message || "We couldn't send your message. Please try again.");
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitStatus('error');
      setErrorMessage("We couldn't send your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleSendAnother = () => {
    setSubmitStatus(null);
    setErrorMessage('');
  };
  return <div className='contact-container max-w-2xl mx-auto p-6'><div className='text-center mb-8'><h2 className='text-3xl font-bold mb-3'>Contact Us</h2><p className='text-lg'>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p></div>{submitStatus === 'success' ? <div className='bg-green-50 border border-green-200 rounded-xl p-8 text-center'><div className='text-green-600 mb-4'><svg className='w-16 h-16 mx-auto' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7' /></svg></div><h3 className='text-xl font-semibold text-green-800 mb-2'>Message Sent!</h3><p className='text-green-700 mb-6'>Thank you for reaching out. We'll get back to you as soon as possible.</p><button onClick={handleSendAnother} className='px-6 py-2 rounded-lg font-medium'>Send Another Message</button></div> : <form onSubmit={handleSubmit} className='space-y-6'><div className='grid grid-cols-1 md:grid-cols-2 gap-6'><div><label htmlFor='name' className='block text-sm font-medium mb-2'>Name<span className='text-red-500 ml-1'>*</span></label><input type='text' id='name' name='name' value={formData.name} onChange={handleInputChange} placeholder='Your name' className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition' disabled={isSubmitting} required={true} /></div><div><label htmlFor='email' className='block text-sm font-medium mb-2'>Email<span className='text-red-500 ml-1'>*</span></label><input type='email' id='email' name='email' value={formData.email} onChange={handleInputChange} placeholder='your@email.com' className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition' disabled={isSubmitting} required={true} /></div></div><div><label htmlFor='subject' className='block text-sm font-medium mb-2'>Subject</label><input type='text' id='subject' name='subject' value={formData.subject} onChange={handleInputChange} placeholder='What is this about?' className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition' disabled={isSubmitting} /></div><div><label htmlFor='message' className='block text-sm font-medium mb-2'>Message<span className='text-red-500 ml-1'>*</span></label><textarea id='message' name='message' value={formData.message} onChange={handleInputChange} placeholder='Your message...' rows={6} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none' disabled={isSubmitting} required={true} /></div>{submitStatus === 'error' && <div className='bg-red-50 border border-red-200 rounded-lg p-4'><div className='flex items-start'><svg className='w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' /></svg><div className='flex-1'><p className='text-sm text-red-800 font-medium'>Something went wrong</p><p className='text-sm text-red-700 mt-1'>{errorMessage}</p></div></div></div>}<button type='submit' disabled={isSubmitting} className={'w-full py-3 px-6 rounded-lg font-medium text-lg ' + (isSubmitting ? 'cursor-not-allowed opacity-50' : '')}>{isSubmitting ? "Sending..." : "Send Message"}</button></form>}</div>;
}