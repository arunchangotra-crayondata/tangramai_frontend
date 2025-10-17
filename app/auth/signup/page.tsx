"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, AlertCircle, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store/auth.store"
import type { ClientSignupForm } from "@/lib/types/auth.types"

export default function SignupPage() {
  const router = useRouter()
  const { signup, isLoading, error, clearError } = useAuthStore()
  const [successMessage, setSuccessMessage] = useState("")
  const [formData, setFormData] = useState<ClientSignupForm>({
    email: "",
    name: "",
    company: "",
    contactNumber: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    setSuccessMessage("")
    
    if (!formData.email || !formData.password || !formData.name) {
      return
    }

    const result = await signup({
      email: formData.email,
      password: formData.password,
      role: "client",
      client_name: formData.name,
      client_company: formData.company,
      client_mob_no: formData.contactNumber,
    })
    
    if (result.success) {
      setSuccessMessage(result.message || "Registration successful! Please wait for admin approval.")
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/auth/login")
      }, 3000)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <button
          onClick={() => router.back()}
          className="absolute right-4 top-4 rounded-full bg-gray-100 p-2 hover:bg-gray-200"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">Sign Up</h1>
          <p className="text-sm text-muted-foreground">Welcome! Please sign-up to access the platform</p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 flex items-start gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">
            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email ID"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              type="text"
              placeholder="Enter your company name"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="contact">Contact Number</Label>
            <Input
              id="contact"
              type="tel"
              placeholder="Enter your contact number"
              value={formData.contactNumber}
              onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="mt-1"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gray-200 text-gray-700 hover:bg-gray-300"
            disabled={isLoading || !formData.email || !formData.password || !formData.name || !formData.company}
          >
            {isLoading ? "REGISTERING..." : "REGISTER"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">{"Don't have an account? "}</span>
          <Link href="/auth/signup" className="font-semibold text-primary hover:underline">
            Sign Up
          </Link>
        </div>

        <div className="mt-2 text-center text-sm">
          <span className="text-muted-foreground">Reseller with us </span>
          <Link href="/partners" className="font-semibold text-primary hover:underline">
            Click here
          </Link>
        </div>
      </div>
    </div>
  )
}
