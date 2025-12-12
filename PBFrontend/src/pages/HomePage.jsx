import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-88px)] p-4">
            <Link to="/tracking" className="bg-white rounded-lg flex items-center justify-center text-xl text-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300">Convoy Tracking</Link>
            <Link to="/new-route/select-points" className="bg-white rounded-lg flex items-center justify-center text-xl text-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300">New Route</Link>
            <Link to="/emergency" className="bg-white rounded-lg flex items-center justify-center text-xl text-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300">Emergency Routing</Link>
        </div>
    );
}