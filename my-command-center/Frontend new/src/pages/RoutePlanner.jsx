// import React, { useState } from 'react'
// import MapPlaceholder from '../components/MapPlaceholder'
// import LiveMap from '../components/LiveMap'
// import Loader from '../components/Loader'
// export default function RoutePlanner() {
//     const [start, setStart] = useState('12.9716,77.5946')
//     const [end, setEnd] = useState('12.2958,76.6394')
//     const [routes, setRoutes] = useState([])
//     const [selectedRoute, setSelectedRoute] = useState(null)
//     const [isLoading, setIsLoading] = useState(false)

//     const handleCalculateRoute = async () => {
//         setIsLoading(true)
//         setRoutes([])
//         setSelectedRoute(null)
//         try {
//             const calculatedRoutes = await calculateOptimalRoutes(start, end)
//             setRoutes(calculatedRoutes)
//             // Automatically select the first (most optimal) route
//             setSelectedRoute(calculatedRoutes[0])
//         } catch (error) {
//             console.error('Routing failed:', error)
//             alert('Failed to calculate routes.')
//         } finally {
//             setIsLoading(false)
//         }
//     }

//     // Function for re-routing to the next optimal path
//     const handleReroute = () => {
//         if (!selectedRoute) return

//         const currentIndex = routes.findIndex(r => r.id === selectedRoute.id)
//         const nextIndex = currentIndex + 1

//         if (nextIndex < routes.length) {
//             setSelectedRoute(routes[nextIndex])
//             alert(`Rerouting to: ${routes[nextIndex].name}`)
//         } else {
//             alert('No further alternate routes available.')
//         }
//     }

//     return (
//         <div className="page route-planner">
//             <header className="page-header">
//                 <h1>Route Planner</h1>
//                 <p>Plan and optimize new convoy routes based on safety and speed metrics</p>
//             </header>

//             <div className="grid-two">
//                 <div className="panel">
//                     <h3>Route Input</h3>
//                     <label>Start Coordinates</label>
//                     <input value={start} onChange={e => setStart(e.target.value)} placeholder="Lat,Lng" />
//                     <label>End Coordinates</label>
//                     <input value={end} onChange={e => setEnd(e.target.value)} placeholder="Lat,Lng" />
//                     <button className="btn" onClick={handleCalculateRoute} disabled={isLoading || !start || !end}>
//                         {isLoading ? 'Calculating...' : 'Calculate Routes'}
//                     </button>

//                     <hr style={{ margin: '15px 0', border: 'none', borderTop: '1px solid var(--card-border)' }} />

//                     {/* Route List and Details */}
//                     {routes.length > 0 && (
//                         <>
//                             <h3>Optimal Routes ({routes.length})</h3>
//                             <div className="mission-list" style={{ gap: '8px' }}>
//                                 {routes.map((route, index) => (
//                                     <button
//                                         key={route.id}
//                                         className={"mission-item " + (selectedRoute?.id === route.id ? 'selected' : '')}
//                                         onClick={() => setSelectedRoute(route)}
//                                     >
//                                         <div className="mission-left">
//                                             <div className="title">
//                                                 {index + 1}. {route.name}
//                                             </div>
//                                         </div>
//                                         <div className="mission-right" style={{ textAlign: 'right' }}>
//                                             <div className="priority" style={{ backgroundColor: 'rgba(0, 255, 65, 0.15)', color: route.safeScore > 90 ? 'var(--accent)' : route.safeScore > 80 ? '#FFD700' : '#FF4500' }}>
//                                                 S-SCORE: {route.safeScore}%
//                                             </div>
//                                             <small style={{ color: 'var(--muted)' }}>ETA: {route.etaMinutes} min</small>
//                                         </div>
//                                     </button>
//                                 ))}
//                             </div>

//                             {selectedRoute && (
//                                 <div className="info-card" style={{ marginTop: '15px' }}>
//                                     <h4>{selectedRoute.name} Details</h4>
//                                     <p><strong>Distance:</strong> {selectedRoute.metrics.distanceKm} km</p> {/* <-- NEW METRIC */}
//                                     <p><strong>ETA:</strong> {selectedRoute.etaMinutes} min</p>
//                                     <p><strong>Safety Score:</strong> {selectedRoute.safeScore}%</p>
//                                     <p>
//                                         <strong>Conditions:</strong>
//                                         Weather: {selectedRoute.metrics.weather} |
//                                         Traffic: {selectedRoute.metrics.traffic} |
//                                         Potholes: {selectedRoute.metrics.potholes} {/* <-- DETAILED CONDITIONS */}
//                                     </p>

//                                     <button className="btn danger" style={{ marginTop: '10px' }} onClick={handleReroute}>
//                                         Force Reroute (Next Optimal)
//                                     </button>
//                                 </div>
//                             )}
//                         </>
//                     )}

//                     {isLoading && <Loader message="Calculating optimal paths..." />}
//                 </div>

