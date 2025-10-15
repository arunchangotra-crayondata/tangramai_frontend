import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-black text-white">
      <div className="mx-auto max-w-[1280px] px-6 py-12">
        <div className="mb-12">
          <h2 className="mb-4 text-2xl font-bold text-balance">
            Interested in working together, trying our platform or simply have questions?
          </h2>
          <p className="mb-6 text-sm text-gray-400">Just send us your contact email and we will contact you.</p>
          <form className="flex max-w-md gap-2">
            <Input type="email" placeholder="YOUR EMAIL" className="bg-white text-black" />
            <Button type="submit" size="icon" className="shrink-0">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>

        <div className="flex items-center justify-between border-t border-gray-800 pt-8">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="text-lg font-bold">
                {"crayon "}
                <span className="text-primary">▶</span>
              </div>
              <div className="text-lg font-bold">
                {"tangram.ai "}
                <span className="text-primary">△</span>
              </div>
            </div>
            <p className="text-sm text-gray-400">AI-led revenue acceleration platform for enterprises</p>
          </div>
          <Link href="/contact" className="flex items-center gap-2 text-2xl font-bold hover:text-primary">
            {"Lets Talk "}
            <ArrowRight className="h-6 w-6" />
          </Link>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          © 2025 Crayon Data Pvt Ltd & Tangram.ai. All Rights Reserved
        </div>
      </div>
    </footer>
  )
}
