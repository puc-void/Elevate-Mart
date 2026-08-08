'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faHeart
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebook,
  faInstagram,
  faWhatsapp,
  faYoutube
} from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/80 font-sans py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Main Streamlined Footer Row (Brand & Contact + Social Channels) */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          
          {/* Brand & Helpline Contact Info */}
          <div className="space-y-3">
            <div>
              <span className="font-black text-2xl text-white">ইলেভেট<span className="text-indigo-400">মার্ট</span></span>
              <p className="text-sm font-bold text-slate-400 mt-1 max-w-md">
                বাংলাদেশের নির্ভরযোগ্য অনলাইন ই-কমার্স শপ। খাঁটি প্রোডাক্ট ও দ্রুত হোম ডেলিভারি।
              </p>
            </div>

            {/* Contact Info in Medium Bengali Font */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-black text-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
                  <FontAwesomeIcon icon={faPhone} className="w-3 h-3" />
                </div>
                <span>হেল্পলাইন: ০১৭০০-০০০১১১</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/20">
                  <FontAwesomeIcon icon={faEnvelope} className="w-3 h-3" />
                </div>
                <span>ইমেইল: support@elevatemart.bd</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="w-3 h-3" />
                </div>
                <span>ঢাকা, বাংলাদেশ</span>
              </div>
            </div>
          </div>

          {/* Social Media Channels */}
          <div className="space-y-2.5">
            <h4 className="text-white font-black text-sm uppercase tracking-wider">সোশ্যাল মিডিয়া পেজ</h4>
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center border border-blue-500/30 shadow-md"
                aria-label="Facebook"
              >
                <FontAwesomeIcon icon={faFacebook} className="w-5 h-5" />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-2xl bg-pink-600/20 text-pink-400 hover:bg-pink-600 hover:text-white transition-all flex items-center justify-center border border-pink-500/30 shadow-md"
                aria-label="Instagram"
              >
                <FontAwesomeIcon icon={faInstagram} className="w-5 h-5" />
              </a>

              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-2xl bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center border border-emerald-500/30 shadow-md"
                aria-label="WhatsApp"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5" />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-2xl bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center border border-rose-500/30 shadow-md"
                aria-label="YouTube"
              >
                <FontAwesomeIcon icon={faYoutube} className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Clean Copyright Bottom Line */}
        <div className="flex items-center justify-between text-sm font-bold text-slate-400 pt-1">
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
