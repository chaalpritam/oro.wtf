"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Plus, Palette, Type, BracketsIcon as Spacing, CornerUpRight, Zap, Loader2, Save, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDesignSystem } from "@/hooks/use-design-systems"
import { useTokens } from "@/hooks/use-design-systems"
import { toast } from "sonner"
import { Token } from "@/lib/db"

const defaultColorTokens = [
  { name: "Primary", value: "#3b82f6", description: "Main brand color" },
  { name: "Secondary", value: "#64748b", description: "Secondary actions" },
  { name: "Success", value: "#10b981", description: "Success states" },
  { name: "Error", value: "#ef4444", description: "Error states" },
  { name: "Warning", value: "#f59e0b", description: "Warning states" },
  { name: "Info", value: "#06b6d4", description: "Information" },
]

const defaultTypographyTokens = [
  { name: "Font Family", value: "Inter, sans-serif" },
  { name: "Base Size", value: "16px" },
  { name: "Scale Ratio", value: "1.25" },
]

const defaultSpacingTokens = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96]

export default function DesignTokens() {
  const searchParams = useSearchParams()
  const designSystemId = searchParams.get("designSystemId")
  
  const { designSystem, loading: designSystemLoading } = useDesignSystem(designSystemId || "")
  const { tokens, loading: tokensLoading, createToken, updateToken, deleteToken } = useTokens(designSystemId || "")
  
  const [selectedToken, setSelectedToken] = useState<Token | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Group tokens by type
  const colorTokens = tokens.filter(token => token.type === 'color')
  const typographyTokens = tokens.filter(token => token.type === 'typography')
  const spacingTokens = tokens.filter(token => token.type === 'spacing')
  const borderRadiusTokens = tokens.filter(token => token.type === 'borderRadius')
  const shadowTokens = tokens.filter(token => token.type === 'shadow')

  const handleCreateToken = async (type: Token['type'], tokenData: Partial<Token>) => {
    if (!designSystemId) return

    try {
      setIsCreating(true)
      await createToken({
        name: tokenData.name || `New ${type}`,
        value: tokenData.value || getDefaultValue(type),
        type,
        description: tokenData.description,
        design_system_id: designSystemId,
      })
      toast.success(`${type} token created successfully!`)
    } catch (error) {
      toast.error(`Failed to create ${type} token`)
      console.error("Error creating token:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleUpdateToken = async (id: string, updates: Partial<Token>) => {
    try {
      setIsSaving(true)
      await updateToken(id, updates)
      toast.success("Token updated successfully!")
    } catch (error) {
      toast.error("Failed to update token")
      console.error("Error updating token:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteToken = async (id: string) => {
    try {
      await deleteToken(id)
      toast.success("Token deleted successfully!")
      if (selectedToken?.id === id) {
        setSelectedToken(null)
      }
    } catch (error) {
      toast.error("Failed to delete token")
      console.error("Error deleting token:", error)
    }
  }

  const getDefaultValue = (type: Token['type']): string => {
    switch (type) {
      case 'color':
        return '#3b82f6'
      case 'typography':
        return '16px'
      case 'spacing':
        return '16'
      case 'borderRadius':
        return '8'
      case 'shadow':
        return '0 4px 6px -1px rgb(0 0 0 / 0.1)'
      default:
        return ''
    }
  }

  const initializeDefaultTokens = async () => {
    if (!designSystemId || tokens.length > 0) return

    try {
      setIsCreating(true)
      
      // Create default color tokens
      for (const token of defaultColorTokens) {
        await createToken({
          name: token.name,
          value: token.value,
          type: 'color',
          description: token.description,
          design_system_id: designSystemId,
        })
      }

      // Create default typography tokens
      for (const token of defaultTypographyTokens) {
        await createToken({
          name: token.name,
          value: token.value,
          type: 'typography',
          description: `Typography ${token.name.toLowerCase()}`,
          design_system_id: designSystemId,
        })
      }

      // Create default spacing tokens
      for (const spacing of defaultSpacingTokens) {
        await createToken({
          name: `Spacing ${spacing}`,
          value: spacing.toString(),
          type: 'spacing',
          description: `${spacing}px spacing`,
          design_system_id: designSystemId,
        })
      }

      toast.success("Default tokens initialized!")
    } catch (error) {
      toast.error("Failed to initialize default tokens")
      console.error("Error initializing tokens:", error)
    } finally {
      setIsCreating(false)
    }
  }

  useEffect(() => {
    if (designSystemId && tokens.length === 0 && !tokensLoading) {
      initializeDefaultTokens()
    }
  }, [designSystemId, tokens.length, tokensLoading])

  if (designSystemLoading || tokensLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading design tokens...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Design Tokens</h1>
          <p className="text-muted-foreground">Define the visual foundation of your design system</p>
        </div>

        <Tabs defaultValue="colors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="colors" className="gap-2">
              <Palette className="h-4 w-4" />
              Colors
            </TabsTrigger>
            <TabsTrigger value="typography" className="gap-2">
              <Type className="h-4 w-4" />
              Typography
            </TabsTrigger>
            <TabsTrigger value="spacing" className="gap-2">
              <Spacing className="h-4 w-4" />
              Spacing
            </TabsTrigger>
            <TabsTrigger value="radius" className="gap-2">
              <CornerUpRight className="h-4 w-4" />
              Radius
            </TabsTrigger>
            <TabsTrigger value="shadows" className="gap-2">
              <Zap className="h-4 w-4" />
              Shadows
            </TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Color Tokens</h3>
                  <Button 
                    size="sm" 
                    className="gap-2"
                    onClick={() => handleCreateToken('color', {})}
                    disabled={isCreating}
                  >
                    {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    Add Color
                  </Button>
                </div>
                <div className="grid gap-3">
                  {colorTokens.map((token) => (
                    <Card
                      key={token.id}
                      className={`cursor-pointer transition-colors ${
                        selectedToken?.id === token.id ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => setSelectedToken(token)}
                    >
                      <CardContent className="flex items-center gap-3 p-4">
                        <div className="h-8 w-8 rounded-md border" style={{ backgroundColor: token.value }} />
                        <div className="flex-1">
                          <div className="font-medium">{token.name}</div>
                          <div className="text-sm text-muted-foreground">{token.description}</div>
                        </div>
                        <div className="text-sm font-mono text-muted-foreground">{token.value}</div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteToken(token.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Edit Color</h3>
                {selectedToken && selectedToken.type === 'color' ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>{selectedToken.name}</CardTitle>
                      <CardDescription>{selectedToken.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="token-name">Name</Label>
                        <Input 
                          id="token-name" 
                          value={selectedToken.name}
                          onChange={(e) => setSelectedToken({ ...selectedToken, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="token-value">Color Value</Label>
                        <div className="flex gap-2">
                          <Input 
                            id="token-value" 
                            value={selectedToken.value} 
                            className="flex-1"
                            onChange={(e) => setSelectedToken({ ...selectedToken, value: e.target.value })}
                          />
                          <input
                            type="color"
                            value={selectedToken.value}
                            onChange={(e) => setSelectedToken({ ...selectedToken, value: e.target.value })}
                            className="h-10 w-16 rounded-md border border-input"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Input 
                          value={selectedToken.description || ''}
                          onChange={(e) => setSelectedToken({ ...selectedToken, description: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Preview</Label>
                        <div className="flex gap-2">
                          <Button style={{ backgroundColor: selectedToken.value }}>Button</Button>
                          <Card className="flex-1">
                            <CardContent className="p-4">
                              <div className="h-4 w-full rounded" style={{ backgroundColor: selectedToken.value }} />
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                      <Button 
                        className="w-full"
                        onClick={() => handleUpdateToken(selectedToken.id, selectedToken)}
                        disabled={isSaving}
                      >
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save Changes
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center text-muted-foreground">
                      Select a color token to edit
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="typography" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Typography Tokens</h3>
                  <Button 
                    size="sm" 
                    className="gap-2"
                    onClick={() => handleCreateToken('typography', {})}
                    disabled={isCreating}
                  >
                    {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    Add Typography
                  </Button>
                </div>
                <div className="space-y-4">
                  {typographyTokens.map((token) => (
                    <Card key={token.id} className="cursor-pointer" onClick={() => setSelectedToken(token)}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className={`text-${token.name.toLowerCase().includes('font') ? 'base' : 'sm'} font-medium`}>
                            {token.name}: {token.value}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteToken(token.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Typography Settings</h3>
                <Card>
                  <CardContent className="space-y-4 p-6">
                    <div className="space-y-2">
                      <Label>Font Family</Label>
                      <Select defaultValue="inter">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inter">Inter</SelectItem>
                          <SelectItem value="roboto">Roboto</SelectItem>
                          <SelectItem value="system">System UI</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Base Font Size</Label>
                      <div className="flex items-center gap-2">
                        <Slider defaultValue={[16]} max={24} min={12} step={1} className="flex-1" />
                        <span className="text-sm font-mono w-12">16px</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Scale Ratio</Label>
                      <div className="flex items-center gap-2">
                        <Slider defaultValue={[1.25]} max={2} min={1} step={0.05} className="flex-1" />
                        <span className="text-sm font-mono w-12">1.25</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="spacing" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Spacing Scale</h3>
                  <Button 
                    size="sm" 
                    className="gap-2"
                    onClick={() => handleCreateToken('spacing', {})}
                    disabled={isCreating}
                  >
                    {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    Add Spacing
                  </Button>
                </div>
                <div className="space-y-3">
                  {spacingTokens.map((token) => (
                    <Card key={token.id} className="cursor-pointer" onClick={() => setSelectedToken(token)}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="font-medium">{token.name}</div>
                            <div className="text-sm text-muted-foreground">{token.value}px</div>
                          </div>
                          <div 
                            className="h-4 bg-primary rounded" 
                            style={{ width: `${token.value}px` }}
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteToken(token.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Spacing Preview</h3>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {spacingTokens.slice(0, 5).map((token) => (
                        <div key={token.id} className="flex items-center gap-4">
                          <span className="text-sm font-mono w-12">{token.value}px</span>
                          <div 
                            className="h-4 bg-muted rounded" 
                            style={{ width: `${token.value}px` }}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="radius" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Border Radius</h3>
                  <Button 
                    size="sm" 
                    className="gap-2"
                    onClick={() => handleCreateToken('borderRadius', {})}
                    disabled={isCreating}
                  >
                    {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    Add Radius
                  </Button>
                </div>
                <div className="space-y-3">
                  {borderRadiusTokens.map((token) => (
                    <Card key={token.id} className="cursor-pointer" onClick={() => setSelectedToken(token)}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="font-medium">{token.name}</div>
                            <div className="text-sm text-muted-foreground">{token.value}px</div>
                          </div>
                          <div 
                            className="h-8 w-8 bg-primary rounded" 
                            style={{ borderRadius: `${token.value}px` }}
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteToken(token.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Radius Preview</h3>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {borderRadiusTokens.slice(0, 4).map((token) => (
                        <div key={token.id} className="flex items-center gap-4">
                          <span className="text-sm font-mono w-12">{token.value}px</span>
                          <div 
                            className="h-8 w-8 bg-primary" 
                            style={{ borderRadius: `${token.value}px` }}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="shadows" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Shadows</h3>
                  <Button 
                    size="sm" 
                    className="gap-2"
                    onClick={() => handleCreateToken('shadow', {})}
                    disabled={isCreating}
                  >
                    {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    Add Shadow
                  </Button>
                </div>
                <div className="space-y-3">
                  {shadowTokens.map((token) => (
                    <Card key={token.id} className="cursor-pointer" onClick={() => setSelectedToken(token)}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="font-medium">{token.name}</div>
                            <div className="text-sm text-muted-foreground font-mono">{token.value}</div>
                          </div>
                          <div 
                            className="h-8 w-8 bg-background border rounded" 
                            style={{ boxShadow: token.value }}
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteToken(token.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Shadow Preview</h3>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {shadowTokens.slice(0, 4).map((token) => (
                        <div key={token.id} className="flex items-center gap-4">
                          <span className="text-sm font-mono w-12">{token.name}</span>
                          <div 
                            className="h-8 w-8 bg-background border rounded" 
                            style={{ boxShadow: token.value }}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
