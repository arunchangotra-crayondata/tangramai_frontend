"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type Message = {
  id: string
  role: "user" | "assistant"
  text: string
  time: string
}

type ChatDialogProps = {
  open: boolean
  onOpenChange: (v: boolean) => void
  initialMode?: "create" | "explore"
}

export default function ChatDialog({ open, onOpenChange, initialMode = "explore" }: ChatDialogProps) {
  const [mode, setMode] = useState<"create" | "explore">(initialMode)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      role: "assistant",
      text: "Hi! Tell me what you want to search.",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ])
  const [input, setInput] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [sessionId, setSessionId] = useState("")

  useEffect(() => {
    if (!sessionId) {
      const sid = `chat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
      setSessionId(sid)
    }
  }, [sessionId])

  // Ensure mode resets to the requested initialMode whenever dialog opens
  useEffect(() => {
    if (open) {
      setMode(initialMode)
    }
  }, [open, initialMode])

  async function handleSend() {
    if (!input.trim()) return
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    const userText = input
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", text: userText, time: now },
    ])
    setInput("")
    setIsSending(true)
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
      const replyTs = json?.data?.timestamp
        ? new Date(json.data.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", text: reply, time: replyTs },
      ])
    } catch (e) {
      const errTs = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: "I'm currently experiencing technical difficulties. Please try again.",
          time: errTs,
        },
      ])
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] md:max-w-[960px] p-0 overflow-hidden rounded-2xl border shadow-2xl">
        <div className="flex h-[640px] flex-col bg-white">
          <div className="flex items-center justify-between border-b px-6 pr-16 sm:pr-20 py-4 bg-gradient-to-r from-white to-gray-50">
            <div className="flex items-center gap-3">
              <div className="relative h-6 w-6">
                <Image src="/chat_icon.png" alt="chat" fill className="object-contain" />
              </div>
              <div className="text-sm font-medium">AI Search Assistant</div>
            </div>
            <div className="rounded-full border bg-white p-1 text-xs">
              <button
                aria-label="Switch to Create"
                onClick={() => setMode("create")}
                className={`${mode === "create" ? "bg-black text-white" : "text-gray-700"} rounded-full px-3 py-1`}
              >
                Create
              </button>
              <button
                aria-label="Switch to Explore"
                onClick={() => setMode("explore")}
                className={`${mode === "explore" ? "bg-black text-white" : "text-gray-700"} rounded-full px-3 py-1`}
              >
                Explore
              </button>
            </div>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
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
                    <span className="text-sm leading-relaxed">{m.text}</span>
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
          <div className="border-t px-4 py-3">
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
  )
}


