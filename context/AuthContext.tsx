'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar: string;
  phone?: string;
  address?: string;
  city?: string;
  zipCode?: string;
}

interface SignupParams {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
}

interface AuthContextType {
  user: UserSession | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (params: SignupParams) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const refreshUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'লগইন ব্যর্থ হয়েছে');
        return false;
      }

      setUser(data.user);
      toast.success(`স্বাগতম, ${data.user.name}!`);
      
      if (data.user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
      return true;
    } catch {
      toast.error('একটি অনাকাঙ্ক্ষিত ত্রুটি ঘটেছে');
      return false;
    }
  };

  const signup = async (params: SignupParams): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'অ্যাকাউন্ট তৈরি ব্যর্থ হয়েছে');
        return false;
      }

      toast.success('অ্যাকাউন্ট সফলভাবে নিবন্ধন করা হয়েছে! অনুগ্রহ করে লগইন করুন।');
      router.push('/login');
      return true;
    } catch {
      toast.error('অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে');
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      toast.success('লগআউট সম্পন্ন হয়েছে');
      router.push('/login');
    } catch {
      toast.error('লগআউট ব্যর্থ হয়েছে');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
