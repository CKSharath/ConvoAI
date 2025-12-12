// // import React from 'react'
// // import { Link, useLocation } from 'react-router-dom'

// // export default function Navbar() {
// //     const loc = useLocation()
// //     return (
// //         <nav className="navbar">
// //             <div className="navbar-inner">
// //                 <div className="brand">
// //                     <div className="logo">◆</div>
// //                     <div className="brand-text">COMMAND</div>
// //                 </div>
// //                 <div className="nav-links">
// //                     <Link className={loc.pathname === '/' ? 'active' : ''} to="/">Dashboard</Link>
// //                     <Link className={loc.pathname.startsWith('/tracking') ? 'active' : ''} to="/tracking">Live Tracking</Link>
// //                     <Link className={loc.pathname.startsWith('/route-planner') ? 'active' : ''} to="/route-planner">New Mission</Link>
// //                     <Link className={loc.pathname.startsWith('/emergency') ? 'active' : ''} to="/emergency">Emergency</Link>
// //                 </div>
// //                 <div className="profile">
// //                     <button className="profile-btn">⚙</button>
// //                 </div>
// //             </div>
// //         </nav>
// //     )
// // }
// import React from "react";

// import "../styles/components/Navbar.css";

// export default function Navbar() {
//     const handleSOS = async () => {
//         try {
//             await fetch("https://formspree.io/f/xzznyvrk", {
//                 method: "POST",
//                 headers: {
//                     "Accept": "application/json",
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify({
//                     message: "🚨 EMERGENCY ALERT: SOS Triggered from Command Center!",
//                     timestamp: new Date().toISOString()
//                 })
//             });

//             alert("🚨 SOS Alert Sent Successfully!");
//         } catch (error) {
//             alert("Failed to send SOS alert.");
//         }
//     };

//     return (
//         <nav className="navbar">
//             <div className="navbar-left">
//                 <h1 className="app-title">COMMAND CENTER</h1>
//             </div>

//             <div className="navbar-middle">
//                 <a href="/">Dashboard</a>
//                 <a href="/tracking">Live Tracking</a>
//                 <a href="/missions">Missions</a>
//                 <a href="/analytics">Analytics</a>
//             </div>

//             <div className="navbar-right">
//                 <button className="sos-btn" onClick={handleSOS}>
//                     🚨 SOS
//                 </button>

//                 <div className="user-box">
//                     <span>👤</span>
//                 </div>
//             </div>
//         </nav>
//     );
// }
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/components/Navbar.css";

export default function Navbar() {
    const loc = useLocation();

    const handleSOS = async () => {
        try {
            await fetch("https://formspree.io/f/xzznyvrk", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: "🚨 EMERGENCY ALERT: SOS Triggered from Command Center!",
                    timestamp: new Date().toISOString(),
                }),
            });

            alert("🚨 SOS Alert Sent Successfully!");
        } catch (error) {
            alert("Failed to send SOS alert.");
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-inner">

                {/* LEFT: BRAND */}
                <div className="brand">
                    <div className="logo">◆</div>
                    <div className="brand-text">COMMAND</div>
                </div>

                {/* MIDDLE: NAVIGATION */}
                <div className="nav-links">
                    <Link className={loc.pathname === "/" ? "active" : ""} to="/">Dashboard</Link>
                    <Link className={loc.pathname.startsWith("/tracking") ? "active" : ""} to="/tracking">Live Tracking</Link>
                    <Link className={loc.pathname.startsWith("/route-planner") ? "active" : ""} to="/route-planner">New Mission</Link>
                    <Link className={loc.pathname.startsWith("/emergency") ? "active" : ""} to="/emergency">Emergency</Link>
                </div>

                {/* RIGHT: SOS + PROFILE */}
                <div className="profile">
                    <button className="sos-btn" onClick={handleSOS}>
                        🚨 SOS
                    </button>

                    <button className="profile-btn">⚙</button>
                </div>

            </div>
        </nav>
    );
}