import React from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <motion.footer className="border-t tactical-border bg-background-secondary py-12 mt-20 opacity-90" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <div className="px-8 max-w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <p className="text-accent font-bold mb-4">Command Center</p>
            <p className="text-text-secondary text-sm">Military-grade mission control dashboard</p>
          </div>
          <div>
            <p className="text-foreground font-bold mb-4 text-sm">Navigation</p>
            <ul className="space-y-2 text-text-secondary text-sm">
              <li><Link to="/" className="hover:text-accent transition-colors">Dashboard</Link></li>
              <li><Link to="/tracking" className="hover:text-accent transition-colors">Tracking</Link></li>
              <li><Link to="/operations" className="hover:text-accent transition-colors">Operations</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-foreground font-bold mb-4 text-sm">System</p>
            <ul className="space-y-2 text-text-secondary text-sm">
              <li><Link to="/analytics" className="hover:text-accent transition-colors">Analytics</Link></li>
              <li><Link to="/logs" className="hover:text-accent transition-colors">Logs</Link></li>
              <li><Link to="/route-planner" className="hover:text-accent transition-colors">Route Planner</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-foreground font-bold mb-4 text-sm">Security</p>
            <ul className="space-y-2 text-text-secondary text-sm">
              <li>SSL Encrypted</li>
              <li>24/7 Monitoring</li>
              <li>Redundant Systems</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-accent/20 pt-8 flex items-center justify-between">
          <p className="text-text-secondary text-sm">© 2025 Command Center. All rights reserved.</p>
          <p className="text-accent text-sm font-mono">STATUS: OPERATIONAL</p>
        </div>
      </div>
    </motion.footer>
  )
}
