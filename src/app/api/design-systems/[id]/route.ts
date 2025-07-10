import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerClient } from '@/lib/supabase-server';
import { db } from '@/lib/db';

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
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Get design system with tokens and components
    const { data: designSystem, error } = await supabase
      .from('design_systems')
      .select(`
        *,
        tokens(*),
        components(*),
        teams(name),
        users!design_systems_created_by_fkey(name, email),
        projects(name)
      `)
      .eq('id', id)
      .single();

    if (error || !designSystem) {
      return NextResponse.json(
        {
          success: false,
          error: 'Design system not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: designSystem,
    });
  } catch (error) {
    console.error('Failed to fetch design system:', error);
    return NextResponse.json(
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
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const validatedData = designSystemSchema.parse(body);

    const { data: designSystem, error } = await supabase
      .from('design_systems')
      .update({
        name: validatedData.name,
        description: validatedData.description,
        team_id: validatedData.teamId,
        is_public: validatedData.isPublic,
        version: validatedData.version,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(`
        *,
        tokens(*),
        components(*),
        teams(name),
        users!design_systems_created_by_fkey(name, email),
        projects(name)
      `)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          {
            success: false,
            error: 'Design system not found',
          },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: designSystem,
    });
  } catch (error) {
    console.error('Failed to update design system:', error);
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
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    const { error } = await supabase
      .from('design_systems')
      .delete()
      .eq('id', id);

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          {
            success: false,
            error: 'Design system not found',
          },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Failed to delete design system:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete design system',
      },
      { status: 500 }
    );
  }
} 