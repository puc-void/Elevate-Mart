import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faLayerGroup,
  faSlidersH
} from '@fortawesome/free-solid-svg-icons';
import { db } from '@/lib/db';
import ProductCard from '@/components/ProductCard';
import HeroSection from '@/components/HeroSection';

export const revalidate = 0;

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<{ categoryId?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const selectedCategoryId = params.categoryId || '';

  const categories = await db.getCategories();
  
  // Fetch products based on selected category, or fetch all by default!
  const productsRes = await db.getProducts({
    categoryId: selectedCategoryId || undefined,
    limit: 24
  });

  const products = productsRes.products || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 font-sans">
      
      {/* Dynamic Expanded Hero Section with Typewriter Animation & Shopping BG Overlay */}
      <HeroSection />

      {/* Top Category Buttons Navigation Bar */}
      <section className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white text-base">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <FontAwesomeIcon icon={faSlidersH} className="w-4 h-4" />
            </div>
            <span>ক্যাটাগরি অনুযায়ী ফিল্টার করুন:</span>
          </div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            মোট {products.length}টি পণ্য প্রদর্শিত
          </span>
        </div>

        {/* Horizontal Scrollable Category Button Bar */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1 pt-1 font-sans">
          
          {/* All Products Button (Default Active) */}
          <Link
            href="/"
            className={`px-5 py-2.5 rounded-2xl font-black text-xs flex items-center gap-2 shrink-0 transition-all border ${
              !selectedCategoryId
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/80'
            }`}
          >
            <FontAwesomeIcon icon={faLayerGroup} className="w-3.5 h-3.5" />
            <span>সকল পণ্য (All Products)</span>
          </Link>

          {/* Individual Category Buttons */}
          {categories.map((cat) => {
            const isActive = selectedCategoryId === cat.id;
            return (
              <Link
                key={cat.id}
                href={`/?categoryId=${cat.id}`}
                className={`px-4 py-2.5 rounded-2xl font-black text-xs flex items-center gap-2.5 shrink-0 transition-all border ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/80'
                }`}
              >
                <img
                  src={cat.image}
                  alt=""
                  className="w-5 h-5 rounded-lg object-cover bg-slate-200 dark:bg-slate-700"
                />
                <span>{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Main Default Product Catalog Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {selectedCategoryId
                ? categories.find(c => c.id === selectedCategoryId)?.name || 'পণ্যসমূহ'
                : 'সকল পণ্য কালেকশন'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold mt-1">
              {selectedCategoryId ? 'নির্বাচিত ক্যাটাগরির সেরা পণ্যসমূহ' : 'ডিফল্টভাবে সকল ক্যাটাগরির প্রিমিয়াম পণ্যসমূহ প্রদর্শিত হচ্ছে'}
            </p>
          </div>

          <Link href="/products" className="btn btn-sm btn-light-primary rounded-xl font-black text-xs flex items-center gap-1.5">
            <span>ক্যাটালগ দেখুন</span>
            <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" />
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <p className="text-slate-400 font-bold">এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য পাওয়া যায়নি</p>
            <Link href="/" className="btn btn-sm bg-indigo-600 text-white font-bold rounded-xl border-none">
              সকল পণ্য দেখুন
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
