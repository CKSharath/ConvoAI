import React from "react";
import { useParams, Link } from "react-router-dom";
import { mockVehicles } from "../../mock-data";

export default function ConvoyDetails() {
    const { id } = useParams();
    const vehicles = mockVehicles.filter(v => v.convoyId === parseInt(id));

    return (
        <div className="flex gap-4">
            <div className="w-2/3 bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Convoy {id} — Vehicle Health</h2>
                {vehicles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {vehicles.map(vehicle => (
                            <div key={vehicle.id} className="p-4 border rounded-lg">
                                <h3 className="text-lg font-semibold">{vehicle.name}</h3>
                                <div className="flex flex-col gap-2 mt-2">
                                    <div><span className="font-semibold">Status:</span> {vehicle.status}</div>
                                    <div><span className="font-semibold">Fuel:</span> 100%</div>
                                    <div><span className="font-semibold">Battery:</span> 100%</div>
                                    <div><span className="font-semibold">Engine:</span> OK</div>
                                    <div><span className="font-semibold">Last Maintenance:</span> 2025-12-01</div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>No vehicle details available.</div>
                )}
            </div>

            <div className="w-1/3 bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Back to Live</h3>
                <Link to={`/tracking/${id}`} className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md no-underline cursor-pointer">Back to Map</Link>
            </div>
        </div>
    );
}