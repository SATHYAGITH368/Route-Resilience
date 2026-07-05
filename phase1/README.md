# Phase I — road segmentation

Two Colab notebooks, same training setup, different models:

- `phase1_deeplabv3.ipynb` — DeepLabV3+ (this is what we use in Phase II)
- `phase1_unetpp.ipynb` — UNet++ baseline for comparison

Put DeepGlobe under `RouteResilience/datasets/train/` on Drive, open in Colab with GPU, run all cells.

Checkpoints land in `checkpoints/`, masks in `outputs/masks_deeplab/` or `masks_unetpp/`.
