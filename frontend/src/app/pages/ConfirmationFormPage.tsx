import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import API_BASE from '../../config/api';

export function ConfirmationFormPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    // Basic validation
    if (!formData.name || !formData.phone || !formData.email) {
      setStatus('error');
      setMessage('All fields are required.');
      return;
    }

    if (!formData.email.toLowerCase().endsWith('@gmail.com')) {
      setStatus('error');
      setMessage('Please enter a valid Gmail address.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/confirmations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus('success');
        setMessage('Your confirmation has been submitted successfully!');
        setFormData({ name: '', phone: '', email: '' });
      } else {
        const errorData = await response.json();
        setStatus('error');
        setMessage(errorData.message || 'Failed to submit form.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
      setMessage('Network error. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Confirmation Form</h1>
          <p className="text-gray-500">For Internship Program</p>
        </div>

        {status === 'success' && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 text-green-700">
            <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{message}</p>
          </div>
        )}

        {status === 'error' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +91 9876543210"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gmail Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@gmail.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full mt-4 bg-blue-600 text-white font-semibold py-3.5 rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Confirmation'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
