"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    company: "",
    countryCode: "IND",
    contactNumber: "",
    password: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock signup - redirect to login with success message
    router.push("/auth/login")
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
            <div className="mt-1 flex gap-2">
              <Select
                value={formData.countryCode}
                onValueChange={(value) => setFormData({ ...formData, countryCode: value })}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IND">IND</SelectItem>
                  <SelectItem value="USA">USA</SelectItem>
                  <SelectItem value="UK">UK</SelectItem>
                  <SelectItem value="AUS">AUS</SelectItem>
                </SelectContent>
              </Select>
              <Input
                id="contact"
                type="tel"
                placeholder="Enter your contact number"
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                className="flex-1"
                required
              />
            </div>
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

          <Button type="submit" className="w-full bg-gray-200 text-gray-700 hover:bg-gray-300">
            REGISTER
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
