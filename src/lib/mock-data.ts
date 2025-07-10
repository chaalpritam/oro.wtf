import { DesignSystem, Token, Component, Project } from './db'

// Mock data storage
let mockDesignSystems: (DesignSystem & { tokens: { count: number }[], components: { count: number }[], projects: { name: string } })[] = [
  {
    id: 'mock-1',
    name: 'E-commerce UI Kit',
    description: 'Complete design system for online stores',
    version: '1.0.0',
    is_public: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 'temp-user-id',
    team_id: null,
    project_id: 'mock-project-1',
    tokens: [{ count: 45 }],
    components: [{ count: 12 }],
    projects: { name: 'Default Project' },
  },
  {
    id: 'mock-2',
    name: 'Dashboard Components',
    description: 'Admin dashboard design system',
    version: '1.0.0',
    is_public: false,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    created_by: 'temp-user-id',
    team_id: null,
    project_id: 'mock-project-1',
    tokens: [{ count: 32 }],
    components: [{ count: 8 }],
    projects: { name: 'Default Project' },
  },
  {
    id: 'mock-3',
    name: 'Mobile App Design',
    description: 'iOS and Android component library',
    version: '1.0.0',
    is_public: false,
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date(Date.now() - 259200000).toISOString(),
    created_by: 'temp-user-id',
    team_id: null,
    project_id: 'mock-project-1',
    tokens: [{ count: 28 }],
    components: [{ count: 15 }],
    projects: { name: 'Default Project' },
  },
]

let mockTokens: Token[] = [
  { id: 'token-1', name: 'Primary', value: '#3b82f6', type: 'color', description: 'Main brand color', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), design_system_id: 'mock-1' },
  { id: 'token-2', name: 'Secondary', value: '#64748b', type: 'color', description: 'Secondary actions', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), design_system_id: 'mock-1' },
  { id: 'token-3', name: 'Success', value: '#10b981', type: 'color', description: 'Success states', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), design_system_id: 'mock-1' },
  { id: 'token-4', name: 'Error', value: '#ef4444', type: 'color', description: 'Error states', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), design_system_id: 'mock-1' },
  { id: 'token-5', name: 'Font Family', value: 'Inter, sans-serif', type: 'typography', description: 'Typography font family', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), design_system_id: 'mock-1' },
  { id: 'token-6', name: 'Base Size', value: '16px', type: 'typography', description: 'Base font size', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), design_system_id: 'mock-1' },
  { id: 'token-7', name: 'Spacing 4', value: '4', type: 'spacing', description: '4px spacing', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), design_system_id: 'mock-1' },
  { id: 'token-8', name: 'Spacing 8', value: '8', type: 'spacing', description: '8px spacing', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), design_system_id: 'mock-1' },
  { id: 'token-9', name: 'Spacing 16', value: '16', type: 'spacing', description: '16px spacing', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), design_system_id: 'mock-1' },
  { id: 'token-10', name: 'Border Radius Small', value: '4', type: 'borderRadius', description: 'Small border radius', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), design_system_id: 'mock-1' },
  { id: 'token-11', name: 'Border Radius Medium', value: '8', type: 'borderRadius', description: 'Medium border radius', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), design_system_id: 'mock-1' },
  { id: 'token-12', name: 'Shadow Small', value: '0 1px 2px 0 rgb(0 0 0 / 0.05)', type: 'shadow', description: 'Small shadow', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), design_system_id: 'mock-1' },
  { id: 'token-13', name: 'Shadow Medium', value: '0 4px 6px -1px rgb(0 0 0 / 0.1)', type: 'shadow', description: 'Medium shadow', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), design_system_id: 'mock-1' },
]

let mockComponents: Component[] = [
  { id: 'comp-1', name: 'Button', type: 'button', props: { text: 'Click me', variant: 'default', size: 'default' }, code: '<Button variant="default" size="default">Click me</Button>', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), design_system_id: 'mock-1' },
  { id: 'comp-2', name: 'Input', type: 'input', props: { placeholder: 'Enter text...', type: 'text' }, code: '<Input placeholder="Enter text..." type="text" />', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), design_system_id: 'mock-1' },
  { id: 'comp-3', name: 'Card', type: 'card', props: { title: 'Sample Card', content: 'Card content goes here...' }, code: '<Card><CardHeader><CardTitle>Sample Card</CardTitle></CardHeader><CardContent>Card content goes here...</CardContent></Card>', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), design_system_id: 'mock-1' },
]

