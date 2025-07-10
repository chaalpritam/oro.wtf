import { createClient } from '@supabase/supabase-js';

// Check if Supabase environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create Supabase client only if environment variables are available
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

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
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as User;
  },

  async updateUser(id: string, updates: Partial<User>) {
    if (!supabase) throw new Error('Supabase not configured')
    
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
    if (!supabase) throw new Error('Supabase not configured')
    
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
    if (!supabase) throw new Error('Supabase not configured')
    
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
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        design_systems(count),
        teams(name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as (Project & { design_systems: { count: number }[], teams: { name: string } })[];
  },

  async getProject(id: string) {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        design_systems(*),
        teams(name)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Project & { design_systems: DesignSystem[], teams: { name: string } };
  },

  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();
    
    if (error) throw error;
    return data as Project;
  },

  async updateProject(id: string, updates: Partial<Project>) {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Project;
  },

  async deleteProject(id: string) {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Design System operations
  async getDesignSystems(projectId?: string) {
    if (!supabase) throw new Error('Supabase not configured')
    
    let query = supabase
      .from('design_systems')
      .select(`
        *,
        tokens(count),
        components(count),
        projects(name)
      `)
      .order('created_at', { ascending: false });
    
    if (projectId) {
      query = query.eq('project_id', projectId);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data as (DesignSystem & { tokens: { count: number }[], components: { count: number }[], projects: { name: string } })[];
  },

  async getDesignSystem(id: string) {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase
      .from('design_systems')
      .select(`
        *,
        tokens(*),
        components(*),
        projects(name),
        teams(name)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as DesignSystem & { tokens: Token[], components: Component[], projects: { name: string }, teams: { name: string } };
  },

  async createDesignSystem(designSystem: Omit<DesignSystem, 'id' | 'created_at' | 'updated_at'>) {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase
      .from('design_systems')
      .insert(designSystem)
      .select()
      .single();
    
    if (error) throw error;
    return data as DesignSystem;
  },

  async updateDesignSystem(id: string, updates: Partial<DesignSystem>) {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase
      .from('design_systems')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as DesignSystem;
  },

  async deleteDesignSystem(id: string) {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { error } = await supabase
      .from('design_systems')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Token operations
  async getTokens(designSystemId: string) {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase
      .from('tokens')
      .select('*')
      .eq('design_system_id', designSystemId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Token[];
  },

  async createToken(token: Omit<Token, 'id' | 'created_at' | 'updated_at'>) {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase
      .from('tokens')
      .insert(token)
      .select()
      .single();
    
    if (error) throw error;
    return data as Token;
  },

  async updateToken(id: string, updates: Partial<Token>) {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase
      .from('tokens')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Token;
  },

  async deleteToken(id: string) {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { error } = await supabase
      .from('tokens')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Component operations
  async getComponents(designSystemId: string) {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase
      .from('components')
      .select('*')
      .eq('design_system_id', designSystemId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Component[];
  },

  async createComponent(component: Omit<Component, 'id' | 'created_at' | 'updated_at'>) {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase
      .from('components')
      .insert(component)
      .select()
      .single();
    
    if (error) throw error;
    return data as Component;
  },

  async updateComponent(id: string, updates: Partial<Component>) {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase
      .from('components')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Component;
  },

  async deleteComponent(id: string) {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { error } = await supabase
      .from('components')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Utility functions
  async getCurrentUser() {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    return this.getUser(user.id);
  },

  async createDefaultProject() {
    if (!supabase) throw new Error('Supabase not configured')
    
    // Create a default project for new design systems
    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        name: "Default Project",
        description: "Default project for design systems",
        created_by: "temp-user-id", // This will be replaced with actual user ID when auth is enabled
        team_id: null,
      })
      .select()
      .single();
    
    if (error) throw error;
    return project as Project;
  },

  // Real-time subscriptions
  subscribeToDesignSystem(id: string, callback: (payload: any) => void) {
    if (!supabase) throw new Error('Supabase not configured')
    
    return supabase
      .channel(`design-system-${id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'design_systems',
        filter: `id=eq.${id}`
      }, callback)
      .subscribe();
  },

  subscribeToTokens(designSystemId: string, callback: (payload: any) => void) {
    if (!supabase) throw new Error('Supabase not configured')
    
    return supabase
      .channel(`tokens-${designSystemId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tokens',
        filter: `design_system_id=eq.${designSystemId}`
      }, callback)
      .subscribe();
  },

  subscribeToComponents(designSystemId: string, callback: (payload: any) => void) {
    if (!supabase) throw new Error('Supabase not configured')
    
    return supabase
      .channel(`components-${designSystemId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'components',
        filter: `design_system_id=eq.${designSystemId}`
      }, callback)
      .subscribe();
  }
};

export default db; 