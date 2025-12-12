// // Simulates an API call to a sophisticated Routing Service
// // In a real application, this would call an external API (e.g., Google Maps Directions, Valhalla, etc.)
// // which handles road data, traffic, and calculates multi-criteria optimization.

// /**
//  * Calculates multiple optimal routes between two coordinates with safety/ETA metrics.
//  * @param {string} start - Start coordinates (e.g., "12.9716,77.5946")
//  * @param {string} end - End coordinates (e.g., "12.2958,76.6394")
//  * @returns {Promise<Array>} An array of optimal routes.
//  */
// async function fetchOrsRoute(start, end) {
//     // In a real app: axios.get('https://api.openrouteservice.org/v2/directions/driving-car', ...)
//     // Simulating the output:
//     const [startLat, startLng] = start.split(',').map(Number);
//     const [endLat, endLng] = end.split(',').map(Number);

//     // Simulate multiple route geometries, distance, and duration from ORS
//     const baseRoutes = [
//         // Route 1: Optimal (balanced)
//         {
//             id: 'R1',
//             name: 'Primary Route (ORS Recommended)',
//             duration: 7500, // seconds (125 min)
//             distance: 120000, // meters (120 km)
//             polyline: [
//                 [startLat, startLng],
//                 [startLat + 0.5, startLng + 0.1],
//                 [startLat + 0.8, startLng + 0.2],
//                 [endLat + 0.1, endLng],
//                 [endLat, endLng],
//             ],
//         },
//         // Route 2: Fastest
//         {
//             id: 'R2',
//             name: 'Alternate Route (Fastest)',
//             duration: 6300, // seconds (105 min)
//             distance: 125000, // meters
//             polyline: [
//                 [startLat, startLng],
//                 [startLat + 0.3, startLng + 0.4],
//                 [startLat + 0.7, startLng + 0.3],
//                 [endLat + 0.2, endLng + 0.1],
//                 [endLat, endLng],
//             ],
//         },
//     ];
//     await new Promise(resolve => setTimeout(resolve, 300));
//     return baseRoutes;
// }
// async function fetchWeatherData(lat, lng) {
//     // In a real app: axios.get('https://api.openweathermap.org/data/2.5/weather', ...)
//     // Simulating the output for the start location:
//     await new Promise(resolve => setTimeout(resolve, 200));
//     const random = Math.random();

//     if (random < 0.3) return { condition: 'Clear', tempC: 25, windSpeed: 5 };
//     if (random < 0.6) return { condition: 'Light Rain', tempC: 20, windSpeed: 15 };
//     return { condition: 'Heavy Fog', tempC: 18, windSpeed: 8 };
// }
// function calculateSafetyScore(route, weather) {
//     let score = 100;

//     // Penalty based on weather conditions
//     if (weather.condition.includes('Rain') || weather.condition.includes('Fog')) {
//         score -= 15;
//     }
//     // Penalty based on estimated road condition (simulated: assuming faster route R2 has more traffic/potholes)
//     if (route.id === 'R2') {
//         score -= 10;
//     }
//     // Penalty based on duration/distance (longer/slower routes can sometimes be penalized for exposure time)
//     score -= Math.floor(route.duration / 7200) * 5; // 5 points per 2 hours of travel

//     // Ensure score is within 0-100 and prioritize safety/duration over distance
//     score = Math.max(0, Math.min(100, score));

//     // Simple adjustment to create differentiation
//     if (route.id === 'R1') score += 5;

//     return Math.round(score);
// }

// // --- 4. Main Exported Function ---
// export async function calculateOptimalRoutes(start, end) {
//     if (!start || !end) return [];

//     const [startLat, startLng] = start.split(',').map(Number);

//     // 1. Fetch Routing Geometries (ORS)
//     const baseRoutes = await fetchOrsRoute(start, end);

