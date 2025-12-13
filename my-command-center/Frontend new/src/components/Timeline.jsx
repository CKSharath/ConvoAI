import React from 'react'

export default function Timeline({ events = [] }) {
    return (
        <div className="timeline">
            {events.map(e => (
                <div className="timeline-item" key={e.id}>
                    <div className="time">{e.time}</div>
                    <div className="content">
                        <div className="title">{e.title}</div>
                        <div className="desc">{e.description}</div>
                    </div>
                </div>
            ))}
        </div>
    )
}
