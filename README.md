# Route Resilience

**Occlusion-robust road extraction and graph-theoretic criticality analysis for urban mobility.**

**CanopyBreakers** — ISRO BAH 2026 

---

Most city planning tools assume you already have a clean road map. We don't. Satellite imagery is messy — trees cover junctions, shadows break up asphalt, construction blocks half a street. Route Resilience takes raw satellite tiles, extracts roads anyway, turns them into a navigable graph, finds the intersections that matter most, and lets you simulate what happens when one of them goes offline.

This repo holds the full four-phase pipeline: Colab notebooks for Phases I–III and a React dashboard for Phase IV.

---

## What this project does (in plain terms)

1. **Phase I** — Look at a satellite image and draw where the roads are (pixel mask).
2. **Phase II** — Turn that mask into a proper road network graph and stitch small gaps back together.
3. **Phase III** — Rank the most important junctions and stress-test the network if you remove them.
4. **Phase IV** — Open a web dashboard, click a bottleneck, and watch the network fall apart (or recover).

Each phase reads the output of the previous one. You can run them end-to-end on Google Colab with a free T4 GPU for Phase I and CPU for everything else.

---

## Pipeline at a glance

```
Satellite image (DeepGlobe tile)
        │
        ▼
   Phase I ──► road mask PNG          (DeepLabV3+ segmentation)
        │
        ▼
   Phase II ──► graph JSON             (skeleton + gap healing)
        │
        ▼
   Phase III ──► criticality JSON      (gatekeeper ranking + ablation)
        │
        ▼
   Phase IV ──► live dashboard         (map + what-if simulation)
```

**Demo tile IDs we used throughout:** `493626`, `477671`, `422265`, `194764`

Sample `493626` (urban grid) is the best one for presentations — clearest gatekeeper story.

---

## Repository layout

```
Route-Resilience/
├── README.md                 ← you are here
├── phase1/                   ← road segmentation notebooks
├── phase2/                   ← graph building + healing
├── phase3/                   ← criticality analysis
├── phase4/                   ← React dashboard + mockup assets
│   ├── assets/               ← dashboard wireframe PNG
│   ├── docs/                 ← UI layout specification
│   └── dashboard/            ← runnable frontend (npm run dev)
└── datasets/                 ← placeholder for DeepGlobe data
```

---

## Before you start

### What you need

- **Google Colab** account (Phases I–III)
- **Google Drive** folder: `RouteResilience/` (mount in every notebook)
- **DeepGlobe dataset** — RGB + mask pairs under `datasets/train/`
- **Node.js 18+** (Phase IV dashboard only)

### Recommended Drive folder structure

```
RouteResilience/
├── datasets/train/           ← DeepGlobe images (*_sat.jpg, *_mask.png)
├── checkpoints/              ← saved model weights (.pth)
└── outputs/
    ├── masks_deeplab/        ← Phase I predictions
    ├── graphs_deeplab/      ← Phase II graphs
    ├── analysis_deeplab/    ← Phase III criticality JSON
    └── visualizations_deeplab/
```

Run the phases in order. Phase II expects masks from Phase I. Phase III expects graphs from Phase II. The dashboard expects criticality JSON from Phase III.

---

## Phase I — Road segmentation from satellite imagery

**Folder:** [`phase1/`](phase1/)

**Problem:** Roads in satellite images are often partially hidden. A broken mask means a broken route later. Phase I trains a deep learning model to predict a binary road mask — white pixels = road, black = not road.

**Models included (same training pipeline, fair comparison):**

| Notebook | Architecture | Params | Val IoU | Role |
|----------|-------------|--------|---------|------|
| `phase1_unetpp.ipynb` | UNet++ + ResNet34 + scSE | — | ~0.51 | Baseline comparison |
| `phase1_deeplabv3.ipynb` | DeepLabV3+ + ResNet34 + ASPP | — | **0.569** | **Production model** |
| `phase1_unext.ipynb` | [UNeXt](phase1/papers/README.md) (MLP-style, MICCAI 2022) | 1.47M | **0.481** | Lightweight / fast training |
| `phase1_segformer_b1.ipynb` | SegFormer-B1 (MiT-B1) | — | — | Transformer baseline |

We benchmarked on identical DeepGlobe splits and kept **DeepLabV3+** for Phase II onward (`masks_deeplab/`) — highest Val IoU. **UNeXt** reached **0.481** on Colab T4 (30 epochs) with the smallest footprint; training curves in [`docs/results/phase1_unext_training_curves.png`](docs/results/phase1_unext_training_curves.png). Checkpoint: `checkpoints/best_road_model_unext.pth`.

