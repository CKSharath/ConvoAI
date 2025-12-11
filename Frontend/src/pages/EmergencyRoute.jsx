import React, { useEffect, useState } from "react";
import MapView from "../components/MapView";
import { socket } from "../socket";

export default function EmergencyRoute() {
    const [route, setRoute] = useState([]);
    const [hazards, setHazards] = useState([]);
    const [info, setInfo] = useState({ eta: "-", safetyScore: "-" });

    useEffect(() => {
        socket.emit("request_emergency_route", { from: [12.9716, 77.5946] });
        socket.on("emergency_route", (payload) => {
            setRoute(payload.polyline || []);
            setHazards(payload.predictedHazards || []);
            setInfo({ eta: payload.eta || "-", safetyScore: payload.safety_score || "-" });
        });
        return () => socket.off("emergency_route");
    }, []);

    return (
        <div className="page">
            <div className="map-full">
                <MapView points={route} hazards={hazards} />
            </div>

            <div className="info-panel">
                <h3>Emergency Routing</h3>
                <div><strong>ETA:</strong> {info.eta}</div>
                <div><strong>Safety:</strong> {info.safetyScore}</div>
            </div>
        </div>
    );
}