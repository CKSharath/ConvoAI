import React from "react";
import { Outlet } from "react-router-dom";

export default function NewRouteWrapper() {
    const [newRoute, setNewRoute] = React.useState({
        sourceText: "",
        destinationText: "",
        coordinates: [], // optional: [ [lat,lng], [lat,lng] ]
        vehicle: null,
    });

    return <Outlet context={{ newRoute, setNewRoute }} />;
}
