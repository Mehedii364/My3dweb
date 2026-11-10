/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StorageService } from '../services/storageService';
import { Mail, Send, CheckCircle2, AlertCircle, MessageSquare, MapPin } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    website_trap: '', // Honeypot field for anti-spam
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Anti-spam honeypot detection
    if (formData.website_trap) {
      setStatus('success');
      setStatusMessage('Message received.');
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setStatusMessage('Please complete all required fields.');
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus('error');
      setStatusMessage('Please provide a valid email address.');
      return;
    }

    setStatus('submitting');

    setTimeout(() => {
      try {
        StorageService.saveMessage({
          name: formData.name,
          email: formData.email,
          subject: formData.subject || 'Direct Inquiry from MEHEDI 3D',
          message: formData.message,
        });

        setStatus('success');
        setStatusMessage(
          'Message saved securely to Md. Mehedi Hasan’s communication inbox. (Stored in database & owner inbox).'
        );
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          website_trap: '',
        });
      } catch (err: unknown) {
        setStatus('error');
        setStatusMessage('Could not transmit message. ' + (err as Error).message);
      }
    }, 600);
  };

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#1B254B] bg-[#070B18]">
      <div className="max-w-7xl mx-auto space-y-12 text-left">
        {/* Section Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#16BFFF]">
            <Mail className="w-4 h-4" />
            <span>Direct Inquiries</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Connect With Md. Mehedi Hasan
          </h2>
          <p className="text-base text-[#AAB7D4] max-w-2xl">
            Have a project in mind, an engineering collaboration, or interested in the Wafa Zone suite? Send a message directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-[#0B1430] border border-[#1B254B] rounded-2xl space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#16BFFF]" />
                <span>Communication Channels</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#AAB7D4] leading-relaxed">
                Messages submitted through this portal are saved to the persistent message ledger and can be reviewed in the Owner Portal.
              </p>

              <div className="space-y-3 pt-2 text-xs font-mono">
                <div className="flex items-center gap-3 p-3 bg-[#070B18] rounded-xl border border-[#1B254B]">
                  <Mail className="w-4 h-4 text-[#16BFFF] shrink-0" />
                  <div>
                    <span className="text-[#AAB7D4] block text-[10px]">DIRECT EMAIL</span>
                    <a href="mailto:useable.me2@gmail.com" className="text-white hover:text-[#16BFFF]">
                      useable.me2@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-[#070B18] rounded-xl border border-[#1B254B]">
                  <MapPin className="w-4 h-4 text-[#8B45FF] shrink-0" />
                  <div>
                    <span className="text-[#AAB7D4] block text-[10px]">GEOGRAPHIC REGION</span>
                    <span className="text-white">Bangladesh (GMT+6)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 bg-[#0B1430] border border-[#1B254B] rounded-2xl shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Anti-spam honeypot (invisible to real users) */}
              <input
                type="text"
                name="website_trap"
                value={formData.website_trap}
                onChange={(e) => setFormData({ ...formData, website_trap: e.target.value })}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#AAB7D4]">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. John Doe"
                    className="w-full bg-[#070B18] border border-[#1B254B] focus:border-[#16BFFF] text-white text-xs px-3.5 py-2.5 rounded-xl outline-none placeholder-[#AAB7D4]/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#AAB7D4]">
                    Your Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. john@example.com"
                    className="w-full bg-[#070B18] border border-[#1B254B] focus:border-[#16BFFF] text-white text-xs px-3.5 py-2.5 rounded-xl outline-none placeholder-[#AAB7D4]/40"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#AAB7D4]">
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Collaboration on Wafa Zone / Web Application"
                  className="w-full bg-[#070B18] border border-[#1B254B] focus:border-[#16BFFF] text-white text-xs px-3.5 py-2.5 rounded-xl outline-none placeholder-[#AAB7D4]/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#AAB7D4]">
                  Your Message *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Detail your request, project scope, or inquiry..."
                  className="w-full bg-[#070B18] border border-[#1B254B] focus:border-[#16BFFF] text-white text-xs p-3.5 rounded-xl outline-none placeholder-[#AAB7D4]/40 resize-none"
                />
              </div>

              {/* Status Banner */}
              {status === 'success' && (
                <div className="p-3.5 bg-emerald-950/60 border border-emerald-500/50 rounded-xl flex items-center gap-2.5 text-xs text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              )}

              {status === 'error' && (
                <div className="p-3.5 bg-red-950/60 border border-red-500/50 rounded-xl flex items-center gap-2.5 text-xs text-red-300">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#16BFFF] to-[#00E5FF] text-[#070B18] font-bold text-xs rounded-xl shadow-lg shadow-[#16BFFF]/20 hover:brightness-110 transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{status === 'submitting' ? 'Saving to Database...' : 'Transmit Message'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
