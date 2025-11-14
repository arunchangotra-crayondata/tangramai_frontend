"use client"

import { createContext, useContext, ReactNode } from "react"

interface GestureContextValue {
  // Context for future gesture configuration if needed
}

const GestureContext = createContext<GestureContextValue | null>(null)

export function useGestureContext() {
  const context = useContext(GestureContext)
  if (!context) {
    throw new Error("useGestureContext must be used within GestureProvider")
  }
  return context
}

interface GestureProviderProps {
  children: ReactNode
}

export function GestureProvider({ children }: GestureProviderProps) {
  return <GestureContext.Provider value={{}}>{children}</GestureContext.Provider>
}

