"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Plus, Edit, Trash2, Copy, Loader2, AlertCircle, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useDesignSystem } from "@/hooks/use-design-systems"
import { useTokens } from "@/hooks/use-design-systems"
import { useDataMode } from "@/lib/data-mode"
import { toast } from "sonner"
import { Token } from "@/lib/db"
import { Badge } from "@/components/ui/badge"

interface TokenFormData {
  name: string
  value: string
  type: 'color' | 'typography' | 'spacing' | 'borderRadius' | 'shadow'
  description: string
}

const defaultTokens = [
  { name: "Primary", value: "#3b82f6", type: "color" as const, description: "Main brand color" },
  { name: "Secondary", value: "#64748b", type: "color" as const, description: "Secondary actions" },
  { name: "Success", value: "#10b981", type: "color" as const, description: "Success states" },
  { name: "Error", value: "#ef4444", type: "color" as const, description: "Error states" },
  { name: "Font Family", value: "Inter, sans-serif", type: "typography" as const, description: "Typography font family" },
  { name: "Base Size", value: "16px", type: "typography" as const, description: "Base font size" },
  { name: "Spacing 4", value: "4", type: "spacing" as const, description: "4px spacing" },
  { name: "Spacing 8", value: "8", type: "spacing" as const, description: "8px spacing" },
  { name: "Spacing 16", value: "16", type: "spacing" as const, description: "16px spacing" },
  { name: "Border Radius Small", value: "4", type: "borderRadius" as const, description: "Small border radius" },
  { name: "Border Radius Medium", value: "8", type: "borderRadius" as const, description: "Medium border radius" },
  { name: "Shadow Small", value: "0 1px 2px 0 rgb(0 0 0 / 0.05)", type: "shadow" as const, description: "Small shadow" },
  { name: "Shadow Medium", value: "0 4px 6px -1px rgb(0 0 0 / 0.1)", type: "shadow" as const, description: "Medium shadow" },
]

