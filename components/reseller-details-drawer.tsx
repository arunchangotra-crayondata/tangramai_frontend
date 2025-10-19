"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { ImageIcon, CheckCircle, XCircle, Edit } from "lucide-react"
import type { ResellerAPIResponse } from "@/lib/types/admin.types"

interface ResellerDetailsDrawerProps {
  reseller: ResellerAPIResponse
  open: boolean
  onOpenChange: (open: boolean) => void
  onApprove: (reseller: ResellerAPIResponse) => void | Promise<void>
  onReject: () => void
  onEdit: () => void
}

export function ResellerDetailsDrawer({
  reseller,
  open,
  onOpenChange,
  onApprove,
  onReject,
  onEdit,
}: ResellerDetailsDrawerProps) {
  const getStatusBadge = (approved: "yes" | "no") => {
    if (approved === "yes") {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Approved
        </Badge>
      )
    }
    return (
      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
        <XCircle className="h-3 w-3 mr-1" />
        Pending
      </Badge>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto pt-4 pb-2">
        <SheetHeader className="space-y-1">
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle className="text-2xl">{reseller.reseller_name}</SheetTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Reseller ID: {reseller.reseller_id}
              </p>
              <div className="mt-2">
                {getStatusBadge(reseller.admin_approved)}
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              onClick={onEdit}
            >
              <Edit className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>

        <div className="mt-8 space-y-8">
          {/* Contact Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="mb-6 text-base font-semibold text-gray-900 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Contact Information
            </h3>
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Email Address</label>
                <div className="bg-gray-50 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900">
                  {reseller.reseller_email_no || (
                    <span className="text-gray-400 italic">Not provided</span>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Mobile Number</label>
                <div className="bg-gray-50 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900">
                  {reseller.reseller_mob_no || (
                    <span className="text-gray-400 italic">Not provided</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Company Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="mb-6 text-base font-semibold text-gray-900 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Company Information
            </h3>
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Domain</label>
                <div className="bg-gray-50 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900">
                  {reseller.reseller_domain || (
                    <span className="text-gray-400 italic">Not provided</span>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Whitelisted Domain</label>
                <div className="bg-gray-50 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900">
                  {reseller.whitelisted_domain || (
                    <span className="text-gray-400 italic">Not provided</span>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Address</label>
                <div className="bg-gray-50 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900 min-h-[100px] whitespace-pre-wrap">
                  {reseller.reseller_address || (
                    <span className="text-gray-400 italic">Not provided</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-3 px-2 pb-2">
          <Button variant="outline" className="flex-1 bg-transparent" onClick={onReject}>
            Reject
          </Button>
          <Button className="flex-1 bg-black hover:bg-black/90" onClick={() => onApprove(reseller)}>
            Approve Reseller
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
