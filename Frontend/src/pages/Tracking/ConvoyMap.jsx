import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MapView from "../../components/MapView";
import { socket } from "../../socket";

export default function ConvoyMap() {
    const { id } = useParams();
    const [convoy, setConvoy] = useState(null);
    const [route, setRoute] = useState([]);
    const [hazards, setHazards] = useState([]);
    const [info, setInfo] = useState({ eta: "-", safetyScore: "-" });

    useEffect(() => {
        // subscribe to position updates for this convoy id
        const posEvent = `${id}:position`;
        const routeEvent = `${id}:route`;
        const hazardEvent = `${id}:hazards`;

        socket.on(posEvent, (payload) => setConvoy(payload));
        socket.on(routeEvent, (payload) => {
            setRoute(payload.polyline || []);
            setInfo((p) => ({ ...p, eta: payload.eta, safetyScore: payload.safety_score }));
        });
        socket.on(hazardEvent, (payload) => setHazards(payload));

        // ask server to start sending (optional)
        socket.emit("subscribe_convoy", { id });

        return () => {
            socket.off(posEvent);
            socket.off(routeEvent);
            socket.off(hazardEvent);
            socket.emit("unsubscribe_convoy", { id });
        };
    }, [id]);

    return (
        <div className="page">
            <div className="map-full">
                <MapView points={route} convoy={convoy} hazards={hazards} />
            </div>

            <div className="info-panel">
                <h3>{id} — Live</h3>
                <div><strong>ETA:</strong> {info.eta}</div>
                <div><strong>Safety Score:</strong> {info.safetyScore}</div>
                <div style={{ marginTop: 10 }}>
                    <Link to={`/tracking/${id}/details`} className="btn">Vehicle Details</Link>
                </div>
            </div>
        </div>
    );
}