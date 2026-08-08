'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faHeart, faShoppingBag, faEye } from '@fortawesome/free-solid-svg-icons';
import { Product } from '@/lib/db/schema';
import { useCart } from '@/context/CartContext';
import ProductQuickViewModal from './ProductQuickViewModal';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const wishlisted = isWishlisted(product.id);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <>
      <div className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden hover-card">
        
        {/* Product Image Box */}
        <div className="relative aspect-square w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
            {product.isNew && (
              <span className="badge badge-sm bg-indigo-600 text-white font-bold border-none px-2.5 py-1 shadow-sm text-[10px]">
                নতুন
              </span>
            )}
            {discountPercent > 0 && (
              <span className="badge badge-sm bg-rose-500 text-white font-bold border-none px-2.5 py-1 shadow-sm text-[10px]">
                -{discountPercent}% ছাড়
              </span>
            )}
          </div>

          {/* Action Overlay Buttons (Wishlist & Quick View Modal) */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleWishlist(product.id);
              }}
              className={`w-8 h-8 rounded-full backdrop-blur-md transition-all flex items-center justify-center ${
                wishlisted
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-200 hover:bg-white hover:text-rose-500'
              }`}
              title="পছন্দের তালিকায় যুক্ত করুন"
            >
              <FontAwesomeIcon icon={faHeart} className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsQuickViewOpen(true)}
              className="w-8 h-8 rounded-full bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-200 hover:bg-white hover:text-indigo-600 backdrop-blur-md transition-all flex items-center justify-center shadow-sm"
              title="দ্রুত ভিউ করুন"
            >
              <FontAwesomeIcon icon={faEye} className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Product Content Details */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-3 font-sans">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                {product.categoryName}
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                <FontAwesomeIcon icon={faStar} className="w-3 h-3 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-slate-400 text-[10px]">({product.reviewCount})</span>
              </div>
            </div>

            <Link href={`/products/${product.id}`} className="block group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 mb-1 leading-snug">
                {product.title}
              </h3>
            </Link>

            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
              {product.description}
            </p>
          </div>

          {/* Pricing & Add to Cart Action */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-black text-slate-900 dark:text-white text-base">
                  ৳{product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-slate-400 line-through">
                    ৳{product.originalPrice}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-extrabold ${product.stock > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                {product.stock > 0 ? `স্টক আছে (${product.stock}টি)` : 'স্টক শেষ'}
              </span>
            </div>

            <button
              onClick={() => addToCart(product)}
              disabled={product.stock <= 0}
              className="btn btn-sm btn-light-primary rounded-2xl font-black flex items-center gap-1.5 px-3.5 py-2 text-xs"
            >
              <FontAwesomeIcon icon={faShoppingBag} className="w-3.5 h-3.5" />
              <span>যোগ করুন</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Quick View Modal */}
      {isQuickViewOpen && (
        <ProductQuickViewModal product={product} onClose={() => setIsQuickViewOpen(false)} />
      )}
    </>
  );
}
