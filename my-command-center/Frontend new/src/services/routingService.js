// // // // Simulates an API call to a sophisticated Routing Service
// // // // In a real application, this would call an external API (e.g., Google Maps Directions, Valhalla, etc.)
// // // // which handles road data, traffic, and calculates multi-criteria optimization.

// // // /**
// // //  * Calculates multiple optimal routes between two coordinates with safety/ETA metrics.
// // //  * @param {string} start - Start coordinates (e.g., "12.9716,77.5946")
// // //  * @param {string} end - End coordinates (e.g., "12.2958,76.6394")
// // //  * @returns {Promise<Array>} An array of optimal routes.
// // //  */
// // // async function fetchOrsRoute(start, end) {
// // //     // In a real app: axios.get('https://api.openrouteservice.org/v2/directions/driving-car', ...)
// // //     // Simulating the output:
// // //     const [startLat, startLng] = start.split(',').map(Number);
// // //     const [endLat, endLng] = end.split(',').map(Number);

// // //     // Simulate multiple route geometries, distance, and duration from ORS
// // //     const baseRoutes = [
// // //         // Route 1: Optimal (balanced)
// // //         {
// // //             id: 'R1',
// // //             name: 'Primary Route (ORS Recommended)',
// // //             duration: 7500, // seconds (125 min)
// // //             distance: 120000, // meters (120 km)
// // //             polyline: [
// // //                 [startLat, startLng],
// // //                 [startLat + 0.5, startLng + 0.1],
// // //                 [startLat + 0.8, startLng + 0.2],
// // //                 [endLat + 0.1, endLng],
// // //                 [endLat, endLng],
// // //             ],
// // //         },
// // //         // Route 2: Fastest
// // //         {
// // //             id: 'R2',
// // //             name: 'Alternate Route (Fastest)',
// // //             duration: 6300, // seconds (105 min)
// // //             distance: 125000, // meters
// // //             polyline: [
// // //                 [startLat, startLng],
// // //                 [startLat + 0.3, startLng + 0.4],
// // //                 [startLat + 0.7, startLng + 0.3],
// // //                 [endLat + 0.2, endLng + 0.1],
// // //                 [endLat, endLng],
// // //             ],
// // //         },
// // //     ];
// // //     await new Promise(resolve => setTimeout(resolve, 300));
// // //     return baseRoutes;
// // // }
// // // async function fetchWeatherData(lat, lng) {
// // //     // In a real app: axios.get('https://api.openweathermap.org/data/2.5/weather', ...)
// // //     // Simulating the output for the start location:
// // //     await new Promise(resolve => setTimeout(resolve, 200));
// // //     const random = Math.random();

// // //     if (random < 0.3) return { condition: 'Clear', tempC: 25, windSpeed: 5 };
// // //     if (random < 0.6) return { condition: 'Light Rain', tempC: 20, windSpeed: 15 };
// // //     return { condition: 'Heavy Fog', tempC: 18, windSpeed: 8 };
// // // }
// // // function calculateSafetyScore(route, weather) {
// // //     let score = 100;

// // //     // Penalty based on weather conditions
// // //     if (weather.condition.includes('Rain') || weather.condition.includes('Fog')) {
// // //         score -= 15;
// // //     }
// // //     // Penalty based on estimated road condition (simulated: assuming faster route R2 has more traffic/potholes)
// // //     if (route.id === 'R2') {
// // //         score -= 10;
// // //     }
// // //     // Penalty based on duration/distance (longer/slower routes can sometimes be penalized for exposure time)
// // //     score -= Math.floor(route.duration / 7200) * 5; // 5 points per 2 hours of travel

// // //     // Ensure score is within 0-100 and prioritize safety/duration over distance
// // //     score = Math.max(0, Math.min(100, score));

// // //     // Simple adjustment to create differentiation
// // //     if (route.id === 'R1') score += 5;

// // //     return Math.round(score);
// // // }

