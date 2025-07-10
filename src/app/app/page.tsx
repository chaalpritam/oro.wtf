"use client"

import { useState } from "react"
import { Plus, Edit, Copy, Trash2, Clock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useDesignSystems } from "@/hooks/use-design-systems"
import { useDataMode } from "@/lib/data-mode"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { db } from "@/lib/db"
import { mockDb } from "@/lib/mock-data"

export default function Dashboard() {
  const router = useRouter()
  const { dataMode } = useDataMode()
  const { designSystems, loading, error, createDesignSystem, deleteDesignSystem } = useDesignSystems()
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateDesignSystem = async () => {
    try {
      setIsCreating(true)
      
      // Create a default project if needed
      let projectId = "temp-project-id"
      try {
        const defaultProject = dataMode === 'database'
          ? await db.createDefaultProject()
          : await mockDb.createDefaultProject()
        projectId = defaultProject.id
      } catch (error) {
        console.error("Error creating default project:", error)
        // Continue with temp project ID if creation fails
      }
      
      const newDesignSystem = await createDesignSystem({
        name: "New Design System",
        description: "A new design system",
        version: "1.0.0",
        is_public: false,
        created_by: "temp-user-id", // This will be replaced with actual user ID when auth is enabled
        project_id: projectId,
      })
      toast.success("Design system created successfully!")
      router.push(`/app/builder?designSystemId=${newDesignSystem.id}`)
    } catch (error) {
      toast.error("Failed to create design system")
      console.error("Error creating design system:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteDesignSystem = async (id: string) => {
    try {
      await deleteDesignSystem(id)
      toast.success("Design system deleted successfully!")
    } catch (error) {
      toast.error("Failed to delete design system")
      console.error("Error deleting design system:", error)
    }
  }

  const handleOpenDesignSystem = (id: string) => {
    router.push(`/app/builder?designSystemId=${id}`)
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading design systems...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-destructive">Error loading design systems: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
          <p className="text-muted-foreground">Build and manage your design systems with ease</p>
          <p className="text-sm text-muted-foreground mt-1">
            Using {dataMode === 'database' ? 'Database' : 'Mock'} data
          </p>
        </div>
        <Button 
          size="lg" 
          className="gap-2" 
          onClick={handleCreateDesignSystem}
          disabled={isCreating}
        >
          {isCreating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {isCreating ? "Creating..." : "Create New Design System"}
        </Button>
      </div>

      {designSystems.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {designSystems.map((designSystem) => (
            <Card key={designSystem.id} className="group relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{designSystem.name}</CardTitle>
                    <CardDescription>{designSystem.description || "No description"}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="sr-only">Actions</span>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zM12 13a1 1 0 110-2 1 1 0 010 2zM12 20a1 1 0 110-2 1 1 0 010 2z"
                          />
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleOpenDesignSystem(designSystem.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleDeleteDesignSystem(designSystem.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{designSystem.tokens?.[0]?.count || 0} tokens</span>
                  <span>{designSystem.components?.[0]?.count || 0} components</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Modified {new Date(designSystem.updated_at).toLocaleDateString()}</span>
                </div>
                <Button 
                  className="w-full bg-transparent" 
                  variant="outline"
                  onClick={() => handleOpenDesignSystem(designSystem.id)}
                >
                  Open Project
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <div className="mx-auto max-w-md space-y-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Create your first design system</h3>
              <p className="text-muted-foreground">
                Start building a comprehensive design system with tokens, components, and documentation.
              </p>
            </div>
            <Button 
              size="lg" 
              className="gap-2"
              onClick={handleCreateDesignSystem}
              disabled={isCreating}
            >
              {isCreating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {isCreating ? "Creating..." : "Get Started"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
