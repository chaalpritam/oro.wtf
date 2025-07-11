"use client"

import { useState } from "react"
import { Download, Copy, ExternalLink, FileCode, Palette, Zap, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const designTokensJSON = `{
  "colors": {
    "primary": "#3b82f6",
    "secondary": "#64748b",
    "success": "#10b981",
    "error": "#ef4444",
    "warning": "#f59e0b",
    "info": "#06b6d4"
  },
  "typography": {
    "fontFamily": "Inter, sans-serif",
    "fontSize": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem"
    }
  },
  "spacing": [4, 8, 12, 16, 20, 24, 32, 40, 48, 64],
  "borderRadius": {
    "sm": "0.25rem",
    "md": "0.375rem",  [4, 8, 12, 16, 20, 24, 32, 40, 48, 64],
  "borderRadius": {
    "sm": "0.25rem",
    "md": "0.375rem",
    "lg": "0.5rem",
    "xl": "0.75rem",
    "full": "9999px"
  },
  "shadows": {
    "sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    "md": "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    "lg": "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    "xl": "0 20px 25px -5px rgb(0 0 0 / 0.1)"
  }
}`

// const tailwindConfig = `/** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     './pages/**/*.{js,ts,jsx,tsx,mdx}',
//     './components/**/*.{js,ts,jsx,tsx,mdx}',
//     './app/**/*.{js,ts,jsx,tsx,mdx}',
//   ],
//   theme: {
//     extend: {
//       colors: {
//         primary: '#3b82f6',
//         secondary: '#64748b',
//         success: '#10b981',
//         error: '#ef4444',
//         warning: '#f59e0b',
//         info: '#06b6d4',
//       },
//       fontFamily: {
//         sans: ['Inter', 'sans-serif'],
//       },
//       spacing: {
//         '1': '4px',
//         '2': '8px',
//         '3': '12px',
//         '4': '16px',
//         '5': '20px',
//         '6': '24px',
//         '8': '32px',
//         '10': '40px',
//         '12': '48px',
//         '16': '64px',
//       },
//       borderRadius: {
//         'sm': '0.25rem',
//         'md': '0.375rem',
//         'lg': '0.5rem',
//         'xl': '0.75rem',
//         'full': '9999px',
//       },
//       boxShadow: {
//         'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
//         'md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
//         'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
//         'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1)',
//       }
//     },
//   },
//   plugins: [],
// }`

const componentJSX = `import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function MyComponent() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sample Component</CardTitle>
        <CardDescription>
          Built with your design system tokens
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" placeholder="Enter your email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="Enter password" />
        </div>
        <Button className="w-full">Sign In</Button>
      </CardContent>
    </Card>
  )
}`

const v0Prompt = `Create a modern sign-in form component using the following design system:

Colors:
- Primary: #3b82f6 (blue)
- Secondary: #64748b (slate)
- Success: #10b981 (emerald)
- Error: #ef4444 (red)

Typography:
- Font: Inter, sans-serif
- Sizes: xs (12px), sm (14px), base (16px), lg (18px), xl (20px)

Spacing:
- Use consistent spacing scale: 4px, 8px, 12px, 16px, 20px, 24px, 32px

Border Radius:
- Small: 4px, Medium: 6px, Large: 8px, Extra Large: 12px

Requirements:
- Card container with header and content
- Email and password input fields with labels
- Primary button for sign-in action
- Responsive design
- Clean, minimal aesthetic
- Use shadcn/ui components`

export default function ExportPage() {
  const [selectedTokens, setSelectedTokens] = useState({
    colors: true,
    typography: true,
    spacing: true,
    borderRadius: true,
    shadows: true,
  })

  const [selectedComponents, setSelectedComponents] = useState({
    button: true,
    card: true,
    input: true,
    form: false,
  })

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="flex-1 p-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Export</h1>
          <p className="text-muted-foreground">Export your design tokens and components in various formats</p>
        </div>

        <Tabs defaultValue="tokens" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tokens" className="gap-2">
              <Palette className="h-4 w-4" />
              Design Tokens
            </TabsTrigger>
            <TabsTrigger value="components" className="gap-2">
              <Code className="h-4 w-4" />
              Components
            </TabsTrigger>
            <TabsTrigger value="ai" className="gap-2">
              <Zap className="h-4 w-4" />
              AI Integration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tokens" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Export Options</h3>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Select Tokens</CardTitle>
                    <CardDescription>Choose which design tokens to include</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(selectedTokens).map(([key, checked]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={key}
                          checked={checked}
                          onCheckedChange={(checked) => setSelectedTokens((prev) => ({ ...prev, [key]: !!checked }))}
                        />
                        <Label htmlFor={key} className="capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </Label>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Export Format</CardTitle>
                    <CardDescription>Choose your preferred format</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Select defaultValue="json">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="json">Design Tokens JSON</SelectItem>
                        <SelectItem value="tailwind">Tailwind Config</SelectItem>
                        <SelectItem value="css">CSS Variables</SelectItem>
                        <SelectItem value="scss">SCSS Variables</SelectItem>
                        <SelectItem value="style-dictionary">Style Dictionary</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Preview</h3>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(designTokensJSON)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <Textarea
                      value={designTokensJSON}
                      readOnly
                      className="min-h-96 font-mono text-sm border-0 resize-none"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="components" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Component Export</h3>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Select Components</CardTitle>
                    <CardDescription>Choose components to export</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(selectedComponents).map(([key, checked]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={key}
                            checked={checked}
                            onCheckedChange={(checked) =>
                              setSelectedComponents((prev) => ({ ...prev, [key]: !!checked }))
                            }
                          />
                          <Label htmlFor={key} className="capitalize">
                            {key} Component
                          </Label>
                        </div>
                        <Badge variant="secondary">3 variants</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Export Format</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Select defaultValue="jsx">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jsx">JSX + Tailwind</SelectItem>
                        <SelectItem value="css-modules">CSS Modules</SelectItem>
                        <SelectItem value="styled-components">Styled Components</SelectItem>
                        <SelectItem value="storybook">Storybook Stories</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Component Code</h3>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(componentJSX)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <Textarea
                      value={componentJSX}
                      readOnly
                      className="min-h-96 font-mono text-sm border-0 resize-none"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">AI Integration</h3>
                <p className="text-muted-foreground">
                  Generate AI-friendly prompts from your design system for use with Cursor, v0.dev, and other AI tools.
                </p>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Prompt Options</CardTitle>
                    <CardDescription>Customize your AI prompt</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Target Platform</Label>
                      <Select defaultValue="v0">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="v0">v0.dev</SelectItem>
                          <SelectItem value="cursor">Cursor AI</SelectItem>
                          <SelectItem value="copilot">GitHub Copilot</SelectItem>
                          <SelectItem value="claude">Claude</SelectItem>
                          <SelectItem value="chatgpt">ChatGPT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Component Type</Label>
                      <Select defaultValue="form">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="form">Form Component</SelectItem>
                          <SelectItem value="card">Card Component</SelectItem>
                          <SelectItem value="navigation">Navigation</SelectItem>
                          <SelectItem value="dashboard">Dashboard</SelectItem>
                          <SelectItem value="landing">Landing Page</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="include-tokens" defaultChecked />
                      <Label htmlFor="include-tokens">Include design tokens</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="include-examples" defaultChecked />
                      <Label htmlFor="include-examples">Include usage examples</Label>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-2">
                  <Button className="flex-1">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Send to v0.dev
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Send to Cursor
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Generated Prompt</h3>
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard(v0Prompt)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Prompt
                  </Button>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <Textarea value={v0Prompt} readOnly className="min-h-96 font-mono text-sm border-0 resize-none" />
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                    <FileCode className="h-4 w-4" />
                    Export as .md
                  </Button>
                  <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                    <Download className="h-4 w-4" />
                    Save Template
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
