'use client';

import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faHeart, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { Product } from '@/lib/db/schema';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const wishlisted = isWishlisted(product.id);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden hover-card">
      
      {/* Product Image Box */}
      <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
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

        {/* Wishlist Action Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-md transition-all z-10 flex items-center justify-center ${
            wishlisted
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-white/80 text-slate-600 hover:bg-white hover:text-rose-500'
          }`}
          aria-label="পছন্দের তালিকায় যুক্ত করুন"
        >
          <FontAwesomeIcon icon={faHeart} className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-bold text-indigo-600 uppercase">
              {product.categoryName}
            </span>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
              <FontAwesomeIcon icon={faStar} className="w-3 h-3 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400 text-[10px]">({product.reviewCount})</span>
            </div>
          </div>

          <Link href={`/products/${product.id}`} className="block group-hover:text-indigo-600 transition-colors">
            <h3 className="font-bold text-slate-900 text-sm line-clamp-2 mb-1">
              {product.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 line-clamp-2 mb-3">
            {product.description}
          </p>
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-black text-slate-900 text-base">
                ৳{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  ৳{product.originalPrice}
                </span>
              )}
            </div>
            <span className={`text-[10px] font-bold ${product.stock > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
              {product.stock > 0 ? `স্টক আছে (${product.stock}টি)` : 'স্টক শেষ'}
            </span>
          </div>

          <button
            onClick={() => addToCart(product)}
            disabled={product.stock <= 0}
            className="btn btn-sm btn-light-primary rounded-xl font-bold flex items-center gap-1.5 px-3 py-1.5"
          >
            <FontAwesomeIcon icon={faShoppingBag} className="w-3.5 h-3.5" />
            <span>যোগ করুন</span>
          </button>
        </div>
      </div>
    </div>
  );
}
