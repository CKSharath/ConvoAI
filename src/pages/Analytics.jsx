import React from "react"
import Navbar from "../components/Navbar"
import MissionHeader from "../components/MissionHeader"
import StatsWidget from "../components/StatsWidget"
import { motion } from "framer-motion"
import { BarChart, LineChart, TrendingUp, Zap, Target, AlertTriangle } from "lucide-react"

export default function Analytics() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 px-8 pb-16">
        <MissionHeader title="Analytics Dashboard" subtitle="Mission performance metrics and operational insights" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsWidget label="Mission Success Rate" value="97.4%" icon={<Target className="w-5 h-5" />} change="↑ 2.3% from last week" />
          <StatsWidget label="Avg Mission Time" value="2h 12m" icon={<TrendingUp className="w-5 h-5" />} change="↓ 15 min improvement" />
          <StatsWidget label="System Efficiency" value="94.8%" icon={<Zap className="w-5 h-5" />} change="Peak: 98.2%" />
          <StatsWidget label="Critical Alerts" value="2" color="danger" icon={<AlertTriangle className="w-5 h-5" />} change="Both resolved" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div className="glass rounded-lg p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-2 mb-6">
              <LineChart className="w-5 h-5 text-accent" />
              <h3 className="text-accent font-bold">Mission Performance (7 Days)</h3>
            </div>
            <div className="h-48 flex items-end gap-3 justify-between">
              {[65, 72, 68, 75, 82, 78, 85].map((value, i) => (
                <motion.div key={i} className="flex-1 bg-accent/30 rounded-t hover:bg-accent/50 transition-colors relative group" style={{ height: `${(value / 100) * 100}%` }} initial={{ height: 0 }} animate={{ height: `${(value / 100) * 100}%` }} transition={{ delay: 0.1 + i * 0.05, duration: 0.6 }}>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-accent opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {value}%
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-between mt-6 text-xs text-text-secondary">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </motion.div>

          <motion.div className="glass rounded-lg p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center gap-2 mb-6">
              <BarChart className="w-5 h-5 text-accent" />
              <h3 className="text-accent font-bold">Operations by Type</h3>
            </div>
            <div className="space-y-4">
              {[
                { type: "Convoy Operations", count: 24, percent: 45 },
                { type: "Patrol Missions", count: 18, percent: 34 },
                { type: "Supply Runs", count: 11, percent: 21 }
              ].map((item) => (
                <div key={item.type}>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-foreground">{item.type}</p>
                    <p className="text-sm font-bold text-accent">{item.count}</p>
                  </div>
                  <div className="w-full bg-background-tertiary rounded-full h-3 overflow-hidden">
                    <motion.div className="h-full bg-accent glow-accent" initial={{ width: 0 }} animate={{ width: `${item.percent}%` }} transition={{ duration: 0.8 }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div className="glass rounded-lg p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h3 className="text-accent font-bold mb-6">Detailed Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { label: "Total Missions", value: "53", unit: "completed" },
              { label: "Vehicles Deployed", value: "156", unit: "total" },
              { label: "Personnel Involved", value: "492", unit: "trained" },
              { label: "Response Time", value: "1.2s", unit: "average" },
              { label: "Route Safety", value: "98.7%", unit: "verified" },
              { label: "Uptime", value: "99.98%", unit: "system" }
            ].map((metric, i) => (
              <motion.div key={i} className="border border-accent/30 rounded-lg p-4 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + i * 0.05 }}>
                <p className="text-text-secondary text-xs mb-2">{metric.label}</p>
                <p className="text-3xl font-bold text-accent mb-1">{metric.value}</p>
                <p className="text-xs text-text-secondary">{metric.unit}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  )
}
