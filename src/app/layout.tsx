import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { DataModeProvider } from "@/lib/data-mode"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Oro - Visual Design System Builder",
  description: "Create, customize, and export design systems through an interactive visual interface",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <DataModeProvider>
            {children}
            <Toaster />
          </DataModeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
