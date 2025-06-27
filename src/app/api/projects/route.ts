/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/lib/mongoose';
import Project from '@/models/Project';

// GET all projects
export async function GET(req: NextRequest, context: any) {
  await connectMongo();

  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json({ message: 'Error fetching projects' }, { status: 500 });
  }
}

// POST a new project
export async function POST(req: NextRequest, context: any) {
  await connectMongo();

  try {
    const body = await req.json();
    const {
      title,
      shortDescription,
      fullDescription,
      collaborators,
      imageUrls,
      startDate,
      endDate,
      isOngoing,
    } = body;

    const newProject = new Project({
      title,
      shortDescription,
      fullDescription,
      collaborators,
      imageUrls,
      startDate,
      endDate,
      isOngoing,
    });

    const saved = await newProject.save();
    return NextResponse.json(saved, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Failed to create project' }, { status: 500 });
  }
}
