"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { Bell, LayoutDashboard, User, HelpCircle, LogOut, ChevronDown, Menu, X, Mail, Building2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { BrandLogo } from "./brand-logo"
import { useAuthStore } from "../lib/store/auth.store"
import { useModal } from "../hooks/use-modal"
import { useState, useRef, useEffect, useCallback } from "react"
import { useToast } from "../hooks/use-toast"
import { Badge } from "./ui/badge"

export function Navbar() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuthStore()
  const { openModal } = useModal()
  const { toast } = useToast()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [notifications, setNotifications] = useState<Array<{
    id: string
    title: string
    description: string
    time: string
    logo?: string
    read: boolean
    type?: 'enquiry' | 'system'
    enquiryData?: any
  }>>([])
  const [enquiries, setEnquiries] = useState<any[]>([])
  const [isLoadingEnquiries, setIsLoadingEnquiries] = useState(false)

  const hasUnread = notifications.some((n) => !n.read)

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  // Format date to relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  // Fetch enquiries for admin users
  const fetchEnquiries = useCallback(async () => {
    if (user?.role !== 'admin') return
    
    setIsLoadingEnquiries(true)
    try {
      const response = await fetch('https://agents-store.onrender.com/api/enquiries', {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.enquiries) {
          setEnquiries(data.enquiries)
          
          // Transform enquiries to notifications
          const enquiryNotifications = data.enquiries.map((enquiry: any) => ({
            id: enquiry.enquiry_id || `enquiry_${enquiry.created_at}`,
            title: `New Contact Enquiry from ${enquiry.full_name}`,
            description: enquiry.message || 'No message provided',
            time: formatRelativeTime(enquiry.created_at),
            read: enquiry.status !== 'new',
            type: 'enquiry' as const,
            enquiryData: enquiry,
          }))
          
          // For admin, show only enquiries (remove hardcoded notifications)
          setNotifications(enquiryNotifications)
        }
      }
    } catch (error) {
      console.error('Error fetching enquiries:', error)
    } finally {
      setIsLoadingEnquiries(false)
    }
  }, [user?.role])

  // Fetch enquiries when user is admin
  useEffect(() => {
    if (user?.role === 'admin') {
      fetchEnquiries()
      // Refresh enquiries every 30 seconds
      const interval = setInterval(() => fetchEnquiries(), 30000)
      return () => clearInterval(interval)
    }
  }, [user?.role, fetchEnquiries])

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

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const mobileMenu = document.getElementById('mobile-menu')
      const mobileMenuButton = document.getElementById('mobile-menu-button')
      
      if (mobileMenu && mobileMenuButton && 
          !mobileMenu.contains(event.target as Node) && 
          !mobileMenuButton.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [isMobileMenuOpen])

  const handleLogout = () => {
    logout()
    setIsDropdownOpen(false)
    router.push("/")
  }

  const handleDashboardClick = () => {
    if (!user) return
    
    setIsDropdownOpen(false)
    
    switch (user.role) {
      case 'admin':
        router.push('/admin')
        break
      case 'isv':
        router.push('/dashboard')
        break
      case 'reseller':
        toast({
          description: "Dashboard is not available for resellers.",
          variant: "destructive",
        })
        router.push('/')
        break
      case 'client':
        router.push('/dashboard')
        break
      default:
        router.push('/dashboard')
    }
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
    <>
      {/* Limited Availability Banner */}
      <div className="bg-blue-50 border-b border-blue-200 text-center py-2">
        <div className="w-full px-8 md:px-12 lg:px-16">
          <p className="text-sm text-blue-700 font-medium">
            Limited Availability !!
          </p>
        </div>
      </div>
      
      <nav className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 relative z-50">
      <div className="w-full px-8 md:px-12 lg:px-16">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <BrandLogo width={120} height={32} priority />
            </Link>
            {/* Desktop Navigation */}
            <div className="hidden items-center gap-10 md:flex">
              <Link href="/agents" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                Agent Store
              </Link>
              <Link href="/isv" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                ISV
              </Link>
              <Link href="/reseller" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                Reseller
              </Link>
              <Link href="/tech-stack" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                Deployment Options
              </Link>
              <Link href="/ai-catalyst" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                AI Catalyst
              </Link>
              <Link href="/contact" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                Contact us
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
              <DropdownMenuContent align="end" sideOffset={8} className="w-[420px] p-0">
                <div className="px-4 pt-3 pb-2 flex items-center justify-between border-b">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Notifications</span>
                    {user?.role === 'admin' && enquiries.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {enquiries.filter((e: any) => e.status === 'new').length} new
                      </Badge>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <Button variant="outline" size="sm" onClick={markAllAsRead}>Mark all as read</Button>
                  )}
                </div>
                <div className="max-h-96 overflow-auto py-2">
                  {isLoadingEnquiries && user?.role === 'admin' ? (
                    <div className="px-4 py-8 text-center text-sm text-gray-500">
                      Loading enquiries...
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-gray-500">
                      No notifications
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {notifications.map((n) => (
                        <div key={n.id} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                          {n.type === 'enquiry' && n.enquiryData ? (
                            <div className="flex items-start gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
                                <Mail className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-900">
                                      {n.enquiryData.full_name}
                                    </p>
                                    {n.enquiryData.company_name && (
                                      <div className="flex items-center gap-1 mt-0.5">
                                        <Building2 className="h-3 w-3 text-gray-400" />
                                        <p className="text-xs text-gray-500 truncate">
                                          {n.enquiryData.company_name}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    {n.enquiryData.status === 'new' && (
                                      <Badge variant="default" className="text-[10px] px-1.5 py-0 bg-blue-600">
                                        New
                                      </Badge>
                                    )}
                                    {!n.read && <span className="h-2 w-2 rounded-full bg-blue-500" aria-hidden="true" />}
                                  </div>
                                </div>
                                <p className="text-xs text-gray-700 line-clamp-2 mb-2">
                                  {n.description}
                                </p>
                                <div className="flex items-center justify-between gap-2 mt-2">
                                  <div className="flex items-center gap-3 text-[10px] text-gray-500">
                                    {n.enquiryData.email && (
                                      <span className="truncate max-w-[120px]">{n.enquiryData.email}</span>
                                    )}
                                    {n.enquiryData.phone && (
                                      <span>{n.enquiryData.phone}</span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-gray-400 shrink-0">{n.time}</span>
                                </div>
                                {n.enquiryData.user_type && n.enquiryData.user_type !== 'anonymous' && (
                                  <div className="mt-2">
                                    <Badge variant="outline" className="text-[10px]">
                                      {n.enquiryData.user_type.toUpperCase()}
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start gap-3">
                              {n.logo ? (
                                <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded">
                                  <Image src={n.logo} alt="logo" fill className="object-contain" />
                                </div>
                              ) : (
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100">
                                  <Bell className="h-4 w-4 text-gray-600" />
                                </div>
                              )}
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
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {user?.role === 'admin' && enquiries.length > 0 && (
                  <div className="border-t px-4 py-2 bg-gray-50">
                    <p className="text-xs text-gray-500 text-center">
                      {enquiries.length} total {enquiries.length === 1 ? 'enquiry' : 'enquiries'}
                    </p>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {isAuthenticated && user ? (
              // Authenticated state - User avatar with dropdown
              <div className="relative z-[60]" ref={dropdownRef}>
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
                  <div className="absolute right-0 mb-2 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-xl z-60">
                    {/* Dashboard option - only for ISV and client, not for reseller */}
                    {user.role !== 'reseller' && (
                      <button
                        onClick={handleDashboardClick}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </button>
                    )}
                    {/* Profile option - for ISV and reseller, not for admin */}
                    {(user.role === 'isv' || user.role === 'reseller') && (
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        View Profile
                      </Link>
                    )}
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
                <Button variant="ghost" onClick={() => openModal("auth", { mode: "login", role: "client" })} className="text-sm font-medium text-gray-700 hover:text-primary">
                  Login
                </Button>
                <Button onClick={() => openModal("auth", { mode: "signup", role: "client" })} className="text-sm font-medium bg-primary hover:bg-primary/90 text-white">
                  Sign Up
                </Button>
              </>
            )}
            
            {/* Mobile Menu Button - positioned after profile */}
            <button
              id="mobile-menu-button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div 
          id="mobile-menu"
          className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-40"
        >
          <div className="px-6 py-4 space-y-3">
            <Link 
              href="/agents" 
              className="block text-sm font-medium text-gray-700 hover:text-primary transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Agent Store
            </Link>
            <Link 
              href="/isv" 
              className="block text-sm font-medium text-gray-700 hover:text-primary transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              ISV
            </Link>
            <Link 
              href="/reseller" 
              className="block text-sm font-medium text-gray-700 hover:text-primary transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Reseller
            </Link>
            <Link 
              href="/tech-stack" 
              className="block text-sm font-medium text-gray-700 hover:text-primary transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Deployment Options
            </Link>
            <Link 
              href="/ai-catalyst" 
              className="block text-sm font-medium text-gray-700 hover:text-primary transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              AI Catalyst
            </Link>
            <Link 
              href="/contact" 
              className="block text-sm font-medium text-gray-700 hover:text-primary transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact us
            </Link>
          </div>
        </div>
      )}
    </nav>
    </>
  )
}
