/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/lib/mongoose';
import Gallery from '@/models/Gallery';

export async function DELETE(req: NextRequest, context: any) {
  await connectMongo();
  const id = context?.params?.id;

  try {
    const deleted = await Gallery.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: 'Gallery item not found' }, { status: 404 });
    }

    // ReImage deletion temporarily skipped (no confirmed API method)
    return NextResponse.json({ message: 'Gallery item deleted from DB only (ReImage untouched)' });
  } catch (err) {
    console.error('DELETE /api/gallery/[id] error:', err);
    return NextResponse.json({ message: 'Failed to delete gallery item' }, { status: 500 });
  }
}

export async function GET(req: NextRequest, context: any) {
  await connectMongo();
  const id = context?.params?.id;

  try {
    const item = await Gallery.findById(id);
    if (!item) {
      return NextResponse.json({ message: 'Gallery item not found' }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (err) {
    console.error('GET /api/gallery/[id] error:', err);
    return NextResponse.json({ message: 'Error loading gallery item' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: any) {
  await connectMongo();
  const id = context?.params?.id;

  try {
    const { title, description, tags } = await req.json();

    const entry = await Gallery.findById(id);
    if (!entry) {
      return NextResponse.json({ message: 'Gallery item not found' }, { status: 404 });
    }

    // Update MongoDB fields
    entry.title = title;
    entry.description = description;
    entry.tags = tags;
    const updated = await entry.save();

    // Try to update ReImage tags
    const reimageRes = await fetch(`https://api.reimage.dev/tag/${entry.assetId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_REIMAGE_KEY || ''}`,
      },
      body: JSON.stringify({ tags }),
    });

    if (!reimageRes.ok) {
      const errorText = await reimageRes.text();
      console.warn('⚠️ ReImage tag update failed:', errorText);
      // Return 200 anyway, since MongoDB update succeeded
      return NextResponse.json({
        message: 'Gallery updated, but failed to sync tags to ReImage',
        partialSuccess: true,
        updated,
      });
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error('PUT /api/gallery/[id] error:', err);
    return NextResponse.json({ message: 'Failed to update gallery item' }, { status: 500 });
  }
}

