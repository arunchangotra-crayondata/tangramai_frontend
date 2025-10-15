"use client"

import { useState } from "react"
import { ModalWrapper } from "./modal-wrapper"
import { AuthTabs } from "./auth-tabs"
import { InputField } from "./input-field"
import { PhoneInput } from "./phone-input"
import { FileUpload } from "./file-upload"
import { PrimaryButton } from "./primary-button"
import { useModal } from "@/hooks/use-modal"

interface ResellerSignupModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ResellerSignupModal({ isOpen, onClose }: ResellerSignupModalProps) {
  const { swapModal, openModal } = useModal()
  const [buttonState, setButtonState] = useState<"default" | "loading" | "success">("default")
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
      setTimeout(() => {
        openModal("onboard-agent", "reseller")
      }, 800)
    }, 1500)
  }

  const handleLoginNow = () => {
    swapModal("reseller-login")
    // Reset form
    setButtonState("default")
    setFormData({
      name: "",
      position: "",
      registeredName: "",
      registeredAddress: "",
      domain: "",
      contactNumber: "",
    })
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

        <AuthTabs activeTab="reseller" onTabChange={handleTabChange} />

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

          <FileUpload />

          <PrimaryButton
            state={buttonState}
            onClick={handleRegister}
            disabled={!isFormValid}
            successText="THANK YOU! REGISTERED SUCCESSFULLY"
          >
            REGISTER
          </PrimaryButton>

          {buttonState === "success" && (
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
