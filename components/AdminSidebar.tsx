'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt,
  faBoxOpen,
  faFolderTree,
  faShoppingCart,
  faUsers,
  faArrowLeft,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/context/AuthContext';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    { label: 'ওভারভিউ ড্যাশবোর্ড', href: '/admin/dashboard', icon: faTachometerAlt },
    { label: 'পণ্য ম্যানেজমেন্ট', href: '/admin/products', icon: faBoxOpen },
    { label: 'ক্যাটাগরি ম্যানেজমেন্ট', href: '/admin/categories', icon: faFolderTree },
    { label: 'অর্ডার লিস্ট ও স্ট্যাটাস', href: '/admin/orders', icon: faShoppingCart },
    { label: 'ইউজার ও রোল কন্ট্রোল', href: '/admin/users', icon: faUsers },
  ];

  return (
    <aside className="w-64 bg-slate-900 dark:bg-slate-950 text-slate-300 min-h-screen p-5 flex flex-col justify-between border-r border-slate-800 shrink-0 font-sans">
      <div>
        {/* Brand Logo & Header */}
        <div className="mb-6 pb-4 border-b border-slate-800">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <span className="font-black text-xl text-white tracking-tight">ইলেভেট<span className="text-amber-400">মার্ট</span></span>
            <span className="badge badge-sm bg-amber-500 text-slate-950 font-black border-none text-[10px]">অ্যাডমিন</span>
          </Link>
        </div>

        {/* Admin User Card */}
        <div className="p-3 mb-6 bg-slate-800/80 dark:bg-slate-900/80 border border-slate-700/60 rounded-2xl flex items-center gap-3">
          <img
            src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'}
            alt="Admin"
            className="w-10 h-10 rounded-xl border border-amber-400/50 object-cover bg-slate-900"
          />
          <div className="min-w-0 flex-1">
            <p className="font-extrabold text-white text-sm truncate">{user?.name || 'অ্যাডমিনিস্ট্রেটর'}</p>
            <div className="flex items-center gap-1 text-[11px] text-amber-400 font-extrabold">
              <FontAwesomeIcon icon={faShieldAlt} className="w-3 h-3 text-amber-400" />
              <span>সুপার অ্যাডমিন</span>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1.5">
          <p className="px-3 text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">
            ম্যানেজমেন্ট অপশনসমূহ
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl font-black text-xs transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/90 dark:hover:bg-slate-900/90'
                }`}
              >
                <FontAwesomeIcon icon={item.icon} className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Return to Customer Storefront */}
      <div className="pt-4 border-t border-slate-800">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 w-full py-3 px-3 bg-slate-800 dark:bg-slate-900 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-black rounded-2xl transition-colors border border-slate-700/60 shadow-sm"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-3.5 h-3.5" />
          <span>মূল ওয়েবসাইট-এ ফিরুন</span>
        </Link>
      </div>
    </aside>
  );
}
