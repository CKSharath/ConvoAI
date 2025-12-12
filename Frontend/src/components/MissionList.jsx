import React from "react"
import { motion } from "framer-motion"
import { AlertCircle, Check } from "lucide-react"

export default function MissionList({ missions, onSelect, selectedId }) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical":
        return "bg-danger/20 text-danger border-danger"
      case "high":
        return "bg-warning/20 text-warning border-warning"
      default:
        return "bg-accent/20 text-accent border-accent"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <Check className="w-4 h-4" />
      case "active":
        return <div className="w-2 h-2 bg-accent rounded-full" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-2 h-full overflow-y-auto">
      {missions.map((mission, i) => (
        <motion.button key={mission.id} className={`w-full p-4 rounded-lg text-left transition-all ${selectedId === mission.id ? "glass border-accent glow-accent" : "glass hover:border-accent hover:glow-accent"}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} onClick={() => onSelect?.(mission)} whileHover={{ x: 4 }}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              {getStatusIcon(mission.status)}
              <span className="font-bold text-foreground">{mission.name}</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded border ${getPriorityColor(mission.priority)}`}>{mission.priority.toUpperCase()}</span>
          </div>
          <div className="w-full bg-background-tertiary rounded-full h-1 overflow-hidden">
            <motion.div className="h-full bg-accent glow-accent" initial={{ width: 0 }} animate={{ width: `${mission.progress}%` }} transition={{ duration: 0.8 }} />
          </div>
        </motion.button>
      ))}
    </div>
  )
}
