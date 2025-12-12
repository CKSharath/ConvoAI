import React from "react"
import { motion } from "framer-motion"

export default function Timeline({ events }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-accent/30 border-accent"
      case "active":
        return "bg-accent/60 border-accent glow-accent"
      default:
        return "bg-background-tertiary border-background-tertiary"
    }
  }

  return (
    <div className="space-y-4">
      {events.map((event, i) => (
        <motion.div key={event.id} className="flex gap-4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
          <div className="relative flex flex-col items-center">
            <div className={`w-4 h-4 rounded-full border-2 transition-all ${getStatusColor(event.status)}`} />
            {i < events.length - 1 && <div className="w-0.5 h-12 bg-background-tertiary mt-2" />}
          </div>

          <div className="pb-4">
            <div className="flex items-baseline gap-2">
              <p className="font-bold text-foreground">{event.title}</p>
              <p className="text-xs text-text-secondary">{event.time}</p>
            </div>
            {event.description && <p className="text-sm text-text-secondary mt-1">{event.description}</p>}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
