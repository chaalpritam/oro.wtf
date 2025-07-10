-- Create tables for the design system application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  email_verified TIMESTAMP WITH TIME ZONE,
  password TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create teams table
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(team_id, user_id)
);

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_archived BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES public.users(id) NOT NULL,
  team_id UUID REFERENCES public.teams(id)
);

-- Create design_systems table
CREATE TABLE IF NOT EXISTS public.design_systems (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  version TEXT DEFAULT '1.0.0',
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES public.users(id) NOT NULL,
  team_id UUID REFERENCES public.teams(id),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL
);

-- Create tokens table
CREATE TABLE IF NOT EXISTS public.tokens (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  value TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('color', 'typography', 'spacing', 'borderRadius', 'shadow')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  design_system_id UUID REFERENCES public.design_systems(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(design_system_id, name)
);

-- Create components table
CREATE TABLE IF NOT EXISTS public.components (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  props JSONB DEFAULT '{}',
  code TEXT,
  preview_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  design_system_id UUID REFERENCES public.design_systems(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(design_system_id, name)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON public.projects(created_by);
CREATE INDEX IF NOT EXISTS idx_projects_team_id ON public.projects(team_id);
CREATE INDEX IF NOT EXISTS idx_design_systems_created_by ON public.design_systems(created_by);
CREATE INDEX IF NOT EXISTS idx_design_systems_team_id ON public.design_systems(team_id);
CREATE INDEX IF NOT EXISTS idx_design_systems_project_id ON public.design_systems(project_id);
CREATE INDEX IF NOT EXISTS idx_tokens_design_system_id ON public.tokens(design_system_id);
CREATE INDEX IF NOT EXISTS idx_components_design_system_id ON public.components(design_system_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON public.team_members(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.design_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.components ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own data
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Teams policies
CREATE POLICY "Team members can view team" ON public.teams
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.team_members 
      WHERE team_id = teams.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Team owners can manage team" ON public.teams
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.team_members 
      WHERE team_id = teams.id AND user_id = auth.uid() AND role = 'owner'
    )
  );

-- Team members policies
CREATE POLICY "Team members can view team members" ON public.team_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.team_members tm
      WHERE tm.team_id = team_members.team_id AND tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Team owners can manage team members" ON public.team_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.team_members tm
      WHERE tm.team_id = team_members.team_id AND tm.user_id = auth.uid() AND tm.role = 'owner'
    )
  );

-- Projects policies
CREATE POLICY "Project creators and team members can view projects" ON public.projects
  FOR SELECT USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.team_members tm
      WHERE tm.team_id = projects.team_id AND tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Project creators and team admins can manage projects" ON public.projects
  FOR ALL USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.team_members tm
      WHERE tm.team_id = projects.team_id AND tm.user_id = auth.uid() AND tm.role IN ('owner', 'admin')
    )
  );

-- Design systems policies
CREATE POLICY "Design system creators and team members can view design systems" ON public.design_systems
  FOR SELECT USING (
    created_by = auth.uid() OR
    is_public = true OR
    EXISTS (
      SELECT 1 FROM public.team_members tm
      WHERE tm.team_id = design_systems.team_id AND tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Design system creators and team admins can manage design systems" ON public.design_systems
  FOR ALL USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.team_members tm
      WHERE tm.team_id = design_systems.team_id AND tm.user_id = auth.uid() AND tm.role IN ('owner', 'admin')
    )
  );

-- Tokens policies
CREATE POLICY "Design system members can view tokens" ON public.tokens
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.design_systems ds
      WHERE ds.id = tokens.design_system_id AND ds.created_by = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.design_systems ds
      JOIN public.team_members tm ON ds.team_id = tm.team_id
      WHERE ds.id = tokens.design_system_id AND tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Design system creators and team admins can manage tokens" ON public.tokens
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.design_systems ds
      WHERE ds.id = tokens.design_system_id AND ds.created_by = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.design_systems ds
      JOIN public.team_members tm ON ds.team_id = tm.team_id
      WHERE ds.id = tokens.design_system_id AND tm.user_id = auth.uid() AND tm.role IN ('owner', 'admin')
    )
  );

-- Components policies
CREATE POLICY "Design system members can view components" ON public.components
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.design_systems ds
      WHERE ds.id = components.design_system_id AND ds.created_by = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.design_systems ds
      JOIN public.team_members tm ON ds.team_id = tm.team_id
      WHERE ds.id = components.design_system_id AND tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Design system creators and team admins can manage components" ON public.components
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.design_systems ds
      WHERE ds.id = components.design_system_id AND ds.created_by = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.design_systems ds
      JOIN public.team_members tm ON ds.team_id = tm.team_id
      WHERE ds.id = components.design_system_id AND tm.user_id = auth.uid() AND tm.role IN ('owner', 'admin')
    )
  );

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, image)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 