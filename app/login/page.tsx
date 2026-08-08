'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faEnvelope, faLock, faExclamationTriangle, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginContent() {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const urlError = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error('ইমেইল ও পাসওয়ার্ড প্রদান করুন');
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      toast.error('সঠিক ফরম্যাটের ইমেইল অ্যাড্রেস লিখুন (যেমন: user@example.com)');
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(email.trim(), password);
      if (!success) {
        setIsLoading(false);
      }
    } catch {
      toast.error('লগইন ব্যর্থ হয়েছে');
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans">
      
      {/* E-Commerce High-Res Shopping Background Image Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 dark:opacity-30 scale-105 transition-transform duration-1000"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1920&q=80')"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-indigo-950/70 to-slate-950/90 backdrop-blur-sm" />

      {/* Form Card */}
      <div className="relative z-10 max-w-md w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl border border-white/40 dark:border-slate-800 shadow-2xl p-8 space-y-6">
        
        {/* Title Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <FontAwesomeIcon icon={faSignInAlt} className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">অ্যাকাউন্টে সাইন ইন করুন</h1>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">আপনার নথিভুক্ত ইমেইল ও পাসওয়ার্ড দিয়ে প্রবেশ করুন</p>
        </div>

        {/* URL Route Guard Notice Alert */}
        {urlError && (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-2xl text-amber-900 dark:text-amber-300 text-xs font-bold flex items-center gap-3">
            <FontAwesomeIcon icon={faExclamationTriangle} className="w-5 h-5 text-amber-600 shrink-0" />
            <span>{urlError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 font-sans">
          
          {/* Email Field */}
          <div>
            <label className="block text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              ইমেইল অ্যাড্রেস <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
              <FontAwesomeIcon icon={faEnvelope} className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Password Field with Show/Hide Toggle Button */}
          <div>
            <label className="block text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              পাসওয়ার্ড <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-11 pr-11 py-3 bg-slate-50/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
              <FontAwesomeIcon icon={faLock} className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
              
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                title={showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base rounded-2xl border-none shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <>
                <FontAwesomeIcon icon={faSignInAlt} className="w-4 h-4" />
                <span>সাইন ইন করুন</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-sm font-bold text-slate-500 dark:text-slate-400">
          নতুন গ্রাহক?{' '}
          <Link href="/signup" className="font-black text-indigo-600 dark:text-indigo-400 hover:underline">
            নিবন্ধন করুন
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">পেজ লোড হচ্ছে...</div>}>
      <LoginContent />
    </Suspense>
  );
}
