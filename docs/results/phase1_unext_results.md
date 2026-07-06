# Phase I — UNeXt training results

**Run:** Google Colab · Tesla T4 · 30 epochs · DeepGlobe 80/20 split (2472 train / 619 val)

| Field | Value |
|-------|-------|
| Model | UNeXt (`num_classes=1`, `img_size=512`) |
| Parameters | 1,471,921 |
| Best Val IoU | **0.4809** (epoch 30) |
| Final train loss / IoU | 0.2770 / 0.4511 |
| Final val loss / IoU | 0.2610 / 0.4809 |
| Checkpoint | `RouteResilience/checkpoints/best_road_model_unext.pth` |
| Masks output | `RouteResilience/outputs/masks_unext/` |
| Training curves | [`phase1_unext_training_curves.png`](./phase1_unext_training_curves.png) |

## Epoch milestones

| Epoch | Train Loss | Train IoU | Val Loss | Val IoU | Best? |
|-------|------------|-----------|----------|---------|-------|
| 1 | 0.6445 | 0.0105 | 0.5659 | 0.0677 | ✓ |
| 10 | 0.3440 | 0.3648 | 0.3096 | 0.4144 | ✓ |
| 20 | 0.2978 | 0.4250 | 0.2725 | 0.4624 | ✓ |
| 30 | 0.2770 | 0.4511 | 0.2610 | **0.4809** | ✓ |

## Comparison (same pipeline)

| Model | Val IoU | Notes |
|-------|---------|-------|
| DeepLabV3+ | **0.569** | Production — used in Phase II+ |
| UNet++ | ~0.51 | Baseline |
| **UNeXt** | **0.481** | Lightest model; fastest per-epoch after warmup |
