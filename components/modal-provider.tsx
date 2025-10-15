"use client"

import { ResellerSignupModal } from "./reseller-signup-modal"
import { ResellerLoginModal } from "./reseller-login-modal"
import { VendorSignupModal } from "./vendor-signup-modal"
import { VendorLoginModal } from "./vendor-login-modal"
import { OnboardAgentModal } from "./onboard-agent-modal"
import { useModal } from "@/hooks/use-modal"

export function ModalProvider() {
  const { activeModal, closeModal } = useModal()

  return (
    <>
      <ResellerSignupModal isOpen={activeModal === "reseller-signup"} onClose={closeModal} />
      <ResellerLoginModal isOpen={activeModal === "reseller-login"} onClose={closeModal} />
      <VendorSignupModal isOpen={activeModal === "vendor-signup"} onClose={closeModal} />
      <VendorLoginModal isOpen={activeModal === "vendor-login"} onClose={closeModal} />
      <OnboardAgentModal isOpen={activeModal === "onboard-agent"} onClose={closeModal} />
    </>
  )
}
