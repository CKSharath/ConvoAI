import React, { useState } from 'react'
import MissionList from '../components/MissionList'
import MapPlaceholder from '../components/MapPlaceholder'
import { MissionProvider, useMissions } from '../context/MissionContext'
import useWebSocket from '../hooks/useWebSocket'

function TrackingInner() {
    const { missions, selected, setSelected } = useMissions()
    const [missionId, setMissionId] = useState(missions[0].id)
    const { lastMessage } = useWebSocket(missionId)

    function handleSelect(m) {
        setSelected(m)
        setMissionId(m.id)
    }

    return (
        <div className="page tracking">
            <header className="page-header">
                <h1>Live Tracking</h1>
                <p>Real-time mission monitoring</p>
            </header>

            <div className="tracking-grid">
                <aside className="left-panel">
                    <MissionList missions={missions} selectedId={missionId} onSelect={handleSelect} />
                </aside>

                <section className="center-map">
                    <MapPlaceholder>
                        {/* show moving dot if lastMessage */}
                        {lastMessage && (
                            <div className="dot" style={{ left: '55%', top: '65%' }} title={`${lastMessage.lat}, ${lastMessage.lng}`} />
                        )}
                    </MapPlaceholder>
                </section>

                <aside className="right-panel">
                    <div className="info-card">
                        <h3>{missions.find(m => m.id === missionId)?.name}</h3>
                        {lastMessage ? (
                            <div className="info-list">
                                <div>Vehicles<br /><strong>4 Active</strong></div>
                                <div>ETA<br /><strong>24 min</strong></div>
                                <div>Status<br /><strong>ACTIVE</strong></div>
                            </div>
                        ) : <div>Waiting for GPS...</div>}

                        <button className="btn">Go to Details</button>

                        <div className="gps-stream">
                            <pre>{lastMessage ? `[{last}] Position: ${lastMessage.lat.toFixed(4)}, ${lastMessage.lng.toFixed(4)}\nSpeed: ${lastMessage.speed} km/h\nUpdated: ${lastMessage.timestamp}` : 'No stream yet'}</pre>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}

export default function Tracking() {
    return (
        <MissionProvider>
            <TrackingInner />
        </MissionProvider>
    )
}