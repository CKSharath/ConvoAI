import React from "react"
import { motion } from "framer-motion"

export default function MapPlaceholder() {
  return (
    <div className="w-full h-full bg-background-secondary rounded-lg border tactical-border flex items-center justify-center relative overflow-hidden">
      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00ff41" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <motion.div className="absolute w-8 h-8" animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}>
        <div className="w-full h-full border-2 border-accent rounded-full" />
        <div className="absolute inset-2 bg-accent rounded-full" />
      </motion.div>

      {[...Array(3)].map((_, i) => (
        <motion.div key={i} className="absolute" style={{ left: `${30 + i * 20}%`, top: `${40 + i * 10}%` }} animate={{ scale: [1, 1.5, 1], opacity: [1, 0.3, 1] }} transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, delay: i * 0.3 }}>
          <div className="w-4 h-4 bg-accent rounded-full glow-accent" />
        </motion.div>
      ))}

      <div className="relative z-10 text-center">
        <p className="text-accent font-mono text-lg">MAP ACTIVE</p>
        <p className="text-text-secondary text-sm">GPS STREAMING...</p>
      </div>
    </div>
  )
}
