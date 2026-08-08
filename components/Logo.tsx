'use client';

import React from 'react';
import Link from 'next/link';

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 group ${className}`}>
      {/* Brand Icon Badge */}
      <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-sky-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-white"
        >
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-amber-400 border-2 border-white rounded-full"></div>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1">
          <span className="font-black text-xl tracking-tight text-slate-900">ইলেভেট</span>
          <span className="font-extrabold text-xl text-indigo-600">মার্ট</span>
        </div>
        <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mt-0.5">
          প্রিমিয়াম অনলাইন শপ
        </span>
      </div>
    </Link>
  );
}
