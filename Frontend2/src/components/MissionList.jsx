import React from 'react'

export default function MissionList({ missions = [], selectedId, onSelect }) {
    return (
        <div className="mission-list">
            {missions.map(m => (
                <button key={m.id} className={"mission-item " + (selectedId === m.id ? 'selected' : '')} onClick={() => onSelect?.(m)}>
                    <div className="mission-left">
                        <div className="dot" />
                        <div className="title">{m.name}</div>
                    </div>
                    <div className="mission-right">
                        <div className="priority">{m.priority.toUpperCase()}</div>
                    </div>
                </button>
            ))}
        </div>
    )
}
