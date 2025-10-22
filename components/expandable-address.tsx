"use client"

import { useState } from "react"

// Expandable Address Component
export default function ExpandableAddress({ address, showLabel = true }: { address: string; showLabel?: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Split address into words and limit to 8 words
  const words = address.split(' ')
  const wordLimit = 8
  const shouldTruncate = words.length > wordLimit
  const truncatedWords = shouldTruncate ? words.slice(0, wordLimit) : words
  const displayText = isExpanded ? address : truncatedWords.join(' ')
  
  return (
    <div className="flex items-start gap-2">
      {showLabel && (
        <span className="font-medium text-[14px] leading-[100%] tracking-[0] align-middle text-[#111827]" style={{ fontFamily: 'Inter, sans-serif' }}>Address:</span>
      )}
      <div className="flex-1">
        <span 
          className={`font-medium text-[14px] leading-[100%] tracking-[0] align-middle cursor-pointer hover:text-gray-500 transition-colors ${isExpanded ? '' : 'truncate block'}`}
          style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}
          onClick={() => setIsExpanded(!isExpanded)}
          title={isExpanded ? 'Click to collapse' : 'Click to expand'}
        >
          {displayText}
        </span>
        {!isExpanded && shouldTruncate && (
          <span className="text-xs text-gray-400 ml-1">...</span>
        )}
      </div>
    </div>
  )
}
