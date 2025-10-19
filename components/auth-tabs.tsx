"use client"

import { Users, User, UserCheck } from "lucide-react"

interface AuthTabsProps {
  activeTab: "client" | "reseller" | "isv"
  onTabChange?: (tab: "client" | "reseller" | "isv") => void
}

export function AuthTabs({ activeTab, onTabChange }: AuthTabsProps) {
  return (
    <div className="mb-6 flex gap-2 rounded-lg bg-gray-100 p-1">
      <button
        className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
          activeTab === "client" ? "bg-black text-white" : "bg-transparent text-gray-600 hover:text-gray-900"
        }`}
        onClick={() => onTabChange?.("client")}
      >
        <UserCheck className="h-4 w-4" />
        Client
      </button>
      <button
        className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
          activeTab === "reseller" ? "bg-black text-white" : "bg-transparent text-gray-600 hover:text-gray-900"
        }`}
        onClick={() => onTabChange?.("reseller")}
      >
        <Users className="h-4 w-4" />
        Reseller
      </button>
      <button
        className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
          activeTab === "isv" ? "bg-black text-white" : "bg-transparent text-gray-600 hover:text-gray-900"
        }`}
        onClick={() => onTabChange?.("isv")}
      >
        <User className="h-4 w-4" />
        ISV
      </button>
    </div>
  )
}
