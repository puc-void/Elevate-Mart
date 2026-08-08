'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faShoppingBag, faArrowRight, faTag, faShieldAlt, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { validateCoupon } from '@/lib/coupons';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, subtotal, shipping, tax, totalAmount } = useCart();
  const { user } = useAuth();
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number; description: string } | null>(null);

  const getCombinedUsedCoupons = () => {
    const dbUsed = user?.usedCoupons || [];
    let localUsed: string[] = [];
    try {
      const saved = localStorage.getItem('ecom_used_coupons');
      if (saved) localUsed = JSON.parse(saved);
    } catch {
      localUsed = [];
    }
    return Array.from(new Set([...dbUsed, ...localUsed]));
  };

  useEffect(() => {
    // Check saved coupon in localStorage
    const saved = localStorage.getItem('applied_coupon');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const res = validateCoupon(parsed.code, subtotal, getCombinedUsedCoupons());
        if (res.valid) {
          setAppliedCoupon({
            code: parsed.code,
            discountAmount: res.discountAmount,
            description: res.coupon!.description
          });
        } else {
          setAppliedCoupon(null);
          localStorage.removeItem('applied_coupon');
        }
      } catch {
        localStorage.removeItem('applied_coupon');
      }
    }
  }, [subtotal, user?.usedCoupons]);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) {
      toast.error('কুপন কোড প্রদান করুন');
      return;
    }

    const res = validateCoupon(couponInput, subtotal, getCombinedUsedCoupons());
    if (res.valid && res.coupon) {
      const couponData = {
        code: res.coupon.code,
        discountAmount: res.discountAmount,
        description: res.coupon.description
      };
      setAppliedCoupon(couponData);
      localStorage.setItem('applied_coupon', JSON.stringify(couponData));
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    localStorage.removeItem('applied_coupon');
    toast.success('কুপন রিমুভ করা হয়েছে');
  };

  const discountVal = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalTotal = Math.max(0, totalAmount - discountVal);

  if (cart.length === 0) {
    return (
      <div className="flex-1 w-full min-h-[calc(100vh-16rem)] flex flex-col items-center justify-center max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-sm">
          <FontAwesomeIcon icon={faShoppingBag} className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">আপনার কার্ট বর্তমানে খালি</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          আমাদের সেরা পণ্যের কালেকশন ব্রাউজ করুন এবং আপনার পছন্দের পণ্যটি কার্টে যুক্ত করুন।
        </p>
        <Link href="/products" className="btn btn-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl border-none shadow-md">
          ক্যাটালগ ব্রাউজ করুন
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full min-h-[calc(100vh-16rem)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans flex flex-col justify-between">
      
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">শপিং কার্ট</h1>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-1">আপনার নির্বাচিত পণ্যসমূহ এবং ডেলিভারি হিসাব দেখে নিন</p>
        </div>
        <button
          onClick={clearCart}
          className="btn btn-sm bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-black flex items-center gap-1.5"
        >
          <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
          <span>কার্ট খালি করুন</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 hover-card"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-20 h-20 object-cover rounded-2xl bg-slate-100 dark:bg-slate-800 flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.productId}`} className="font-black text-slate-900 dark:text-white text-base hover:text-indigo-600 line-clamp-1">
                  {item.title}
                </Link>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">প্রতিটি ৳{item.price}</p>
              </div>

              {/* Quantity controls */}
              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-black text-sm"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 font-black text-sm text-slate-900 dark:text-white">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-black text-sm"
                  >
                    +
                  </button>
                </div>

                <span className="font-black text-slate-900 dark:text-white text-base min-w-[70px] text-right">
                  ৳{item.price * item.quantity}
                </span>

                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  aria-label="সরিয়ে ফেলুন"
                >
                  <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Card */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="font-black text-slate-900 dark:text-white text-lg border-b border-slate-100 dark:border-slate-800 pb-4">
              অর্ডার সারাংশ
            </h2>

            {/* Coupon Code Form */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                কুপন ডিসকাউন্ট কোড
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="ELEVATE20"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-slate-100 uppercase font-bold"
                  />
                  <FontAwesomeIcon icon={faTag} className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-400" />
                </div>
                <button type="submit" className="btn btn-sm bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-xs px-4">
                  অ্যাপ্লাই
                </button>
              </div>
            </form>

            {/* Applied Coupon Status Banner */}
            {appliedCoupon && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center justify-between text-xs font-black text-emerald-800 dark:text-emerald-300">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>কুপন '{appliedCoupon.code}' প্রয়োগ করা হয়েছে (-৳{appliedCoupon.discountAmount})</span>
                </div>
                <button onClick={handleRemoveCoupon} className="text-rose-500 hover:underline text-[11px] font-bold">
                  সরান
                </button>
              </div>
            )}

            {/* Price Calculations in Medium Bengali Font */}
            <div className="space-y-3 text-sm font-bold">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>পণ্যের সাবটোটাল</span>
                <span className="font-extrabold text-slate-900 dark:text-white">৳{subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>ডেলিভারি চার্জ</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{shipping === 0 ? 'ফ্রি' : `৳${shipping}`}</span>
              </div>

              {discountVal > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-extrabold bg-emerald-50 dark:bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900 text-xs">
                  <span>কুপন মূল্যছাড় ({appliedCoupon?.code})</span>
                  <span>-৳{discountVal}</span>
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-baseline">
                <span className="font-black text-slate-900 dark:text-white text-base">সর্বমোট প্রদেয়</span>
                <span className="font-black text-indigo-600 dark:text-indigo-400 text-2xl">৳{finalTotal}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <Link
              href="/checkout"
              className="w-full btn btn-lg bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base rounded-2xl border-none shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              <span>অর্ডার সম্পন্ন করতে এগিয়ে যান</span>
              <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
            </Link>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-bold pt-2">
              <FontAwesomeIcon icon={faShieldAlt} className="w-3.5 h-3.5 text-emerald-500" />
              <span>২৫৬-বিট পেমেন্ট সেফটি ও এনক্রিপ্টেড সেকিউরিটি</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
