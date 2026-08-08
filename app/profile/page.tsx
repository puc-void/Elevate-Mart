'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faCity,
  faMailBulk,
  faEdit,
  faTimes,
  faCheckCircle,
  faShieldAlt,
  faSave,
  faImage
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

const BANGLADESH_DISTRICTS = [
  'ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'সিলেট', 'রংপুর', 'ময়মনসিংহ',
  'কুমিল্লা', 'বগুড়া', 'গাজীপুর', 'নারায়ণগঞ্জ', 'কক্সবাজার', 'যশোর', 'দিনাজপুর', 'পাবনা',
  'টাঙ্গাইল', 'কুষ্টিয়া', 'ফরিদপুর', 'নোয়াখালী', 'ফেনী', 'ব্রাহ্মণবাড়িয়া', 'চাঁদপুর', 'লক্ষ্মীপুর',
  'সিরাজগঞ্জ', 'নওগাঁ', 'নাটোর', 'চাঁপাইনবাবগঞ্জ', 'জয়পুরহাট', 'কুড়িগ্রাম', 'গাইবান্ধা', 'লালমনিরহাট',
  'নীলফামারী', 'পঞ্চগড়', 'ঠাকুরগাঁও', 'পটুয়াখালী', 'বরগুনা', 'ভোলা', 'ঝালকাঠি', 'পিরোজপুর',
  'হবিগঞ্জ', 'মৌলভীবাজার', 'সুনামগঞ্জ', 'নেত্রকোণা', 'শেরপুর', 'জামালপুর', 'গোপালগঞ্জ', 'মাদারীপুর',
  'শরীয়তপুর', 'রাজবাড়ী', 'নড়াইল', 'মাগুরা', 'ঝিনাইদহ', 'সাতক্ষীরা', 'বাগেরহাট', 'চুয়াডাঙ্গা',
  'মেহেরপুর', 'খাগড়াছড়ি', 'রাঙ্গামাটি', 'বান্দরবান'
];

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: 'ঢাকা',
    zipCode: '',
    avatar: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || 'ঢাকা',
        zipCode: user.zipCode || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleOpenModal = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || 'ঢাকা',
        zipCode: user.zipCode || '',
        avatar: user.avatar || ''
      });
    }
    setIsEditModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('নাম প্রদান করা আবশ্যক');
      return;
    }

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
        setIsEditModalOpen(false);
        await refreshUser();
      } else {
        toast.error(data.error || 'প্রোফাইল আপডেট করা সম্ভব হয়নি');
      }
    } catch {
      toast.error('একটি অনাকাঙ্ক্ষিত ত্রুটি ঘটেছে');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-[75vh] flex flex-col justify-between max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      <div className="space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">আমার অ্যাকাউন্ট প্রোফাইল</h1>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-1">
              সাইন-আপে প্রদানকৃত সকল প্রোফাইল তথ্য এবং ডেলিভারি ঠিকানা
            </p>
          </div>

          <button
            onClick={handleOpenModal}
            className="btn btn-md bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-2xl border-none shadow-md flex items-center gap-2 px-5"
          >
            <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
            <span>প্রোফাইল এডিট করুন</span>
          </button>
        </div>

        {/* Profile Card Header */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800 text-center sm:text-left">
            <img
              src={user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Profile'}
              alt={user.name}
              className="w-20 h-20 rounded-full border-4 border-indigo-600/30 shadow-lg object-cover bg-slate-100 dark:bg-slate-800"
            />
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">{user.name}</h2>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{user.email}</p>
              <div className="pt-1">
                <span className={`inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                  user.role === 'admin'
                    ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200'
                    : 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200'
                }`}>
                  <FontAwesomeIcon icon={user.role === 'admin' ? faShieldAlt : faCheckCircle} className="w-3.5 h-3.5" />
                  <span>{user.role === 'admin' ? 'অ্যাডমিন অ্যাকাউন্ট' : 'যাচাইকৃত গ্রাহক'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Signup Profile Attributes Display Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-1">
              <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                পূর্ণ নাম
              </span>
              <p className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>{user.name}</span>
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-1">
              <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                ইমেইল অ্যাড্রেস
              </span>
              <p className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>{user.email}</span>
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-1">
              <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                মোবাইল নম্বর
              </span>
              <p className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FontAwesomeIcon icon={faPhone} className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>{user.phone || 'তথ্য প্রদান করা হয়নি'}</span>
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-1">
              <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                জেলা / শহর
              </span>
              <p className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FontAwesomeIcon icon={faCity} className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>{user.city || 'তথ্য প্রদান করা হয়নি'}</span>
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-1">
              <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                বিস্তারিত ডেলিভারি ঠিকানা
              </span>
              <p className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>{user.address || 'তথ্য প্রদান করা হয়নি'}</span>
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-1">
              <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                পোস্টাল / জিও কোড
              </span>
              <p className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FontAwesomeIcon icon={faMailBulk} className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>{user.zipCode || 'তথ্য প্রদান করা হয়নি'}</span>
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-slate-900 dark:text-white text-lg">প্রোফাইল তথ্য সংশোধন করুন</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="btn btn-sm btn-circle btn-ghost text-slate-400">
                <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 font-sans text-sm">
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  পূর্ণ নাম
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  মোবাইল নম্বর
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  জেলা নির্বাচন করুন (৬৪ জেলা)
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-black text-slate-900 dark:text-white cursor-pointer"
                >
                  {BANGLADESH_DISTRICTS.map((district) => (
                    <option key={district} value={district} className="font-bold text-slate-900 bg-white dark:bg-slate-900 dark:text-white">
                      {district}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  বিস্তারিত ডেলিভারি ঠিকানা
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  পোস্টাল / জিও কোড
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  প্রোফাইল ছবি লিঙ্ক (URL)
                </label>
                <div className="relative">
                  <input
                    type="url"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-900 dark:text-white text-xs"
                  />
                  <FontAwesomeIcon icon={faImage} className="absolute left-3.5 top-4 w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn btn-sm btn-ghost rounded-xl font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn btn-sm bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl border-none px-6 flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faSave} className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
