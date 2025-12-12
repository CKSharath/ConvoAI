import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
    const loc = useLocation()
    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <div className="brand">
                    <div className="logo">◆</div>
                    <div className="brand-text">COMMAND</div>
                </div>
                <div className="nav-links">
                    <Link className={loc.pathname === '/' ? 'active' : ''} to="/">Dashboard</Link>
                    <Link className={loc.pathname.startsWith('/tracking') ? 'active' : ''} to="/tracking">Live Tracking</Link>
                    <Link className={loc.pathname.startsWith('/route-planner') ? 'active' : ''} to="/route-planner">New Mission</Link>
                    <Link className={loc.pathname.startsWith('/emergency') ? 'active' : ''} to="/emergency">Emergency</Link>
                </div>
                <div className="profile">
                    <button className="profile-btn">⚙</button>
                </div>
            </div>
        </nav>
    )
}
