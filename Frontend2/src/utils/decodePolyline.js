// /**
//  * Decodes an encoded polyline string (e.g., from OpenRouteService or Google Maps)
//  * into an array of [latitude, longitude] coordinates.
//  * @param {string} encodedPolyline - The polyline string.
//  * @returns {Array<Array<number>>} Array of coordinates.
//  */
// export function decodeORS(encodedPolyline) {
//     let index = 0,
//         lat = 0,
//         lng = 0;
//     const coordinates = [];

//     while (index < encodedPolyline.length) {
//         // Decode latitude
//         let shift = 0;
//         let result = 0;
//         let byte;
//         do {
//             byte = encodedPolyline.charCodeAt(index++) - 63;
//             result |= (byte & 0x1f) << shift;
//             shift += 5;
//         } while (byte >= 0x20);

//         const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
//         lat += dlat;

//         // Decode longitude
//         shift = 0;
//         result = 0;
//         do {
//             byte = encodedPolyline.charCodeAt(index++) - 63;
//             result |= (byte & 0x1f) << shift;
//             shift += 5;
//         } while (byte >= 0x20);

//         const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
//         lng += dlng;

//         // Coordinates are stored as [latitude, longitude] and converted to degrees
//         coordinates.push([lat / 1e5, lng / 1e5]);
//     }

//     return coordinates;
// }
/**
 * Decodes an encoded polyline string (commonly returned by ORS or Google Maps)
 * into an array of [latitude, longitude] coordinates required by Leaflet.
 * * NOTE: This function replaces the need for an external library like 'polyline-encoded',
 * which resolves the earlier "Failed to resolve import" error by avoiding external package dependencies.
 * * @param {string} encodedPolyline - The encoded string from the routing API.
 * @returns {Array<Array<number>>} Decoded coordinate array: [[lat, lng], ...]
 */
export function decodeORS(encodedPolyline) {
    if (!encodedPolyline) return [];

    let index = 0,
        lat = 0,
        lng = 0;
    const coordinates = [];

    // Function to decode an individual segment
    const decodeSegment = () => {
        let shift = 0;
        let result = 0;
        let byte;

        do {
            byte = encodedPolyline.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        // Apply two's complement and scale
        return ((result & 1) ? ~(result >> 1) : (result >> 1));
    };

    while (index < encodedPolyline.length) {
        // Decode latitude
        const dlat = decodeSegment();
        lat += dlat;

        // Decode longitude
        const dlng = decodeSegment();
        lng += dlng;

        // Coordinates are stored as [latitude, longitude] and converted to degrees (divided by 1e5)
        coordinates.push([lat / 1e5, lng / 1e5]);
    }

    return coordinates;
}