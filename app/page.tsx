import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagic,
  faArrowRight,
  faShieldAlt,
  faBolt,
  faStar,
  faShoppingBag,
  faTag
} from '@fortawesome/free-solid-svg-icons';
import { db } from '@/lib/db';
import ProductCard from '@/components/ProductCard';

export const revalidate = 0;

export default async function HomePage() {
  const categories = await db.getCategories();
  const featuredRes = await db.getProducts({ featured: true, limit: 6 });
  const allRes = await db.getProducts({ limit: 6 });

  const featuredProducts = featuredRes.products || [];
  const allProducts = allRes.products || [];

  return (
    <div className="space-y-16 pb-12">
      
      {/* Bangla Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/90 via-slate-900/95 to-slate-950/90 z-10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl" />

        <div className="relative z-20 max-w-7xl mx-auto px-6 py-16 sm:py-24 lg:px-12 flex flex-col items-start gap-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <FontAwesomeIcon icon={faStar} className="w-3.5 h-3.5 text-amber-400" />
            <span>বাংলাদেশের বিশ্বস্ত বাংলা ই-কমার্স প্ল্যাটফর্ম</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight max-w-3xl">
            আধুনিক গ্যাজেট ও লাক্সারি লাইফস্টাইল <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-amber-300 bg-clip-text text-transparent">ইলেভেট মার্টে</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed font-sans">
            অরিজিনাল ইলেকট্রনিক্স, ফ্ল্যাগশিপ স্মার্টফোন এবং প্রিমিয়াম ফ্যাশন প্রোডাক্ট কিনুন ১০০% খাঁটি ওয়ারেন্টি সহ সরাসরি আপনার দরজায়।
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/products"
              className="btn btn-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl border-none shadow-lg shadow-indigo-600/30 px-8 flex items-center gap-2 group"
            >
              <span>পণ্য কালেকশন দেখুন</span>
              <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="flex items-center gap-6 pt-6 text-xs text-slate-400 border-t border-white/10 w-full max-w-xl font-bold">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faBolt} className="w-4 h-4 text-amber-400" />
              <span>ইনস্ট্যান্ট চেকআউট</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faShieldAlt} className="w-4 h-4 text-emerald-400" />
              <span>১০০% প্রামাণিক ওয়ারেন্টি</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faShoppingBag} className="w-4 h-4 text-sky-400" />
              <span>ফ্রি রিটার্ন সুবিধা</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              পপুলার ক্যাটাগরি
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">পছন্দের ক্যাটাগরি নির্বাচন করে কেনাকাটা শুরু করুন</p>
          </div>
          <Link href="/products" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
            <span>সবগুলো দেখুন</span> <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?categoryId=${cat.id}`}
              className="group bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover-card flex flex-col justify-between"
            >
              <div className="aspect-video w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 mb-4">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{cat.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <span>ব্রাউজ করুন</span>
                <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
              <FontAwesomeIcon icon={faMagic} className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> বিশেষ অফার ও সুপারিশ
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              ফ্ল্যাগশিপ সেরা পণ্যসমূহ
            </h2>
          </div>
          <Link href="/products" className="btn btn-sm btn-light-primary rounded-xl font-bold">
            সব পণ্য দেখুন
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Promo Coupon Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-indigo-600 to-sky-600 text-white p-8 sm:p-12 overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="px-3 py-1 rounded-full bg-white/20 text-white font-bold text-xs tracking-wider uppercase backdrop-blur-md">
              বিশেষ ছাড় কুপন
            </span>
            <h3 className="text-3xl sm:text-4xl font-black tracking-tight">
              প্রথম অর্ডারে ২০% ছাড় উপভোগ করুন!
            </h3>
            <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
              চেকআউটে কুপন কোড ব্যবহার করুন <strong className="bg-white text-indigo-600 px-2.5 py-0.5 rounded font-mono">ELEVATE20</strong> এবং পান ফ্রি হোম ডেলিভারি!
            </p>
            <div className="pt-2">
              <Link href="/products" className="btn bg-white hover:bg-slate-100 text-indigo-600 font-bold rounded-xl border-none shadow-md px-6">
                এখনই কেনাকাটা করুন
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Product Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            সকল ক্যাটাগরির পণ্যসমূহ
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">অরিজিনাল ওয়ারেন্টি সহ সেরা অফার</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
