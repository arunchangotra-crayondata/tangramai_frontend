"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { ModalWrapper } from "./modal-wrapper"
import { AuthTabs } from "./auth-tabs"
import { InputField } from "./input-field"
import { PrimaryButton } from "./primary-button"
import { useModal } from "@/hooks/use-modal"
import { useAuthStore } from "@/lib/store/auth.store"

interface ResellerLoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ResellerLoginModal({ isOpen, onClose }: ResellerLoginModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { swapModal, openModal } = useModal()
  const { login, isLoading, error, clearError } = useAuthStore()

  const handleLogin = async () => {
    clearError()
    
    if (!email || !password) {
      return
    }

    const result = await login(email, password)
    
    if (result.success) {
      // Only ISV can onboard agents, resellers go to their profile/dashboard
      onClose()
      // Use the redirect URL from API
      if (result.redirect) {
        window.location.href = result.redirect
      }
    }
  }

  const handleTabChange = (tab: "reseller" | "vendor") => {
    if (tab === "vendor") {
      swapModal("vendor-login")
    }
  }

  const isFormValid = email.length > 0 && password.length > 0

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="mb-6 text-center">
        <h2 className="mb-2 text-2xl font-bold">Get Started Now!</h2>
        <p className="text-sm text-gray-600">Enter Credentials to access your account.</p>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <span>{error}</span>
        </div>
      )}

      <AuthTabs activeTab="reseller" onTabChange={handleTabChange} />

      <div className="space-y-4">
        <InputField label="Email" placeholder="Enter your email ID" type="email" value={email} onChange={setEmail} />

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-900">Password</label>
            <button className="text-sm font-medium text-blue-600 hover:underline">Forgot Password?</button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <PrimaryButton 
          state={isLoading ? "loading" : "default"} 
          onClick={handleLogin} 
          disabled={!isFormValid || isLoading}
        >
          LOGIN
        </PrimaryButton>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-gray-500">- OR -</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button className="flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            LOGIN WITH GOOGLE
          </button>
          <button className="flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#f25022" d="M1 1h10v10H1z" />
              <path fill="#00a4ef" d="M13 1h10v10H13z" />
              <path fill="#7fba00" d="M1 13h10v10H1z" />
              <path fill="#ffb900" d="M13 13h10v10H13z" />
            </svg>
            LOGIN WITH MICROSOFT
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-2 text-center text-sm">
        <p className="text-gray-600">
          Don't have an account?{" "}
          <button onClick={() => swapModal("reseller-signup")} className="font-medium text-blue-600 hover:underline">
            Sign Up
          </button>
        </p>
        <p className="text-gray-600">
          Are You an Enterprise Customer?{" "}
          <button className="font-medium text-blue-600 hover:underline">Click here</button>
        </p>
      </div>
    </ModalWrapper>
  )
}
