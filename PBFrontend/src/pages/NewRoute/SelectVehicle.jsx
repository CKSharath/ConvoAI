// import React from "react";
// import { useNavigate } from "react-router-dom";
// import VehicleCard from "../../components/VehicleCard";
// import { mockVehicles } from "../../mock-data";

// export default function SelectVehicle({ newRoute, setNewRoute }) {
//     const nav = useNavigate();

//     const handleSelect = (vehicle) => {
//         setNewRoute({ ...newRoute, vehicle });
//     };

//     return (
//         <div className="flex flex-col items-center justify-center h-full p-4 bg-gray-100">
//             <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
//                 <h2 className="text-2xl font-bold mb-6 text-center">Select Suitable Vehicle</h2>

//                 <div className="flex flex-wrap justify-center gap-4 mb-6">
//                     {mockVehicles.map(v => (
//                         <div
//                             key={v.id}
//                             onClick={() => handleSelect(v)}
//                             className={`cursor-pointer ${newRoute.vehicle?.id === v.id ? "ring-2 ring-offset-2 ring-blue-500 rounded-lg" : ""}`}
//                         >
//                             <VehicleCard vehicle={v} />
//                         </div>
//                     ))}
//                 </div>

//                 <div className="text-center">
//                     <button
//                         className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:shadow-outline"
//                         onClick={() => nav("/new-route/preview")}
//                     >
//                         Preview Route
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }
import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import VehicleCard from "../../components/VehicleCard";
import { mockVehicles } from "../../mock-data";

export default function SelectVehicle() {
    const navigate = useNavigate();
    const { newRoute, setNewRoute } = useOutletContext();

    const handleSelect = (vehicle) => {
        setNewRoute((prev = {}) => ({ ...prev, vehicle }));
    };

    const handlePreview = () => {
        navigate("/new-route/preview");
    };

    return (
        <div className="flex flex-col items-center justify-center h-full p-4 bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl">
                <h2 className="text-2xl font-bold mb-4 text-center">Select Suitable Vehicle</h2>

                <div className="flex flex-wrap justify-center gap-4 mb-6">
                    {mockVehicles.map((v) => (
                        <div
                            key={v.id}
                            onClick={() => handleSelect(v)}
                            className={`cursor-pointer ${newRoute.vehicle?.id === v.id ? "ring-2 ring-offset-2 ring-blue-500 rounded-lg" : ""}`}>
                            <VehicleCard vehicle={v} />
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <button onClick={handlePreview} className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">Preview Route</button>
                </div>
            </div>
        </div>
    );
}
