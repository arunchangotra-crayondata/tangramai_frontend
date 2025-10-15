import type React from "react"
import { cn } from "@/lib/utils"

interface BadgeProps {
  children: React.ReactNode
  variant?: "default" | "primary" | "secondary" | "outline"
  className?: string
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        {
          "bg-blue-100 text-blue-700": variant === "default",
          "bg-purple-100 text-purple-700": variant === "primary",
          "bg-green-100 text-green-700": variant === "secondary",
          "border border-gray-300 bg-white text-gray-700": variant === "outline",
        },
        className,
      )}
    >
      {children}
    </span>
  )
}
