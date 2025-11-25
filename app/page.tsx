"use client";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/badge";
import { Search, Database, Gauge, Clock, Cloud, Settings, Shield, Rocket, CheckCircle2, ChevronDown, Plus, User, Star, Layers } from "lucide-react";
import { useModal } from "../hooks/use-modal";
import { useState, useEffect, useRef } from "react";
import ChatDialog from "../components/chat-dialog";
import Image from "next/image";
import Link from "next/link";
import HeroCta from "../components/HeroCta";

export default function HomePage() {
  const { openModal } = useModal();
  const [chatOpen, setChatOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<number | null>(1);
  const [typedText, setTypedText] = useState("");
  const [colorIndex, setColorIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  
  const typingText = "Faster Deployment, Smarter Outcomes, Data Activation";
  const colors = ["#F05283", "#00AE8E", "#FFC432"];
  
  // Repetitive typing effect with color cycling
  useEffect(() => {
    let currentIndex = 0;
    let typingInterval: NodeJS.Timeout | null = null;
    let pauseTimeout: NodeJS.Timeout | null = null;
    let isActive = true;
    
    const startTyping = () => {
      if (!isActive) return;
      
      setIsTyping(true);
      currentIndex = 0;
      setTypedText("");
      
      if (typingInterval) clearInterval(typingInterval);
      
      typingInterval = setInterval(() => {
        if (!isActive) {
          if (typingInterval) clearInterval(typingInterval);
          return;
        }
        
        if (currentIndex < typingText.length) {
          setTypedText(typingText.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          if (typingInterval) clearInterval(typingInterval);
          typingInterval = null;
          setIsTyping(false);
          
          // Wait 2 seconds before restarting with next color
          if (pauseTimeout) clearTimeout(pauseTimeout);
          pauseTimeout = setTimeout(() => {
            if (!isActive) return;
            setColorIndex((prev) => (prev + 1) % colors.length);
            startTyping(); // Restart typing with new color
          }, 2000);
        }
      }, 100); // Typing speed
    };
    
    startTyping();
    
    return () => {
      isActive = false;
      if (typingInterval) clearInterval(typingInterval);
      if (pauseTimeout) clearTimeout(pauseTimeout);
    };
  }, []);

  const benefitsData = [
    {
      id: 1,
      number: "01.",
      title: "Composability",
      description: "AI you can plug in anywhere — across systems, teams, or journeys.",
      image: "/Rectangle 19.png",
      numberColor: "#FF9231",
    },
    {
      id: 2,
      number: "02.",
      title: "Agentic Workflows",
      description: "Automated workflows that adapt and learn from your business processes.",
      image: "/Rectangle 19.png",
      numberColor: "#6B7280",
    },
    {
      id: 3,
      number: "03.",
      title: "Faster Time-to-Value",
      description: "Deploy AI solutions in days, not months, with pre-built components.",
      image: "/Rectangle 19.png",
      numberColor: "#6B7280",
    },
    {
      id: 4,
      number: "04.",
      title: "Lower TCO",
      description: "Reduce total cost of ownership with efficient, scalable AI infrastructure.",
      image: "/Rectangle 19.png",
      numberColor: "#6B7280",
    },
    {
      id: 5,
      number: "05.",
      title: "Enterprise-Grade Deployment",
      description: "Production-ready AI with security, compliance, and governance built-in.",
      image: "/Rectangle 19.png",
      numberColor: "#6B7280",
    },
  ];

  const currentItem = benefitsData.find(item => item.id === expandedItem) || benefitsData[0];

  // Scroll animation effect
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in-visible");
        }
      });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll(".fade-in-section");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section (Agents hero moved here) */}
      <section 
        className="relative py-16 md:py-20 lg:py-24 min-h-[80vh] flex items-center"
        style={{
          background: "linear-gradient(to bottom right, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 50%, rgba(0, 159, 163, 0.05) 80%, rgba(0, 159, 163, 0.05) 100%)",
        }}
      >
        <div className="w-full px-8 md:px-12 lg:px-16">
          <div className="text-center">
            {/* Badge: From Pilot to Platform */}
            <div className="mb-6 mt-0 flex justify-center">
              <div 
                className="inline-flex items-center gap-2 border bg-white"
                style={{
                  width: "206px",
                  height: "36px",
                  paddingTop: "6px",
                  paddingRight: "16px",
                  paddingBottom: "6px",
                  paddingLeft: "16px",
                  borderRadius: "10px",
                  boxShadow: "0px 1px 4px 0px #0000000D",
                  borderColor: "#E5E7EB",
                  borderStyle: "solid",
                  borderWidth: "1px",
                }}
              >
                <div className="relative h-4 w-4">
                  <Image
                    src="/chat_icon.png"
                    alt="bot"
                    fill
                    className="object-contain"
                    style={{ position: "absolute", height: "100%", width: "100%", inset: "0px", color: "transparent" }}
                  />
                </div>
              <span
                  className="whitespace-nowrap"
                style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    fontStyle: "normal",
                    fontSize: "14px",
                    lineHeight: "18px",
                    letterSpacing: "0%",
                    verticalAlign: "middle",
                    color: "#111827",
                }}
              >
                  From Pilot to Platform
              </span>
              </div>
            </div>

            <span className="mb-0 text-balance mx-auto block" style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
              fontStyle: "normal",
              fontSize: "24px",
              lineHeight: "48px",
              letterSpacing: "0%",
              textAlign: "center",
              color: "rgb(55, 65, 81)",
            }}>
              <h1 style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                fontSize: "52px",
                lineHeight: "48px",
                letterSpacing: "0%",
                textAlign: "center",
                color: "#091917",
                width: "628px",
                height: "106px",
                margin: "0 auto",
                marginBottom: "-8px",
              }}>
                Simplify AI Success.
            </h1>
              <h2 style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                fontSize: "24px",
                lineHeight: "48px",
                letterSpacing: "0%",
                textAlign: "center",
                color: "#091917",
                margin: "0",
                marginTop: "-8px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}>
                <span>
                  With the Tangram Generative + Agentic AI platform that
                </span>
                <span>
                  Delivers 7X  "<span
                    style={{
                      color: colors[colorIndex],
                      transition: "color 0.5s ease",
                    }}
                  >
                    {typedText}
                  </span>
                  {isTyping && (
                    <span
                      style={{
                        color: colors[colorIndex],
                        animation: "blink 1s step-end infinite",
                        marginLeft: "2px",
                      }}
                    >
                      |
                    </span>
                  )}
                  "
                </span>
            </h2>
            </span>
            <p className="mb-8 text-balance mx-auto" style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "14px",
              lineHeight: "24px",
              letterSpacing: "0px",
              textAlign: "center",
              verticalAlign: "middle",
              color: "#091917",
              marginTop: "4px",
            }}>
              
            </p>

            {/* AI Capabilities Marquee - Two Rows */}
            <div className="mb-12 mx-auto max-w-5xl overflow-hidden">
              {/* Capabilities data */}
              {(() => {
                const capabilities = [
                  { icon: "circle", color: "#7DD3FC", text: "Conversational AI & Advisory" },
                  { icon: "triangle", color: "#3B82F6", text: "Document Passing & Analysis" },
                  { icon: "square", color: "#FCD34D", text: "Image processing" },
                  { icon: "circle", color: "#1E40AF", text: "Video Processing" },
                  { icon: "triangle", color: "#FDE047", text: "Voice and Meeting" },
                  { icon: "square", color: "#F472B6", text: "Data Analysis and Insights" },
                  { icon: "circle", color: "#A855F7", text: "Content generation" },
                  { icon: "triangle", color: "#FB923C", text: "Process Automation" },
                  { icon: "square", color: "#14B8A6", text: "Data Transformation" },
                ];
                
                const renderTag = (cap: typeof capabilities[0], key: string) => (
                  <div 
                    key={key} 
                    className="flex items-center bg-white whitespace-nowrap shrink-0 shadow-sm"
                    style={{
                      height: "32px",
                      paddingTop: "5.5px",
                      paddingRight: "9px",
                      paddingBottom: "6.5px",
                      paddingLeft: "9px",
                      gap: "5px",
                      borderRadius: "999px",
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderColor: "#E5E7EB",
                    }}
                  >
                    {cap.icon === "circle" && <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: cap.color }}></div>}
                    {cap.icon === "triangle" && <div className="h-3 w-3 shrink-0" style={{ backgroundColor: cap.color, clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}></div>}
                    {cap.icon === "square" && <div className="h-3 w-3 rounded shrink-0" style={{ backgroundColor: cap.color }}></div>}
                    <span style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                      fontStyle: "normal",
                      fontSize: "14px",
                      lineHeight: "20px",
                      letterSpacing: "0%",
                      verticalAlign: "middle",
                      color: "#344054",
                    }}>
                      {cap.text}
                    </span>
                  </div>
                );

                // Duplicate items multiple times for seamless scrolling
                const duplicatedCapabilities = [...capabilities, ...capabilities, ...capabilities];

                return (
                  <div className="flex flex-col gap-3">
                    {/* First Row */}
                    <div className="overflow-hidden relative">
                      <div className="flex gap-3 animate-scroll-tags" style={{ width: "fit-content" }}>
                        {duplicatedCapabilities.map((cap, idx) => renderTag(cap, `row1-${idx}`))}
                      </div>
                    </div>
                    {/* Second Row */}
                    <div className="overflow-hidden relative">
                      <div className="flex gap-3 animate-scroll-tags" style={{ width: "fit-content", animationDuration: "45s" }}>
                        {duplicatedCapabilities.map((cap, idx) => renderTag(cap, `row2-${idx}`))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Call to Action Button */}
            <div className="mb-8 flex justify-center">
              <div 
                className="inline-block rounded-lg"
                style={{
                  background: "rgba(0, 159, 163, 0.05)",
                  padding: "4px",
                  boxShadow: "0 4px 12px rgba(0, 159, 163, 0.15)",
                }}
              >
                <Button
                  className="bg-black hover:bg-black/90"
                  asChild
                  style={{
                    width: "233px",
                    height: "44px",
                    borderRadius: "4px",
                    background: "linear-gradient(180deg, #000000 0%, #1a1a1a 100%)",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    fontStyle: "normal",
                    fontSize: "14px",
                    lineHeight: "100%",
                    letterSpacing: "0.5px",
                    textAlign: "center",
                    verticalAlign: "middle",
                    textTransform: "uppercase",
                    color: "#FFFFFF",
                  }}
                >
                  <Link href="/agents">
                    SEE TANGRAM IN ACTION
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      

      {/* Stop Searching Section */}
      <section className="fade-in-section py-16 md:py-20 lg:py-24 min-h-[70vh] flex items-center bg-white">
        <div className="w-full px-8 md:px-12 lg:px-16">
          <div className="text-center">
            <h2 
              className="mb-2 text-balance"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontStyle: "normal",
                fontSize: "28px",
                lineHeight: "39.2px",
                letterSpacing: "-0.56px",
                textAlign: "center",
                verticalAlign: "middle",
              }}
            >
              <span className="gradient-text">
                AI success made easy.
              </span>
            </h2>
            <p 
              className="mb-12"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                fontStyle: "normal",
                fontSize: "16px",
                lineHeight: "24px",
                letterSpacing: "0%",
                textAlign: "center",
                verticalAlign: "middle",
                color: "#111827",
              }}
            >
              Find. Try. Pick. Launch.
            </p>

            {/* Process Cards */}
            <div className="relative mx-auto max-w-6xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                {/* Card 1: Find Your Use Case */}
                <div className="relative z-10">
                  <div 
                    className="bg-white rounded-lg border shadow-sm p-6 flex flex-col justify-center"
                    style={{
                      width: "256px",
                      height: "284px",
                      borderWidth: "1px",
                    }}
                  >
                    <div className="flex flex-col items-center text-center gap-4">
                      <div 
                        className="inline-flex items-center justify-center rounded-full"
                        style={{
                          width: "100px",
                          height: "100px",
                          background: "radial-gradient(100% 100% at 50% 0%, #E5E5FF 0%, #FFFFFF 100%)",
                        }}
                      >
                        <div className="relative">
                          <Search className="h-6 w-6" style={{ color: "#7C3AED" }} strokeWidth={3} />
                          <Plus className="h-3 w-3 absolute -top-1 -right-1" style={{ color: "#7C3AED" }} strokeWidth={3} />
                        </div>
                      </div>
                    <div>
                        <div 
                          className="mb-1"
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 500,
                            fontStyle: "normal",
                            fontSize: "16px",
                            lineHeight: "27px",
                            letterSpacing: "0%",
                            textAlign: "center",
                            verticalAlign: "middle",
                            color: "#111827",
                          }}
                        >
                          Find Your Use Case
                    </div>
                        <div 
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 400,
                            fontStyle: "normal",
                            fontSize: "14px",
                            lineHeight: "21px",
                            letterSpacing: "0%",
                            textAlign: "center",
                            verticalAlign: "middle",
                            color: "#4B5563",
                          }}
                        >
                          Explore ready-made industry use cases.
                  </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Try an agent */}
                <div className="relative z-10">
                  <div 
                    className="bg-white rounded-lg border shadow-sm p-6 flex flex-col justify-center"
                    style={{
                      width: "256px",
                      height: "284px",
                      borderWidth: "1px",
                    }}
                  >
                    <div className="flex flex-col items-center text-center gap-4">
                      <div 
                        className="inline-flex items-center justify-center rounded-full"
                        style={{
                          width: "100px",
                          height: "100px",
                          background: "radial-gradient(100% 100% at 50% 0%, #FFF1E5 0%, #FFFFFF 100%)",
                        }}
                      >
                        <div className="relative">
                          <User className="h-6 w-6" style={{ color: "#D97706" }} strokeWidth={3} />
                          <Star className="h-3 w-3 absolute -top-1 -right-1" style={{ color: "#D97706" }} strokeWidth={3} />
                        </div>
                      </div>
                    <div>
                        <div 
                          className="mb-1"
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 500,
                            fontStyle: "normal",
                            fontSize: "16px",
                            lineHeight: "27px",
                            letterSpacing: "0%",
                            textAlign: "center",
                            verticalAlign: "middle",
                            color: "#111827",
                          }}
                        >
                          Try an agent
                    </div>
                        <div 
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 400,
                            fontStyle: "normal",
                            fontSize: "14px",
                            lineHeight: "21px",
                            letterSpacing: "0%",
                            textAlign: "center",
                            verticalAlign: "middle",
                            color: "#4B5563",
                          }}
                        >
                          Test the right AI copilot for your need.
                  </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 3: Pick your stack */}
                <div className="relative z-10">
                  <div 
                    className="bg-white rounded-lg border shadow-sm p-6 flex flex-col justify-center"
                    style={{
                      width: "256px",
                      height: "284px",
                      borderWidth: "1px",
                    }}
                  >
                    <div className="flex flex-col items-center text-center gap-4">
                      <div 
                        className="inline-flex items-center justify-center rounded-full"
                        style={{
                          width: "100px",
                          height: "100px",
                          background: "linear-gradient(180deg, #FED1E6 0%, #FFFFFF 100%)",
                        }}
                      >
                        <Layers className="h-6 w-6" style={{ color: "#EC4899" }} strokeWidth={3} />
                      </div>
                    <div>
                        <div 
                          className="mb-1"
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 500,
                            fontStyle: "normal",
                            fontSize: "16px",
                            lineHeight: "27px",
                            letterSpacing: "0%",
                            textAlign: "center",
                            verticalAlign: "middle",
                            color: "#111827",
                          }}
                        >
                          Pick your stack
                    </div>
                        <div 
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 400,
                            fontStyle: "normal",
                            fontSize: "14px",
                            lineHeight: "21px",
                            letterSpacing: "0%",
                            textAlign: "center",
                            verticalAlign: "middle",
                            color: "#4B5563",
                          }}
                        >
                          Choose your preferred platform or model.
                  </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 4: Launch your trial */}
                <div className="relative z-10">
                  <div 
                    className="bg-white rounded-lg border shadow-sm p-6 flex flex-col justify-center"
                    style={{
                      width: "256px",
                      height: "284px",
                      borderWidth: "1px",
                    }}
                  >
                    <div className="flex flex-col items-center text-center gap-4">
                      <div 
                        className="inline-flex items-center justify-center rounded-full"
                        style={{
                          width: "100px",
                          height: "100px",
                          background: "radial-gradient(100% 100% at 50% 0%, #DDFFED 0%, #FFFFFF 100%)",
                        }}
                      >
                        <Rocket className="h-6 w-6" style={{ color: "#10B981" }} strokeWidth={3} />
                      </div>
                    <div>
                        <div 
                          className="mb-1"
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 500,
                            fontStyle: "normal",
                            fontSize: "16px",
                            lineHeight: "27px",
                            letterSpacing: "0%",
                            textAlign: "center",
                            verticalAlign: "middle",
                            color: "#111827",
                          }}
                        >
                          Launch your trial
                    </div>
                        <div 
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 400,
                            fontStyle: "normal",
                            fontSize: "14px",
                            lineHeight: "21px",
                            letterSpacing: "0%",
                            textAlign: "center",
                            verticalAlign: "middle",
                            color: "#4B5563",
                          }}
                        >
                          Experience the future of work in minutes.
                  </div>
                      </div>
                    </div>
                  </div>
                    </div>
                  </div>
            </div>
          </div>
        </div>
      </section>
      {/* AI Catalyst Section */}
      <section 
        className="fade-in-section py-16 md:py-20 lg:py-24 min-h-[80vh] flex items-center"
        style={{
          background: "linear-gradient(180deg, #FFFFFF 0%, #E8F7F4 76.44%, #FAFAFA 100%)",
        }}
      >
        <div className="w-full px-8 md:px-12 lg:px-16">
          <div className="text-center">
            <h2 
              className="mb-0 text-balance"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontStyle: "normal",
                fontSize: "28px",
                lineHeight: "44.8px",
                letterSpacing: "-1.28px",
                textAlign: "center",
                verticalAlign: "middle",
                background: "linear-gradient(270deg, #0082C0 0%, #3B60AF 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                WebkitTextFillColor: "transparent",
              }}
            >
                Accelerate Deployment of Your Own Agents using AI Catalyst
            </h2>
            
            {/* Subtitle */}
            <p className="mb-12 max-w-4xl mx-auto" style={{ textAlign: "center" }}>
              <span style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontStyle: "normal",
                fontSize: "16px",
                lineHeight: "24px",
                letterSpacing: "0%",
                textAlign: "center",
                color: "#374151",
              }}>
                Reduce risks. Accelerate adoption. Your data, your guardrails, our agents, our models.{" "}
                </span>
              <span style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "16px",
                lineHeight: "24px",
                letterSpacing: "0%",
                textAlign: "center",
                color: "#111827",
              }}>
              Worried about hallucinations? Or data security? Catalyst is designed to address them.
              </span>
            </p>

            <div className="grid gap-2 md:grid-cols-3 mb-12 max-w-6xl mx-auto px-4 md:px-8">
              {/* Labs Card */}
              <div 
                className="border bg-white shadow-sm mx-auto overflow-hidden transition-all duration-300 ease-in-out cursor-pointer hover:-translate-y-2 hover:shadow-xl"
                style={{
                  width: "100%",
                  maxWidth: "352px",
                  height: "auto",
                  minHeight: "460px",
                  paddingTop: "1px",
                  paddingRight: "1px",
                  paddingLeft: "1px",
                  paddingBottom: "1rem",
                  borderRadius: "4px",
                }}
              >
                <div 
                  style={{
                    width: "100%",
                    height: "341px",
                    paddingTop: "50px",
                    paddingRight: "25px",
                    paddingLeft: "25px",
                    borderRadius: "4px",
                    background: "linear-gradient(180deg, rgba(240, 82, 131, 0.21) 0%, #FFFFFF 100%)",
                  }}
                >
                  <div 
                    className="mb-8 flex items-center justify-center overflow-hidden mx-auto"
                    style={{
                      width: "286px",
                      height: "291px",
                      borderTopLeftRadius: "16px",
                      borderTopRightRadius: "16px",
                    }}
                  >
                  <Image
                    src="/card1.png"
                      alt="Labs - Use case discovery & rapid prototyping"
                      width={286}
                      height={291}
                    className="object-contain"
                      style={{
                        borderTopLeftRadius: "16px",
                        borderTopRightRadius: "16px",
                      }}
                  />
                </div>
                  <h3 
                    className="mb-2"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 500,
                      fontStyle: "normal",
                      fontSize: "18px",
                      lineHeight: "27px",
                      letterSpacing: "0%",
                      verticalAlign: "middle",
                      color: "#111827",
                      textAlign: "left",
                    }}
                  >
                    Labs
                  </h3>
                  <p 
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                      fontStyle: "normal",
                      fontSize: "14px",
                      lineHeight: "21px",
                      letterSpacing: "0%",
                      verticalAlign: "middle",
                      color: "#4B5563",
                      textAlign: "left",
                    }}
                  >
                    Use case discovery & rapid prototyping
                  </p>
                </div>
              </div>

              {/* Foundry Card */}
              <div 
                className="border bg-white shadow-sm mx-auto overflow-hidden transition-all duration-300 ease-in-out cursor-pointer hover:-translate-y-2 hover:shadow-xl"
                style={{
                  width: "100%",
                  maxWidth: "352px",
                  height: "auto",
                  minHeight: "460px",
                  paddingTop: "1px",
                  paddingRight: "1px",
                  paddingLeft: "1px",
                  paddingBottom: "1rem",
                  borderRadius: "4px",
                }}
              >
                <div 
                  style={{
                    width: "100%",
                    height: "341px",
                    paddingTop: "50px",
                    paddingRight: "25px",
                    paddingLeft: "25px",
                    borderRadius: "4px",
                    background: "linear-gradient(180deg, rgba(59, 96, 175, 0.21) 0%, #FFFFFF 100%)",
                  }}
                >
                  <div 
                    className="mb-8 flex items-center justify-center overflow-hidden mx-auto"
                    style={{
                      width: "286px",
                      height: "291px",
                      borderTopLeftRadius: "16px",
                      borderTopRightRadius: "16px",
                    }}
                  >
                  <Image
                    src="/card2.png"
                      alt="Foundry - Pilots integrated with your systems"
                      width={286}
                      height={291}
                    className="object-contain"
                      style={{
                        borderTopLeftRadius: "16px",
                        borderTopRightRadius: "16px",
                      }}
                  />
                </div>
                  <h3 
                    className="mb-2"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 500,
                      fontStyle: "normal",
                      fontSize: "18px",
                      lineHeight: "27px",
                      letterSpacing: "0%",
                      verticalAlign: "middle",
                      color: "#111827",
                      textAlign: "left",
                    }}
                  >
                    Foundry
                  </h3>
                  <p 
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                      fontStyle: "normal",
                      fontSize: "14px",
                      lineHeight: "21px",
                      letterSpacing: "0%",
                      verticalAlign: "middle",
                      color: "#4B5563",
                      textAlign: "left",
                    }}
                  >
                    Pilots integrated with your systems
                  </p>
                </div>
              </div>

              {/* Factory Card */}
              <div 
                className="border bg-white shadow-sm mx-auto overflow-hidden transition-all duration-300 ease-in-out cursor-pointer hover:-translate-y-2 hover:shadow-xl"
                style={{
                  width: "100%",
                  maxWidth: "352px",
                  height: "auto",
                  minHeight: "460px",
                  paddingTop: "1px",
                  paddingRight: "1px",
                  paddingLeft: "1px",
                  paddingBottom: "1rem",
                  borderRadius: "4px",
                }}
              >
                <div 
                  style={{
                    width: "100%",
                    height: "342px",
                    paddingTop: "50px",
                    paddingRight: "25px",
                    paddingLeft: "25px",
                    borderRadius: "4px",
                    background: "linear-gradient(180deg, rgba(255, 196, 50, 0.21) 0%, #FFFFFF 100%)",
                  }}
                >
                  <div 
                    className="mb-8 flex items-center justify-center overflow-hidden mx-auto"
                    style={{
                      width: "286px",
                      height: "291px",
                      borderTopLeftRadius: "16px",
                      borderTopRightRadius: "16px",
                    }}
                  >
                  <Image
                    src="/card3.png"
                      alt="Factory - Governed, production-grade rollouts"
                      width={286}
                      height={291}
                    className="object-contain"
                      style={{
                        borderTopLeftRadius: "16px",
                        borderTopRightRadius: "16px",
                      }}
                  />
                </div>
                  <h3 
                    className="mb-2"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 500,
                      fontStyle: "normal",
                      fontSize: "18px",
                      lineHeight: "27px",
                      letterSpacing: "0%",
                      verticalAlign: "middle",
                      color: "#111827",
                      textAlign: "left",
                    }}
                  >
                    Factory
                  </h3>
                  <p 
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                      fontStyle: "normal",
                      fontSize: "14px",
                      lineHeight: "21px",
                      letterSpacing: "0%",
                      verticalAlign: "middle",
                      color: "#4B5563",
                      textAlign: "left",
                    }}
                  >
                    Governed, production-grade rollouts
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Section */}
            <p 
              className="mb-6 max-w-3xl mx-auto"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "16px",
                lineHeight: "24px",
                letterSpacing: "0%",
                textAlign: "center",
                verticalAlign: "middle",
                color: "#111827",
              }}
            >
              Delivered by cross-functional squads with GenAI, data, domain, and engineering expertise.
            </p>
            
            <div className="flex justify-center">
              <Button
                className="bg-black hover:bg-black/90"
                asChild
                style={{
                  width: "110px",
                  height: "44px",
                  borderRadius: "4px",
                  padding: "16px",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  fontStyle: "normal",
                  fontSize: "14px",
                  lineHeight: "21px",
                  letterSpacing: "0%",
                  verticalAlign: "middle",
                  color: "#FFFFFF",
                }}
              >
                <Link href="/ai-catalyst">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Tangram Section */}
      <section 
        className="fade-in-section py-16 md:py-20 lg:py-24 min-h-[80vh] flex items-center"
        style={{
          background: "linear-gradient(180deg, #FFFFFF 0%, #F7F0E8 76.44%, #FAFAFA 100%)",
        }}
      >
        <div className="w-full px-8 md:px-12 lg:px-16">
          <div className="text-center">
            <h2 
              className="mb-0 text-balance"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontStyle: "normal",
                fontSize: "28px",
                lineHeight: "33.6px",
                letterSpacing: "-0.56px",
                textAlign: "center",
                verticalAlign: "middle",
                background: "linear-gradient(270deg, #FF9231 0%, #F05283 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                WebkitTextFillColor: "transparent",
              }}
            >
              Why Choose Tangram?
            </h2>
            
            {/* Subtitle */}
            <p className="mb-12 max-w-4xl mx-auto" style={{ textAlign: "center" }}>
              <span style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "16px",
                lineHeight: "24px",
                letterSpacing: "0%",
                textAlign: "center",
                verticalAlign: "middle",
                color: "#111827",
              }}>
                The Problem isn't the Model. It's the Last Mile. Most AI platforms stop at "cool demos."{" "}
              </span>
              <span style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "16px",
                lineHeight: "24px",
                letterSpacing: "0%",
                textAlign: "center",
                verticalAlign: "middle",
                color: "#111827",
              }}>
                Tangram is built to cut costs and create lift - in production.
              </span>
            </p>

            <div className="grid gap-4 md:grid-cols-3 mb-12 max-w-6xl mx-auto px-4 md:px-8">
              {/* Card 1: API-native agents */}
              <div 
                className="group relative border bg-white shadow-sm mx-auto overflow-hidden transition-all duration-500 ease-out cursor-pointer card-animate-1"
                    style={{
                      width: "100%",
                  maxWidth: "352px",
                  height: "auto",
                  minHeight: "460px",
                  paddingTop: "1px",
                  paddingRight: "1px",
                  paddingLeft: "1px",
                  paddingBottom: "1rem",
                  borderRadius: "4px",
                  transform: "translateY(0)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-12px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                <div 
                  className="transition-all duration-500"
                  style={{
                    width: "100%",
                    height: "341px",
                    paddingTop: "50px",
                    paddingRight: "25px",
                    paddingLeft: "25px",
                    borderRadius: "4px",
                    background: "linear-gradient(180deg, rgba(240, 82, 131, 0.21) 0%, #FFFFFF 100%)",
                  }}
                >
                  <div 
                    className="mb-8 flex items-center justify-center overflow-hidden mx-auto transition-transform duration-500"
                    style={{
                      width: "286px",
                      height: "291px",
                      borderTopLeftRadius: "16px",
                      borderTopRightRadius: "16px",
                    }}
                  >
                    <Image
                      src="/card1.png"
                      alt="API-native agents integration"
                      width={286}
                      height={291}
                      className="object-contain transition-transform duration-500 group-hover:scale-110"
                      style={{
                        borderTopLeftRadius: "16px",
                        borderTopRightRadius: "16px",
                    }}
                  />
                  </div>
                  <p 
                    className="transition-colors duration-300"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                      fontStyle: "normal",
                      fontSize: "17px",
                      lineHeight: "25.5px",
                      letterSpacing: "0%",
                      textAlign: "center",
                      verticalAlign: "middle",
                      color: "#111827",
                    }}
                  >
                    API-native agents that integrate with your stack — instantly
                  </p>
                </div>
              </div>

              {/* Card 2: Designed for BFSI, commerce & large enterprise ops */}
              <div 
                className="group relative border bg-white shadow-sm mx-auto overflow-hidden transition-all duration-500 ease-out cursor-pointer card-animate-2"
                style={{
                  width: "100%",
                  maxWidth: "352px",
                  height: "auto",
                  minHeight: "460px",
                  paddingTop: "1px",
                  paddingRight: "1px",
                  paddingLeft: "1px",
                  paddingBottom: "1rem",
                  borderRadius: "4px",
                  transform: "translateY(0)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-12px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "";
                }}
              >

                <div 
                  className="transition-all duration-500"
                  style={{
                    width: "100%",
                    height: "341px",
                    paddingTop: "50px",
                    paddingRight: "25px",
                    paddingLeft: "25px",
                    borderRadius: "4px",
                    background: "linear-gradient(180deg, rgba(59, 96, 175, 0.21) 0%, #FFFFFF 100%)",
                  }}
                >
                  <div 
                    className="mb-8 flex items-center justify-center overflow-hidden mx-auto transition-transform duration-500"
                    style={{
                      width: "286px",
                      height: "291px",
                      borderTopLeftRadius: "16px",
                      borderTopRightRadius: "16px",
                    }}
                  >
                    <Image
                      src="/Section4_2.png"
                      alt="BFSI, commerce & large enterprise ops"
                      width={286}
                      height={291}
                      className="object-contain transition-transform duration-500 group-hover:scale-110"
                      style={{
                        borderTopLeftRadius: "16px",
                        borderTopRightRadius: "16px",
                      }}
                    />
                    </div>
                  <p 
                    className="transition-colors duration-300"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                      fontStyle: "normal",
                      fontSize: "17px",
                      lineHeight: "25.5px",
                      letterSpacing: "0%",
                      textAlign: "center",
                      verticalAlign: "middle",
                      color: "#111827",
                    }}
                  >
                    Designed for large, complex operations
                  </p>
                </div>
                  </div>

              {/* Card 3: Proven to reduce GTM */}
              <div 
                className="group relative border bg-white shadow-sm mx-auto overflow-hidden transition-all duration-500 ease-out cursor-pointer card-animate-3"
                style={{
                  width: "100%",
                  maxWidth: "352px",
                  height: "auto",
                  minHeight: "460px",
                  paddingTop: "1px",
                  paddingRight: "1px",
                  paddingLeft: "1px",
                  paddingBottom: "1rem",
                  borderRadius: "4px",
                  transform: "translateY(0)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-12px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "";
                }}
              >

                <div 
                  className="transition-all duration-500"
                  style={{
                    width: "100%",
                    height: "342px",
                    paddingTop: "50px",
                    paddingRight: "25px",
                    paddingLeft: "25px",
                    borderRadius: "4px",
                    background: "linear-gradient(180deg, rgba(255, 196, 50, 0.21) 0%, #FFFFFF 100%)",
                  }}
                >
                  <div 
                    className="mb-8 flex items-center justify-center overflow-hidden mx-auto transition-transform duration-500"
                    style={{
                      width: "286px",
                      height: "291px",
                      borderTopLeftRadius: "16px",
                      borderTopRightRadius: "16px",
                    }}
                  >
                    <Image
                      src="/Section4_3.png"
                      alt="Proven to reduce GTM and effort"
                      width={286}
                      height={291}
                      className="object-contain transition-transform duration-500 group-hover:scale-110"
                      style={{
                        borderTopLeftRadius: "16px",
                        borderTopRightRadius: "16px",
                      }}
                    />
                    </div>
                  <p 
                    className="transition-colors duration-300"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                      fontStyle: "normal",
                      fontSize: "17px",
                      lineHeight: "25.5px",
                      letterSpacing: "0%",
                      textAlign: "center",
                      verticalAlign: "middle",
                      color: "#111827",
                    }}
                  >
                    Faster GTM. Lighter lift. Multipliers everywhere.
                  </p>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get with Tangram.ai Section */}
      <section className="fade-in-section py-16 md:py-20 lg:py-24 min-h-[80vh] flex items-start bg-white">
        <div className="w-full px-8 md:px-12 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 
                className="mb-4 text-balance"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  fontStyle: "normal",
                  fontSize: "28px",
                  lineHeight: "39.2px",
                  letterSpacing: "-0.56px",
                  textAlign: "center",
                  verticalAlign: "middle",
                  background: "linear-gradient(270deg, #F05283 0%, #8F2B8C 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  WebkitTextFillColor: "transparent",
                }}
              >
                What You Get with Tangram.ai?
              </h2>
              <p 
                className="mb-20"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontSize: "16px",
                  lineHeight: "100%",
                  letterSpacing: "0px",
                  textAlign: "center",
                  verticalAlign: "middle",
                  color: "#091917",
                }}
              >
                Tangram isn't a tool - it's a platform for GenAI adoption. With Tangram, enterprises unlock
              </p>
                </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Left Side - Text Content */}
              <div className="flex flex-col">
                {/* Benefits List */}
                <div 
                  className="flex flex-col"
                  style={{
                    height: "438.92px",
                    justifyContent: "space-between",
                  }}
                >
                  {benefitsData.map((item) => {
                    const isExpanded = expandedItem === item.id;
                    return isExpanded ? (
                      <div
                        key={item.id}
                        className="border bg-gray-50 cursor-pointer transition-all"
                        style={{
                          width: "520px",
                          maxWidth: "100%",
                          height: "127px",
                          paddingTop: "26px",
                          paddingRight: "24px",
                          paddingBottom: "24px",
                          paddingLeft: "26px",
                          borderRadius: "22px",
                          boxSizing: "border-box",
                        }}
                        onClick={() => setExpandedItem(item.id)}
                      >
                        <div className="flex items-start gap-3 h-full">
                          <span 
                            style={{
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: 500,
                              fontStyle: "normal",
                              fontSize: "18px",
                              lineHeight: "21.6px",
                              letterSpacing: "0%",
                              verticalAlign: "middle",
                              color: item.numberColor,
                            }}
                          >
                            {item.number}
                          </span>
                          <div className="flex-1">
                            <h3 
                              className="mb-2"
                              style={{
                                fontFamily: "Poppins, sans-serif",
                                fontWeight: 500,
                                fontStyle: "normal",
                                fontSize: "18px",
                                lineHeight: "100%",
                                letterSpacing: "0%",
                                verticalAlign: "middle",
                                color: "#111827",
                              }}
                            >
                              {item.title}
                            </h3>
                            <p 
                              style={{
                                fontFamily: "Poppins, sans-serif",
                                fontWeight: 400,
                                fontStyle: "normal",
                                fontSize: "14px",
                                lineHeight: "21px",
                                letterSpacing: "0%",
                                verticalAlign: "middle",
                                color: "#374151",
                              }}
                            >
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 cursor-pointer transition-all hover:opacity-80"
                        onClick={() => setExpandedItem(item.id)}
                      >
                        <span 
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 500,
                            fontStyle: "normal",
                            fontSize: "18px",
                            lineHeight: "21.6px",
                            letterSpacing: "0%",
                            verticalAlign: "middle",
                            color: "#6B7280",
                          }}
                        >
                          {item.number}
                        </span>
                        <h3 
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 500,
                            fontStyle: "normal",
                            fontSize: "18px",
                            lineHeight: "21.6px",
                            letterSpacing: "0%",
                            verticalAlign: "middle",
                            color: "#6B7280",
                          }}
                        >
                          {item.title}
                        </h3>
                      </div>
                    );
                  })}
                </div>
                  </div>

              {/* Right Side - Diagram Image */}
              <div className="flex items-start justify-center">
                <div className="relative">
                  <Image
                    src={currentItem.image}
                    alt={`Tangram.ai - ${currentItem.title}`}
                    width={466}
                    height={439}
                    className="object-contain transition-opacity duration-300"
                    style={{
                      width: "465.87px",
                      height: "438.92px",
                    }}
                  />
                  </div>
                </div>
              </div>
            </div>
        </div>
      </section>

      {/* Tangram Is Already in Production Section */}
      <section className="fade-in-section py-16 md:py-20 lg:py-24 min-h-[80vh] flex items-center bg-white">
        <div className="w-full px-8 md:px-12 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 
                className="mb-4 text-balance"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  fontStyle: "normal",
                  fontSize: "28px",
                  lineHeight: "39.2px",
                  letterSpacing: "-0.56px",
                  textAlign: "center",
                  verticalAlign: "middle",
                  background: "linear-gradient(270deg, #3B60AF 0%, #0082C0 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Tangram Is Already in Production
              </h2>
              <p className="text-lg" style={{ color: "#6B7280", fontFamily: "Inter, sans-serif" }}>
              This isn’t a beta. Tangram is live, running, and delivering impact inside large enterprises.
              </p>
                </div>

            {/* 2x2 Grid of Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-2">
              {/* Top-left Card: Enterprise POCs */}
              <div 
                className="relative bg-white shadow-sm overflow-hidden flex flex-col"
                style={{
                  width: "626px",
                  maxWidth: "100%",
                  height: "380px",
                  borderRadius: "24px",
                  border: "1px solid #E4E4E7",
                  padding: "24px",
                  boxSizing: "border-box",
                }}
              >
                {/* Decorative blue triangles */}
                <div className="absolute top-0 left-0 w-0 h-0 border-l-[20px] border-l-blue-500 border-t-[20px] border-t-transparent opacity-20"></div>
                <div className="absolute top-0 right-0 w-0 h-0 border-r-[20px] border-r-blue-500 border-t-[20px] border-t-transparent opacity-20"></div>
                
                <div className="mb-4 flex-1" style={{ height: "250px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Image
                    src="/image_all.png"
                    alt="Company logos - mozark, ADIB, gradiant"
                    width={624}
                    height={250}
                    className="object-contain"
                    style={{
                      maxWidth: "100%",
                      height: "250px",
                    }}
                  />
                </div>
                <p 
                  className="text-sm mt-auto"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    fontStyle: "normal",
                    fontSize: "16px",
                    lineHeight: "27px",
                    letterSpacing: "0%",
                    verticalAlign: "middle",
                    color: "#111827",
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  LIVE in Production and 12+ POCs in flight across banking, Retail, commerce, and operations.
                </p>
              </div>

              {/* Top-right Card: CX Personalization */}
              <div 
                className="border bg-white shadow-sm flex flex-col"
                style={{
                  width: "453px",
                  maxWidth: "100%",
                  height: "380px",
                  borderRadius: "24px",
                  padding: "24px",
                  boxSizing: "border-box",
                }}
              >
                <div className="mb-4 flex-1" style={{ height: "250px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Image
                    src="/Section_6_2.png"
                    alt="Personalisation chart"
                    width={400}
                    height={250}
                    className="object-contain"
                    style={{
                      maxWidth: "100%",
                      height: "250px",
                    }}
                  />
                </div>
                <p 
                  className="text-sm mt-auto"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    fontStyle: "normal",
                    fontSize: "16px",
                    lineHeight: "27px",
                    letterSpacing: "0%",
                    verticalAlign: "middle",
                    color: "#111827",
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  15–22% uplift in customer experience through personalization
                </p>
                </div>

              {/* Bottom-left Card: Onboarding */}
              <div 
                className="border bg-white shadow-sm flex flex-col"
                style={{
                  width: "453px",
                  maxWidth: "100%",
                  height: "380px",
                  borderRadius: "24px",
                  padding: "24px",
                  boxSizing: "border-box",
                }}
              >
                <div className="mb-4 flex-1" style={{ height: "250px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Image
                    src="/Section_6_3.png"
                    alt="Onboarding 40%"
                    width={400}
                    height={250}
                    className="object-contain"
                    style={{
                      maxWidth: "100%",
                      height: "250px",
                    }}
                  />
            </div>
                <p 
                  className="text-sm mt-auto"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    fontStyle: "normal",
                    fontSize: "16px",
                    lineHeight: "27px",
                    letterSpacing: "0%",
                    verticalAlign: "middle",
                    color: "#111827",
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  40% lower drop-offs through agent-driven onboarding
                </p>
              </div>

              {/* Bottom-right Card: Manual Operations */}
              <div 
                className="relative bg-white shadow-sm overflow-hidden flex flex-col"
                style={{
                  width: "626px",
                  maxWidth: "100%",
                  height: "380px",
                  borderRadius: "24px",
                  border: "1px solid #E4E4E7",
                  padding: "24px",
                  boxSizing: "border-box",
                  marginLeft: "-115px",
                }}
              >
                <div className="mb-4 flex-1">
                  <Image
                    src="/Section_6_4.png"
                    alt="Manual Operation 60%"
                    width={400}
                    height={200}
                    className="object-contain w-full h-auto"
                  />
                </div>
                <p 
                  className="text-sm mt-auto"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    fontStyle: "normal",
                    fontSize: "16px",
                    lineHeight: "27px",
                    letterSpacing: "0%",
                    verticalAlign: "middle",
                    color: "#111827",
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  60% reduction in manual effort with chained agents
                </p>
                </div>
              </div>

            {/* Built for Real-World Load - Minimal */}
            <div className="mt-16 pt-12 border-t border-gray-200">
              <div className="text-center mb-8">
                <h3 
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    fontSize: "24px",
                    lineHeight: "32px",
                    letterSpacing: "-0.48px",
                    textAlign: "center",
                    color: "#111827",
                    marginBottom: "12px",
                  }}
                >
                  Built for Real-World Load
                </h3>
                <p 
                  className="max-w-2xl mx-auto"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "24px",
                    textAlign: "center",
                    color: "#6B7280",
                  }}
                >
                  These aren't sandbox experiments — they're high-volume journeys, complex workflows, and mission-critical operations now running on Tangram.
                </p>
            </div>

              {/* Minimal Feature Tags */}
              <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
                <span 
                  className="inline-flex items-center px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, rgba(0, 130, 192, 0.1) 0%, rgba(59, 96, 175, 0.1) 100%)",
                    border: "1px solid rgba(0, 130, 192, 0.2)",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    fontSize: "14px",
                    color: "#0082C0",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "linear-gradient(135deg, rgba(0, 130, 192, 0.15) 0%, rgba(59, 96, 175, 0.15) 100%)";
                    e.currentTarget.style.borderColor = "rgba(0, 130, 192, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "linear-gradient(135deg, rgba(0, 130, 192, 0.1) 0%, rgba(59, 96, 175, 0.1) 100%)";
                    e.currentTarget.style.borderColor = "rgba(0, 130, 192, 0.2)";
                  }}
                >
                  High-Volume Journeys
                </span>
                <span 
                  className="inline-flex items-center px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, rgba(59, 96, 175, 0.1) 0%, rgba(94, 4, 210, 0.1) 100%)",
                    border: "1px solid rgba(59, 96, 175, 0.2)",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    fontSize: "14px",
                    color: "#3B60AF",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "linear-gradient(135deg, rgba(59, 96, 175, 0.15) 0%, rgba(94, 4, 210, 0.15) 100%)";
                    e.currentTarget.style.borderColor = "rgba(59, 96, 175, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "linear-gradient(135deg, rgba(59, 96, 175, 0.1) 0%, rgba(94, 4, 210, 0.1) 100%)";
                    e.currentTarget.style.borderColor = "rgba(59, 96, 175, 0.2)";
                  }}
                >
                  Complex Workflows
                </span>
                <span 
                  className="inline-flex items-center px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, rgba(94, 4, 210, 0.1) 0%, rgba(0, 130, 192, 0.1) 100%)",
                    border: "1px solid rgba(94, 4, 210, 0.2)",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    fontSize: "14px",
                    color: "#5E04D2",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "linear-gradient(135deg, rgba(94, 4, 210, 0.15) 0%, rgba(0, 130, 192, 0.15) 100%)";
                    e.currentTarget.style.borderColor = "rgba(94, 4, 210, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "linear-gradient(135deg, rgba(94, 4, 210, 0.1) 0%, rgba(0, 130, 192, 0.1) 100%)";
                    e.currentTarget.style.borderColor = "rgba(94, 4, 210, 0.2)";
                  }}
                >
                  Mission-Critical Operations
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="fade-in-section py-16 md:py-20 lg:py-24 min-h-[70vh] flex items-center">
        <div className="w-full px-8 md:px-12 lg:px-16">
          <div className="text-center">
            <h2 
              className="mb-4 max-w-xl mx-auto whitespace-nowrap"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontStyle: "normal",
                fontSize: "32px",
                lineHeight: "100%",
                letterSpacing: "0px",
                textAlign: "center",
                verticalAlign: "middle",
                background: "linear-gradient(90deg, #2F0368 0%, #5E04D2 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                WebkitTextFillColor: "transparent",
              }}
            >
              Accelerate growth with Tangram.ai
            </h2>
            <p 
              className="mb-18 max-w-4xl md:max-w-5xl w-full px-4 sm:px-6 mx-auto"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "16px",
                lineHeight: "24px",
                letterSpacing: "0%",
                textAlign: "center",
                verticalAlign: "middle",
                color: "#111827",
              }}
            >
              Our Partners are at the forefront of Enterprise AI transformation, and their success stories speak volumes. By partnering with Tangram.ai, they have helped businesses like yours reimagine how work gets done, service is delivered, and processes are automated, delivering real business value with AI.
            </p>

            <div className="flex flex-col md:flex-row md:justify-center md:items-start gap-6 md:gap-12">
              {/* Vendors Card */}
              <div 
                className="rounded-lg shadow-sm flex flex-col justify-between text-left"
                style={{
                  width: "472px",
                  height: "275.46px",
                  paddingTop: "32.68px",
                  paddingRight: "24.51px",
                  paddingBottom: "32.68px",
                  paddingLeft: "24.51px",
                  gap: "32.7px",
                  background: "radial-gradient(100% 100% at 50% 0%, #E5E5FF 0%, #FFFFFF 100%)",
                }}
              >
                <div>
                  <span 
                    className="inline-block mb-3"
                    style={{
                      width: "188.68px",
                      height: "30.61px",
                      paddingTop: "7.65px",
                      paddingRight: "16.34px",
                      paddingBottom: "7.96px",
                      paddingLeft: "16.34px",
                      borderRadius: "2px",
                      backgroundColor: "#FFFFFF",
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 500,
                      fontSize: "12px",
                      lineHeight: "100%",
                      letterSpacing: "0px",
                      verticalAlign: "middle",
                      textTransform: "uppercase",
                      color: "#181818",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Join as an ISV partner
                  </span>
                  <h3 
                    className="mb-2"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 500,
                      fontSize: "24.5px",
                      lineHeight: "31.86px",
                      letterSpacing: "-0.49px",
                      verticalAlign: "middle",
                      color: "#181818",
                    }}
                  >
                    Tangram.ai ISV
                  </h3>
                  <p 
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 500,
                      fontSize: "14.3px",
                      lineHeight: "21.45px",
                      letterSpacing: "-0.33px",
                      verticalAlign: "middle",
                      color: "#65717C",
                    }}
                  >
                    Our partners are certified Tangram.ai channel partners, technology partners, or independent software vendors (ISV).
                  </p>
                </div>
                <div className="flex justify-start">
                  <button 
                    onClick={() => openModal("auth", { mode: "signup", role: "isv" })}
                    style={{
                      height: "36.61px",
                      paddingTop: "10.8px",
                      paddingRight: "14.07px",
                      paddingBottom: "10.8px",
                      paddingLeft: "14.07px",
                      borderRadius: "4.09px",
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderColor: "#181818",
                      backgroundColor: "#181818",
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 500,
                      fontSize: "12px",
                      lineHeight: "100%",
                      letterSpacing: "0.5px",
                      textAlign: "center",
                      verticalAlign: "middle",
                      textTransform: "uppercase",
                      color: "#FFFFFF",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    BECOME A ISV
                  </button>
                </div>
              </div>

              {/* Reseller Card */}
              <div 
                className="rounded-lg shadow-sm flex flex-col justify-between text-left"
                style={{
                  width: "472px",
                  height: "275.46px",
                  paddingTop: "32.68px",
                  paddingRight: "24.51px",
                  paddingBottom: "32.68px",
                  paddingLeft: "24.51px",
                  gap: "32.7px",
                  background: "radial-gradient(100% 100% at 50% 0%, #DDFFED 0%, #FFFFFF 100%)",
                }}
              >
                <div>
                  <span 
                    className="inline-block mb-3"
                    style={{
                      width: "188.68px",
                      height: "30.61px",
                      paddingTop: "7.65px",
                      paddingRight: "16.34px",
                      paddingBottom: "7.96px",
                      paddingLeft: "16.34px",
                      borderRadius: "2px",
                      backgroundColor: "#FFFFFF",
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 500,
                      fontSize: "12px",
                      lineHeight: "100%",
                      letterSpacing: "0px",
                      verticalAlign: "middle",
                      textTransform: "uppercase",
                      color: "#181818",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Join as a Reseller Parther
                  </span>
                  <h3 
                    className="mb-2"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 500,
                      fontSize: "24.5px",
                      lineHeight: "31.86px",
                      letterSpacing: "-0.49px",
                      verticalAlign: "middle",
                      color: "#181818",
                    }}
                  >
                    Tangram.ai Reseller
                  </h3>
                  <p 
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 500,
                      fontSize: "14.3px",
                      lineHeight: "21.45px",
                      letterSpacing: "-0.33px",
                      verticalAlign: "middle",
                      color: "#65717C",
                    }}
                  >
                    Our Reseller program allows you to access Tangram.ai resources, support and professional services for your projects.
                  </p>
                </div>
                <div className="flex justify-start">
                  <button 
                    onClick={() => openModal("auth", { mode: "signup", role: "reseller" })}
                    style={{
                      height: "36.61px",
                      paddingTop: "10.8px",
                      paddingRight: "14.07px",
                      paddingBottom: "10.8px",
                      paddingLeft: "14.07px",
                      borderRadius: "4.09px",
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderColor: "#181818",
                      backgroundColor: "#181818",
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 500,
                      fontSize: "12px",
                      lineHeight: "100%",
                      letterSpacing: "0.5px",
                      textAlign: "center",
                      verticalAlign: "middle",
                      textTransform: "uppercase",
                      color: "#FFFFFF",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    BECOME A RESELLER
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Turn GenAI From Cost Center to Value Engine Section */}
      <div className="fade-in-section">
        <HeroCta />
      </div>
    </div>
  );
}
