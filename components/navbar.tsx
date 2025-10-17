"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Navbar() {
  const [notifications, setNotifications] = useState([
    { id: "n1", title: "Your agent build finished successfully", read: false },
    { id: "n2", title: "New deployment available for review", read: false },
    { id: "n3", title: "Partner invite accepted", read: false },
  ])

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-6">
      <div className="mx-auto max-w-[1280px]">
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Notifications">
                  <Bell className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8} className="w-80 p-0">
                <div className="px-4 pt-3 pb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Notifications</span>
                  <Button variant="outline" size="sm" onClick={markAllAsRead}>Mark all as read</Button>
                </div>
                <div className="max-h-80 overflow-auto py-1">
                  {notifications.map((n) => (
                    <div key={n.id} className="px-4 py-3 border-t first:border-t-0">
                      <div className="flex items-start gap-2">
                        <span className={`${n.read ? 'bg-gray-300' : 'bg-blue-500'} mt-1 inline-block h-2 w-2 rounded-full`} aria-hidden="true" />
                        <p className={`${n.read ? 'text-gray-500' : 'text-gray-900'} text-sm`}>{n.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
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
