# Phase II — Graph Skeletonization & Topological Healing

Colab notebook to convert DeepLab road masks into a healed routable graph.

| Item | Detail |
|------|--------|
| **Input** | `outputs/masks_deeplab/{id}_pred.png` from Phase I |
| **Output** | `outputs/graphs_deeplab/{id}_graph.json` + visualization PNG |
| **Runtime** | CPU (Colab or local) |

## Pipeline

1. Clean mask (morphology)
2. Skeletonize to centerlines
3. Build NetworkX graph (nodes + edges)
4. Heal gaps with Union-Find bridging
5. Export JSON for Phase III

## How to run

1. Open `phase2_graph_healing.ipynb` in Google Colab.
2. Mount Drive — masks must exist from `phase1/phase1_deeplabv3.ipynb`.
3. Set `PROCESS_IDS` to your tile IDs (default: 493626, 477671, 422265, 194764).
4. Run all cells.

**Next:** Phase III reads `graphs_deeplab/*.json` for criticality analysis.
