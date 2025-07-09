"use client"

import { useState } from "react"
import {
  Square,
  Type,
  ImageIcon,
  MousePointer,
  Layout,
  Grid3X3,
  Minus,
  Tag,
  Search,
  ZoomIn,
  ZoomOut,
  Undo,
  Redo,
  Save,
  Copy,
  Trash2,
  Eye,
  Code,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const componentPalette = [
  {
    category: "Atoms",
    items: [
      { name: "Button", icon: Square, description: "Interactive button element" },
      { name: "Input", icon: Type, description: "Text input field" },
      { name: "Select", icon: MousePointer, description: "Dropdown selection" },
      { name: "Text", icon: Type, description: "Text element" },
      { name: "Image", icon: ImageIcon, description: "Image component" },
      { name: "Tag", icon: Tag, description: "Label or tag" },
    ],
  },
  {
    category: "Molecules",
    items: [
      { name: "Card", icon: Square, description: "Content card container" },
      { name: "Form Field", icon: Layout, description: "Input with label" },
    ],
  },
  {
    category: "Layout",
    items: [
      { name: "Flex Container", icon: Layout, description: "Flexible layout" },
      { name: "Grid Container", icon: Grid3X3, description: "Grid layout" },
      { name: "Divider", icon: Minus, description: "Visual separator" },
    ],
  },
]

export default function ComponentBuilder() {
  const [selectedElement, setSelectedElement] = useState<string | null>("button-1")
  const [zoom, setZoom] = useState(100)

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left Panel - Component Palette */}
      <div className="w-80 border-r bg-muted/30 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold mb-3">Component Palette</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search components..." className="pl-9" />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-6">
          {componentPalette.map((category) => (
            <div key={category.category}>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">{category.category}</h3>
              <div className="space-y-2">
                {category.items.map((item) => (
                  <Card key={item.name} className="cursor-grab hover:bg-accent transition-colors" draggable>
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                          <item.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{item.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center Panel - Visual Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Canvas Toolbar */}
        <div className="h-14 border-b bg-background flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Input value="My Component" className="w-40 h-8 text-sm font-medium" />
            <Separator orientation="vertical" className="h-6" />
            <Button size="sm" variant="ghost">
              <Undo className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost">
              <Redo className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Button size="sm" variant="ghost" onClick={() => setZoom(Math.max(25, zoom - 25))}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-mono w-12 text-center">{zoom}%</span>
              <Button size="sm" variant="ghost" onClick={() => setZoom(Math.min(200, zoom + 25))}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <Button size="sm" variant="ghost">
              <Save className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost">
              <Copy className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-muted/20 p-8 overflow-auto">
          <div
            className="bg-background rounded-lg shadow-sm border min-h-96 relative"
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: "top left",
              backgroundImage: "radial-gradient(circle, #e5e7eb 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          >
            {/* Sample Components on Canvas */}
            <div className="p-8 space-y-4">
              <div
                className={`inline-block p-2 border-2 border-dashed ${
                  selectedElement === "button-1" ? "border-primary" : "border-transparent"
                } hover:border-primary/50 cursor-pointer`}
                onClick={() => setSelectedElement("button-1")}
              >
                <Button>Click me</Button>
              </div>

              <div
                className={`block p-2 border-2 border-dashed ${
                  selectedElement === "input-1" ? "border-primary" : "border-transparent"
                } hover:border-primary/50 cursor-pointer`}
                onClick={() => setSelectedElement("input-1")}
              >
                <Input placeholder="Enter text..." className="w-64" />
              </div>

              <div
                className={`block p-2 border-2 border-dashed ${
                  selectedElement === "card-1" ? "border-primary" : "border-transparent"
                } hover:border-primary/50 cursor-pointer`}
                onClick={() => setSelectedElement("card-1")}
              >
                <Card className="w-80">
                  <CardHeader>
                    <CardTitle>Sample Card</CardTitle>
                    <CardDescription>This is a sample card component</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Card content goes here...</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Toolbar */}
        <div className="h-12 border-t bg-background flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Badge variant="secondary">3 elements</Badge>
            <Badge variant="outline">Auto-save enabled</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost">
              <Code className="h-4 w-4 mr-2" />
              View Code
            </Button>
            <Button size="sm" variant="ghost">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>
      </div>

      {/* Right Panel - Inspector */}
      <div className="w-80 border-l bg-muted/30 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Inspector</h2>
          {selectedElement && (
            <p className="text-sm text-muted-foreground mt-1">
              {selectedElement.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </p>
          )}
        </div>

        <div className="flex-1 overflow-auto">
          {selectedElement && (
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="style">Style</TabsTrigger>
                <TabsTrigger value="props">Props</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label>Element Name</Label>
                  <Input value="Button" />
                </div>

                <div className="space-y-2">
                  <Label>Display</Label>
                  <Select defaultValue="inline-block">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="block">Block</SelectItem>
                      <SelectItem value="inline-block">Inline Block</SelectItem>
                      <SelectItem value="flex">Flex</SelectItem>
                      <SelectItem value="grid">Grid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Width</Label>
                  <div className="flex gap-2">
                    <Input value="auto" className="flex-1" />
                    <Select defaultValue="auto">
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto</SelectItem>
                        <SelectItem value="px">px</SelectItem>
                        <SelectItem value="%">%</SelectItem>
                        <SelectItem value="rem">rem</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Height</Label>
                  <div className="flex gap-2">
                    <Input value="auto" className="flex-1" />
                    <Select defaultValue="auto">
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto</SelectItem>
                        <SelectItem value="px">px</SelectItem>
                        <SelectItem value="%">%</SelectItem>
                        <SelectItem value="rem">rem</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="style" className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label>Background Color</Label>
                  <Select defaultValue="primary">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primary">Primary</SelectItem>
                      <SelectItem value="secondary">Secondary</SelectItem>
                      <SelectItem value="transparent">Transparent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Border Radius</Label>
                  <Select defaultValue="md">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="sm">Small</SelectItem>
                      <SelectItem value="md">Medium</SelectItem>
                      <SelectItem value="lg">Large</SelectItem>
                      <SelectItem value="full">Full</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Padding</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Top</Label>
                      <Input value="8" />
                    </div>
                    <div>
                      <Label className="text-xs">Right</Label>
                      <Input value="16" />
                    </div>
                    <div>
                      <Label className="text-xs">Bottom</Label>
                      <Input value="8" />
                    </div>
                    <div>
                      <Label className="text-xs">Left</Label>
                      <Input value="16" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Box Shadow</Label>
                  <Select defaultValue="sm">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="sm">Small</SelectItem>
                      <SelectItem value="md">Medium</SelectItem>
                      <SelectItem value="lg">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="props" className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label>Text Content</Label>
                  <Input value="Click me" />
                </div>

                <div className="space-y-2">
                  <Label>Variant</Label>
                  <Select defaultValue="default">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="destructive">Destructive</SelectItem>
                      <SelectItem value="outline">Outline</SelectItem>
                      <SelectItem value="secondary">Secondary</SelectItem>
                      <SelectItem value="ghost">Ghost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Size</Label>
                  <Select defaultValue="default">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sm">Small</SelectItem>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="lg">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Disabled</Label>
                  <Select defaultValue="false">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">False</SelectItem>
                      <SelectItem value="true">True</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Component Preview</Label>
                  <Card>
                    <CardContent className="p-4">
                      <Button>Click me</Button>
                    </CardContent>
                  </Card>
                </div>

                <Button className="w-full bg-transparent" variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Open in Preview Page
                </Button>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  )
}
