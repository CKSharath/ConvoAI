// 
export const mockMissions = [
  { id: 1, name: "Mission Mumbai", source: "Mumbai", destination: "Pune", status: "In Progress", priority: "High", safescore: 85, eta: "3h 15min" },
  { id: 2, name: "Mission Delhi", source: "Delhi", destination: "Jaipur", status: "Completed", priority: "Medium", safescore: 92, eta: "5h 45min" },
  { id: 3, name: "Mission Bangalore", source: "Bangalore", destination: "Chennai", status: "Pending", priority: "Low", safescore: 78, eta: "6h 30min" },
];

export const mockConvoys = [
  { id: 1, name: "Alpha Convoy", missionId: 1, status: "On a mission", position: [19.0760, 72.8777], speed: 45, timestamp: Date.now() },
  { id: 2, name: "Bravo Convoy", missionId: 2, status: "On a mission", position: [28.6139, 77.2090], speed: 50, timestamp: Date.now() },
  { id: 3, name: "Charlie Convoy", missionId: 3, status: "On a mission", position: [12.9716, 77.5946], speed: 30, timestamp: Date.now() },
];

export const mockVehicles = [
  { id: 1, name: "Truck A", convoyId: 1, status: "Operational", capacity: "10 tons", type: "Heavy" },
  { id: 2, name: "Truck B", convoyId: 1, status: "Operational", capacity: "5 tons", type: "Medium" },
  { id: 3, name: "Truck C", convoyId: 2, status: "Maintenance", capacity: "7 tons", type: "Medium" },
  { id: 4, name: "Truck D", convoyId: 3, status: "Operational", capacity: "12 tons", type: "Heavy" },
];

export const mockMumbaiPuneRoute = [
  [19.0760, 72.8777],
  [18.5204, 73.8567],
];

export const mockDelhiJaipurRoute = [
  [28.6139, 77.2090],
  [26.9124, 75.7873],
];

export const mockBangaloreChennaiRoute = [
  [12.9716, 77.5946],
  [13.0827, 80.2707],
];