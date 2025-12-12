import React from 'react'

export default function MapPlaceholder({ children }) {
    return (
        <div className="map-placeholder">
            <svg className="map-grid" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                    <pattern id="p" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" stroke="#063" strokeWidth="0.2" />
                    </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#p)" />
            </svg>

            <div className="map-center">
                <div className="radar-circle" />
                <div className="map-status">MAP ACTIVE<br /><small>GPS STREAMING...</small></div>
            </div>

            {children}
        </div>
    )
}
