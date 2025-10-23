"use client"

import { useState } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import ChatDialog from "./chat-dialog"
import { Search, Mic } from "lucide-react"
import { useChatStore } from "../lib/store/chat.store"

export function AgentSearchChat() {
  const [chatOpen, setChatOpen] = useState(false)
  const { mode, setMode } = useChatStore()
  const [searchInput, setSearchInput] = useState("")

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchInput.trim()) {
      setChatOpen(true)
    }
  }

  const handleSearchClick = () => {
    if (searchInput.trim()) {
      setChatOpen(true)
    }
  }

  return (
    <div className="w-full">
      <div className="mx-auto mb-8 flex max-w-5xl items-center gap-2 rounded-full border bg-white p-2 shadow-lg">
        <Search className="ml-2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="I want an agent to review NDAs"
          className="border-0 focus-visible:ring-0 text-lg py-3"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button size="icon" variant="ghost" onClick={handleSearchClick}>
          <Mic className="h-5 w-5" />
        </Button>
        
        {/* Mode Toggle */}
        <div className="flex rounded-full border bg-gray-50 p-1 mr-2">
          <button
            onClick={() => {
              console.log("Search: Switching to explore mode")
              setMode("explore")
            }}
            className={`px-4 py-2 text-sm rounded-full transition-colors ${
              mode === "explore" 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Explore
          </button>
          <button
            onClick={() => {
              console.log("Search: Switching to create mode")
              setMode("create")
            }}
            className={`px-4 py-2 text-sm rounded-full transition-colors ${
              mode === "create" 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Create
          </button>
        </div>
      </div>
      <ChatDialog 
        open={chatOpen} 
        onOpenChange={setChatOpen} 
        initialMode={mode}
        initialMessage={searchInput}
      />
    </div>
  )
}


