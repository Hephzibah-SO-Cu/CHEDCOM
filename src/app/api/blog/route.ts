import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import Blog from "@/models/Blog";

// GET all blog posts
export async function GET() {
  await connectToDatabase();
  const blogs = await Blog.find().sort({ createdAt: -1 });
  return NextResponse.json(blogs);
}

// POST a new blog post
export async function POST(req: Request) {
  await connectToDatabase();
  const body = await req.json();
  const newBlog = await Blog.create(body);
  return NextResponse.json(newBlog, { status: 201 });
}