//                 <div className="panel" style={{ height: '520px' }}>
//                     <LiveMap
//                         routePolyline={routes}
//                         activeRouteId={selectedRoute?.id}
//                         zoom={11}
//                     />
//                 </div>
//             </div>
//         </div>
//     )
// }
import React, { useState } from 'react'
import LiveMap from '../components/LiveMap'
import { calculateOptimalRoutes } from '../services/routingService' // Imports the function for route calculation
import Loader from '../components/Loader'
// NOTE: Ensure src/components/Loader.jsx and src/services/routingService.js exist

export default function RoutePlanner() {
    const [start, setStart] = useState('12.9716,77.5946')
    const [end, setEnd] = useState('12.2958,76.6394')
    const [routes, setRoutes] = useState([])
    const [selectedRoute, setSelectedRoute] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleCalculateRoute = async () => {
        setIsLoading(true)
        setRoutes([])
        setSelectedRoute(null)
        try {
            const calculatedRoutes = await calculateOptimalRoutes(start, end)
            setRoutes(calculatedRoutes)
            // Automatically select the first (most optimal) route
            setSelectedRoute(calculatedRoutes[0])
        } catch (error) {
            console.error('Routing failed:', error)
            alert('Failed to calculate routes. Check console for details.')
        } finally {
            setIsLoading(false)
        }
    }

    // Function for re-routing to the next optimal path
    const handleReroute = () => {
        if (!selectedRoute) return

        const currentIndex = routes.findIndex(r => r.id === selectedRoute.id)
        const nextIndex = currentIndex + 1

        if (nextIndex < routes.length) {
            setSelectedRoute(routes[nextIndex])
            alert(`Rerouting to: ${routes[nextIndex].name}`)
        } else {
            alert('No further alternate routes available.')
        }
    }

    return (
        <div className="page route-planner">
            <header className="page-header">
                <h1>Route Planner</h1>
                <p>Plan and optimize new convoy routes based on safety and speed metrics</p>
            </header>

            <div className="grid-two">
                <div className="panel">
                    <h3>Route Input</h3>
                    <label>Start Coordinates</label>
                    <input value={start} onChange={e => setStart(e.target.value)} placeholder="Lat,Lng (e.g., 12.9716,77.5946)" />
                    <label>End Coordinates</label>
                    <input value={end} onChange={e => setEnd(e.target.value)} placeholder="Lat,Lng (e.g., 12.2958,76.6394)" />
                    <button className="btn" onClick={handleCalculateRoute} disabled={isLoading || !start || !end}>
                        {isLoading ? 'Calculating...' : 'Calculate Routes'}
                    </button>

                    <hr style={{ margin: '15px 0', border: 'none', borderTop: '1px solid var(--card-border)' }} />

                    {/* Route List and Details */}
                    {routes.length > 0 && (
                        <>
                            <h3>Optimal Routes ({routes.length})</h3>
                            <div className="mission-list" style={{ gap: '8px' }}>
                                {routes.map((route, index) => (
                                    <button
                                        key={route.id}
                                        className={"mission-item " + (selectedRoute?.id === route.id ? 'selected' : '')}
                                        onClick={() => setSelectedRoute(route)}
                                    >
                                        <div className="mission-left">
                                            <div className="title">
                                                {index + 1}. {route.name}
                                            </div>
                                        </div>
                                        <div className="mission-right" style={{ textAlign: 'right' }}>
                                            <div className="priority" style={{ backgroundColor: 'rgba(0, 255, 65, 0.15)', color: route.safeScore > 90 ? 'var(--accent)' : route.safeScore > 80 ? '#FFD700' : '#FF4500' }}>
                                                S-SCORE: {route.safeScore}%
                                            </div>
                                            <small style={{ color: 'var(--muted)' }}>ETA: {route.etaMinutes} min</small>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {selectedRoute && (
                                <div className="info-card" style={{ marginTop: '15px' }}>
                                    <h4>{selectedRoute.name} Details</h4>
                                    <p><strong>Distance:</strong> {selectedRoute.metrics.distanceKm} km</p>
                                    <p><strong>ETA:</strong> {selectedRoute.etaMinutes} min</p>
                                    <p><strong>Safety Score:</strong> {selectedRoute.safeScore}%</p>
                                    <p>
                                        <strong>Conditions:</strong>
                                        Weather: {selectedRoute.metrics.weather} |
                                        Traffic: {selectedRoute.metrics.traffic} |
                                        Potholes: {selectedRoute.metrics.potholes}
                                    </p>

                                    <button className="btn danger" style={{ marginTop: '10px' }} onClick={handleReroute}>
                                        Force Reroute (Next Optimal)
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {isLoading && <Loader message="Calculating optimal paths..." />}
                </div>

                <div className="panel" style={{ height: '520px' }}>
                    <LiveMap
                        routePolyline={routes}
                        activeRouteId={selectedRoute?.id}
                        zoom={11}
                    />
                </div>
            </div>
        </div>
    )
}