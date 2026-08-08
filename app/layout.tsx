import './globals.css';
import type { Metadata } from 'next';
import { Hind_Siliguri } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/next';

const hindSiliguri = Hind_Siliguri({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['bengali', 'latin'],
  display: 'swap',
  variable: '--font-hind-siliguri',
});

export const metadata: Metadata = {
  title: 'ইলেভেটমার্ট (ElevateMart) | প্রিমিয়াম বাংলা ই-কমার্স ও অ্যাডমিন প্যানেল',
  description: 'বাংলাদেশের অন্যতম সেরা ই-কমার্স প্ল্যাটফর্ম। ইলেকট্রনিক্স, গ্যাজেট, ফ্যাশন ও হোম ডেকোরেশনের নির্ভরযোগ্য শপ।',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" data-theme="light" className={hindSiliguri.variable}>
      <body className={`${hindSiliguri.className} bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col justify-between selection:bg-indigo-500 selection:text-white`}>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
              <Navbar />
              <main className="flex-1 w-full flex flex-col justify-between">{children}</main>
              <Footer />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
