"use client"

import { useState, useMemo } from "react"
import clsx from "clsx"
import { AspectRatio } from "./ui/aspect-ratio"

type DemoAsset = { demo_asset_link?: string; demo_link?: string }

type DemoAssetsViewerProps = {
  assets: DemoAsset[]
  className?: string
}

export default function DemoAssetsViewer({ assets, className }: DemoAssetsViewerProps) {
  const sanitizedAssets = useMemo(() => (assets || []).filter(a => !!a?.demo_link), [assets])
  const [selectedIndex, setSelectedIndex] = useState(0)

  const selected = sanitizedAssets[selectedIndex]
  const selectedUrl = selected?.demo_link || ""
  const isVideo = /\.mp4($|\?)/i.test(selectedUrl)

  // If first asset is video, start with it selected
  // (only on initial render when index is 0 and first is video)
  if (sanitizedAssets.length > 0 && selectedIndex === 0) {
    const firstIsVideo = /\.mp4($|\?)/i.test(sanitizedAssets[0]?.demo_link || "")
    if (firstIsVideo && !isVideo) {
      // This setState is safe: render will stabilize quickly
      setSelectedIndex(0)
    }
  }

  return (
    <div className={clsx("w-full", className)}>
      {/* Header */}
      <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
        <span>Preview</span>
        <span>
          {Math.min(selectedIndex + 1, sanitizedAssets.length)}/{sanitizedAssets.length || 0}
        </span>
      </div>

      {/* Large viewer */}
      <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-sm p-2">
        <AspectRatio ratio={16 / 9}>
          <div className="h-full w-full flex items-center justify-center overflow-hidden rounded-lg bg-black">
            {selectedUrl ? (
              isVideo ? (
                <video
                  src={selectedUrl}
                  className="h-full w-full object-contain"
                  controls
                  autoPlay
                  muted
                  playsInline
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selectedUrl}
                  alt="Demo asset"
                  className="h-full w-full object-contain"
                />
              )
            ) : (
              <div className="text-sm text-muted-foreground">No demo asset available</div>
            )}
          </div>
        </AspectRatio>
      </div>

      {/* Thumbnails */}
      {sanitizedAssets.length > 1 && (
        <div className="mt-4 flex items-center gap-3 overflow-x-auto">
          {sanitizedAssets.map((a, i) => {
            const url = a.demo_link || ""
            const vid = /\.mp4($|\?)/i.test(url)
            return (
              <button
                key={(a.demo_asset_link || "asset") + i}
                type="button"
                onClick={() => setSelectedIndex(i)}
                className={clsx("h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg border bg-white shadow-sm cursor-pointer",
                  i === selectedIndex ? "ring-2 ring-black" : "opacity-90 hover:opacity-100")}
                aria-label={`Preview ${i + 1}`}
              >
                {vid ? (
                  <video src={url} className="h-full w-full object-cover" muted playsInline />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={url} alt="thumb" className="h-full w-full object-cover" />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}


