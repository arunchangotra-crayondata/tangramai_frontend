"use client"

import type React from "react"

import { useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "./ui/button"
import Image from "next/image"

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
      {/* Outer container with pattern background - extends 10px beyond inner content */}
      <div
        className="relative w-full max-w-[540px] max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        style={{
          padding: "10px",
          backgroundImage: "url('/Pattern_login_back.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "repeat",
        }}
      >
        {/* Inner container with white background */}
        <div className="relative w-full h-full rounded-xl bg-white flex flex-col max-h-[calc(90vh-20px)]">
          <Button variant="ghost" size="icon" className="absolute right-4 top-4 h-8 w-8 rounded-full z-10" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
          <div className="overflow-y-auto p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
