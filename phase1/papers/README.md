# Phase I — reference papers

## UNeXt

**UNeXt: MLP-based Rapid Medical Image Segmentation Network**  
Jeya Maria Jose Valanarasu, Pavan Kumar Anasosalu Vasu, Vishal M. Patel — MICCAI 2022

| | |
|---|---|
| PDF (local) | [`UNeXt_MLPSegmentation_MICCAI2022.pdf`](./UNeXt_MLPSegmentation_MICCAI2022.pdf) |
| arXiv | [2203.04967](https://arxiv.org/abs/2203.04967) |
| Code | [jeya-maria-jose/UNeXt-pytorch](https://github.com/jeya-maria-jose/UNeXt-pytorch) |

Used in `phase1_unext.ipynb` for lightweight road segmentation experiments on DeepGlobe.

## SegFormer

**SegFormer: Simple and Efficient Design for Semantic Segmentation with Transformers**  
Enze Xie, Wenhai Wang, Zhiding Yu, Anima Anandkumar, Jose M. Alvarez, Ping Luo

| | |
|---|---|
| PDF (local) | [`SegFormer_SimpleEfficientDesign_SemanticSegmentation.pdf`](./SegFormer_SimpleEfficientDesign_SemanticSegmentation.pdf) |
| arXiv | [2105.15203](https://arxiv.org/abs/2105.15203) |
| Code | [NVlabs/SegFormer](https://github.com/NVlabs/SegFormer) |

Used in `phase1_segformer_b1.ipynb` for the transformer baseline on DeepGlobe road segmentation.

## DINOv2

**DINOv2: Learning Robust Visual Features without Supervision**  
Maxime Oquab, Timothée Darcet, Théo Moutakanni, et al. — Meta AI, 2023

| | |
|---|---|
| PDF (local) | [`DINOv2_LearningRobustVisualFeatures.pdf`](./DINOv2_LearningRobustVisualFeatures.pdf) |
| arXiv | [2304.07193](https://arxiv.org/abs/2304.07193) |
| Code | [facebookresearch/dinov2](https://github.com/facebookresearch/dinov2) |

Used in `phase1_dinov2_fpn.ipynb` as a frozen / lightly fine-tuned ViT backbone with a custom FPN decode head for occlusion-robust road masks.

## SAM (Segment Anything)

**Segment Anything**  
Alexander Kirillov, Eric Mintun, Nikhila Ravi, et al. — Meta AI, 2023

| | |
|---|---|
| PDF (local) | [`SAM_SegmentAnything.pdf`](./SAM_SegmentAnything.pdf) |
| arXiv | [2304.02643](https://arxiv.org/abs/2304.02643) |
| Code | [facebookresearch/segment-anything](https://github.com/facebookresearch/segment-anything) |

Used in `phase1_sam_mask_repair.ipynb` to repair broken road masks from Phase I **without retraining** the segmentation model. Prompts SAM with road/background points and gap bridges between disconnected components.

## MFuser

**Mamba as a Bridge: Where Vision Foundation Models Meet Vision Language Models for Domain-Generalized Semantic Segmentation**  
Xin Zhang, Robby T. Tan — CVPR 2025 Highlight

| | |
|---|---|
| PDF (local) | [`MFuser_MambaBridge_VFM_VLM.pdf`](./MFuser_MambaBridge_VFM_VLM.pdf) |
| arXiv | [2504.03193](https://arxiv.org/abs/2504.03193) |
| Code | [devinxzhang/MFuser](https://github.com/devinxzhang/MFuser) |
| Project | [MFuser project page](https://devinxzhang.github.io/MFuser_ProjPage/) |

Used in `phase1_mfuser.ipynb` as **MFuser-lite**: DINOv2 (VFM) + CLIP (VLM) + gated fusion + text-bias decode head for DeepGlobe roads. Full paper uses Mamba blocks (MVFuser, MTEnhancer) — see official repo for complete DGSS setup.
