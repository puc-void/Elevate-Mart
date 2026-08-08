'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faMobileAlt, faMoneyBillWave, faLock } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { cart, subtotal, shipping, tax, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    address: user?.address || '',
    city: user?.city || '',
    zipCode: user?.zipCode || '',
    phone: user?.phone || ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'bkash' | 'cash_on_delivery'>('credit_card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart.length) {
      toast.error('আপনার কার্ট খালি');
      return;
    }
    if (!formData.fullName || !formData.address || !formData.city || !formData.phone) {
      toast.error('অনুগ্রহ করে শিপিং তথ্যের ঘরগুলো পূরণ করুন');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(i => ({
            id: i.id,
            productId: i.productId,
            title: i.title,
            price: i.price,
            quantity: i.quantity,
            image: i.image
          })),
          subtotal,
          shipping,
          tax,
          totalAmount,
          paymentMethod,
          shippingAddress: formData
        })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!');
        clearCart();
        router.push('/orders');
      } else {
        toast.error(data.error || 'অর্ডার প্রক্রিয়া করতে সমস্যা হয়েছে');
      }
    } catch {
      toast.error('চেকআউটের সময় একটি ত্রুটি ঘটেছে');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">চেকআউট করার মতো পণ্য নেই</h2>
        <p className="text-slate-500 dark:text-slate-400">আপনার কার্টে বর্তমানে কোনো পণ্য যোগ করা নেই।</p>
        <Link href="/products" className="btn btn-sm btn-light-primary rounded-xl font-bold">
          ক্যাটালগে ফিরুন
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">অর্ডার চেকআউট</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">ডেলিভারির ঠিকানা লিখুন এবং পছন্দের পেমেন্ট মাধ্যম বেছে নিন</p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Shipping Address & Payment Selection */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Shipping Address Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="font-extrabold text-slate-900 dark:text-white text-base border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs flex items-center justify-center font-bold">১</span>
              শিপিং ও ডেলিভারি তথ্য
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  গ্রাহকের পূর্ণ নাম
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-slate-100 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  মোবাইল নম্বর
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-slate-100 font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  পূর্ণাঙ্গ ঠিকানা / বাড়ি ও রোড নম্বর
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-slate-100 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  শহর / জেলা
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-slate-100 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  পোস্টাল কোড
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-slate-100 font-bold"
                />
              </div>
            </div>
          </div>

          {/* Payment Option Selector */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="font-extrabold text-slate-900 dark:text-white text-base border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs flex items-center justify-center font-bold">২</span>
              পেমেন্ট মাধ্যম বেছে নিন
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('credit_card')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  paymentMethod === 'credit_card'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/60 ring-2 ring-indigo-500/20 text-slate-900 dark:text-white'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <FontAwesomeIcon icon={faCreditCard} className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-2" />
                <p className="font-bold text-sm">ক্রেডিট / ডেবিট কার্ড</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">ভিসা, মাস্টারকার্ড</p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('bkash')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  paymentMethod === 'bkash'
                    ? 'border-pink-600 bg-pink-50/50 dark:bg-pink-950/60 ring-2 ring-pink-500/20 text-slate-900 dark:text-white'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <FontAwesomeIcon icon={faMobileAlt} className="w-5 h-5 text-pink-600 dark:text-pink-400 mb-2" />
                <p className="font-bold text-sm">বিকাশ মোবাইল ওয়ালেট</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">ইনস্ট্যান্ট বিকাশ পেমেন্ট</p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cash_on_delivery')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  paymentMethod === 'cash_on_delivery'
                    ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/60 ring-2 ring-emerald-500/20 text-slate-900 dark:text-white'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <FontAwesomeIcon icon={faMoneyBillWave} className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-2" />
                <p className="font-bold text-sm">ক্যাশ অন ডেলিভারি</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">পণ্য বুঝে পেয়ে টাকা দিন</p>
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary Preview */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="font-black text-slate-900 dark:text-white text-base border-b border-slate-100 dark:border-slate-800 pb-3">
              অর্ডার রিভিউ ({cart.length}টি পণ্য)
            </h2>

            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-xs">
                  <img src={item.image} alt="" className="w-10 h-10 object-cover rounded-xl bg-slate-100 dark:bg-slate-800" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{item.title}</p>
                    <p className="text-slate-400">{item.quantity} x ৳{item.price}</p>
                  </div>
                  <span className="font-black text-slate-900 dark:text-white">৳{item.quantity * item.price}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-400 font-bold">
              <div className="flex justify-between">
                <span>পণ্যের মোট দাম</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200">৳{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>ডেলিভারি চার্জ</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200">{shipping === 0 ? 'ফ্রি' : `৳${shipping}`}</span>
              </div>
              <div className="flex justify-between">
                <span>ভ্যাট (৫%)</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200">৳{tax}</span>
              </div>
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-baseline text-sm">
                <span className="font-black text-slate-900 dark:text-white">সর্বমোট প্রদেয়</span>
                <span className="font-black text-indigo-600 dark:text-indigo-400 text-xl">৳{totalAmount}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn btn-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl border-none shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 mt-4"
            >
              <FontAwesomeIcon icon={faLock} className="w-4 h-4" />
              <span>{isSubmitting ? 'অর্ডার সাবমিট হচ্ছে...' : `৳${totalAmount} দিয়ে অর্ডার কনফার্ম করুন`}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
