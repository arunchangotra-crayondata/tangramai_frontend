"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/badge"
import { Search, Mic, Database, Gauge, Clock } from "lucide-react"
import { useModal } from "@/hooks/use-modal"
import Image from "next/image"

export default function HomePage() {
  const { openModal } = useModal()

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="gradient-bg py-20">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="text-center">
            <h1 className="mb-4 text-5xl font-bold text-balance md:text-6xl">
              <span className="gradient-text">Explore Our AI Agent Marketplace</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground text-balance">
              Explore AI-powered agents built to automate workflows — helping your team work smarter and faster every
              day.
            </p>

            {/* Search Bar */}
            <div className="mx-auto mb-8 flex max-w-2xl items-center gap-2 rounded-lg border bg-white p-2 shadow-sm">
              <Search className="ml-2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Tell us About your Business Needs" className="border-0 focus-visible:ring-0" />
              <Button size="icon" variant="ghost">
                <Mic className="h-5 w-5" />
              </Button>
              <Button size="icon" className="shrink-0">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {/* Category Tags */}
            <div className="mb-6 text-sm text-muted-foreground">150+ AI agents & Solutions Available</div>
            <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
              <Badge variant="default">Conversational AI & Advisory</Badge>
              <Badge variant="default">Document Planning & Analysis</Badge>
              <Badge variant="primary">Image processing</Badge>
              <Badge variant="secondary">Audio Processing</Badge>
              <Badge variant="default">Lead and Meeting</Badge>
              <Badge variant="default">Data Analysis and Insights</Badge>
              <Badge variant="default">Content generation</Badge>
              <Badge variant="secondary">Process Automation</Badge>
              <Badge variant="default">Data Transformation</Badge>
            </div>

            <Button size="lg" className="bg-black text-white hover:bg-black/90">
              EXPLORE OUR AGENTS
            </Button>
          </div>
        </div>
      </section>

      {/* AI Catalyst Section */}
      <section className="py-20">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="text-center">
            <h2 className="mb-4 text-4xl font-bold text-balance">
              <span className="gradient-text">Accelerate Deployment of Your Own Agents using AI Catalyst</span>
            </h2>
            <p className="mb-12 text-lg text-muted-foreground text-balance">
              AI Catalyst is our ideation engine that ensures AI delivery memorable impact across the enterprise.
            </p>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Labs Card */}
              <div className="rounded-lg border bg-gradient-to-br from-pink-50 to-purple-50 p-8">
                <div className="mb-6 flex h-48 items-center justify-center">
                  <Image
                    src="/card1.png"
                    alt="Labs - AI experimentation and validation"
                    width={200}
                    height={200}
                    className="object-contain"
                  />
                </div>
                <h3 className="mb-2 text-xl font-bold">Labs</h3>
                <p className="text-sm text-muted-foreground">
                  Experiment fast. Validate use cases. Prove value in weeks, not years.
                </p>
              </div>

              {/* Foundry Card */}
              <div className="rounded-lg border bg-gradient-to-br from-blue-50 to-cyan-50 p-8">
                <div className="mb-6 flex h-48 items-center justify-center">
                  <Image
                    src="/card2.png"
                    alt="Foundry - Scale AI pilots with governance"
                    width={200}
                    height={200}
                    className="object-contain"
                  />
                </div>
                <h3 className="mb-2 text-xl font-bold">Foundry</h3>
                <p className="text-sm text-muted-foreground">
                  Scale successful pilots with enterprise-grade governance and compliance.
                </p>
              </div>

              {/* Factory Card */}
              <div className="rounded-lg border bg-gradient-to-br from-yellow-50 to-orange-50 p-8">
                <div className="mb-6 flex h-48 items-center justify-center">
                  <Image
                    src="/card3.png"
                    alt="Factory - Operationalize AI at scale"
                    width={200}
                    height={200}
                    className="object-contain"
                  />
                </div>
                <h3 className="mb-2 text-xl font-bold">Factory</h3>
                <p className="text-sm text-muted-foreground">
                  Operationalize AI at scale. Reliable, and business-ready.
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" className="bg-black text-white hover:bg-black/90">
                START BUILDING YOUR AGENT
              </Button>
              <Button size="lg" variant="outline">
                SEE AI CATALYST IN ACTION
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="text-center">
            <h2 className="mb-4 text-4xl font-bold text-balance">
              <span className="gradient-text">Choose Your Tech Stack</span>
            </h2>
            <p className="mb-12 text-muted-foreground text-balance">
              Deploy on your preferred cloud platform with enterprise-grade security
              <br />
              We support all major service providers to work seamlessly with your existing infrastructure
            </p>

            {/* Cloud Provider Logos */}
            <div className="mb-12 flex flex-wrap items-center justify-center gap-12">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded bg-orange-500" />
                <span className="font-semibold">AWS</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded bg-blue-500" />
                <span className="font-semibold">Microsoft Azure</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded bg-red-500" />
                <span className="font-semibold">Google Cloud</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded bg-gray-700" />
                <span className="font-semibold">GCP</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded bg-gray-500" />
                <span className="font-semibold">Others</span>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-lg border bg-white p-6 text-left">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Database className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mb-2 text-lg font-bold">Enterprise Security</h3>
                <p className="text-sm text-muted-foreground">SOC 2, GDPR, HIPAA compliant</p>
              </div>

              <div className="rounded-lg border bg-white p-6 text-left">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <Gauge className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="mb-2 text-lg font-bold">Auto Scaling</h3>
                <p className="text-sm text-muted-foreground">Scales with your needs automatically</p>
              </div>

              <div className="rounded-lg border bg-white p-6 text-left">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="mb-2 text-lg font-bold">24/7 Monitoring</h3>
                <p className="text-sm text-muted-foreground">Real-time performance tracking</p>
              </div>
            </div>

            <div className="mt-8">
              <Button size="lg" className="bg-black text-white hover:bg-black/90">
                EXPLORE ALL TECH STACK OPTIONS
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="text-center">
            <h2 className="mb-12 text-4xl font-bold">
              <span className="gradient-text">Accelerate growth with Tangram.ai</span>
            </h2>

            <div className="grid gap-12 md:grid-cols-2">
              {/* Vendors Card */}
              <div className="rounded-lg border bg-white p-8 text-left">
                <h3 className="mb-4 text-2xl font-bold">Tangram.ai Vendors</h3>
                <p className="mb-6 text-muted-foreground">
                  Our partner are certified Tangram.ai channel partner, technology partner, or independent software
                  vendor (ISV).
                </p>
                <Button variant="outline" onClick={() => openModal("vendor-login")}>
                  BECOME A VENDOR
                </Button>
              </div>

              {/* Reseller Card */}
              <div className="rounded-lg border bg-white p-8 text-left">
                <h3 className="mb-4 text-2xl font-bold">Tangram.ai Reseller</h3>
                <p className="mb-6 text-muted-foreground">
                  Our Reseller program allows you to access Tangram.ai resources, support and professional services for
                  your projects.
                </p>
                <Button variant="outline" onClick={() => openModal("reseller-login")}>
                  BECOME A RESELLER
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
