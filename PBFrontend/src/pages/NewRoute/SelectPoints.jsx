// import React from "react";
// import { useNavigate } from "react-router-dom";

// export default function SelectPoints({ newRoute, setNewRoute }) {
//     const nav = useNavigate();

//     const handleNext = () => {
//         nav("/new-route/select-vehicle");
//     };

//     return (
//         <div className="flex flex-col items-center justify-center h-full p-4 bg-gray-100">
//             <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//                 <h2 className="text-2xl font-bold mb-6 text-center">Select Start & End Points</h2>

//                 <div className="mb-4">
//                     <label htmlFor="source" className="block text-gray-700 text-sm font-bold mb-2">
//                         Source
//                     </label>
//                     <input
//                         type="text"
//                         id="source"
//                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         placeholder="Enter source location"
//                         value={newRoute.source}
//                         onChange={(e) => setNewRoute({ ...newRoute, source: e.target.value })}
//                     />
//                 </div>

//                 <div className="mb-6">
//                     <label htmlFor="destination" className="block text-gray-700 text-sm font-bold mb-2">
//                         Destination
//                     </label>
//                     <input
//                         type="text"
//                         id="destination"
//                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         placeholder="Enter destination location"
//                         value={newRoute.destination}
//                         onChange={(e) => setNewRoute({ ...newRoute, destination: e.target.value })}
//                     />
//                 </div>

//                 {/* Mock Map Placeholder */}
//                 <div className="bg-gray-200 h-48 w-full rounded-md flex items-center justify-center text-gray-500 mb-6">
//                     [Mock Map Placeholder]
//                 </div>

//                 <button
//                     onClick={handleNext}
//                     className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:shadow-outline"
//                 >
//                     Next: Select Vehicle
//                 </button>
//             </div>
//         </div>
//     );
// } 
import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import MapView from "../../components/MapView";

export default function SelectPoints() {
    const nav = useNavigate();
    const { newRoute, setNewRoute } = useOutletContext();

    const localPoints = React.useMemo(() => newRoute.coordinates || [], [newRoute]);

    const handleMapClick = (latlng) => {
        // latlng is [lat, lng]
        const updated = (localPoints.length >= 2) ? [latlng] : [...localPoints, latlng];
        setNewRoute((prev = {}) => ({ ...prev, coordinates: updated }));
    };

    const handleClear = () => {
        setNewRoute((prev = {}) => ({ ...prev, coordinates: [], sourceText: "", destinationText: "" }));
    };

    const handleNext = () => {
        if ((newRoute.coordinates || []).length < 2) {
            alert("Please select start and end points (by clicking on the map) or enter source/destination text.");
            return;
        }
        nav("/new-route/select-vehicle");
    };

    return (
        <div className="flex flex-col items-center justify-center h-full p-4 bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
                <h2 className="text-2xl font-bold mb-4 text-center">Select Start & End Points (Map or Text)</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Source (text)</label>
                        <input
                            value={newRoute.sourceText}
                            onChange={(e) => setNewRoute((prev = {}) => ({ ...prev, sourceText: e.target.value }))}
                            placeholder="Type an address or leave empty to use map"
                            className="w-full p-2 border rounded"
                        />
                        <div className="text-xs text-gray-500 mt-1">Or click on the map to set coordinates</div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Destination (text)</label>
                        <input
                            value={newRoute.destinationText}
                            onChange={(e) => setNewRoute((prev = {}) => ({ ...prev, destinationText: e.target.value }))}
                            placeholder="Type an address or leave empty to use map"
                            className="w-full p-2 border rounded"
                        />
                        <div className="text-xs text-gray-500 mt-1">Or click on the map to set coordinates</div>
                    </div>
                </div>

                <div className="mb-4" style={{ height: 360 }}>
                    <MapView points={[]} selectedPoints={localPoints} onMapClick={handleMapClick} zoom={5} />
                </div>

                <div className="flex gap-2">
                    <button onClick={handleNext} className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Next: Select Vehicle</button>
                    <button onClick={handleClear} className="flex-1 bg-gray-200 py-2 rounded-md">Clear</button>
                </div>
            </div>
        </div>
    );
}