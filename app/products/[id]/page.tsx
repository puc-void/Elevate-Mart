'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar,
  faShieldAlt,
  faTruck,
  faUndo,
  faShoppingBag,
  faHeart,
  faComment,
  faPaperPlane,
  faTag
} from '@fortawesome/free-solid-svg-icons';
import { Product, Review } from '@/lib/db/schema';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeImage, setActiveImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Review Form state
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);

  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    setIsLoading(true);
    try {
      const [resProd, resRev] = await Promise.all([
        fetch(`/api/products/${id}`),
        fetch(`/api/reviews?productId=${id}`)
      ]);
      const dataProd = await resProd.json();
      const dataRev = await resRev.json();

      if (dataProd.product) {
        setProduct(dataProd.product);
        setActiveImage(dataProd.product.images[0] || '');
      }
      if (dataRev.reviews) {
        setReviews(dataRev.reviews);
      }
    } catch (err) {
      console.error('Error fetching product details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('রিভিউ দিতে অনুগ্রহ করে সাইন ইন করুন');
      return;
    }
    if (!newComment.trim()) {
      toast.error('মতামত বা মন্তব্য লিখুন');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: id,
          rating: newRating,
          comment: newComment
        })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('আপনার মূল্যবান রিভিউর জন্য ধন্যবাদ!');
        setReviews(prev => [data.review, ...prev]);
        setNewComment('');
        fetchProductDetails();
      } else {
        toast.error(data.error || 'রিভিউ যুক্ত করতে সমস্যা হয়েছে');
      }
    } catch {
      toast.error('রিভিউ সাবমিট করতে সমস্যা হয়েছে');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="loading loading-spinner loading-lg text-indigo-600"></div>
        <p className="text-sm text-slate-500 mt-4 font-bold">পণ্যের বিবরণ লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">পণ্যটি পাওয়া যায়নি</h2>
        <p className="text-slate-500 dark:text-slate-400">আপনার অনুসন্ধানকৃত পণ্যটি হয়তো সরিয়ে ফেলা হয়েছে।</p>
        <Link href="/products" className="btn btn-sm btn-light-primary rounded-xl font-bold">
          ক্যাটালগে ফিরুন
        </Link>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumb Navigation */}
      <nav className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2">
        <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">হোম</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-indigo-600 dark:hover:text-indigo-400">পণ্যসমূহ</Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-bold truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm relative">
            <img
              src={activeImage}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {product.originalPrice && (
              <span className="absolute top-4 left-4 bg-rose-500 text-white font-bold text-xs px-3 py-1 rounded-full shadow-md">
                ছাড় ৳{product.originalPrice - product.price}
              </span>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImage === img ? 'border-indigo-600 ring-2 ring-indigo-500/20' : 'border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Specifications & Cart Action */}
        <div className="space-y-6">
          <div>
            <span className="inline-block text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900 mb-3">
              {product.categoryName}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {product.title}
            </h1>

            <div className="flex items-center gap-4 mt-3 text-sm">
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <FontAwesomeIcon icon={faStar} className="w-4 h-4 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-slate-400 font-normal">({product.reviewCount} কাস্টমার রিভিউ)</span>
              </div>
              <span className="text-slate-300">|</span>
              <span className={`font-bold ${product.stock > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                {product.stock > 0 ? `স্টক আছে (${product.stock}টি)` : 'স্টক শেষ'}
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 bg-slate-100/80 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex items-baseline gap-3">
            <span className="text-3xl font-black text-slate-900 dark:text-white">৳{product.price}</span>
            {product.originalPrice && (
              <span className="text-base text-slate-400 line-through">৳{product.originalPrice}</span>
            )}
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-auto font-bold">সকল ভ্যাট সহ</span>
          </div>

          {/* Description */}
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-sans">
            {product.description}
          </p>

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">পরিমাণ:</span>
              <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                >
                  -
                </button>
                <span className="px-4 py-1.5 font-bold text-sm text-slate-900 dark:text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => addToCart(product, quantity)}
                disabled={product.stock <= 0}
                className="flex-1 btn btn-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl border-none shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faShoppingBag} className="w-4 h-4" />
                <span>কার্টে যোগ করুন (৳{product.price * quantity})</span>
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`btn btn-lg rounded-2xl border ${
                  wishlisted
                    ? 'bg-rose-500 text-white border-rose-500 hover:bg-rose-600'
                    : 'btn-light-primary border-slate-200 dark:border-slate-700'
                }`}
                aria-label="Wishlist"
              >
                <FontAwesomeIcon icon={faHeart} className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <FontAwesomeIcon icon={faTruck} className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mx-auto mb-1" />
              <span className="font-bold text-slate-700 dark:text-slate-300 block">দ্রুত ডেলিভারি</span>
              <span>১-৩ কর্মদিবস</span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <FontAwesomeIcon icon={faShieldAlt} className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
              <span className="font-bold text-slate-700 dark:text-slate-300 block">অফিশিয়াল ওয়ারেন্টি</span>
              <span>২ বছর মেয়াদী</span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <FontAwesomeIcon icon={faUndo} className="w-5 h-5 text-amber-600 dark:text-amber-400 mx-auto mb-1" />
              <span className="font-bold text-slate-700 dark:text-slate-300 block">সহজ রিটার্ন</span>
              <span>৩০ দিনের মধ্যে</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="pt-12 border-t border-slate-200 dark:border-slate-800 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">গ্রাহকদের মন্তব্য ও রিভিউ</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">প্রকৃত ক্রেতাদের মতামত ও অভিজ্ঞতার বিবরণ</p>
          </div>
          <span className="text-sm font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900">
            মোট {reviews.length}টি রিভিউ
          </span>
        </div>

        {/* Add Review Form */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
            <FontAwesomeIcon icon={faComment} className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> আপনার রিভিউ দিন
          </h4>
          <form onSubmit={handleAddReview} className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">রেটিং:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <FontAwesomeIcon
                      icon={faStar}
                      className={`w-4 h-4 ${
                        star <= newRating ? 'text-amber-400' : 'text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              aria-label="আপনার মতামত বা মন্তব্য লিখুন"
              disabled={!user}
              className="w-full p-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-slate-100"
            />

            <button
              type="submit"
              disabled={!user || isSubmittingReview}
              className="btn btn-sm bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white rounded-xl font-bold border-none px-5 flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faPaperPlane} className="w-3.5 h-3.5" />
              <span>সাবমিট করুন</span>
            </button>
          </form>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-sm text-slate-400 italic py-4">এখনও কোনো রিভিউ দেওয়া হয়নি। প্রথম রিভিউটি আপনিই দিন!</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={rev.userAvatar} alt="" className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 object-cover" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-xs">{rev.userName}</p>
                      <p className="text-[10px] text-slate-400">{new Date(rev.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <FontAwesomeIcon
                        key={s}
                        icon={faStar}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating ? 'text-amber-400' : 'text-slate-200 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 pt-1 leading-relaxed">{rev.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
