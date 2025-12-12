// import React, { useState, useEffect } from "react";
// import { useParams, Link } from "react-router-dom";
// import MapView from "../../components/MapView";
// import { mockConvoys, mockMissions, mockMumbaiPuneRoute } from "../../mock-data";

// export default function ConvoyMap() {
//     const { id } = useParams();
//     const [isLoading, setIsLoading] = useState(true);
//     const convoy = mockConvoys.find(c => c.id === parseInt(id));
//     const mission = mockMissions.find(m => m.id === convoy?.missionId);

//     useEffect(() => {
//         // Simulate a loading delay
//         const timer = setTimeout(() => {
//             setIsLoading(false);
//         }, 1500); // 1.5 seconds loading time for demonstration

//         return () => clearTimeout(timer);
//     }, []);

//     return (
//         <div className="flex gap-4">
//             <div className="flex-1 rounded-lg overflow-hidden shadow-md relative">
//                 {isLoading ? (
//                     <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-75 z-10">
//                         <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
//                         <p className="ml-4 text-lg text-gray-700">Loading Map...</p>
//                     </div>
//                 ) : (
//                     <MapView points={mockMumbaiPuneRoute} convoy={convoy} hazards={[]} zoom={7} />
//                 )}
//             </div>

//             <div className="w-80 bg-white p-4 rounded-lg shadow-md">
//                 <h3 className="text-xl font-bold mb-4">{convoy?.name} — Live</h3>
//                 <div><strong>ETA:</strong> {mission?.eta || "N/A"}</div>
//                 <div><strong>Safety Score:</strong> {mission?.safescore || "N/A"}</div>
//                 <div className="mt-4">
//                     <Link to={`/tracking/${id}/details`} className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md no-underline cursor-pointer">Vehicle Details</Link>
//                 </div>
//             </div>
//         </div>
//     );
// } 
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import MapView from "../../components/MapView";
import { mockConvoys, mockMissions, mockMumbaiPuneRoute } from "../../mock-data";
import { socket } from "../../socket";

export default function ConvoyMap() {
    const { id } = useParams();
    const convoyId = Number.parseInt(id, 10);
    const convoyBase = mockConvoys.find((c) => c.id === convoyId);
    const mission = mockMissions.find((m) => m.id === convoyBase?.missionId);

    const [isLoading, setIsLoading] = useState(true);
    const [convoyState, setConvoyState] = useState(() => ({ ...(convoyBase || {}), position: convoyBase?.position ?? [19.076, 72.8777], speed: convoyBase?.speed ?? 0, timestamp: convoyBase?.timestamp ?? Date.now() }));

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 700);

        function handleConvoyUpdate(data) {
            if (!data) return;
            const dataId = Number.parseInt(data.id, 10);
            if (dataId === convoyId) {
                setConvoyState((prev = {}) => ({ ...prev, ...data }));
            }
        }

        socket.on("convoy:update", handleConvoyUpdate);

        return () => {
            clearTimeout(timer);
            socket.off("convoy:update", handleConvoyUpdate);
        };
    }, [convoyId]);

    return (
        <div className="flex gap-4">
            <div className="flex-1 rounded-lg overflow-hidden shadow-md relative" style={{ minHeight: 480 }}>
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-75 z-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                        <p className="ml-4 text-lg text-gray-700">Loading Map...</p>
                    </div>
                ) : (
                    <MapView points={mockMumbaiPuneRoute} convoy={convoyState} hazards={[]} zoom={7} />
                )}
            </div>

            <div className="w-80 bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">{convoyBase?.name ?? `Convoy ${id}`} — Live</h3>
                <div><strong>ETA:</strong> {mission?.eta || "N/A"}</div>
                <div><strong>Safety Score:</strong> {mission?.safescore || "N/A"}</div>
                <div className="mt-4">
                    <Link to={`/tracking/${id}/details`} className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md no-underline cursor-pointer">Vehicle Details</Link>
                </div>
            </div>
        </div>
    );
}