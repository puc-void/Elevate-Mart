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
  const featuredProducts = await db.getProducts({ featured: true });
  const allProducts = await db.getProducts();

  return (
    <div className="space-y-16 pb-12">
      
      {/* Bangla Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/90 via-slate-900/95 to-slate-950/90 z-10" />
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80"
          alt="Hero Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />

        <div className="relative z-20 max-w-7xl mx-auto px-6 py-20 lg:py-28 flex flex-col items-start gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold backdrop-blur-md">
            <FontAwesomeIcon icon={faMagic} className="w-3.5 h-3.5 text-indigo-400" />
            <span>প্রিমিয়াম ই-কমার্স শপিং অভিজ্ঞতা ২০২৬</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight max-w-3xl">
            আপনার দৈনন্দিন জীবনের <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-amber-300 bg-clip-text text-transparent">সেরা গ্যাজেট ও ফ্যাশন</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed">
            স্মার্টওয়্যার, সাউন্ড সিস্টেম, প্রিমিয়াম লাইটিং এবং আধুনিক ফ্যাশন এক্সেসরিজ পান আকর্ষণীয় মূল্যে সরাসরি আপনার দ্বারে।
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/products"
              className="btn btn-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl border-none shadow-lg shadow-indigo-600/30 px-8 flex items-center gap-2 group"
            >
              <span>পণ্য কালেকশন দেখুন</span>
              <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="/login"
              className="btn btn-lg bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl border border-white/20 backdrop-blur-md px-6"
            >
              ডেমো অ্যাডমিন / কাস্টমার লগইন
            </Link>
          </div>

          <div className="flex items-center gap-6 pt-6 text-xs text-slate-400 border-t border-white/10 w-full max-w-xl font-bold">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faBolt} className="w-4 h-4 text-amber-400" />
              <span>ইনস্ট্যান্ট চেকআউট</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faShieldAlt} className="w-4 h-4 text-emerald-400" />
              <span>নিওন ডাটাবেজ ব্যাকএন্ড</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faStar} className="w-4 h-4 text-indigo-400" />
              <span>৪.৯/৫ কাস্টমার রেটিং</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              ক্যাটাগরি সমূহ
            </h2>
            <p className="text-slate-500 text-sm mt-1">পছন্দের ক্যাটাগরি বেছে নিন</p>
          </div>
          <Link href="/products" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5">
            <span>সবগুলো দেখুন</span>
            <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?categoryId=${cat.id}`}
              className="group relative h-64 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover-card"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-300 bg-indigo-950/70 px-2.5 py-1 rounded-full border border-indigo-500/30 backdrop-blur-md">
                  ক্যাটাগরি
                </span>
                <h3 className="text-xl font-bold mt-2 text-white group-hover:text-indigo-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-1 mt-1 font-normal opacity-90">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
              <FontAwesomeIcon icon={faMagic} className="w-3.5 h-3.5 text-indigo-600" /> বিশেষ অফার ও সুপারিশ
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
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
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            সকল ক্যাটাগরির পণ্যসমূহ
          </h2>
          <p className="text-slate-500 text-sm mt-1">অরিজিনাল ওয়ারেন্টি সহ সেরা অফার</p>
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
