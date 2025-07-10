"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Palette,
  Square,
  Download,
  Settings,
  HelpCircle,
  FileText,
} from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/app",
    icon: LayoutDashboard,
  },
  {
    name: "Builder",
    href: "/app/builder",
    icon: Square,
  },
  {
    name: "Tokens",
    href: "/app/tokens",
    icon: Palette,
  },
  {
    name: "Export",
    href: "/app/export",
    icon: Download,
  },
  {
    name: "Projects",
    href: "/app/projects",
    icon: FileText,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const designSystemId = searchParams.get("designSystemId")

  return (
    <div className="flex h-full w-64 flex-col bg-background border-r">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">O</span>
          </div>
          <span className="font-semibold">Oro</span>
        </Link>
      </div>
      <div className="flex-1 space-y-1 p-2">
        {navigation.map((item) => {
          const href = designSystemId && item.href !== "/app" 
            ? `${item.href}?designSystemId=${designSystemId}`
            : item.href
          
          return (
            <Link key={item.name} href={href}>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  pathname === item.href && "bg-secondary"
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          )
        })}
      </div>
      <div className="border-t p-2 space-y-1">
        <Button variant="ghost" className="w-full justify-start">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <HelpCircle className="mr-2 h-4 w-4" />
          Help
        </Button>
      </div>
    </div>
  )
}
