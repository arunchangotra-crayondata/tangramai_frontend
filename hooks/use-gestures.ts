"use client"

import { useCallback, useEffect, useRef, useState } from "react"

export interface GestureState {
  isDragging: boolean
  isTouching: boolean
  startX: number
  startY: number
  currentX: number
  currentY: number
  deltaX: number
  deltaY: number
  velocityX: number
  velocityY: number
  direction: "left" | "right" | "up" | "down" | null
}

export interface UseGesturesOptions {
  onSwipe?: (direction: "left" | "right" | "up" | "down", distance: number) => void
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onTap?: (event: MouseEvent | TouchEvent) => void
  onDoubleTap?: () => void
  onLongPress?: () => void
  onPinch?: (scale: number) => void
  onDrag?: (deltaX: number, deltaY: number) => void
  onDragStart?: () => void
  onDragEnd?: () => void
  threshold?: number
  longPressDelay?: number
  enabled?: boolean
}

export function useGestures(options: UseGesturesOptions = {}) {
  const {
    onSwipe,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onTap,
    onDoubleTap,
    onLongPress,
    onPinch,
    onDrag,
    onDragStart,
    onDragEnd,
    threshold = 50,
    longPressDelay = 500,
    enabled = true,
  } = options

  const [state, setState] = useState<GestureState>({
    isDragging: false,
    isTouching: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    deltaX: 0,
    deltaY: 0,
    velocityX: 0,
    velocityY: 0,
    direction: null,
  })

  const elementRef = useRef<HTMLElement | null>(null)
  const touchStartTimeRef = useRef<number>(0)
  const lastTapRef = useRef<number>(0)
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastPositionRef = useRef<{ x: number; y: number; time: number } | null>(null)
  const initialDistanceRef = useRef<number | null>(null)

  const getEventCoordinates = useCallback((event: MouseEvent | TouchEvent) => {
    if ("touches" in event && event.touches.length > 0) {
      return { x: event.touches[0].clientX, y: event.touches[0].clientY }
    }
    if ("clientX" in event) {
      return { x: event.clientX, y: event.clientY }
    }
    return { x: 0, y: 0 }
  }, [])

  const getTouchDistance = useCallback((touches: TouchList) => {
    if (touches.length < 2) return null
    const touch1 = touches[0]
    const touch2 = touches[1]
    const dx = touch2.clientX - touch1.clientX
    const dy = touch2.clientY - touch1.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }, [])

  const handleStart = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!enabled) return

      const coords = getEventCoordinates(event)
      const now = Date.now()

      touchStartTimeRef.current = now
      lastPositionRef.current = { x: coords.x, y: coords.y, time: now }

      setState((prev) => ({
        ...prev,
        isDragging: true,
        isTouching: "touches" in event,
        startX: coords.x,
        startY: coords.y,
        currentX: coords.x,
        currentY: coords.y,
        deltaX: 0,
        deltaY: 0,
        velocityX: 0,
        velocityY: 0,
        direction: null,
      }))

      // Handle pinch start
      if ("touches" in event && event.touches.length === 2) {
        const distance = getTouchDistance(event.touches)
        if (distance !== null) {
          initialDistanceRef.current = distance
        }
      }

      // Long press timer
      if (onLongPress) {
        longPressTimerRef.current = setTimeout(() => {
          onLongPress()
        }, longPressDelay)
      }

      if (onDragStart) {
        onDragStart()
      }
    },
    [enabled, getEventCoordinates, getTouchDistance, onLongPress, onDragStart, longPressDelay]
  )

  const handleMove = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!enabled || (!state.isDragging && !state.isTouching)) return

      const coords = getEventCoordinates(event)
      const now = Date.now()

      // Cancel long press if moved
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current)
        longPressTimerRef.current = null
      }

      // Calculate velocity
      let velocityX = 0
      let velocityY = 0
      if (lastPositionRef.current) {
        const dt = now - lastPositionRef.current.time
        if (dt > 0) {
          velocityX = (coords.x - lastPositionRef.current.x) / dt
          velocityY = (coords.y - lastPositionRef.current.y) / dt
        }
      }

      lastPositionRef.current = { x: coords.x, y: coords.y, time: now }

      const deltaX = coords.x - state.startX
      const deltaY = coords.y - state.startY

      // Determine direction
      let direction: "left" | "right" | "up" | "down" | null = null
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        direction = deltaX > 0 ? "right" : "left"
      } else if (Math.abs(deltaY) > Math.abs(deltaX)) {
        direction = deltaY > 0 ? "down" : "up"
      }

      setState((prev) => ({
        ...prev,
        currentX: coords.x,
        currentY: coords.y,
        deltaX,
        deltaY,
        velocityX,
        velocityY,
        direction,
      }))

      // Handle pinch
      if ("touches" in event && event.touches.length === 2 && initialDistanceRef.current !== null) {
        const currentDistance = getTouchDistance(event.touches)
        if (currentDistance !== null && onPinch) {
          const scale = currentDistance / initialDistanceRef.current
          onPinch(scale)
        }
      }

      // Handle drag
      if (onDrag) {
        onDrag(deltaX, deltaY)
      }
    },
    [enabled, state.isDragging, state.isTouching, state.startX, state.startY, getEventCoordinates, getTouchDistance, onPinch, onDrag]
  )

  const handleEnd = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!enabled) return

      // Cancel long press
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current)
        longPressTimerRef.current = null
      }

      const coords = getEventCoordinates(event)
      const deltaX = coords.x - state.startX
      const deltaY = coords.y - state.startY
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      const now = Date.now()
      const duration = now - touchStartTimeRef.current

      // Determine if it's a swipe
      if (distance > threshold && duration < 300) {
        let direction: "left" | "right" | "up" | "down" | null = null
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          direction = deltaX > 0 ? "right" : "left"
        } else {
          direction = deltaY > 0 ? "down" : "up"
        }

        if (onSwipe) {
          onSwipe(direction, distance)
        }

        switch (direction) {
          case "left":
            onSwipeLeft?.()
            break
          case "right":
            onSwipeRight?.()
            break
          case "up":
            onSwipeUp?.()
            break
          case "down":
            onSwipeDown?.()
            break
        }
      } else if (distance < 10 && duration < 200) {
        // Tap detection
        const timeSinceLastTap = now - lastTapRef.current
        if (timeSinceLastTap < 300 && onDoubleTap) {
          onDoubleTap()
          lastTapRef.current = 0
        } else {
          lastTapRef.current = now
          if (onTap) {
            onTap(event)
          }
        }
      }

      if (onDragEnd) {
        onDragEnd()
      }

      initialDistanceRef.current = null
      lastPositionRef.current = null

      setState((prev) => ({
        ...prev,
        isDragging: false,
        isTouching: false,
        deltaX: 0,
        deltaY: 0,
        velocityX: 0,
        velocityY: 0,
        direction: null,
      }))
    },
    [enabled, state.startX, state.startY, threshold, getEventCoordinates, onSwipe, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onTap, onDoubleTap, onDragEnd]
  )

  const setElement = useCallback(
    (element: HTMLElement | null) => {
      if (elementRef.current) {
        elementRef.current.removeEventListener("mousedown", handleStart as EventListener)
        elementRef.current.removeEventListener("mousemove", handleMove as EventListener)
        elementRef.current.removeEventListener("mouseup", handleEnd as EventListener)
        elementRef.current.removeEventListener("touchstart", handleStart as EventListener)
        elementRef.current.removeEventListener("touchmove", handleMove as EventListener)
        elementRef.current.removeEventListener("touchend", handleEnd as EventListener)
      }

      elementRef.current = element

      if (element && enabled) {
        element.addEventListener("mousedown", handleStart as EventListener)
        element.addEventListener("mousemove", handleMove as EventListener)
        element.addEventListener("mouseup", handleEnd as EventListener)
        element.addEventListener("touchstart", handleStart as EventListener, { passive: false })
        element.addEventListener("touchmove", handleMove as EventListener, { passive: false })
        element.addEventListener("touchend", handleEnd as EventListener)
      }
    },
    [enabled, handleStart, handleMove, handleEnd]
  )

  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current)
      }
      if (elementRef.current) {
        elementRef.current.removeEventListener("mousedown", handleStart as EventListener)
        elementRef.current.removeEventListener("mousemove", handleMove as EventListener)
        elementRef.current.removeEventListener("mouseup", handleEnd as EventListener)
        elementRef.current.removeEventListener("touchstart", handleStart as EventListener)
        elementRef.current.removeEventListener("touchmove", handleMove as EventListener)
        elementRef.current.removeEventListener("touchend", handleEnd as EventListener)
      }
    }
  }, [handleStart, handleMove, handleEnd])

  return {
    state,
    setElement,
    ref: setElement,
  }
}

