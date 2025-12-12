import React, { useState } from 'react'
import MapPlaceholder from '../components/MapPlaceholder'

export default function Emergency() {
    const [active, setActive] = useState(false)
    return (
        <div className="page emergency">
            <header className="page-header">
                <h1>Emergency Routing</h1>
                <p>Quick reroute protocol for threat situations</p>
            </header>

            <div className="grid-two">
                <div className="panel">
                    <h3>Threat Assessment</h3>
                    <div className="threat">{active ? 'CRITICAL' : 'NORMAL'}</div>
                    <button className={"btn " + (active ? 'danger' : '')} onClick={() => setActive(!active)}>{active ? 'Deactivate' : 'Activate Reroute'}</button>
                </div>
                <div className="panel">
                    <MapPlaceholder />
                </div>
            </div>
        </div>
    )
}