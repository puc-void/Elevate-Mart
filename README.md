# ElevateMart - Full-Stack E-Commerce Platform

ElevateMart is a modern, responsive, full-stack e-commerce web application engineered with Next.js App Router, TypeScript, Tailwind CSS, daisyUI, and Neon serverless PostgreSQL. The platform features an online store for consumers paired with an admin management panel, authentication with gender-based avatars, dynamic category filtering, one-time promo coupon redemption, tax-free order checkout, and custom profile management with district selections for Bangladesh.

---

## Table of Contents

1. Project Overview
2. Technology Stack
3. Core System Features
4. Database Architecture and Schemas
5. Directory Structure
6. Environment Variables Setup
7. Installation and Local Setup
8. Production Build Instructions
9. Coupon Engine and Business Rules
10. UI Layout and Sticky Footer Implementation

---

## 1. Project Overview

ElevateMart is built to provide an online shopping experience tailored for Bangladeshi consumers. It supports complete store workflows from browsing catalog items, filtering categories, applying promo codes, and managing cart items to placing orders with custom delivery addresses across all 64 districts of Bangladesh.

The application includes dual role access control:
- Standard User: Product browsing, category filtering, cart management, single-use coupon redemption, order placement, order history review, and user profile management.
- Admin User: Dashboard analytics, product CRUD operations, category management, order status updates, and user user account management.

---

## 2. Technology Stack

### Frontend Architecture
- Framework: Next.js 16 (App Router with Turbopack)
- Programming Language: TypeScript
- Styling: Tailwind CSS 4, Vanilla CSS Utilities, daisyUI 5
- Iconography: FontAwesome Free SVG Icons (@fortawesome/react-fontawesome)
- UI Notifications: react-hot-toast
- Font System: Hind Siliguri (Google Fonts)

### Backend and Database Architecture
- Server-Side Execution: Next.js API Routes (Node.js runtime)
- Database Provider: Neon Serverless PostgreSQL
- Database Driver: @neondatabase/serverless
- Authentication: Custom JWT / Session cookie engine (lib/auth/session.ts)
- Password Encryption: bcryptjs

---

## 3. Core System Features

### Consumer Store Interface
- Dynamic Homepage: Hero section with shopping background overlay, typewriter text animation, top category filter button bar, and full product catalog grid.
- Product Catalog: Pagination, category filtering, price range sorting, search query filtering, and quick product detail views.
- Password Visibility Toggle: Interactive eye icon toggle on Login and Signup forms.
- Bangladesh District Support: Dropdown selector containing all 64 Bangladesh districts for signup and profile updates.
- Gender Selection and Gender Avatars: Gender field selection (Male / Female) on signup with automatic male/female vector avatar assignment.
- Cart and Checkout Engine: Quantity updates, item removals, promo coupon code input, shipping charge calculation, zero VAT tax configuration, and instant order placement.
- User Dashboard: Displays complete profile data (Name, Gender, Email, Phone, District, Address, Zip Code, Role) with live modal profile updates.

### Administrative Management Panel
- Analytics Dashboard: Total sales revenue, total orders count, product counts, and registered user metrics.
- Product Management: Add, edit, delete, and feature products with stock and image controls.
- Category Management: Create, edit, and delete product categories.
- Order Management: View order details, filter status (Pending, Processing, Completed, Cancelled), and update order delivery progress.
- User Account Management: User listing, role toggle (User / Admin), and user account deletion.

---

## 4. Database Architecture and Schemas

The database schema is designed for Neon serverless PostgreSQL and can be executed via `lib/db/migrate.sql`.

### Users Table (`users`)
```sql
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  gender VARCHAR(20) DEFAULT 'male',
  avatar TEXT,
  phone VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  zip_code VARCHAR(20),
  used_coupons TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Categories Table (`categories`)
```sql
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Products Table (`products`)
```sql
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2),
  images TEXT[] DEFAULT '{}',
  category_id VARCHAR(100) REFERENCES categories(id) ON DELETE SET NULL,
  stock INT DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  rating NUMERIC(3, 2) DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Orders Table (`orders`)
```sql
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100) REFERENCES users(id) ON DELETE CASCADE,
  user_name VARCHAR(255),
  user_email VARCHAR(255),
  items JSONB NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  shipping NUMERIC(10, 2) NOT NULL,
  tax NUMERIC(10, 2) DEFAULT 0,
  total_amount NUMERIC(10, 2) NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'credit_card',
  payment_status VARCHAR(50) DEFAULT 'pending',
  status VARCHAR(50) DEFAULT 'pending',
  shipping_address JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 5. Directory Structure

