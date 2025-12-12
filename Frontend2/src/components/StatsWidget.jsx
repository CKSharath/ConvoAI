import React from 'react'

export default function StatsWidget({ label, value }) {
    return (
        <div className="stats-widget">
            <div className="label">{label}</div>
            <div className="value">{value}</div>
        </div>
    )
}