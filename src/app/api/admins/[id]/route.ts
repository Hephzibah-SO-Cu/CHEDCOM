/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectMongo from '@/lib/mongoose';
import User from '@/models/User';

// 🔒 Check if session user can manage admins
async function checkSuperAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !(session.user as any).canManageAdmins) {
    return NextResponse.json({ message: 'Forbidden: Superadmins only' }, { status: 403 });
  }
  return null;
}

// GET admin by ID
export async function GET(req: NextRequest, context: any) {
  const notAllowed = await checkSuperAdmin();
  if (notAllowed) return notAllowed;

  await connectMongo();
  const id = (await context)?.params?.id;

  try {
    const admin = await User.findById(id).select('-password');
    if (!admin) {
      return NextResponse.json({ message: 'Admin not found' }, { status: 404 });
    }
    return NextResponse.json(admin);
  } catch (error: unknown) {
    console.error('Error fetching admin:', error);
    return NextResponse.json({ message: 'Error fetching admin' }, { status: 500 });
  }
}

// UPDATE admin
export async function PUT(req: NextRequest, context: any) {
  const notAllowed = await checkSuperAdmin();
  if (notAllowed) return notAllowed;

  await connectMongo();
  const id = (await context)?.params?.id;

  try {
    const data = await req.json();

    if (data.password) {
      const bcrypt = await import('bcryptjs');
      data.password = await bcrypt.hash(data.password, 10);
    }

    const updated = await User.findByIdAndUpdate(id, data, { new: true });
    if (!updated) {
      return NextResponse.json({ message: 'Admin not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error: unknown) {
    console.error('Error updating admin:', error);
    return NextResponse.json({ message: 'Error updating admin' }, { status: 500 });
  }
}

// DELETE admin
export async function DELETE(req: NextRequest, context: any) {
  const notAllowed = await checkSuperAdmin();
  if (notAllowed) return notAllowed;

  await connectMongo();
  const id = (await context)?.params?.id;

  try {
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: 'Admin not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Admin deleted successfully' });
  } catch (error: unknown) {
    console.error('Error deleting admin:', error);
    return NextResponse.json({ message: 'Error deleting admin' }, { status: 500 });
  }
}
