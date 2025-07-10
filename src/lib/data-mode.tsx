"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

type DataMode = 'database' | 'mock'

interface DataModeContextType {
  dataMode: DataMode
  setDataMode: (mode: DataMode) => void
  isDatabaseAvailable: boolean
  databaseError: string | null
}

const DataModeContext = createContext<DataModeContextType | undefined>(undefined)

export function DataModeProvider({ children }: { children: React.ReactNode }) {
  const [dataMode, setDataMode] = useState<DataMode>('mock')
  const [isDatabaseAvailable, setIsDatabaseAvailable] = useState(false)
  const [databaseError, setDatabaseError] = useState<string | null>(null)

  useEffect(() => {
    // Check if Supabase environment variables are available
    const hasSupabaseConfig = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (hasSupabaseConfig) {
      setIsDatabaseAvailable(true)
      setDatabaseError(null)
    } else {
      setIsDatabaseAvailable(false)
      setDatabaseError('Database not configured. Please set up Supabase environment variables.')
    }
  }, [])

  const handleSetDataMode = (mode: DataMode) => {
    if (mode === 'database' && !isDatabaseAvailable) {
      setDatabaseError('Cannot switch to database mode. Supabase is not properly configured.')
      return
    }
    setDataMode(mode)
    setDatabaseError(null)
  }

  return (
    <DataModeContext.Provider value={{ 
      dataMode, 
      setDataMode: handleSetDataMode, 
      isDatabaseAvailable, 
      databaseError 
    }}>
      {children}
    </DataModeContext.Provider>
  )
}

export function useDataMode() {
  const context = useContext(DataModeContext)
  if (context === undefined) {
    throw new Error('useDataMode must be used within a DataModeProvider')
  }
  return context
} 