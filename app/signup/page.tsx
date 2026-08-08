'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faEnvelope, faLock, faUser, faPhone, faMapMarkerAlt, faCity, faMailBulk } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupPage() {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.city.trim() || !formData.zipCode.trim()) {
      toast.error('ডাটাবেজের সকল বাধ্যতামূলক তথ্য পূরণ করুন');
      return;
    }

    if (!EMAIL_REGEX.test(formData.email)) {
      toast.error('সঠিক ফরম্যাটের ইমেইল অ্যাড্রেস লিখুন (যেমন: user@example.com)');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('পাসওয়ার্ড দুটি মিলছে না');
      return;
    }

    setIsLoading(true);
    try {
      const success = await signup({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        zipCode: formData.zipCode.trim()
      });

      if (!success) {
        setIsLoading(false);
      }
    } catch {
      toast.error('নিবন্ধন ব্যর্থ হয়েছে');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 font-sans">
      <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 space-y-6">
        
        {/* Title Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <FontAwesomeIcon icon={faUserPlus} className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">নতুন গ্রাহক অ্যাকাউন্ট নিবন্ধন</h1>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">ডাটাবেজের সকল প্রফাইল তথ্য সঠিকভাবে পূরণ করে সাইন-আপ করুন</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 font-sans">
          
          {/* Full Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                পূর্ণ নাম <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-3 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <FontAwesomeIcon icon={faUser} className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                ইমেইল অ্যাড্রেস <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-3 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <FontAwesomeIcon icon={faEnvelope} className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                পাসওয়ার্ড <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full pl-11 pr-3 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <FontAwesomeIcon icon={faLock} className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                পাসওয়ার্ড নিশ্চিতকরণ <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-3 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <FontAwesomeIcon icon={faLock} className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              মোবাইল নম্বর <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-3 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <FontAwesomeIcon icon={faPhone} className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Full Shipping Address */}
          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              বিস্তারিত ঠিকানা (গ্রাম/রোড/বাসা) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-3 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <FontAwesomeIcon icon={faMapMarkerAlt} className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* City & Zip Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                শহর / জেলা <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-3 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <FontAwesomeIcon icon={faCity} className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                পোস্টাল / জিও কোড <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-3 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <FontAwesomeIcon icon={faMailBulk} className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base rounded-2xl border-none shadow-md transition-all flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <>
                <FontAwesomeIcon icon={faUserPlus} className="w-4 h-4" />
                <span>অ্যাকাউন্ট নিবন্ধন করুন</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-sm font-bold text-slate-500 dark:text-slate-400">
          পূর্বেই অ্যাকাউন্ট খোলা রয়েছে?{' '}
          <Link href="/login" className="font-black text-indigo-600 dark:text-indigo-400 hover:underline">
            লগইন করুন
          </Link>
        </div>
      </div>
    </div>
  );
}
