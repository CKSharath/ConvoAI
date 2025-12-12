// import React, { useState, useEffect } from "react";
// import MapView from "../../components/MapView";
// import { mockDelhiJaipurRoute } from "../../mock-data";

// export default function NewRouteMap({ newRoute }) {
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         // Simulate a loading delay
//         const timer = setTimeout(() => {
//             setIsLoading(false);
//         }, 1500); // 1.5 seconds loading time for demonstration

//         return () => clearTimeout(timer);
//     }, []);

//     // Mock hazards data
//     const mockHazards = [
//         { lat: 28.5, lng: 77.2, type: "Roadblock" },
//         { lat: 27.5, lng: 76.5, type: "Accident" },
//     ];

//     return (
//         <div className="flex gap-4">
//             <div className="flex-1 rounded-lg overflow-hidden shadow-md relative">
//                 {isLoading ? (
//                     <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-75 z-10">
//                         <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
//                         <p className="ml-4 text-lg text-gray-700">Loading Map...</p>
//                     </div>
//                 ) : (
//                     <MapView points={mockDelhiJaipurRoute} hazards={mockHazards} zoom={7} />
//                 )}
//             </div>

//             <div className="w-80 bg-white p-4 rounded-lg shadow-md">
//                 <h3 className="text-xl font-bold mb-4">Route Preview</h3>
//                 <div><strong>Source:</strong> {newRoute.source}</div>
//                 <div><strong>Destination:</strong> {newRoute.destination}</div>
//                 <div><strong>Vehicle:</strong> {newRoute.vehicle?.name}</div>
//                 <div className="mt-4">
//                     <div><strong>ETA:</strong> 5h 45min</div>
//                     <div><strong>Safety Score:</strong> 92%</div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// import React from "react";
// import { Outlet } from "react-router-dom";

// export default function NewRouteWrapper() {
//     const [newRoute, setNewRoute] = React.useState({
//         sourceText: "",
//         destinationText: "",
//         coordinates: [], // optional: [ [lat,lng], [lat,lng] ]
//         vehicle: null,
//     });

//     return <Outlet context={{ newRoute, setNewRoute }} />;
// }
import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import MapView from "../../components/MapView";

async function fetchRouteFromOSRM(start, end) {
    const [sLat, sLng] = start;
    const [eLat, eLng] = end;
    const url = `https://router.project-osrm.org/route/v1/driving/${sLng},${sLat};${eLng},${eLat}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`OSRM error: ${res.status}`);
    const data = await res.json();
    const coords = data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]]);
    const duration = data.routes[0].duration;
    const distance = data.routes[0].distance;
    return { coords, duration, distance };
}

export default function NewRouteMap() {
    const { newRoute } = useOutletContext();
    const [isLoading, setIsLoading] = useState(false);
    const [route, setRoute] = useState([]);
    const [routeInfo, setRouteInfo] = useState(null);

    useEffect(() => {
        // If coordinates exist (from SelectPoints), auto-generate route
        (async () => {
            if ((newRoute.coordinates || []).length >= 2) {
                setIsLoading(true);
                try {
                    const { coords, duration, distance } = await fetchRouteFromOSRM(newRoute.coordinates[0], newRoute.coordinates[1]);
                    setRoute(coords);
                    setRouteInfo({ duration, distance });
                } catch (err) {
                    console.error(err);
                } finally {
                    setIsLoading(false);
                }
            }
        })();
    }, [newRoute.coordinates]);

    // fallback hazards and sample points if no route
    const mockHazards = [
        { id: 1, lat: 28.5, lng: 77.2, type: "Roadblock" },
        { id: 2, lat: 27.5, lng: 76.5, type: "Accident" },
    ];

    return (
        <div className="flex gap-4">
            <div className="flex-1 rounded-lg overflow-hidden shadow-md relative" style={{ minHeight: 480 }}>
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-60 z-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                        <p className="ml-4 text-lg text-gray-700">Generating Route...</p>
                    </div>
                )}

                <MapView points={route.length ? route : []} hazards={mockHazards} zoom={6} selectedPoints={newRoute.coordinates || []} />
            </div>

            <div className="w-80 bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Route Preview</h3>
                <div><strong>Source:</strong> {newRoute.sourceText || (newRoute.coordinates?.[0] ? `${newRoute.coordinates[0][0].toFixed(4)}, ${newRoute.coordinates[0][1].toFixed(4)}` : "N/A")}</div>
                <div><strong>Destination:</strong> {newRoute.destinationText || (newRoute.coordinates?.[1] ? `${newRoute.coordinates[1][0].toFixed(4)}, ${newRoute.coordinates[1][1].toFixed(4)}` : "N/A")}</div>
                <div><strong>Vehicle:</strong> {newRoute.vehicle?.name || "(none)"}</div>

                <div className="mt-4">
                    {routeInfo ? (
                        <>
                            <div><strong>ETA:</strong> {Math.round(routeInfo.duration / 60)} min</div>
                            <div><strong>Distance:</strong> {(routeInfo.distance / 1000).toFixed(1)} km</div>
                        </>
                    ) : (
                        <div>Route not generated yet.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
