"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"

export function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/tangram_log.png"
                alt="tangram.ai logo"
                width={120}
                height={32}
                className="object-contain"
                priority
              />
            </Link>
            <div className="hidden items-center gap-10 md:flex">
              <Link href="/agents" className="text-sm font-medium hover:text-primary">
                <span style={{ width: '72px', height: '24px', position: 'relative', left: '16.45px', opacity: 1 }} className="font-inter font-normal text-[14px] leading-[24px] align-middle">
                  Agent Library
                </span>
              </Link>
              <Link href="/partners" className="text-sm font-medium hover:text-primary">
                <span style={{ width: '72px', height: '24px', position: 'relative', left: '16.45px', opacity: 1 }} className="font-inter font-normal text-[14px] leading-[24px] align-middle">
                  Partners
                </span>
              </Link>
              <Link href="/tech-stack" className="text-sm font-medium hover:text-primary">
                <span style={{ width: '72px', height: '24px', position: 'relative', left: '16.45px', opacity: 1 }} className="font-inter font-normal text-[14px] leading-[24px] align-middle">
                  Tech Stack
                </span>
              </Link>
              <Link href="/contact" className="text-sm font-medium hover:text-primary">
                <span style={{ width: '72px', height: '24px', position: 'relative', left: '16.45px', opacity: 1 }} className="font-inter font-normal text-[14px] leading-[24px] align-middle">
                  Contact us
                </span>
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild className="bg-black text-white hover:bg-neutral-800 focus:ring-2 focus:ring-offset-2 focus:ring-black">
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
