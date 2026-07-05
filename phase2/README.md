# Phase II — graph from mask

One notebook: `phase2_graph_healing.ipynb`

Reads Phase I masks, skeletonizes them, builds a NetworkX graph, heals small gaps, saves JSON.

CPU is fine. You need `outputs/masks_deeplab/{id}_pred.png` on Drive first.

Default sample IDs: 493626, 477671, 422265, 194764 — change `PROCESS_IDS` in the config cell if needed.
