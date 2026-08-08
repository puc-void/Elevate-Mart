'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
}

interface CartContextType {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (product: { id: string; title: string; price: number; images: string[]; stock: number }, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  totalItems: number;
  subtotal: number;
  shipping: number;
  tax: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('ecom_cart');
      const savedWishlist = localStorage.getItem('ecom_wishlist');
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch {
      // Ignore local storage error
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('ecom_cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('ecom_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, isLoaded]);

  const addToCart = (product: { id: string; title: string; price: number; images: string[]; stock: number }, quantity = 1) => {
    if (!user) {
      toast.error('কার্টে পণ্য যোগ করতে প্রথমে লগইন করুন');
      router.push('/login?error=কার্টে পণ্য যোগ করতে প্রথমে লগইন করুন');
      return;
    }

    let message = '';
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.productId === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = Math.min(product.stock, updated[existingIndex].quantity + quantity);
        updated[existingIndex].quantity = newQty;
        message = `কার্টে পরিমাণ আপডেট করা হয়েছে (${newQty}টি)`;
        return updated;
      }
      message = `"${product.title}" কার্টে যোগ করা হয়েছে!`;
      return [
        ...prev,
        {
          id: `item-${Date.now()}`,
          productId: product.id,
          title: product.title,
          price: product.price,
          quantity: Math.min(product.stock, quantity),
          image: product.images[0] || '',
          stock: product.stock
        }
      ];
    });

    if (message) {
      setTimeout(() => toast.success(message), 0);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
    setTimeout(() => toast.success('পণ্যটি কার্ট থেকে সরানো হয়েছে'), 0);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.productId === productId ? { ...item, quantity: Math.min(item.stock, quantity) } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    if (!user) {
      toast.error('উইশলিস্ট ব্যবহার করতে প্রথমে লগইন করুন');
      router.push('/login?error=উইশলিস্ট ব্যবহার করতে প্রথমে লগইন করুন');
      return;
    }

    let message = '';
    setWishlist(prev => {
      if (prev.includes(productId)) {
        message = 'উইশলিস্ট থেকে সরানো হয়েছে';
        return prev.filter(id => id !== productId);
      } else {
        message = 'উইশলিস্টে যুক্ত করা হয়েছে!';
        return [...prev, productId];
      }
    });

    if (message) {
      setTimeout(() => toast.success(message), 0);
    }
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? (subtotal > 5000 ? 0 : 60) : 0;
  const tax = Math.round(subtotal * 0.05);
  const totalAmount = subtotal + shipping + tax;

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isWishlisted,
        totalItems,
        subtotal,
        shipping,
        tax,
        totalAmount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
