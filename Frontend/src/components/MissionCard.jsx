import React from "react"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export default function MissionCard({ icon, title, description, stats, onClick }) {
  return (
    <motion.button className="w-full glass rounded-xl p-6 text-left transition-all hover:border-accent group" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -8, boxShadow: "0 0 40px rgba(0, 255, 65, 0.3)" }} onClick={onClick}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-background-tertiary rounded-lg flex items-center justify-center text-accent group-hover:glow-accent-strong transition-all">
          {icon}
        </div>
        <ArrowRight className="w-5 h-5 text-accent opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
      </div>

      <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
      <p className="text-text-secondary text-sm mb-4">{description}</p>

      {stats && (
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, i) => (
            <div key={i} className="bg-background-tertiary rounded p-2">
              <div className="text-xs text-text-secondary">{stat.label}</div>
              <div className="text-accent font-bold">{stat.value}</div>
            </div>
          ))}
        </div>
      )}
    </motion.button>
  )
}
