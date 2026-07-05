/**
 * loadAnalysis.js
 * ---------------
 * Loads Phase III criticality JSON (from Colab outputs/analysis/)
 * and transforms it for the React dashboard.
 *
 * Copy your JSON files to: public/data/{imageId}_criticality.json
 * Optional satellite image: public/data/{imageId}_sat.jpg
 */

export const SAMPLES = [
  { id: "493626", label: "Urban Grid — 493626" },
  { id: "477671", label: "Arterial Road — 477671" },
  { id: "194764", label: "Linear Network — 194764" },
  { id: "422265", label: "Rural Roads — 422265" },
];

const SCENARIO_LABELS = [
  "Flood at Junction",
  "Accident on Arterial",
  "Construction Block",
];

/** Parse JSON text — catches Vite returning index.html when file is missing */
function parseJsonText(text, imageId) {
  const trimmed = text.trim();
  if (trimmed.startsWith("<") || trimmed.startsWith("<!")) {
    throw new Error(
      `File not found: public/data/${imageId}_criticality.json\n\n` +
        `The server returned HTML instead of JSON.\n` +
        `Download from Google Drive → outputs/analysis/ → save to public/data/`
    );
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Invalid JSON in ${imageId}_criticality.json`);
  }
}

/** Fetch Phase III JSON from public/data/ */
export async function fetchAnalysis(imageId) {
  const url = `/data/${imageId}_criticality.json`;
  const res = await fetch(url);
  const text = await res.text();
  if (!res.ok) {
    throw new Error(
      `Missing public/data/${imageId}_criticality.json (HTTP ${res.status})`
    );
  }
  const raw = parseJsonText(text, imageId);
  return transformAnalysis(raw);
}

/** Load JSON from a file the user picks (no copy to public/ needed) */
export function loadAnalysisFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const raw = parseJsonText(e.target.result, file.name);
        resolve(transformAnalysis(raw));
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsText(file);
  });
}

/** Convert Phase III export → app state shape */
export function transformAnalysis(raw) {
  const gatekeepers = (raw.gatekeepers || []).map((gk) => ({
    id: String(gk.id),
    name: gk.name || `Gatekeeper ${gk.id}`,
    x: gk.x,
    y: gk.y,
    betweenness: gk.betweenness,
    rank: gk.rank,
  }));

  const bcMap = Object.fromEntries(gatekeepers.map((g) => [g.id, g.betweenness]));

  const edges = (raw.edges || []).map((e) => ({
    id: e.id,
    source: String(e.source),
    target: String(e.target),
    criticality: e.criticality ?? 0,
    healed: e.healed ?? false,
    // Phase III coords are [row, col] = [y, x] — Leaflet CRS.Simple uses [y, x]
    coords: (e.coords || []).map(([y, x]) => [y, x]),
  }));

  const nodes = buildNodeList(edges, gatekeepers, bcMap);
  const bounds = computeBounds(edges);

  const m = raw.metrics || {};
  const baselineMetrics = {
    avgPathLength: m.baseline_avg_path_length ?? 0,
    perturbedAvgPathLength: m.baseline_avg_path_length ?? 0,
    resilienceIndex: 1.0,
    connectedComponents: m.baseline_connected_components ?? 1,
  };

  const perturbedMetrics = {
    avgPathLength: m.baseline_avg_path_length ?? 0,
    perturbedAvgPathLength: m.perturbed_avg_path_length ?? m.baseline_avg_path_length ?? 0,
    resilienceIndex: normalizeResilience(m.resilience_index),
    connectedComponents: m.connected_components ?? 1,
  };

  const ablationStudy = (raw.ablation_study || []).map((sim) => ({
    ...sim,
    removed_node: String(sim.removed_node),
    resilienceIndex: normalizeResilience(sim.resilience_index),
  }));

  const scenarios = ablationStudy.slice(0, 3).map((sim, i) => ({
    id: `scenario-${i}`,
    label: SCENARIO_LABELS[i] || `Scenario ${i + 1}`,
    nodeId: String(sim.removed_node),
  }));

  return {
    imageId: raw.image_id,
    nodes,
    edges,
    gatekeepers,
    bounds,
    satelliteUrl: `/data/${raw.image_id}_sat.jpg`,
    baselineMetrics,
    perturbedMetrics,
    ablationStudy,
    scenarios,
    topGatekeeper: gatekeepers[0] ?? null,
  };
}

/** Build node list from gatekeepers + edge endpoint positions */
function buildNodeList(edges, gatekeepers, bcMap) {
  const nodeMap = new Map();

  for (const gk of gatekeepers) {
    nodeMap.set(gk.id, {
      id: gk.id,
      name: gk.name,
      x: gk.x,
      y: gk.y,
      betweenness: gk.betweenness,
    });
  }

  for (const edge of edges) {
    if (!edge.coords.length) continue;
    const ends = [
      [edge.source, edge.coords[0]],
      [edge.target, edge.coords[edge.coords.length - 1]],
    ];
    for (const [id, [y, x]] of ends) {
      if (!nodeMap.has(id)) {
        nodeMap.set(id, {
          id,
          name: `Node ${id}`,
          x,
          y,
          betweenness: bcMap[id] ?? 0,
        });
      }
    }
  }

  return Array.from(nodeMap.values());
}

function computeBounds(edges) {
  let minY = Infinity;
  let minX = Infinity;
  let maxY = -Infinity;
  let maxX = -Infinity;

  for (const edge of edges) {
    for (const [y, x] of edge.coords) {
      minY = Math.min(minY, y);
      minX = Math.min(minX, x);
      maxY = Math.max(maxY, y);
      maxX = Math.max(maxX, x);
    }
  }

  if (minY === Infinity) {
    return [
      [0, 0],
      [512, 512],
    ];
  }

  const pad = 40;
  return [
    [minY - pad, minX - pad],
    [maxY + pad, maxX + pad],
  ];
}

/** Phase III R = baseline/perturbed; convert to 0–1 health score for gauge */
function normalizeResilience(r) {
  if (r == null || r === 0) return 0;
  if (r > 1) return Math.min(1, 1 / r);
  return Math.min(1, r);
}

/** Look up metrics after removing a specific node */
export function metricsForNode(data, nodeId) {
  const sim = data.ablationStudy.find((s) => s.removed_node === nodeId);
  if (!sim) {
    return data.baselineMetrics;
  }
  return {
    avgPathLength: data.baselineMetrics.avgPathLength,
    perturbedAvgPathLength:
      sim.avg_path_length === Infinity ? null : sim.avg_path_length,
    resilienceIndex: sim.resilienceIndex ?? normalizeResilience(sim.resilience_index),
    connectedComponents: sim.connected_components ?? 1,
  };
}
