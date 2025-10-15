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

interface VendorSignupModalProps {
  isOpen: boolean
  onClose: () => void
}

export function VendorSignupModal({ isOpen, onClose }: VendorSignupModalProps) {
  const { swapModal, openModal } = useModal()
  const [buttonState, setButtonState] = useState<"default" | "loading" | "success">("default")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    registeredName: "",
    registeredAddress: "",
    domain: "",
    contactNumber: "",
  })

  const handleRegister = () => {
    setButtonState("loading")
    setTimeout(() => {
      setButtonState("success")
      // After success, wait a bit then open onboard agent modal
      setTimeout(() => {
        openModal("onboard-agent", "vendor")
      }, 800)
    }, 1500)
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

        <AuthTabs activeTab="vendor" onTabChange={handleTabChange} />

        <div className="space-y-4">
          <InputField
            label="Name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(value) => setFormData({ ...formData, name: value })}
          />

          <InputField
            label="Position"
            placeholder="Enter your position at your company"
            value={formData.position}
            onChange={(value) => setFormData({ ...formData, position: value })}
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
            state={buttonState}
            onClick={handleRegister}
            disabled={!isFormValid}
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
