import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import { User, Product, Category, Order, Review } from './schema';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
let sqlClient: NeonQueryFunction<boolean, boolean> | null = null;

if (connectionString && !connectionString.includes('dummy') && !connectionString.includes('example')) {
  try {
    sqlClient = neon(connectionString);
  } catch (err) {
    console.warn('Neon DB connection fallback:', err);
  }
}

// In-Memory fallback store with seed data
const initialCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'ইলেকট্রনিক্স ও প্রযুক্তি',
    slug: 'electronics',
    description: 'আধুনিক অডিও গ্যাজেট, ব্লুটুথ ডিভাইস ও প্রিমিয়াম সাউন্ড সিস্টেম',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    iconName: 'headphones'
  },
  {
    id: 'cat-2',
    name: 'স্মার্টফোন ও অ্যাক্সেসরিজ',
    slug: 'smartphones',
    description: 'ফ্ল্যাগশিপ স্মার্টফোন, ফাস্ট চার্জার ও স্টাইলিশ প্রটেক্টিভ কেস',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
    iconName: 'mobile-alt'
  },
  {
    id: 'cat-3',
    name: 'ফ্যাশন ও লাইফস্টাইল',
    slug: 'fashion',
    description: 'আধুনিক লাক্সারি স্ট্রিটওয়্যার, স্টাইলিশ জ্যাকেট ও জুতো',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop&q=80',
    iconName: 'tshirt'
  },
  {
    id: 'cat-4',
    name: 'হোম ও ডেকর',
    slug: 'home-living',
    description: 'ডিজাইনার অ্যাম্বিয়েন্ট লাইটিং, আরামদায়ক চেয়ার ও ডেকোরেশন',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
    iconName: 'couch'
  }
];

const initialProducts: Product[] = [
  {
    id: 'prod-1',
    title: 'ওরা প্র সান্দেশি ওয়্যারলেস নয়েজ-ক্যানসেলিং হেডফোন',
    description: '৪০ মিমি বেরিলিয়াম ড্রাইভার, অ্যাডাপ্টিভ অ্যাক্টিভ নয়েজ ক্যানসেলেশন এবং ৪৫ ঘণ্টার দীর্ঘ ব্যাটারি ব্যাকআপ সহ খাঁটি অ্যাকোস্টিক সাউন্ড অভিজ্ঞতা।',
    price: 3499,
    originalPrice: 3999,
    stock: 24,
    categoryId: 'cat-1',
    categoryName: 'ইলেকট্রনিক্স ও প্রযুক্তি',
    rating: 4.9,
    reviewCount: 128,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80'
    ],
    isFeatured: true,
    isNew: true,
    tags: ['ওয়্যারলেস', 'অডিও', 'হেডফোন', 'ব্লুটুথ'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-2',
    title: 'মিনিমালিস্ট সিরামিক স্মার্ট ওয়াচ আল্ট্রা',
    description: 'এয়ারক্রাফট-গ্রেড টাইটানিয়াম কেসিং, উজ্জ্বল অ্যামোলেড ডিসপ্লে, ডুয়াল-ফ্রিকোয়েন্সি জিপিএস এবং স্বাস্থ্য মনিটরিং সেন্সর।',
    price: 4499,
    originalPrice: 4999,
    stock: 18,
    categoryId: 'cat-1',
    categoryName: 'ইলেকট্রনিক্স ও প্রযুক্তি',
    rating: 4.8,
    reviewCount: 94,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'
    ],
    isFeatured: true,
    isNew: false,
    tags: ['স্মার্টওয়াচ', 'ফিটনেস', 'টাইটানিয়াম'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-3',
    title: 'অ্যাপেক্স ম্যাক্স ফোল্ডেবল ৫জি স্মার্টফোন',
    description: '১২০ হার্টজ এলটিপিও ওএলইডি ফোল্ডিং স্ক্রিন, স্ন্যাপড্রাগন ৮ জেন ৩ প্রসেসর এবং ট্রিপল হ্যাসেলব্লাড ক্যামেরা সিস্টেম।',
    price: 124999,
    originalPrice: 129999,
    stock: 10,
    categoryId: 'cat-2',
    categoryName: 'স্মার্টফোন ও অ্যাক্সেসরিজ',
    rating: 4.9,
    reviewCount: 64,
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80'
    ],
    isFeatured: true,
    isNew: true,
    tags: ['স্মার্টফোন', '৫জি', 'ফোল্ডেবল'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-4',
    title: 'আর্বান এক্সপ্লোরার ওয়াটারপ্রুফ উইন্ডব্রেকার জ্যাকেট',
    description: '৩-লেয়ার গোর-টেক্স প্রিমিয়াম ফ্যাব্রিকে তৈরি ওয়াটারপ্রুফ জ্যাকেট। স্টর্ম হুড এবং ইন্টারনাল সেফটি পকেট সহ প্রস্তুত।',
    price: 2499,
    originalPrice: 2999,
    stock: 45,
    categoryId: 'cat-3',
    categoryName: 'ফ্যাশন ও লাইফস্টাইল',
    rating: 4.7,
    reviewCount: 82,
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80'
    ],
    isFeatured: false,
    isNew: false,
    tags: ['জ্যাকেট', 'ওয়াটারপ্রুফ', 'ফ্যাশন'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-5',
    title: 'নর্ডিক অ্যাম্বিয়েন্স ডাইম্যাবল ডেস্ক ল্যাম্প',
    description: 'হ্যান্ডক্রাফটেড অ্যালুমিনিয়াম ফ্রেম, ওয়ার্ম-টু-কুল কালার টেম্পারেচার এবং স্পর্শ-সংবেদনশীল ব্রাইটনেস কন্ট্রোল।',
    price: 1499,
    originalPrice: 1799,
    stock: 30,
    categoryId: 'cat-4',
    categoryName: 'হোম ও ডেকর',
    rating: 4.8,
    reviewCount: 56,
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80'
    ],
    isFeatured: true,
    isNew: true,
    tags: ['ল্যাম্প', 'লাইটিং', 'হোম'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-6',
    title: 'এর্গোনোমিক মেমরি ফোম এক্সিকিউটিভ চেয়ার',
    description: 'সম্পূর্ণ লাম্বার সাপোর্ট, ৩ডি আর্মরেস্ট, নিশ্বাসযোগ্য মেশ ব্যাক এবং মসৃণ হুইল সিস্টেম যা দীর্ঘ সময় ব্যবহারে নিশ্চিত আরাম প্রদান করে।',
    price: 8999,
    originalPrice: 9999,
    stock: 12,
    categoryId: 'cat-4',
    categoryName: 'হোম ও ডেকর',
    rating: 4.6,
    reviewCount: 41,
    images: [
      'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?w=800&auto=format&fit=crop&q=80'
    ],
    isFeatured: false,
    isNew: false,
    tags: ['চেয়ার', 'এর্গোনোমিক', 'ফার্নিচার'],
    createdAt: new Date().toISOString()
  }
];

