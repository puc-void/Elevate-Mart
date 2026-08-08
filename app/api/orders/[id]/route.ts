import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth/session';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const order = await db.getOrderById(id);
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  if (session.role !== 'admin' && order.userId !== session.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json({ order });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
  }

  const { id } = await params;
  try {
    const body = await request.json();
    const { status } = body;
    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const updated = await db.updateOrderStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Order status updated', order: updated });
  } catch (error) {
    console.error('Update order status error:', error);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}
