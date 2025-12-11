import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import VehicleCard from "../../components/VehicleCard";

const vehicles = [
    { id: "v_xd", name: "XD", capacity: "2 tons", type: "Heavy" },
    { id: "v_zts", name: "ZTS", capacity: "1 ton", type: "Light" },
];

export default function SelectVehicle() {
    const [selected, setSelected] = useState(null);
    const nav = useNavigate();

    return (
        <div className="page">
            <h2>Select Suitable Vehicle</h2>

            <div className="vehicle-grid">
                {vehicles.map(v => (
                    <div key={v.id} onClick={() => setSelected(v)} className={`vehicle-wrapper ${selected?.id === v.id ? "selected" : ""}`}>
                        <VehicleCard vehicle={v} onSelect={() => setSelected(v)} />
                    </div>
                ))}
            </div>

            <div style={{ marginTop: 16 }}>
                <button className="btn" onClick={() => nav("/new-route/preview")}>Preview Route</button>
            </div>
        </div>
    );
}