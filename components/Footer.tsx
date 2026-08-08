'use client';

import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/80 font-sans py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Simplified Compact Footer Info */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800/80 text-center md:text-left">
          <div className="space-y-1">
            <span className="font-black text-xl text-white">ইলেভেট<span className="text-indigo-400">মার্ট</span></span>
            <p className="text-sm font-bold text-slate-400 max-w-md">
              বাংলাদেশের নির্ভরযোগ্য বাংলা ই-কমার্স প্ল্যাটফর্ম। খাঁটি গ্যাজেট ও লাইফস্টাইল কালেকশন।
            </p>
          </div>

          {/* Essential Quick Links in Medium Font Size */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-black text-slate-300">
            <Link href="/products" className="hover:text-indigo-400 transition-colors">
              সব পণ্য
            </Link>
            <Link href="/products?categoryId=cat-1" className="hover:text-indigo-400 transition-colors">
              ইলেকট্রনিক্স
            </Link>
            <Link href="/products?categoryId=cat-3" className="hover:text-indigo-400 transition-colors">
              ফ্যাশন
            </Link>
            <Link href="/orders" className="hover:text-indigo-400 transition-colors">
              অর্ডার ট্র্যাকিং
            </Link>
            <Link href="/cart" className="hover:text-indigo-400 transition-colors">
              কার্ট
            </Link>
          </div>
        </div>

        {/* Bottom Copyright & Heart Tag */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-sm font-bold text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} ElevateMart (ইলেভেটমার্ট)। সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>নির্মিত</span>
            <FontAwesomeIcon icon={faHeart} className="w-4 h-4 text-rose-500" />
            <span>সহজ অনলাইন কেনাকাটার জন্য</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
