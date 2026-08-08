'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDollarSign,
  faShoppingCart,
  faBoxOpen,
  faUsers,
  faChartLine,
  faExclamationTriangle,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { Order, Product, User } from '@/lib/db/schema';
import toast from 'react-hot-toast';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [resOrd, resProd, resUser] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/products'),
        fetch('/api/users')
      ]);
      const dataOrd = await resOrd.json();
      const dataProd = await resProd.json();
      const dataUser = await resUser.json();

      if (resOrd.ok) setOrders(dataOrd.orders || []);
      if (resProd.ok) setProducts(dataProd.products || []);
      if (resUser.ok) setUsers(dataUser.users || []);
    } catch {
      toast.error('ড্যাশবোর্ড তথ্য লোড করা সম্ভব হয়নি');
    } finally {
      setIsLoading(false);
    }
  };

  const totalRevenue = orders.reduce((sum, ord) => sum + ord.totalAmount, 0);
  const lowStockProducts = products.filter(p => p.stock < 15);

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="loading loading-spinner loading-lg text-amber-500"></div>
        <p className="text-sm text-slate-500 mt-2 font-bold">এনালাইটিক্স রিপোর্ট হিসাব করা হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">অ্যাডমিন ড্যাশবোর্ড ওভারভিউ</h1>
          <p className="text-sm text-slate-500 mt-0.5">রিয়েল-টাইম বিক্রয় পরিসংখ্যান, রাজস্ব আয় ও ইনভেন্টরি রিপোর্ট</p>
        </div>

        <Link href="/admin/products" className="btn btn-sm bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl border-none shadow-md">
          + নতুন পণ্য যোগ করুন
        </Link>
      </div>

      {/* 4 Core Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">মোট রাজস্ব আয়</p>
            <p className="text-2xl font-black text-slate-900 mt-1">৳{totalRevenue}</p>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
              <FontAwesomeIcon icon={faChartLine} className="w-3.5 h-3.5" /> +১৮.৪% গত মাসের তুলনায়
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
            <FontAwesomeIcon icon={faDollarSign} className="w-5 h-5 text-emerald-600" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">মোট অর্ডার</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{orders.length}টি</p>
            <p className="text-[11px] font-bold text-indigo-600 mt-1">
              {orders.filter(o => o.status === 'pending').length}টি পেন্ডিং অর্ডার
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold">
            <FontAwesomeIcon icon={faShoppingCart} className="w-5 h-5 text-indigo-600" />
          </div>
        </div>

        {/* Active Products */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">সক্রিয় পণ্যসমূহ</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{products.length}টি</p>
            <p className="text-[11px] font-bold text-amber-600 mt-1">
              {lowStockProducts.length}টি কম স্টক পণ্য
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
            <FontAwesomeIcon icon={faBoxOpen} className="w-5 h-5 text-amber-600" />
          </div>
        </div>

        {/* Registered Users */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">নিবন্ধিত গ্রাহক</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{users.length}জন</p>
            <p className="text-[11px] font-bold text-slate-500 mt-1">
              {users.filter(u => u.role === 'admin').length}জন অ্যাডমিন
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-600 flex items-center justify-center font-bold">
            <FontAwesomeIcon icon={faUsers} className="w-5 h-5 text-sky-600" />
          </div>
        </div>
      </div>

      {/* Grid: Low Stock Alert & Recent Activity Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-slate-900 text-base">সাম্প্রতিক গ্রাহক অর্ডারসমূহ</h2>
            <Link href="/admin/orders" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
              <span>সবগুলো দেখুন</span> <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-sm w-full text-xs text-slate-700">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 uppercase font-bold text-[10px]">
                  <th>অর্ডার আইডি</th>
                  <th>গ্রাহকের নাম</th>
                  <th>মোট প্রদেয়</th>
                  <th>স্ট্যাটাস</th>
                  <th>তারিখ</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50">
                    <td className="font-bold text-slate-900">#{ord.id}</td>
                    <td>
                      <p className="font-bold text-slate-800">{ord.userName}</p>
                      <p className="text-[10px] text-slate-400">{ord.userEmail}</p>
                    </td>
                    <td className="font-black text-slate-900">৳{ord.totalAmount}</td>
                    <td>
                      <span className={`badge badge-sm uppercase text-[10px] font-bold ${
                        ord.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                        ord.status === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                        ord.status === 'processing' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ord.status === 'delivered' ? 'সম্পন্ন' : ord.status === 'shipped' ? 'ডেলিভারিতে' : ord.status === 'processing' ? 'প্রসেসিং' : 'পেন্ডিং'}
                      </span>
                    </td>
                    <td className="text-slate-400">{new Date(ord.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <FontAwesomeIcon icon={faExclamationTriangle} className="w-4 h-4 text-amber-500" /> স্টক সতর্কতা ইনভেন্টরি
          </h2>

          <div className="space-y-3">
            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-slate-400 italic">সকল পণ্যের পর্যাপ্ত স্টক আছে!</p>
            ) : (
              lowStockProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-amber-50/50 rounded-2xl border border-amber-200/60 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={p.images[0]} alt="" className="w-8 h-8 object-cover rounded-lg bg-white" />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">{p.title}</p>
                      <p className="text-[10px] text-slate-500">৳{p.price}</p>
                    </div>
                  </div>
                  <span className="badge bg-amber-200 text-amber-900 font-black text-[10px] ml-2">
                    {p.stock}টি বাকি
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