const adminHashedPassword = bcrypt.hashSync('admin123', 10);
const userHashedPassword = bcrypt.hashSync('user123', 10);

const initialUsers: User[] = [
  {
    id: 'user-admin-1',
    name: 'অ্যাডমিনিস্ট্রেটর',
    email: 'admin@ecommerce.com',
    password: adminHashedPassword,
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '০১৭০০-০০০১১১',
    address: 'গুলশান ২, ব্লক সি',
    city: 'ঢাকা',
    zipCode: '১২১২',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  {
    id: 'user-customer-1',
    name: 'আরিফ হোসেন',
    email: 'user@ecommerce.com',
    password: userHashedPassword,
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    phone: '০১৮০০-২২২৩৩৩',
    address: 'ধানমন্ডি ২৭, রোড ৮/এ',
    city: 'ঢাকা',
    zipCode: '১২০৯',
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString()
  }
];

const initialOrders: Order[] = [
  {
    id: 'ord-1001',
    userId: 'user-customer-1',
    userName: 'আরিফ হোসেন',
    userEmail: 'user@ecommerce.com',
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        title: 'ওরা প্র সান্দেশি ওয়্যারলেস নয়েজ-ক্যানসেলিং হেডফোন',
        price: 3499,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
      }
    ],
    subtotal: 3499,
    shipping: 60,
    tax: 175,
    totalAmount: 3734,
    paymentMethod: 'credit_card',
    paymentStatus: 'paid',
    status: 'shipped',
    shippingAddress: {
      fullName: 'আরিফ হোসেন',
      address: 'ধানমন্ডি ২৭, রোড ৮/এ',
      city: 'ঢাকা',
      zipCode: '১২০৯',
      phone: '০১৮০০-২২২৩৩৩'
    },
    trackingNumber: 'TRK-9823412',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  }
];

