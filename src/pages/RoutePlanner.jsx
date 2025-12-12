import React, { useState } from "react"
import Navbar from "../components/Navbar"
import MapPlaceholder from "../components/MapPlaceholder"
import { motion } from "framer-motion"
import { ChevronRight, Check } from "lucide-react"

const VEHICLES = [
  { id: "1", name: "Alpha-1", type: "truck", capacity: "5 tons" },
  { id: "2", name: "Bravo-2", type: "jeep", capacity: "2 tons" },
  { id: "3", name: "Charlie-3", type: "armored", capacity: "3 tons" },
  { id: "4", name: "Delta-4", type: "truck", capacity: "5 tons" }
]

export default function RoutePlanner() {
  const [step, setStep] = useState("select-points")
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [startPoint, setStartPoint] = useState("")
  const [endPoint, setEndPoint] = useState("")

  const canProceed = {
    "select-points": startPoint && endPoint,
    "select-vehicle": !!selectedVehicle,
    preview: true
  }

  const stepTitles = {
    "select-points": "Select Route Points",
    "select-vehicle": "Select Vehicle",
    preview: "Preview & Confirm"
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 px-8 pb-16">
        <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-foreground mb-1">Route Planner</h1>
          <p className="text-text-secondary">
            Step {["select-points", "select-vehicle", "preview"].indexOf(step) + 1} of 3
          </p>
        </motion.div>

        <div className="flex gap-4 mb-8">
          {["select-points", "select-vehicle", "preview"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <motion.div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step === s ? "bg-accent text-background glow-accent" : ["select-points", "select-vehicle", "preview"].indexOf(s) < ["select-points", "select-vehicle", "preview"].indexOf(step) ? "bg-accent/50 text-background" : "bg-background-tertiary text-text-secondary border border-accent"}`} animate={{ scale: step === s ? 1.1 : 1 }}>
                {["select-points", "select-vehicle", "preview"].indexOf(s) < ["select-points", "select-vehicle", "preview"].indexOf(step) ? <Check className="w-4 h-4" /> : i + 1}
              </motion.div>
              {i < 2 && <div className={`h-0.5 w-12 ${i < ["select-points", "select-vehicle", "preview"].indexOf(step) ? "bg-accent" : "bg-background-tertiary"}`} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div className="lg:col-span-2 h-96" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <MapPlaceholder />
          </motion.div>

          <motion.div className="glass rounded-lg p-6 space-y-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h3 className="text-accent font-bold">{stepTitles[step]}</h3>

            {step === "select-points" && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-text-secondary mb-2 block">Start Coordinates</label>
                  <input type="text" placeholder="40.7128, -74.0060" value={startPoint} onChange={(e) => setStartPoint(e.target.value)} className="w-full bg-background-tertiary rounded px-3 py-2 text-foreground placeholder-text-secondary border border-accent/30 focus:border-accent outline-none" />
                </div>
                <div>
                  <label className="text-sm text-text-secondary mb-2 block">End Coordinates</label>
                  <input type="text" placeholder="40.7589, -73.9851" value={endPoint} onChange={(e) => setEndPoint(e.target.value)} className="w-full bg-background-tertiary rounded px-3 py-2 text-foreground placeholder-text-secondary border border-accent/30 focus:border-accent outline-none" />
                </div>
                <p className="text-xs text-text-secondary">Click on the map or enter coordinates to select route points</p>
              </div>
            )}

            {step === "select-vehicle" && (
              <div className="space-y-3">
                {VEHICLES.map((vehicle) => (
                  <motion.button key={vehicle.id} className={`w-full p-3 rounded-lg text-left transition-all border-2 ${selectedVehicle === vehicle.id ? "border-accent bg-background-tertiary glow-accent" : "border-background-tertiary hover:border-accent"}`} whileHover={{ x: 4 }} onClick={() => setSelectedVehicle(vehicle.id)}>
                    <div className="font-bold text-foreground">{vehicle.name}</div>
                    <div className="text-xs text-text-secondary">{vehicle.type} - {vehicle.capacity} capacity</div>
                  </motion.button>
                ))}
              </div>
            )}

            {step === "preview" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-text-secondary">Route</p>
                    <p className="font-bold text-foreground">{startPoint} → {endPoint}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">Vehicle</p>
                    <p className="font-bold text-foreground">{VEHICLES.find((v) => v.id === selectedVehicle)?.name}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-accent/30">
                  <div>
                    <p className="text-xs text-text-secondary">ETA</p>
                    <p className="font-bold text-accent">45 min</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">Safety</p>
                    <p className="font-bold text-accent">94%</p>
                  </div>
                </div>
              </div>
            )}

            <button onClick={() => { if (step === "select-points") setStep("select-vehicle"); else if (step === "select-vehicle") setStep("preview") }} disabled={!canProceed[step]} className={`w-full py-2 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${canProceed[step] ? "bg-accent text-background hover:glow-accent-strong cursor-pointer" : "bg-background-tertiary text-text-secondary cursor-not-allowed opacity-50"}`}>
              {step === "preview" ? "Confirm Mission" : "Next"} <ChevronRight className="w-4 h-4" />
            </button>

            {step === "preview" && <button className="w-full py-2 px-4 rounded-lg font-bold bg-background-tertiary text-accent hover:glow-accent transition-all">Back to Edit</button>}
          </motion.div>
        </div>
      </div>
    </main>
  )
}
