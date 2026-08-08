import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') ? Number(searchParams.get('page')) : undefined;
  const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined;

  // Admin gets all orders, standard user only gets their own orders
  const result = session.role === 'admin' 
    ? await db.getOrders({ page, limit }) 
    : await db.getOrders({ userId: session.id, page, limit });

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized. Please sign in to place an order.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { items, paymentMethod, shippingAddress, subtotal, shipping, tax, totalAmount, couponCode } = body;

    if (!items || items.length === 0 || !shippingAddress) {
      return NextResponse.json({ error: 'Order items and shipping address are required' }, { status: 400 });
    }

    const newOrder = await db.createOrder({
      userId: session.id,
      userName: session.name,
      userEmail: session.email,
      items,
      subtotal: subtotal || 0,
      shipping: shipping || 0,
      tax: tax || 0,
      totalAmount: totalAmount || 0,
      paymentMethod: paymentMethod || 'credit_card',
      paymentStatus: paymentMethod === 'cash_on_delivery' ? 'pending' : 'paid',
      status: 'pending',
      shippingAddress
    });

    // Record coupon usage in user database record to prevent duplicate usage
    if (couponCode) {
      await db.recordUsedCoupon(session.id, couponCode);
    }

    return NextResponse.json({ message: 'Order placed successfully', order: newOrder }, { status: 201 });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
