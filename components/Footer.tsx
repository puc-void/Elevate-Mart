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

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 mt-12 border-t border-slate-800/80 font-sans">
      {/* Top Value Strip */}
      <div className="border-b border-slate-900 bg-slate-900/40 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                <FontAwesomeIcon icon={faTruck} className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-white font-extrabold text-xs">ফ্রি ফাস্ট ডেলিভারি</h4>
                <p className="text-[11px] text-slate-500 font-bold">৫০০০+ অর্ডারে</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <FontAwesomeIcon icon={faShieldAlt} className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-white font-extrabold text-xs">১০০% অরিজিনাল</h4>
                <p className="text-[11px] text-slate-500 font-bold">অফিশিয়াল ওয়ারেন্টি</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <FontAwesomeIcon icon={faUndo} className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-white font-extrabold text-xs">সহজ রিফান্ড</h4>
                <p className="text-[11px] text-slate-500 font-bold">৭ দিনে রিটার্ন</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
                <FontAwesomeIcon icon={faHeadset} className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-white font-extrabold text-xs">২৪/৭ সাপোর্ট</h4>
                <p className="text-[11px] text-slate-500 font-bold">সহায়তায় প্রস্তুত</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Compact Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          <div>
            <span className="font-black text-lg text-white">ইলেভেট<span className="text-indigo-400">মার্ট</span></span>
            <p className="text-xs text-slate-400 leading-relaxed mt-1 font-bold">
              বাংলাদেশের অন্যতম নির্ভরযোগ্য ডিজিটাল ই-কমার্স শপ।
            </p>
          </div>

          <div>
            <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-2">ক্যাটাগরি</h5>
            <ul className="space-y-1 text-xs font-bold">
              <li><Link href="/products?categoryId=cat-1" className="hover:text-indigo-400 transition-colors">ইলেকট্রনিক্স</Link></li>
              <li><Link href="/products?categoryId=cat-3" className="hover:text-indigo-400 transition-colors">ফ্যাশন</Link></li>
              <li><Link href="/products?categoryId=cat-4" className="hover:text-indigo-400 transition-colors">হোম ও ডেকর</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-2">সহায়তা</h5>
            <ul className="space-y-1 text-xs font-bold">
              <li><Link href="/profile" className="hover:text-indigo-400 transition-colors">আমার প্রোফাইল</Link></li>
              <li><Link href="/orders" className="hover:text-indigo-400 transition-colors">অর্ডার হিস্ট্রি</Link></li>
              <li><Link href="/cart" className="hover:text-indigo-400 transition-colors">শপিং কার্ট</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-2">অ্যাডমিন</h5>
            <ul className="space-y-1 text-xs font-bold">
              <li><Link href="/admin/dashboard" className="hover:text-amber-400 transition-colors">ড্যাশবোর্ড</Link></li>
              <li><Link href="/admin/products" className="hover:text-amber-400 transition-colors">পণ্য ম্যানেজমেন্ট</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] font-bold text-slate-500 gap-2">
          <p>© {new Date().getFullYear()} ElevateMart. সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center gap-1">
            <span>নির্মিত</span>
            <FontAwesomeIcon icon={faHeart} className="w-3 h-3 text-rose-500" />
            <span>বাংলা ই-কমার্স অভিজ্ঞতায়</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
