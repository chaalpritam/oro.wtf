"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

type DataMode = 'database' | 'mock'

interface DataModeContextType {
  dataMode: DataMode
  setDataMode: (mode: DataMode) => void
  isDatabaseAvailable: boolean
}

const DataModeContext = createContext<DataModeContextType | undefined>(undefined)

export function DataModeProvider({ children }: { children: React.ReactNode }) {
  const [dataMode, setDataMode] = useState<DataMode>('mock')
  const [isDatabaseAvailable, setIsDatabaseAvailable] = useState(false)

  useEffect(() => {
    // Check if Supabase environment variables are available
    const hasSupabaseConfig = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    setIsDatabaseAvailable(!!hasSupabaseConfig)
    
    // If database is not available, default to mock mode
    if (!hasSupabaseConfig) {
      setDataMode('mock')
    }
  }, [])

  return (
    <DataModeContext.Provider value={{ dataMode, setDataMode, isDatabaseAvailable }}>
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