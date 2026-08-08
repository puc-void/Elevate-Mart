'use client';

import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTruck,
  faShieldAlt,
  faUndo,
  faHeadset,
  faHeart
} from '@fortawesome/free-solid-svg-icons';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-20">
      {/* Top Value Banner */}
      <div className="border-b border-slate-800 bg-slate-950/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <FontAwesomeIcon icon={faTruck} className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">ফ্রি ফাস্ট ডেলিভারি</h4>
                <p className="text-xs text-slate-500">৫০০০ টাকার বেশি অর্ডারে</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <FontAwesomeIcon icon={faShieldAlt} className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">২ বছরের ওয়ারেন্টি</h4>
                <p className="text-xs text-slate-500">১০০% অরিজিনাল অফিশিয়াল পণ্য</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <FontAwesomeIcon icon={faUndo} className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">৩০ দিনে ফ্রি রিটার্ন</h4>
                <p className="text-xs text-slate-500">সহজ ও দ্রুত রিফান্ড সুবিধা</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <FontAwesomeIcon icon={faHeadset} className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">২৪/৭ কাস্টমার সাপোর্ট</h4>
                <p className="text-xs text-slate-500">যেকোনো সহায়তায় আমরা পাশে আছি</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <div className="mb-4">
              <span className="font-extrabold text-2xl text-white">ইলেভেট<span className="text-indigo-400">মার্ট</span></span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4 max-w-sm font-sans">
              বাংলাদেশের সেরা অনলাইন শপিং গন্তব্য। লাক্সারি গ্যাজেট, আধুনিক ফ্যাশন ও হোম এক্সেসরিজের এক বিশাল সংগ্রহ।
            </p>
            <div className="text-xs text-slate-500">
              নিওন পোস্টগ্রেস ডিবি ও ফন্টঅসাম ভেক্টর আইকন সমর্থিত
            </div>
          </div>

          <div>
            <h5 className="text-white font-bold text-sm mb-4">ক্যাটাগরি সমূহ</h5>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products?categoryId=cat-1" className="hover:text-white transition-colors">ইলেকট্রনিক্স ও প্রযুক্তি</Link></li>
              <li><Link href="/products?categoryId=cat-2" className="hover:text-white transition-colors">স্মার্টফোন ও গ্যাজেট</Link></li>
              <li><Link href="/products?categoryId=cat-3" className="hover:text-white transition-colors">ফ্যাশন ও লাইফস্টাইল</Link></li>
              <li><Link href="/products?categoryId=cat-4" className="hover:text-white transition-colors">হোম ও ডেকর</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold text-sm mb-4">অ্যাকাউন্ট ও সহায়তা</h5>
            <ul className="space-y-2 text-sm">
              <li><Link href="/profile" className="hover:text-white transition-colors">আমার প্রোফাইল</Link></li>
              <li><Link href="/orders" className="hover:text-white transition-colors">অর্ডার ট্র্যাকিং</Link></li>
              <li><Link href="/cart" className="hover:text-white transition-colors">শপিং কার্ট</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">লগইন / সাইন আপ</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold text-sm mb-4">অ্যাডমিন কন্ট্রোল</h5>
            <ul className="space-y-2 text-sm">
              <li><Link href="/admin/dashboard" className="hover:text-amber-400 transition-colors">ড্যাশবোর্ড ওভারভিউ</Link></li>
              <li><Link href="/admin/products" className="hover:text-amber-400 transition-colors">পণ্য ম্যানেজমেন্ট</Link></li>
              <li><Link href="/admin/orders" className="hover:text-amber-400 transition-colors">অর্ডার ম্যানেজমেন্ট</Link></li>
              <li><Link href="/admin/users" className="hover:text-amber-400 transition-colors">ইউজার ম্যানেজমেন্ট</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ইলেভেটমার্ট (ElevateMart)। সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center gap-1.5">
            <span>নির্মিত</span>
            <FontAwesomeIcon icon={faHeart} className="w-3.5 h-3.5 text-rose-500" />
            <span>সহজ কেনাকাটার জন্য</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
