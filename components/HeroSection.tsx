'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faShieldAlt,
  faBolt,
  faStar,
  faShoppingBag
} from '@fortawesome/free-solid-svg-icons';

const TYPEWRITER_PHRASES = [
  'আধুনিক অফিশিয়াল গ্যাজেট ও ইলেকট্রনিক্স',
  'ফ্ল্যাগশিপ স্মার্টফোন ও লাক্সারি স্মার্টওয়াচ',
  'প্রিমিয়াম ট্রেন্ডি ফ্যাশন ও লাইফস্টাইল'
];

export default function HeroSection() {
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = TYPEWRITER_PHRASES[textIndex];

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < currentPhrase.length) {
          setCharIndex(prev => prev + 1);
        } else {
          // Pause at end of phrase
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (charIndex > 0) {
          setCharIndex(prev => prev - 1);
        } else {
          setIsDeleting(false);
          setTextIndex(prev => (prev + 1) % TYPEWRITER_PHRASES.length);
        }
      }
    }, isDeleting ? 40 : 80);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, textIndex]);

  const currentDisplayedText = TYPEWRITER_PHRASES[textIndex].substring(0, charIndex);

  return (
    <section className="relative overflow-hidden bg-slate-900 text-white rounded-3xl py-16 sm:py-24 lg:py-28 px-6 sm:px-12 shadow-2xl border border-slate-800 font-sans">
      
      {/* High-Resolution E-Commerce Background Image Overlay with Reduced Opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 sm:opacity-25 scale-105 transition-transform duration-1000"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1920&q=80')"
        }}
      />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-indigo-950/80 z-10 backdrop-blur-[2px]" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl z-10" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl z-10" />

      {/* Hero Content */}
      <div className="relative z-20 space-y-6 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
          <FontAwesomeIcon icon={faStar} className="w-3.5 h-3.5 text-amber-400" />
          <span>বাংলাদেশের বিশ্বাসযোগ্য বাংলা অনলাইন ই-কমার্স শপ</span>
        </div>

        {/* Dynamic Typewriter Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight min-h-[3.6em] sm:min-h-[2.4em] flex flex-col justify-center">
          <span>ইলেভেট মার্টে সেরা</span>
          <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-amber-300 bg-clip-text text-transparent inline-block">
            {currentDisplayedText}
            <span className="animate-pulse text-amber-400 ml-1">|</span>
          </span>
        </h1>

        <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-sans">
          অরিজিনাল ব্র্যান্ড ওয়ারেন্টি সহ ১০০% খাঁটি অফিশিয়াল পণ্য কিনুন সরাসরি আপনার বাড়ি অথবা অফিসে।
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Link
            href="/products"
            className="btn btn-lg bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl border-none shadow-lg shadow-indigo-600/30 px-8 flex items-center gap-2.5 group"
          >
            <span>পণ্য কালেকশন দেখুন</span>
            <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-6 text-xs sm:text-sm text-slate-400 font-bold border-t border-white/10">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faBolt} className="w-4 h-4 text-amber-400" />
            <span>ফাস্ট হোম ডেলিভারি</span>
          </div>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faShieldAlt} className="w-4 h-4 text-emerald-400" />
            <span>১০০% অফিশিয়াল ওয়ারেন্টি</span>
          </div>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faShoppingBag} className="w-4 h-4 text-sky-400" />
            <span>ফ্রি রিটার্ন সুবিধা</span>
          </div>
        </div>
      </div>
    </section>
  );
}
