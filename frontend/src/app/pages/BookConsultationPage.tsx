import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, AlertCircle, Loader2, Calendar } from 'lucide-react';
import API_BASE from '../../config/api';

export function BookConsultationPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    businessName: '',
    businessCategory: '',
    city: '',
    service: '',
    otherService: '',
    description: ''
  });
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const servicesList = [
    'Company Registration',
    'GST Registration',
    'ITR Filing',
    'Trademark Registration',
    'Accounting & Bookkeeping',
    'Compliance Support',
    'Other'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    if (!formData.name || !formData.phone) {
      setStatus('error');
      setMessage('Name and Phone are required.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/consultations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus('success');
        setMessage('Your inquiry has been submitted! Redirecting to WhatsApp...');

        // Construct WhatsApp message
        const serviceText = formData.service === 'Other' && formData.otherService ? formData.otherService : formData.service;
        const whatsappMessage = `*New Book Inquiry*\n\n*Name:* ${formData.name}\n*Phone:* ${formData.phone}\n*Business Name:* ${formData.businessName || 'N/A'}\n*Category:* ${formData.businessCategory || 'N/A'}\n*City:* ${formData.city || 'N/A'}\n*Service Needed:* ${serviceText || 'N/A'}\n*Description:* ${formData.description || 'N/A'}`;
        
        const whatsappUrl = `https://wa.me/919153832948?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank');

        setFormData({
          name: '',
          phone: '',
          businessName: '',
          businessCategory: '',
          city: '',
          service: '',
          otherService: '',
          description: ''
        });
      } else {
        const errorData = await response.json();
        setStatus('error');
        setMessage(errorData.message || 'Failed to submit request.');
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
        className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Inquiry</h1>
          <p className="text-gray-500 text-center">Get expert financial and legal guidance for your business.</p>
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-blue-100 bg-blue-50 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-800"
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
                className="w-full px-4 py-3 rounded-xl border border-blue-100 bg-blue-50 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-800"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-blue-100 bg-blue-50 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Category</label>
              <input
                type="text"
                name="businessCategory"
                value={formData.businessCategory}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-blue-100 bg-blue-50 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-blue-100 bg-blue-50 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">What service do you need?</label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-blue-100 bg-blue-50 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-700 appearance-none cursor-pointer"
              >
                <option value="">— Select a service —</option>
                {servicesList.map(service => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {formData.service === 'Other' && (
            <div>
              <input
                type="text"
                name="otherService"
                value={formData.otherService}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-blue-100 bg-blue-50 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-800"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brief Description (Optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-blue-100 bg-blue-50 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-y text-gray-800"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full mt-4 bg-blue-600 text-white font-semibold py-4 rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Calendar className="w-5 h-5 mr-2" />
                Book Inquiry
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
