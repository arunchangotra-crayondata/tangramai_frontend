"use client"

import { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { GestureWrapper } from "./gesture-wrapper"

interface AgentDetailGestureWrapperProps {
  children: ReactNode
  agentId: string
  nextAgentId: string | null
  prevAgentId: string | null
}

export function AgentDetailGestureWrapper({
  children,
  agentId,
  nextAgentId,
  prevAgentId,
}: AgentDetailGestureWrapperProps) {
  const router = useRouter()

  return (
    <GestureWrapper
      onSwipeLeft={() => {
        if (nextAgentId) {
          router.push(`/agents/${nextAgentId}`)
        } else {
          router.push("/agents")
        }
      }}
      onSwipeRight={() => {
        if (prevAgentId) {
          router.push(`/agents/${prevAgentId}`)
        } else {
          router.push("/agents")
        }
      }}
      threshold={50}
      className="flex flex-col"
    >
      {children}
    </GestureWrapper>
  )
}

