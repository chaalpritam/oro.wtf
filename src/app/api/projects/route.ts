import { NextResponse } from 'next/server';
import type { Project, ApiResponse } from '@/lib/types';
import { z } from 'zod';
import prisma from '@/lib/db';

// Validation schema for project creation/update
const projectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  teamId: z.string().optional(),
});

// GET /api/projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        designSystems: true,
        team: true,
        createdBy: true,
      },
    });
    
    return NextResponse.json<ApiResponse<Project[]>>({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return NextResponse.json<ApiResponse<Project[]>>(
      {
        success: false,
        error: 'Failed to fetch projects',
      },
      { status: 500 }
    );
  }
}

// POST /api/projects
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = projectSchema.parse(body);

    // TODO: Get actual user ID from auth session
    const userId = 'temp-user-id';

    const project = await prisma.project.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        teamId: validatedData.teamId,
        createdById: userId,
      },
      include: {
        designSystems: true,
        team: true,
        createdBy: true,
      },
    });

    return NextResponse.json<ApiResponse<Project>>(
      {
        success: true,
        data: project,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create project:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json<ApiResponse<Project>>(
        {
          success: false,
          error: 'Invalid project data',
        },
        { status: 400 }
      );
    }

    return NextResponse.json<ApiResponse<Project>>(
      {
        success: false,
        error: 'Failed to create project',
      },
      { status: 500 }
    );
  }
} 