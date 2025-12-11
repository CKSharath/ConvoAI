import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { socket } from "../../socket";

export default function ConvoyList() {
    const [convoys, setConvoys] = useState([
        { id: "convoy1", name: "Convoy 1" },
        { id: "convoy2", name: "Convoy 2" },
        { id: "convoy3", name: "Convoy 3" },
    ]);

    useEffect(() => {
        // optional: request list from backend
        socket.emit("list_convoys");
        socket.on("convoy_list", (data) => setConvoys(data));
        return () => socket.off("convoy_list");
    }, []);

    return (
        <div className="page split">
            <div className="left">
                <h2>Convoys</h2>
                <ul className="list">
                    {convoys.map((c) => (
                        <li key={c.id}>
                            <Link to={`/tracking/${c.id}`}>{c.name}</Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="right">
                <p>Select a convoy to view live tracking & details.</p>
            </div>
        </div>
    );
}