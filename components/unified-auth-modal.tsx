"use client"

import { useState, useEffect } from "react"
import { Eye, EyeOff } from "lucide-react"
import { ModalWrapper } from "./modal-wrapper"
import { AuthTabs } from "./auth-tabs"
import { InputField } from "./input-field"
import { PrimaryButton } from "./primary-button"
import { PhoneInputWithCode } from "./phone-input-with-code"
import { FileUploadField } from "./file-upload-field"
import { useModal } from "../hooks/use-modal"
import { useAuthStore } from "../lib/store/auth.store"

interface UnifiedAuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: "login" | "signup"
  initialRole?: "client" | "reseller" | "isv"
}

export function UnifiedAuthModal({ 
  isOpen, 
  onClose, 
  initialMode = "login", 
  initialRole = "client" 
}: UnifiedAuthModalProps) {
  const { authMode, authRole, setAuthMode, setAuthRole } = useModal()
  const { login, signup, isLoading, error, clearError } = useAuthStore()
  
  // Form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [company, setCompany] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [registeredName, setRegisteredName] = useState("")
  const [registeredAddress, setRegisteredAddress] = useState("")
  const [domain, setDomain] = useState("")
  const [whitelistedDomain, setWhitelistedDomain] = useState("")
  const [countryCode, setCountryCode] = useState("IND")
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [mouFile, setMouFile] = useState<File | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  // Initialize with props
  useEffect(() => {
    if (initialMode) setAuthMode(initialMode)
    if (initialRole) setAuthRole(initialRole)
  }, [initialMode, initialRole, setAuthMode, setAuthRole])

  // Clear form when switching modes or roles
  useEffect(() => {
    setEmail("")
    setPassword("")
    setName("")
    setCompany("")
    setContactNumber("")
    setRegisteredName("")
    setRegisteredAddress("")
    setDomain("")
    setWhitelistedDomain("")
    setCountryCode("IND")
    setLogoFile(null)
    setMouFile(null)
    clearError()
  }, [authMode, authRole, clearError])

  const handleLogin = async () => {
    clearError()
    
    if (!email || !password) {
      return
    }

    const result = await login(email, password)
    
    if (result.success) {
      onClose()
      if (result.redirect) {
        window.location.href = result.redirect
      }
    }
  }

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  const handleSignup = async () => {
    clearError()
    
    if (!email || !password || !name) {
      return
    }

    // Build signup data based on role
    const signupData: any = {
      email,
      password,
      role: authRole
    }

    // Add role-specific fields
    if (authRole === "client") {
      signupData.client_name = name
      signupData.client_company = company
      signupData.client_mob_no = contactNumber
    } else if (authRole === "reseller") {
      signupData.reseller_name = name
      signupData.reseller_registered_name = registeredName
      signupData.reseller_address = registeredAddress
      signupData.reseller_domain = domain
      signupData.reseller_mob_no = contactNumber
      signupData.reseller_country_code = countryCode
      signupData.reseller_whitelisted_domain = whitelistedDomain
      
      // Convert logo file to base64
      if (logoFile) {
        try {
          signupData.reseller_logo = await convertFileToBase64(logoFile)
        } catch (error) {
          console.error("Error converting logo file:", error)
        }
      }
    } else if (authRole === "isv") {
      signupData.isv_name = name
      signupData.isv_registered_name = registeredName
      signupData.isv_address = registeredAddress
      signupData.isv_domain = domain
      signupData.isv_mob_no = contactNumber
      signupData.isv_country_code = countryCode
      
      // Convert MOU file to base64
      if (mouFile) {
        try {
          signupData.isv_mou = await convertFileToBase64(mouFile)
        } catch (error) {
          console.error("Error converting MOU file:", error)
        }
      }
    }

    const result = await signup(signupData)
    
    if (result.success) {
      onClose()
      if (result.redirect) {
        window.location.href = result.redirect
      }
    }
  }

  const handleSubmit = () => {
    if (authMode === "login") {
      handleLogin()
    } else {
      handleSignup()
    }
  }

  const toggleMode = () => {
    setAuthMode(authMode === "login" ? "signup" : "login")
  }

  const isFormValid = () => {
    if (authMode === "login") {
      return email.length > 0 && password.length > 0
    } else {
      const baseValid = email.length > 0 && password.length > 0 && name.length > 0
      
      if (authRole === "client") {
        return baseValid && company.length > 0 && contactNumber.length > 0
      } else if (authRole === "reseller") {
        return baseValid && 
               registeredName.length > 0 && 
               registeredAddress.length > 0 && 
               domain.length > 0 && 
               contactNumber.length > 0 &&
               logoFile !== null
      } else if (authRole === "isv") {
        return baseValid && 
               registeredName.length > 0 && 
               registeredAddress.length > 0 && 
               domain.length > 0 && 
               contactNumber.length > 0 &&
               mouFile !== null
      }
      return baseValid
    }
  }

  const getRoleDisplayName = () => {
    switch (authRole) {
      case "client": return "Client"
      case "reseller": return "Reseller"
      case "isv": return "ISV"
      default: return "User"
    }
  }

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="mb-4 text-center">
        <h2 className="mb-1 text-xl font-bold">Get Started Now!</h2>
        <p className="text-sm text-gray-600">Enter Credentials to access your account.</p>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <span>{error}</span>
        </div>
      )}

      <AuthTabs activeTab={authRole} onTabChange={setAuthRole} />

      {/* Login/Signup Toggle */}
      <div className="mb-4">
        <div className="flex items-center justify-center gap-1  bg-white p-1">
          <button
            className={`px-6 py-2 text-sm font-medium transition-all duration-200 ${
              authMode === "login" 
                ? "bg-blue-50 text-blue-700 border border-blue-200 rounded-md shadow-sm" 
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
            }`}
            onClick={() => setAuthMode("login")}
          >
            Login
          </button>
          <button
            className={`px-6 py-2 text-sm font-medium transition-all duration-200 ${
              authMode === "signup" 
                ? "bg-blue-50 text-blue-700 border border-blue-200 rounded-md shadow-sm" 
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
            }`}
            onClick={() => setAuthMode("signup")}
          >
            Sign Up
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {/* Email field - always first */}
        <InputField 
          label="Email" 
          placeholder="Enter your email ID" 
          type="email" 
          value={email} 
          onChange={setEmail} 
        />

        {/* Password field - second for Reseller/ISV, last for Client */}
        {authMode === "login" || authRole === "reseller" || authRole === "isv" ? (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-900">Password</label>
              {authMode === "login" && (
                <button className="text-sm font-medium text-blue-600 hover:underline">Forgot Password?</button>
              )}
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
        ) : null}

        {/* Name field for signup */}
        {authMode === "signup" && (
          <InputField 
            label="Name" 
            placeholder="Enter your full name" 
            value={name} 
            onChange={setName} 
          />
        )}

        {/* Client-specific fields */}
        {authMode === "signup" && authRole === "client" && (
          <>
            <InputField 
              label="Company" 
              placeholder="Enter your company name" 
              value={company} 
              onChange={setCompany} 
            />
            <InputField 
              label="Contact Number" 
              placeholder="Enter your contact number" 
              value={contactNumber} 
              onChange={setContactNumber} 
            />
          </>
        )}

        {/* Reseller/ISV-specific fields */}
        {authMode === "signup" && (authRole === "reseller" || authRole === "isv") && (
          <>
            <InputField 
              label="Registered Name" 
              placeholder="Enter your company registered name" 
              value={registeredName} 
              onChange={setRegisteredName} 
            />
            <InputField 
              label="Registered Address" 
              placeholder="Enter your company registered address" 
              value={registeredAddress} 
              onChange={setRegisteredAddress} 
            />
            <InputField 
              label="Domain" 
              placeholder="Enter your domain" 
              value={domain} 
              onChange={setDomain} 
            />
            {/* Whitelisted Domain - only for Reseller */}
            {authRole === "reseller" && (
              <InputField 
                label="Whitelisted Domain" 
                placeholder="Enter whitelisted domain (optional)" 
                value={whitelistedDomain} 
                onChange={setWhitelistedDomain} 
              />
            )}
            <PhoneInputWithCode
              label="Contact Number"
              placeholder="Enter your contact number"
              value={contactNumber}
              countryCode={countryCode}
              onValueChange={setContactNumber}
              onCountryCodeChange={setCountryCode}
              required
            />
            {/* File upload fields */}
            {authRole === "reseller" && (
              <FileUploadField
                label="Logo"
                accept="image/jpeg,image/png"
                maxSize={5}
                fileType="image"
                description="JPEG & PNG, max 5MB, minimum 400x400 pixels 1:1 aspect ratio"
                file={logoFile}
                onFileChange={setLogoFile}
                required
              />
            )}
            {authRole === "isv" && (
              <FileUploadField
                label="MOU"
                accept=".pdf,.doc,.docx"
                maxSize={25}
                fileType="document"
                description="PDF/Word, max 25MB"
                file={mouFile}
                onFileChange={setMouFile}
                required
              />
            )}
          </>
        )}

        {/* Password field for Client signup - at the end */}
        {authMode === "signup" && authRole === "client" && (
          <div>
            <label className="text-sm font-medium text-gray-900">Password</label>
            <div className="relative mt-1">
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
        )}

        <PrimaryButton 
          state={isLoading ? "loading" : "default"} 
          onClick={handleSubmit} 
          disabled={!isFormValid() || isLoading}
        >
          {authMode === "login" ? "LOGIN" : "SIGN UP"}
        </PrimaryButton>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-gray-500">- OR -</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
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

      <div className="mt-4 space-y-1 text-center text-sm">
        <p className="text-gray-600">
          {authMode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button onClick={toggleMode} className="font-medium text-blue-600 hover:underline">
            {authMode === "login" ? "Sign Up" : "Login"}
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
