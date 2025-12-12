
// import React from 'react';
// import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
// import L from 'leaflet';
// // Import a custom icon, since default Leaflet icons often break in React
// import iconUrl from '../assets/icons/vehicle.svg';
// // 
// import { VehicleIcon } from '../assets';
// // Define a custom icon for the vehicle
// const vehicleIcon = new L.Icon({
//     iconUrl: VehicleIcon, // <-- USED IMPORTED VARIABLE
//     iconSize: [38, 38],
//     iconAnchor: [19, 38],
//     popupAnchor: [0, -38]
// });

// // A component to re-center the map when the position changes
// function ChangeView({ center }) {
//     const map = useMap();
//     map.setView(center, map.getZoom());
//     return null;
// }

// // Main Map Component
// export default function LiveMap({ position, routePolyline = [], activeRouteId, zoom = 13, children }) {
//     const defaultCenter = [12.9716, 77.5946];
//     const mapCenter = position ? [position.lat, position.lng] : defaultCenter;

//     // Determine the map view center/zoom based on route or position
//     const mapBounds = routePolyline.length > 0
//         ? L.latLngBounds(routePolyline.flatMap(r => r.polyline))
//         : null;

//     function FitBounds({ bounds }) {
//         const map = useMap();
//         React.useEffect(() => {
//             if (bounds) {
//                 map.fitBounds(bounds, { padding: [50, 50] });
//             } else {
//                 map.setView(mapCenter, map.getZoom()); // Revert to center if no bounds
//             }
//         }, [bounds, map]);
//         return null;
//     }

//     return (
//         <MapContainer
//             center={mapCenter}
//             zoom={zoom}
//             scrollWheelZoom={true}
//             style={{ height: '100%', width: '100%', borderRadius: '12px' }}
//         >
//             {mapBounds ? <FitBounds bounds={mapBounds} /> : <ChangeView center={mapCenter} />}

//             <TileLayer
//                 attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             />

//             {/* Draw ALL routes first */}
//             {routePolyline.map(route => {
//                 // Dim secondary routes
//                 const isSelected = route.id === activeRouteId;
//                 const pathOptions = {
//                     color: isSelected ? 'var(--accent)' : 'rgba(0, 255, 65, 0.4)',
//                     weight: isSelected ? 5 : 3,
//                     opacity: isSelected ? 1 : 0.6
//                 };

//                 return (
//                     <Polyline
//                         key={route.id}
//                         positions={route.polyline}
//                         pathOptions={pathOptions}
//                     >
//                         <Popup>
//                             Route: {route.name} <br />
//                             ETA: {route.etaMinutes} min <br />
//                             Safety: {route.safeScore}%
//                         </Popup>
//                     </Polyline>
//                 );
//             })}

//             {position && (
//                 <Marker position={mapCenter} icon={vehicleIcon}>
//                     <Popup>Vehicle Location</Popup>
//                 </Marker>
//             )}

//             {children}
//         </MapContainer>
//     );
// }
import React from 'react';
// FIX: Ensure Polyline is imported from react-leaflet to resolve the ReferenceError
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';

// Import assets from the central index
import { VehicleIcon } from '../assets';

// Define a custom icon for the vehicle
const vehicleIcon = new L.Icon({
    iconUrl: VehicleIcon,
    iconSize: [38, 38], // size of the icon
    iconAnchor: [19, 38], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -38] // point from which the popup should open relative to the iconAnchor
});

// A component to re-center the map when the position changes
function ChangeView({ center }) {
    const map = useMap();
    map.setView(center, map.getZoom());
    return null;
}

// A component to set the map bounds to fit the route
function FitBounds({ bounds }) {
    const map = useMap();
    React.useEffect(() => {
        if (bounds) {
            // Fit the map view to the calculated bounds with some padding
            map.fitBounds(bounds, { padding: [50, 50] });
        } else {
            // If no bounds, reset to the center point
            map.setView(map.getCenter(), map.getZoom());
        }
    }, [bounds, map]);
    return null;
}

// Main Map Component
export default function LiveMap({ position, routePolyline = [], activeRouteId, zoom = 13, children }) {
    const defaultCenter = [12.9716, 77.5946]; // Default: Bengaluru
    const mapCenter = position ? [position.lat, position.lng] : defaultCenter;

    // Calculate the map bounds if routes are present
    const mapBounds = routePolyline.length > 0
        ? L.latLngBounds(routePolyline.flatMap(r => r.polyline))
        : null;

    // Choose which view handler to use: FitBounds for routes, ChangeView for simple tracking
    const MapViewHandler = mapBounds ? <FitBounds bounds={mapBounds} /> : <ChangeView center={mapCenter} />;

    return (
        <MapContainer
            center={mapCenter}
            zoom={zoom}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%', borderRadius: '12px' }}
        >
            {MapViewHandler}

            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Draw ALL routes, highlighting the active one */}
            {routePolyline.map(route => {
                const isSelected = route.id === activeRouteId;
                const pathOptions = {
                    // Use a bright color for the selected route
                    color: isSelected ? 'var(--accent)' : 'rgba(0, 255, 65, 0.4)',
                    weight: isSelected ? 5 : 3,
                    opacity: isSelected ? 1 : 0.6,
                    // Use a dashed line for non-selected routes
                    dashArray: isSelected ? null : '10, 10'
                };

                return (
                    // Polyline is now correctly defined and used here
                    <Polyline
                        key={route.id}
                        positions={route.polyline}
                        pathOptions={pathOptions}
                    >
                        <Popup>
                            Route: {route.name} <br />
                            ETA: {route.etaMinutes} min <br />
                            Safety: {route.safeScore}%
                        </Popup>
                    </Polyline>
                );
            })}

            {/* Display the vehicle marker if a position is provided */}
            {position && (
                <Marker position={[position.lat, position.lng]} icon={vehicleIcon}>
                    <Popup>
                        Vehicle Location<br />
                        Lat: {position.lat.toFixed(4)}<br />
                        Lng: {position.lng.toFixed(4)}
                    </Popup>
                </Marker>
            )}

            {children}
        </MapContainer>
    );
}