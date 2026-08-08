import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');

  if (!productId) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  const reviews = await db.getProductReviews(productId);
  return NextResponse.json({ reviews });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized. Please sign in to write a review.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { productId, rating, comment } = body;

    if (!productId || !rating || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const review = await db.addReview({
      productId,
      userId: session.id,
      userName: session.name,
      userAvatar: session.avatar,
      rating: Number(rating),
      comment
    });

    return NextResponse.json({ message: 'Review added successfully', review }, { status: 201 });
  } catch (error) {
    console.error('Add review error:', error);
    return NextResponse.json({ error: 'Failed to add review' }, { status: 500 });
  }
}
