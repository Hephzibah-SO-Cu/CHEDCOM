/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import Blog from '@/models/Blog';
import connectMongo from '@/lib/mongoose';

export async function GET(req: NextRequest, { params }: any) {
  await connectMongo();

  try {
    const blog = await Blog.findById(params.id);
    if (!blog) {
      return NextResponse.json({ message: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch {
    return NextResponse.json({ message: 'Error fetching blog post' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: any) {
  await connectMongo();

  const { title, content } = await req.json();

  try {
    const updated = await Blog.findByIdAndUpdate(params.id, { title, content }, { new: true });

    if (!updated) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ message: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: any) {
  await connectMongo();

  try {
    const deleted = await Blog.findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch {
    return NextResponse.json({ message: 'Failed to delete post' }, { status: 500 });
  }
}
