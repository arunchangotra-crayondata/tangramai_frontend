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

  const PasswordField = ({
    label = "Password",
    withForgotLink = false,
  }: {
    label?: string
    withForgotLink?: boolean
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-900">{label}</label>
        {withForgotLink && (
          <button type="button" className="text-sm font-medium text-blue-600 hover:underline">
            Forgot password?
          </button>
        )}
      </div>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-11 w-full rounded-lg border border-gray-200 px-4 pr-12 text-sm outline-none transition-colors focus:border-black focus:ring-2 focus:ring-black/10"
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
  )

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="space-y-8">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            {authMode === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-sm text-gray-500">
            {authMode === "login"
              ? "Access Tangram AI with your credentials."
              : "Choose your profile type and share the essentials to get started."}
          </p>
        </div>

        <AuthTabs activeTab={authRole} onTabChange={setAuthRole} />

        <div className="rounded-xl border border-gray-100 bg-gray-50 p-1">
          <div className="grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => setAuthMode("login")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                authMode === "login"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:bg-white/60"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setAuthMode("signup")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                authMode === "signup"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:bg-white/60"
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <InputField
            label="Email"
            placeholder="you@example.com"
            type="email"
            value={email}
            onChange={setEmail}
          />

          {(authMode === "login" || authRole === "reseller" || authRole === "isv") && (
            <PasswordField withForgotLink={authMode === "login"} />
          )}

          {authMode === "signup" && (
            <div className="space-y-6">
              <InputField
                label="Full Name"
                placeholder="Enter your full name"
                value={name}
                onChange={setName}
              />

              {authRole === "client" && (
                <div className="grid gap-4">
                  <InputField
                    label="Company"
                    placeholder="Your organisation name"
                    value={company}
                    onChange={setCompany}
                  />
                  <InputField
                    label="Contact Number"
                    placeholder="Phone number"
                    value={contactNumber}
                    onChange={setContactNumber}
                  />
                </div>
              )}

              {(authRole === "reseller" || authRole === "isv") && (
                <div className="space-y-5">
                  <div className="grid gap-4">
                    <InputField
                      label="Registered Name"
                      placeholder="Legal entity name"
                      value={registeredName}
                      onChange={setRegisteredName}
                    />
                    <InputField
                      label="Registered Address"
                      placeholder="Primary business address"
                      value={registeredAddress}
                      onChange={setRegisteredAddress}
                    />
                    <InputField
                      label="Domain"
                      placeholder="Primary domain (example.com)"
                      value={domain}
                      onChange={setDomain}
                    />
                    {authRole === "reseller" && (
                      <InputField
                        label="Whitelisted Domain"
                        placeholder="Optional secondary domain"
                        value={whitelistedDomain}
                        onChange={setWhitelistedDomain}
                      />
                    )}
                  </div>

                  <PhoneInputWithCode
                    label="Contact Number"
                    placeholder="Enter your contact number"
                    value={contactNumber}
                    countryCode={countryCode}
                    onValueChange={setContactNumber}
                    onCountryCodeChange={setCountryCode}
                    required
                  />

                  {authRole === "reseller" && (
                    <FileUploadField
                      label="Brand Logo"
                      accept="image/jpeg,image/png"
                      maxSize={5}
                      fileType="image"
                      description="JPEG or PNG, max 5MB, minimum 400×400px"
                      file={logoFile}
                      onFileChange={setLogoFile}
                      required
                    />
                  )}

                  {authRole === "isv" && (
                    <FileUploadField
                      label="MOU Document"
                      accept=".pdf,.doc,.docx"
                      maxSize={25}
                      fileType="document"
                      description="PDF or Word, max 25MB"
                      file={mouFile}
                      onFileChange={setMouFile}
                      required
                    />
                  )}
                </div>
              )}

              {authRole === "client" && <PasswordField />}
            </div>
          )}
        </div>

        <PrimaryButton
          state={isLoading ? "loading" : "default"}
          onClick={handleSubmit}
          disabled={!isFormValid() || isLoading}
        >
          {authMode === "login" ? "Continue" : "Create Account"}
        </PrimaryButton>

        <div className="text-center text-sm text-gray-600">
          {authMode === "login" ? "New to Tangram AI?" : "Already onboard?"}{" "}
          <button onClick={toggleMode} className="font-medium text-gray-900 underline-offset-4 hover:underline">
            {authMode === "login" ? "Create an account" : "Sign in"}
          </button>
        </div>
      </div>
    </ModalWrapper>
  )
}
