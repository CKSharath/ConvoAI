// import React, { useState, useEffect } from "react";
// import MapView from "../components/MapView";
// import { mockBangaloreChennaiRoute } from "../mock-data";

// export default function EmergencyRoute() {
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         // Simulate a loading delay
//         const timer = setTimeout(() => {
//             setIsLoading(false);
//         }, 1500); // 1.5 seconds loading time for demonstration

//         return () => clearTimeout(timer);
//     }, []);

//     // Mock emergency hazards data
//     const mockEmergencyHazards = [
//         { lat: 12.96, lng: 77.6, type: "Road Closure" },
//         { lat: 13.0, lng: 78.2, type: "Debris" },
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
//                     <MapView points={mockBangaloreChennaiRoute} hazards={mockEmergencyHazards} zoom={7} />
//                 )}
//             </div>

//             <div className="w-80 bg-white p-4 rounded-lg shadow-md">
//                 <h3 className="text-xl font-bold mb-4">Emergency Routing</h3>
//                 <div><strong>ETA:</strong> 6h 30min</div>
//                 <div><strong>Safety:</strong> Low</div>
//             </div>
//         </div>
//     );
// }
import React, { useState, useEffect } from "react";
import MapView from "../components/MapView";
import { mockBangaloreChennaiRoute } from "../mock-data";

export default function EmergencyRoute() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const mockEmergencyHazards = [
        { id: 1, lat: 12.96, lng: 77.6, type: "Road Closure" },
        { id: 2, lat: 13.0, lng: 78.2, type: "Debris" },
    ];

    return (
        <div className="flex gap-4">
            <div className="flex-1 rounded-lg overflow-hidden shadow-md relative" style={{ minHeight: 480 }}>
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-75 z-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                        <p className="ml-4 text-lg text-gray-700">Loading Map...</p>
                    </div>
                ) : (
                    <MapView points={mockBangaloreChennaiRoute} hazards={mockEmergencyHazards} zoom={7} />
                )}
            </div>

            <div className="w-80 bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Emergency Routing</h3>
                <div><strong>ETA:</strong> 6h 30min</div>
                <div><strong>Safety:</strong> Low</div>
            </div>
        </div>
    );
}
