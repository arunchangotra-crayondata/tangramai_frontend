"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageIcon, Trash2 } from "lucide-react"

interface Reseller {
  id: string
  name: string
  position: string
  registeredName: string
  registeredAddress?: string
  domain: string
  contact: string
  status: "Active" | "Inactive"
  processingStatus: "Pending" | "Approved" | "Reject"
  logo?: {
    name: string
    url: string
  }
}

interface ResellerDetailsDrawerProps {
  reseller: Reseller
  open: boolean
  onOpenChange: (open: boolean) => void
  onApprove: (reseller: Reseller) => void
  onReject: () => void
  onUpdate: (reseller: Reseller, newStatus: "Active" | "Inactive") => void
}

export function ResellerDetailsDrawer({
  reseller,
  open,
  onOpenChange,
  onApprove,
  onReject,
  onUpdate,
}: ResellerDetailsDrawerProps) {
  const [status, setStatus] = useState<"Active" | "Inactive">(reseller.status)
  const isPending = reseller.processingStatus === "Pending"

  const handleSubmit = () => {
    onUpdate(reseller, status)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="space-y-1">
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle className="text-2xl">Reseller Details</SheetTitle>
              <p className="text-sm text-muted-foreground mt-1">Account Information for reseller</p>
            </div>
            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50">
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Name */}
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input value={reseller.name} readOnly className="mt-1.5 bg-gray-50" placeholder="Full name" />
          </div>

          {/* Position */}
          <div>
            <label className="text-sm font-medium">Position</label>
            <Input value={reseller.position} readOnly className="mt-1.5 bg-gray-50" placeholder="Position in company" />
          </div>

          {/* Registered Name */}
          <div>
            <label className="text-sm font-medium">Registered Name</label>
            <Input
              value={reseller.registeredName}
              readOnly
              className="mt-1.5 bg-gray-50"
              placeholder="Registered Name"
            />
          </div>

          {/* Registered Address */}
          <div>
            <label className="text-sm font-medium">Registered address</label>
            <Textarea
              value={reseller.registeredAddress || ""}
              readOnly
              className="mt-1.5 bg-gray-50 min-h-[80px]"
              placeholder="Registered address details"
            />
          </div>

          {/* Domain */}
          <div>
            <label className="text-sm font-medium">Domain</label>
            <Input
              value={reseller.domain}
              readOnly
              className="mt-1.5 bg-gray-50"
              placeholder={reseller.domain === "-" ? "-" : "Domain"}
            />
          </div>

          {/* Contact Number */}
          <div>
            <label className="text-sm font-medium">Contact Number</label>
            <Input value={reseller.contact} readOnly className="mt-1.5 bg-gray-50" placeholder="+91 9876543210" />
          </div>

          {/* Logo */}
          <div>
            <label className="text-sm font-medium">Logo</label>
            <div className="mt-1.5 flex items-center justify-between rounded-md border bg-gray-50 px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-200">
                  <ImageIcon className="h-4 w-4 text-gray-600" />
                </div>
                <span className="text-sm">{reseller.logo?.name || "logo.png"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="link" className="h-auto p-0 text-sm text-blue-600 hover:text-blue-700">
                  Download
                </Button>
                <Button variant="link" className="h-auto p-0 text-sm text-red-600 hover:text-red-700">
                  Delete
                </Button>
              </div>
            </div>
          </div>

          {/* Status - Only show for approved resellers */}
          {!isPending && reseller.processingStatus !== "Reject" && (
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select value={status} onValueChange={(value) => setStatus(value as "Active" | "Inactive")}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8">
          {isPending ? (
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={onReject}>
                Reject
              </Button>
              <Button className="flex-1 bg-black hover:bg-black/90" onClick={() => onApprove(reseller)}>
                Approve
              </Button>
            </div>
          ) : reseller.processingStatus === "Approved" ? (
            <Button className="w-full bg-black hover:bg-black/90" onClick={handleSubmit}>
              Submit
            </Button>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  )
}