const initialReviews: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    userId: 'user-customer-1',
    userName: 'আরিফ হোসেন',
    userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'সাউন্ড কোয়ালিটি অত্যন্ত নিখুঁত এবং হেডফোনটি পরে কাজ করতে ভীষণ আরামদায়ক!',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
  }
];

let memoryStore = {
  categories: [...initialCategories],
  products: [...initialProducts],
  users: [...initialUsers],
  orders: [...initialOrders],
  reviews: [...initialReviews]
};

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapProduct(row: any): Product {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    stock: Number(row.stock),
    categoryId: row.category_id,
    categoryName: row.category_name,
    rating: Number(row.rating),
    reviewCount: Number(row.review_count),
    images: Array.isArray(row.images) ? row.images : [row.images],
    isFeatured: Boolean(row.is_featured),
    isNew: Boolean(row.is_new),
    createdAt: row.created_at
  };
}

function mapUser(row: any): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    password: row.password,
    role: row.role,
    avatar: row.avatar,
    phone: row.phone,
    address: row.address,
    city: row.city,
    zipCode: row.zip_code,
    createdAt: row.created_at
  };
}

function mapOrder(row: any): Order {
  return {
    id: row.id,
    userId: row.user_id,
    userName: row.user_name,
    userEmail: row.user_email,
    items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items,
    subtotal: Number(row.subtotal),
    shipping: Number(row.shipping),
    tax: Number(row.tax),
    totalAmount: Number(row.total_amount),
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    status: row.status,
    shippingAddress: typeof row.shipping_address === 'string' ? JSON.parse(row.shipping_address) : row.shipping_address,
    trackingNumber: row.tracking_number,
    createdAt: row.created_at
  };
}

function mapReview(row: any): Review {
  return {
    id: row.id,
    productId: row.product_id,
    userId: row.user_id,
    userName: row.user_name,
    userAvatar: row.user_avatar,
    rating: Number(row.rating),
    comment: row.comment,
    createdAt: row.created_at
  };
}

