"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/badge";
import { Search, Mic, Database, Gauge, Clock, Cloud, Settings } from "lucide-react";
import { useModal } from "@/hooks/use-modal";
import { useState } from "react";
import ChatDialog from "@/components/chat-dialog";
import Image from "next/image";

export default function HomePage() {
  const { openModal } = useModal();
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      
        <section className="relative py-20 min-h-[560px]">
        {/* Background image with gradient overlay (Next.js Image for optimization) */}
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-white">
          <div className="relative w-full h-full">
            <Image
              src="/gradiant_image.png"
              alt=""
              fill
              className="object-cover"
              priority
            />
            {/* Light overlay so image remains visible while keeping contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-white/20" />
          </div>
        </div>
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="text-center">
            <h1 className="mb-4 text-5xl font-bold text-balance md:text-6xl">
              <span className="gradient-text">
                Explore Our AI Agent Marketplace
              </span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground text-balance text-[#374151]  ">
              Explore AI-powered agents built to automate workflows — helping
              your team work <br /> smarter and faster every day.
            </p>

            {/* Search Bar */}
            <div className="mx-auto mb-8 flex max-w-4xl items-center gap-2 rounded-full border bg-white p-1 shadow-sm cursor-text" onClick={() => setChatOpen(true)}>
              <Search className="ml-2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Tell us About your Business Needs"
                className="border-0 focus-visible:ring-0"
              />
              <Button size="icon" variant="ghost">
                <Mic className="h-5 w-5" />
              </Button>
            </div>
            <ChatDialog open={chatOpen} onOpenChange={setChatOpen} />

            {/* Category Tags */}
            <div className="mb-6 text-sm text-muted-foreground">
              150+ AI agents & Solutions Available
            </div>
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
              <span className="gradient-text">
                Accelerate Deployment of Your Own Agents using AI Catalyst
              </span>
            </h2>
            <p className="mb-12 text-lg text-muted-foreground text-balance text-[#111827]">
              AI Catalyst is our ideation engine that ensures AI delivery
              memorable impact across the enterprise.
            </p>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Labs Card */}
              <div className="rounded-lg border border-gray-200 shadow-sm bg-gradient-to-br from-pink-300 to-purple-50 p-8">

                <div
                  style={{
                    paddingLeft: 16,
                    paddingRight: 16,
                    paddingTop: 16,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{ position: "relative", width: 288, height: 240 }}
                  >
                    <img
                      src="/card1.png"
                      alt="Labs preview"
                      style={{
                        objectFit: "contain",
                        width: "100%",
                        height: "100%",
                        borderRadius: 8,
                      }}
                    />
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold">Labs</h3>
                <p className="text-sm text-muted-foreground">
                  Experiment fast. Validate use cases. Prove value in weeks, not
                  years.
                </p>
              </div>

              {/* Foundry Card */}
              <div className="rounded-lg border bg-gradient-to-br from-blue-200 to-cyan-100 p-8">
                <div
                  style={{
                    paddingLeft: 16,
                    paddingRight: 16,
                    paddingTop: 16,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{ position: "relative", width: 288, height: 240 }}
                  >
                    <img
                      src="/card2.png"
                      alt="Labs preview"
                      style={{
                        objectFit: "contain",
                        width: "100%",
                        height: "100%",
                        borderRadius: 8,
                      }}
                    />
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold">Foundry</h3>
                <p className="text-sm text-muted-foreground">
                  Scale successful pilots with enterprise-grade governance and
                  compliance.
                </p>
              </div>

              {/* Factory Card */}
              <div className="rounded-lg border bg-gradient-to-br from-yellow-200 to-orange-50 p-8">
                <div
                  style={{
                    paddingLeft: 16,
                    paddingRight: 16,
                    paddingTop: 16,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{ position: "relative", width: 288, height: 240 }}
                  >
                    <img
                      src="/card3.png"
                      alt="Labs preview"
                      style={{
                        objectFit: "contain",
                        width: "100%",
                        height: "100%",
                        borderRadius: 20,
                      }}
                    />
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold">Factory</h3>
                <p className="text-sm text-muted-foreground">
                  Operationalize AI at scale. Reliable, and business-ready.
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <Button
                size="lg"
                className="bg-black text-white hover:bg-black/90"
              >
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
              Deploy on your preferred cloud platform with enterprise-grade
              security
              <br />
              We support all major service providers to work seamlessly with
              your existing infrastructure
            </p>
            <div className="mb-12 grid gap-8 md:grid-cols-2 md:items-center">
              <div className="flex justify-center md:justify-start">
                <div style={{ position: "relative", width: 486, height: 400 }}>
                  <img
                    src="/tech.png"
                    alt="Labs preview"
                    style={{
                      objectFit: "contain",
                      width: "100%",
                      height: "100%",
                      borderRadius: 8,
                    }}
                  />
                </div>
              </div>

              {/* Cloud Provider Logos (right column) - white card tiles, 2 per row */}
              <div className="flex items-start justify-start md:justify-start">
                <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-[420px]">
                  {/* Card 1: AWS (vertical) */}
                  <div className="flex flex-col items-start text-left bg-white p-4 rounded-lg shadow-sm">
                    <div className="h-12 w-12 relative mb-3">
                      <Image src="/aws.png" alt="AWS" fill className="object-contain" />
                    </div>
                    <div className="font-semibold">AWS</div>
                    <div className="text-sm text-muted-foreground">Amazon Web <br />Services</div>
                  </div>

                  {/* Card 2: Microsoft Azure (vertical) */}
                  <div className="flex flex-col items-start text-left bg-white p-4 rounded-lg shadow-sm">
                    <div className="h-12 w-12 relative mb-3">
                      <Image src="/azur.png" alt="Azure" fill className="object-contain" />
                    </div>
                    <div className="font-semibold">Microsoft Azure</div>
                    <div className="text-sm text-muted-foreground">Azure cloud <br /> services</div>
                  </div>

                  {/* Card 3: GCP (vertical) */}
                  <div className="flex flex-col items-start text-left bg-white p-4 rounded-lg shadow-sm">
                    <Cloud className="h-8 w-8 text-gray-700 mb-2" />
                    <div className="font-semibold">GCP</div>
                    <div className="text-sm text-muted-foreground">Google Cloud <br /> Platform</div>
                  </div>

                  {/* Card 4: Others (vertical) */}
                  <div className="flex flex-col items-start text-left bg-white p-4 rounded-lg shadow-sm">
                    <Settings className="h-8 w-8 text-gray-700 mb-2" />
                    <div className="font-semibold">Others</div>
                    <div className="text-sm text-muted-foreground">third-party & custom integrations</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-white p-6 min-h-[96px] text-left flex items-center gap-4">
                <div className="h-12 w-12 relative flex-shrink-0">
                  <Image src="/enterpriser_security.png" alt="Enterprise Security" fill className="object-contain" />
                </div>
                <div>
                  <h3 className="mb-1 text-md font-semibold">Enterprise Security</h3>
                  <p className="text-sm text-muted-foreground">SOC 2, GDPR, HIPAA <br />compliant</p>
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 min-h-[96px] text-left flex items-center gap-4">
                <div className="h-12 w-12 relative flex-shrink-0">
                  <Image src="/auto_scaling.png" alt="Auto Scaling" fill className="object-contain" />
                </div>
                <div>
                  <h3 className="mb-1 text-md font-semibold">Auto Scaling</h3>
                  <p className="text-sm text-muted-foreground">Scales with your <br />needs automatically</p>
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 min-h-[96px] text-left flex items-center gap-4">
                <div className="h-12 w-12 relative flex-shrink-0">
                  <Image src="/monitoring.png" alt="Monitoring" fill className="object-contain" />
                </div>
                <div>
                  <h3 className="mb-1 text-md font-semibold">24/7 Monitoring</h3>
                  <p className="text-sm text-muted-foreground">Real-time performance<br /> tracking</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button
                size="lg"
                className="bg-black text-white hover:bg-black/90"
              >
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
            <h2 className="mb-4 text-4xl font-bold text-[#181818] max-w-xl mx-auto whitespace-nowrap">
              Accelerate growth with Tangram.ai
            </h2>
            <p className="mb-6 text-sm text-[ #65717C ] leading-relaxed max-w-4xl md:max-w-5xl w-full px-4 sm:px-6 mx-auto" style={{color: '#65717C'}}>
              Our Partners are at the forefront of Enterprise AI transformation, and their success stories speak volumes. By partnering with Tangram.ai, they have helped businesses like yours reimagine how work gets done, service is delivered, and processes are automated, delivering real business value with AI.
            </p>

            <div className="flex flex-col md:flex-row md:justify-center md:items-start gap-6 md:gap-12">
              {/* Vendors Card */}
              <div className="bg-gray-50 rounded-lg shadow-sm p-6 w-[472px] h-[275px] flex flex-col justify-between text-left">
                <div>
                  <span className="inline-block mb-3 px-3 py-1  text-sm font-medium" style={{ backgroundColor: '#E6EDFD', color: '#0f172a' }}>Become an AI Vendor</span>
                  <h3 className="mb-2 text-xl font-bold">Tangram.ai Vendors</h3>
                  <p className="text-sm text-muted-foreground">Our partners are certified Tangram.ai channel partners, technology partners, or independent software vendors (ISV).</p>
                </div>
                <div className="flex justify-start">
                  <Button variant="outline" onClick={() => openModal("vendor-login")} className="px-4 py-2">BECOME A VENDOR</Button>
                </div>
              </div>

              {/* Reseller Card */}
              <div className="bg-gray-50 rounded-lg shadow-sm p-6 w-[472px] h-[275px] flex flex-col justify-between text-left">
                <div>
                  <span className="inline-block mb-3 px-3 py-1  text-sm font-medium" style={{ backgroundColor: '#E6EDFD', color: '#0f172a' }}>Become an AI Reseller</span>
                  <h3 className="mb-2 text-xl font-bold">Tangram.ai Reseller</h3>
                  <p className="text-sm text-muted-foreground">Our Reseller program allows you to access Tangram.ai resources, support and professional services for your projects.</p>
                </div>
                <div className="flex justify-start">
                  <Button variant="outline" onClick={() => openModal("reseller-login")} className="px-4 py-2">BECOME A RESELLER</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
