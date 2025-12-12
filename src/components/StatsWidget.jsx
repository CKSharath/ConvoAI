import React from "react"
import { motion } from "framer-motion"

export default function StatsWidget({ label, value, change, icon, color = "accent" }) {
  const colorClass = {
    accent: "text-accent",
    warning: "text-warning",
    danger: "text-danger"
  }[color]

  return (
    <motion.div className="glass rounded-lg p-4" whileHover={{ y: -4 }} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-text-secondary text-sm">{label}</p>
        {icon && <div className={`${colorClass} opacity-60`}>{icon}</div>}
      </div>
      <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
      {change && <p className="text-xs text-text-secondary mt-2">{change}</p>}
    </motion.div>
  )
}
