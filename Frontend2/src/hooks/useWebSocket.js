import { useEffect, useRef, useState } from 'react'

// Simple simulated websocket that emits random positions every second for demo
export default function useWebSocket(missionId) {
    const [connected, setConnected] = useState(false)
    const [lastMessage, setLastMessage] = useState(null)
    const timerRef = useRef(null)

    useEffect(() => {
        setConnected(true)
        timerRef.current = setInterval(() => {
            const msg = {
                mission_id: missionId,
                lat: 12.97 + (Math.random() - 0.5) * 0.02,
                lng: 77.59 + (Math.random() - 0.5) * 0.02,
                speed: Math.round(40 + Math.random() * 20),
                timestamp: new Date().toLocaleTimeString()
            }
            setLastMessage(msg)
        }, 1200)

        return () => {
            clearInterval(timerRef.current)
            setConnected(false)
        }
    }, [missionId])

    return { connected, lastMessage }
}
