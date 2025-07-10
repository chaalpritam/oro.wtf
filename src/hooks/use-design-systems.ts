import { useState, useEffect, useCallback } from "react"
import { db, DesignSystem, Token, Component } from '@/lib/db'
import { mockDb } from '@/lib/mock-data'
import { useDataMode } from '@/lib/data-mode'

export interface UseDesignSystemsOptions {
  projectId?: string;
  enableRealtime?: boolean;
}

export function useDesignSystems(options: UseDesignSystemsOptions = {}) {
  const { dataMode } = useDataMode()
  const [designSystems, setDesignSystems] = useState<DesignSystem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDesignSystems = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = dataMode === 'database' 
        ? await db.getDesignSystems(options.projectId)
        : await mockDb.getDesignSystems(options.projectId)
      setDesignSystems(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch design systems')
    } finally {
      setLoading(false)
    }
  }, [options.projectId, dataMode])

  const createDesignSystem = useCallback(async (designSystem: Omit<DesignSystem, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newDesignSystem = dataMode === 'database'
        ? await db.createDesignSystem(designSystem)
        : await mockDb.createDesignSystem(designSystem)
      setDesignSystems(prev => [newDesignSystem, ...prev])
      return newDesignSystem
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create design system')
      throw err
    }
  }, [dataMode])

  const updateDesignSystem = useCallback(async (id: string, updates: Partial<DesignSystem>) => {
    try {
      const updatedDesignSystem = dataMode === 'database'
        ? await db.updateDesignSystem(id, updates)
        : await mockDb.updateDesignSystem(id, updates)
      setDesignSystems(prev => 
        prev.map(ds => ds.id === id ? updatedDesignSystem : ds)
      )
      return updatedDesignSystem
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update design system')
      throw err
    }
  }, [dataMode])

  const deleteDesignSystem = useCallback(async (id: string) => {
    try {
      if (dataMode === 'database') {
        await db.deleteDesignSystem(id)
      } else {
        await mockDb.deleteDesignSystem(id)
      }
      setDesignSystems(prev => prev.filter(ds => ds.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete design system')
      throw err
    }
  }, [dataMode])

  useEffect(() => {
    fetchDesignSystems()
  }, [fetchDesignSystems])

  return {
    designSystems,
    loading,
    error,
    refetch: fetchDesignSystems,
    createDesignSystem,
    updateDesignSystem,
    deleteDesignSystem,
  };
}

export function useDesignSystem(id: string) {
  const { dataMode } = useDataMode()
  const [designSystem, setDesignSystem] = useState<DesignSystem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDesignSystem = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = dataMode === 'database'
        ? await db.getDesignSystem(id)
        : await mockDb.getDesignSystem(id)
      setDesignSystem(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch design system')
    } finally {
      setLoading(false)
    }
  }, [id, dataMode])

  const updateDesignSystem = useCallback(async (updates: Partial<DesignSystem>) => {
    if (!designSystem) return;
    
    try {
      const updatedDesignSystem = dataMode === 'database'
        ? await db.updateDesignSystem(designSystem.id, updates)
        : await mockDb.updateDesignSystem(designSystem.id, updates)
      setDesignSystem(updatedDesignSystem)
      return updatedDesignSystem
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update design system')
      throw err
    }
  }, [designSystem, dataMode])

  const deleteDesignSystem = useCallback(async () => {
    if (!designSystem) return;
    
    try {
      if (dataMode === 'database') {
        await db.deleteDesignSystem(designSystem.id)
      } else {
        await mockDb.deleteDesignSystem(designSystem.id)
      }
      setDesignSystem(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete design system')
      throw err
    }
  }, [designSystem, dataMode])

  useEffect(() => {
    if (id) {
      fetchDesignSystem()
    }
  }, [id, fetchDesignSystem])

  return {
    designSystem,
    loading,
    error,
    refetch: fetchDesignSystem,
    updateDesignSystem,
    deleteDesignSystem,
  };
}

export function useTokens(designSystemId: string) {
  const { dataMode } = useDataMode()
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTokens = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = dataMode === 'database'
        ? await db.getTokens(designSystemId)
        : await mockDb.getTokens(designSystemId)
      setTokens(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tokens')
    } finally {
      setLoading(false)
    }
  }, [designSystemId, dataMode])

  const createToken = useCallback(async (token: Omit<Token, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newToken = dataMode === 'database'
        ? await db.createToken(token)
        : await mockDb.createToken(token)
      setTokens(prev => [newToken, ...prev])
      return newToken
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create token')
      throw err
    }
  }, [dataMode])

  const updateToken = useCallback(async (id: string, updates: Partial<Token>) => {
    try {
      const updatedToken = dataMode === 'database'
        ? await db.updateToken(id, updates)
        : await mockDb.updateToken(id, updates)
      setTokens(prev => 
        prev.map(token => token.id === id ? updatedToken : token)
      )
      return updatedToken
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update token')
      throw err
    }
  }, [dataMode])

  const deleteToken = useCallback(async (id: string) => {
    try {
      if (dataMode === 'database') {
        await db.deleteToken(id)
      } else {
        await mockDb.deleteToken(id)
      }
      setTokens(prev => prev.filter(token => token.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete token')
      throw err
    }
  }, [dataMode])

  useEffect(() => {
    if (designSystemId) {
      fetchTokens()
    }
  }, [designSystemId, fetchTokens])

  return {
    tokens,
    loading,
    error,
    refetch: fetchTokens,
    createToken,
    updateToken,
    deleteToken,
  };
}

export function useComponents(designSystemId: string) {
  const { dataMode } = useDataMode()
  const [components, setComponents] = useState<Component[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchComponents = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = dataMode === 'database'
        ? await db.getComponents(designSystemId)
        : await mockDb.getComponents(designSystemId)
      setComponents(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch components')
    } finally {
      setLoading(false)
    }
  }, [designSystemId, dataMode])

  const createComponent = useCallback(async (component: Omit<Component, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newComponent = dataMode === 'database'
        ? await db.createComponent(component)
        : await mockDb.createComponent(component)
      setComponents(prev => [newComponent, ...prev])
      return newComponent
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create component')
      throw err
    }
  }, [dataMode])

  const updateComponent = useCallback(async (id: string, updates: Partial<Component>) => {
    try {
      const updatedComponent = dataMode === 'database'
        ? await db.updateComponent(id, updates)
        : await mockDb.updateComponent(id, updates)
      setComponents(prev => 
        prev.map(component => component.id === id ? updatedComponent : component)
      )
      return updatedComponent
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update component')
      throw err
    }
  }, [dataMode])

  const deleteComponent = useCallback(async (id: string) => {
    try {
      if (dataMode === 'database') {
        await db.deleteComponent(id)
      } else {
        await mockDb.deleteComponent(id)
      }
      setComponents(prev => prev.filter(component => component.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete component')
      throw err
    }
  }, [dataMode])

  useEffect(() => {
    if (designSystemId) {
      fetchComponents()
    }
  }, [designSystemId, fetchComponents])

  return {
    components,
    loading,
    error,
    refetch: fetchComponents,
    createComponent,
    updateComponent,
    deleteComponent,
  };
} 