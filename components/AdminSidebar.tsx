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
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between border-r border-slate-800">
      <div>
        {/* Admin Card */}
        <div className="p-3 mb-6 bg-slate-800/60 border border-slate-700/50 rounded-2xl flex items-center gap-3">
          <img
            src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'}
            alt="Admin"
            className="w-10 h-10 rounded-full border border-amber-400/50 object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="font-bold text-white text-sm truncate">{user?.name || 'অ্যাডমিনিস্ট্রেটর'}</p>
            <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-bold">
              <FontAwesomeIcon icon={faShieldAlt} className="w-3 h-3 text-amber-400" />
              <span>সুপার অ্যাডমিন</span>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">
            অ্যাডমিন কন্ট্রোল প্যানেল
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
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
          className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-bold rounded-xl transition-colors border border-slate-700/50"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-3.5 h-3.5" />
          <span>মূল ওয়েবসাইট-এ ফিরুন</span>
        </Link>
      </div>
    </aside>
  );
}
