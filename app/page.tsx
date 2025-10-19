"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/badge";
import { Search, Mic, Database, Gauge, Clock, Cloud, Settings } from "lucide-react";
import { useModal } from "@/hooks/use-modal";
import { useState } from "react";
import ChatDialog from "@/components/chat-dialog";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  const { openModal } = useModal();
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      
        <section className="relative min-h-screen py-24 flex items-center">
        {/* Background image with gradient overlay (Next.js Image for optimization) */}
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-white">
          <div className="relative w-full h-full">
            <Image
              src="/gradiant_image.png"
              alt=""
              fill
              className="object-cover object-right"
              priority
            />
            {/* Light overlay so image remains visible while keeping contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/0" />
          </div>
        </div>
        <div className="mx-auto max-w-[1280px] px-6 w-full">
          <div className="text-center">
            <h1 className="mb-20 text-5xl font-bold text-balance md:text-6xl">
              <span className="radial-gradient-text">
                Explore Our AI Agent Store
              </span>
            </h1>
            {/* <p className="mb-8 text-lg text-muted-foreground text-balance text-[#374151]  ">
              Explore AI-powered agents built to automate workflows — helping
              your team work <br /> smarter and faster every day.
            </p> */}

            {/* Search Bar */}
            <div className="mx-auto mb-8 flex max-w-4xl items-center gap-2 rounded-full border bg-white p-1 shadow-sm cursor-text" onClick={() => setChatOpen(true)}>
              <Search className="ml-2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="I want an agent to review NDAs"
                className="border-0 focus-visible:ring-0"
              />
              <Button size="icon" variant="ghost">
                <Mic className="h-5 w-5" />
              </Button>
            </div>
            <ChatDialog open={chatOpen} onOpenChange={setChatOpen} initialMode="explore" />

            {/* Category Tags */}
            <div className="mb-6 text-sm text-muted-foreground">
              150+ AI agents & Solutions Available
            </div>
            <div className="mb-8 relative overflow-hidden">
              <div className="flex animate-scroll">
                {/* Frame 1 */}
                <div className="min-w-full flex flex-wrap items-center justify-center gap-2">
                  <Badge dotColorClassName="bg-blue-500">Conversational AI & Advisory</Badge>
                  <Badge dotColorClassName="bg-purple-500">Document Planning & Analysis</Badge>
                  <Badge dotColorClassName="bg-emerald-500">Image processing</Badge>
                  <Badge dotColorClassName="bg-amber-500">Audio Processing</Badge>
                  <Badge dotColorClassName="bg-rose-500">Lead and Meeting</Badge>
                  <Badge dotColorClassName="bg-indigo-500">Data Analysis and Insights</Badge>
                  <Badge dotColorClassName="bg-pink-500">Content generation</Badge>
                  <Badge dotColorClassName="bg-teal-500">Process Automation</Badge>
                  <Badge dotColorClassName="bg-sky-500">Data Transformation</Badge>
                </div>
                {/* Frame 2 duplicate for seamless loop */}
                <div className="min-w-full flex flex-wrap items-center justify-center gap-2">
                  <Badge dotColorClassName="bg-blue-500">Conversational AI & Advisory</Badge>
                  <Badge dotColorClassName="bg-purple-500">Document Planning & Analysis</Badge>
                  <Badge dotColorClassName="bg-emerald-500">Image processing</Badge>
                  <Badge dotColorClassName="bg-amber-500">Audio Processing</Badge>
                  <Badge dotColorClassName="bg-rose-500">Lead and Meeting</Badge>
                  <Badge dotColorClassName="bg-indigo-500">Data Analysis and Insights</Badge>
                  <Badge dotColorClassName="bg-pink-500">Content generation</Badge>
                  <Badge dotColorClassName="bg-teal-500">Process Automation</Badge>
                  <Badge dotColorClassName="bg-sky-500">Data Transformation</Badge>
                </div>
              </div>
            </div>

            <Button asChild size="lg" className="bg-black text-white hover:bg-black/90">
              <Link href="/agents">EXPLORE OUR AGENTS</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Stop Searching Section */}
      <section className="py-20">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="text-center">
            <h2 className="mb-4 text-4xl font-bold text-balance">
              <span className="gradient-text">Find. Try. Launch.</span>
            </h2>
            <p className="mb-20 text-muted-foreground max-w-2xl mx-auto">Your journey to scaling AI-solutions starts here.</p>

            {/* Interactive stepper (non-card) */}
            <div className="relative mx-auto max-w-5xl">
              {/* Connector line */}
              <div className="hidden lg:block absolute top-6 left-0 right-0 h-1 rounded-full" style={{background: "linear-gradient(90deg, #7c3aed 0%, #ec4899 100%)"}} />

              <ul className="grid grid-cols-1 gap-8 lg:grid-cols-4 lg:gap-6">
                <li className="relative">
                  <div className="flex items-start lg:flex-col lg:items-center text-left lg:text-center gap-3">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full text-white shadow-sm shrink-0" style={{background: "linear-gradient(90deg, #7c3aed 0%, #ec4899 100%)"}}>1</span>
                    <div>
                      <div className="font-semibold">Find your use case</div>
                      <div className="text-sm text-muted-foreground">Explore ready-made industry use cases.</div>
                    </div>
                  </div>
                </li>
                <li className="relative">
                  <div className="flex items-start lg:flex-col lg:items-center text-left lg:text-center gap-3">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full text-white shadow-sm shrink-0" style={{background: "linear-gradient(90deg, #7c3aed 0%, #ec4899 100%)"}}>2</span>
                    <div>
                      <div className="font-semibold">Try an agent</div>
                      <div className="text-sm text-muted-foreground">Test the right AI copilot for your need.</div>
                    </div>
                  </div>
                </li>
                <li className="relative">
                  <div className="flex items-start lg:flex-col lg:items-center text-left lg:text-center gap-3">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full text-white shadow-sm shrink-0" style={{background: "linear-gradient(90deg, #7c3aed 0%, #ec4899 100%)"}}>3</span>
                    <div>
                      <div className="font-semibold">Pick your stack</div>
                      <div className="text-sm text-muted-foreground">Choose your preferred platform or model.</div>
                    </div>
                  </div>
                </li>
                <li className="relative">
                  <div className="flex items-start lg:flex-col lg:items-center text-left lg:text-center gap-3">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full text-white shadow-sm shrink-0" style={{background: "linear-gradient(90deg, #7c3aed 0%, #ec4899 100%)"}}>4</span>
                    <div>
                      <div className="font-semibold">Launch your trial</div>
                      <div className="text-sm text-muted-foreground">Experience the future of work in minutes.</div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
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
                  Experiment fast. Validate use cases. Prove value in weeks, not
                  years.
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
                  Scale successful pilots with enterprise-grade governance and
                  compliance.
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
              <Button
                size="lg"
                className="bg-black text-white hover:bg-black/90"
                onClick={() => setChatOpen(true)}
              >
                START BUILDING YOUR AGENT
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/ai-catalyst">SEE AI CATALYST IN ACTION</Link>
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
                  <span className="inline-block mb-3 px-3 py-1  text-sm font-medium" style={{ backgroundColor: '#E6EDFD', color: '#0f172a' }}>Become an AI ISV</span>
                  <h3 className="mb-2 text-xl font-bold">Tangram.ai ISV</h3>
                  <p className="text-sm text-muted-foreground">Our partners are certified Tangram.ai channel partners, technology partners, or independent software vendors (ISV).</p>
                </div>
                <div className="flex justify-start">
                  <Button variant="outline" onClick={() => openModal("vendor-login")} className="px-4 py-2">BECOME A ISV</Button>
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