**Training details:**
- Dataset: DeepGlobe road extraction (2,472 train / 619 val)
- Input size: 512×512, ImageNet normalisation
- Loss: `0.4 × BCE + 0.6 × Dice` (Dice helps with thin roads; IoU used for evaluation)
- Augmentation: flips, rotation, brightness/contrast — plus synthetic **occlusion patches** so the model learns to infer roads under tree cover
- Hardware: Colab T4 GPU, ~30 epochs, mixed precision

**Outputs:**
```
checkpoints/best_road_model_deeplabv3.pth
outputs/masks_deeplab/{tile_id}_pred.png
```

**How to run:**
1. Open `phase1/phase1_deeplabv3.ipynb` in Colab.
2. Runtime → GPU (T4 is enough).
3. Mount Drive, point `DRIVE_BASE` to your `RouteResilience` folder.
4. Run all cells. Training takes a few hours on T4; inference on val samples is fast.

**What to expect:** Masks won't be pixel-perfect under heavy occlusion — that's fine. Phase II is built to heal topology. What matters is that main corridors stay connected enough to skeletonize.

---

## Phase II — From mask to routable graph

**Folder:** [`phase2/`](phase2/)

**Problem:** A segmentation mask is just pixels. Routing needs nodes (intersections) and edges (road segments). Masks are also thick and gappy. Phase II skeletonizes the mask down to 1-pixel centerlines, extracts a graph, and bridges small breaks between likely-connected endpoints.

**Pipeline steps:**
1. **Morphological clean** — close small holes, remove noise blobs (< 80 px²)
2. **Skeletonize** — reduce roads to single-pixel centerlines (skimage)
3. **Graph extraction** — nodes at junctions (degree ≥ 3) and dead-ends (degree = 1); edges traced as polylines
4. **Topological healing** — Union-Find finds nearby aligned endpoints from different components and adds bridge edges (shown red in visualizations)
5. **Export JSON** — nodes, edges with coordinates, connectivity stats

**Key parameters (tune in the config cell):**
- `MAX_BRIDGE_DIST = 40` — max gap to heal (pixels)
- `MAX_ANGLE_DIFF = 35` — endpoints must point roughly at each other
- `MIN_EDGE_LENGTH = 10` — ignore tiny spurs

**Outputs:**
```
outputs/graphs_deeplab/{tile_id}_graph.json
outputs/visualizations_deeplab/{tile_id}_phase2.png
```

**Results on sample 493626:**
- ~645 nodes, 106 bridge edges added
- Connectivity ratio: **0.01 → 0.06** (fraction of nodes in largest component)
- Sample 477671 improved more dramatically: **0.03 → 0.26**

**How to run:**
1. Open `phase2/phase2_graph_healing.ipynb` in Colab.
2. CPU runtime is fine — no GPU needed.
3. Make sure Phase I masks exist in `outputs/masks_deeplab/`.
4. Set `PROCESS_IDS` to your tile IDs and run all cells.

Green edges = original roads, red = healed bridges.

---

## Phase III — Gatekeeper analysis and stress testing

**Folder:** [`phase3/`](phase3/)

**Problem:** Not all intersections are equal. Remove the wrong one and traffic reroutes badly across the whole city. Phase III finds **gatekeeper nodes** — junctions that sit on the most shortest paths — and simulates removing them one by one.

**What it computes:**

**Betweenness centrality (BC)** — for each node, count how often it appears on shortest paths between all other pairs. High BC = bottleneck / gatekeeper.

**Ablation study** — remove top-ranked node, recompute:
- Average shortest-path length (how much longer trips get)
- Number of connected components (does the network split?)
- **Resilience index R** = baseline path length ÷ perturbed path length (closer to 1.0 = healthier)

**Outputs:**
```
outputs/analysis_deeplab/{tile_id}_criticality.json
outputs/analysis_viz_deeplab/{tile_id}_criticality.png
```

**Results on sample 493626:**
- Top gatekeeper: **n150**, BC ≈ 0.597
- Baseline avg path length: ~12.9
- After removing n150: R ≈ **1.57**, network splits into 107 components

**Results on sample 477671:**
- Top gatekeeper: **n29**, BC ≈ 0.579, R ≈ **2.17**

**How to run:**
1. Open `phase3/phase3_criticality.ipynb` in Colab (CPU).
2. Mount Drive — graphs must exist from Phase II.
3. Run all cells. It auto-discovers every `*_graph.json` in `graphs_deeplab/`.

**For the dashboard:** Copy `{tile_id}_criticality.json` into `phase4/dashboard/public/data/`.

---

## Phase IV — Interactive resilience dashboard

**Folder:** [`phase4/`](phase4/)

**Problem:** JSON files and heatmap PNGs don't help in a meeting with a planner. Phase IV is a dark-themed web dashboard where you load criticality data, see the road network colour-coded by load, and click gatekeepers to simulate failures in real time.

