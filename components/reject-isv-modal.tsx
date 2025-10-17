"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface DisplayISV {
  id: string
  name: string
}

interface RejectISVModalProps<TISV extends DisplayISV = DisplayISV> {
  isv: TISV
  open: boolean
  onOpenChange: (open: boolean) => void
  onReject: (isv: TISV, reason: string) => void | Promise<void>
}

export function RejectISVModal<TISV extends DisplayISV = DisplayISV>({
  isv,
  open,
  onOpenChange,
  onReject,
}: RejectISVModalProps<TISV>) {
  const [reason, setReason] = useState("")

  const handleSubmit = () => {
    if (reason.trim()) {
      onReject(isv, reason)
      setReason("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Reject this ISV</DialogTitle>
          <p className="text-sm text-muted-foreground">Mention the reason for rejecting ISV: {isv.name}</p>
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
