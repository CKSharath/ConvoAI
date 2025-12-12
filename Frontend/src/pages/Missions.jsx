import React from "react"
import { useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import MapPlaceholder from "../components/MapPlaceholder"
import { motion } from "framer-motion"
import { Clock, AlertCircle, Zap, Navigation, Gauge } from "lucide-react"
import MissionHeader from "../components/MissionHeader"

function DetailCard({ label, value, icon, color = "accent" }) {
  const colorClass = {
    accent: "text-accent",
    warning: "text-warning",
    danger: "text-danger"
  }[color]

  return (
    <div className="flex items-center gap-3 p-3 bg-background-tertiary rounded-lg">
      <div className={`${colorClass}`}>{icon}</div>
      <div>
        <p className="text-xs text-text-secondary">{label}</p>
        <p className="font-bold text-foreground">{value}</p>
      </div>
    </div>
  )
}

export default function Missions() {
  const params = useParams()

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 px-8 pb-16">
        <motion.div className="mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h1 className="text-3xl font-bold text-foreground mb-1">Mission MIS-{params.id}</h1>
          <p className="text-text-secondary">Operation Sentinel - Real-time status</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          <motion.div className="glass rounded-lg p-6 overflow-y-auto space-y-4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div>
              <p className="text-xs text-text-secondary mb-3">Core Metrics</p>
              <div className="space-y-2">
                <DetailCard label="ETA" value="12:45 PM" icon={<Clock className="w-4 h-4" />} color="accent" />
                <DetailCard label="Safety Score" value="94%" icon={<Zap className="w-4 h-4" />} color="accent" />
                <DetailCard label="Route Status" value="Clear" icon={<Navigation className="w-4 h-4" />} color="accent" />
              </div>
            </div>

            <div className="border-t border-accent/30 pt-4">
              <p className="text-xs text-text-secondary mb-3">Alerts</p>
              <div className="space-y-2">
                <DetailCard label="Hazard Alert" value="None" icon={<AlertCircle className="w-4 h-4" />} color="accent" />
                <DetailCard label="Vehicle Status" value="All Systems OK" icon={<Gauge className="w-4 h-4" />} color="accent" />
              </div>
            </div>

            <button className="w-full mt-6 py-2 px-4 rounded-lg font-bold bg-accent text-background hover:glow-accent-strong transition-all">Emergency Override</button>
          </motion.div>

          <motion.div className="lg:col-span-2" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
            <MapPlaceholder />
          </motion.div>
        </div>

        <motion.div className="glass rounded-lg p-6 mt-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h3 className="text-accent font-bold mb-4">Route Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-text-secondary">Start Point</p>
              <p className="font-bold text-foreground">Base Alpha</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary">End Point</p>
              <p className="font-bold text-foreground">Base Zulu</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary">Distance</p>
              <p className="font-bold text-accent">145 km</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary">Est. Time</p>
              <p className="font-bold text-accent">2h 15m</p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
