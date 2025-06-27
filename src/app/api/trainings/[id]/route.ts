/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/lib/mongoose';
import Training from '@/models/Training';

export async function GET(req: NextRequest, context: any) {
  await connectMongo();
  const id = (await context)?.params?.id;

  try {
    const training = await Training.findById(id);
    if (!training) {
      return NextResponse.json({ message: 'Training not found' }, { status: 404 });
    }
    return NextResponse.json(training);
  } catch {
    return NextResponse.json({ message: 'Error fetching training' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: any) {
  await connectMongo();
  const id = (await context)?.params?.id;

  try {
    const data = await req.json();
    const updated = await Training.findByIdAndUpdate(id, data, { new: true });

    if (!updated) {
      return NextResponse.json({ message: 'Training not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ message: 'Error updating training' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: any) {
  await connectMongo();
  const id = (await context)?.params?.id;

  try {
    const deleted = await Training.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: 'Training not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Training deleted successfully' });
  } catch {
    return NextResponse.json({ message: 'Error deleting training' }, { status: 500 });
  }
}
