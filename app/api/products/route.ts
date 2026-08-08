import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('categoryId') || undefined;
  const search = searchParams.get('search') || undefined;
  const featured = searchParams.get('featured') === 'true';

  const products = await db.getProducts({ categoryId, search, featured });
  return NextResponse.json({ products });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { title, description, price, originalPrice, stock, categoryId, categoryName, images, isFeatured } = body;

    if (!title || !price || !categoryId) {
      return NextResponse.json({ error: 'Missing required fields (title, price, categoryId)' }, { status: 400 });
    }

    const newProduct = await db.addProduct({
      title,
      description: description || '',
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      stock: Number(stock || 10),
      categoryId,
      categoryName: categoryName || 'General',
      rating: 5.0,
      reviewCount: 0,
      images: Array.isArray(images) && images.length > 0 ? images : [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
      ],
      isFeatured: !!isFeatured,
      isNew: true
    });

    return NextResponse.json({ message: 'Product created successfully', product: newProduct }, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
