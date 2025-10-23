"use client"

import type React from "react"

import { useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "./ui/button"

interface ModalWrapperProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export function ModalWrapper({ isOpen, onClose, children }: ModalWrapperProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose()
      }

      document.addEventListener("keydown", handleEscape)
      return () => {
        document.body.style.overflow = "unset"
        document.removeEventListener("keydown", handleEscape)
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="relative w-full max-w-[520px] max-h-[90vh] rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <Button variant="ghost" size="icon" className="absolute right-4 top-4 h-8 w-8 rounded-full z-10" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
        <div className="overflow-y-auto p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
