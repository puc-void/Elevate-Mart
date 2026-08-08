export type Role = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  avatar: string;
  phone?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  iconName?: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  categoryId: string;
  categoryName: string;
  rating: number;
  reviewCount: number;
  images: string[];
  isFeatured: boolean;
  isNew?: boolean;
  tags?: string[];
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  zipCode: string;
  phone: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'credit_card' | 'bkash' | 'nagad' | 'cash_on_delivery';

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending';
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  trackingNumber: string;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
}
