import { NextRequest, NextResponse } from 'next/server';
import Blog from '@/models/Blog';
import connectMongo from '@/lib/mongoose';

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  await connectMongo();

  const params = await context.params;
  const { id } = params;

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ message: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch {
    return NextResponse.json({ message: 'Error fetching blog post' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  await connectMongo();

  const { title, content } = await req.json();
  const params = await context.params;
  const { id } = params;

  try {
    const updated = await Blog.findByIdAndUpdate(
      id,
      { title, content },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ message: 'Failed to update post' }, { status: 500 });
  }
}
