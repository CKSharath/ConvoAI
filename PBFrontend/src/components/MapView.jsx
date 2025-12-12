// import React, { useEffect, useMemo, useRef } from "react";
// import { MapContainer, TileLayer, Polyline, Marker, Popup, CircleMarker, useMapEvents } from "react-leaflet";
// import L from "leaflet";

// // fix default icon paths for bundlers
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).href,
//     iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
//     shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).href,
// });

// function MapEvents({ onMapClick }) {
//     useMapEvents({
//         click(e) {
//             if (onMapClick) onMapClick([e.latlng.lat, e.latlng.lng]);
//         },
//     });
//     return null;
// }

// export default function MapView({
//     center = [12.9716, 77.5946],
//     zoom = 13,
//     points = [],
//     convoy = null,
//     hazards = [],
//     selectedPoints = [], // [[lat,lng], ...] - for interactive point selection
//     onMapClick = null,
//     showRoute = true,
// }) {
//     const mapRef = useRef(null);

//     useEffect(() => {
//         const map = mapRef.current;
//         if (!map) return;
//         if (points && points.length) {
//             const bounds = L.latLngBounds(points.map((p) => L.latLng(p[0], p[1])));
//             map.fitBounds(bounds, { padding: [40, 40] });
//         } else if (convoy?.position) {
//             map.setView(convoy.position, zoom);
//         } else if (selectedPoints && selectedPoints.length) {
//             const bounds = L.latLngBounds(selectedPoints.map((p) => L.latLng(p[0], p[1])));
//             map.fitBounds(bounds, { padding: [40, 40] });
//         }
//     }, [points, convoy, zoom, selectedPoints]);

//     const mapCenter = useMemo(() => {
//         if (points && points.length) return points[0];
//         if (convoy?.position) return convoy.position;
//         if (selectedPoints && selectedPoints.length) return selectedPoints[0];
//         return center;
//     }, [points, convoy, center, selectedPoints]);

//     return (
//         <MapContainer whenCreated={(m) => (mapRef.current = m)} center={mapCenter} zoom={zoom} style={{ height: "100%", width: "100%" }}>
//             <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />

//             {showRoute && points && points.length > 0 && <Polyline positions={points} weight={5} />}

//             {/* convoy marker */}
//             {convoy && convoy.position && (
//                 <>
//                     <Marker position={convoy.position} key={"convoy-marker"}>
//                         <Popup>
//                             <div>
//                                 <div>
//                                     <strong>Convoy</strong>
//                                 </div>
//                                 <div>Speed: {convoy.speed ?? "N/A"} km/h</div>
//                                 <div>Time: {convoy.timestamp ? new Date(convoy.timestamp).toLocaleString() : "-"}</div>
//                             </div>
//                         </Popup>
//                     </Marker>
//                     <CircleMarker center={convoy.position} radius={6} />
//                 </>
//             )}

//             {/* hazards */}
//             {hazards?.map((h) => (
//                 <Marker key={h.id ?? `${h.lat}-${h.lng}`} position={[h.lat ?? h.location?.[0], h.lng ?? h.location?.[1]]}>
//                     <Popup>
//                         <div>
//                             <strong>{h.type}</strong>
//                             <div>{h.note}</div>
//                         </div>
//                     </Popup>
//                 </Marker>
//             ))}

//             {/* selected points (for new-route point selection) */}
//             {selectedPoints?.map((p, idx) => (
//                 <Marker key={`sel-${idx}`} position={p} draggable={true} />
//             ))}

//             {/* capture clicks if callback provided */}
//             {onMapClick && <MapEvents onMapClick={onMapClick} />}
//         </MapContainer>
//     );
// }
import React, { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup, CircleMarker, useMapEvents } from "react-leaflet";
import L from "leaflet";

// fix default icon paths for bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).href,
    iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
    shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).href,
});

function MapEvents({ onMapClick }) {
    useMapEvents({
        click(e) {
            if (onMapClick) onMapClick([e.latlng.lat, e.latlng.lng]);
        },
    });
    return null;
}

export default function MapView({ center = [12.9716, 77.5946], zoom = 13, points = [], convoy = null, hazards = [], selectedPoints = [], onMapClick = null, showRoute = true }) {
    const mapRef = useRef(null);

    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        if (points && points.length) {
            const bounds = L.latLngBounds(points.map((p) => L.latLng(p[0], p[1])));
            map.fitBounds(bounds, { padding: [40, 40] });
        } else if (convoy?.position) {
            map.setView(convoy.position, zoom);
        } else if (selectedPoints && selectedPoints.length) {
            const bounds = L.latLngBounds(selectedPoints.map((p) => L.latLng(p[0], p[1])));
            map.fitBounds(bounds, { padding: [40, 40] });
        }
    }, [points, convoy, zoom, selectedPoints]);

    const mapCenter = useMemo(() => {
        if (points && points.length) return points[0];
        if (convoy?.position) return convoy.position;
        if (selectedPoints && selectedPoints.length) return selectedPoints[0];
        return center;
    }, [points, convoy, center, selectedPoints]);

    return (
        <MapContainer whenCreated={(m) => (mapRef.current = m)} center={mapCenter} zoom={zoom} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />

            {showRoute && points && points.length > 0 && <Polyline positions={points} weight={5} />}

            {convoy && convoy.position && (
                <>
                    <Marker position={convoy.position} key={"convoy-marker"}>
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
                <Marker key={h.id ?? `${h.lat}-${h.lng}`} position={[h.lat ?? h.location?.[0], h.lng ?? h.location?.[1]]}>
                    <Popup>
                        <div>
                            <strong>{h.type}</strong>
                            <div>{h.note}</div>
                        </div>
                    </Popup>
                </Marker>
            ))}

            {selectedPoints?.map((p, idx) => (
                <Marker key={`sel-${idx}`} position={p} draggable={false} />
            ))}

            {onMapClick && <MapEvents onMapClick={onMapClick} />}
        </MapContainer>
    );
}