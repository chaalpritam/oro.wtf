import { NextResponse } from 'next/server';
import type { DesignSystem, ApiResponse } from '@/lib/types';
import { z } from 'zod';
import prisma from '@/lib/db';

const designSystemSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  teamId: z.string().optional(),
  isPublic: z.boolean().optional(),
  version: z.string().optional(),
});

// GET /api/design-systems/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const designSystem = await prisma.designSystem.findUnique({
      where: { id },
      include: {
        tokens: true,
        components: true,
        team: true,
        createdBy: true,
        project: true,
      },
    });

    if (!designSystem) {
      return NextResponse.json<ApiResponse<DesignSystem>>(
        {
          success: false,
          error: 'Design system not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<DesignSystem>>({
      success: true,
      data: designSystem,
    });
  } catch (error) {
    console.error('Failed to fetch design system:', error);
    return NextResponse.json<ApiResponse<DesignSystem>>(
      {
        success: false,
        error: 'Failed to fetch design system',
      },
      { status: 500 }
    );
  }
}

// PUT /api/design-systems/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const validatedData = designSystemSchema.parse(body);

    const designSystem = await prisma.designSystem.update({
      where: { id },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        teamId: validatedData.teamId,
        isPublic: validatedData.isPublic,
        version: validatedData.version,
      },
      include: {
        tokens: true,
        components: true,
        team: true,
        createdBy: true,
        project: true,
      },
    });

    return NextResponse.json<ApiResponse<DesignSystem>>({
      success: true,
      data: designSystem,
    });
  } catch (error) {
    console.error('Failed to update design system:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json<ApiResponse<DesignSystem>>(
        {
          success: false,
          error: 'Invalid design system data',
        },
        { status: 400 }
      );
    }

    // Check if the error is a Prisma record not found error
    if (error.code === 'P2025') {
      return NextResponse.json<ApiResponse<DesignSystem>>(
        {
          success: false,
          error: 'Design system not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<DesignSystem>>(
      {
        success: false,
        error: 'Failed to update design system',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/design-systems/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.designSystem.delete({
      where: { id },
    });

    return NextResponse.json<ApiResponse<void>>({
      success: true,
    });
  } catch (error) {
    console.error('Failed to delete design system:', error);
    // Check if the error is a Prisma record not found error
    if (error.code === 'P2025') {
      return NextResponse.json<ApiResponse<void>>(
        {
          success: false,
          error: 'Design system not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<void>>(
      {
        success: false,
        error: 'Failed to delete design system',
      },
      { status: 500 }
    );
  }
} 