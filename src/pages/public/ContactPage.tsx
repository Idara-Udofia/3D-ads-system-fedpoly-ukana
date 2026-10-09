import React, { useState } from 'react';
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  Send,
  Compass,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import api from '../../services/api';
import confetti from 'canvas-confetti';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Admission Inquiry');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setError('Please provide your name, email, and message.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await api.submitEnquiry({
        name,
        email,
        phone,
        subject,
        message,
      });

      setSuccess(true);
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
          <MapPin className="w-4 h-4" />
          <span>Communications & Admissions Helpdesk</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
          Contact Federal Polytechnic, Ukana
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          We welcome prospective candidates, parents, guardians, and academic researchers. Reach out to our admissions officers or submit an online inquiry.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <h3 className="text-lg font-bold font-serif">
              Administrative Headquarters
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Campus Address</span>
                  <span>Federal Polytechnic, Ukana</span>
                  <span className="block text-slate-400">Essien Udim Local Government Area</span>
                  <span className="block text-slate-400">Akwa Ibom State, Nigeria</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Email Enquiries</span>
                  <span>admissions@fedpolyukana.edu.ng</span>
                  <span className="block text-slate-400">info@fedpolyukana.edu.ng</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Telephone / Helpdesk</span>
                  <span>+234 (0) 803 000 0000</span>
                  <span className="block text-slate-400">Mon - Fri: 8:00 AM - 4:00 PM</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Office Working Hours</span>
                  <span>Monday – Friday: 08:00 – 16:00 (WAT)</span>
                  <span className="block text-slate-400">Closed on Federal Public Holidays</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <a
                href="/campus"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Compass className="w-4 h-4" />
                <span>Locate Campus on 3D Map</span>
              </a>
            </div>
          </div>
        </div>

        {/* Enquiry Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <h3 className="text-xl font-bold text-slate-900 font-serif mb-1">
            Send an Admission or General Enquiry
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            All submitted inquiries are recorded directly into the administrative database for staff follow-up.
          </p>

          {success ? (
            <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="text-base font-bold text-slate-900">Enquiry Received Successfully!</h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Thank you for contacting Federal Polytechnic, Ukana. Our academic admissions officers will review your submission and reply shortly.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-3 px-4 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-lg"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Victor Udo"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subject / Area
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Admission Inquiry">Admission Inquiry & JAMB Cut-off</option>
                    <option value="Programme Curricula">Academic Programmes & ND Syllabus</option>
                    <option value="Hostel Accommodation">Hostel Bed-Space & Facilities</option>
                    <option value="Campus Tour">Campus Tour & Physical Inspection</option>
                    <option value="General Support">General Support</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Message Details *
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide details about your query..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                {submitting ? 'Submitting to Admissions...' : 'Send Message to Polytechnic'}
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
