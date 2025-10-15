"use client"

import { ModalWrapper } from "./modal-wrapper"
import { useModal } from "@/hooks/use-modal"

interface OnboardAgentModalProps {
  isOpen: boolean
  onClose: () => void
}

export function OnboardAgentModal({ isOpen, onClose }: OnboardAgentModalProps) {
  const { role } = useModal()

  const content = {
    vendor: {
      title: "Welcome to Vendor Platform",
      subtitle:
        "You haven't onboard any agents yet. Reseller with us to showcase your AI solutions to our enterprise clients.",
    },
    reseller: {
      title: "Welcome to Reseller Platform",
      subtitle:
        "You haven't onboarded any agents yet. Start partnering and showcase AI solutions to enterprise clients.",
    },
  }

  const currentContent = role === "vendor" ? content.vendor : content.reseller

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="max-w-[640px] text-center">
        {/* Illustration */}
        <div className="mb-8 flex justify-center">
          <img
            src="/person-with-laptop-and-ai-robot-illustration.jpg"
            alt="Onboard illustration"
            className="h-60 w-80 object-contain"
          />
        </div>

        <h2 className="mb-4 text-2xl font-bold text-gray-900">{currentContent.title}</h2>
        <p className="mb-8 text-sm leading-relaxed text-gray-600">{currentContent.subtitle}</p>

        <button className="mb-4 h-11 w-full max-w-xs rounded-lg bg-gray-900 px-6 font-medium text-white transition-colors hover:bg-gray-800">
          Onboard Agent
        </button>

        <button onClick={onClose} className="text-sm font-medium text-gray-600 hover:text-gray-900 hover:underline">
          I'll do it later
        </button>
      </div>
    </ModalWrapper>
  )
}
