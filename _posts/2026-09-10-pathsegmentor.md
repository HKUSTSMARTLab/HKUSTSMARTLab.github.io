---
published: True
title: '[Nature Computational Science] PathSegmentor: Segmenting Pathological Tissues, Cells and Nuclei with Natural-Language Prompts'
author: Cheng Jin
layout: post
group: news
cover: /static/img/news/2026_pathsegmentor/cover.png
oneline_description: 'SmartX Lab’s work on PathSegmentor has been published in Nature Computational Science, advancing natural-language-guided segmentation across 160 pathology categories.'
last_updated: 2026/09/10
---

<img src="/static/img/news/2026_pathsegmentor/cover.png" alt="PathSegmentor article published in Nature Computational Science" style="width: 100%;"/>

Researchers led by Professor Hao Chen at the Hong Kong University of Science and Technology have advanced natural-language-guided segmentation for computational pathology. The collaborative study involved researchers from HKUST, the University of Science and Technology of China, Tencent AI Platform Department, the Chinese University of Hong Kong, Southern Medical University and Nanfang Hospital. The work was published in *Nature Computational Science* on 10 September 2026 (2025 Journal Impact Factor: 20.3).

Pathology image segmentation supports the quantitative assessment of tumours, tissue morphology, cells and nuclei. Conventional systems often require a separate model for each dataset or target category. Promptable foundation models offer greater flexibility, but most depend on points or boxes placed around individual targets. This interaction becomes burdensome when an image contains hundreds of cells or nuclei.

The team developed **PathSegmentor**, a text-prompted segmentation foundation model designed specifically for pathology images. A user can describe a target, such as “tissue-level tumour in breast pathology” or “nuclei-level epithelial in colon pathology”. The model then returns the corresponding pixel-level mask without repeated clicks or bounding boxes. The researchers also assembled **PathSeg**, which integrates approximately 275,000 image–mask–label triples from 21 public datasets into 160 hierarchical semantic categories.

One 450-million-parameter PathSegmentor model supported all 160 categories across 45,018 internal test image–mask pairs and achieved an overall mean Dice score of 0.671. This exceeded MedSAM and BiomedParse by 0.145 and 0.429, respectively. Evaluation on five external public datasets and two independent clinical cohorts further tested cross-source generalization. The resulting masks also supported object-level feature attribution and semantically informed activation maps for breast cancer classification.

<img src="/static/img/news/2026_pathsegmentor/figure-1.jpg" alt="PathSeg data framework" style="width: 100%;"/>

**Figure 1 \| The PathSeg data framework.** **a,** The 21 public pathology segmentation datasets integrated into PathSeg. **b,** Approximately 275,000 image–mask–label triples. **c,** The hierarchy linking anatomical regions, histological structures and object types. **d,** Mask distributions across semantic levels and categories.

## Introduction

Pathologists describe structures through their medical meaning, rather than only identifying a location to segment. Terms such as tumour tissue, inflammatory cells and epithelial nuclei convey both biological identity and spatial scale. A complete description may also specify the organ from which the tissue was obtained.

Existing systems do not readily support this form of interaction. Task-specific models rely on fixed labels and generally cover only categories defined during training. Spatially prompted models use points, boxes or scribbles to indicate a target location, but these prompts may not communicate what the target represents.

Text prompts add semantic information, yet pathology introduces ambiguity across organs and spatial scales. For example, “tumour” may refer to a contiguous tissue region or individual tumour cells. An object name alone is therefore insufficient to define many pathology segmentation tasks.

PathSegmentor reformulates these tasks within a single natural-language interface. Its hierarchical prompts specify the anatomical region, histological structure and object type. This representation enables one model to segment tissues, cells and nuclei across breast, colon, lung, prostate and other organs.

## Background

Pathology segmentation faces several connected barriers:

* **Labels are fragmented across datasets.** Public datasets differ in annotation scale, terminology and target categories, limiting model sharing.
* **Location-only prompts omit biological meaning.** Points, boxes and scribbles indicate where to segment without necessarily specifying the target identity.
* **Instance-level interaction scales poorly.** Repeatedly localizing individual targets is demanding in images containing dense cells or nuclei.
* **Object names can be ambiguous.** The same term may refer to different spatial scales or structures in different organs.

PathSegmentor addresses these barriers by combining a unified pathology vocabulary with natural-language-guided segmentation.

## Method

### Organizing fragmented labels into a unified pathology vocabulary

Public pathology datasets use different annotation scales and naming conventions. Some delineate complete tissue regions, whereas others label cells or nuclei. Different labels may also refer to biologically related objects.

The researchers harmonized 21 public datasets and represented each target with three components:

* **Anatomical region:** the organ or body region, such as breast, colon, lung or prostate.
* **Histological structure:** whether the target is a tissue, cell or nucleus.
* **Object type:** the pathological entity, such as tumour, epithelium, inflammation, fibroblast or lymphocyte.

This process produced 160 hierarchical semantic labels spanning 20 anatomical regions, three histological structures and 61 object types. The hierarchy distinguishes, for example, a tissue-level breast tumour from cancerous cells in breast pathology. It therefore reduces ambiguity across organs and spatial scales.

