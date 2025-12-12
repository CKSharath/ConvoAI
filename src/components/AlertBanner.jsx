import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, AlertTriangle, AlertCircle, CheckCircle } from "lucide-react"

export default function AlertBanner({ type, title, message, onClose, autoClose = 5000 }) {
  const [isVisible, setIsVisible] = useState(true)

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(handleClose, autoClose)
      return () => clearTimeout(timer)
    }
  }, [autoClose])

  const bgColor = {
    error: "bg-danger/20 border-danger",
    warning: "bg-warning/20 border-warning",
    success: "bg-accent/20 border-accent"
  }[type]

  const textColor = {
    error: "text-danger",
    warning: "text-warning",
    success: "text-accent"
  }[type]

  const Icon = {
    error: AlertTriangle,
    warning: AlertCircle,
    success: CheckCircle
  }[type]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div className={`glass rounded-lg border-2 ${bgColor} p-4 mb-6`} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
          <div className="flex items-start gap-3">
            <Icon className={`w-5 h-5 ${textColor} flex-shrink-0 mt-0.5`} />
            <div className="flex-1">
              <p className={`font-bold ${textColor}`}>{title}</p>
              <p className="text-sm text-text-secondary">{message}</p>
            </div>
            <button onClick={handleClose} className="text-text-secondary hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
