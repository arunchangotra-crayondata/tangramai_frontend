"use client"

import { useState, useMemo } from "react"
import clsx from "clsx"
import { AspectRatio } from "./ui/aspect-ratio"
import { Button } from "./ui/button"
import { Dialog, DialogContent } from "./ui/dialog"
import { Minimize2, Maximize2, X } from "lucide-react"

type DemoAsset = { demo_asset_link?: string; demo_link?: string; asset_url?: string }

type DemoAssetsViewerProps = {
  assets: DemoAsset[]
  className?: string
}

export default function DemoAssetsViewer({ assets, className }: DemoAssetsViewerProps) {
  const normalized = useMemo(() => {
    return (assets || [])
<<<<<<< HEAD
      .map(a => {
        let url = a.demo_link || a.demo_asset_link || a.asset_url || ""
        
        // Convert GitHub raw URLs to jsDelivr CDN to avoid rate limits
        if (url.startsWith('https://raw.githubusercontent.com/')) {
          // Convert: https://raw.githubusercontent.com/user/repo/branch/path
          // To: https://cdn.jsdelivr.net/gh/user/repo@branch/path
          url = url.replace(
            'https://raw.githubusercontent.com/',
            'https://cdn.jsdelivr.net/gh/'
          ).replace('/main/', '@main/').replace('/master/', '@master/')
        }
        return { url }
      })
=======
      .map(a => ({ url: a.demo_link || a.demo_asset_link || a.asset_url || "" }))
>>>>>>> 0d7071b34e611c60cffcd8729d91fb1d28d4cd7c
      .filter(a => !!a.url)
  }, [assets])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isOverlayOpen, setIsOverlayOpen] = useState(false)

  const selected = normalized[selectedIndex]
  const selectedUrl = selected?.url || ""
  const isVideo = /\.mp4($|\?)/i.test(selectedUrl)

<<<<<<< HEAD
=======
  // If first asset is video, start with it selected
  // (only on initial render when index is 0 and first is video)
  if (normalized.length > 0 && selectedIndex === 0) {
    const firstIsVideo = /\.mp4($|\?)/i.test(normalized[0]?.url || "")
    if (firstIsVideo && !isVideo) {
      // This setState is safe: render will stabilize quickly
      setSelectedIndex(0)
    }
  }

>>>>>>> 0d7071b34e611c60cffcd8729d91fb1d28d4cd7c
  return (
    <div className={clsx("w-full", className)}>
      {/* Header */}
      <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
        <span>Preview</span>
        <div className="flex items-center gap-1">
          <span>
            {Math.min(selectedIndex + 1, normalized.length)}/{normalized.length || 0}
          </span>
          <Button
            size="icon"
            variant="outline"
            className="h-7 w-7"
            onClick={() => setIsOverlayOpen(true)}
            aria-label="Expand"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Large viewer */}
      <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-sm p-2">
        <AspectRatio ratio={16 / 9}>
          <div
            className="h-full w-full flex items-center justify-center overflow-hidden rounded-lg bg-black cursor-zoom-in"
            onClick={() => selectedUrl && setIsOverlayOpen(true)}
            title={selectedUrl ? "Click to expand" : undefined}
          >
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
      {normalized.length > 1 && (
        <div className="mt-4 flex items-center gap-3 overflow-x-auto">
          {normalized.map((a, i) => {
            const url = a.url || ""
            const vid = /\.mp4($|\?)/i.test(url)
            return (
              <button
                key={(url || "asset") + i}
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

      {/* Overlay dialog */}
      <Dialog open={isOverlayOpen} onOpenChange={setIsOverlayOpen}>
        <DialogContent className="w-[70vw] max-w-[100vw] !p-0 bg-white border-none">
          <div className="relative w-full h-[85vh] flex items-center justify-center">
            {/* Overlay controls: minimize + close */}
            <div className="absolute right-2 top-2 z-10 flex items-center gap-2">
              <Button size="icon" variant="outline" className="h-8 w-8" aria-label="Minimize" onClick={() => setIsOverlayOpen(false)}>
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" className="h-8 w-8" aria-label="Close" onClick={() => setIsOverlayOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            {selectedUrl && (/\.mp4($|\?)/i.test(selectedUrl) ? (
              <video src={selectedUrl} className="h-full w-full object-contain" controls autoPlay muted playsInline />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={selectedUrl} alt="expanded" className="h-full w-full object-contain" />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


