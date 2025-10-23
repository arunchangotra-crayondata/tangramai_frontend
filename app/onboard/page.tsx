"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { ArrowLeft, Upload, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function OnboardPage() {
  const router = useRouter()
  const [selectedOption, setSelectedOption] = useState<"upload" | "custom" | null>(null)

  const handleNext = () => {
    if (selectedOption === "custom") {
      router.push("/onboard/custom")
    } else if (selectedOption === "upload") {
      router.push("/onboard/upload")
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b">
        <div className="mx-auto max-w-[1280px] px-6 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-[1280px] px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left Side - Illustration */}
          <div className="flex items-center justify-center">
            <Image
              src="/person-with-laptop-and-ai-robot-high-fiving-illust.png"
              alt="Onboard Your AI Agents"
              width={530}
              height={400}
              className="object-contain"
            />
          </div>

          {/* Right Side - Content */}
          <div className="flex flex-col justify-center">
            <h1 className="mb-4 text-4xl font-bold">Onboard Your AI Agents</h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Reseller with us to showcase your AI solutions to our enterprise clients.
            </p>

            {/* Options */}
            <div className="space-y-4">
              {/* Upload File Option */}
              <button
                onClick={() => setSelectedOption("upload")}
                className={`w-full rounded-lg border-2 p-6 text-left transition-all ${
                  selectedOption === "upload"
                    ? "border-primary bg-primary/5"
                    : "border-border bg-white hover:border-primary/50"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-lg font-bold">Upload File</h3>
                    <p className="text-sm text-muted-foreground">
                      Bulk upload multiple agents, CSV/Excel format supported, Quick and efficient
                    </p>
                  </div>
                  <div
                    className={`mt-1 h-5 w-5 shrink-0 rounded-full border-2 ${
                      selectedOption === "upload" ? "border-primary bg-primary" : "border-gray-300 bg-white"
                    }`}
                  >
                    {selectedOption === "upload" && (
                      <div className="flex h-full items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-white" />
                      </div>
                    )}
                  </div>
                </div>
              </button>

              {/* Custom Onboard Option */}
              <button
                onClick={() => setSelectedOption("custom")}
                className={`w-full rounded-lg border-2 p-6 text-left transition-all ${
                  selectedOption === "custom"
                    ? "border-primary bg-primary/5"
                    : "border-border bg-white hover:border-primary/50"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-lg font-bold">Custom Onboard</h3>
                    <p className="text-sm text-muted-foreground">
                      Step-by-step guidance, Validation and suggestions, Perfect for single agents
                    </p>
                  </div>
                  <div
                    className={`mt-1 h-5 w-5 shrink-0 rounded-full border-2 ${
                      selectedOption === "custom" ? "border-primary bg-primary" : "border-gray-300 bg-white"
                    }`}
                  >
                    {selectedOption === "custom" && (
                      <div className="flex h-full items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-white" />
                      </div>
                    )}
                  </div>
                </div>
              </button>
            </div>

            <Button
              onClick={handleNext}
              disabled={!selectedOption}
              size="lg"
              className="mt-8 w-full max-w-xs bg-black text-white hover:bg-black/90"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
