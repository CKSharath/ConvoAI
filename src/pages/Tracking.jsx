import React, { useState } from "react"
import Navbar from "../components/Navbar"
import MissionList from "../components/MissionList"
import MapPlaceholder from "../components/MapPlaceholder"
import { motion } from "framer-motion"
import { Package, Clock, AlertCircle } from "lucide-react"

const MOCK_MISSIONS = [
  { id: "1", name: "Operation Sentinel", priority: "critical", status: "active", progress: 65 },
  { id: "2", name: "Supply Route Alpha", priority: "high", status: "active", progress: 42 },
  { id: "3", name: "Patrol Beta-7", priority: "medium", status: "active", progress: 78 },
  { id: "4", name: "Extraction Delta", priority: "high", status: "pending", progress: 0 }
]

export default function Tracking() {
  const [selectedMission, setSelectedMission] = useState(MOCK_MISSIONS[0])

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 px-8 pb-16">
        <motion.div className="mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-foreground mb-1">Live Tracking</h1>
          <p className="text-text-secondary">Real-time mission monitoring</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
          <motion.div className="lg:col-span-1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <MissionList missions={MOCK_MISSIONS} selectedId={selectedMission.id} onSelect={setSelectedMission} />
          </motion.div>

          <motion.div className="lg:col-span-2" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
            <MapPlaceholder />
          </motion.div>

          <motion.div className="lg:col-span-1 space-y-4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <div className="glass rounded-lg p-4">
              <h3 className="text-accent font-bold mb-4 text-sm">{selectedMission.name}</h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-accent" />
                  <div className="flex-1">
                    <p className="text-xs text-text-secondary">Vehicles</p>
                    <p className="font-bold">4 Active</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-accent" />
                  <div className="flex-1">
                    <p className="text-xs text-text-secondary">ETA</p>
                    <p className="font-bold">24 min</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <AlertCircle className="w-4 h-4 text-warning" />
                  <div className="flex-1">
                    <p className="text-xs text-text-secondary">Status</p>
                    <p className="font-bold">{selectedMission.status.toUpperCase()}</p>
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full glass rounded-lg px-4 py-3 font-bold text-accent hover:border-accent hover:glow-accent transition-all">Go to Details</button>

            <div className="glass rounded-lg p-4">
              <p className="text-xs text-text-secondary mb-3">GPS Stream</p>
              <div className="space-y-1 font-mono text-xs">
                <div className="text-accent">[12:45:32] Position: 40.7128, -74.0060</div>
                <div className="text-accent">[12:45:31] Speed: 45 km/h</div>
                <div className="text-accent">[12:45:30] Heading: 045°</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