// // // // --- 4. Main Exported Function ---
// // // export async function calculateOptimalRoutes(start, end) {
// // //     if (!start || !end) return [];

// // //     const [startLat, startLng] = start.split(',').map(Number);

// // //     // 1. Fetch Routing Geometries (ORS)
// // //     const baseRoutes = await fetchOrsRoute(start, end);

// // //     // 2. Fetch Weather Data (OpenWeatherMap)
// // //     const weatherData = await fetchWeatherData(startLat, startLng);

// // //     // 3. Combine, Calculate Scores, and Format
// // //     const finalRoutes = baseRoutes.map(route => {
// // //         const safeScore = calculateSafetyScore(route, weatherData);
// // //         return {
// // //             id: route.id,
// // //             name: route.name,
// // //             safeScore: safeScore,
// // //             // Convert ORS duration (seconds) to minutes
// // //             etaMinutes: Math.ceil(route.duration / 60),
// // //             polyline: route.polyline,
// // //             metrics: {
// // //                 distanceKm: (route.distance / 1000).toFixed(1),
// // //                 weather: weatherData.condition,
// // //                 traffic: route.id === 'R2' ? 'High Speed/Traffic' : 'Normal', // Simulated traffic factor
// // //                 potholes: route.id === 'R1' ? 'Low' : 'Medium' // Simulated road condition factor
// // //             }
// // //         };
// // //     });

// // //     // 4. Sort: Highest Safety Score first, then lowest ETA
// // //     finalRoutes.sort((a, b) => b.safeScore - a.safeScore || a.etaMinutes - b.etaMinutes);

// // //     // Simulate final network delay
// // //     await new Promise(resolve => setTimeout(resolve, 500));

// // //     return finalRoutes;
// // // }
// // // ... (rest of the file)
// // import { decodeORS } from '../utils/decodePolyline'; // NEW: Imports the utility

// // // ... (MOCK_ENCODED_ROUTE_1 and MOCK_ENCODED_ROUTE_2 definitions)
// // // Mock encoded polylines (valid sample encoded strings)
// // const MOCK_ENCODED_ROUTE_1 = '_p~iF~ps|U_ulLnnqC_mqNvxq`@';
// // const MOCK_ENCODED_ROUTE_2 = '_p~iF~ps|Uo}d@_ulL~o{C_mqNvxq`@'; 

// // /**
// //  * Calculates multiple optimal routes between two coordinates with safety/ETA metrics.
// //  * @param {string} start - Start coordinates (e.g., "12.9716,77.5946")
// //  * @param {string} end - End coordinates (e.g., "12.2958,76.6394")
// //  * @returns {Promise<Array>} An array of optimal routes.
// //  */
// // async function fetchOrsRoute(start, end) {
// //     // ... (rest of function body)

// //     const baseRoutes = [
// //         // Route 1: Optimal (balanced)
// //         {
// //             id: 'R1',
// //             name: 'Primary Route (ORS Recommended)',
// //             duration: 7500, // seconds (125 min)
// //             distance: 120000, // meters (120 km)
// //             polyline: MOCK_ENCODED_ROUTE_1, // Changed to the encoded string
// //         },
// //         // Route 2: Fastest
// //         {
// //             id: 'R2',
// //             name: 'Alternate Route (Fastest)',
// //             duration: 6300, // seconds (105 min)
// //             distance: 125000, // meters
// //             polyline: MOCK_ENCODED_ROUTE_2, // Changed to the encoded string
// //         },
// //     ];
// //     await new Promise(resolve => setTimeout(resolve, 300));
// //     return baseRoutes;
// // }

// // // ... (fetchWeatherData and calculateSafetyScore functions)

// // // --- 4. Main Exported Function ---
// // export async function calculateOptimalRoutes(start, end) {
// //     if (!start || !end) return [];

// //     const [startLat, startLng] = start.split(',').map(Number);

// //     // 1. Fetch Routing Geometries (ORS)
// //     const baseRoutes = await fetchOrsRoute(start, end);

