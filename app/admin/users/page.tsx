'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faUserCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import { User } from '@/lib/db/schema';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users || []);
      }
    } catch {
      toast.error('ইউজার তালিকা লোড করতে সমস্যা হয়েছে');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleRole = async (userId: string, currentRole: 'user' | 'admin') => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle-role',
          userId,
          role: newRole
        })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`ইউজার রোল পরিবর্তন করে ${newRole === 'admin' ? 'অ্যাডমিন' : 'গ্রাহক'} করা হয়েছে`);
        setUsers(prev => prev.map(u => (u.id === userId ? { ...u, role: newRole } : u)));
      } else {
        toast.error(data.error || 'ইউজার রোল পরিবর্তন করা সম্ভব হয়নি');
      }
    } catch {
      toast.error('ত্রুটি ঘটেছে');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই ইউজারের অ্যাকাউন্টটি মুছে ফেলতে চান?')) return;
    try {
      const res = await fetch(`/api/users?userId=${userId}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        toast.success('ইউজার অ্যাকাউন্টটি মুছে ফেলা হয়েছে');
        setUsers(prev => prev.filter(u => u.id !== userId));
      } else {
        toast.error(data.error || 'ইউজার অ্যাকাউন্ট মোছা সম্ভব হয়নি');
      }
    } catch {
      toast.error('ত্রুটি ঘটেছে');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">ইউজার ম্যানেজমেন্ট ও রোল পারমিশন (RBAC)</h1>
        <p className="text-sm text-slate-500 mt-0.5">অ্যাডমিন প্রিভিলেজ প্রদান করুন, রোল ডিমোট/প্রোমোট করুন এবং ইউজার অ্যাকাউন্ট নিয়ন্ত্রণ করুন</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
              <tr>
                <th>ইউজার প্রোফাইল</th>
                <th>ইমেইল অ্যাড্রেস</th>
                <th>বর্তমান রোল</th>
                <th>যোগদানের তারিখ</th>
                <th className="text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 border-b border-slate-100 font-sans">
                  <td>
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt="" className="w-9 h-9 rounded-full bg-slate-100 object-cover border border-slate-200" />
                      <div>
                        <p className="font-bold text-slate-900">{u.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">আইডি: {u.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="font-bold text-slate-800">{u.email}</td>
                  <td>
                    <span className={`badge badge-sm font-extrabold uppercase text-[10px] px-2.5 py-1 ${
                      u.role === 'admin' ? 'bg-amber-100 text-amber-900 border-amber-200' : 'bg-emerald-100 text-emerald-900 border-emerald-200'
                    }`}>
                      {u.role === 'admin' ? 'অ্যাডমিন' : 'গ্রাহক (User)'}
                    </span>
                  </td>
                  <td className="text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {u.id !== currentUser?.id && (
                        <>
                          <button
                            onClick={() => handleToggleRole(u.id, u.role)}
                            className="btn btn-xs btn-light-primary rounded-lg font-bold"
                          >
                            {u.role === 'admin' ? 'কাস্টমারে পরিণত করুন' : 'অ্যাডমিন বানান'}
                          </button>

                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="btn btn-xs btn-ghost text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                          >
                            <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      {u.id === currentUser?.id && (
                        <span className="text-[10px] font-bold text-slate-400 italic">বর্তমান সেশন</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
