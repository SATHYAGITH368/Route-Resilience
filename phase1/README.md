# Phase I — road segmentation

Colab notebooks — same DeepGlobe split, occlusion aug, and BCE+Dice loss for fair comparison.

| Notebook | Model | Masks folder | Checkpoint |
|----------|-------|--------------|------------|
| `phase1_deeplabv3.ipynb` | DeepLabV3+ (production) | `masks_deeplab/` | `best_road_model_deeplabv3.pth` |
| `phase1_unetpp.ipynb` | UNet++ baseline | `masks_unetpp/` | `best_road_model_unetpp.pth` |
| `phase1_unext.ipynb` | [UNeXt](papers/README.md) (light / fast) | `masks_unext/` | `best_road_model_unext.pth` |
| `phase1_segformer_b1.ipynb` | [SegFormer-B1](papers/README.md) (MiT-B1) | `masks_segformer/` | `best_road_model_segformer_b1.pth` |

Put DeepGlobe under `RouteResilience/datasets/train/` on Drive. Runtime → GPU (T4).

**Suggested batch sizes if OOM:** DeepLab 8 → 4 | SegFormer 4 → 2 | UNeXt can try 12.

Phase II default still reads `masks_deeplab/`. If you use another model, copy masks there or change `MASK_DIR` in `phase2_graph_healing.ipynb`.

**UNeXt paper:** [arXiv:2203.04967](https://arxiv.org/abs/2203.04967) · [PDF](papers/UNeXt_MLPSegmentation_MICCAI2022.pdf)

**SegFormer paper:** [arXiv:2105.15203](https://arxiv.org/abs/2105.15203) · [PDF](papers/SegFormer_SimpleEfficientDesign_SemanticSegmentation.pdf) · [papers/README.md](papers/README.md)