```
├── app/
│   ├── admin/               # Admin panel pages (dashboard, products, categories, orders, users)
│   ├── api/                 # API route handlers (auth, products, categories, orders, users, reviews)
│   ├── cart/                # Shopping cart page
│   ├── checkout/            # Checkout and order summary page
│   ├── login/               # Authentication login page
│   ├── orders/              # User order history page
│   ├── products/            # Product catalog and detail pages
│   ├── profile/             # User profile dashboard and edit modal
│   ├── signup/              # Account registration page with district dropdown
│   ├── globals.css          # Global styling, daisyUI configuration, and font definitions
│   ├── layout.tsx           # Root application layout with sticky footer configuration
│   └── page.tsx             # Homepage with Hero, Category Filters, and Product Grid
├── components/              # Modular UI components (Navbar, Footer, ProductCard, HeroSection, etc.)
├── context/                 # React Context Providers (AuthContext, CartContext, ThemeContext)
├── lib/
│   ├── auth/                # Session and JWT cookie verification logic
│   ├── db/                  # Neon database driver, memory fallback store, and SQL queries
│   ├── coupons.ts           # Promo coupon validation engine and single-use rules
│   └── districts.ts         # List of 64 Bangladesh districts
├── scripts/                 # Database initialization and migration helper scripts
├── README.md                # Project documentation
└── package.json             # Package configuration and script definitions
```

---

## 6. Environment Variables Setup

Create a `.env.local` file in the root project directory and configure the following variables:

```env
DATABASE_URL=postgresql://neondb_owner:npg_secret@ep-example.eastus-2.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=your_super_secret_jwt_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

If `DATABASE_URL` is omitted, the application will fallback to an in-memory database store for local testing.

---

## 7. Installation and Local Setup

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### Step-by-Step Setup

1. Clone the repository:
```bash
git clone https://github.com/puc-void/Elevate-Mart.git
cd Elevate-Mart
```

2. Install dependencies:
```bash
npm install
```

3. Initialize Database Tables (Optional if using Neon PostgreSQL):
```bash
npm run setup-db
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`.

---

## 8. Production Build Instructions

To generate a static and dynamic optimized production build, execute:

```bash
npm run build
```

To run the production server locally after building:

```bash
npm run start
```

---

## 9. Coupon Engine and Business Rules

ElevateMart includes a promo coupon engine (`lib/coupons.ts`) built with the following operational rules:

1. Promo Code Validation: Coupons are validated dynamically against active coupon codes (`ELEVATE10`, `ELEVATE20`, `SAVE500`, `WELCOME15`).
2. Single-Use Enforcement: Every user account is limited to redeeming a specific coupon code exactly once.
3. Tracking Mechanism: When an order is created via `/api/orders`, the redeemed coupon code is stored in the user's `used_coupons` PostgreSQL text array and recorded in client session storage.
4. Validation Feedback: If a user attempts to re-apply a code they have already redeemed, the engine returns an error message blocking the discount:
   `"আপনি 'CODE' কুপন কোডটি ইতোমধ্যেই একবার ব্যবহার করেছেন! এই কুপনটি পুনরায় ব্যবহার করা সম্ভব নয়।"`
5. Tax Removal: All orders calculate total payment as `subtotal + shipping` without any extra VAT tax charges (`tax = 0`).

---

## 10. UI Layout and Sticky Footer Implementation

The root application layout in `app/layout.tsx` enforces a sticky bottom footer across all pages:

```tsx
<body className="min-h-screen flex flex-col justify-between ...">
  <ThemeProvider>
    <AuthProvider>
      <CartProvider>
        <Navbar />
        <main className="flex-1 w-full flex flex-col justify-between">{children}</main>
        <Footer />
      </CartProvider>
    </AuthProvider>
  </ThemeProvider>
</body>
```

Each page wrapper (`/cart`, `/checkout`, `/profile`, `/login`, `/signup`) incorporates `flex-1 w-full min-h-[calc(100vh-16rem)]` styling, ensuring that the footer remains pinned at the bottom of the viewport regardless of content length or monitor screen height.