### One textual description, one corresponding mask

PathSegmentor uses a Transformer encoder–decoder architecture with an image encoder, a text encoder and a joint feature interaction module. The image encoder extracts pathological morphology, while the text encoder represents the hierarchical target description. Learnable queries combine visual and textual features through cross-attention and self-attention before category and mask prediction.

At inference, the model receives one pathology image and one text prompt. Unlike task-specific systems, it does not require a separately maintained model for every dataset. Unlike point-prompted or box-prompted systems, it does not require users to localize each target instance in advance.

<img src="/static/img/news/2026_pathsegmentor/figure-2.jpg" alt="PathSegmentor architecture and natural-language-guided segmentation" style="width: 100%;"/>

**Figure 2 \| The PathSegmentor architecture and natural-language-guided segmentation.** **a,** The image encoder, text encoder and joint feature interaction module predict a target mask. **b,** Learnable queries integrate image and text features through cross-attention and self-attention. **c,** One model segments lung tissue, breast cells and colon nuclei from different natural-language prompts.

## Unified Segmentation Across 160 Pathology Categories

The researchers evaluated PathSegmentor using an 80:20 split of 16 internal datasets. Comparators included the dataset-specific nnU-Net, DeepLabV3+ and SAM-Path models; the spatially prompted MedSAM and SAM-Med2D models; and the text-prompted BiomedParse model.

Across 45,018 test image–mask pairs, PathSegmentor achieved an overall mean Dice score of 0.671. The corresponding scores were 0.502 for nnU-Net, 0.462 for DeepLabV3+ and 0.472 for SAM-Path. PathSegmentor outperformed the best task-specific comparator on 14 of 16 datasets, with 13 comparisons remaining significant after Holm adjustment.

These results came from one 450-million-parameter model supporting all 160 semantic categories. Task-specific approaches instead require separate models for different datasets. PathSegmentor used approximately 75% fewer parameters than the combined 1.86 billion parameters of 16 SAM-Path models.

<img src="/static/img/news/2026_pathsegmentor/figure-3.jpg" alt="PathSegmentor performance across internal datasets" style="width: 100%;"/>

**Figure 3 \| Performance across the internal datasets.** **a,** Dice distributions for PathSegmentor and six comparison methods across 16 datasets. **b,** Dataset-level rankings for each method. PathSegmentor achieved the highest overall performance and ranked first on most datasets.

## Prompt Efficiency for Complex Pathology Structures

The study compared PathSegmentor with MedSAM using oracle bounding boxes derived from ground-truth masks. Despite receiving this prior spatial information, MedSAM achieved an overall mean Dice score 0.145 below PathSegmentor. PathSegmentor also exceeded SAM-Med2D by 0.239. Fifteen of 16 dataset-level comparisons remained significant after Holm adjustment.

Both methods achieved fitted Dice scores above 0.9 for regular shapes. At the highest irregularity, the fitted scores were 0.790 for PathSegmentor and 0.282 for MedSAM. For the smallest instances, PathSegmentor showed a fitted Dice advantage of 0.372. As instance density increased, MedSAM declined by more than 0.3 Dice, while PathSegmentor remained at approximately 0.7.

The prompting burden also differed substantially. PathSegmentor required one text prompt per image, whereas instance-level prompting with MedSAM required about 20 boxes on average. Tissue, nucleus and cell tasks required averages of 12, 16 and 28 boxes, respectively. Some images contained 288 nuclei or 396 cells, making instance-by-instance localization particularly demanding.

<img src="/static/img/news/2026_pathsegmentor/figure-4.jpg" alt="Complex pathology structures and prompt efficiency" style="width: 100%;"/>

**Figure 4 \| Complex structures and prompt efficiency.** **a–d,** Performance trends and examples for irregular shapes and small instances. **e–f,** Instance-count distributions and performance on dense targets. **g,** The trade-off between segmentation accuracy and prompt number. **h,** Dense pathology images containing hundreds of nuclei or cells.

## External and Clinical Validation

The researchers assessed generalization on five external public datasets: CPM17, CPM15, Kumar, Lizard and CoNSeP. They also evaluated two clinical cohorts containing 968 breast-tumour and 912 colon-epithelial-nuclei image–mask pairs. The external targets had corresponding object types in the training taxonomy. These experiments therefore measured cross-source generalization rather than open-set segmentation of entirely unseen categories.

PathSegmentor achieved mean Dice scores of 0.706, 0.484, 0.428 and 0.319 on CPM17, CPM15, Kumar and Lizard, respectively. Its scores reached 0.673 and 0.697 in the two clinical cohorts, exceeding the respective second-ranked methods by 0.076 and 0.153. On CoNSeP, PathSegmentor exceeded BiomedParse by 0.072 Dice overall.

Within CoNSeP, PathSegmentor led on malignant epithelial, healthy epithelial, muscle, inflammatory and fibroblast cells. MedSAM and SAM-Med2D performed better on endothelial cells. This finding highlights that localized spatial prompts may remain advantageous for some sparse and spatially concentrated targets.

