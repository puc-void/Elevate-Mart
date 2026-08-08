'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShoppingBag,
  faSearch,
  faUser,
  faSignOutAlt,
  faTachometerAlt,
  faBars,
  faTimes,
  faReceipt,
  faSun,
  faMoon,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import Logo from './Logo';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { totalItems, cart, subtotal } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  // NOTE: Hide storefront Navbar on Admin routes (/admin/*) for dedicated workspace view
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          
          {/* Brand Logo Component & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="মোবাইল মেনু"
            >
              <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} className="w-5 h-5" />
            </button>

            {/* Custom Brand Logo */}
            <Logo />
          </div>

          {/* Desktop Search Bar (No Placeholder) */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="পণ্য খুঁজুন"
                className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-900 dark:text-slate-100 font-bold transition-all"
              />
              <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
            </div>
          </form>

          {/* Navigation Links & Controls */}
          <div className="flex items-center gap-3">
            
            {/* Store Navigation */}
            <nav className="hidden lg:flex items-center gap-6 mr-2 font-extrabold text-sm text-slate-700 dark:text-slate-200">
              <Link href="/products" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-2 py-1 rounded-lg hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40">
                সব পণ্য
              </Link>
              <Link href="/products?categoryId=cat-1" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-2 py-1 rounded-lg hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40">
                ইলেকট্রনিক্স
              </Link>
              <Link href="/products?categoryId=cat-3" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-2 py-1 rounded-lg hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40">
                ফ্যাশন
              </Link>
            </nav>

            {/* Light / Dark Theme Switcher Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-2xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center"
              title={theme === 'light' ? 'ডার্ক মোড চালু করুন' : 'লাইট মোড চালু করুন'}
            >
              <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} className="w-4 h-4 text-amber-500" />
            </button>

            {/* Cart Dropdown Badge */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle relative text-slate-800 dark:text-slate-100 hover:bg-indigo-50/80 dark:hover:bg-indigo-950/60 border border-slate-200/60 dark:border-slate-700/60">
                <div className="indicator">
                  <FontAwesomeIcon icon={faShoppingBag} className="w-5 h-5 text-slate-800 dark:text-slate-200" />
                  {totalItems > 0 && (
                    <span className="badge badge-sm badge-primary indicator-item font-black bg-indigo-600 text-white border-none shadow-md">
                      {totalItems}
                    </span>
                  )}
                </div>
              </div>
              <div tabIndex={0} className="mt-3 z-50 card card-compact dropdown-content w-84 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl border border-slate-200/80 dark:border-slate-800 rounded-3xl p-1">
                <div className="card-body p-4 space-y-3">
                  <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">{totalItems} টি পণ্য কার্টে আছে</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">মোট: <strong className="text-indigo-600 dark:text-indigo-400 text-sm">৳{subtotal}</strong></span>
                  </div>
                  
                  <div className="max-h-52 overflow-y-auto space-y-2 py-1 pr-1">
                    {cart.length === 0 ? (
                      <p className="text-center text-xs font-bold text-slate-400 py-6">আপনার কার্ট বর্তমানে খালি</p>
                    ) : (
                      cart.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-2 bg-slate-50/80 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/60">
                          <img src={item.image} alt={item.title} className="w-11 h-11 object-cover rounded-xl bg-white" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-extrabold text-slate-900 dark:text-slate-100 truncate">{item.title}</p>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">{item.quantity} x ৳{item.price}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="card-actions flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <Link href="/cart" className="flex-1 btn btn-sm btn-light-primary rounded-2xl text-xs font-black py-2">
                      কার্ট দেখুন
                    </Link>
                    <Link href="/checkout" className="flex-1 btn btn-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black border-none py-2 shadow-md">
                      অর্ডার করুন
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Auth Dropdown or Sign In */}
            {user ? (
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border-2 border-indigo-500/40 hover:border-indigo-600 shadow-sm transition-all">
                  <div className="w-10 rounded-full">
                    <img src={user.avatar} alt={user.name} />
                  </div>
                </div>
                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-50 p-3 shadow-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl w-64 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-200 space-y-1">
                  <li className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800 mb-1">
                    <p className="font-black text-slate-900 dark:text-white text-sm truncate">{user.name}</p>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 truncate mt-0.5">{user.email}</p>
                    <span className={`mt-2 inline-block text-[11px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full ${user.role === 'admin' ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200' : 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200'}`}>
                      {user.role === 'admin' ? 'অ্যাডমিন প্যানেল' : 'গ্রাহক অ্যাকাউন্ট'}
                    </span>
                  </li>
                  {user.role === 'admin' && (
                    <li>
                      <Link href="/admin/dashboard" className="flex items-center justify-between py-2.5 px-3 font-extrabold text-xs text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50 rounded-2xl transition-colors">
                        <div className="flex items-center gap-2">
                          <FontAwesomeIcon icon={faTachometerAlt} className="w-4 h-4" />
                          <span>অ্যাডমিন ড্যাশবোর্ড</span>
                        </div>
                        <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3 text-amber-400" />
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link href="/profile" className="flex items-center gap-2.5 py-2.5 px-3 font-extrabold text-xs text-slate-800 dark:text-slate-200 hover:bg-indigo-50/80 dark:hover:bg-indigo-950/60 rounded-2xl transition-colors">
                      <FontAwesomeIcon icon={faUser} className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span>আমার প্রোফাইল</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/orders" className="flex items-center gap-2.5 py-2.5 px-3 font-extrabold text-xs text-slate-800 dark:text-slate-200 hover:bg-indigo-50/80 dark:hover:bg-indigo-950/60 rounded-2xl transition-colors">
                      <FontAwesomeIcon icon={faReceipt} className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span>অর্ডার হিস্ট্রি</span>
                    </Link>
                  </li>
                  <li className="border-t border-slate-100 dark:border-slate-800 pt-1 mt-1">
                    <button onClick={logout} className="flex items-center gap-2.5 py-2.5 px-3 font-extrabold text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-2xl transition-colors w-full">
                      <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4" />
                      <span>সাইন আউট</span>
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="btn btn-sm btn-light-primary rounded-2xl font-black px-4 text-xs">
                  লগইন
                </Link>
                <Link href="/signup" className="hidden sm:inline-flex btn btn-sm bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white rounded-2xl font-black border-none px-4 text-xs shadow-md">
                  রেজিস্ট্রেশন
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <form onSubmit={handleSearchSubmit} className="mb-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="পণ্য খুঁজুন"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 font-bold"
                />
                <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-3.5 w-3.5 h-3.5 text-slate-400" />
              </div>
            </form>
            <div className="flex flex-col gap-2 font-extrabold text-sm text-slate-800 dark:text-slate-200">
              <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                সব পণ্য দেখুন
              </Link>
              <Link href="/products?categoryId=cat-1" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                ইলেকট্রনিক্স
              </Link>
              <Link href="/products?categoryId=cat-3" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                ফ্যাশন ও লাইফস্টাইল
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
