/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/lib/mongoose';
import Project from '@/models/Project';

export async function GET(req: NextRequest, context: any) {
  await connectMongo();
  const id = (await context)?.params?.id;

  try {
    const project = await Project.findById(id);
    if (!project) return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ message: 'Error fetching project' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: any) {
  await connectMongo();
  const id = (await context)?.params?.id;

  try {
    const updates = await req.json();
    const updated = await Project.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ message: 'Error updating project' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: any) {
  await connectMongo();
  const id = (await context)?.params?.id;

  try {
    const deleted = await Project.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch {
    return NextResponse.json({ message: 'Error deleting project' }, { status: 500 });
  }
}
