"use client"

import { useState } from "react"
import { Card, CardContent } from "./ui/card"
import { Code, Lock, ExternalLink, FileText, Eye } from "lucide-react"
import { FilePreviewDialog } from "./file-preview-dialog"

type Documentation = {
  sdk_details?: string
  swagger_details?: string
  sample_input?: string
  sample_output?: string
  security_details?: string
  related_files?: string
}

interface DocumentationSectionProps {
  documentation: Documentation
}

export function DocumentationSection({ documentation }: DocumentationSectionProps) {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewFilePath, setPreviewFilePath] = useState("")

  const handlePreviewClick = async (filePath: string) => {
    // For PDFs and images, show preview
    const isPdf = filePath.toLowerCase().endsWith('.pdf')
    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(filePath)
    
    if (isPdf || isImage) {
      setPreviewFilePath(filePath)
      setPreviewOpen(true)
    } else {
      // For other files (like README), get download URL
      try {
        const response = await fetch(`/api/file-preview?path=${encodeURIComponent(filePath)}`)
        const data = await response.json()
        if (data.url) {
          window.open(data.url, '_blank')
        }
      } catch (error) {
        console.error('Failed to download file:', error)
      }
    }
  }

  return (
    <>
      <div className="space-y-6">
        {/* Top row cards */}
        <div className="grid gap-4 md:grid-cols-2">
          {documentation.sdk_details && (
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 p-2 rounded-lg bg-blue-50">
                    <Code className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-2">SDK Details</h3>
                    <div className="flex items-center gap-2">
                      <a
                        href={documentation.sdk_details}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 truncate"
                      >
                        <span className="truncate">{documentation.sdk_details}</span>
                        <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {documentation.swagger_details && (
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 p-2 rounded-lg bg-green-50">
                    <Code className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-2">API Swagger</h3>
                    <div className="flex items-center gap-2">
                      <a
                        href={documentation.swagger_details}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 truncate"
                      >
                        <span className="truncate">{documentation.swagger_details}</span>
                        <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {documentation.security_details && (
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 p-2 rounded-lg bg-red-50">
                    <Lock className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-2">Security Details</h3>
                    <div className="flex items-center gap-2">
                      <a
                        href={documentation.security_details}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 truncate"
                      >
                        <span className="truncate">{documentation.security_details}</span>
                        <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {documentation.related_files && (
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 p-2 rounded-lg bg-purple-50">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-2">Related Files</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePreviewClick(documentation.related_files!)}
                        className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="underline">View File</span>
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sample Input/Output */}
        {(documentation.sample_input || documentation.sample_output) && (
          <div className="space-y-4">
            {documentation.sample_input && (
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="p-0">
                  <div className="border-b px-5 py-3">
                    <h3 className="font-semibold text-sm">Sample Input</h3>
                  </div>
                  <div className="bg-gray-900 rounded-b-lg p-4 max-h-[400px] overflow-y-auto overflow-x-auto">
                    <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
                      <code>{documentation.sample_input}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}

            {documentation.sample_output && (
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="p-0">
                  <div className="border-b px-5 py-3">
                    <h3 className="font-semibold text-sm">Sample Output</h3>
                  </div>
                  <div className="bg-gray-900 rounded-b-lg p-4 max-h-[400px] overflow-y-auto overflow-x-auto">
                    <pre className="text-sm text-blue-400 font-mono whitespace-pre-wrap">
                      <code>{documentation.sample_output}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* File Preview Dialog */}
      <FilePreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        filePath={previewFilePath}
      />
    </>
  )
}

