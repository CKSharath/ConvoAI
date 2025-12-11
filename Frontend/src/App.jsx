import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ConvoyList from "./pages/Tracking/ConvoyList";
import ConvoyMap from "./pages/Tracking/ConvoyMap";
import ConvoyDetails from "./pages/Tracking/ConvoyDetails";
import SelectPoints from "./pages/NewRoute/SelectPoints";
import SelectVehicle from "./pages/NewRoute/SelectVehicle";
import NewRouteMap from "./pages/NewRoute/NewRouteMap";
import EmergencyRoute from "./pages/EmergencyRoute";

export default function App() {
  return (
    <div className="app-root">
      <nav className="topbar">
        <div className="brand"><Link to="/">ConvoyD7</Link></div>
        <div className="nav-links">
          <Link to="/tracking">Tracking</Link>
          <Link to="/new-route/select-points">New Route</Link>
          <Link to="/emergency">Emergency</Link>
        </div>
      </nav>

      <main className="main-area">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tracking" element={<ConvoyList />} />
          <Route path="/tracking/:id" element={<ConvoyMap />} />
          <Route path="/tracking/:id/details" element={<ConvoyDetails />} />
          <Route path="/new-route/select-points" element={<SelectPoints />} />
          <Route path="/new-route/select-vehicle" element={<SelectVehicle />} />
          <Route path="/new-route/preview" element={<NewRouteMap />} />
          <Route path="/emergency" element={<EmergencyRoute />} />
        </Routes>
      </main>
    </div>
  );
}