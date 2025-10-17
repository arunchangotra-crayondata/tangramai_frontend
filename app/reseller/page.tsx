import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { ArrowRight, Target, Globe, TrendingUp } from "lucide-react"

export default function ResellerPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section with Gradient */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
                <div className="mx-auto max-w-[1280px] px-6 py-20 relative">
                    {/* Decorative A badges */}

                    <div className="max-w-2xl">
                        <h1 className="text-5xl font-bold mb-6 text-balance">Tangram.ai Enterprise Agent Reseller Program</h1>
                        <p className="text-xl mb-4 font-medium">Drive a new revenue with AI offering</p>
                        <p className="text-gray-700 mb-8 leading-relaxed">
                            Start referring or integrating Tangram.ai with your clients today to unlock new revenue opportunities, accelerate growth, and deliver intelligent AI solutions at scale.
                        </p>
                        <div className="flex gap-4">
                            <Button size="lg" className="bg-black text-white hover:bg-gray-800">
                                Become a ISV reseller
                            </Button>
                            <Button size="lg" variant="outline">
                                Login to Ireseller hub
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white py-12 border-b overflow-hidden">
                <div className="relative mx-auto max-w-[1280px] px-6">
                    <div className="flex animate-scroll gap-12 items-center">
                        {/* First set of logos */}
                        <div className="flex items-center gap-12 flex-shrink-0">
                            <div className="text-2xl font-bold text-orange-600 whitespace-nowrap">crayon</div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <div className="w-8 h-8 bg-purple-600 rounded-full"></div>
                                <span className="font-semibold whitespace-nowrap">Veephive</span>
                            </div>
                            <div className="text-blue-600 font-bold text-xl whitespace-nowrap">salesforce</div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
                                    <div className="bg-red-500"></div>
                                    <div className="bg-green-500"></div>
                                    <div className="bg-blue-500"></div>
                                    <div className="bg-yellow-500"></div>
                                </div>
                                <span className="font-semibold whitespace-nowrap">Microsoft</span>
                            </div>
                            <div className="text-green-600 font-semibold whitespace-nowrap">Redington</div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <div className="w-6 h-6 bg-black rounded"></div>
                                <span className="font-bold whitespace-nowrap">lyzr</span>
                            </div>
                            <div className="font-semibold whitespace-nowrap">accenture</div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <div className="w-6 h-6 bg-purple-600 rounded-full"></div>
                                <span className="font-semibold whitespace-nowrap">Outreach</span>
                            </div>
                        </div>
                        {/* Duplicate set for seamless loop */}
                        <div className="flex items-center gap-12 flex-shrink-0">
                            <div className="text-2xl font-bold text-orange-600 whitespace-nowrap">crayon</div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <div className="w-8 h-8 bg-purple-600 rounded-full"></div>
                                <span className="font-semibold whitespace-nowrap">Veephive</span>
                            </div>
                            <div className="text-blue-600 font-bold text-xl whitespace-nowrap">salesforce</div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
                                    <div className="bg-red-500"></div>
                                    <div className="bg-green-500"></div>
                                    <div className="bg-blue-500"></div>
                                    <div className="bg-yellow-500"></div>
                                </div>
                                <span className="font-semibold whitespace-nowrap">Microsoft</span>
                            </div>
                            <div className="text-green-600 font-semibold whitespace-nowrap">Redington</div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <div className="w-6 h-6 bg-black rounded"></div>
                                <span className="font-bold whitespace-nowrap">lyzr</span>
                            </div>
                            <div className="font-semibold whitespace-nowrap">accenture</div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <div className="w-6 h-6 bg-purple-600 rounded-full"></div>
                                <span className="font-semibold whitespace-nowrap">Outreach</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Build the Future Together */}
            <section className="bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-16 relative">
                <div className="mx-auto max-w-[1280px] px-6 text-center pt-12">
                    <h2 className="text-4xl font-bold mb-4">Are you a Good Fit?</h2>
                    <p className="text-gray-700 leading-relaxed">
                        You’re a good fit for the Tangram.ai Reseller Program if you help clients adopt AI-driven solutions and want to expand your portfolio with enterprise-ready intelligence.
                    </p>
                </div>
            </section>

            {/* Three Feature Cards */}
            <section className="bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-16">
                <div className="mx-auto max-w-[1280px] px-6">
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="p-8 border-2 bg-white">
                            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
                                <Target className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">AI consultants & Solution Providers</h3>
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

            {/* Discover Partnerships */}
            <section className="bg-gray-50 py-16 relative">
                <div className="mx-auto max-w-[1280px] px-6">
                    <div className="flex flex-col md:flex-row gap-12 items-start">
                        {/* Left side - Text content (50%) */}
                        <div className="flex-1 md:w-1/2">
                            <h2 className="text-3xl font-bold mb-6">Benefits of Reseller Partnership</h2>
                            <p className="text-gray-600 leading-relaxed">
                            Partnering with Tangram.ai unlocks new revenue streams, faster deal cycles, and access to enterprise-ready AI solutions. Resellers gain co-selling support, marketing enablement, and dedicated partner success resources — empowering them to deliver intelligent, scalable value to every client.
                            </p>
                        </div>

                        {/* Right side - Auto-scrolling cards in 3-column grid (50%) */}
                        <div className="flex-1 md:w-1/2 h-[400px] overflow-hidden relative px-6">
                            <div className="animate-scroll-vertical">
                                {/* First set of cards */}
                                <div className="grid grid-cols-3 gap-3 mb-3">
                                    <Card className="p-3 hover:shadow-lg transition-shadow">
                                        <div className="flex flex-col items-center text-center gap-2">
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <div className="w-6 h-6 bg-blue-500 rounded"></div>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-sm">Notion</div>
                                                <div className="text-xs text-gray-500">Plan your life</div>
                                            </div>
                                        </div>
                                    </Card>

                                    <Card className="p-3 hover:shadow-lg transition-shadow">
                                        <div className="flex flex-col items-center text-center gap-2">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <div className="w-6 h-6 bg-gray-800 rounded-full"></div>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-sm">Github</div>
                                                <div className="text-xs text-gray-500">Code repository</div>
                                            </div>
                                        </div>
                                    </Card>

                                    <Card className="p-3 hover:shadow-lg transition-shadow">
                                        <div className="flex flex-col items-center text-center gap-2">
                                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <div className="w-6 h-6 bg-purple-600 rounded-full"></div>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-sm">Codepen</div>
                                                <div className="text-xs text-gray-500">Code repository</div>
                                            </div>
                                        </div>
                                    </Card>
                                </div>

                                {/* Duplicate set for seamless loop */}
                                <div className="grid grid-cols-3 gap-3">
                                    <Card className="p-3 hover:shadow-lg transition-shadow">
                                        <div className="flex flex-col items-center text-center gap-2">
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <div className="w-6 h-6 bg-blue-500 rounded"></div>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-sm">Notion</div>
                                                <div className="text-xs text-gray-500">Plan your life</div>
                                            </div>
                                        </div>
                                    </Card>

                                    <Card className="p-3 hover:shadow-lg transition-shadow">
                                        <div className="flex flex-col items-center text-center gap-2">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <div className="w-6 h-6 bg-gray-800 rounded-full"></div>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-sm">Github</div>
                                                <div className="text-xs text-gray-500">Code repository</div>
                                            </div>
                                        </div>
                                    </Card>

                                    <Card className="p-3 hover:shadow-lg transition-shadow">
                                        <div className="flex flex-col items-center text-center gap-2">
                                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <div className="w-6 h-6 bg-purple-600 rounded-full"></div>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-sm">Codepen</div>
                                                <div className="text-xs text-gray-500">Code repository</div>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

      {/* Testimonials */}
      <section className="bg-white py-16 relative">
        <div className="mx-auto max-w-[1280px] px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">ISV's Testimonials</h2>

          <div className="bg-white border-2 rounded-lg p-12">
            <div className="flex items-start gap-8">
              <div className="flex-shrink-0">
                <svg width="200" height="60" viewBox="0 0 200 60" fill="none">
                  <path d="M20 10 L40 50 L30 30 L50 30 L30 10 Z" fill="#E91E63" />
                  <path d="M50 30 L70 10 L60 30 L80 30 L60 50 Z" fill="#9C27B0" />
                  <text x="90" y="40" fontFamily="Arial" fontSize="28" fontWeight="bold" fill="#000">
                    MOZARK
                  </text>
                </svg>
              </div>
              <div className="flex-1 relative">
                <h3 className="font-bold text-lg mb-4">Mozark</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Partnering with Tangram.ai accelerated outcomes beyond expectations. Within months, the collaboration
                  has become core to every growth mission we run. Our shared customer obsession drives perfect alignment
                  across teams, higher conversions, and seamless opportunities that power scalable, efficient growth.
                </p>
                <p className="text-sm text-gray-600 italic">—Christopher Ramnoruthly</p>
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
                            <h2 className="text-3xl font-bold mb-2">frequently asked questions</h2>
                            <p className="text-xl">FAQ's</p>
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


