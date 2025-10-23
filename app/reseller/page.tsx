"use client"

import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion"
import { Input } from "../../components/ui/input"
import { ArrowRight, Target, Globe, TrendingUp } from "lucide-react"
import Image from "next/image"
import { useModal } from "../../hooks/use-modal"

export default function ResellerPage() {
    const { openModal } = useModal()
    return (
        <div className="min-h-screen">
            {/* Hero Section with Gradient */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
                <div className="mx-auto max-w-[1280px] px-6 py-20 relative">
                    {/* Decorative A badges */}

                    <div className="max-w-2xl">
                        <h1 className="text-5xl font-bold mb-6 text-balance">Drive new revenue with AI offerings from 1000+ ISVs </h1>
                        <p className="text-xl mb-4 font-medium"> Join Tangram.ai Enterprise Agents Reseller Program Accelerator. </p>
                        <p className="text-gray-700 mb-8 leading-relaxed">
                            Start referring or integrating agents from Tangram.ai store with your clients today to unlock new revenue opportunities, accelerate growth, and deliver intelligent AI solutions at scale.
                        </p>
                        <div className="flex gap-4">
                            {/* <Button size="lg" className="bg-black text-white hover:bg-gray-800" onClick={() => openModal("auth", { mode: "signup", role: "reseller" })}>
                            Become a tangram reseller
                            </Button> */}
                            <Button size="lg"  onClick={() => openModal("auth", { mode: "login", role: "reseller" })}>
                                LOGIN TO RESELLER HUB
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Removed scrolling banner of icons for a cleaner layout */}

            {/* Build the Future Together */}
            <section className="bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">

           
            <section className="py-16 relative">
                <div className="mx-auto max-w-[1280px] px-6 text-center pt-12">
                    <h2 className="text-4xl font-bold mb-4">Are You a Good Fit?</h2>
                    <p className="text-gray-700 leading-relaxed">
                        You’re a good fit for the Tangram.ai Reseller Program if you help clients adopt AI-driven solutions and want to expand your portfolio with enterprise-ready intelligence.
                    </p>
                </div>
            </section>

            {/* Three Feature Cards */}
            <section className="py-16">
                <div className="mx-auto max-w-[1280px] px-6">
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="p-8 border-2 bg-white">
                            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
                                <Target className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">AI Consultants & Solution Providers</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Work with our partner ecosystem and
                                access industry expertise and resources to
                                help you achieve exceptional results.
                            </p>
                        </Card>

                        <Card className="p-8 border-2 bg-white">
                            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
                                <Globe className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">IT Consultants & Service Providers</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Enter new markets while accelerating your
                                business’s international reach with global
                                partners or local experts.
                            </p>
                        </Card>

                        <Card className="p-8 border-2 bg-white">
                            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">AI Enterprise and GTM Agencies</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Reduce time to deployment and accelerate
                                projects with pre-configured, industry
                                specific solutions
                            </p>
                        </Card>
                    </div>
                </div>
            </section>
            </section>

            {/* Discover Partnerships */}
            <section className="bg-gray-50 py-16 relative">
                <div className="mx-auto max-w-[1280px] px-6">
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        {/* Left side - Text content (50%) */}
                        <div className="flex-1 md:w-1/2">
                            <h2 className="text-3xl font-bold mb-6">Benefits of Reseller Partnership</h2>
                            <p className="text-gray-600 leading-relaxed">
                            Partnering with Tangram.ai unlocks new revenue streams, faster deal cycles, and access to enterprise-ready AI solutions. Resellers gain co-selling support, marketing enablement, and dedicated partner success resources — empowering them to deliver intelligent, scalable value to every client.
                            </p>
                        </div>

                        {/* Right side - Benefits as interactive cards (50%) */}
                        <div className="flex-1 md:w-1/2 flex justify-center">
                            <div className="grid grid-cols-1 gap-4 w-full max-w-[520px]">
                                <Card className="p-6 hover:shadow-md transition-all border bg-white/90">
                                    <div className="flex items-start gap-3">
                                        <div className="h-10 w-10 rounded-lg flex items-center justify-center text-white shrink-0"
                                             style={{ background: "linear-gradient(270deg, #3B60AF 0%, #0082C0 100%)" }}>
                                            <Target className="h-5 w-5" />
                                            </div>
                                            <div>
                                            <h4 className="text-sm font-bold mb-1 tracking-wide">GAIN MARKET ACCESS</h4>
                                            <p className="text-sm text-gray-700">Meet the right stakeholders and get their time and attention. Gain streamlined access to key enterprises and sell business value to CEOs and business decision makers directly.</p>
                                            </div>
                                        </div>
                                    </Card>

                                <Card className="p-6 hover:shadow-md transition-all border bg-white/90">
                                    <div className="flex items-start gap-3">
                                        <div className="h-10 w-10 rounded-lg flex items-center justify-center text-white shrink-0"
                                             style={{ background: "linear-gradient(270deg, #3B60AF 0%, #0082C0 100%)" }}>
                                            <TrendingUp className="h-5 w-5" />
                                            </div>
                                            <div>
                                            <h4 className="text-sm font-bold mb-1 tracking-wide">DEMONSTRATE RAPID OUTCOMES</h4>
                                            <p className="text-sm text-gray-700">Get access to their data to show exactly how valuable you can be to their business. Ability to deliver rapid outcomes to enterprises and realize faster ROI on your products by building on top of our foundational components.</p>
                                            </div>
                                        </div>
                                    </Card>

                                <Card className="p-6 hover:shadow-md transition-all border bg-white/90">
                                    <div className="flex items-start gap-3">
                                        <div className="h-10 w-10 rounded-lg flex items-center justify-center text-white shrink-0"
                                             style={{ background: "linear-gradient(270deg, #3B60AF 0%, #0082C0 100%)" }}>
                                            <Globe className="h-5 w-5" />
                                            </div>
                                            <div>
                                            <h4 className="text-sm font-bold mb-1 tracking-wide">STREAMLINE MULTIPLE PROCESSES</h4>
                                            <p className="text-sm text-gray-700">Streamline sales, legal and procurement processes and reduce cost of sale and sales cycle. Experience the smoothest commercial processes of vendor registration.</p>
                                            </div>
                                        </div>
                                    </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

      {/* Testimonials */}
      <section className="bg-white py-16 relative">
        <div className="mx-auto max-w-[1280px] px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">Reseller Testimonials</h2>

          <div className="bg-white border-2 rounded-lg p-12">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="w-full md:w-1/2 flex justify-center md:justify-start">
                <div className="relative w-[320px] h-[120px] md:w-[420px] md:h-[140px]">
                  <Image src="/mozak_bw.png" alt="Mozark" fill className="object-contain" />
                </div>
              </div>
              <div className="w-full md:w-1/2 relative">
                <h3 className="font-bold text-lg mb-4">Mozark</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Partnering with Tangram.ai has accelerated outcomes beyond expectations. Within months, the collaboration has become core to every growth motion we run. Our shared customer obsession drives perfect alignment across every deal — leading to faster closes, higher conversions, and expanded opportunities that power scalable, efficient growth.”
                </p>
                <p
                  style={{
                    fontFamily: 'Arial, sans-serif',
                    fontWeight: 700,
                    fontSize: 14,
                    lineHeight: '20px',
                    letterSpacing: 0,
                    verticalAlign: 'middle',
                    color: '#232B37',
                  }}
                >
                  — Chandrasekar Ramamoorthy, CTO
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-8">
            <div className="w-2 h-2 bg-black rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </section>

            {/* FAQ Section */}
            <section className="bg-gray-50 py-16 relative">
                <div className="mx-auto max-w-[1280px] px-6">
                    <div className="flex flex-col md:flex-row gap-12 items-start">
                        {/* Left side - Title (50%) */}
                        <div className="flex-1 md:w-1/2">
                            <h2 className="text-3xl font-bold mb-2">Frequently Asked Questions</h2>
                            <p className="text-xl">FAQs</p>
                        </div>

                        {/* Right side - FAQ Accordion (50%) */}
                        <div className="flex-1 md:w-1/2">
                            <Accordion type="single" collapsible className="space-y-4">
                                <AccordionItem value="item-1" className="bg-white border rounded-lg px-6">
                                    <AccordionTrigger className="text-left font-semibold hover:no-underline">
                                        Incentives and Perks
                                    </AccordionTrigger>
                                    <AccordionContent className="text-gray-600">
                                        Reseller partners receive exclusive benefits including co-marketing opportunities, technical support,
                                        marketplace visibility, and revenue sharing programs.
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-2" className="bg-white border rounded-lg px-6">
                                    <AccordionTrigger className="text-left font-semibold hover:no-underline">
                                        Drive visibility with Tangram.ai Sales
                                    </AccordionTrigger>
                                    <AccordionContent className="text-gray-600">
                                        Get direct access to our sales team, participate in joint customer meetings, and leverage our
                                        extensive customer network to accelerate your growth.
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-3" className="bg-white border rounded-lg px-6">
                                    <AccordionTrigger className="text-left font-semibold hover:no-underline">
                                        Focused co-sell support and resources
                                    </AccordionTrigger>
                                    <AccordionContent className="text-gray-600">
                                        Access dedicated partner managers, sales enablement materials, and co-selling resources to maximize
                                        your success in the marketplace.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="bg-white py-16">
                <div className="mx-auto max-w-[1280px] px-6">
                    <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-2">
                                Interested in working together, trying our platform or simply have questions?
                            </h2>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-600 mb-3">Just send us your contact email and we will contact you.</p>
                            <div className="flex gap-2">
                                <Input type="email" placeholder="your email" className="flex-1" />
                                <Button size="icon" className="bg-black text-white hover:bg-gray-800">
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}