**Stack:** React 18, Vite, Tailwind CSS, Leaflet (CRS.Simple for pixel coordinates)

**Mockup / design reference:**
- Wireframe PNG: [`phase4/assets/route-resilience-dashboard-mockup.png`](phase4/assets/route-resilience-dashboard-mockup.png)
- Layout spec: [`phase4/docs/Dashboard_Wireframe.md`](phase4/docs/Dashboard_Wireframe.md)

**Quick start:**
```bash
cd phase4/dashboard
npm install
npm run dev
```

Open `http://localhost:5173` (or whatever port Vite prints).

Put your Phase III JSON in `dashboard/public/data/`:
```
493626_criticality.json    ← included as sample
477671_criticality.json    ← add after running Phase III
```

Optional satellite background: copy `{tile_id}_sat.jpg` from DeepGlobe into the same folder.

**What you can do in the dashboard:**

| Area | Features |
|------|----------|
| **Header** | Switch between tile samples; resilience gauge (100% = healthy) |
| **Left sidebar** | Toggle satellite / roads / heatmap / disabled edges; preset scenarios (flood, accident, construction); one-click "Disable Top Bottleneck" |
| **Map** | Pan, zoom, click any node to simulate its removal; colour-coded criticality (green → red) |
| **Right panel** | Live metrics (path length, components, resilience index); ranked gatekeeper list with Simulate buttons |
| **Bottom bar** | Side-by-side before/after mini network graphs |

**Demo flow for presentations:**
1. Load sample 493626.
2. Click **Disable Top Bottleneck** — watch the gauge drop and the bottom panel turn red.
3. Click **Reset simulation**, then try a scenario button.
4. Toggle the criticality heatmap to show road load colouring.

---

## End-to-end run guide

If you're starting from scratch, this is the order:

```
1. Download DeepGlobe → RouteResilience/datasets/train/
2. phase1/phase1_deeplabv3.ipynb     (GPU, ~2–4 hrs training)
3. phase2/phase2_graph_healing.ipynb (CPU, ~minutes per tile)
4. phase3/phase3_criticality.ipynb   (CPU, ~minutes per tile)
5. Copy JSON → phase4/dashboard/public/data/
6. cd phase4/dashboard && npm run dev
```

Total hackathon cost: **₹0** on Colab free tier.

---

## Key results summary

| Phase | Metric | Sample 493626 | Sample 477671 |
|-------|--------|---------------|---------------|
| I | Val IoU (DeepLabV3+) | 0.569 | — |
| I | Val IoU (UNeXt) | 0.481 | — |
| II | Connectivity after healing | 0.01 → 0.06 | 0.03 → 0.26 |
| III | Top gatekeeper BC | n150, 0.597 | n29, 0.579 |
| III | Resilience R (after removal) | 1.57 | 2.17 |
| IV | Dashboard | Live simulation | Add JSON to view |

---

## Why we built it this way

**Segmentation alone isn't enough.** IoU measures pixels, not whether you can actually route from A to B. That's why we added graph healing (Phase II) instead of chasing 0.99 IoU.

**Graph theory makes the story actionable.** Betweenness centrality gives you a ranked list of junctions a city planner can actually discuss — not just a pretty heatmap.

**The dashboard closes the loop.** Phase III tells you n150 matters. Phase IV shows you *what happens* when n150 floods — path length up, components split, resilience drops. That's the demo moment.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Phase I OOM on Colab | Use batch size 4, or stick to DeepLabV3+ (smaller than UNet++ + ResNet50) |
| Phase II "mask not found" | Run Phase I inference first; check `outputs/masks_deeplab/{id}_pred.png` exists |
| Phase III "no graph files" | Run Phase II; check `outputs/graphs_deeplab/` |
| Dashboard shows error page | Copy `{id}_criticality.json` to `phase4/dashboard/public/data/` |
| Satellite layer blank | Add `{id}_sat.jpg` to `public/data/` and toggle Satellite ON |
| Map looks tiny in corner | Fixed in current build — refresh if using an older copy |

---

## Citation and team

**Route Resilience** — CanopyBreakers, ISRO BAH 2026.

Built on DeepGlobe road extraction data, NetworkX graph analytics, and open-source deep learning (segmentation-models-pytorch, PyTorch).

If you use this pipeline, cite the DeepGlobe dataset and mention the four-phase architecture: segmentation → graph healing → criticality analysis → interactive simulation.

---

## Phase README quick links

- [Phase I — Segmentation](phase1/README.md)
- [Phase II — Graph healing](phase2/README.md)
- [Phase III — Criticality](phase3/README.md)
- [Phase IV — Dashboard](phase4/README.md)

Issues welcome on GitHub.
