/**
 * data/mockGraph.js
 * -----------------
 * TEMPORARY static data so the UI renders before your ML pipeline is wired.
 *
 * REPLACE THIS when Phase II/III export real graph JSON:
 *   - nodes: intersections with lat/lon + betweenness score
 *   - edges: road segments as polyline coordinates
 *   - metrics: resilience numbers after ablation simulation
 *
 * Coordinates below are near central Bengaluru (demo only).
 */

export const CITIES = ["Bengaluru — Sector A", "Bengaluru — Sector B", "Mysuru — Core"];

export const SCENARIOS = [
  { id: "flood", label: "Flood at Junction", nodeId: "n3" },
  { id: "accident", label: "Accident on Ring Road", nodeId: "n1" },
  { id: "construction", label: "Construction Block", nodeId: "n5" },
];

/** Baseline network metrics (before any node is disabled) */
export const BASELINE_METRICS = {
  resilienceIndex: 1.0,
  avgPathLength: 4.2,
  perturbedAvgPathLength: 4.2,
  connectedComponents: 1,
};

/** Metrics after simulating removal of a high-centrality node */
export const PERTURBED_METRICS = {
  resilienceIndex: 0.73,
  avgPathLength: 4.2,
  perturbedAvgPathLength: 5.8,
  connectedComponents: 2,
};

/**
 * Graph nodes = road intersections / endpoints.
 * betweenness: 0–1, higher = more critical gatekeeper.
 */
export const NODES = [
  { id: "n1", name: "Ring Road Flyover Entry", lat: 12.9716, lon: 77.5946, betweenness: 0.91 },
  { id: "n2", name: "MG Road × Brigade", lat: 12.975, lon: 77.606, betweenness: 0.84 },
  { id: "n3", name: "Market Circle", lat: 12.978, lon: 77.599, betweenness: 0.79 },
  { id: "n4", name: "Tech Park Junction", lat: 12.965, lon: 77.601, betweenness: 0.52 },
  { id: "n5", name: "Residential Grid Hub", lat: 12.968, lon: 77.592, betweenness: 0.68 },
  { id: "n6", name: "North Arterial Split", lat: 12.982, lon: 77.595, betweenness: 0.45 },
];

/**
 * Graph edges = road segments.
 * coords: array of [lat, lon] for Leaflet Polyline.
 * criticality: usually max betweenness of endpoints (simplified here).
 */
export const EDGES = [
  {
    id: "e1",
    source: "n1",
    target: "n2",
    criticality: 0.88,
    coords: [
      [12.9716, 77.5946],
      [12.973, 77.598],
      [12.975, 77.606],
    ],
  },
  {
    id: "e2",
    source: "n2",
    target: "n3",
    criticality: 0.82,
    coords: [
      [12.975, 77.606],
      [12.9765, 77.602],
      [12.978, 77.599],
    ],
  },
  {
    id: "e3",
    source: "n1",
    target: "n4",
    criticality: 0.71,
    coords: [
      [12.9716, 77.5946],
      [12.968, 77.597],
      [12.965, 77.601],
    ],
  },
  {
    id: "e4",
    source: "n4",
    target: "n5",
    criticality: 0.55,
    coords: [
      [12.965, 77.601],
      [12.9665, 77.596],
      [12.968, 77.592],
    ],
  },
  {
    id: "e5",
    source: "n3",
    target: "n6",
    criticality: 0.62,
    coords: [
      [12.978, 77.599],
      [12.98, 77.597],
      [12.982, 77.595],
    ],
  },
  {
    id: "e6",
    source: "n5",
    target: "n1",
    criticality: 0.6,
    coords: [
      [12.968, 77.592],
      [12.97, 77.593],
      [12.9716, 77.5946],
    ],
  },
];

/** Top gatekeepers sorted by betweenness (for right panel list) */
export function getTopGatekeepers(limit = 5) {
  return [...NODES].sort((a, b) => b.betweenness - a.betweenness).slice(0, limit);
}
