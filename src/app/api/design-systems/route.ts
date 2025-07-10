import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerClient } from '@/lib/supabase-server';
import { db } from '@/lib/db';

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
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const designSystems = await db.getDesignSystems();
    
    return NextResponse.json({
      success: true,
      data: designSystems,
    });
  } catch (error) {
    console.error('Failed to fetch design systems:', error);
    return NextResponse.json(
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
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = designSystemSchema.parse(body);

    const designSystem = await db.createDesignSystem({
      name: validatedData.name,
      description: validatedData.description,
      teamId: validatedData.teamId,
      isPublic: validatedData.isPublic,
      version: validatedData.version,
      projectId: validatedData.projectId,
      createdBy: user.id,
    });

    return NextResponse.json(
      {
        success: true,
        data: designSystem,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create design system:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid design system data',
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create design system',
      },
      { status: 500 }
    );
  }
} 