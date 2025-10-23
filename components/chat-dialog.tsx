"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "./ui/dialog"
import { Minus, X, Maximize2, Minimize2, ExternalLink, Brain, Zap, Sparkles, Trash2 } from "lucide-react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import { useChatStore, type ChatMessage } from "../lib/store/chat.store"

type MarkdownComponentProps = {
  children?: React.ReactNode
}

type ChatDialogProps = {
  open: boolean
  onOpenChange: (v: boolean) => void
  initialMode?: "create" | "explore"
  initialMessage?: string
}

// Agent Card Component for Chat
function ChatAgentCard({ agent }: { agent: NonNullable<ChatMessage['filteredAgents']>[0] }) {
  return (
    <Card className="mt-3 border border-blue-200 bg-blue-50/50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">{agent.agent_name}</h4>
            <p className="text-sm text-gray-600 line-clamp-2">{agent.description}</p>
          </div>
          <Link href={`/agents/${agent.agent_id}`}>
            <Button size="sm" variant="outline" className="ml-2 flex-shrink-0">
              <ExternalLink className="h-3 w-3 mr-1" />
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

// Typing Effect Component
function TypingEffect({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, 20) // Adjust speed as needed
      
      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text])
  
  return (
    <span>
      {displayedText}
      {currentIndex < text.length && <span className="animate-pulse">|</span>}
    </span>
  )
}

