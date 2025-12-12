import React from "react"
import { motion } from "framer-motion"

function Badge({ children, className }) {
  return <span className={`px-2 py-1 rounded text-xs font-bold ${className}`}>{children}</span>
}

export default function MissionHeader({ title, subtitle, status, priority }) {
  const getStatusColor = (s) => {
    switch (s) {
      case "active":
        return "bg-accent/20 text-accent border-accent"
      case "critical":
        return "bg-danger/20 text-danger border-danger"
      case "pending":
        return "bg-warning/20 text-warning border-warning"
      default:
        return "bg-accent/20 text-accent border-accent"
    }
  }

  const getPriorityColor = (p) => {
    switch (p) {
      case "critical":
        return "bg-danger text-foreground"
      case "high":
        return "bg-warning text-background"
      default:
        return "bg-accent text-background"
    }
  }

  return (
    <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">{title}</h1>
          {subtitle && <p className="text-text-secondary">{subtitle}</p>}
        </div>
        <div className="flex gap-3 flex-wrap">
          {status && <Badge className={`border-2 ${getStatusColor(status)} text-sm`}>{status.toUpperCase()}</Badge>}
          {priority && <Badge className={`${getPriorityColor(priority)} text-sm`}>{priority.toUpperCase()}</Badge>}
        </div>
      </div>
    </motion.div>
  )
}
