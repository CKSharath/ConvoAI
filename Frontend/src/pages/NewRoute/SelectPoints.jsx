import React from "react";
import { useNavigate } from "react-router-dom";

export default function SelectPoints() {
    const nav = useNavigate();

    return (
        <div className="page select-points">
            <h2>Select Start & End</h2>
            <p>Click on the map to pick start and end points. (Quick demo: we'll skip the map here)</p>

            <div className="mock-points">
                <button onClick={() => nav("/new-route/select-vehicle")} className="btn">Next: Select Vehicle</button>
            </div>
        </div>
    );
}