# Gesture System Documentation

## Overview

A comprehensive gesture system has been integrated across all pages to enable touch and mouse interactions including swipes, taps, drags, and pinch gestures.

## Features

- **Swipe Gestures**: Left, right, up, down swipes with configurable thresholds
- **Tap Gestures**: Single tap and double tap detection
- **Long Press**: Configurable long press detection
- **Drag**: Drag interactions with delta tracking
- **Pinch**: Pinch-to-zoom support for touch devices
- **Velocity Tracking**: Tracks gesture velocity for smooth animations

## Usage

### Basic Usage with GestureWrapper

```tsx
import { GestureWrapper } from "../components/gesture-wrapper";

export default function MyPage() {
  return (
    <GestureWrapper
      onSwipeLeft={() => console.log("Swiped left")}
      onSwipeRight={() => console.log("Swiped right")}
      onSwipeUp={() => console.log("Swiped up")}
      onSwipeDown={() => console.log("Swiped down")}
      onTap={(event) => console.log("Tapped", event)}
      onDoubleTap={() => console.log("Double tapped")}
      onLongPress={() => console.log("Long pressed")}
      threshold={50}
      longPressDelay={500}
    >
      {/* Your page content */}
    </GestureWrapper>
  );
}
```

### Using the Hook Directly

```tsx
import { useGestures } from "../hooks/use-gestures";
import { useEffect, useRef } from "react";

export default function MyComponent() {
  const elementRef = useRef<HTMLDivElement>(null);
  const { ref, state } = useGestures({
    onSwipeLeft: () => {
      // Handle swipe left
    },
    onDrag: (deltaX, deltaY) => {
      // Handle drag with delta values
      console.log(`Dragged: ${deltaX}, ${deltaY}`);
    },
    threshold: 50,
  });

  useEffect(() => {
    if (elementRef.current) {
      ref(elementRef.current);
    }
  }, [ref]);

  return (
    <div ref={elementRef}>
      {/* Your content */}
      {state.isDragging && <div>Dragging...</div>}
    </div>
  );
}
```

## Options

### UseGesturesOptions

- `onSwipe?: (direction, distance) => void` - Called on any swipe
- `onSwipeLeft?: () => void` - Called on left swipe
- `onSwipeRight?: () => void` - Called on right swipe
- `onSwipeUp?: () => void` - Called on up swipe
- `onSwipeDown?: () => void` - Called on down swipe
- `onTap?: (event) => void` - Called on single tap
- `onDoubleTap?: () => void` - Called on double tap
- `onLongPress?: () => void` - Called on long press
- `onPinch?: (scale) => void` - Called during pinch (scale factor)
- `onDrag?: (deltaX, deltaY) => void` - Called during drag
- `onDragStart?: () => void` - Called when drag starts
- `onDragEnd?: () => void` - Called when drag ends
- `threshold?: number` - Minimum distance for swipe (default: 50px)
- `longPressDelay?: number` - Delay for long press in ms (default: 500ms)
- `enabled?: boolean` - Enable/disable gestures (default: true)

## Gesture State

The `useGestures` hook returns a state object with:

```typescript
{
  isDragging: boolean;
  isTouching: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  deltaX: number;
  deltaY: number;
  velocityX: number;
  velocityY: number;
  direction: "left" | "right" | "up" | "down" | null;
}
```

## Current Implementation

### Global Gestures
- Applied to the main content area via `GlobalGestureHandler`
- Provides basic swipe navigation across the site

### Page-Specific Gestures

#### Home Page (`app/page.tsx`)
- Swipe left: Navigate to `/agents`
- Swipe right: Log gesture (can be extended for navigation)

#### Agents Page (`app/agents/page.tsx`)
- Swipe right: Navigate back to home (`/`)
- Swipe left: Log gesture (can be extended)

## Adding Gestures to New Pages

1. Import `GestureWrapper`:
```tsx
import { GestureWrapper } from "../components/gesture-wrapper";
```

2. Wrap your page content:
```tsx
export default function NewPage() {
  return (
    <GestureWrapper
      onSwipeLeft={() => {/* action */}}
      onSwipeRight={() => {/* action */}}
      // ... other gesture handlers
    >
      {/* Your content */}
    </GestureWrapper>
  );
}
```

## Best Practices

1. **Threshold**: Adjust threshold based on your use case (default 50px works well for most)
2. **Performance**: Gestures are passive by default for touch events to ensure smooth scrolling
3. **Accessibility**: Ensure gesture actions have alternative keyboard/mouse interactions
4. **Mobile First**: Test gestures on actual touch devices for best experience

## Browser Support

- Modern browsers with touch event support
- Mouse events for desktop interactions
- Works on both touch and non-touch devices

