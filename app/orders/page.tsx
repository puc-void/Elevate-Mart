'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBoxOpen,
  faTruck,
  faCheckCircle,
  faClock,
  faTimesCircle,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import { Order } from '@/lib/db/schema';
import toast from 'react-hot-toast';

export default function UserOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders || []);
      }
    } catch {
      toast.error('অর্ডার হিস্ট্রি লোড করা সম্ভব হয়নি');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <span className="badge bg-amber-100 text-amber-800 border-none font-bold text-xs gap-1.5 py-2 px-3"><FontAwesomeIcon icon={faClock} className="w-3 h-3 text-amber-800" /> অপেক্ষমাণ</span>;
      case 'processing':
        return <span className="badge bg-blue-100 text-blue-800 border-none font-bold text-xs gap-1.5 py-2 px-3"><FontAwesomeIcon icon={faBoxOpen} className="w-3 h-3 text-blue-800" /> প্রসেসিং</span>;
      case 'shipped':
        return <span className="badge bg-indigo-100 text-indigo-800 border-none font-bold text-xs gap-1.5 py-2 px-3"><FontAwesomeIcon icon={faTruck} className="w-3 h-3 text-indigo-800" /> ডেলিভারিতে আছে</span>;
      case 'delivered':
        return <span className="badge bg-emerald-100 text-emerald-800 border-none font-bold text-xs gap-1.5 py-2 px-3"><FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3 text-emerald-800" /> ডেলিভারি সম্পন্ন</span>;
      case 'cancelled':
        return <span className="badge bg-rose-100 text-rose-800 border-none font-bold text-xs gap-1.5 py-2 px-3"><FontAwesomeIcon icon={faTimesCircle} className="w-3 h-3 text-rose-800" /> বাতিলকৃত</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="loading loading-spinner text-indigo-600"></div>
        <p className="text-xs text-slate-400 font-bold mt-2">অর্ডার তথ্য লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">অর্ডার হিস্ট্রি</h1>
        <p className="text-sm text-slate-500 mt-1">আপনার পূর্ববর্তী কেনাকাটা এবং ডেলিভারি ট্র্যাকিং দেখুন</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
          <FontAwesomeIcon icon={faBoxOpen} className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">এখনও কোনো অর্ডার করা হয়নি</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            আপনি যখন কোনো পণ্য অর্ডার করবেন, এখানে তার রিয়েল-টাইম ট্র্যাকিং পাবেন।
          </p>
          <Link href="/products" className="btn btn-sm btn-light-primary rounded-xl font-bold">
            কেনাকাটা শুরু করুন
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover-card"
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                    #
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm">{ord.id}</h3>
                    <p className="text-[11px] text-slate-400 font-bold">অর্ডারের তারিখ: {new Date(ord.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(ord.status)}
                  <span className="font-black text-slate-900 text-base">৳{ord.totalAmount}</span>
                  <button
                    onClick={() => setSelectedOrder(ord)}
                    className="btn btn-sm btn-light-primary rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <FontAwesomeIcon icon={faEye} className="w-3.5 h-3.5" />
                    <span>ট্র্যাকিং ও বিবরণ</span>
                  </button>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {ord.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 text-xs flex-shrink-0">
                    <img src={item.image} alt="" className="w-6 h-6 object-cover rounded" />
                    <span className="font-bold text-slate-800 truncate max-w-[150px]">{item.title}</span>
                    <span className="text-slate-400 font-bold">x{item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interactive Tracking Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl border border-slate-100 relative">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-slate-900 text-lg">অর্ডার #{selectedOrder.id}</h3>
                <p className="text-xs text-slate-400 font-bold">ট্র্যাকিং নম্বর: <strong className="text-indigo-600 font-mono">{selectedOrder.trackingNumber}</strong></p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="btn btn-sm btn-circle btn-ghost text-slate-400 hover:text-slate-900"
              >
                ✕
              </button>
            </div>

            {/* Tracking Steps */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">ডেলিভারি স্ট্যাটাস টাইমলাইন</h4>
              <ul className="steps steps-vertical sm:steps-horizontal w-full text-xs font-bold">
                <li className={`step ${['pending', 'processing', 'shipped', 'delivered'].includes(selectedOrder.status) ? 'step-primary' : ''}`}>
                  অর্ডার গৃহীত
                </li>
                <li className={`step ${['processing', 'shipped', 'delivered'].includes(selectedOrder.status) ? 'step-primary' : ''}`}>
                  প্যাকিং হচ্ছে
                </li>
                <li className={`step ${['shipped', 'delivered'].includes(selectedOrder.status) ? 'step-primary' : ''}`}>
                  ডেলিভারিতে আছে
                </li>
                <li className={`step ${selectedOrder.status === 'delivered' ? 'step-primary' : ''}`}>
                  ডেলিভারি সম্পন্ন
                </li>
              </ul>
            </div>

            {/* Address & Payment Info */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100 font-sans">
              <div>
                <span className="font-bold text-slate-700 block mb-1">শিপিং ঠিকানা:</span>
                <p className="text-slate-800 font-bold">{selectedOrder.shippingAddress.fullName}</p>
                <p className="text-slate-600">{selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}</p>
                <p className="text-slate-600">মোবাইল: {selectedOrder.shippingAddress.phone}</p>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">পেমেন্ট বিবরণ:</span>
                <p className="text-slate-800 font-bold uppercase">{selectedOrder.paymentMethod.replace(/_/g, ' ')}</p>
                <p className="text-slate-600">স্ট্যাটাস: <strong className="text-emerald-600 font-bold uppercase">{selectedOrder.paymentStatus}</strong></p>
                <p className="text-slate-600">মোট পরিমান: ৳{selectedOrder.totalAmount}</p>
              </div>
            </div>

            <div className="text-right">
              <button onClick={() => setSelectedOrder(null)} className="btn btn-sm btn-light-primary rounded-xl px-4 font-bold">
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
