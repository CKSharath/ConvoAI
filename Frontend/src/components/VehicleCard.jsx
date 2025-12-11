import React from "react";

export default function VehicleCard({ vehicle, onSelect }) {
    return (
        <div className="vehicle-card" onClick={() => onSelect(vehicle)}>
            <div className="vc-title">{vehicle.name}</div>
            <div>Capacity: {vehicle.capacity}</div>
            <div>Type: {vehicle.type}</div>
        </div>
    );
}