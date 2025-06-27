// src/app/api/trainings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/lib/mongoose';
import Training from '@/models/Training';

// GET all trainings
export async function GET() {
  await connectMongo();
  try {
    const trainings = await Training.find().sort({ createdAt: -1 });
    return NextResponse.json(trainings);
  } catch (error: unknown) {
    console.error('Error fetching trainings:', error);
    return NextResponse.json({ message: 'Error fetching trainings' }, { status: 500 });
  }
}

// POST a new training
export async function POST(req: NextRequest) {
  await connectMongo();
  try {
    const body = await req.json();

    const {
      title,
      shortDescription,
      fullDescription,
      facilitators,
      targetAudience,
      resources,
      imageUrls,
      certificateIssued,
      mode,
      startDate,
      endDate,
      isOngoing,
    } = body;

    const newTraining = new Training({
      title,
      shortDescription,
      fullDescription,
      facilitators,
      targetAudience,
      resources,
      imageUrls,
      certificateIssued,
      mode,
      startDate,
      endDate,
      isOngoing,
    });

    const saved = await newTraining.save();
    return NextResponse.json(saved, { status: 201 });
  } catch (error: unknown) {
    console.error('Error fetching trainings:', error);
    return NextResponse.json({ message: 'Error fetching trainings' }, { status: 500 });
  }
}
