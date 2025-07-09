import { NextResponse } from 'next/server';
import type { Project, ApiResponse } from '@/lib/types';
import { z } from 'zod';
import prisma from '@/lib/db';

const projectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  teamId: z.string().optional(),
  isArchived: z.boolean().optional(),
});

// GET /api/projects/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        designSystems: true,
        team: true,
        createdBy: true,
      },
    });

    if (!project) {
      return NextResponse.json<ApiResponse<Project>>(
        {
          success: false,
          error: 'Project not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<Project>>({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Failed to fetch project:', error);
    return NextResponse.json<ApiResponse<Project>>(
      {
        success: false,
        error: 'Failed to fetch project',
      },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const validatedData = projectSchema.parse(body);

    const project = await prisma.project.update({
      where: { id },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        teamId: validatedData.teamId,
        isArchived: validatedData.isArchived,
      },
      include: {
        designSystems: true,
        team: true,
        createdBy: true,
      },
    });

    return NextResponse.json<ApiResponse<Project>>({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Failed to update project:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json<ApiResponse<Project>>(
        {
          success: false,
          error: 'Invalid project data',
        },
        { status: 400 }
      );
    }

    // Check if the error is a Prisma record not found error
    if (error.code === 'P2025') {
      return NextResponse.json<ApiResponse<Project>>(
        {
          success: false,
          error: 'Project not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<Project>>(
      {
        success: false,
        error: 'Failed to update project',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json<ApiResponse<void>>({
      success: true,
    });
  } catch (error) {
    console.error('Failed to delete project:', error);
    // Check if the error is a Prisma record not found error
    if (error.code === 'P2025') {
      return NextResponse.json<ApiResponse<void>>(
        {
          success: false,
          error: 'Project not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<void>>(
      {
        success: false,
        error: 'Failed to delete project',
      },
      { status: 500 }
    );
  }
} 