import { NextResponse } from 'next/server';
import type { DesignSystem, ApiResponse } from '@/lib/types';
import { z } from 'zod';
import prisma from '@/lib/db';

// Validation schema for design system creation/update
const designSystemSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  teamId: z.string().optional(),
  isPublic: z.boolean().default(false),
  version: z.string().default('1.0.0'),
  projectId: z.string(),
});

// GET /api/design-systems
export async function GET() {
  try {
    const designSystems = await prisma.designSystem.findMany({
      include: {
        tokens: true,
        components: true,
        team: true,
        createdBy: true,
        project: true,
      },
    });
    
    return NextResponse.json<ApiResponse<DesignSystem[]>>({
      success: true,
      data: designSystems,
    });
  } catch (error) {
    console.error('Failed to fetch design systems:', error);
    return NextResponse.json<ApiResponse<DesignSystem[]>>(
      {
        success: false,
        error: 'Failed to fetch design systems',
      },
      { status: 500 }
    );
  }
}

// POST /api/design-systems
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = designSystemSchema.parse(body);

    // TODO: Get actual user ID from auth session
    const userId = 'temp-user-id';

    const designSystem = await prisma.designSystem.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        teamId: validatedData.teamId,
        isPublic: validatedData.isPublic,
        version: validatedData.version,
        projectId: validatedData.projectId,
        createdById: userId,
      },
      include: {
        tokens: true,
        components: true,
        team: true,
        createdBy: true,
        project: true,
      },
    });

    return NextResponse.json<ApiResponse<DesignSystem>>(
      {
        success: true,
        data: designSystem,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create design system:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json<ApiResponse<DesignSystem>>(
        {
          success: false,
          error: 'Invalid design system data',
        },
        { status: 400 }
      );
    }

    return NextResponse.json<ApiResponse<DesignSystem>>(
      {
        success: false,
        error: 'Failed to create design system',
      },
      { status: 500 }
    );
  }
} 