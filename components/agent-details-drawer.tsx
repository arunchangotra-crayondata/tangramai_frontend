"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface Agent {
  id: string
  name: string
  productName?: string
  assetType?: string
  description?: string
  categories?: string[]
  targetPersona?: string[]
  businessValue?: string[]
}

interface AgentDetailsDrawerProps {
  agent: Agent
  open: boolean
  onOpenChange: (open: boolean) => void
  onApprove: (agent: Agent) => void
  onReject: () => void
}

export function AgentDetailsDrawer({ agent, open, onOpenChange, onApprove, onReject }: AgentDetailsDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="space-y-1">
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle className="text-2xl">AI Agent</SheetTitle>
              <p className="text-sm text-muted-foreground mt-1">
                ISVs with us to showcase your AI solutions to our enterprise clients.
              </p>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="mb-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Basic Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Product Name</label>
                <div className="mt-1.5 rounded-md border bg-gray-50 px-3 py-2 text-sm">
                  {agent.productName || "Product name"}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Asset Type</label>
                <div className="mt-1.5 rounded-md border bg-gray-50 px-3 py-2 text-sm">
                  {agent.assetType || "Asset type"}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Agent Description</label>
                <div className="mt-1.5 rounded-md border bg-gray-50 px-3 py-2 text-sm min-h-[80px]">
                  {agent.description || "Description about your agent"}
                </div>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {agent.categories?.map((category) => (
                <Badge key={category} variant="secondary" className="gap-1.5">
                  <span className="text-base">💬</span>
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Target Persona */}
          <div>
            <h3 className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Target Persona</h3>
            <div className="flex flex-wrap gap-2">
              {agent.targetPersona?.map((persona) => (
                <Badge key={persona} variant="secondary" className="gap-1.5">
                  <span className="text-base">👨‍💻</span>
                  {persona}
                </Badge>
              ))}
            </div>
          </div>

          {/* Business Value */}
          <div>
            <h3 className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Business Value</h3>
            <div className="flex flex-wrap gap-2">
              {agent.businessValue?.map((value) => (
                <Badge key={value} variant="secondary" className="gap-1.5">
                  <span className="text-base">💰</span>
                  {value}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-3">
          <Button variant="outline" className="flex-1 bg-transparent" onClick={onReject}>
            Reject
          </Button>
          <Button className="flex-1 bg-black hover:bg-black/90" onClick={() => onApprove(agent)}>
            Approve Agent
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
