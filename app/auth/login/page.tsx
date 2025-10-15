"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Eye, EyeOff, AlertCircle, Info } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock validation
    if (password.length < 8) {
      setError("Please enter correct password")
      setSuccess("")
    } else {
      setError("")
      setSuccess("Registered Successfully. Login below to access your account")
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
          <h1 className="mb-2 text-3xl font-bold">Get Started Now!</h1>
          <p className="text-sm text-muted-foreground">Enter Credentials to access your account.</p>
        </div>

        {success && (
          <div className="mb-6 flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                Forgot Password?
              </Link>
            </div>
            <div className="relative mt-1">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={error ? "border-red-500" : ""}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>
            {error && (
              <div className="mt-1 flex items-center gap-1 text-sm text-red-500">
                <AlertCircle className="h-3 w-3" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full bg-black text-white hover:bg-black/90">
            LOGIN
          </Button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <span className="text-sm text-muted-foreground">- OR -</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button variant="outline" className="w-full bg-transparent">
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            LOGIN WITH GOOGLE
          </Button>
          <Button variant="outline" className="w-full bg-transparent">
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path fill="#f25022" d="M0 0h11.377v11.372H0z" />
              <path fill="#00a4ef" d="M12.623 0H24v11.372H12.623z" />
              <path fill="#7fba00" d="M0 12.623h11.377V24H0z" />
              <path fill="#ffb900" d="M12.623 12.623H24V24H12.623z" />
            </svg>
            LOGIN WITH MICROSOFT
          </Button>
        </div>

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