export const mockDb = {
  // Design System operations
  async getDesignSystems(projectId?: string) {
    return mockDesignSystems
  },

  async getDesignSystem(id: string) {
    const designSystem = mockDesignSystems.find(ds => ds.id === id)
    if (!designSystem) throw new Error('Design system not found')
    
    return {
      ...designSystem,
      tokens: mockTokens.filter(token => token.design_system_id === id),
      components: mockComponents.filter(comp => comp.design_system_id === id),
      projects: { name: 'Default Project' },
      teams: { name: 'Default Team' },
    }
  },

  async createDesignSystem(designSystem: Omit<DesignSystem, 'id' | 'created_at' | 'updated_at'>) {
    const newDesignSystem = {
      id: `mock-${Date.now()}`,
      ...designSystem,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tokens: [{ count: 0 }],
      components: [{ count: 0 }],
      projects: { name: 'Default Project' },
    }
    mockDesignSystems.unshift(newDesignSystem)
    return newDesignSystem
  },

  async updateDesignSystem(id: string, updates: Partial<DesignSystem>) {
    const index = mockDesignSystems.findIndex(ds => ds.id === id)
    if (index === -1) throw new Error('Design system not found')
    
    mockDesignSystems[index] = {
      ...mockDesignSystems[index],
      ...updates,
      updated_at: new Date().toISOString(),
    }
    return mockDesignSystems[index]
  },

  async deleteDesignSystem(id: string) {
    const index = mockDesignSystems.findIndex(ds => ds.id === id)
    if (index === -1) throw new Error('Design system not found')
    
    mockDesignSystems.splice(index, 1)
    // Also remove related tokens and components
    mockTokens = mockTokens.filter(token => token.design_system_id !== id)
    mockComponents = mockComponents.filter(comp => comp.design_system_id !== id)
  },

  // Token operations
  async getTokens(designSystemId: string) {
    return mockTokens.filter(token => token.design_system_id === designSystemId)
  },

  async createToken(token: Omit<Token, 'id' | 'created_at' | 'updated_at'>) {
    const newToken = {
      id: `token-${Date.now()}`,
      ...token,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockTokens.unshift(newToken)
    
    // Update token count in design system
    const designSystem = mockDesignSystems.find(ds => ds.id === token.design_system_id)
    if (designSystem) {
      designSystem.tokens[0].count = mockTokens.filter(t => t.design_system_id === token.design_system_id).length
    }
    
    return newToken
  },

  async updateToken(id: string, updates: Partial<Token>) {
    const index = mockTokens.findIndex(token => token.id === id)
    if (index === -1) throw new Error('Token not found')
    
    mockTokens[index] = {
      ...mockTokens[index],
      ...updates,
      updated_at: new Date().toISOString(),
    }
    return mockTokens[index]
  },

  async deleteToken(id: string) {
    const index = mockTokens.findIndex(token => token.id === id)
    if (index === -1) throw new Error('Token not found')
    
    const token = mockTokens[index]
    mockTokens.splice(index, 1)
    
    // Update token count in design system
    const designSystem = mockDesignSystems.find(ds => ds.id === token.design_system_id)
    if (designSystem) {
      designSystem.tokens[0].count = mockTokens.filter(t => t.design_system_id === token.design_system_id).length
    }
  },

  // Component operations
  async getComponents(designSystemId: string) {
    return mockComponents.filter(component => component.design_system_id === designSystemId)
  },

  async createComponent(component: Omit<Component, 'id' | 'created_at' | 'updated_at'>) {
    const newComponent = {
      id: `comp-${Date.now()}`,
      ...component,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockComponents.unshift(newComponent)
    
    // Update component count in design system
    const designSystem = mockDesignSystems.find(ds => ds.id === component.design_system_id)
    if (designSystem) {
      designSystem.components[0].count = mockComponents.filter(c => c.design_system_id === component.design_system_id).length
    }
    
    return newComponent
  },

  async updateComponent(id: string, updates: Partial<Component>) {
    const index = mockComponents.findIndex(component => component.id === id)
    if (index === -1) throw new Error('Component not found')
    
    mockComponents[index] = {
      ...mockComponents[index],
      ...updates,
      updated_at: new Date().toISOString(),
    }
    return mockComponents[index]
  },

  async deleteComponent(id: string) {
    const index = mockComponents.findIndex(component => component.id === id)
    if (index === -1) throw new Error('Component not found')
    
    const component = mockComponents[index]
    mockComponents.splice(index, 1)
    
    // Update component count in design system
    const designSystem = mockDesignSystems.find(ds => ds.id === component.design_system_id)
    if (designSystem) {
      designSystem.components[0].count = mockComponents.filter(c => c.design_system_id === component.design_system_id).length
    }
  },

  // Project operations
  async createDefaultProject() {
    return {
      id: 'mock-project-1',
      name: 'Default Project',
      description: 'Default project for design systems',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_archived: false,
      created_by: 'temp-user-id',
      team_id: null,
    }
  },
} 