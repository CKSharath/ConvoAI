import React, { useEffect, useState } from "react";
import MapView from "../../components/MapView";
import { socket } from "../../socket";

export default function NewRouteMap() {
    const [route, setRoute] = useState([]);
    const [hazards, setHazards] = useState([]);
    const [info, setInfo] = useState({ eta: "-", safetyScore: "-" });

    useEffect(() => {
        // For demo, request a route preview
        socket.emit("request_route_preview", { start: [12.97, 77.59], end: [12.98, 77.60] });
        socket.on("route_preview", (payload) => {
            setRoute(payload.polyline || []);
            setHazards(payload.predictedHazards || []);
            setInfo({ eta: payload.eta || "-", safetyScore: payload.safety_score || "-" });
        });

        return () => socket.off("route_preview");
    }, []);

    return (
        <div className="page">
            <div className="map-full">
                <MapView points={route} hazards={hazards} />
            </div>

            <div className="info-panel">
                <h3>Preview</h3>
                <div><strong>ETA:</strong> {info.eta}</div>
                <div><strong>Safety Score:</strong> {info.safetyScore}</div>
            </div>
        </div>
    );
}