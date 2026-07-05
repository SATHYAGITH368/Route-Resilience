# Phase IV — React Dashboard (Route Resilience UI)

Interactive command-center dashboard for map overlay, gatekeeper simulation, and resilience metrics.

| Item | Detail |
|------|--------|
| **Input** | `outputs/analysis_deeplab/{id}_criticality.json` from Phase III |
| **Optional** | `{id}_sat.jpg` satellite background |
| **Stack** | React 18 + Vite + Tailwind + Leaflet |

## Quick start

```bash
cd phase4/dashboard
npm install
npm run dev
```

Copy Phase III JSON into `dashboard/public/data/`:

```
493626_criticality.json
477671_criticality.json
422265_criticality.json
194764_criticality.json
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Folder layout

```
phase4/
├── README.md
├── assets/
│   └── route-resilience-dashboard-mockup.png   ← UI wireframe mockup
├── docs/
│   └── Dashboard_Wireframe.md                  ← layout spec + component tree
└── dashboard/                                  ← runnable React app
    ├── src/
    ├── public/data/
    ├── package.json
    └── ...
```

## Dashboard features

- **Layers:** Satellite, road network, criticality heatmap, disabled nodes
- **Scenarios:** Flood / accident / construction presets
- **Simulation:** Disable top bottleneck or any gatekeeper node
- **Impact panel:** Path length, components, resilience index
- **Bottom bar:** Before/after mini network comparison

See `docs/Dashboard_Wireframe.md` for the full UI specification.
