"use client"

import { create } from "zustand"

type ModalType = "reseller-signup" | "reseller-login" | "vendor-signup" | "vendor-login" | "onboard-agent" | null

interface ModalStore {
  activeModal: ModalType
  role: "reseller" | "vendor" | null
  openModal: (type: ModalType, role?: "reseller" | "vendor") => void
  closeModal: () => void
  swapModal: (type: ModalType) => void
}

export const useModal = create<ModalStore>((set) => ({
  activeModal: null,
  role: null,
  openModal: (type, role) => set({ activeModal: type, role: role || null }),
  closeModal: () => set({ activeModal: null, role: null }),
  swapModal: (type) => set({ activeModal: type }),
}))
