import React, { useState } from 'react'
import MapPlaceholder from '../components/MapPlaceholder'

export default function RoutePlanner() {
    const [start, setStart] = useState('')
    const [end, setEnd] = useState('')

    return (
        <div className="page route-planner">
            <header className="page-header">
                <h1>Route Planner</h1>
                <p>Plan and optimize new convoy routes</p>
            </header>

            <div className="grid-two">
                <div className="panel">
                    <label>Start Coordinates</label>
                    <input value={start} onChange={e => setStart(e.target.value)} placeholder="12.9716,77.5946" />
                    <label>End Coordinates</label>
                    <input value={end} onChange={e => setEnd(e.target.value)} placeholder="12.2958,76.6394" />
                    <button className="btn" disabled={!start || !end}>Preview</button>
                </div>

                <div className="panel">
                    <MapPlaceholder />
                </div>
            </div>
        </div>
    )
}
