'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  faMoon
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import Logo from './Logo';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems, cart, subtotal } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo Component & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
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
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-slate-100 transition-all font-sans"
              />
              <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-3 w-3.5 h-3.5 text-slate-400" />
            </div>
          </form>

          {/* Navigation Links & Controls */}
          <div className="flex items-center gap-3">
            
            {/* Store Navigation */}
            <nav className="hidden lg:flex items-center gap-6 mr-2 font-bold text-sm text-slate-600 dark:text-slate-300">
              <Link href="/products" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                সব পণ্য
              </Link>
              <Link href="/products?categoryId=cat-1" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                ইলেকট্রনিক্স
              </Link>
              <Link href="/products?categoryId=cat-3" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                ফ্যাশন
              </Link>
            </nav>

            {/* Light / Dark Theme Switcher Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              title={theme === 'light' ? 'ডার্ক মোড চালু করুন' : 'লাইট মোড চালু করুন'}
            >
              <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} className="w-4 h-4 text-amber-500" />
            </button>

            {/* Cart Dropdown Badge */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle relative text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                <div className="indicator">
                  <FontAwesomeIcon icon={faShoppingBag} className="w-5 h-5" />
                  {totalItems > 0 && (
                    <span className="badge badge-sm badge-primary indicator-item font-bold bg-indigo-600 text-white border-none">
                      {totalItems}
                    </span>
                  )}
                </div>
              </div>
              <div tabIndex={0} className="mt-3 z-50 card card-compact dropdown-content w-80 bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800 rounded-2xl">
                <div className="card-body p-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{totalItems} টি পণ্য কার্টে আছে</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">মোট: <strong className="text-indigo-600 dark:text-indigo-400">৳{subtotal}</strong></span>
                  </div>
                  
                  <div className="max-h-48 overflow-y-auto space-y-2 py-2">
                    {cart.length === 0 ? (
                      <p className="text-center text-sm text-slate-400 py-4">আপনার কার্ট বর্তমানে খালি</p>
                    ) : (
                      cart.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center gap-3 py-1">
                          <img src={item.image} alt={item.title} className="w-10 h-10 object-cover rounded-lg" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{item.title}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{item.quantity} x ৳{item.price}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="card-actions flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <Link href="/cart" className="flex-1 btn btn-sm btn-light-primary rounded-xl text-xs font-bold">
                      কার্ট দেখুন
                    </Link>
                    <Link href="/checkout" className="flex-1 btn btn-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold border-none">
                      অর্ডার করুন
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Auth Dropdown or Sign In */}
            {user ? (
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border border-slate-200 dark:border-slate-700 hover:border-indigo-400">
                  <div className="w-9 rounded-full">
                    <img src={user.avatar} alt={user.name} />
                  </div>
                </div>
                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-50 p-2 shadow-xl bg-white dark:bg-slate-900 rounded-2xl w-60 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-200">
                  <li className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                    <span className={`mt-1 inline-block text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${user.role === 'admin' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'}`}>
                      {user.role === 'admin' ? 'অ্যাডমিন প্যানেল' : 'গ্রাহক অ্যাকাউন্ট'}
                    </span>
                  </li>
                  {user.role === 'admin' && (
                    <li>
                      <Link href="/admin/dashboard" className="flex items-center gap-2 py-2.5 font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-xl">
                        <FontAwesomeIcon icon={faTachometerAlt} className="w-4 h-4" /> অ্যাডমিন ড্যাশবোর্ড
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link href="/profile" className="flex items-center gap-2 py-2 font-semibold rounded-xl">
                      <FontAwesomeIcon icon={faUser} className="w-4 h-4 text-slate-500" /> আমার প্রোফাইল
                    </Link>
                  </li>
                  <li>
                    <Link href="/orders" className="flex items-center gap-2 py-2 font-semibold rounded-xl">
                      <FontAwesomeIcon icon={faReceipt} className="w-4 h-4 text-slate-500" /> অর্ডার হিস্ট্রি
                    </Link>
                  </li>
                  <li className="border-t border-slate-100 dark:border-slate-800 mt-1">
                    <button onClick={logout} className="flex items-center gap-2 py-2 font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl">
                      <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4" /> সাইন আউট
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="btn btn-sm btn-light-primary rounded-xl font-bold px-4">
                  লগইন
                </Link>
                <Link href="/signup" className="hidden sm:inline-flex btn btn-sm bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white rounded-xl font-bold border-none px-4">
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
                  className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
                />
                <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-3 w-3.5 h-3.5 text-slate-400" />
              </div>
            </form>
            <div className="flex flex-col gap-2 font-bold text-slate-700 dark:text-slate-200">
              <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                সব পণ্য দেখুন
              </Link>
              <Link href="/products?categoryId=cat-1" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                ইলেকট্রনিক্স
              </Link>
              <Link href="/products?categoryId=cat-3" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                ফ্যাশন ও লাইফস্টাইল
              </Link>
              {user?.role === 'admin' && (
                <Link href="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 rounded-lg bg-amber-50 text-amber-700 font-bold">
                  অ্যাডমিন ড্যাশবোর্ড
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
