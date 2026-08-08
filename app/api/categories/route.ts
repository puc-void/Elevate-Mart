import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth/session';

export async function GET() {
  const categories = await db.getCategories();
  return NextResponse.json({ categories });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, description, image } = body;
    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newCat = await db.addCategory({
      name,
      slug,
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
    });

    return NextResponse.json({ message: 'Category created', category: newCat }, { status: 201 });
  } catch (error) {
    console.error('Create category error:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
  }

  const success = await db.deleteCategory(id);
  if (!success) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 });
  }
  return NextResponse.json({ message: 'Category deleted successfully' });
}