//     // 2. Fetch Weather Data (OpenWeatherMap)
//     const weatherData = await fetchWeatherData(startLat, startLng);

//     // 3. Combine, Calculate Scores, and Format
//     const finalRoutes = baseRoutes.map(route => {
//         const safeScore = calculateSafetyScore(route, weatherData);
//         return {
//             id: route.id,
//             name: route.name,
//             safeScore: safeScore,
//             // Convert ORS duration (seconds) to minutes
//             etaMinutes: Math.ceil(route.duration / 60),
//             polyline: route.polyline,
//             metrics: {
//                 distanceKm: (route.distance / 1000).toFixed(1),
//                 weather: weatherData.condition,
//                 traffic: route.id === 'R2' ? 'High Speed/Traffic' : 'Normal', // Simulated traffic factor
//                 potholes: route.id === 'R1' ? 'Low' : 'Medium' // Simulated road condition factor
//             }
//         };
//     });

//     // 4. Sort: Highest Safety Score first, then lowest ETA
//     finalRoutes.sort((a, b) => b.safeScore - a.safeScore || a.etaMinutes - b.etaMinutes);

//     // Simulate final network delay
//     await new Promise(resolve => setTimeout(resolve, 500));

//     return finalRoutes;
// }
// ... (rest of the file)
import { decodeORS } from '../utils/decodePolyline'; // NEW: Imports the utility

// ... (MOCK_ENCODED_ROUTE_1 and MOCK_ENCODED_ROUTE_2 definitions)

/**
 * Calculates multiple optimal routes between two coordinates with safety/ETA metrics.
 * @param {string} start - Start coordinates (e.g., "12.9716,77.5946")
 * @param {string} end - End coordinates (e.g., "12.2958,76.6394")
 * @returns {Promise<Array>} An array of optimal routes.
 */
async function fetchOrsRoute(start, end) {
    // ... (rest of function body)

    const baseRoutes = [
        // Route 1: Optimal (balanced)
        {
            id: 'R1',
            name: 'Primary Route (ORS Recommended)',
            duration: 7500, // seconds (125 min)
            distance: 120000, // meters (120 km)
            polyline: MOCK_ENCODED_ROUTE_1, // Changed to the encoded string
        },
        // Route 2: Fastest
        {
            id: 'R2',
            name: 'Alternate Route (Fastest)',
            duration: 6300, // seconds (105 min)
            distance: 125000, // meters
            polyline: MOCK_ENCODED_ROUTE_2, // Changed to the encoded string
        },
    ];
    await new Promise(resolve => setTimeout(resolve, 300));
    return baseRoutes;
}

// ... (fetchWeatherData and calculateSafetyScore functions)

// --- 4. Main Exported Function ---
export async function calculateOptimalRoutes(start, end) {
    if (!start || !end) return [];

    const [startLat, startLng] = start.split(',').map(Number);

    // 1. Fetch Routing Geometries (ORS)
    const baseRoutes = await fetchOrsRoute(start, end);

    // 2. Fetch Weather Data (OpenWeatherMap)
    const weatherData = await fetchWeatherData(startLat, startLng);

    // 3. Combine, Calculate Scores, and Format
    const finalRoutes = baseRoutes.map(route => {
        const safeScore = calculateSafetyScore(route, weatherData);
        return {
            id: route.id,
            name: route.name,
            safeScore: safeScore,
            // Convert ORS duration (seconds) to minutes
            etaMinutes: Math.ceil(route.duration / 60),
            // THIS IS THE CRITICAL LINE THAT DECODES THE ROUTE:
            polyline: decodeORS(route.polyline),
            metrics: {
                distanceKm: (route.distance / 1000).toFixed(1),
                weather: weatherData.condition,
                traffic: route.id === 'R2' ? 'High Speed/Traffic' : 'Normal',
                potholes: route.id === 'R1' ? 'Low' : 'Medium'
            }
        };
    });
    // ... (rest of function body)
}