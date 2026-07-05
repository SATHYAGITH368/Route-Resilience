# Phase I — Occlusion-Robust Road Segmentation

Separate Colab notebooks for each model. Same data, loss, and training setup.

| Notebook | Model | Checkpoint | Masks |
|----------|--------|------------|--------|
| `phase1_unetpp.ipynb` | UNet++ + ResNet34 + scSE | `best_road_model_unetpp.pth` | `outputs/masks_unetpp/` |
| `phase1_deeplabv3.ipynb` | DeepLabV3+ + ResNet34 + ASPP | `best_road_model_deeplabv3.pth` | `outputs/masks_deeplab/` |

## How to run

1. Open notebook in Google Colab (GPU / T4).
2. Mount Drive and set `DRIVE_BASE` if needed.
3. Put DeepGlobe `train/` under `RouteResilience/datasets/train/`.
4. Run all cells.

DeepLabV3+ is the production model for Phase II (`masks_deeplab/`).
