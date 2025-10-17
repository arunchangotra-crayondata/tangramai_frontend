"use client"

import { useState } from "react"
import { ModalWrapper } from "./modal-wrapper"
import { AuthTabs } from "./auth-tabs"
import { InputField } from "./input-field"
import { PhoneInput } from "./phone-input"
import { FileUpload } from "./file-upload"
import { PrimaryButton } from "./primary-button"
import { useModal } from "@/hooks/use-modal"
import { useAuthStore } from "@/lib/store/auth.store"
import type { ResellerSignupForm } from "@/lib/types/auth.types"

interface ResellerSignupModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ResellerSignupModal({ isOpen, onClose }: ResellerSignupModalProps) {
  const { swapModal, openModal } = useModal()
  const { signup, isLoading, error, clearError } = useAuthStore()
  const [successMessage, setSuccessMessage] = useState("")
  const [formData, setFormData] = useState<ResellerSignupForm>({
    email: "",
    password: "",
    name: "",
    registeredName: "",
    registeredAddress: "",
    domain: "",
    contactNumber: "",
    whitelistedDomain: "",
  })

  const handleRegister = async () => {
    clearError()
    setSuccessMessage("")
    
    if (!formData.email || !formData.password || !formData.name || !formData.registeredName || !formData.registeredAddress) {
      return
    }

    const result = await signup({
      email: formData.email,
      password: formData.password,
      role: "reseller",
      reseller_name: formData.name,
      reseller_address: formData.registeredAddress,
      reseller_domain: formData.domain,
      reseller_mob_no: formData.contactNumber,
      whitelisted_domain: formData.whitelistedDomain,
    })
    
    if (result.success) {
      setSuccessMessage(result.message || "Registration successful! Please wait for admin approval.")
      setTimeout(() => {
        swapModal("reseller-login")
      }, 3000)
    }
  }

  const handleLoginNow = () => {
    swapModal("reseller-login")
  }

  const handleTabChange = (tab: "reseller" | "vendor") => {
    if (tab === "vendor") {
      swapModal("vendor-signup")
    }
  }

  const isFormValid = Object.values(formData).some((value) => value.length > 0)

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="max-h-[80vh] overflow-y-auto pr-2">
        <div className="mb-6 text-center">
          <h2 className="mb-2 text-2xl font-bold">Sign Up</h2>
          <p className="text-sm text-gray-600">Welcome! Please sign-up to access the platform</p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 flex items-start gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">
            <span>{successMessage}</span>
          </div>
        )}

        <AuthTabs activeTab="reseller" onTabChange={handleTabChange} />

        <div className="space-y-4">
          <InputField
            label="Email"
            type="email"
            placeholder="Enter your email ID"
            value={formData.email}
            onChange={(value) => setFormData({ ...formData, email: value })}
          />

          <InputField
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(value) => setFormData({ ...formData, password: value })}
          />

          <InputField
            label="Name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(value) => setFormData({ ...formData, name: value })}
          />

          <InputField
            label="Registered Name"
            placeholder="Enter your company registered name"
            value={formData.registeredName}
            onChange={(value) => setFormData({ ...formData, registeredName: value })}
          />

          <InputField
            label="Registered address"
            placeholder="Enter your company registered address"
            value={formData.registeredAddress}
            onChange={(value) => setFormData({ ...formData, registeredAddress: value })}
          />

          <InputField
            label="Domain"
            placeholder="Enter your domain"
            value={formData.domain}
            onChange={(value) => setFormData({ ...formData, domain: value })}
          />

          <InputField
            label="Whitelisted Domain"
            placeholder="Enter whitelisted domain (optional)"
            value={formData.whitelistedDomain}
            onChange={(value) => setFormData({ ...formData, whitelistedDomain: value })}
          />

          <PhoneInput
            value={formData.contactNumber}
            onChange={(value) => setFormData({ ...formData, contactNumber: value })}
          />

          <FileUpload />

          <PrimaryButton
            state={isLoading ? "loading" : "default"}
            onClick={handleRegister}
            disabled={!isFormValid || isLoading}
            successText="THANK YOU! REGISTERED SUCCESSFULLY"
          >
            REGISTER
          </PrimaryButton>

          {!isLoading && (
            <button
              onClick={handleLoginNow}
              className="w-full text-center text-sm font-medium text-blue-600 hover:underline"
            >
              Login Now
            </button>
          )}
        </div>

        <div className="mt-6 space-y-2 text-center text-sm">
          <p className="text-gray-600">
            Already have an account?{" "}
            <button onClick={() => swapModal("reseller-login")} className="font-medium text-blue-600 hover:underline">
              Sign In
            </button>
          </p>
          <p className="text-gray-600">
            Are You an Enterprise Customer?{" "}
            <button className="font-medium text-blue-600 hover:underline">Click here</button>
          </p>
        </div>
      </div>
    </ModalWrapper>
  )
}
