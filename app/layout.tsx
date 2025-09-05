import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import Link from "next/link"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Interview Q&A",
  description: "Coder-themed interview Q&A library with moderation",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
              <Link href="/" className="inline-flex items-center gap-2">
                <span className="rounded border border-dashed px-2 py-0.5 text-xs font-mono">Q&A</span>
                <span className="text-sm font-medium">Coder Library</span>
              </Link>
              <nav className="flex items-center gap-3">
                <Link href="/submit" className="text-sm text-muted-foreground hover:text-primary">
                  Submit
                </Link>
                <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary">
                  Admin
                </Link>
                <a
                  href="https://github.com/prafulk9155/reactjs-interview-questions"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Source
                </a>
              </nav>
            </div>
          </header>
          {children}
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
