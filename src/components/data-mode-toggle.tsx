"use client"

import { Database, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDataMode } from "@/lib/data-mode"
import { toast } from "sonner"

export function DataModeToggle() {
  const { dataMode, setDataMode, isDatabaseAvailable } = useDataMode()

  const handleModeChange = (mode: 'database' | 'mock') => {
    if (mode === dataMode) return // Already selected
    setDataMode(mode)
    toast.success(`Switched to ${mode === 'database' ? 'Database' : 'Mock'} data`)
  }

  if (!isDatabaseAvailable) {
    return (
      <div className="flex items-center bg-muted rounded-full p-1">
        <Button variant="outline" size="sm" disabled className="rounded-full h-6 px-3 text-xs">
          <Database className="h-3 w-3 mr-1" />
          DB
        </Button>
        <Button variant="default" size="sm" disabled className="rounded-full h-6 px-3 text-xs">
          <FileText className="h-3 w-3 mr-1" />
          Mock
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center bg-muted rounded-full p-1">
      <Button 
        variant={dataMode === 'database' ? 'default' : 'ghost'} 
        size="sm" 
        onClick={() => handleModeChange('database')}
        className="rounded-full h-6 px-3 text-xs transition-all"
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