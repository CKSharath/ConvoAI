import React, { useState } from "react"
import Navbar from "../components/Navbar"
import MissionHeader from "../components/MissionHeader"
import Timeline from "../components/Timeline"
import { motion } from "framer-motion"
import { AlertCircle } from "lucide-react"

export default function Logs() {
  const [searchQuery, setSearchQuery] = useState("")

  const timelineEvents = [
    {
      id: "LOG-001",
      time: "12:45:32",
      title: "Operation Sentinel Initiated",
      description: "Convoy departure from Base Alpha with 4 vehicles",
      status: "completed"
    },
    {
      id: "LOG-002",
      time: "12:52:15",
      title: "Route Checkpoint 1 Cleared",
      description: "All units passed security checkpoint successfully",
      status: "completed"
    },
    {
      id: "LOG-003",
      time: "13:05:47",
      title: "Minor Traffic Alert",
      description: "Civilian traffic detected at junction, route adjusted",
      status: "completed"
    },
    {
      id: "LOG-004",
      time: "13:22:18",
      title: "Midpoint Checkpoint Reached",
      description: "Convoy at halfway point, all systems nominal",
      status: "active"
    },
    {
      id: "LOG-005",
      time: "13:45:00 (EST)",
      title: "Destination Arrival Expected",
      description: "Final leg of mission in progress",
      status: "pending"
    }
  ]

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 px-8 pb-16">
        <MissionHeader title="Mission Logs" subtitle="Real-time activity log for all operations" />

        <div className="mb-8">
          <input type="text" placeholder="Search logs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-background-secondary rounded-lg px-4 py-3 text-foreground placeholder-text-secondary border border-accent/30 focus:border-accent outline-none transition-colors" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div className="lg:col-span-2 glass rounded-lg p-6" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <h3 className="text-accent font-bold mb-6">Activity Timeline</h3>
            <Timeline events={timelineEvents} />
          </motion.div>

          <motion.div className="space-y-4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="glass rounded-lg p-4">
              <p className="text-xs text-text-secondary mb-3">Total Events</p>
              <p className="text-3xl font-bold text-accent">247</p>
              <p className="text-xs text-text-secondary mt-2">in last 24 hours</p>
            </div>

            <div className="glass rounded-lg p-4">
              <p className="text-xs text-text-secondary mb-3">Warnings</p>
              <p className="text-3xl font-bold text-warning">3</p>
              <p className="text-xs text-text-secondary mt-2">minor incidents</p>
            </div>

            <div className="glass rounded-lg p-4 border border-accent/30">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-accent" />
                <p className="text-xs text-accent font-bold">Latest Alert</p>
              </div>
              <p className="text-sm text-foreground">Traffic anomaly detected at Checkpoint 3. Route automatically adjusted.</p>
            </div>

            <div className="glass rounded-lg p-4">
              <p className="text-xs text-text-secondary mb-3">System Health</p>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs text-foreground">Network</p>
                    <p className="text-xs text-accent font-bold">99.9%</p>
                  </div>
                  <div className="w-full bg-background-tertiary rounded-full h-1.5 overflow-hidden">
                    <div className="w-full h-full bg-accent" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs text-foreground">Response Time</p>
                    <p className="text-xs text-accent font-bold">45ms</p>
                  </div>
                  <div className="w-full bg-background-tertiary rounded-full h-1.5 overflow-hidden">
                    <div className="w-4/5 h-full bg-accent" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
