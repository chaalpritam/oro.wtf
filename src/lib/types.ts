export interface DesignToken {
  id: string;
  name: string;
  value: string;
  type: 'color' | 'typography' | 'spacing' | 'borderRadius' | 'shadow';
  description?: string;
}

export interface Component {
  id: string;
  name: string;
  description?: string;
  type: string;
  props: Record<string, any>;
  code: string;
  previewImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DesignSystem {
  id: string;
  name: string;
  description?: string;
  tokens: DesignToken[];
  components: Component[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  teamId?: string;
  isPublic: boolean;
  version: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  designSystems: DesignSystem[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  teamId?: string;
  isArchived: boolean;
}

export interface Team {
  id: string;
  name: string;
  members: TeamMember[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  id: string;
  userId: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  joinedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
} 