// //     // 2. Fetch Weather Data (OpenWeatherMap)
// //     const weatherData = await fetchWeatherData(startLat, startLng);

// //     // 3. Combine, Calculate Scores, and Format
// //     const finalRoutes = baseRoutes.map(route => {
// //         const safeScore = calculateSafetyScore(route, weatherData);
// //         return {
// //             id: route.id,
// //             name: route.name,
// //             safeScore: safeScore,
// //             // Convert ORS duration (seconds) to minutes
// //             etaMinutes: Math.ceil(route.duration / 60),
// //             // THIS IS THE CRITICAL LINE THAT DECODES THE ROUTE:
// //             polyline: decodeORS(route.polyline),
// //             metrics: {
// //                 distanceKm: (route.distance / 1000).toFixed(1),
// //                 weather: weatherData.condition,
// //                 traffic: route.id === 'R2' ? 'High Speed/Traffic' : 'Normal',
// //                 potholes: route.id === 'R1' ? 'Low' : 'Medium'
// //             }
// //         };
// //     });
// //     // ... (rest of function body)
// // }
// import { decodeORS } from '../utils/decodePolyline';

// /* ============================================================
//    MOCK ENCODED POLYLINES (VALID FORMAT)
//    These simulate OpenRouteService encoded geometries
// ============================================================ */
// const MOCK_ENCODED_ROUTE_1 = '_p~iF~ps|U_ulLnnqC_mqNvxq`@';
// const MOCK_ENCODED_ROUTE_2 = '_p~iF~ps|Uo}d@_ulL~o{C_mqNvxq`@';

// /* ============================================================
//    1. SIMULATED OPENROUTESERVICE ROUTE FETCH
// ============================================================ */
// async function fetchOrsRoute(start, end) {
//     // In real app:
//     // axios.get('https://api.openrouteservice.org/v2/directions/driving-car')

//     const baseRoutes = [
//         {
//             id: 'R1',
//             name: 'Primary Route (ORS Recommended)',
//             duration: 7500, // seconds
//             distance: 120000, // meters
//             polyline: MOCK_ENCODED_ROUTE_1,
//         },
//         {
//             id: 'R2',
//             name: 'Alternate Route (Fastest)',
//             duration: 6300, // seconds
//             distance: 125000, // meters
//             polyline: MOCK_ENCODED_ROUTE_2,
//         },
//     ];

//     // Simulated API delay
//     await new Promise(resolve => setTimeout(resolve, 300));
//     return baseRoutes;
// }

// /* ============================================================
//    2. SIMULATED WEATHER DATA FETCH
// ============================================================ */
// async function fetchWeatherData(lat, lng) {
//     // In real app:
//     // axios.get('https://api.openweathermap.org/data/2.5/weather')

//     await new Promise(resolve => setTimeout(resolve, 200));
//     const random = Math.random();

//     if (random < 0.3) {
//         return { condition: 'Clear', tempC: 25, windSpeed: 5 };
//     }

//     if (random < 0.6) {
//         return { condition: 'Light Rain', tempC: 20, windSpeed: 15 };
//     }

//     return { condition: 'Heavy Fog', tempC: 18, windSpeed: 8 };
// }

// /* ============================================================
//    3. SAFETY SCORE CALCULATION
// ============================================================ */
// function calculateSafetyScore(route, weather) {
//     let score = 100;

//     // Weather penalty
//     if (weather.condition.includes('Rain') || weather.condition.includes('Fog')) {
//         score -= 15;
//     }

//     // Traffic / road penalty
//     if (route.id === 'R2') {
//         score -= 10;
//     }

//     // Long exposure penalty
//     score -= Math.floor(route.duration / 7200) * 5;

//     // Bonus for recommended route
//     if (route.id === 'R1') {
//         score += 5;
//     }

//     return Math.max(0, Math.min(100, Math.round(score)));
// }

// /* ============================================================
//    4. MAIN EXPORTED FUNCTION
// ============================================================ */
// export async function calculateOptimalRoutes(start, end) {
//     if (!start || !end) return [];

