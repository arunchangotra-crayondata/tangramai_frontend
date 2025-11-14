"use client"

import { ReactNode, useRef, useEffect } from "react"
import { useGestures, UseGesturesOptions } from "../hooks/use-gestures"

interface GestureWrapperProps extends UseGesturesOptions {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  as?: keyof JSX.IntrinsicElements
}

export function GestureWrapper({
  children,
  className,
  style,
  as: Component = "div",
  ...gestureOptions
}: GestureWrapperProps) {
  const elementRef = useRef<HTMLElement | null>(null)
  const { ref: setGestureRef } = useGestures(gestureOptions)

  useEffect(() => {
    // Only set up gestures on client side after mount
    if (typeof window !== "undefined" && elementRef.current) {
      setGestureRef(elementRef.current)
    }
  }, [setGestureRef])

  const setRef = (node: HTMLElement | null) => {
    elementRef.current = node
    
    // Set gesture listeners on the new element (only on client)
    if (node && typeof window !== "undefined") {
      setGestureRef(node)
    }
  }

  // Type assertion for ref - React.createElement accepts any ref type
  const refProp = setRef as any

  return (
    <Component ref={refProp} className={className} style={style}>
      {children}
    </Component>
  )
}