export default function TokensPage() {
  const searchParams = useSearchParams()
  const designSystemId = searchParams.get("designSystemId")
  const { dataMode, isDatabaseAvailable } = useDataMode()
  
  const { designSystem, loading: designSystemLoading } = useDesignSystem(designSystemId || "")
  const { tokens, loading: tokensLoading, createToken, updateToken, deleteToken } = useTokens(designSystemId || "")
  
  const [isCreating, setIsCreating] = useState(false)
  const [editingToken, setEditingToken] = useState<string | null>(null)
  const [formData, setFormData] = useState<TokenFormData>({
    name: "",
    value: "",
    type: "color",
    description: "",
  })

  // Initialize with default tokens if none exist
  useEffect(() => {
    if (tokens.length === 0 && !tokensLoading && designSystemId) {
      const initializeDefaultTokens = async () => {
        try {
          for (const token of defaultTokens) {
            await createToken({
              ...token,
              design_system_id: designSystemId,
            })
          }
          toast.success("Default tokens initialized!")
        } catch (error) {
          console.error("Error initializing default tokens:", error)
        }
      }
      initializeDefaultTokens()
    }
  }, [tokens.length, tokensLoading, designSystemId, createToken])

  const handleCreateToken = async () => {
    if (!designSystemId) return

    try {
      setIsCreating(true)
      await createToken({
        ...formData,
        design_system_id: designSystemId,
      })
      setFormData({ name: "", value: "", type: "color", description: "" })
      toast.success("Token created successfully!")
    } catch (error) {
      toast.error("Failed to create token")
      console.error("Error creating token:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleUpdateToken = async (id: string) => {
    try {
      await updateToken(id, formData)
      setEditingToken(null)
      setFormData({ name: "", value: "", type: "color", description: "" })
      toast.success("Token updated successfully!")
    } catch (error) {
      toast.error("Failed to update token")
      console.error("Error updating token:", error)
    }
  }

  const handleDeleteToken = async (id: string) => {
    try {
      await deleteToken(id)
      toast.success("Token deleted successfully!")
    } catch (error) {
      toast.error("Failed to delete token")
      console.error("Error deleting token:", error)
    }
  }

  const handleEditToken = (token: Token) => {
    setEditingToken(token.id)
    setFormData({
      name: token.name,
      value: token.value,
      type: token.type,
      description: token.description || "",
    })
  }

  const getTokenPreview = (token: Token) => {
    switch (token.type) {
      case "color":
        return (
          <div className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded border" 
              style={{ backgroundColor: token.value }}
            />
            <span className="text-sm font-mono">{token.value}</span>
          </div>
        )
      case "typography":
        return <span className="text-sm font-mono">{token.value}</span>
      case "spacing":
        return <span className="text-sm font-mono">{token.value}px</span>
      case "borderRadius":
        return <span className="text-sm font-mono">{token.value}px</span>
      case "shadow":
        return <span className="text-sm font-mono truncate">{token.value}</span>
      default:
        return <span className="text-sm">{token.value}</span>
    }
  }

  if (designSystemLoading || tokensLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading tokens...</span>
        </div>
      </div>
    )
  }

  if (!designSystemId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">No design system selected</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-8 p-8">
      {/* Database Error Alert */}
      {dataMode === 'database' && !isDatabaseAvailable && (
        <Alert className="border-destructive bg-destructive/10">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Database is not properly configured. Changes will be saved to mock data only.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Design Tokens</h1>
          <p className="text-muted-foreground">
            Manage design tokens for {designSystem?.name || "Design System"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Using {dataMode === 'database' ? 'Database' : 'Mock'} data
          </p>
        </div>
        <Button 
          size="lg" 
          className="gap-2" 
          onClick={() => setEditingToken("new")}
        >
          <Plus className="h-4 w-4" />
          Add Token
        </Button>
      </div>

      {/* Token Creation/Edit Form */}
      {editingToken && (
        <Card>
          <CardHeader>
            <CardTitle>{editingToken === "new" ? "Create New Token" : "Edit Token"}</CardTitle>
            <CardDescription>
              Define a new design token with its properties and value.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="token-name">Name</Label>
                <Input
                  id="token-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Primary Color"
                />
              </div>
              <div>
                <Label htmlFor="token-type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="color">Color</SelectItem>
                    <SelectItem value="typography">Typography</SelectItem>
                    <SelectItem value="spacing">Spacing</SelectItem>
                    <SelectItem value="borderRadius">Border Radius</SelectItem>
                    <SelectItem value="shadow">Shadow</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="token-value">Value</Label>
              <Input
                id="token-value"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder={formData.type === "color" ? "#3b82f6" : "Enter value..."}
              />
            </div>
            
            <div>
              <Label htmlFor="token-description">Description</Label>
              <Textarea
                id="token-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what this token is used for..."
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={editingToken === "new" ? handleCreateToken : () => handleUpdateToken(editingToken)}
                disabled={isCreating || !formData.name || !formData.value}
              >
                {isCreating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  editingToken === "new" ? "Create Token" : "Update Token"
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setEditingToken(null)
                  setFormData({ name: "", value: "", type: "color", description: "" })
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tokens Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tokens.map((token) => (
          <Card key={token.id} className="group relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{token.name}</CardTitle>
                  <CardDescription>{token.description || "No description"}</CardDescription>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditToken(token)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(token.value)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteToken(token.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{token.type}</Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(token.updated_at).toLocaleDateString()}
                </span>
              </div>
              <div className="p-3 bg-muted rounded-md">
                {getTokenPreview(token)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {tokens.length === 0 && !editingToken && (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <div className="mx-auto max-w-md space-y-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">No tokens yet</h3>
              <p className="text-muted-foreground">
                Create your first design token to get started.
              </p>
            </div>
            <Button 
              size="lg" 
              className="gap-2"
              onClick={() => setEditingToken("new")}
            >
              <Plus className="h-4 w-4" />
              Create First Token
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
