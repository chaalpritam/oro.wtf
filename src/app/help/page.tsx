"use client"

import { Search, MessageCircle, Book, Mail, Phone, Clock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const faqItems = [
  {
    question: "How do I create my first design system?",
    answer:
      "Start by clicking 'Create New Design System' on your dashboard. You'll be guided through setting up your first tokens and components.",
    category: "Getting Started",
  },
  {
    question: "Can I export my components to different frameworks?",
    answer:
      "Yes! Oro supports exporting to React, Vue, Angular, and vanilla HTML/CSS. You can also generate Tailwind configs and design tokens.",
    category: "Export",
  },
  {
    question: "How does team collaboration work?",
    answer:
      "Invite team members to your projects, assign roles, and work together in real-time. Changes are automatically synced across all collaborators.",
    category: "Collaboration",
  },
  {
    question: "What's included in the free plan?",
    answer:
      "The free plan includes up to 3 design systems, basic components, and export to JSON/CSS. Perfect for personal projects and small teams.",
    category: "Pricing",
  },
  {
    question: "How do I integrate with Figma?",
    answer:
      "Use our Figma plugin to sync design tokens and components between Figma and Oro. Available for Pro and Enterprise plans.",
    category: "Integrations",
  },
  {
    question: "Can I use custom fonts in my design system?",
    answer:
      "Upload custom fonts or use Google Fonts. Define your typography scale and see live previews across all components.",
    category: "Design Tokens",
  },
]

const supportChannels = [
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Get instant help from our support team",
    availability: "24/7",
    action: "Start Chat",
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Send us a detailed message",
    availability: "Response within 24h",
    action: "Send Email",
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Talk to our experts directly",
    availability: "Mon-Fri 9AM-6PM EST",
    action: "Schedule Call",
  },
]

export default function HelpPage() {
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
              <Link href="/docs" className="text-muted-foreground hover:text-foreground">
                Docs
              </Link>
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
          <h1 className="text-4xl font-bold mb-4">How can we help?</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Find answers to common questions or get in touch with our support team
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search for help..." className="pl-9" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <Book className="h-8 w-8 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Documentation</h3>
              <p className="text-sm text-muted-foreground mb-4">Comprehensive guides and tutorials</p>
              <Button variant="outline" asChild>
                <Link href="/docs">Browse Docs</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <MessageCircle className="h-8 w-8 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Community</h3>
              <p className="text-sm text-muted-foreground mb-4">Connect with other Oro users</p>
              <Button variant="outline">Join Discord</Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Mail className="h-8 w-8 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Contact Us</h3>
              <p className="text-sm text-muted-foreground mb-4">Get personalized support</p>
              <Button variant="outline" asChild>
                <Link href="/contact">Get Help</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* FAQ */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{item.question}</CardTitle>
                      <Badge variant="secondary">{item.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Support Channels */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Get Support</h2>
            <div className="space-y-4">
              {supportChannels.map((channel, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <channel.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{channel.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{channel.description}</p>
                        <div className="flex items-center gap-2 mb-3">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{channel.availability}</span>
                        </div>
                        <Button size="sm" variant="outline" className="w-full bg-transparent">
                          {channel.action}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Status */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="font-semibold">All Systems Operational</span>
                </div>
                <p className="text-sm text-muted-foreground">Check our status page for real-time updates</p>
                <Button size="sm" variant="outline" className="w-full mt-3 bg-transparent">
                  View Status Page
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
