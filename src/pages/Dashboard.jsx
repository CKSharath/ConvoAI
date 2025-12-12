import React from "react"
import Navbar from "../components/Navbar"
import MissionCard from "../components/MissionCard"
import Footer from "../components/Footer"
import { motion } from "framer-motion"
import { Radar, Route, AlertTriangle } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Dashboard() {
  const navigate = useNavigate()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 px-8 pb-16">
        <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl font-bold mb-2 text-foreground">Mission Control Center</h1>
          <p className="text-text-secondary">Real-time convoy tracking and mission management system</p>
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" variants={containerVariants} initial="hidden" animate="visible">
          <MissionCard
            icon={<Radar className="w-6 h-6" />}
            title="Convoy Tracking"
            description="Monitor active convoys in real-time with GPS positioning"
            stats={[
              { label: "Active", value: "12" },
              { label: "Status", value: "Nominal" }
            ]}
            onClick={() => navigate("/tracking")}
          />

          <MissionCard
            icon={<Route className="w-6 h-6" />}
            title="Mission Planner"
            description="Plan and optimize new convoy routes and operations"
            stats={[
              { label: "Planned", value: "8" },
              { label: "Efficiency", value: "94%" }
            ]}
            onClick={() => navigate("/route-planner")}
          />

          <MissionCard
            icon={<AlertTriangle className="w-6 h-6" />}
            title="Emergency Routing"
            description="Quick emergency reroute protocols for threat situations"
            stats={[
              { label: "Ready", value: "5" },
              { label: "Response", value: "2s" }
            ]}
            onClick={() => navigate("/emergency")}
          />
        </motion.div>

        {/* Quick Stats */}
        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {[
            { label: "Total Convoys", value: "47" },
            { label: "Missions Completed", value: "234" },
            { label: "System Health", value: "99.8%" },
            { label: "Avg Response Time", value: "1.2s" }
          ].map((stat, i) => (
            <motion.div key={i} className="glass rounded-lg p-4 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.1 }}>
              <p className="text-text-secondary text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-accent">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <Footer />
    </main>
  )
}
