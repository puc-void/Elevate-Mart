'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faEdit, faFolderTree } from '@fortawesome/free-solid-svg-icons';
import { Category, Product } from '@/lib/db/schema';
import toast from 'react-hot-toast';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form Fields
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catImage, setCatImage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resCat, resProd] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/products')
      ]);
      const dataCat = await resCat.json();
      const dataProd = await resProd.json();
      setCategories(dataCat.categories || []);
      setProducts(dataProd.products || []);
    } catch {
      toast.error('ক্যাটাগরি লোড করা সম্ভব হয়নি');
    } finally {
      setIsLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setCatName('');
    setCatDesc('');
    setCatImage('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatDesc(cat.description || '');
    setCatImage(cat.image || '');
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) {
      toast.error('ক্যাটাগরির নাম বাধ্যতামূলক');
      return;
    }

    try {
      if (editingCategory) {
        const res = await fetch('/api/categories', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingCategory.id,
            name: catName,
            description: catDesc,
            image: catImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
          })
        });

        if (res.ok) {
          toast.success('ক্যাটাগরি সফলভাবে আপডেট করা হয়েছে!');
          setIsModalOpen(false);
          fetchData();
        } else {
          toast.error('ক্যাটাগরি আপডেট করতে সমস্যা হয়েছে');
        }
      } else {
        const res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: catName,
            description: catDesc,
            image: catImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
          })
        });

        if (res.ok) {
          toast.success('নতুন ক্যাটাগরি সফলভাবে তৈরি হয়েছে!');
          setIsModalOpen(false);
          fetchData();
        } else {
          toast.error('ক্যাটাগরি তৈরি করতে সমস্যা হয়েছে');
        }
      }
    } catch {
      toast.error('ত্রুটি ঘটেছে');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই ক্যাটাগরিটি মুছে ফেলতে চান?')) return;
    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('ক্যাটাগরি মুছে ফেলা হয়েছে');
        setCategories(prev => prev.filter(c => c.id !== id));
      } else {
        toast.error('ক্যাটাগরি মোছা সম্ভব হয়নি');
      }
    } catch {
      toast.error('ত্রুটি ঘটেছে');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">ক্যাটাগরি ম্যানেজমেন্ট</h1>
          <p className="text-sm text-slate-500 mt-0.5">দোকানের ক্যাটাগরি যোগ করুন, তথ্য এডিট করুন ও সাজান</p>
        </div>

        <button
          onClick={openAddModal}
          className="btn btn-sm bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl border-none shadow-md flex items-center gap-1.5"
        >
          <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
          <span>নতুন ক্যাটাগরি যোগ করুন</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const count = products.filter(p => p.categoryId === cat.id).length;
          return (
            <div key={cat.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover-card">
              <div>
                <div className="h-36 bg-slate-100 relative overflow-hidden">
                  <img src={cat.image} alt="" className="w-full h-full object-cover" />
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-900 font-bold text-xs px-2.5 py-1 rounded-full shadow-sm">
                    {count}টি পণ্য
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-extrabold text-slate-900 text-base mb-1">{cat.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{cat.description}</p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => openEditModal(cat)}
                  className="btn btn-xs btn-ghost text-indigo-600 hover:bg-indigo-50 rounded-lg flex items-center gap-1 font-bold"
                >
                  <FontAwesomeIcon icon={faEdit} className="w-3.5 h-3.5" />
                  <span>এডিট করুন</span>
                </button>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="btn btn-xs btn-ghost text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-1 font-bold"
                >
                  <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                  <span>মুছে ফেলুন</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-base">
                {editingCategory ? 'ক্যাটাগরি এডিট করুন' : 'নতুন ক্যাটাগরি তৈরি'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="btn btn-sm btn-circle btn-ghost text-slate-400">✕</button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">ক্যাটাগরির নাম</label>
                <input
                  type="text"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">ছবি লিঙ্ক (URL)</label>
                <input
                  type="url"
                  value={catImage}
                  onChange={(e) => setCatImage(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">সংক্ষিপ্ত বিবরণ</label>
                <textarea
                  rows={3}
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-sm btn-ghost rounded-xl font-bold">বাতিল</button>
                <button type="submit" className="btn btn-sm bg-indigo-600 text-white font-bold rounded-xl border-none px-5">
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
