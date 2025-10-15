"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"

export function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="text-xl font-bold">
                {"tangram.ai "}
                <span className="text-primary">△</span>
              </div>
            </Link>
            <div className="hidden items-center gap-6 md:flex">
              <Link href="/agents" className="text-sm font-medium hover:text-primary">
                Agent Library
              </Link>
              <Link href="/partners" className="text-sm font-medium hover:text-primary">
                Partners
              </Link>
              <Link href="/tech-stack" className="text-sm font-medium hover:text-primary">
                Tech Stack
              </Link>
              <Link href="/contact" className="text-sm font-medium hover:text-primary">
                Contact us
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
