import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/lib/mongoose';
import Gallery from '@/models/Gallery';

export async function GET() {
  await connectMongo();

  try {
    const entries = await Gallery.find().sort({ createdAt: -1 });
    return NextResponse.json(entries);
  } catch (err) {
    return NextResponse.json({ message: 'Failed to fetch gallery entries' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await connectMongo();

  try {
    const body = await req.json();
    const {
      title,
      description,
      mediaUrl,
      assetId,
      tags,
      uploadedBy = 'Admin',
    } = body;

    if (!mediaUrl || !assetId) {
      return NextResponse.json({ message: 'Missing media URL or asset ID' }, { status: 400 });
    }

    const isVideo = /\.(mp4|webm|ogg)$/i.test(mediaUrl);
    const mediaType = isVideo ? 'video' : 'image';

    const newEntry = new Gallery({
      title,
      description,
      mediaUrl,
      assetId,
      tags,
      mediaType,
      uploadedBy,
    });

    const saved = await newEntry.save();
    return NextResponse.json(saved, { status: 201 });
  } catch (err) {
    console.error('POST /api/gallery error:', err);
    return NextResponse.json({ message: 'Failed to create gallery entry' }, { status: 500 });
  }
}

