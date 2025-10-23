"use client"

import type React from "react"

import { Input } from "./ui/input"
import { Label } from "./ui/label"

interface InputFieldProps {
  label: string
  placeholder: string
  type?: string
  value?: string
  onChange?: (value: string) => void
  rightElement?: React.ReactNode
}

export function InputField({ label, placeholder, type = "text", value, onChange, rightElement }: InputFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-gray-900">{label}</Label>
        {rightElement}
      </div>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-11 rounded-lg border-gray-200 text-sm focus-visible:ring-2 focus-visible:ring-gray-900/10"
      />
    </div>
  )
}
