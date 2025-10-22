import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative bg-black text-white overflow-hidden rounded-3xl m-6">
      <div className="absolute top-4 left-4 w-20 h-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-orange-500 via-orange-400 to-transparent transform -rotate-45 origin-top-left" />
        <div className="absolute top-2 left-0 w-full h-[1px] bg-gradient-to-r from-orange-400/50 to-transparent transform -rotate-45 origin-top-left" />
      </div>
      <div className="absolute bottom-4 right-4 w-20 h-20 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-l from-yellow-500 via-yellow-400 to-transparent transform -rotate-45 origin-bottom-right" />
        <div className="absolute bottom-2 right-0 w-full h-[1px] bg-gradient-to-l from-yellow-400/50 to-transparent transform -rotate-45 origin-bottom-right" />
      </div>

      <div className="relative px-12 py-10">
        {/* Top section with logos and button */}
        <div className="flex items-start justify-between mb-8">
          {/* Left side - Logos and tagline */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-8">
              <Image src="/crayon Logo White.png" alt="Crayon" width={130} height={40} className="h-7 w-auto" />
              <Image src="/tangram_log.png" alt="Tangram.ai" width={150} height={40} className="h-7 w-auto" />
            </div>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                fontSize: 16,
                lineHeight: '100%',
                letterSpacing: 0,
                width: 307,
                height: 38,
                color: '#B3B3B3',
              }}
            >
              Accelerate Enterprise AI success
            </p>
          </div>

          {/* Right side - Lets Talk button */}
          <button className="flex items-center gap-3 text-5xl font-light hover:opacity-80 transition-opacity tracking-wide">
            Lets Talk
            <ArrowUpRight className="w-10 h-10" strokeWidth={1.5} />
          </button>
        </div>

        <div className="relative h-12 mb-8">
          {/* Dotted horizontal line */}
          <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 flex items-center justify-between">
            {[...Array(50)].map((_, i) => (
              <div key={i} className="w-1 h-1 bg-cyan-400/60 rounded-full" />
            ))}
          </div>

          {/* Gradient bars with dots */}
          <div className="absolute bottom-0 left-0 right-0 h-1 flex items-center">
            {/* Orange to Cyan segment */}
            <div className="relative h-1 bg-gradient-to-r from-orange-500 to-cyan-400" style={{ width: "12%" }}>
              <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2.5 h-2.5 bg-cyan-400 rounded-full border-2 border-black" />
            </div>

            {/* Cyan segment */}
            <div className="relative h-1 bg-cyan-400" style={{ width: "8%" }}>
              <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2.5 h-2.5 bg-cyan-400 rounded-full border-2 border-black" />
            </div>

            {/* Cyan to Pink segment */}
            <div className="relative h-1 bg-gradient-to-r from-cyan-400 to-pink-500" style={{ width: "15%" }}>
              <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2.5 h-2.5 bg-pink-500 rounded-full border-2 border-black" />
            </div>

            {/* Pink to Purple segment */}
            <div className="relative h-1 bg-gradient-to-r from-pink-500 to-purple-600" style={{ width: "13%" }}>
              <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2.5 h-2.5 bg-purple-600 rounded-full border-2 border-black" />
            </div>

            {/* Purple to Blue segment */}
            <div className="relative h-1 bg-gradient-to-r from-purple-600 to-blue-500" style={{ width: "18%" }}>
              <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-black" />
            </div>

            {/* Blue to Cyan segment */}
            <div className="relative h-1 bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: "12%" }}>
              <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2.5 h-2.5 bg-cyan-400 rounded-full border-2 border-black" />
            </div>

            {/* Cyan to Orange segment */}
            <div className="relative h-1 bg-gradient-to-r from-cyan-400 to-orange-500" style={{ width: "10%" }}>
              <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-black" />
            </div>

            {/* Orange to Yellow segment */}
            <div className="relative h-1 bg-gradient-to-r from-orange-500 to-yellow-400" style={{ width: "12%" }}>
              <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2.5 h-2.5 bg-yellow-400 rounded-full border-2 border-black" />
            </div>
          </div>
        </div>

        {/* Copyright text */}
        <div className="text-center">
          <p className="text-xs text-gray-500">Powered by Tangram.ai © 2025 Crayon Data Pvt Ltd. All Rights Reserved
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-blue-500 rounded-t-md flex items-center justify-center">
        <div className="absolute -top-1 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-blue-500" />
      </div>
    </footer>
  )
}
