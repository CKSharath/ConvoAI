import React, { useState } from "react"
import Navbar from "../components/Navbar"
import MissionHeader from "../components/MissionHeader"
import StatsWidget from "../components/StatsWidget"
import { motion } from "framer-motion"
import { Activity, Users, Truck, Clock } from "lucide-react"

export default function Operations() {
  const [filter, setFilter] = useState("all")

  const operations = [
    {
      id: "OP-001",
      name: "Operation Crimson",
      type: "Convoy",
      vehicles: 8,
      personnel: 24,
      status: "active",
      progress: 73,
      eta: "14:30"
    },
    {
      id: "OP-002",
      name: "Operation Falcon",
      type: "Patrol",
      vehicles: 3,
      personnel: 12,
      status: "active",
      progress: 45,
      eta: "16:15"
    },
    {
      id: "OP-003",
      name: "Operation Nexus",
      type: "Supply Run",
      vehicles: 5,
      personnel: 15,
      status: "pending",
      progress: 0,
      eta: "Tomorrow"
    },
    {
      id: "OP-004",
      name: "Operation Strike",
      type: "Extraction",
      vehicles: 6,
      personnel: 18,
      status: "active",
      progress: 58,
      eta: "15:45"
    }
  ]

  const filteredOps = operations.filter((op) => (filter === "all" ? true : op.status === filter))

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 px-8 pb-16">
        <MissionHeader title="Active Operations" subtitle="Monitor all ongoing military operations in real-time" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsWidget label="Active Ops" value="3" icon={<Activity className="w-5 h-5" />} change="2 more than yesterday" />
          <StatsWidget label="Personnel Deployed" value="69" icon={<Users className="w-5 h-5" />} change="All units ready" />
          <StatsWidget label="Vehicles Active" value="22" icon={<Truck className="w-5 h-5" />} change="Fleet health: 98%" />
          <StatsWidget label="Avg Completion Time" value="2h 8m" icon={<Clock className="w-5 h-5" />} change="15% ahead of schedule" />
        </div>

        <div className="flex gap-3 mb-6">
          {["all", "active", "pending"].map((f) => (
            <motion.button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === f ? "bg-accent text-background glow-accent" : "glass hover:border-accent text-text-secondary"}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </motion.button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredOps.map((op, i) => (
            <motion.div key={op.id} className="glass rounded-lg p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ borderColor: "rgba(0, 255, 65, 0.5)" }}>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-background-tertiary flex items-center justify-center">
                      <Activity className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{op.name}</p>
                      <p className="text-sm text-text-secondary">{op.type}</p>
                      <p className="text-xs text-accent mt-1 font-mono">{op.id}</p>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-3 flex gap-6">
                  <div>
                    <p className="text-xs text-text-secondary mb-1">Vehicles</p>
                    <p className="font-bold text-accent">{op.vehicles}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary mb-1">Personnel</p>
                    <p className="font-bold text-accent">{op.personnel}</p>
                  </div>
                </div>

                <div className="md:col-span-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-text-secondary">Progress</p>
                    <p className="text-sm font-bold text-accent">{op.progress}%</p>
                  </div>
                  <div className="w-full bg-background-tertiary rounded-full h-2 overflow-hidden">
                    <motion.div className="h-full bg-accent glow-accent" initial={{ width: 0 }} animate={{ width: `${op.progress}%` }} transition={{ duration: 1, delay: i * 0.1 }} />
                  </div>
                </div>

                <div className="md:col-span-2 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-text-secondary mb-1">ETA</p>
                    <p className="font-bold text-foreground">{op.eta}</p>
                  </div>
                  <motion.button className="px-4 py-2 rounded-lg bg-background-tertiary hover:border-accent transition-all text-accent text-sm font-bold" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    Details
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  )
}
