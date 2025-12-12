import React, { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ChevronDown, User } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeItem, setActiveItem] = useState("dashboard")

  const navItems = [
    { id: "dashboard", label: "Dashboard", href: "/" },
    { id: "tracking", label: "Live Tracking", href: "/tracking" },
    { id: "planner", label: "New Mission", href: "/route-planner" },
    { id: "emergency", label: "Emergency", href: "/emergency" }
  ]

  return (
    <motion.nav className="fixed top-0 left-0 right-0 z-50 bg-background-secondary border-b tactical-border" initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
      <div className="max-w-full px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent-light rounded flex items-center justify-center font-bold text-background">◆</div>
            <span className="text-xl font-bold text-accent">COMMAND</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <motion.div key={item.id} className="relative" onMouseEnter={() => setActiveItem(item.id)}>
                <Link to={item.href} className={`text-sm font-medium transition-colors duration-300 ${activeItem === item.id ? "text-accent" : "text-text-secondary hover:text-accent"}`}>
                  {item.label}
                </Link>
                {activeItem === item.id && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" layoutId="navbar-underline" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.3 }} />}
              </motion.div>
            ))}
          </div>

          <div className="relative">
            <motion.button className="flex items-center gap-2 px-4 py-2 rounded-lg glass hover:glow-accent transition-all" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsOpen(!isOpen)}>
              <User className="w-4 h-4" />
              <ChevronDown className="w-4 h-4" />
            </motion.button>

            {isOpen && (
              <motion.div className="absolute right-0 mt-2 w-48 rounded-lg glass border-accent border" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="p-4 space-y-2">
                  <button className="w-full text-left px-3 py-2 rounded hover:bg-background-tertiary text-sm">Profile</button>
                  <button className="w-full text-left px-3 py-2 rounded hover:bg-background-tertiary text-sm">Settings</button>
                  <button className="w-full text-left px-3 py-2 rounded hover:bg-background-tertiary text-sm text-danger">Logout</button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
