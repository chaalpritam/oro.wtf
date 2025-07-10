"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
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
  Loader2,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useDesignSystem } from "@/hooks/use-design-systems"
import { useComponents } from "@/hooks/use-design-systems"
import { useDataMode } from "@/lib/data-mode"
import { toast } from "sonner"

interface CanvasElement {
  id: string
  type: string
  props: Record<string, any>
  position: { x: number; y: number }
  size: { width: number; height: number }
}

const componentPalette = [
  {
    category: "Atoms",
    items: [
      { name: "Button", icon: Square, description: "Interactive button element", type: "button" },
      { name: "Input", icon: Type, description: "Text input field", type: "input" },
      { name: "Select", icon: MousePointer, description: "Dropdown selection", type: "select" },
      { name: "Text", icon: Type, description: "Text element", type: "text" },
      { name: "Image", icon: ImageIcon, description: "Image component", type: "image" },
      { name: "Tag", icon: Tag, description: "Label or tag", type: "tag" },
    ],
  },
  {
    category: "Molecules",
    items: [
      { name: "Card", icon: Square, description: "Content card container", type: "card" },
      { name: "Form Field", icon: Layout, description: "Input with label", type: "form-field" },
    ],
  },
  {
    category: "Layout",
    items: [
      { name: "Flex Container", icon: Layout, description: "Flexible layout", type: "flex-container" },
      { name: "Grid Container", icon: Grid3X3, description: "Grid layout", type: "grid-container" },
      { name: "Divider", icon: Minus, description: "Visual separator", type: "divider" },
    ],
  },
]

