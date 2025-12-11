import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { socket } from "../../socket";

export default function ConvoyDetails() {
    const { id } = useParams();
    const [details, setDetails] = useState(null);

    useEffect(() => {
        const event = `${id}:details`;
        socket.on(event, (payload) => setDetails(payload));
        socket.emit("request_convoy_details", { id });

        return () => socket.off(event);
    }, [id]);

    return (
        <div className="page split">
            <div>
                <h2>{id} — Vehicle Health</h2>
                {details ? (
                    <div className="details">
                        <div>Fuel: {details.fuel}%</div>
                        <div>Battery: {details.battery}%</div>
                        <div>Engine: {details.engine_status}</div>
                        <div>Last Maintenance: {details.last_maintenance}</div>
                    </div>
                ) : (
                    <div>Loading...</div>
                )}
            </div>

            <div>
                <h3>Back to Live</h3>
                <Link to={`/tracking/${id}`} className="btn">Back</Link>
            </div>
        </div>
    );
}