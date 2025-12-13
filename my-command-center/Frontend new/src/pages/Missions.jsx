import React from 'react'
import { MissionProvider, useMissions } from '../context/MissionContext'

function MissionsInner() {
    const { missions } = useMissions()
    return (
        <div className="page missions">
            <header className="page-header"><h1>Missions</h1></header>
            <div className="missions-grid">
                {missions.map(m => (
                    <div className="mission-card" key={m.id}>
                        <h3>{m.name}</h3>
                        <p>Priority: {m.priority}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function Missions() { return <MissionProvider><MissionsInner /></MissionProvider> }