"use client";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/badge";
import { Search, Mic, Database, Gauge, Clock, Cloud, Settings, Shield, Rocket, CheckCircle2, ChevronDown } from "lucide-react";
import { useModal } from "../hooks/use-modal";
import { useState } from "react";
import ChatDialog from "../components/chat-dialog";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  const { openModal } = useModal();
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="flex flex-col">
      {/* Hero Section (Agents hero moved here) */}
      <section className="relative py-20 min-h-[80vh] flex items-center">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <img src="/gradiant%20image%20right.png" alt="" className="h-full w-full object-cover" />
        </div>
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="text-center">
            <h1 className="mb-4 mt-20 font-inter font-extrabold text-[64px] leading-[110%] tracking-[-0.02em] text-balance">
              <span
                style={{
                  background:
                    "radial-gradient(80.73% 80.73% at 3.12% 25.58%, #7935F4 0%, #9A4681 49.5%, #614BDB 96.87%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Accelerate AI Success.
              </span>
            </h1>
            <h2 className="mb-4 text-[32px] font-semibold leading-[120%] tracking-[-0.01em] text-balance" style={{ color: "#374151", fontFamily: "Inter, sans-serif" }}>
              With the Tangram Generative + Agentic AI platform.
            </h2>
            <p className="mb-2 mt-28 text-balance text-[18px] font-normal leading-[150%] tracking-[0]" style={{ color: "#374151", fontFamily: "Inter, sans-serif" }}>
              Unlock the value of enterprise data and enable customer engagement
              at an individual level. Our comprehensive suite of AI agents
              drives business transformation.
            </p>

            

            <div className="mt-30 flex flex-col items-center gap-3">
              <div className="text-sm font-medium">Our Enterprise AI Partners</div>
              <div className="flex items-center gap-6">
                <img src="/crayon_bw.png" alt="crayon" width={113} height={24} className="bg-transparent object-contain grayscale opacity-80" />
                <img src="/veehive_bw.png" alt="veehive" width={113} height={24} className="bg-transparent object-contain grayscale opacity-80" />
                <img src="/mozak_bw.png" alt="mozak" width={113} height={24} className="bg-transparent object-contain grayscale opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </section>
      

      {/* Stop Searching Section */}
      <section className="py-20 min-h-[70vh] flex items-center">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="text-center">
            <h2 className="mb-4 text-4xl font-bold text-balance">
              <span className="gradient-text">
AI success made easy. </span>
            </h2>
            <p className="mb-20 text-muted-foreground max-w-2xl mx-auto">Find. Try. Pick. Launch.</p>

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
      <section className="py-20 min-h-[80vh] flex items-center">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="text-center">
            <h2 className="mb-6 text-4xl font-bold text-balance">
              <span className="gradient-text">
                Accelerate Deployment of Your Own Agents using AI Catalyst
              </span>
            </h2>
            {/* Subheader bullets (pill chips) */}
            <div className="mx-auto mb-6 grid max-w-5xl grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              <div className="flex items-center gap-3 rounded-full border bg-white/80 backdrop-blur px-4 py-2 shadow-sm">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full text-white shadow-sm" style={{background: "linear-gradient(90deg, #7c3aed 0%, #ec4899 100%)"}}>
                  <Shield className="h-4 w-4" />
                </span>
                <div className="text-sm font-medium">Reduce risks.</div>
              </div>
              <div className="flex items-center gap-3 rounded-full border bg-white/80 backdrop-blur px-4 py-2 shadow-sm">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full text-white shadow-sm" style={{background: "linear-gradient(90deg, #7c3aed 0%, #ec4899 100%)"}}>
                  <Rocket className="h-4 w-4" />
                </span>
                <div className="text-sm font-medium">Accelerate adoption.</div>
              </div>
              <div className="flex items-center gap-3 rounded-full border bg-white/80 backdrop-blur px-4 py-2 shadow-sm">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full text-white shadow-sm" style={{background: "linear-gradient(90deg, #7c3aed 0%, #ec4899 100%)"}}>
                  <CheckCircle2 className="h-4 w-4" />
                </span>
                <div className="text-sm font-medium">Your data, your guardrails, our agents, our models.</div>
              </div>
            </div>
            <div className="mb-8 text-xs md:text-sm text-muted-foreground max-w-3xl mx-auto">
              Worried about hallucinations? Or data security? Catalyst is designed to address them.
            </div>
            {/* <p className="mb-12 text-lg text-muted-foreground text-balance text-[#111827]">
              AI Catalyst is our ideation engine that ensures AI delivery
              memorable impact across the enterprise.
            </p> */}

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
      <section className="bg-gradient-to-b from-white to-gray-50 py-20 min-h-[80vh] flex items-center">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="text-center">
            <h2 className="mb-4 text-4xl font-bold text-balance">
              <span className="gradient-text">Pick Your Tech Stack</span>
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
      <section className="py-20 min-h-[70vh] flex items-center">
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
                  <Button variant="outline" onClick={() => openModal("auth", { mode: "signup", role: "isv" })} className="px-4 py-2">BECOME A ISV</Button>
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
                  <Button variant="outline" onClick={() => openModal("auth", { mode: "signup", role: "reseller" })} className="px-4 py-2">BECOME A RESELLER</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
