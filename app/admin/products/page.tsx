'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSearch, faStar } from '@fortawesome/free-solid-svg-icons';
import { Product, Category } from '@/lib/db/schema';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formOriginalPrice, setFormOriginalPrice] = useState('');
  const [formStock, setFormStock] = useState('15');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formIsFeatured, setFormIsFeatured] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resProd, resCat] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories')
      ]);
      const dataProd = await resProd.json();
      const dataCat = await resCat.json();

      setProducts(dataProd.products || []);
      setCategories(dataCat.categories || []);
      if (dataCat.categories?.length > 0) {
        setFormCategoryId(dataCat.categories[0].id);
      }
    } catch {
      toast.error('ক্যাটালগ লোড করা সম্ভব হয়নি');
    } finally {
      setIsLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormTitle('');
    setFormDescription('');
    setFormPrice('');
    setFormOriginalPrice('');
    setFormStock('15');
    setFormImage('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80');
    setFormIsFeatured(false);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormTitle(p.title);
    setFormDescription(p.description);
    setFormPrice(p.price.toString());
    setFormOriginalPrice(p.originalPrice ? p.originalPrice.toString() : '');
    setFormStock(p.stock.toString());
    setFormCategoryId(p.categoryId);
    setFormImage(p.images[0] || '');
    setFormIsFeatured(p.isFeatured);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formPrice || !formCategoryId) {
      toast.error('প্রয়োজনীয় ঘরগুলো পূরণ করুন');
      return;
    }

    const categoryObj = categories.find(c => c.id === formCategoryId);

    const payload = {
      title: formTitle,
      description: formDescription,
      price: Number(formPrice),
      originalPrice: formOriginalPrice ? Number(formOriginalPrice) : undefined,
      stock: Number(formStock),
      categoryId: formCategoryId,
      categoryName: categoryObj?.name || 'General',
      images: [formImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'],
      isFeatured: formIsFeatured
    };

    try {
      if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          toast.success('পণ্য তথ্য আপডেট করা হয়েছে!');
          setIsModalOpen(false);
          fetchData();
        } else {
          toast.error('পণ্য আপডেট করা সম্ভব হয়নি');
        }
      } else {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          toast.success('নতুন পণ্য সফলভাবে যুক্ত হয়েছে!');
          setIsModalOpen(false);
          fetchData();
        } else {
          toast.error('নতুন পণ্য যুক্ত করতে সমস্যা হয়েছে');
        }
      }
    } catch {
      toast.error('পণ্য সংরক্ষণ করতে ব্যর্থ হয়েছে');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই পণ্যটি মুছে ফেলতে চান?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('পণ্যটি মুছে ফেলা হয়েছে');
        setProducts(prev => prev.filter(p => p.id !== id));
      } else {
        toast.error('পণ্যটি মোছা সম্ভব হয়নি');
      }
    } catch {
      toast.error('ত্রুটি ঘটেছে');
    }
  };

  const filtered = products.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">পণ্য ম্যানেজমেন্ট (CRUD)</h1>
          <p className="text-sm text-slate-500 mt-0.5">নতুন পণ্য যোগ করুন, তথ্য এডিট করুন ও স্টক আপডেট করুন</p>
        </div>

        <button
          onClick={openAddModal}
          className="btn btn-sm bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl border-none shadow-md flex items-center gap-1.5"
        >
          <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
          <span>নতুন পণ্য যোগ করুন</span>
        </button>
      </div>

      {/* Search Input (No Placeholder) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm max-w-md">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="পণ্যের নাম লিখে খুঁজুন"
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800 font-bold"
          />
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
              <tr>
                <th>পণ্য</th>
                <th>ক্যাটাগরি</th>
                <th>বিক্রয় মূল্য</th>
                <th>স্টক সংখ্যা</th>
                <th>রেটিং</th>
                <th>ফিচার্ড</th>
                <th className="text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400 font-bold">
                    কোনো পণ্য পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 border-b border-slate-100 font-sans">
                    <td>
                      <div className="flex items-center gap-3">
                        <img src={p.images[0]} alt="" className="w-10 h-10 object-cover rounded-xl bg-slate-100 border border-slate-200" />
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{p.title}</p>
                          <p className="text-[10px] text-slate-400 font-mono">আইডি: {p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-sm bg-slate-100 text-slate-700 border-slate-200 font-bold text-[10px]">
                        {p.categoryName}
                      </span>
                    </td>
                    <td className="font-black text-slate-900">৳{p.price}</td>
                    <td>
                      <span className={`font-bold ${p.stock < 10 ? 'text-rose-500' : 'text-slate-800'}`}>
                        {p.stock}টি
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1 font-bold text-amber-500">
                        <FontAwesomeIcon icon={faStar} className="w-3 h-3 text-amber-400" />
                        <span>{p.rating}</span>
                      </div>
                    </td>
                    <td>
                      {p.isFeatured ? (
                        <span className="badge badge-sm bg-indigo-100 text-indigo-800 border-none font-bold text-[10px]">হ্যাঁ</span>
                      ) : (
                        <span className="text-slate-400 font-medium">না</span>
                      )}
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(p)}
                          className="btn btn-xs btn-ghost text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                        >
                          <FontAwesomeIcon icon={faEdit} className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="btn btn-xs btn-ghost text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                        >
                          <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-base">
                {editingProduct ? 'পণ্য এডিট করুন' : 'নতুন পণ্য যোগ করুন'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="btn btn-sm btn-circle btn-ghost text-slate-400">✕</button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">পণ্যের নাম</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">বিক্রয় মূল্য (৳)</label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">পূর্বের মূল্য (৳)</label>
                  <input
                    type="number"
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">স্টক সংখ্যা</label>
                  <input
                    type="number"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">ক্যাটাগরি</label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">ছবি লিঙ্ক (URL)</label>
                <input
                  type="url"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">বিবরণ</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={formIsFeatured}
                  onChange={(e) => setFormIsFeatured(e.target.checked)}
                  className="checkbox checkbox-xs checkbox-primary"
                />
                <label htmlFor="featuredCheck" className="font-bold text-slate-800">
                  হোমপেজে ফিচার্ড হিসেবে প্রদর্শন করুন
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-sm btn-ghost rounded-xl font-bold">বাতিল</button>
                <button type="submit" className="btn btn-sm bg-indigo-600 text-white font-bold rounded-xl border-none px-5">
                  পণ্য সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
