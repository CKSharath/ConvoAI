import React, { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup, CircleMarker } from "react-leaflet";
import L from "leaflet";

// fix default icon paths for bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).href,
    iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
    shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).href,
});

export default function MapView({ center = [12.9716, 77.5946], zoom = 13, points = [], convoy = null, hazards = [] }) {
    const mapRef = useRef(null);

    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;
        if (points && points.length) {
            const bounds = L.latLngBounds(points.map(p => L.latLng(p[0], p[1])));
            map.fitBounds(bounds, { padding: [40, 40] });
        } else if (convoy?.position) {
            map.setView(convoy.position, zoom);
        }
    }, [points, convoy, zoom]);

    const mapCenter = useMemo(() => {
        if (points && points.length) return points[0];
        if (convoy?.position) return convoy.position;
        return center;
    }, [points, convoy, center]);

    return (
        <MapContainer
            whenCreated={(m) => (mapRef.current = m)}
            center={mapCenter}
            zoom={zoom}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />

            {points && points.length > 0 && <Polyline positions={points} weight={5} />}

            {convoy && convoy.position && (
                <>
                    <Marker position={convoy.position}>
                        <Popup>
                            <div>
                                <div><strong>Convoy</strong></div>
                                <div>Speed: {convoy.speed ?? "N/A"} km/h</div>
                                <div>Time: {convoy.timestamp ? new Date(convoy.timestamp).toLocaleString() : "-"}</div>
                            </div>
                        </Popup>
                    </Marker>
                    <CircleMarker center={convoy.position} radius={6} />
                </>
            )}

            {hazards?.map((h) => (
                <Marker key={h.id} position={h.location}>
                    <Popup>
                        <div><strong>{h.type}</strong><div>{h.note}</div></div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}