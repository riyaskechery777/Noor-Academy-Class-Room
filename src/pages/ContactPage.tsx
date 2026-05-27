import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, MessageCircle, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-20">
      {/* Hero */}
      <section className="gradient-hero pattern-overlay py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Get In Touch</h1>
          <p className="text-white/80 text-lg">
            Have questions about our programs? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Contact Information</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Reach out to us through any of these channels.</p>
            </div>

            {[
              {
                icon: MapPin,
                title: 'Our Location',
                lines: ['123 Islamic Education Street', 'Knowledge City, 12345'],
              },
              {
                icon: Phone,
                title: 'Phone Number',
                lines: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
              },
              {
                icon: Mail,
                title: 'Email Address',
                lines: ['info@hiraaschool.edu', 'admissions@hiraaschool.edu'],
              },
              {
                icon: Clock,
                title: 'Office Hours',
                lines: ['Monday - Friday: 9AM - 6PM', 'Saturday: 10AM - 4PM'],
              },
            ].map((item, i) => (
              <div key={i} className="card p-5 flex gap-4">
                <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{item.title}</p>
                  {item.lines.map((line, j) => (
                    <p key={j} className="text-gray-500 dark:text-gray-400 text-sm">{line}</p>
                  ))}
                </div>
              </div>
            ))}

            <div className="card p-6 bg-emerald-700 dark:bg-emerald-800 border-0 text-center">
              <p className="font-arabic text-2xl text-gold-300 mb-2">السَّلَامُ عَلَيْكُمْ</p>
              <p className="text-emerald-100 text-sm">"Peace be upon you"</p>
              <p className="text-emerald-200 text-xs mt-2">We welcome all inquiries with warmth and sincerity.</p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="card p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Thank you for reaching out. We'll get back to you within 24 hours, InshaAllah.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                    className="btn-primary"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Send Us a Message</h2>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">We typically respond within 24 hours</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="label">Your Name</label>
                        <input
                          type="text"
                          required
                          placeholder="Ahmed Al-Rashid"
                          value={form.name}
                          onChange={e => setForm({ ...form, name: e.target.value })}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="label">Email Address</label>
                        <input
                          type="email"
                          required
                          placeholder="ahmed@example.com"
                          value={form.email}
                          onChange={e => setForm({ ...form, email: e.target.value })}
                          className="input-field"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="label">Subject</label>
                      <select
                        value={form.subject}
                        onChange={e => setForm({ ...form, subject: e.target.value })}
                        required
                        className="input-field"
                      >
                        <option value="">Select a subject</option>
                        <option value="admissions">Admissions Inquiry</option>
                        <option value="courses">Course Information</option>
                        <option value="technical">Technical Support</option>
                        <option value="fees">Fees & Payment</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="label">Message</label>
                      <textarea
                        required
                        rows={5}
                        placeholder="Write your message here..."
                        value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                        className="input-field resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
