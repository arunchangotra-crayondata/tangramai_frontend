"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Bell, LayoutDashboard, User, HelpCircle, LogOut, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/lib/store/auth.store"
import { useState, useRef, useEffect } from "react"

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      title: 'Build finished successfully',
      description: 'Your agent "Claims Triage" is ready to test.',
      time: '2m ago',
      logo: '/crayon_bw.png',
      read: false,
    },
    {
      id: 'n2',
      title: 'New deployment available',
      description: 'AWS us-east-1 rollout passed checks.',
      time: '1h ago',
      logo: '/aws.png',
      read: false,
    },
    {
      id: 'n3',
      title: 'Partner invite accepted',
      description: 'Mozark joined your workspace.',
      time: 'Yesterday',
      logo: '/mozak_bw.png',
      read: true,
    },
  ])

  const hasUnread = notifications.some((n) => !n.read)

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    logout()
    setIsDropdownOpen(false)
  }

  const getUserInitials = (email: string) => {
    // Try to get initials from email username part
    const username = email.split('@')[0]
    return username
      .split(/[._-]/)
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getDisplayName = (email: string) => {
    // Extract username from email and capitalize first letter
    const username = email.split('@')[0]
    return username.charAt(0).toUpperCase() + username.slice(1)
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
                Agent Store
              </Link>
              <Link href="/isv" className="text-sm font-medium hover:text-primary">
                ISV
              </Link>
              <Link href="/reseller" className="text-sm font-medium hover:text-primary">
                Reseller
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
          
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
                  <Bell className="h-5 w-5" />
                  {hasUnread && (
                    <span className="absolute -right-0.5 -top-0.5 inline-block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8} className="w-[360px] p-0">
                <div className="px-4 pt-3 pb-2 flex items-center justify-between border-b">
                  <span className="text-sm font-medium">Notifications</span>
                  <Button variant="outline" size="sm" onClick={markAllAsRead}>Mark all as read</Button>
                </div>
                <div className="max-h-80 overflow-auto py-2 divide-y divide-gray-100">
                  {notifications.map((n) => (
                    <div key={n.id} className="px-4 py-3">
                      <div className="flex items-start gap-3 rounded-md bg-white p-3 hover:bg-gray-50 transition">
                        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded">
                          {/* logo */}
                          <Image src={n.logo} alt="logo" fill className="object-contain" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium truncate">
                              {n.title}
                            </p>
                            {!n.read && <span className="h-2 w-2 rounded-full bg-blue-500" aria-hidden="true" />}
                          </div>
                          <p className="text-xs text-gray-600 truncate">{n.description}</p>
                          <p className="mt-1 text-[10px] text-gray-400">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t px-4 py-2">
                  <Button variant="ghost" className="w-full justify-center">View all notifications</Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {isAuthenticated && user ? (
              // Authenticated state - User avatar with dropdown
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    {getUserInitials(user.email)}
                  </div>
                  <span className="hidden sm:block">{getDisplayName(user.email)}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md border bg-white py-1 shadow-lg z-50">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      View Profile
                    </Link>
                    <Link
                      href="/help"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <HelpCircle className="h-4 w-4" />
                      Help Center
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4" />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Unauthenticated state - Login and Sign Up buttons
              <>
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
