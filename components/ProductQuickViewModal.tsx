'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faShoppingBag, faHeart, faTimes, faCheck, faShieldAlt, faTruck } from '@fortawesome/free-solid-svg-icons';
import { Product } from '@/lib/db/schema';
import { useCart } from '@/context/CartContext';

interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductQuickViewModal({ product, onClose }: ProductQuickViewModalProps) {
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!product) return null;

  const wishlisted = isWishlisted(product.id);
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto relative font-sans">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 btn btn-sm btn-circle btn-ghost text-slate-400 hover:text-slate-800 dark:hover:text-white"
          aria-label="বন্ধ করুন"
        >
          <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
          
          {/* Image Gallery */}
          <div className="space-y-3">
            <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden relative border border-slate-200 dark:border-slate-700">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {discountPercent > 0 && (
                <span className="absolute top-3 left-3 bg-rose-500 text-white font-extrabold text-xs px-2.5 py-1 rounded-full shadow-md">
                  -{discountPercent}% ছাড়
                </span>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-14 h-14 rounded-xl border-2 overflow-hidden shrink-0 transition-all ${
                      selectedImageIndex === idx ? 'border-indigo-600 shadow-sm' : 'border-transparent opacity-60'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <div>
              <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                {product.categoryName}
              </span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1 leading-tight">
                {product.title}
              </h2>
            </div>

            <div className="flex items-center gap-3 text-xs font-bold">
              <div className="flex items-center gap-1 text-amber-500 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg">
                <FontAwesomeIcon icon={faStar} className="w-3.5 h-3.5 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-slate-400">({product.reviewCount} রিভিউ)</span>
              </div>
              <span className={`px-2.5 py-1 rounded-lg ${product.stock > 0 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-rose-50 text-rose-700'}`}>
                {product.stock > 0 ? `স্টক: ${product.stock}টি` : 'স্টক আউট'}
              </span>
            </div>

            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-3xl font-black text-slate-900 dark:text-white">৳{product.price}</span>
              {product.originalPrice && (
                <span className="text-sm font-bold text-slate-400 line-through">৳{product.originalPrice}</span>
              )}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 font-medium leading-relaxed">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs font-black text-slate-700 dark:text-slate-300">পরিমাণ:</span>
              <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="px-3 py-1 font-black text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  -
                </button>
                <span className="px-4 py-1 font-black text-xs text-slate-900 dark:text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                  className="px-3 py-1 font-black text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 btn btn-md bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-2xl border-none shadow-md flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faShoppingBag} className="w-4 h-4" />
                <span>কার্টে যোগ করুন</span>
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`btn btn-md btn-circle rounded-2xl ${wishlisted ? 'bg-rose-500 text-white' : 'btn-outline border-slate-200 text-slate-600'}`}
              >
                <FontAwesomeIcon icon={faHeart} className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 font-bold border-t border-slate-100 dark:border-slate-800">
              <span className="flex items-center gap-1"><FontAwesomeIcon icon={faTruck} className="text-indigo-500" /> ফাস্ট হোম ডেলিভারি</span>
              <span className="flex items-center gap-1"><FontAwesomeIcon icon={faShieldAlt} className="text-emerald-500" /> ১০০% অরিজিনাল অফিশিয়াল</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
          <Link href={`/products/${product.id}`} onClick={onClose} className="font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline">
            সম্পূর্ণ পেজ বিবরণ দেখুন →
          </Link>
        </div>
      </div>
    </div>
  );
}
