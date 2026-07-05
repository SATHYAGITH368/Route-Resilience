# Phase III — Network Criticality & Stress Testing

Colab notebook for betweenness centrality ranking and gatekeeper ablation on healed road graphs.

| Item | Detail |
|------|--------|
| **Input** | `outputs/graphs_deeplab/{id}_graph.json` from Phase II |
| **Output** | `outputs/analysis_deeplab/{id}_criticality.json` + heatmap PNG |
| **Runtime** | CPU (Colab or local) |

## Pipeline

1. Load healed graph JSON from Phase II
2. Extract largest connected component
3. Compute betweenness centrality (gatekeeper ranking)
4. Ablation stress test — remove top nodes, measure resilience ratio R
5. Export JSON for Phase IV dashboard + visualization PNG

## How to run

1. Open `phase3_criticality.ipynb` in Google Colab.
2. Mount Drive — graph JSON files must exist from `phase2/phase2_graph_healing.ipynb`.
3. Run all cells (auto-discovers all `*_graph.json` in `graphs_deeplab/`).
4. Copy `{id}_criticality.json` into the React dashboard `public/data/` for Phase IV.

**Next:** Phase IV React dashboard reads `analysis_deeplab/*.json` for the criticality map overlay.
