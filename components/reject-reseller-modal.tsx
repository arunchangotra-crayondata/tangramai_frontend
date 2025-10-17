"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface DisplayReseller {
  id: string
  name?: string
  userName?: string
}

interface RejectResellerModalProps<TReseller extends DisplayReseller = DisplayReseller> {
  reseller: TReseller
  open: boolean
  onOpenChange: (open: boolean) => void
  onReject: (reseller: TReseller, reason: string) => void | Promise<void>
}

export function RejectResellerModal<TReseller extends DisplayReseller = DisplayReseller>({
  reseller,
  open,
  onOpenChange,
  onReject,
}: RejectResellerModalProps<TReseller>) {
  const [reason, setReason] = useState("")

  const handleSubmit = () => {
    if (reason.trim()) {
      onReject(reseller, reason)
      setReason("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Reject this Reseller</DialogTitle>
          <p className="text-sm text-muted-foreground">Mention reason for rejecting {reseller.name ?? reseller.userName}</p>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium">Reason</label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter your Reasons"
              className="mt-1.5 min-h-[120px]"
            />
          </div>
        </div>

        <Button onClick={handleSubmit} className="w-full bg-black hover:bg-black/90">
          SUBMIT
        </Button>
      </DialogContent>
    </Dialog>
  )
}
