'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginContent() {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      toast.error(error);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error('ইমেইল এবং পাসওয়ার্ড আবশ্যক');
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      toast.error('সঠিক ফরম্যাটের ইমেইল অ্যাড্রেস লিখুন');
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
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 font-sans">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 space-y-6">
        
        {/* Title Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <FontAwesomeIcon icon={faSignInAlt} className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">অ্যাকাউন্টে সাইন ইন করুন</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">অর্ডার সম্পন্ন ও প্রোফাইল নিয়ন্ত্রণ করতে সাইন ইন করুন</p>
        </div>

        {/* Login Form (No Demo Buttons, No Placeholders, Email Regex) */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          <div>
            <label className="block font-extrabold text-slate-700 dark:text-slate-300 uppercase mb-1">
              ইমেইল অ্যাড্রেস <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <FontAwesomeIcon icon={faEnvelope} className="absolute left-3.5 top-3 w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block font-extrabold text-slate-700 dark:text-slate-300 uppercase mb-1">
              পাসওয়ার্ড <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <FontAwesomeIcon icon={faLock} className="absolute left-3.5 top-3 w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-xl border-none shadow-md transition-all flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <>
                <FontAwesomeIcon icon={faSignInAlt} className="w-4 h-4" />
                <span>সাইন ইন করুন</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
          নতুন গ্রাহক?{' '}
          <Link href="/signup" className="font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline">
            নতুন অ্যাকাউন্ট খুলুন
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-indigo-600"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
