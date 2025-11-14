"use client"

import { useEffect } from "react"
import { useGestures } from "../hooks/use-gestures"

export function GlobalGestureHandler() {
  const { ref } = useGestures({
    onSwipeLeft: () => {
      // Navigate forward or show next section
      console.log("Swipe left detected")
    },
    onSwipeRight: () => {
      // Navigate back or show previous section
      console.log("Swipe right detected")
    },
    onSwipeUp: () => {
      // Scroll up or show content above
      console.log("Swipe up detected")
    },
    onSwipeDown: () => {
      // Scroll down or show content below
      console.log("Swipe down detected")
    },
    threshold: 50,
    enabled: true,
  })

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    // Apply gestures to the main content area
    const mainElement = document.querySelector("main")
    if (mainElement) {
      ref(mainElement as HTMLElement)
    }
  }, [ref])

  return null
}

