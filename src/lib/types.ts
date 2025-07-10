export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string | null
          email: string
          email_verified: string | null
          password: string | null
          image: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string | null
          email: string
          email_verified?: string | null
          password?: string | null
          image?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string
          email_verified?: string | null
          password?: string | null
          image?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      teams: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      team_members: {
        Row: {
          id: string
          role: 'owner' | 'admin' | 'editor' | 'viewer'
          joined_at: string
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          role?: 'owner' | 'admin' | 'editor' | 'viewer'
          joined_at?: string
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          role?: 'owner' | 'admin' | 'editor' | 'viewer'
          joined_at?: string
          team_id?: string
          user_id?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
          is_archived: boolean
          created_by: string
          team_id: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
          is_archived?: boolean
          created_by: string
          team_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
          is_archived?: boolean
          created_by?: string
          team_id?: string | null
        }
      }
      design_systems: {
        Row: {
          id: string
          name: string
          description: string | null
          version: string
          is_public: boolean
          created_at: string
          updated_at: string
          created_by: string
          team_id: string | null
          project_id: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          version?: string
          is_public?: boolean
          created_at?: string
          updated_at?: string
          created_by: string
          team_id?: string | null
          project_id: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          version?: string
          is_public?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string
          team_id?: string | null
          project_id?: string
        }
      }
      tokens: {
        Row: {
          id: string
          name: string
          value: string
          type: 'color' | 'typography' | 'spacing' | 'borderRadius' | 'shadow'
          description: string | null
          created_at: string
          updated_at: string
          design_system_id: string
        }
        Insert: {
          id?: string
          name: string
          value: string
          type: 'color' | 'typography' | 'spacing' | 'borderRadius' | 'shadow'
          description?: string | null
          created_at?: string
          updated_at?: string
          design_system_id: string
        }
        Update: {
          id?: string
          name?: string
          value?: string
          type?: 'color' | 'typography' | 'spacing' | 'borderRadius' | 'shadow'
          description?: string | null
          created_at?: string
          updated_at?: string
          design_system_id?: string
        }
      }
      components: {
        Row: {
          id: string
          name: string
          description: string | null
          type: string
          props: Json
          code: string
          preview_image: string | null
          created_at: string
          updated_at: string
          design_system_id: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          type: string
          props?: Json
          code: string
          preview_image?: string | null
          created_at?: string
          updated_at?: string
          design_system_id: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          type?: string
          props?: Json
          code?: string
          preview_image?: string | null
          created_at?: string
          updated_at?: string
          design_system_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 