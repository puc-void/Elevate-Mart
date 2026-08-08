'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Order } from '@/lib/db/schema';
import toast from 'react-hot-toast';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected Order Modal
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
      toast.error('অর্ডার লোড করতে সমস্যা হয়েছে');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`অর্ডার #${orderId} এর স্ট্যাটাস পরিবর্তন করা হয়েছে`);
        setOrders(prev => prev.map(o => (o.id === orderId ? data.order : o)));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(data.order);
        }
      } else {
        toast.error(data.error || 'স্ট্যাটাস পরিবর্তন করা সম্ভব হয়নি');
      }
    } catch {
      toast.error('ত্রুটি ঘটেছে');
    }
  };

  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter(o => o.status === statusFilter);

  // Pagination Math
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">অর্ডার ম্যানেজমেন্ট</h1>
          <p className="text-sm text-slate-500 mt-0.5">গ্রাহকদের অর্ডার দেখুন, শিপিং পার্সেল প্রস্তুত করুন ও স্ট্যাটাস পরিবর্তন করুন</p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm text-xs font-bold overflow-x-auto">
          {[
            { key: 'all', label: 'সবগুলো' },
            { key: 'pending', label: 'পেন্ডিং' },
            { key: 'processing', label: 'প্রসেসিং' },
            { key: 'shipped', label: 'ডেলিভারিতে' },
            { key: 'delivered', label: 'সম্পন্ন' },
            { key: 'cancelled', label: 'বাতিল' }
          ].map((st) => (
            <button
              key={st.key}
              onClick={() => { setStatusFilter(st.key); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-xl capitalize transition-all ${
                statusFilter === st.key
                  ? 'bg-slate-900 text-white font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 pb-4">
        <div className="overflow-x-auto">
          <table className="table w-full text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
              <tr>
                <th>অর্ডার আইডি</th>
                <th>গ্রাহক</th>
                <th>পেমেন্ট মেথড</th>
                <th>মোট প্রদেয়</th>
                <th>বর্তমান স্ট্যাটাস</th>
                <th>স্ট্যাটাস পরিবর্তন করুন</th>
                <th className="text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400 font-bold">
                    কোনো অর্ডার পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-100 dark:hover:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 font-sans">
                    <td className="font-extrabold text-slate-900">#{ord.id}</td>
                    <td>
                      <p className="font-bold text-slate-900">{ord.userName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{ord.userEmail}</p>
                    </td>
                    <td>
                      <span className="uppercase text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                        {ord.paymentMethod.replace(/_/g, ' ')}
                      </span>
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
                    <td>
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value as Order['status'])}
                        className="select select-xs select-bordered font-bold text-slate-800 focus:outline-none cursor-pointer bg-white rounded-lg"
                      >
                        <option value="pending">অপেক্ষমাণ (Pending)</option>
                        <option value="processing">প্রসেসিং (Processing)</option>
                        <option value="shipped">ডেলিভারিতে আছে (Shipped)</option>
                        <option value="delivered">ডেলিভারি সম্পন্ন (Delivered)</option>
                        <option value="cancelled">বাতিলকৃত (Cancelled)</option>
                      </select>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="btn btn-xs btn-light-primary rounded-lg font-bold flex items-center gap-1.5 ml-auto"
                      >
                        <FontAwesomeIcon icon={faEye} className="w-3 h-3" />
                        <span>পরীক্ষা করুন</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 pt-2 text-xs font-bold text-slate-500">
            <span>মোট {totalItems} টি অর্ডারের মধ্যে {startIndex + 1} - {Math.min(startIndex + itemsPerPage, totalItems)} প্রদর্শিত</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="btn btn-xs btn-ghost rounded-lg font-bold disabled:opacity-40"
              >
                <FontAwesomeIcon icon={faChevronLeft} className="w-3 h-3" />
              </button>
              <span>পেজ {currentPage} / {totalPages}</span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="btn btn-xs btn-ghost rounded-lg font-bold disabled:opacity-40"
              >
                <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Inspect Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-slate-900 text-base">অর্ডার বিবরণ #{selectedOrder.id}</h3>
                <p className="text-xs text-slate-400 font-bold">ট্র্যাকিং নম্বর: <strong className="text-indigo-600 font-mono">{selectedOrder.trackingNumber}</strong></p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="btn btn-sm btn-circle btn-ghost text-slate-400">✕</button>
            </div>

            <div className="space-y-3 text-xs font-sans">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <p className="font-bold text-slate-700 uppercase">গ্রাহকের শিপিং ঠিকানা</p>
                <p className="font-bold text-slate-900">{selectedOrder.shippingAddress.fullName}</p>
                <p className="text-slate-600">{selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city} {selectedOrder.shippingAddress.zipCode}</p>
                <p className="text-slate-500 font-bold">মোবাইল: {selectedOrder.shippingAddress.phone}</p>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-slate-700 uppercase">অর্ডারকৃত পণ্যসমূহ ({selectedOrder.items.length}টি)</p>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className="flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-200">
                      <img src={item.image} alt="" className="w-8 h-8 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 truncate">{item.title}</p>
                        <p className="text-slate-400">{item.quantity} x ৳{item.price}</p>
                      </div>
                      <span className="font-black text-slate-900">৳{item.quantity * item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
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
