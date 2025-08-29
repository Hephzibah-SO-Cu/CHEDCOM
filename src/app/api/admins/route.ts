import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectMongo from '@/lib/mongoose';
import User from '@/models/User';

interface SessionUser {
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
  canManageAdmins: boolean;
}

// 🔒 Check if session user can manage admins
async function checkSuperAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !(session.user as SessionUser).canManageAdmins) {
    return NextResponse.json(
      { message: 'Forbidden: Superadmins only' },
      { status: 403 }
    );
  }
  return null;
}

// GET all admins
export async function GET() {
  const notAllowed = await checkSuperAdmin();
  if (notAllowed) return notAllowed;

  await connectMongo();
  try {
    const admins = await User.find().sort({ createdAt: -1 }).select('-password');
    return NextResponse.json(admins);
  } catch (error: unknown) {
    console.error('Error fetching admins:', error);
    return NextResponse.json(
      { message: 'Error fetching admins' },
      { status: 500 }
    );
  }
}

// POST a new admin
export async function POST(req: NextRequest) {
  const notAllowed = await checkSuperAdmin();
  if (notAllowed) return notAllowed;

  await connectMongo();
  try {
    const body = await req.json();
    const { name, email, password, role, canManageAdmins } = body as {
      name: string;
      email: string;
      password: string;
      role?: 'admin' | 'superadmin';
      canManageAdmins?: boolean;
    };

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'admin',
      canManageAdmins: !!canManageAdmins,
    });

    return NextResponse.json(newAdmin, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating admin:', error);
    return NextResponse.json(
      { message: 'Error creating admin' },
      { status: 500 }
    );
  }
}
