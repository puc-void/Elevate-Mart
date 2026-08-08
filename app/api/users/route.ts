import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth/session';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
  }

  const users = await db.getUsers();
  return NextResponse.json({ users });
}

export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, userId, role, ...profileUpdates } = body;

    if (action === 'toggle-role') {
      if (session.role !== 'admin') {
        return NextResponse.json({ error: 'Admin access required to change user roles' }, { status: 403 });
      }
      const updated = await db.updateUserRole(userId, role);
      return NextResponse.json({ message: 'Role updated successfully', user: updated });
    }

    if (action === 'update-profile') {
      const targetUserId = userId || session.id;
      if (session.role !== 'admin' && targetUserId !== session.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      const updated = await db.updateUserProfile(targetUserId, profileUpdates);
      return NextResponse.json({ message: 'Profile updated successfully', user: updated });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  if (userId === session.id) {
    return NextResponse.json({ error: 'Cannot delete your own admin account' }, { status: 400 });
  }

  const success = await db.deleteUser(userId);
  if (!success) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  return NextResponse.json({ message: 'User deleted successfully' });
}