//     const [startLat, startLng] = start.split(',').map(Number);

//     // 1. Fetch routes
//     const baseRoutes = await fetchOrsRoute(start, end);

//     // 2. Fetch weather
//     const weatherData = await fetchWeatherData(startLat, startLng);

//     // 3. Combine, decode, score
//     const finalRoutes = baseRoutes.map(route => {
//         const safeScore = calculateSafetyScore(route, weatherData);

//         return {
//             id: route.id,
//             name: route.name,
//             safeScore,
//             etaMinutes: Math.ceil(route.duration / 60),

//             // 🔥 Decode encoded polyline to [[lat, lng], ...]
//             polyline: decodeORS(route.polyline),

//             metrics: {
//                 distanceKm: (route.distance / 1000).toFixed(1),
//                 weather: weatherData.condition,
//                 traffic: route.id === 'R2' ? 'High Speed / Traffic' : 'Normal',
//                 potholes: route.id === 'R1' ? 'Low' : 'Medium',
//             },
//         };
//     });

//     // 4. Sort by safety, then ETA
//     finalRoutes.sort(
//         (a, b) => b.safeScore - a.safeScore || a.etaMinutes - b.etaMinutes
//     );

//     // Final simulated delay
//     await new Promise(resolve => setTimeout(resolve, 500));

//     return finalRoutes;
// }
import { decodeORS } from '../utils/decodePolyline';

/* ============================================================
   INDIA ROUTING USING OLA MAPS STYLE (REAL ROADS)
============================================================ */

// NOTE:
// Ola Maps routing is OSRM-compatible internally.
// This structure matches real production routing logic.

const OLA_ROUTING_BASE =
    'https://router.project-osrm.org/route/v1/driving';
// ↑ This is used as a DROP-IN replacement for Ola Maps Router
// When Ola gives public endpoint, replace ONLY this URL

/* ============================================================
   1. FETCH REAL ROUTE (INDIA ROADS)
============================================================ */
async function fetchOlaRoute(start, end) {
    const [startLat, startLng] = start.split(',').map(Number);
    const [endLat, endLng] = end.split(',').map(Number);

    // OSRM-style routing (India roads)
    const url = `${OLA_ROUTING_BASE}/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=polyline&alternatives=true`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
        throw new Error('No route found');
    }

    return data.routes.map((route, index) => ({
        id: `R${index + 1}`,
        name: index === 0 ? 'Recommended Route' : 'Alternate Route',
        duration: route.duration, // seconds
        distance: route.distance, // meters
        polyline: route.geometry, // encoded polyline
    }));
}

/* ============================================================
   2. WEATHER (SIMULATED – OPTIONAL)
============================================================ */
async function fetchWeatherData() {
    await new Promise(resolve => setTimeout(resolve, 150));
    return { condition: 'Clear', tempC: 27 };
}

/* ============================================================
   3. SAFETY SCORE
============================================================ */
function calculateSafetyScore(route, weather) {
    let score = 100;

    if (weather.condition !== 'Clear') score -= 10;
    if (route.distance > 150000) score -= 10;

    return Math.max(0, Math.min(100, score));
}

/* ============================================================
   4. MAIN EXPORTED FUNCTION
============================================================ */
export async function calculateOptimalRoutes(start, end) {
    if (!start || !end) return [];

    // 1. Fetch real India routes
    const baseRoutes = await fetchOlaRoute(start, end);

    // 2. Weather
    const weather = await fetchWeatherData();

    // 3. Format for UI
    const finalRoutes = baseRoutes.map(route => ({
        id: route.id,
        name: route.name,
        safeScore: calculateSafetyScore(route, weather),
        etaMinutes: Math.ceil(route.duration / 60),

        // ✅ REAL ROAD-ACCURATE POLYLINE
        polyline: decodeORS(route.polyline),

        metrics: {
            distanceKm: (route.distance / 1000).toFixed(1),
            weather: weather.condition,
        },
    }));

    return finalRoutes;
}