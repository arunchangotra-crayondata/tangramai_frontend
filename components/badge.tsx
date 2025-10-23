import type React from "react"
import { cn } from "../lib/utils"

interface BadgeProps {
  children: React.ReactNode
  variant?: "default" | "primary" | "secondary" | "outline"
  className?: string
  dotColorClassName?: string
}

export function Badge({ children, variant = "default", className, dotColorClassName }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-white text-gray-800 border border-gray-200",
        {
          "": variant === "default",
          "": variant === "primary",
          "": variant === "secondary",
          "border border-gray-300 bg-white text-gray-700": variant === "outline",
        },
        className,
      )}
    >
      <span className={cn("mr-2 inline-block h-2.5 w-2.5 rounded-full", dotColorClassName || "bg-blue-500")} />
      <span>{children}</span>
    </span>
  )
}