// Enhanced Thinking Component
function ThinkingIndicator() {
  const [thinkingStage, setThinkingStage] = useState(0)
  
  const thinkingMessages = [
    "Analyzing your request...",
    "Processing information...",
    "Generating response...",
    "Almost ready..."
  ]
  
  useEffect(() => {
    const interval = setInterval(() => {
      setThinkingStage(prev => (prev + 1) % thinkingMessages.length)
    }, 800)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
      <div className="relative">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <Brain className="h-4 w-4 text-white animate-pulse" />
        </div>
        <div className="absolute -top-1 -right-1">
          <Sparkles className="h-3 w-3 text-yellow-500 animate-bounce" />
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-gray-700">AI Assistant</span>
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
        <p className="text-sm text-gray-600">{thinkingMessages[thinkingStage]}</p>
      </div>
    </div>
  )
}

// Function to fetch agent details by ID
async function fetchAgentDetails(agentId: string) {
  try {
    const res = await fetch(`https://agents-store.onrender.com/api/agents/${agentId}`, {
      cache: "no-store"
    })
    if (!res.ok) throw new Error(`Failed to fetch agent ${agentId}: ${res.status}`)
    const data = await res.json()
    return data?.agent || null
  } catch (err) {
    console.error(`Error fetching agent ${agentId}:`, err)
    return null
  }
}

// Function to format chat text for better readability
function formatChatText(text: string): string {
  if (!text || text === "AI thinking...") return text
  
  return text
    // Convert \n\n to markdown paragraph breaks
    .replace(/\n\n/g, '\n\n')
    // Convert single \n to line breaks (for better spacing)
    .replace(/\n/g, '\n\n')
    // Remove bullet points and convert to simple text lines
    .replace(/^[\s]*[-*]\s+(.+)$/gm, '$1')
    // Remove numbered lists and convert to simple text lines
    .replace(/^[\s]*(\d+)[.)]\s+(.+)$/gm, '$2')
    // Convert text that looks like headers (all caps or title case) to markdown headers
    .replace(/^([A-Z][A-Z\s]+)$/gm, '## $1')
    .replace(/^([A-Z][a-z\s]+):$/gm, '### $1')
    // Clean up extra line breaks
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export default function ChatDialog({ open, onOpenChange, initialMode = "explore", initialMessage }: ChatDialogProps) {
  const { 
    messages, 
    sessionId, 
    mode, 
    addMessage, 
    updateMessage, 
    clearChat, 
    setMode, 
    setSessionId 
  } = useChatStore()
  
  const [isMinimized, setIsMinimized] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [input, setInput] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isThinking, setIsThinking] = useState(false)

  useEffect(() => {
    if (!sessionId) {
      const sid = `chat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
      setSessionId(sid)
    }
  }, [sessionId, setSessionId])

  // Ensure mode resets to the requested initialMode whenever dialog opens
  useEffect(() => {
    if (open) {
      // Only set mode if initialMode is provided and different from current mode
      if (initialMode && initialMode !== mode) {
        setMode(initialMode)
      }
      setIsMinimized(false)
      setIsExpanded(false)
      // If there's an initial message, set it as input and auto-send
      if (initialMessage && initialMessage.trim()) {
        setInput(initialMessage)
        // Auto-send the message after a short delay to ensure the dialog is fully open
        setTimeout(() => {
          handleSendMessage(initialMessage)
        }, 300)
      }
    }
  }, [open, initialMode, initialMessage, setMode, mode])

  async function handleSendMessage(messageText: string) {
    if (!messageText.trim()) return
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    const userText = messageText
    addMessage({ id: crypto.randomUUID(), role: "user", text: userText, time: now })
    setInput("")
    setIsSending(true)
    setIsThinking(true)
    
    // Add thinking message immediately
    const thinkingMessageId = crypto.randomUUID()
    addMessage({ id: thinkingMessageId, role: "assistant", text: "AI thinking...", time: now })
    
    // Debug logging
    console.log("Sending message with mode:", mode)
    console.log("Message text:", userText)
    console.log("Session ID:", sessionId)
    
    try {
      const res = await fetch("https://agents-store.onrender.com/api/chat", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mode, query: userText, session_id: sessionId }),
      })
      const json = await res.json().catch(() => null)
      const reply = json?.data?.response || "Sorry, something went wrong. Please try again later."
      
      // Check if the API response has filtered_agents data (array of agent IDs)
      let filteredAgentIds = null
      if (json?.data?.filtered_agents && Array.isArray(json.data.filtered_agents) && json.data.filtered_agents.length > 0) {
        filteredAgentIds = json.data.filtered_agents
      }
      
      // Log for debugging (remove in production)
      if (filteredAgentIds) {
        console.log("Found filtered agent IDs:", filteredAgentIds)
      }
      
      const replyTs = json?.data?.timestamp
        ? new Date(json.data.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      
      // Replace thinking message with actual response
      updateMessage(thinkingMessageId, { text: reply, filteredAgentIds })
      
      // If we have agent IDs, fetch their details
      if (filteredAgentIds && filteredAgentIds.length > 0) {
        try {
          const agentDetailsPromises = filteredAgentIds.map((id: string) => fetchAgentDetails(id))
          const agentDetails = await Promise.all(agentDetailsPromises)
          const validAgents = agentDetails.filter(agent => agent !== null)
          
          if (validAgents.length > 0) {
            // Update the message with agent details
            updateMessage(thinkingMessageId, { filteredAgents: validAgents })
          }
        } catch (err) {
          console.error("Error fetching agent details:", err)
        }
      }
    } catch (e) {
      const errTs = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      updateMessage(thinkingMessageId, {
          text: "I'm currently experiencing technical difficulties. Please try again.",
        time: errTs
      })
    } finally {
      setIsSending(false)
      setIsThinking(false)
    }
  }

  async function handleSend() {
    if (!input.trim()) return
    await handleSendMessage(input)
  }

  function handleClearChat() {
    clearChat()
    setInput("")
  }

  return (
    <>
      {/* Minimized pill - shows when minimized */}
      {open && isMinimized && (
        <button
          onClick={() => setIsMinimized(false)}
          className="fixed bottom-6 right-6 z-[100] flex items-center gap-2 rounded-full border bg-white/90 backdrop-blur px-4 py-2 shadow-lg"
          aria-label="Open chat"
        >
          <div className="relative h-5 w-5">
            <Image src="/chat_icon.png" alt="chat" fill className="object-contain" />
          </div>
          <span className="text-sm font-medium">AI Assistant</span>
        </button>
      )}

      <Dialog open={open && !isMinimized} onOpenChange={onOpenChange}>
        <DialogContent 
          className={`p-0 overflow-hidden rounded-2xl border shadow-2xl transition-all duration-300 ease-out ${
            isExpanded 
              ? "sm:max-w-[900px] md:max-w-[960px] animate-in slide-in-from-bottom-4" 
              : "sm:max-w-[420px] md:max-w-[420px] fixed bottom-6 right-6 left-auto top-auto translate-x-0 translate-y-0 animate-in slide-in-from-bottom-4"
          }`}
          showCloseButton={false}
        >
          <div className={isExpanded ? "flex h-[640px] flex-col bg-white" : "flex h-[520px] flex-col bg-white"}>
            <div className="flex items-center justify-between border-b px-4 py-3 bg-gradient-to-r from-white to-gray-50">
            <div className="flex items-center gap-3">
              <div className="relative h-6 w-6">
                <Image src="/chat_icon.png" alt="chat" fill className="object-contain" />
              </div>
              <div className="text-sm font-medium">AI Assistant</div>
            </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full border bg-white p-1 text-xs hidden sm:block">
              <button
                aria-label="Switch to Create"
                    onClick={() => {
                      console.log("Switching to create mode")
                      setMode("create")
                    }}
                className={`${mode === "create" ? "bg-black text-white" : "text-gray-700"} rounded-full px-3 py-1`}
              >
                Create
              </button>
              <button
                aria-label="Switch to Explore"
                    onClick={() => {
                      console.log("Switching to explore mode")
                      setMode("explore")
                    }}
                className={`${mode === "explore" ? "bg-black text-white" : "text-gray-700"} rounded-full px-3 py-1`}
              >
                Explore
                  </button>
                </div>
                <button aria-label="Clear Chat" onClick={handleClearChat} className="rounded-full p-1 hover:bg-gray-100" title="Clear conversation">
                  <Trash2 className="h-4 w-4" />
                </button>
                <button aria-label={isExpanded ? "Restore" : "Expand"} onClick={() => setIsExpanded(!isExpanded)} className="rounded-full p-1 hover:bg-gray-100">
                  {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </button>
                <button aria-label="Minimize" onClick={() => { setIsExpanded(false); setIsMinimized(true); }} className="rounded-full p-1 hover:bg-gray-100">
                  <Minus className="h-4 w-4" />
                </button>
                <button aria-label="Close" onClick={() => onOpenChange(false)} className="rounded-full p-1 hover:bg-gray-100">
                  <X className="h-4 w-4" />
              </button>
            </div>
          </div>
            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
            {messages.map((m) => (
              <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div className="flex max-w-[80%] items-end gap-2">
                  {m.role === "assistant" && (
                    <div className="relative mt-1 h-5 w-5 shrink-0">
                      <Image src="/chat_icon.png" alt="bot" fill className="object-contain" />
                    </div>
                  )}
                  <div className={
                    m.role === "user"
                      ? "rounded-xl bg-black px-4 py-2 text-white shadow-sm"
                      : "rounded-xl bg-gray-50 px-4 py-2 text-gray-900 shadow-sm border"
                  }>
                    {m.role === "assistant" ? (
                      <div className="text-sm leading-relaxed prose prose-sm max-w-none">
                        <ReactMarkdown
                          components={{
                            h1: ({ children }: MarkdownComponentProps) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                            h2: ({ children }: MarkdownComponentProps) => <h2 className="text-base font-semibold mb-2">{children}</h2>,
                            h3: ({ children }: MarkdownComponentProps) => <h3 className="text-sm font-semibold mb-1">{children}</h3>,
                            p: ({ children }: MarkdownComponentProps) => <p className="mb-2">{children}</p>,
                            ul: ({ children }: MarkdownComponentProps) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                            ol: ({ children }: MarkdownComponentProps) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                            li: ({ children }: MarkdownComponentProps) => <li className="text-sm">{children}</li>,
                            code: ({ children }: MarkdownComponentProps) => <code className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                            pre: ({ children }: MarkdownComponentProps) => <pre className="bg-gray-200 p-2 rounded text-xs font-mono overflow-x-auto mb-2">{children}</pre>,
                            blockquote: ({ children }: MarkdownComponentProps) => <blockquote className="border-l-4 border-gray-300 pl-2 italic mb-2">{children}</blockquote>,
                            strong: ({ children }: MarkdownComponentProps) => <strong className="font-semibold">{children}</strong>,
                            em: ({ children }: MarkdownComponentProps) => <em className="italic">{children}</em>,
                          }}
                        >
                          {formatChatText(m.text)}
                        </ReactMarkdown>
                        
                        {/* Show Contact Us button if "build" keyword is detected */}
                        {m.text.toLowerCase().includes("build") && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <Link href="/contact">
                              <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2">
                                Contact Us to Build Your Agent
                              </Button>
                            </Link>
                          </div>
                        )}
                        
                        {/* Show Agent Cards if filteredAgents are present */}
                        {m.filteredAgents && m.filteredAgents.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {m.filteredAgents.map((agent, index) => (
                              <ChatAgentCard key={`${agent.agent_id}-${index}`} agent={agent} />
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm leading-relaxed">
                        {m.text === "AI thinking..." ? (
                          <ThinkingIndicator />
                        ) : (
                          m.text
                        )}
                      </span>
                    )}
                  </div>
                  {m.role === "user" && (
                    <span className="text-[10px] text-gray-500 ml-1">{m.time}</span>
                  )}
                  {m.role === "assistant" && (
                    <span className="text-[10px] text-gray-500 ml-1">{m.time}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
            <div className="border-t px-3 py-3">
            <div className="flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !isSending) handleSend() }}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isSending}
              />
              <Button onClick={handleSend} className="bg-black text-white hover:bg-black/90" disabled={isSending}>
                Send
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}


