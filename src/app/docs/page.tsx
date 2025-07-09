"use client"

import { Book, Code, Palette, Zap, ArrowRight, Search } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const docSections = [
  {
    icon: Book,
    title: "Getting Started",
    description: "Learn the basics of Oro and create your first design system",
    articles: [
      "Quick Start Guide",
      "Creating Your First Project",
      "Understanding Design Tokens",
      "Basic Component Building",
    ],
  },
  {
    icon: Palette,
    title: "Design Tokens",
    description: "Master the art of design token management",
    articles: ["Color Token Management", "Typography Systems", "Spacing and Layout", "Advanced Token Techniques"],
  },
  {
    icon: Code,
    title: "Component Builder",
    description: "Build complex components with the visual editor",
    articles: ["Drag and Drop Basics", "Component Properties", "State Management", "Advanced Layouts"],
  },
  {
    icon: Zap,
    title: "Export & Integration",
    description: "Export your design system to various formats",
    articles: ["Exporting to Code", "AI Integration Guide", "Team Collaboration", "Version Control"],
  },
]

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-sm font-bold">O</span>
              </div>
              <span className="text-xl font-bold">Oro</span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                Home
              </Link>
              <Button asChild>
                <Link href="/app">Get Started</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Documentation</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Everything you need to know about building design systems with Oro
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search documentation..." className="pl-9" />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Quick Start</h3>
              <p className="text-sm text-muted-foreground mb-4">Get up and running with Oro in under 5 minutes</p>
              <Button size="sm" variant="outline" asChild>
                <Link href="/docs/quick-start">
                  Start Here <ArrowRight className="ml-2 h-3 w-3" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center mb-4">
                <Code className="h-4 w-4" />
              </div>
              <h3 className="font-semibold mb-2">API Reference</h3>
              <p className="text-sm text-muted-foreground mb-4">Complete API documentation and examples</p>
              <Button size="sm" variant="outline" asChild>
                <Link href="/docs/api">
                  View API <ArrowRight className="ml-2 h-3 w-3" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center mb-4">
                <Book className="h-4 w-4" />
              </div>
              <h3 className="font-semibold mb-2">Examples</h3>
              <p className="text-sm text-muted-foreground mb-4">Real-world examples and use cases</p>
              <Button size="sm" variant="outline" asChild>
                <Link href="/docs/examples">
                  Browse <ArrowRight className="ml-2 h-3 w-3" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Documentation Sections */}
        <div className="grid md:grid-cols-2 gap-8">
          {docSections.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <section.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.articles.map((article, articleIndex) => (
                    <li key={articleIndex}>
                      <Link
                        href={`/docs/${section.title.toLowerCase().replace(/\s+/g, "-")}/${article.toLowerCase().replace(/\s+/g, "-")}`}
                        className="text-sm text-muted-foreground hover:text-foreground flex items-center justify-between group"
                      >
                        <span>{article}</span>
                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Help Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Need more help?</h2>
          <p className="text-muted-foreground mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" asChild>
              <Link href="/help">Help Center</Link>
            </Button>
            <Button asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