export default function ComponentBuilder() {
  const searchParams = useSearchParams()
  const designSystemId = searchParams.get("designSystemId")
  const { dataMode, isDatabaseAvailable } = useDataMode()
  
  const { designSystem, loading: designSystemLoading } = useDesignSystem(designSystemId || "")
  const { components, createComponent, updateComponent, deleteComponent } = useComponents(designSystemId || "")
  
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [zoom, setZoom] = useState(100)
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([])
  const [history, setHistory] = useState<CanvasElement[][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isSaving, setIsSaving] = useState(false)

  // Initialize canvas with existing components
  useEffect(() => {
    if (components.length > 0) {
      const elements = components.map((component, index) => ({
        id: component.id,
        type: component.type,
        props: component.props,
        position: { x: 50 + index * 20, y: 50 + index * 20 },
        size: { width: 200, height: 100 },
      }))
      setCanvasElements(elements)
      setHistory([elements])
      setHistoryIndex(0)
    }
  }, [components])

  const addToHistory = useCallback((elements: CanvasElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(elements)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [history, historyIndex])

  const handleDragStart = (e: React.DragEvent, componentType: string) => {
    e.dataTransfer.setData("componentType", componentType)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const componentType = e.dataTransfer.getData("componentType")
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / (zoom / 100)
    const y = (e.clientY - rect.top) / (zoom / 100)

    const newElement: CanvasElement = {
      id: `element-${Date.now()}`,
      type: componentType,
      props: getDefaultProps(componentType),
      position: { x, y },
      size: { width: 200, height: 100 },
    }

    const newElements = [...canvasElements, newElement]
    setCanvasElements(newElements)
    addToHistory(newElements)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const getDefaultProps = (type: string): Record<string, any> => {
    switch (type) {
      case "button":
        return { text: "Button", variant: "default", size: "default" }
      case "input":
        return { placeholder: "Enter text...", type: "text" }
      case "text":
        return { content: "Text content", variant: "default" }
      case "card":
        return { title: "Card Title", content: "Card content" }
      default:
        return {}
    }
  }

  const handleElementClick = (elementId: string) => {
    setSelectedElement(elementId)
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setCanvasElements(history[historyIndex - 1])
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setCanvasElements(history[historyIndex + 1])
    }
  }

  const handleSave = async () => {
    if (!designSystemId) return

    try {
      setIsSaving(true)
      
      // Save each canvas element as a component
      for (const element of canvasElements) {
        const existingComponent = components.find(c => c.id === element.id)
        
        if (existingComponent) {
          await updateComponent(element.id, {
            type: element.type,
            props: element.props,
            code: generateComponentCode(element),
          })
        } else {
          await createComponent({
            name: `${element.type}-${Date.now()}`,
            type: element.type,
            props: element.props,
            code: generateComponentCode(element),
            design_system_id: designSystemId,
          })
        }
      }

      toast.success("Canvas saved successfully!")
    } catch (error) {
      toast.error("Failed to save canvas")
      console.error("Error saving canvas:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const generateComponentCode = (element: CanvasElement): string => {
    switch (element.type) {
      case "button":
        return `<Button variant="${element.props.variant}" size="${element.props.size}">${element.props.text}</Button>`
      case "input":
        return `<Input placeholder="${element.props.placeholder}" type="${element.props.type}" />`
      case "text":
        return `<p className="text-${element.props.variant}">${element.props.content}</p>`
      case "card":
        return `<Card><CardHeader><CardTitle>${element.props.title}</CardTitle></CardHeader><CardContent>${element.props.content}</CardContent></Card>`
      default:
        return `<div>${element.type} component</div>`
    }
  }

  const renderElement = (element: CanvasElement) => {
    const style = {
      position: 'absolute' as const,
      left: element.position.x,
      top: element.position.y,
      width: element.size.width,
      height: element.size.height,
      border: selectedElement === element.id ? '2px solid #3b82f6' : '2px dashed transparent',
      cursor: 'pointer',
    }

    return (
      <div
        key={element.id}
        style={style}
        onClick={() => handleElementClick(element.id)}
        className="hover:border-blue-300 transition-colors"
      >
        {renderComponentByType(element)}
      </div>
    )
  }

  const renderComponentByType = (element: CanvasElement) => {
    switch (element.type) {
      case "button":
        return <Button variant={element.props.variant} size={element.props.size}>{element.props.text}</Button>
      case "input":
        return <Input placeholder={element.props.placeholder} type={element.props.type} />
      case "text":
        return <p className={`text-${element.props.variant}`}>{element.props.content}</p>
      case "card":
        return (
          <Card>
            <CardHeader>
              <CardTitle>{element.props.title}</CardTitle>
            </CardHeader>
            <CardContent>{element.props.content}</CardContent>
          </Card>
        )
      default:
        return <div className="p-4 border rounded bg-muted">{element.type}</div>
    }
  }

  if (designSystemLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading design system...</span>
        </div>
      </div>
    )
  }

  if (!designSystemId) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">No design system selected</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

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
                  <Card 
                    key={item.name} 
                    className="cursor-grab hover:bg-accent transition-colors" 
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.type)}
                  >
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
            <Input 
              value={designSystem?.name || "Untitled"} 
              className="w-40 h-8 text-sm font-medium" 
            />
            <Separator orientation="vertical" className="h-6" />
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={handleUndo}
              disabled={historyIndex <= 0}
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
            >
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
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
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
              minHeight: "600px",
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {canvasElements.map(renderElement)}
          </div>
        </div>

        {/* Bottom Toolbar */}
        <div className="h-12 border-t bg-background flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Badge variant="secondary">{canvasElements.length} elements</Badge>
            <Badge variant="outline">Auto-save enabled</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost">
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button size="sm" variant="ghost">
              <Code className="h-4 w-4" />
              Code
            </Button>
          </div>
        </div>
      </div>

      {/* Right Panel - Properties */}
      {selectedElement && (
        <div className="w-80 border-l bg-muted/30 flex flex-col">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Properties</h2>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <Tabs defaultValue="properties" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="properties">Properties</TabsTrigger>
                <TabsTrigger value="styles">Styles</TabsTrigger>
              </TabsList>
              
              <TabsContent value="properties" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label>Type</Label>
                    <Input value={selectedElement} disabled />
                  </div>
                  <div>
                    <Label>Position X</Label>
                    <Input type="number" defaultValue="0" />
                  </div>
                  <div>
                    <Label>Position Y</Label>
                    <Input type="number" defaultValue="0" />
                  </div>
                  <div>
                    <Label>Width</Label>
                    <Input type="number" defaultValue="200" />
                  </div>
                  <div>
                    <Label>Height</Label>
                    <Input type="number" defaultValue="100" />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="styles" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label>Background Color</Label>
                    <Input type="color" defaultValue="#ffffff" />
                  </div>
                  <div>
                    <Label>Border Radius</Label>
                    <Select defaultValue="0">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">None</SelectItem>
                        <SelectItem value="4">Small</SelectItem>
                        <SelectItem value="8">Medium</SelectItem>
                        <SelectItem value="12">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  )
}
