import React, { useState } from 'react'
import MissionList from '../components/MissionList'
import LiveMap from '../components/LiveMap'

import { MissionProvider, useMissions } from '../context/MissionContext'
import useWebSocket from '../hooks/useWebSocket'

function TrackingInner() {
    // Retrieve missions, selected mission, and the setter for selection
    const { missions, selected, setSelected } = useMissions()

    // Use the ID of the selected mission for the WebSocket connection
    const [missionId, setMissionId] = useState(selected?.id || missions[0].id)
    const { lastMessage } = useWebSocket(missionId)

    function handleSelect(m) {
        setSelected(m)
        setMissionId(m.id)
    }

    // Derive data for the right panel
    const currentMission = missions.find(m => m.id === missionId) || selected;

    // --- Simulated Metrics (since utils are not provided) ---
    const simulatedETA = currentMission ? `${(currentMission.id * 8) + 16} min` : 'N/A';
    const simulatedVehicleCount = currentMission ? currentMission.id * 2 : 0;
    const missionStatus = lastMessage ? 'ACTIVE' : 'READY';

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
                    {/* Pass live position data to the map */}
                    <LiveMap position={lastMessage} />
                </section>

                <aside className="right-panel">
                    <div className="info-card">
                        <h3>{currentMission?.name || 'Select a Mission'}</h3>
                        {currentMission ? (
                            <div className="info-list">
                                {/* DYNAMIC VALUES HERE */}
                                <div>Vehicles<br /><strong>{simulatedVehicleCount} Active</strong></div>
                                <div>ETA<br /><strong>{simulatedETA}</strong></div>
                                <div>Status<br /><strong style={{ color: lastMessage ? 'var(--accent)' : 'var(--muted)' }}>{missionStatus}</strong></div>
                            </div>
                        ) : <div>No mission selected.</div>}

                        <button className="btn">Go to Details</button>

                        <div className="gps-stream">
                            <h4>Live Telemetry Stream</h4>
                            <pre>{lastMessage
                                ? `[{last}] Position: ${lastMessage.lat.toFixed(4)}, ${lastMessage.lng.toFixed(4)}\nSpeed: ${lastMessage.speed} km/h\nUpdated: ${lastMessage.timestamp}`
                                : `Mission ID: ${missionId}\nStatus: Waiting for telemetry link...`
                            }</pre>
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