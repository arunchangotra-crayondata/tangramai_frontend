"use client"

import type React from "react"

import { useState } from "react"
import { Upload, CheckCircle2 } from "lucide-react"
import { Label } from "@/components/ui/label"

interface FileUploadProps {
  onFileSelect?: (file: File | null) => void
}

export function FileUpload({ onFileSelect }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
    onFileSelect?.(selectedFile)
  }

  const handleDelete = () => {
    setFile(null)
    onFileSelect?.(null)
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-900">Logo</Label>

      <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
        <input type="file" id="file-upload" className="hidden" accept=".jpg,.jpeg,.png" onChange={handleFileChange} />

        {!file ? (
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="mx-auto mb-2 h-8 w-8 text-blue-500" />
            <p className="text-sm text-gray-600">
              Drag & drop files or <span className="font-medium text-blue-600 hover:underline">Choose files</span>
            </p>
            <p className="mt-1 text-xs text-gray-500">Supports JPEG & PNG file (max. 5MB file size)</p>
          </label>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span className="text-sm text-gray-900">{file.name}</span>
            <button onClick={handleDelete} className="ml-2 text-sm font-medium text-red-500 hover:underline">
              Delete
            </button>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500">Minimum required image dimensions are 400×400 pixels 1:1 (aspect ratio)</p>
    </div>
  )
}