export const db = {
  isNeonConnected: () => !!sqlClient,

  // CATEGORIES
  async getCategories(): Promise<Category[]> {
    if (sqlClient) {
      try {
        const rows = (await sqlClient`SELECT * FROM categories ORDER BY name ASC`) as any[];
        if (rows && rows.length > 0) {
          return rows.map((r: any) => ({
            id: r.id,
            name: r.name,
            slug: r.slug,
            description: r.description,
            image: r.image,
            iconName: r.icon_name
          }));
        }
      } catch (e) {
        console.warn('Neon getCategories query error, using fallback:', e);
      }
    }
    return memoryStore.categories;
  },

  async addCategory(cat: Omit<Category, 'id'>): Promise<Category> {
    const newCategory: Category = { ...cat, id: `cat-${Date.now()}` };
    if (sqlClient) {
      try {
        await sqlClient`
          INSERT INTO categories (id, name, slug, description, image)
          VALUES (${newCategory.id}, ${newCategory.name}, ${newCategory.slug}, ${newCategory.description}, ${newCategory.image})
        `;
      } catch (e) {
        console.warn('Neon addCategory query error:', e);
      }
    }
    memoryStore.categories.push(newCategory);
    return newCategory;
  },

  async deleteCategory(id: string): Promise<boolean> {
    if (sqlClient) {
      try {
        await sqlClient`DELETE FROM categories WHERE id = ${id}`;
      } catch (e) {
        console.warn('Neon deleteCategory error:', e);
      }
    }
    const idx = memoryStore.categories.findIndex(c => c.id === id);
    if (idx !== -1) {
      memoryStore.categories.splice(idx, 1);
      return true;
    }
    return false;
  },

  // PRODUCTS
  async getProducts(params?: { categoryId?: string; search?: string; featured?: boolean }): Promise<Product[]> {
    if (sqlClient) {
      try {
        let query = 'SELECT * FROM products WHERE 1=1';
        if (params?.categoryId) query += ` AND category_id = '${params.categoryId}'`;
        if (params?.featured) query += ` AND is_featured = true`;
        if (params?.search) {
          const s = params.search.replace(/'/g, "''");
          query += ` AND (LOWER(title) LIKE LOWER('%${s}%') OR LOWER(description) LIKE LOWER('%${s}%'))`;
        }
        query += ' ORDER BY created_at DESC';

        const rows = (await sqlClient.query(query)) as any[];
        if (rows && rows.length > 0) {
          return rows.map(mapProduct);
        }
      } catch (e) {
        console.warn('Neon getProducts error, using fallback:', e);
      }
    }

    let prods = [...memoryStore.products];
    if (params?.categoryId) {
      prods = prods.filter(p => p.categoryId === params.categoryId);
    }
    if (params?.featured) {
      prods = prods.filter(p => p.isFeatured);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      prods = prods.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return prods;
  },

  async getProductById(id: string): Promise<Product | null> {
    if (sqlClient) {
      try {
        const rows = (await sqlClient`SELECT * FROM products WHERE id = ${id}`) as any[];
        if (rows && rows.length > 0) {
          return mapProduct(rows[0]);
        }
      } catch (e) {
        console.warn('Neon getProductById error:', e);
      }
    }
    const prod = memoryStore.products.find(p => p.id === id);
    return prod || null;
  },

  async addProduct(productData: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    if (sqlClient) {
      try {
        await sqlClient`
          INSERT INTO products (
            id, title, description, price, original_price, stock, category_id, category_name, rating, review_count, images, is_featured, is_new
          ) VALUES (
            ${newProduct.id}, ${newProduct.title}, ${newProduct.description}, ${newProduct.price}, ${newProduct.originalPrice || null}, ${newProduct.stock}, ${newProduct.categoryId}, ${newProduct.categoryName}, ${newProduct.rating}, ${newProduct.reviewCount}, ${newProduct.images}, ${newProduct.isFeatured}, ${newProduct.isNew || false}
          )
        `;
      } catch (e) {
        console.warn('Neon addProduct error:', e);
      }
    }

    memoryStore.products.unshift(newProduct);
    return newProduct;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    if (sqlClient) {
      try {
        if (updates.title) await sqlClient`UPDATE products SET title = ${updates.title} WHERE id = ${id}`;
        if (updates.description !== undefined) await sqlClient`UPDATE products SET description = ${updates.description} WHERE id = ${id}`;
        if (updates.price !== undefined) await sqlClient`UPDATE products SET price = ${updates.price} WHERE id = ${id}`;
        if (updates.originalPrice !== undefined) await sqlClient`UPDATE products SET original_price = ${updates.originalPrice} WHERE id = ${id}`;
        if (updates.stock !== undefined) await sqlClient`UPDATE products SET stock = ${updates.stock} WHERE id = ${id}`;
        if (updates.categoryId) await sqlClient`UPDATE products SET category_id = ${updates.categoryId} WHERE id = ${id}`;
        if (updates.categoryName) await sqlClient`UPDATE products SET category_name = ${updates.categoryName} WHERE id = ${id}`;
        if (updates.images) await sqlClient`UPDATE products SET images = ${updates.images} WHERE id = ${id}`;
        if (updates.isFeatured !== undefined) await sqlClient`UPDATE products SET is_featured = ${updates.isFeatured} WHERE id = ${id}`;
        
        const rows = (await sqlClient`SELECT * FROM products WHERE id = ${id}`) as any[];
        if (rows && rows.length > 0) return mapProduct(rows[0]);
      } catch (e) {
        console.warn('Neon updateProduct error:', e);
      }
    }

    const idx = memoryStore.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    memoryStore.products[idx] = { ...memoryStore.products[idx], ...updates };
    return memoryStore.products[idx];
  },

  async deleteProduct(id: string): Promise<boolean> {
    if (sqlClient) {
      try {
        await sqlClient`DELETE FROM products WHERE id = ${id}`;
      } catch (e) {
        console.warn('Neon deleteProduct error:', e);
      }
    }

    const idx = memoryStore.products.findIndex(p => p.id === id);
    if (idx !== -1) {
      memoryStore.products.splice(idx, 1);
      return true;
    }
    return false;
  },

  // USERS
  async getUserByEmail(email: string): Promise<User | null> {
    if (sqlClient) {
      try {
        const rows = (await sqlClient`SELECT * FROM users WHERE LOWER(email) = LOWER(${email})`) as any[];
        if (rows && rows.length > 0) return mapUser(rows[0]);
      } catch (e) {
        console.warn('Neon getUserByEmail error:', e);
      }
    }
    const user = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    return user || null;
  },

  async getUserById(id: string): Promise<User | null> {
    if (sqlClient) {
      try {
        const rows = (await sqlClient`SELECT * FROM users WHERE id = ${id}`) as any[];
        if (rows && rows.length > 0) return mapUser(rows[0]);
      } catch (e) {
        console.warn('Neon getUserById error:', e);
      }
    }
    const user = memoryStore.users.find(u => u.id === id);
    return user || null;
  },

  async getUsers(): Promise<User[]> {
    if (sqlClient) {
      try {
        const rows = (await sqlClient`SELECT * FROM users ORDER BY created_at DESC`) as any[];
        if (rows && rows.length > 0) return rows.map(mapUser);
      } catch (e) {
        console.warn('Neon getUsers error:', e);
      }
    }
    return memoryStore.users.map(({ password, ...u }) => u as User);
  },

  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    if (sqlClient) {
      try {
        await sqlClient`
          INSERT INTO users (
            id, name, email, password, role, avatar, phone, address, city, zip_code
          ) VALUES (
            ${newUser.id}, ${newUser.name}, ${newUser.email}, ${newUser.password || ''}, ${newUser.role}, ${newUser.avatar}, ${newUser.phone || null}, ${newUser.address || null}, ${newUser.city || null}, ${newUser.zipCode || null}
          )
        `;
      } catch (e) {
        console.warn('Neon createUser error:', e);
      }
    }

    memoryStore.users.push(newUser);
    const { password, ...safeUser } = newUser;
    return safeUser as User;
  },

  async updateUserRole(userId: string, role: 'user' | 'admin'): Promise<User | null> {
    if (sqlClient) {
      try {
        await sqlClient`UPDATE users SET role = ${role} WHERE id = ${userId}`;
        const rows = (await sqlClient`SELECT * FROM users WHERE id = ${userId}`) as any[];
        if (rows && rows.length > 0) return mapUser(rows[0]);
      } catch (e) {
        console.warn('Neon updateUserRole error:', e);
      }
    }

    const user = memoryStore.users.find(u => u.id === userId);
    if (!user) return null;
    user.role = role;
    const { password, ...safeUser } = user;
    return safeUser as User;
  },

  async updateUserProfile(userId: string, updates: Partial<User>): Promise<User | null> {
    if (sqlClient) {
      try {
        if (updates.name) await sqlClient`UPDATE users SET name = ${updates.name} WHERE id = ${userId}`;
        if (updates.phone !== undefined) await sqlClient`UPDATE users SET phone = ${updates.phone} WHERE id = ${userId}`;
        if (updates.address !== undefined) await sqlClient`UPDATE users SET address = ${updates.address} WHERE id = ${userId}`;
        if (updates.city !== undefined) await sqlClient`UPDATE users SET city = ${updates.city} WHERE id = ${userId}`;
        if (updates.zipCode !== undefined) await sqlClient`UPDATE users SET zip_code = ${updates.zipCode} WHERE id = ${userId}`;
        if (updates.avatar) await sqlClient`UPDATE users SET avatar = ${updates.avatar} WHERE id = ${userId}`;
        
        const rows = (await sqlClient`SELECT * FROM users WHERE id = ${userId}`) as any[];
        if (rows && rows.length > 0) return mapUser(rows[0]);
      } catch (e) {
        console.warn('Neon updateUserProfile error:', e);
      }
    }

    const idx = memoryStore.users.findIndex(u => u.id === userId);
    if (idx === -1) return null;
    memoryStore.users[idx] = { ...memoryStore.users[idx], ...updates };
    const { password, ...safeUser } = memoryStore.users[idx];
    return safeUser as User;
  },

  async deleteUser(userId: string): Promise<boolean> {
    if (sqlClient) {
      try {
        await sqlClient`DELETE FROM users WHERE id = ${userId}`;
      } catch (e) {
        console.warn('Neon deleteUser error:', e);
      }
    }

    const idx = memoryStore.users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      memoryStore.users.splice(idx, 1);
      return true;
    }
    return false;
  },

  // ORDERS
  async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'trackingNumber'>): Promise<Order> {
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Math.floor(1000 + Math.random() * 9000)}`,
      trackingNumber: `TRK-${Math.floor(10000000 + Math.random() * 90000000)}`,
      createdAt: new Date().toISOString()
    };

    if (sqlClient) {
      try {
        await sqlClient`
          INSERT INTO orders (
            id, user_id, user_name, user_email, items, subtotal, shipping, tax, total_amount, payment_method, payment_status, status, shipping_address, tracking_number
          ) VALUES (
            ${newOrder.id}, ${newOrder.userId}, ${newOrder.userName}, ${newOrder.userEmail}, ${JSON.stringify(newOrder.items)}, ${newOrder.subtotal}, ${newOrder.shipping}, ${newOrder.tax}, ${newOrder.totalAmount}, ${newOrder.paymentMethod}, ${newOrder.paymentStatus}, ${newOrder.status}, ${JSON.stringify(newOrder.shippingAddress)}, ${newOrder.trackingNumber}
          )
        `;

        // Update product stock in Neon DB
        for (const item of newOrder.items) {
          await sqlClient`UPDATE products SET stock = GREATEST(0, stock - ${item.quantity}) WHERE id = ${item.productId}`;
        }
      } catch (e) {
        console.warn('Neon createOrder error:', e);
      }
    }

    memoryStore.orders.unshift(newOrder);

    // Deduct stock in memory store
    newOrder.items.forEach(item => {
      const prod = memoryStore.products.find(p => p.id === item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
      }
    });

    return newOrder;
  },

  async getOrders(userId?: string): Promise<Order[]> {
    if (sqlClient) {
      try {
        const rows = userId
          ? (await sqlClient`SELECT * FROM orders WHERE user_id = ${userId} ORDER BY created_at DESC`) as any[]
          : (await sqlClient`SELECT * FROM orders ORDER BY created_at DESC`) as any[];
        if (rows && rows.length > 0) return rows.map(mapOrder);
      } catch (e) {
        console.warn('Neon getOrders error:', e);
      }
    }

    if (userId) {
      return memoryStore.orders.filter(o => o.userId === userId);
    }
    return memoryStore.orders;
  },

  async getOrderById(id: string): Promise<Order | null> {
    if (sqlClient) {
      try {
        const rows = (await sqlClient`SELECT * FROM orders WHERE id = ${id}`) as any[];
        if (rows && rows.length > 0) return mapOrder(rows[0]);
      } catch (e) {
        console.warn('Neon getOrderById error:', e);
      }
    }
    return memoryStore.orders.find(o => o.id === id) || null;
  },

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order | null> {
    if (sqlClient) {
      try {
        const payStatus = status === 'delivered' ? 'paid' : 'pending';
        await sqlClient`UPDATE orders SET status = ${status}, payment_status = ${payStatus} WHERE id = ${orderId}`;
        const rows = (await sqlClient`SELECT * FROM orders WHERE id = ${orderId}`) as any[];
        if (rows && rows.length > 0) return mapOrder(rows[0]);
      } catch (e) {
        console.warn('Neon updateOrderStatus error:', e);
      }
    }

    const order = memoryStore.orders.find(o => o.id === orderId);
    if (!order) return null;
    order.status = status;
    if (status === 'delivered') {
      order.paymentStatus = 'paid';
    }
    return order;
  },

  // REVIEWS
  async getProductReviews(productId: string): Promise<Review[]> {
    if (sqlClient) {
      try {
        const rows = (await sqlClient`SELECT * FROM reviews WHERE product_id = ${productId} ORDER BY created_at DESC`) as any[];
        if (rows && rows.length > 0) return rows.map(mapReview);
      } catch (e) {
        console.warn('Neon getProductReviews error:', e);
      }
    }
    return memoryStore.reviews.filter(r => r.productId === productId);
  },

  async addReview(reviewData: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    if (sqlClient) {
      try {
        await sqlClient`
          INSERT INTO reviews (
            id, product_id, user_id, user_name, user_avatar, rating, comment
          ) VALUES (
            ${newReview.id}, ${newReview.productId}, ${newReview.userId}, ${newReview.userName}, ${newReview.userAvatar}, ${newReview.rating}, ${newReview.comment}
          )
        `;

        // Update avg rating & review count in Neon DB
        const revRows = (await sqlClient`SELECT rating FROM reviews WHERE product_id = ${newReview.productId}`) as any[];
        if (revRows && revRows.length > 0) {
          const avg = revRows.reduce((acc: number, curr: any) => acc + Number(curr.rating), 0) / revRows.length;
          await sqlClient`UPDATE products SET rating = ${Number(avg.toFixed(1))}, review_count = ${revRows.length} WHERE id = ${newReview.productId}`;
        }
      } catch (e) {
        console.warn('Neon addReview error:', e);
      }
    }

    memoryStore.reviews.unshift(newReview);

    // Update product rating average in memory
    const prodReviews = memoryStore.reviews.filter(r => r.productId === reviewData.productId);
    const avg = prodReviews.reduce((acc, curr) => acc + curr.rating, 0) / prodReviews.length;
    const prod = memoryStore.products.find(p => p.id === reviewData.productId);
    if (prod) {
      prod.rating = Number(avg.toFixed(1));
      prod.reviewCount = prodReviews.length;
    }

    return newReview;
  }
};
