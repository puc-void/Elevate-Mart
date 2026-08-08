'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faSlidersH, faRedo } from '@fortawesome/free-solid-svg-icons';
import { Product, Category } from '@/lib/db/schema';
import ProductCard from '@/components/ProductCard';

function ProductsCatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('categoryId') || '';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [maxPrice, setMaxPrice] = useState<number>(150000);
  const [sortBy, setSortBy] = useState<string>('featured');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
    if (initialSearch) setSearchQuery(initialSearch);
  }, [initialCategory, initialSearch]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [resProd, resCat] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories')
      ]);
      const dataProd = await resProd.json();
      const dataCat = await resCat.json();
      setProducts(dataProd.products || []);
      setCategories(dataCat.categories || []);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter & Sort Logic
  const filteredProducts = products
    .filter(p => {
      if (selectedCategory && p.categoryId !== selectedCategory) return false;
      if (p.price > maxPrice) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        const matchCat = p.categoryName.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchCat) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });

  const resetFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setMaxPrice(150000);
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Catalog Title Banner */}
      <div className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">পণ্য ক্যাটালগ</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">প্রিমিয়াম ইলেকট্রনিক্স, গ্যাজেট, ফ্যাশন ও হোম ডেকোরেশন এক জায়গায়</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2">
            <FontAwesomeIcon icon={faSlidersH} className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>সাজান:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-bold text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer"
            >
              <option value="featured">প্রথমে পপুলার</option>
              <option value="price-low">দাম: কম থেকে বেশি</option>
              <option value="price-high">দাম: বেশি থেকে কম</option>
              <option value="rating">সেরা রেটিং</option>
            </select>
          </div>

          {(selectedCategory || searchQuery || maxPrice < 150000) && (
            <button
              onClick={resetFilters}
              className="btn btn-sm btn-light-danger rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <FontAwesomeIcon icon={faRedo} className="w-3 h-3" />
              <span>রিসেট</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Filter Sidebar & Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            
            {/* Search Input (No Placeholder) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                পণ্য খুঁজুন
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="পণ্য খুঁজুন"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-slate-100"
                />
                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                ক্যাটাগরি
              </label>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-colors flex items-center justify-between ${
                    selectedCategory === ''
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>সব ক্যাটাগরি</span>
                  <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full font-bold">
                    {products.length}
                  </span>
                </button>
                {categories.map((cat) => {
                  const count = products.filter(p => p.categoryId === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-colors flex items-center justify-between ${
                        selectedCategory === cat.id
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full font-bold">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Filter Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  সর্বোচ্চ মূল্য
                </label>
                <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">৳{maxPrice}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="150000"
                step="2000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="range range-xs range-primary w-full"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
                <span>৳১,০০০</span>
                <span>৳১,৫০,০০০</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 animate-pulse space-y-4">
                  <div className="bg-slate-200 dark:bg-slate-800 aspect-square rounded-xl w-full" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4">
              <FontAwesomeIcon icon={faFilter} className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">কোনো পণ্য পাওয়া যায়নি</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                অন্য কোনো সার্চ শব্দ বা ফিল্টার নির্বাচন করে আবার চেষ্টা করুন।
              </p>
              <button onClick={resetFilters} className="btn btn-sm btn-light-primary rounded-xl font-bold">
                সব ফিল্টার রিসেট করুন
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-4 text-xs font-bold text-slate-500 dark:text-slate-400">
                মোট <strong className="text-slate-900 dark:text-white">{filteredProducts.length}</strong> টি পণ্য পাওয়া গেছে
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">ক্যাটালগ লোড হচ্ছে...</div>}>
      <ProductsCatalogContent />
    </Suspense>
  );
}
