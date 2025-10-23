"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../../components/ui/button";
import ChatDialog from "../../components/chat-dialog";
import { Gauge, Settings, TrendingUp, CheckCircle2 } from "lucide-react";
import Head from "next/head";

export default function AICatalystPage() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Deployment Service - Tangram AI</title>
        <meta name="description" content="AI Catalyst deployment service for accelerating AI agent development" />
      </Head>
      <div className="flex flex-col">
      {/* Hero */}
      <section className="relative py-20">
        {/* Decorative gradient blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -z-10 inset-0"
        >
          <div
            className="absolute -top-10 -left-10 w-[420px] h-[280px] blur-3xl opacity-60"
            style={{
              background:
                "radial-gradient(70% 70% at 20% 20%, rgba(59,96,175,0.18) 0%, rgba(0,130,192,0.12) 40%, transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-0 right-0 w-[380px] h-[260px] blur-3xl opacity-60"
            style={{
              background:
                "radial-gradient(70% 70% at 80% 80%, rgba(121,53,244,0.16) 0%, rgba(154,70,129,0.10) 40%, transparent 70%)",
            }}
          />
        </div>
        <div className="mx-auto max-w-[1200px] px-6 text-center">
          <h1 className="mb-4 text-4xl md:text-5xl font-bold text-balance">
            <span className="gradient-text">AI CATALYST</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            From Idea to Impact - Fast. <br/> Built for enterprise teams who are ready to stop experimenting and start executing.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button className="bg-black text-white hover:bg-black/90" onClick={() => setChatOpen(true)}>
              Ask a question
            </Button>
            <Button asChild variant="outline">
              <Link href="#tracks">Learn how it works</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-12">
        <div className="mx-auto max-w-[1100px] px-6 text-center">
          <h2 className="mb-3 text-3xl font-bold text-balance">
            <span className="blue-gradient-text">Whether you’re exploring or scaling - Catalyst meets you where you are</span>
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Modular agents. Real data. Expert-led delivery. From whiteboard to working product - in weeks, not months.
          </p>
        </div>
      </section>

      {/* Tracks */}
      <section id="tracks" className="py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold">Each track is tailored to where you are in your AI journey</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Lab */}
            <div className="rounded-lg border bg-white p-6 text-left shadow-sm relative overflow-hidden">
              <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-10" style={{ background: "linear-gradient(270deg, #3B60AF 0%, #0082C0 100%)" }} />
              <div className="mb-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center text-white shadow-sm" style={{ background: "linear-gradient(270deg, #3B60AF 0%, #0082C0 100%)" }}>
                  <Gauge className="h-5 w-5" />
                </div>
                <div className="inline-flex items-center justify-center rounded-full bg-black px-3 py-1 text-xs text-white">LAB</div>
              </div>
              <h4 className="text-xl font-semibold mb-1">From Idea to Working Prototype</h4>
              <p className="text-sm text-muted-foreground mb-4">Quick sprints to explore use cases, validate ideas, and show early wins.</p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                <li>Ideation workshops</li>
                <li>Tangram agent configuration</li>
                <li>Data feasibility check</li>
                <li>ROI framing</li>
              </ul>
              <div className="mt-4 text-xs text-muted-foreground">~2 weeks | Early Stage , high-impact</div>
            </div>

            {/* Foundry */}
            <div className="rounded-lg border bg-white p-6 text-left shadow-sm relative overflow-hidden">
              <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-10" style={{ background: "linear-gradient(270deg, #3B60AF 0%, #0082C0 100%)" }} />
              <div className="mb-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center text-white shadow-sm" style={{ background: "linear-gradient(270deg, #3B60AF 0%, #0082C0 100%)" }}>
                  <Settings className="h-5 w-5" />
                </div>
                <div className="inline-flex items-center justify-center rounded-full bg-black px-3 py-1 text-xs text-white">FOUNDRY</div>
              </div>
              <h4 className="text-xl font-semibold mb-1">From Prototype to Pilot</h4>
              <p className="text-sm text-muted-foreground mb-4">Build secure, customized workflows that plug into your data and systems.</p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                <li>Custom agent workflows</li>
                <li>Real-time data integrations</li>
                <li>Human-in-loop controls</li>
                <li>Pilot dashboards & feedback</li>
              </ul>
              <div className="mt-4 text-xs text-muted-foreground">~4–6 weeks | Tangram meets your tech stack</div>
            </div>

            {/* Factory */}
            <div className="rounded-lg border bg-white p-6 text-left shadow-sm relative overflow-hidden">
              <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-10" style={{ background: "linear-gradient(270deg, #3B60AF 0%, #0082C0 100%)" }} />
              <div className="mb-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center text-white shadow-sm" style={{ background: "linear-gradient(270deg, #3B60AF 0%, #0082C0 100%)" }}>
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div className="inline-flex items-center justify-center rounded-full bg-black px-3 py-1 text-xs text-white">FACTORY</div>
              </div>
              <h4 className="text-xl font-semibold mb-1">From Pilot to Production</h4>
              <p className="text-sm text-muted-foreground mb-4">Enterprise-grade deployments that scale — with security, analytics, and impact tracking.</p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                <li>Full-stack implementation</li>
                <li>Governance and compliance</li>
                <li>Agent performance monitoring</li>
                <li>Ongoing support + updates</li>
              </ul>
              <div className="mt-4 text-xs text-muted-foreground">~6–10 weeks | Built for scale</div>
            </div>
          </div>
        </div>
      </section>

      {/* Who is it for? */}
      <section className="py-16">
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold">
              <span className="blue-gradient-text">Who is it for?</span>
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-lg border bg-white p-4 flex items-start gap-3">
              <div className="mt-0.5 text-[#3B60AF]">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="text-sm text-gray-800">Enterprises with big AI goals, but no clear roadmap</div>
            </div>
            <div className="rounded-lg border bg-white p-4 flex items-start gap-3">
              <div className="mt-0.5 text-[#3B60AF]">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="text-sm text-gray-800">Leaders who need proof of value before going all-in</div>
            </div>
            <div className="rounded-lg border bg-white p-4 flex items-start gap-3">
              <div className="mt-0.5 text-[#3B60AF]">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="text-sm text-gray-800">Teams stuck at POC purgatory</div>
            </div>
            <div className="rounded-lg border bg-white p-4 flex items-start gap-3">
              <div className="mt-0.5 text-[#3B60AF]">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="text-sm text-gray-800">Anyone who wants GenAI that works inside your real world</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why it works */}
      <section className="py-12">
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold">
              <span className="blue-gradient-text">Why it works</span>
            </h3>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <li className="rounded-md border bg-white p-4">✔ 100+ Prebuilt Agents: Hit the ground running with ready-to-use AI solutions.</li>
            <li className="rounded-md border bg-white p-4">✔ Tangram Platform: Accelerate deployment and reduce costs with streamlined infrastructure.</li>
            <li className="rounded-md border bg-white p-4">✔ Expert-led: Delivered by product and data teams who understand your goals.</li>
            <li className="rounded-md border bg-white p-4">✔ Measurable Impact: Track ROI, adoption, and tangible outcomes.</li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 relative">
        {/* Decorative gradient blob */}
        <div
          aria-hidden
          className="pointer-events-none absolute -z-10 inset-0"
        >
          <div
            className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[520px] h-[320px] blur-3xl opacity-50"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 50%, rgba(59,96,175,0.16) 0%, rgba(0,130,192,0.10) 40%, transparent 75%)",
            }}
          />
        </div>
        <div className="mx-auto max-w-[1100px] px-6 text-center">
          <div className="mb-3 text-2xl font-bold">
            <span className="blue-gradient-text">Ready to move fast?</span>
          </div>
          <p className="text-muted-foreground mb-6">Bring your AI vision to life — with real data, real systems, and real outcomes.</p>
          <Button className="bg-black text-white hover:bg-black/90" onClick={() => setChatOpen(true)}>Ask a question</Button>
        </div>
      </section>

      <ChatDialog open={chatOpen} onOpenChange={setChatOpen} initialMode="create" />
    </div>
    </>
  );
}


