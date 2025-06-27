// src/app/api/trainings/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/lib/mongoose';
import Training from '@/models/Training';

// GET a single training by ID
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await connectMongo();

  try {
    const training = await Training.findById(context.params.id);
    if (!training) {
      return NextResponse.json({ message: 'Training not found' }, { status: 404 });
    }
    return NextResponse.json(training);
  } catch {
    return NextResponse.json({ message: 'Error fetching training' }, { status: 500 });
  }
}

// PUT to update an existing training
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await connectMongo();

  try {
    const data = await req.json();
    const updated = await Training.findByIdAndUpdate(context.params.id, data, { new: true });

    if (!updated) {
      return NextResponse.json({ message: 'Training not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ message: 'Error updating training' }, { status: 500 });
  }
}

// DELETE a training
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await connectMongo();

  try {
    const deleted = await Training.findByIdAndDelete(context.params.id);
    if (!deleted) {
      return NextResponse.json({ message: 'Training not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Training deleted successfully' });
  } catch {
    return NextResponse.json({ message: 'Error deleting training' }, { status: 500 });
  }
}
