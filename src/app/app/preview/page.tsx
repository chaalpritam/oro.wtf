"use client"

import { useState } from "react"
import { Monitor, Tablet, Smartphone, Sun, Moon, Play, Pause, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

export default function LivePreview() {
  const [viewport, setViewport] = useState("desktop")
  const [previewTheme, setPreviewTheme] = useState("light")
  const [componentState, setComponentState] = useState("default")
  const [isAnimating, setIsAnimating] = useState(false)

  const viewportSizes = {
    desktop: { width: "100%", height: "100%" },
    tablet: { width: "768px", height: "1024px" },
    mobile: { width: "375px", height: "667px" },
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left Panel - Controls */}
      <div className="w-80 border-r bg-muted/30 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold mb-3">Live Preview</h2>
          <Select defaultValue="button-component">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="button-component">Button Component</SelectItem>
              <SelectItem value="card-component">Card Component</SelectItem>
              <SelectItem value="form-component">Form Component</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-6">
          {/* Viewport Controls */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Viewport</Label>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant={viewport === "desktop" ? "default" : "outline"}
                onClick={() => setViewport("desktop")}
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={viewport === "tablet" ? "default" : "outline"}
                onClick={() => setViewport("tablet")}
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={viewport === "mobile" ? "default" : "outline"}
                onClick={() => setViewport("mobile")}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Theme Controls */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Theme</Label>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant={previewTheme === "light" ? "default" : "outline"}
                onClick={() => setPreviewTheme("light")}
              >
                <Sun className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={previewTheme === "dark" ? "default" : "outline"}
                onClick={() => setPreviewTheme("dark")}
              >
                <Moon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Component States */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Component State</Label>
            <Tabs value={componentState} onValueChange={setComponentState}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="default">Default</TabsTrigger>
                <TabsTrigger value="hover">Hover</TabsTrigger>
              </TabsList>
              <TabsList className="grid w-full grid-cols-2 mt-2">
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="disabled">Disabled</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Component Props */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Component Props</Label>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-xs">Text Content</Label>
                <Input defaultValue="Click me" />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Variant</Label>
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
                <Label className="text-xs">Size</Label>
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

              <div className="flex items-center justify-between">
                <Label className="text-xs">Loading State</Label>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-xs">Full Width</Label>
                <Switch />
              </div>
            </div>
          </div>

          {/* Animation Controls */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Animations</Label>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsAnimating(!isAnimating)}>
                {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button size="sm" variant="outline">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Preview Area */}
      <div className="flex-1 flex flex-col">
        {/* Preview Toolbar */}
        <div className="h-14 border-b bg-background flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Button Component</span>
            <div className="text-sm text-muted-foreground">
              {viewport === "desktop" ? "Desktop" : viewport === "tablet" ? "Tablet (768px)" : "Mobile (375px)"}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              Export Code
            </Button>
            <Button size="sm">Save to Library</Button>
          </div>
        </div>

        {/* Preview Canvas */}
        <div className="flex-1 bg-muted/20 p-8 overflow-auto flex items-center justify-center">
          <div
            className={`bg-background rounded-lg shadow-sm border transition-all duration-300 ${
              previewTheme === "dark" ? "dark" : ""
            }`}
            style={{
              width: viewportSizes[viewport as keyof typeof viewportSizes].width,
              height: viewportSizes[viewport as keyof typeof viewportSizes].height,
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          >
            <div className="p-8 h-full flex items-center justify-center">
              <div className="space-y-8">
                {/* Component Preview */}
                <div className="text-center space-y-4">
                  <h3 className="text-lg font-semibold">Component Preview</h3>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Button
                      className={componentState === "hover" ? "hover:bg-primary/90" : ""}
                      disabled={componentState === "disabled"}
                      variant={componentState === "active" ? "secondary" : "default"}
                    >
                      Click me
                    </Button>
                    <Button variant="destructive">Delete</Button>
                    <Button variant="outline">Cancel</Button>
                    <Button variant="ghost">Ghost</Button>
                  </div>
                </div>

                {/* Size Variations */}
                <div className="text-center space-y-4">
                  <h4 className="font-medium">Size Variations</h4>
                  <div className="flex flex-wrap gap-4 justify-center items-center">
                    <Button size="sm">Small</Button>
                    <Button>Default</Button>
                    <Button size="lg">Large</Button>
                  </div>
                </div>

                {/* Context Examples */}
                <div className="space-y-4">
                  <h4 className="font-medium text-center">In Context</h4>
                  <Card className="w-full max-w-md mx-auto">
                    <CardHeader>
                      <CardTitle>Sample Form</CardTitle>
                      <CardDescription>Example of button in a form context</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input placeholder="Enter your email" />
                      </div>
                      <div className="space-y-2">
                        <Label>Password</Label>
                        <Input type="password" placeholder="Enter password" />
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1">Sign In</Button>
                        <Button variant="outline">Cancel</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Stats */}
        <div className="h-12 border-t bg-background flex items-center justify-between px-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Rendered in 23ms</span>
            <span>•</span>
            <span>3 components</span>
            <span>•</span>
            <span>Last updated 2 min ago</span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost">
              View Code
            </Button>
            <Button size="sm" variant="ghost">
              Copy JSX
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
