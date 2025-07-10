"use client"

import { Database, FileText, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDataMode } from "@/lib/data-mode"
import { toast } from "sonner"

export function DataModeToggle() {
  const { dataMode, setDataMode, isDatabaseAvailable, databaseError } = useDataMode()

  const handleModeChange = (mode: 'database' | 'mock') => {
    if (mode === dataMode) return // Already selected
    
    if (mode === 'database' && !isDatabaseAvailable) {
      toast.error('Database not available. Please configure Supabase environment variables.')
      return
    }
    
    setDataMode(mode)
    toast.success(`Switched to ${mode === 'database' ? 'Database' : 'Mock'} data`)
  }

  return (
    <div className="flex items-center bg-muted rounded-full p-1">
      <Button 
        variant={dataMode === 'database' ? 'default' : 'ghost'} 
        size="sm" 
        onClick={() => handleModeChange('database')}
        className="rounded-full h-6 px-3 text-xs transition-all"
        disabled={!isDatabaseAvailable}
        title={!isDatabaseAvailable ? 'Database not configured' : 'Switch to database mode'}
      >
        <Database className="h-3 w-3 mr-1" />
        DB
      </Button>
      <Button 
        variant={dataMode === 'mock' ? 'default' : 'ghost'} 
        size="sm" 
        onClick={() => handleModeChange('mock')}
        className="rounded-full h-6 px-3 text-xs transition-all"
      >
        <FileText className="h-3 w-3 mr-1" />
        Mock
      </Button>
    </div>
  )
} 