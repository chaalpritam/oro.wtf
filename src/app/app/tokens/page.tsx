"use client"

import { useState } from "react"
import { Plus, Palette, Type, BracketsIcon as Spacing, CornerUpRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const colorTokens = [
  { name: "Primary", value: "#3b82f6", description: "Main brand color" },
  { name: "Secondary", value: "#64748b", description: "Secondary actions" },
  { name: "Success", value: "#10b981", description: "Success states" },
  { name: "Error", value: "#ef4444", description: "Error states" },
  { name: "Warning", value: "#f59e0b", description: "Warning states" },
  { name: "Info", value: "#06b6d4", description: "Information" },
]

const typographyTokens = [
  { name: "Font Family", value: "Inter, sans-serif" },
  { name: "Base Size", value: "16px" },
  { name: "Scale Ratio", value: "1.25" },
]

const spacingTokens = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96]

export default function DesignTokens() {
  const [selectedColor, setSelectedColor] = useState(colorTokens[0])

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
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Color
                  </Button>
                </div>
                <div className="grid gap-3">
                  {colorTokens.map((color) => (
                    <Card
                      key={color.name}
                      className={`cursor-pointer transition-colors ${
                        selectedColor.name === color.name ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => setSelectedColor(color)}
                    >
                      <CardContent className="flex items-center gap-3 p-4">
                        <div className="h-8 w-8 rounded-md border" style={{ backgroundColor: color.value }} />
                        <div className="flex-1">
                          <div className="font-medium">{color.name}</div>
                          <div className="text-sm text-muted-foreground">{color.description}</div>
                        </div>
                        <div className="text-sm font-mono text-muted-foreground">{color.value}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Edit Color</h3>
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedColor.name}</CardTitle>
                    <CardDescription>{selectedColor.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="color-name">Name</Label>
                      <Input id="color-name" value={selectedColor.name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="color-value">Color Value</Label>
                      <div className="flex gap-2">
                        <Input id="color-value" value={selectedColor.value} className="flex-1" />
                        <input
                          type="color"
                          value={selectedColor.value}
                          className="h-10 w-16 rounded-md border border-input"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Preview</Label>
                      <div className="flex gap-2">
                        <Button style={{ backgroundColor: selectedColor.value }}>Button</Button>
                        <Card className="flex-1">
                          <CardContent className="p-4">
                            <div className="h-4 w-full rounded" style={{ backgroundColor: selectedColor.value }} />
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="typography" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Typography Scale</h3>
                <div className="space-y-4">
                  {["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl"].map((size) => (
                    <Card key={size}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className={`text-${size} font-medium`}>The quick brown fox jumps</div>
                          <div className="text-sm text-muted-foreground font-mono">{size}</div>
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
                <h3 className="text-lg font-semibold">Spacing Scale</h3>
                <div className="space-y-3">
                  {spacingTokens.map((space, index) => (
                    <Card key={space}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="text-sm font-mono w-12">{index + 1}</div>
                          <div className="bg-primary h-4 rounded" style={{ width: `${space}px` }} />
                          <div className="text-sm text-muted-foreground font-mono">{space}px</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Spacing Preview</h3>
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="border-2 border-dashed border-muted-foreground/25 p-4">
                      <div className="bg-primary/10 p-4 rounded">
                        <div className="bg-primary/20 p-4 rounded">
                          <div className="bg-primary/30 p-4 rounded text-center text-sm">Nested spacing example</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="radius" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Border Radius</h3>
                <div className="grid gap-3">
                  {[
                    { name: "None", value: "0px" },
                    { name: "Small", value: "4px" },
                    { name: "Medium", value: "8px" },
                    { name: "Large", value: "12px" },
                    { name: "Extra Large", value: "16px" },
                    { name: "Full", value: "9999px" },
                  ].map((radius) => (
                    <Card key={radius.name}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 bg-primary" style={{ borderRadius: radius.value }} />
                          <div className="flex-1">
                            <div className="font-medium">{radius.name}</div>
                            <div className="text-sm text-muted-foreground font-mono">{radius.value}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Radius Preview</h3>
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Button className="rounded-none">None</Button>
                      <Button className="rounded-sm">Small</Button>
                      <Button className="rounded-md">Medium</Button>
                      <Button className="rounded-lg">Large</Button>
                      <Button className="rounded-xl">Extra Large</Button>
                      <Button className="rounded-full">Full</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="shadows" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Shadow Tokens</h3>
                <div className="space-y-3">
                  {[
                    { name: "Small", value: "0 1px 2px 0 rgb(0 0 0 / 0.05)" },
                    { name: "Medium", value: "0 4px 6px -1px rgb(0 0 0 / 0.1)" },
                    { name: "Large", value: "0 10px 15px -3px rgb(0 0 0 / 0.1)" },
                    { name: "Extra Large", value: "0 20px 25px -5px rgb(0 0 0 / 0.1)" },
                  ].map((shadow) => (
                    <Card key={shadow.name}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div
                            className="h-12 w-12 bg-background border rounded-lg"
                            style={{ boxShadow: shadow.value }}
                          />
                          <div className="flex-1">
                            <div className="font-medium">{shadow.name}</div>
                            <div className="text-xs text-muted-foreground font-mono">{shadow.value}</div>
                          </div>
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
                    <div className="grid grid-cols-2 gap-6">
                      <div className="h-20 bg-background border rounded-lg shadow-sm flex items-center justify-center text-sm">
                        Small
                      </div>
                      <div className="h-20 bg-background border rounded-lg shadow-md flex items-center justify-center text-sm">
                        Medium
                      </div>
                      <div className="h-20 bg-background border rounded-lg shadow-lg flex items-center justify-center text-sm">
                        Large
                      </div>
                      <div className="h-20 bg-background border rounded-lg shadow-xl flex items-center justify-center text-sm">
                        Extra Large
                      </div>
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
