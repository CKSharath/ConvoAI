// import React, { useState } from "react";
// import { Routes, Route, Link } from "react-router-dom";
// import HomePage from "./pages/HomePage";
// import ConvoyList from "./pages/Tracking/ConvoyList";
// import ConvoyMap from "./pages/Tracking/ConvoyMap";
// import ConvoyDetails from "./pages/Tracking/ConvoyDetails";
// import SelectPoints from "./pages/NewRoute/SelectPoints";
// import SelectVehicle from "./pages/NewRoute/SelectVehicle";
// import NewRouteMap from "./pages/NewRoute/NewRouteMap";
// import EmergencyRoute from "./pages/EmergencyRoute";

// export default function App() {
//   const [newRoute, setNewRoute] = useState({
//     source: "",
//     destination: "",
//     vehicle: null,
//   });

//   return (
//     <div className="flex flex-col h-screen bg-gray-100">
//       <nav className="h-14 bg-blue-900 text-white flex items-center justify-between px-4 shadow-md">
//         <div className="font-bold text-lg"><Link to="/" className="text-white no-underline">ConvoyD7</Link></div>
//         <div className="flex">
//           <Link to="/tracking" className="text-white no-underline ml-3">Tracking</Link>
//           <Link to="/new-route/select-points" className="text-white no-underline ml-3">New Route</Link>
//           <Link to="/emergency" className="text-white no-underline ml-3">Emergency</Link>
//         </div>
//       </nav>

//       <main className="flex-1 p-3 min-h-0">
//         <Routes>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/tracking" element={<ConvoyList />} />
//           <Route path="/tracking/:id" element={<ConvoyMap />} />
//           <Route path="/tracking/:id/details" element={<ConvoyDetails />} />
//           <Route path="/new-route/select-points" element={<SelectPoints newRoute={newRoute} setNewRoute={setNewRoute} />} />
//           <Route path="/new-route/select-vehicle" element={<SelectVehicle newRoute={newRoute} setNewRoute={setNewRoute} />} />
//           <Route path="/new-route/preview" element={<NewRouteMap newRoute={newRoute} />} />
//           <Route path="/emergency" element={<EmergencyRoute />} />
//         </Routes>
//       </main>
//     </div>
//   );
// }
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ConvoyList from "./pages/Tracking/ConvoyList";
import ConvoyMap from "./pages/Tracking/ConvoyMap";
import ConvoyDetails from "./pages/Tracking/ConvoyDetails";
import NewRouteWrapper from "./pages/NewRoute/NewRouteWrapper";
import SelectPoints from "./pages/NewRoute/SelectPoints";
import SelectVehicle from "./pages/NewRoute/SelectVehicle";
import NewRouteMap from "./pages/NewRoute/NewRouteMap";
import EmergencyRoute from "./pages/EmergencyRoute";

export default function App() {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <nav className="h-14 bg-blue-900 text-white flex items-center justify-between px-4 shadow-md">
        <div className="font-bold text-lg"><Link to="/" className="text-white no-underline">ConvoyD7</Link></div>
        <div className="flex">
          <Link to="/tracking" className="text-white no-underline ml-3">Tracking</Link>
          <Link to="/new-route/select-points" className="text-white no-underline ml-3">New Route</Link>
          <Link to="/emergency" className="text-white no-underline ml-3">Emergency</Link>
        </div>
      </nav>

      <main className="flex-1 p-3 min-h-0">
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/tracking" element={<ConvoyList />} />
          <Route path="/tracking/:id" element={<ConvoyMap />} />
          <Route path="/tracking/:id/details" element={<ConvoyDetails />} />

          <Route path="/new-route" element={<NewRouteWrapper />}>
            <Route path="select-points" element={<SelectPoints />} />
            <Route path="select-vehicle" element={<SelectVehicle />} />
            <Route path="preview" element={<NewRouteMap />} />
          </Route>

          <Route path="/emergency" element={<EmergencyRoute />} />
        </Routes>
      </main>
    </div>
  );
}