<img src="/static/img/news/2026_pathsegmentor/figure-5.jpg" alt="External and clinical validation of PathSegmentor" style="width: 100%;"/>

**Figure 5 \| External and clinical validation.** **a–d,** Segmentation performance on CPM17, CPM15, Kumar and Lizard. **e–f,** Results in two independent clinical cohorts. **g,** Overall and category-level CoNSeP performance, together with analyses of instance count and spatial dispersion.

## Interpretable Breast Cancer Classification

Pixel-level masks with explicit semantics can support more informative explanations of diagnostic models. The researchers tested two complementary workflows using 985 TCGA-BRCA whole-slide images. The task distinguished invasive ductal carcinoma (IDC) from invasive lobular carcinoma (ILC).

The first workflow performed classification before segmentation. A standard multiple-instance learning classifier achieved a macro AUC of 0.936. PathSegmentor then segmented predefined pathological objects. The researchers blurred these regions and measured the resulting change in prediction error. This approach linked feature importance to ductal epithelium, cancerous cells, tumour tissue and epithelial nuclei.

The second workflow performed segmentation before classification. PathSegmentor masks decomposed whole-slide features into explicit pathological object representations. An object-aware classifier then produced semantically resolved class activation maps. The model retained a macro AUC of 0.953 for IDC and ILC classification. Unlike conventional activation maps, these maps indicated both where the model focused and which pathological objects occupied those regions.

<img src="/static/img/news/2026_pathsegmentor/figure-6.jpg" alt="PathSegmentor for interpretable breast cancer classification" style="width: 100%;"/>

**Figure 6 \| PathSegmentor supports interpretable breast cancer classification.** **a,** Object-level perturbation estimates the importance of pathological structures for IDC and ILC predictions. **b,** PathSegmentor masks support object-aware activation maps that connect discriminative regions with specific pathological structures.

## Translational Potential

PathSegmentor offers three practical advances for computational pathology:

* **A unified semantic coordinate system.** PathSeg organizes approximately 275,000 image–mask–label triples from 21 public datasets by anatomical region, histological structure and object type.
* **Lower model-maintenance and prompting burdens.** One model covers 160 categories and outperforms task-specific, spatially prompted and text-prompted baselines. A single text description can replace many instance-level boxes in dense pathology images.
* **An interface for interpretable analysis.** Semantic masks associate diagnostically relevant regions with specific tissues, cells and nuclei. They support object-level feature attribution and the exploration of imaging biomarkers.

Several limitations define the current scope. PathSeg remains smaller than large non-semantic segmentation datasets. The model focuses on text-driven semantic segmentation and does not yet fully combine textual and visual prompts. Closely packed cells may be merged rather than separated into distinct instances. The endothelial-cell results further indicate that spatial prompts can remain preferable for some sparse, localized targets. The two clinical cohorts provide initial cross-centre evidence, but larger prospective multicentre studies remain necessary.

PathSegmentor should therefore be viewed as a research tool for quantitative pathology and model interpretation. It is not an autonomous diagnostic system or a replacement for expert pathological assessment.

---

## Resources

**Paper \|** *Segment Anything in Pathology Images with Natural Language*

**Journal \|** *Nature Computational Science* (2025 Journal Impact Factor: 20.3)

**Publication date \|** 10 September 2026

**Official article \|** [https://www.nature.com/articles/s43588-026-01042-5](https://www.nature.com/articles/s43588-026-01042-5)

**DOI \|** [https://doi.org/10.1038/s43588-026-01042-5](https://doi.org/10.1038/s43588-026-01042-5)

**Preprint \|** [https://arxiv.org/abs/2506.20988](https://arxiv.org/abs/2506.20988)

**Code \|** [https://github.com/zhi-xuan-chen/PathSegmentor](https://github.com/zhi-xuan-chen/PathSegmentor)

**Model weights \|** [Google Drive](https://drive.google.com/drive/folders/1HxFdA9KXfS6CKgMX-i6TEVfflHiO5Tmf)

**Archived code \|** PathSegmentor v1.0.0, [Zenodo DOI: 10.5281/zenodo.21800277](https://doi.org/10.5281/zenodo.21800277)

**Joint first authors \|** Zhixuan Chen (陈芝漩) and Junlin Hou (侯君临)

**Corresponding author \|** Hao Chen (陈浩), The Hong Kong University of Science and Technology; jhc@ust.hk

**Collaborating institutions and departments \|** The Hong Kong University of Science and Technology (Department of Computer Science and Engineering; Department of Chemical and Biological Engineering; Division of Life Science; HKUST Shenzhen–Hong Kong Collaborative Innovation Research Institute; State Key Laboratory of Nervous System Disorders); University of Science and Technology of China (School of Electronic Engineering and Information Science); The Chinese University of Hong Kong (Department of Computer Science and Engineering; Department of Anatomical and Cellular Pathology, Faculty of Medicine); Tencent AI Platform Department; Nanfang Hospital, Southern Medical University (Department of Pathology); School of Basic Medical Sciences, Southern Medical University (Department of Pathology).
