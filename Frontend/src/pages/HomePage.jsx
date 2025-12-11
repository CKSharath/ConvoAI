import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
    return (
        <div className="home-grid">
            <Link to="/tracking" className="home-card">Convoy Tracking</Link>
            <Link to="/new-route/select-points" className="home-card">New Route</Link>
            <Link to="/emergency" className="home-card">Emergency Routing</Link>
        </div>
    );
}