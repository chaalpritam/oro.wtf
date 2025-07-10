import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Database types
export interface User {
  id: string;
  name?: string;
  email: string;
  email_verified?: string;
  password?: string;
  image?: string;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  joined_at: string;
  team_id: string;
  user_id: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  is_archived: boolean;
  created_by: string;
  team_id?: string;
}

export interface DesignSystem {
  id: string;
  name: string;
  description?: string;
  version: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  team_id?: string;
  project_id: string;
}

export interface Token {
  id: string;
  name: string;
  value: string;
  type: 'color' | 'typography' | 'spacing' | 'borderRadius' | 'shadow';
  description?: string;
  created_at: string;
  updated_at: string;
  design_system_id: string;
}

export interface Component {
  id: string;
  name: string;
  description?: string;
  type: string;
  props: Record<string, any>;
  code: string;
  preview_image?: string;
  created_at: string;
  updated_at: string;
  design_system_id: string;
}

// Database helper functions
export const db = {
  // User operations
  async getUser(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as User;
  },

  async updateUser(id: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as User;
  },

  // Team operations
  async getTeams() {
    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        team_members!inner(user_id)
      `)
      .eq('team_members.user_id', (await supabase.auth.getUser()).data.user?.id);
    
    if (error) throw error;
    return data as Team[];
  },

  async createTeam(name: string) {
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .insert({ name })
      .select()
      .single();
    
    if (teamError) throw teamError;

    const { error: memberError } = await supabase
      .from('team_members')
      .insert({
        team_id: team.id,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        role: 'owner'
      });
    
    if (memberError) throw memberError;
    return team as Team;
  },

  // Project operations
  async getProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Project[];
  },

  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();
    
    if (error) throw error;
    return data as Project;
  },

  // Design System operations
  async getDesignSystems(projectId?: string) {
    let query = supabase
      .from('design_systems')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (projectId) {
      query = query.eq('project_id', projectId);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data as DesignSystem[];
  },

  async createDesignSystem(designSystem: Omit<DesignSystem, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('design_systems')
      .insert(designSystem)
      .select()
      .single();
    
    if (error) throw error;
    return data as DesignSystem;
  },

  // Token operations
  async getTokens(designSystemId: string) {
    const { data, error } = await supabase
      .from('tokens')
      .select('*')
      .eq('design_system_id', designSystemId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Token[];
  },

  async createToken(token: Omit<Token, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('tokens')
      .insert(token)
      .select()
      .single();
    
    if (error) throw error;
    return data as Token;
  },

  // Component operations
  async getComponents(designSystemId: string) {
    const { data, error } = await supabase
      .from('components')
      .select('*')
      .eq('design_system_id', designSystemId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Component[];
  },

  async createComponent(component: Omit<Component, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('components')
      .insert(component)
      .select()
      .single();
    
    if (error) throw error;
    return data as Component;
  }
};

export default db; 