import React, { useState } from "react"
import Navbar from "../components/Navbar"
import MapPlaceholder from "../components/MapPlaceholder"
import { motion } from "framer-motion"
import { AlertTriangle, Radio } from "lucide-react"

export default function Emergency() {
  const [isActive, setIsActive] = useState(false)

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {isActive && (
        <motion.div className="fixed top-20 left-0 right-0 bg-danger/80 backdrop-blur-md py-4 px-8 text-center z-40" animate={{ opacity: [1, 0.7, 1] }} transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}>
          <div className="flex items-center justify-center gap-3">
            <AlertTriangle className="w-6 h-6" />
            <span className="font-bold text-lg">EMERGENCY REROUTE ACTIVE</span>
            <AlertTriangle className="w-6 h-6" />
          </div>
        </motion.div>
      )}

      <div className={`pt-24 px-8 pb-16 ${isActive ? "mt-16" : ""}`}>
        <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-foreground mb-1">Emergency Routing</h1>
          <p className="text-text-secondary">Quick reroute protocol for threat situations</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          <motion.div className="glass rounded-lg p-6 space-y-4 overflow-y-auto" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div>
              <h3 className={`font-bold mb-4 ${isActive ? "text-danger glow-red" : "text-accent"}`}>Threat Assessment</h3>

              <div className="space-y-3">
                <div className={`p-3 rounded-lg ${isActive ? "bg-danger/20 border border-danger" : "bg-background-tertiary border border-accent/30"}`}>
                  <p className="text-xs text-text-secondary">Threat Level</p>
                  <p className={`font-bold ${isActive ? "text-danger" : "text-accent"}`}>{isActive ? "CRITICAL" : "NORMAL"}</p>
                </div>

                <div className={`p-3 rounded-lg ${isActive ? "bg-warning/20 border border-warning" : "bg-background-tertiary border border-accent/30"}`}>
                  <p className="text-xs text-text-secondary">Active Convoys</p>
                  <p className={`font-bold ${isActive ? "text-warning" : "text-accent"}`}>{isActive ? "3 at risk" : "4 nominal"}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-accent/30 pt-4">
              <label className="text-sm text-text-secondary mb-3 block">Emergency Trigger</label>
              <motion.button onClick={() => setIsActive(!isActive)} className={`w-full py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${isActive ? "bg-danger text-foreground glow-red hover:glow-red" : "bg-accent text-background hover:glow-accent-strong glow-accent"}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Radio className="w-4 h-4" />
                {isActive ? "REROUTE ACTIVE" : "ACTIVATE REROUTE"}
              </motion.button>
            </div>
          </motion.div>

          <motion.div className="lg:col-span-2" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
            <div className={`h-full rounded-lg transition-all ${isActive ? "border-2 border-danger glow-red" : ""}`}>
              <MapPlaceholder />
            </div>
          </motion.div>
        </div>

        {isActive && (
          <motion.div className="glass rounded-lg p-6 mt-6 border border-danger" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h3 className="text-danger font-bold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Identified Danger Zones
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { zone: "Zone A", threat: "High", distance: "2.3 km" },
                { zone: "Zone B", threat: "Medium", distance: "5.1 km" },
                { zone: "Zone C", threat: "High", distance: "1.8 km" }
              ].map((item, i) => (
                <div key={i} className="bg-danger/10 border border-danger rounded-lg p-3">
                  <p className="font-bold text-danger">{item.zone}</p>
                  <p className="text-xs text-text-secondary">Threat: {item.threat}</p>
                  <p className="text-xs text-text-secondary">Distance: {item.distance}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  )
}
