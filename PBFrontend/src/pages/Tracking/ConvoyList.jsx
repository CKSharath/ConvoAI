import React from "react";
import { Link } from "react-router-dom";
import { mockConvoys } from "../../mock-data";

export default function ConvoyList() {
    return (
        <div className="flex gap-4">
            <div className="w-1/3 bg-white p-4 rounded-lg shadow-md overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Convoys</h2>
                <ul className="list-none p-0">
                    {mockConvoys.map((c) => (
                        <li key={c.id} className="p-2 border-b border-gray-200">
                            <Link to={`/tracking/${c.id}`} className="text-blue-600 hover:underline">{c.name}</Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex-1 bg-white p-4 rounded-lg shadow-md">
                <p>Select a convoy to view live tracking & details.</p>
            </div>
        </div>
    );
}