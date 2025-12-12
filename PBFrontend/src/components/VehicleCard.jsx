import React from "react";

export default function VehicleCard({ vehicle }) {
    return (
        <div className="p-4 border rounded-lg bg-white cursor-pointer min-w-[140px] hover:shadow-md transition-shadow duration-200">
            <div className="font-bold text-lg mb-1">{vehicle.name}</div>
            <div>Capacity: {vehicle.capacity}</div>
            <div>Type: {vehicle.type}</div>
        </div>
    );
}