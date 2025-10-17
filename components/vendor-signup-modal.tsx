"use client"

import type React from "react"

import { useState } from "react"
import { ModalWrapper } from "./modal-wrapper"
import { AuthTabs } from "./auth-tabs"
import { InputField } from "./input-field"
import { PhoneInput } from "./phone-input"
import { PrimaryButton } from "./primary-button"
import { useModal } from "@/hooks/use-modal"
import { Upload } from "lucide-react"
import { useAuthStore } from "@/lib/store/auth.store"
import type { ISVSignupForm } from "@/lib/types/auth.types"

interface VendorSignupModalProps {
  isOpen: boolean
  onClose: () => void
}

export function VendorSignupModal({ isOpen, onClose }: VendorSignupModalProps) {
  const { swapModal, openModal } = useModal()
  const { signup, isLoading, error, clearError } = useAuthStore()
  const [successMessage, setSuccessMessage] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState<ISVSignupForm>({
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
      role: "isv", // ISV role (vendor in frontend = isv in backend)
      isv_name: formData.name,
      isv_address: formData.registeredAddress,
      isv_domain: formData.domain,
      isv_mob_no: formData.contactNumber,
    })
    
    if (result.success) {
      setSuccessMessage(result.message || "Registration successful! Please wait for admin approval.")
      setTimeout(() => {
        swapModal("vendor-login")
      }, 3000)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleDeleteFile = () => {
    setUploadedFile(null)
  }

  const handleTabChange = (tab: "reseller" | "vendor") => {
    if (tab === "reseller") {
      swapModal("reseller-signup")
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

        <AuthTabs activeTab="vendor" onTabChange={handleTabChange} />

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

          <PhoneInput
            value={formData.contactNumber}
            onChange={(value) => setFormData({ ...formData, contactNumber: value })}
          />

          {/* MOU Upload Section */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">MOU</label>
            <div className="relative rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center transition-colors hover:border-blue-400">
              <input
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                id="mou-upload"
              />
              <div className="flex flex-col items-center justify-center">
                <Upload className="mb-3 h-10 w-10 text-blue-600" />
                <p className="mb-1 text-sm text-gray-700">
                  Drag & drop files or{" "}
                  <label htmlFor="mou-upload" className="cursor-pointer font-medium text-blue-600 hover:underline">
                    Choose files
                  </label>
                </p>
                <p className="text-xs text-gray-500">Supports PDF, Word document file (max. 25MB file size)</p>
              </div>
            </div>

            {uploadedFile && (
              <div className="mt-3 flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                    <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">{uploadedFile.name}</span>
                </div>
                <button onClick={handleDeleteFile} className="text-sm font-medium text-red-600 hover:underline">
                  Delete
                </button>
              </div>
            )}
          </div>

          <PrimaryButton
            state={isLoading ? "loading" : "default"}
            onClick={handleRegister}
            disabled={!isFormValid || isLoading}
            successText="THANK YOU! REGISTERED SUCCESSFULLY"
          >
            REGISTER
          </PrimaryButton>
        </div>

        <div className="mt-6 space-y-2 text-center text-sm">
          <p className="text-gray-600">
            Already have an account?{" "}
            <button onClick={() => swapModal("vendor-login")} className="font-medium text-blue-600 hover:underline">
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
