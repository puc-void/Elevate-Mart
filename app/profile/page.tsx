'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faBuilding,
  faSave
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    avatar: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '০১৮০০-২২২৩৩৩',
        address: user.address || 'ধানমন্ডি ২৭, রোড ৮/এ',
        city: user.city || 'ঢাকা',
        zipCode: user.zipCode || '১২০৯',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-profile',
          ...formData
        })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('প্রোফাইল তথ্য সফলভাবে আপডেট হয়েছে!');
        await refreshUser();
      } else {
        toast.error(data.error || 'প্রোফাইল আপডেট করা সম্ভব হয়নি');
      }
    } catch {
      toast.error('একটি ত্রুটি ঘটেছে');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">আমার অ্যাকাউন্ট প্রোফাইল</h1>
        <p className="text-sm text-slate-500 mt-1">আপনার ব্যক্তিগত তথ্য, যোগাযোগের ফোন নম্বর ও ডেলিভারি ঠিকানা পরিবর্তন করুন</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        
        {/* Profile Card Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <img
            src={formData.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Profile'}
            alt=""
            className="w-16 h-16 rounded-full border-2 border-indigo-600 shadow-md object-cover"
          />
          <div>
            <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
            <p className="text-xs text-slate-500">{user.email}</p>
            <span className={`inline-block mt-1 text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
              user.role === 'admin' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
            }`}>
              {user.role === 'admin' ? 'অ্যাডমিন অ্যাকাউন্ট' : 'গ্রাহক অ্যাকাউন্ট'}
            </span>
          </div>
        </div>

        {/* Edit Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6 font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                পূর্ণ নাম
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                />
                <FontAwesomeIcon icon={faUser} className="absolute left-3 top-3.5 w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                ইমেইল অ্যাড্রেস (পরিবর্তনযোগ্য নয়)
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                />
                <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-3.5 w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                মোবাইল নম্বর
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                />
                <FontAwesomeIcon icon={faPhone} className="absolute left-3 top-3.5 w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                শহর / জেলা
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                />
                <FontAwesomeIcon icon={faBuilding} className="absolute left-3 top-3.5 w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                ডিফল্ট ডেলিভারি ঠিকানা
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                />
                <FontAwesomeIcon icon={faMapMarkerAlt} className="absolute left-3 top-3.5 w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="btn btn-sm bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl border-none px-6 flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faSave} className="w-3.5 h-3.5" />
              <span>{isSaving ? 'সংরক্ষণ হচ্ছে...' : 'তথ্য সংরক্ষণ করুন'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
