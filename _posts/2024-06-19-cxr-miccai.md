---
published: True
title: "MICCAI 2024 Challenge CXR-LT: Long-Tailed, Multi-Label, and Zero-Shot Classification of Chest X-rays"
author: Cheng Jin
layout: post
group: news
cover: /static/img/news/2024_cxr_miccai.png
oneline_description: "The MICCAI 2024 Challenge CXR-LT: Long-Tailed, Multi-Label, and Zero-Shot Classification of Chest X-rays is going to be held on October 10, 2024, in Marrakech, Morocco."
last_updated: 2024/06/19
---

<img src="/static/img/news/2024_cxr_miccai.png" alt="2024 cxr miccai cover" style="width: 100%;"/>

The MICCAI 2024 Challenge CXR-LT: Long-Tailed, Multi-Label, and Zero-Shot Classification of Chest X-rays is going to be held on October 10, 2024, in Marrakech, Morocco. Following is the detailed information about the challenge.

## Overview
Challenge name: MICCAI 2024 Challenge CXR-LT: Long-Tailed, Multi-Label, and Zero-Shot Classification of Chest X-rays

Location: Marrakech, Morocco

Date: October 10, 2024

Task 1 Link:

[https://codalab.lisn.upsaclay.fr/competitions/18601](https://codalab.lisn.upsaclay.fr/competitions/18601)

Task 2 Link:

[https://codalab.lisn.upsaclay.fr/competitions/18603](https://codalab.lisn.upsaclay.fr/competitions/18603)

Task 3 Link:

[https://codalab.lisn.upsaclay.fr/competitions/18604](https://codalab.lisn.upsaclay.fr/competitions/18604)

## Introduction
Chest X-ray examinations (CXRs), like many diagnostic medical tests, produce a long-tailed distribution of clinical findings; while a small number of diseases are frequently observed, the vast majority of diseases are relatively rare [1]. This poses a challenge for standard deep learning methods, which typically bias towards the most common categories while ignoring important but rare “tail” categories [2]. Although many methods [3] have been proposed to address this specific type of imbalance, only recently have studies begun to focus on the issue of long-tailed medical image recognition [4-6]. In CXR diagnosis, this is also a multi-label problem, as patients often present with findings of multiple diseases simultaneously; however, only a few studies have considered the knowledge of label co-occurrence during the learning process [7-9,12]. Since most large-scale image classification benchmarks contain single-label images and mostly balanced label distributions, many standard deep learning methods fail to adapt to the long-tailed, multi-label imbalance and co-occurrence problems posed by tasks such as CXR disease diagnosis [2].

In the first CXR-LT competition held in 2023, we expanded the MIMIC-CXR-JPG [10,11] dataset by increasing the target categories from 14 to 26 and generating 12 new labels for rare disease findings through parsing radiology reports [13]. This made the long-tailed, multi-label disease classification task more challenging, attracting 59 teams who contributed over 500 submissions. However, the radiology category ontology records over 4,500 unique radiology image findings. This means that the “true” distribution of all clinical findings on CXRs is at least two orders of magnitude larger than what we or any existing dataset can provide. Therefore, we believe that the only way to truly address the long-tail problem of radiology image findings is to develop a model that can generalize to new categories in a “zero-shot” manner [14].

In this year’s CXR-LT edition, we have extracted labels for an additional 19 rare disease findings (totaling 377,110 CXRs, each with 45 disease labels) and introduced two new challenge tracks, including a zero-shot classification task.


## Dataset
In the first CXR-LT held in 2023, we expanded the target categories from 14 to 26 based on the MIMIC-CXR dataset and generated 12 new labels for rare diseases by parsing radiology reports. In this year’s CXR-LT, we have generated labels for an additional 19 rare diseases (totaling 377,110 CXR images, each containing 45 disease labels).

## Tasks
Our challenge includes three independent tasks:

Task 1: Long-tailed classification on a large and noisy test set.

Task 2: Long-tailed classification on a small, manually annotated test set.

Task 3: Zero-shot generalization to previously unseen disease labels.

For all tasks, participants will train on a large, automatically labeled training set containing more than 250,000 CXR images and 40 binary disease labels. Despite the success of last year’s CXR-LT, we hope to achieve more meaningful methodological advancements in CXR disease classification in the clinical reality of multi-label, long-tailed, and zero-shot scenarios in the 2024 CXR-LT.

## Evaluation
For each task, models will be evaluated using “macro average” mean Average Precision (mAP) on the provided test sets.

Task 1 will be evaluated on a large, automatically labeled test set consisting of over 75,000 CXR images from the same 40 labels.

Task 2 will be evaluated on a “gold standard” subset of the test set, containing 409 CXR images from 26 of the 40 labels, all manually annotated.

Task 3 will be evaluated on the same large test set as Task 1, but targeting five “held-out” disease labels that were unseen during training.

The competition will be hosted on the [CodaLab platform](https://codalab.lisn.upsaclay.fr/).

## How to Participate
This competition uses the [MIMIC-CXR-JPG v2.0.0 dataset](https://physionet.org/content/mimic-cxr-jpg/2.0.0/), which requires certification and signing the Data Use Agreement (DUA) through [PhysioNet](https://physionet.org/).

To participate, follow these steps:

Step 1: Become a certified user through [PhysioNet](https://physionet.org/) and sign the MIMIC-CXR-JPG v2.0.0 Data Use Agreement (DUA). (If you are already a certified user of MIMIC-CXR-JPG, you can skip this step.)

Step 2: Fill out this [Google Form](https://docs.google.com/forms/d/e/1FAIpQLScjbRfYiosclkyfG577L7yFx-kRbSsVeota4-nDzupvVtkmkA/viewform) and provide the following information:

- Your CodaLab email address
- Proof that you are a certified PhysioNet user
- Proof that you have signed the MIMIC-CXR-JPG v2.0.0 Data Use Agreement

Important: Ensure that your PhysioNet email matches your CodaLab email to gain approval.

Step 3: Register for the competition on CodaLab through the “Participate” tab and wait for our approval.

If you have completed these steps correctly, you will be granted access to the competition, and we will provide a link to download the necessary data via email! You must not share these labels in any form.

## Tentative Schedule

- May 1, 2024: Release of training data, challenge (development phase) begins.
- August 1, 2024: Release of test labels, final evaluation (test phase) begins.
- August 4, 2024: Test phase ends, competition closes.
- August 15, 2024: Top-performing teams invited to present at the MICCAI 2024 conference.
- October 10, 2024: MICCAI 2024 CXR-LT Challenge event.

## Committee
<img src="/static/img/news/2024_cxr_miccai_committee.png" alt="2024 cxr miccai committee" style="width: 100%;"/>

## Organizers
<img src="/static/img/news/2024_cxr_miccai_organizers.png" alt="2024 cxr miccai organizers" style="width: 100%;"/>

For more information, please visit the [official challenge website](https://bionlplab.github.io/2024_MICCAI_CXRLT/).

### References

1. Zhou SK, Greenspan H, Davatzikos C, Duncan JS, Van Ginneken B, Madabhushi A, Prince JL, Rueckert D, Summers RM. A review of deep learning in medical imaging: Imaging traits, technology trends, case studies with progress highlights, and future promises. Proceedings of the IEEE. 2021 Feb 26;109(5):820-38.

2. Holste G, Wang S, Jiang Z, Shen TC, Shih G, Summers RM, Peng Y, Wang Z. Long-Tailed Classification of Thorax Diseases on Chest X-Ray: A New Benchmark Study. In Data Augmentation, Labelling, and Imperfections: Second MICCAI Workshop, DALI 2022, Held in Conjunction with MICCAI 2022, Singapore, September 22, 2022, Proceedings 2022 Sep 16 (pp. 22-32). Cham: Springer Nature Switzerland.

3. Zhang Y, Kang B, Hooi B, Yan S, Feng J. Deep long-tailed learning: A survey. IEEE Transactions on Pattern Analysis and Machine Intelligence. 2023 Apr 19.

4. Zhang R, Haihong E, Yuan L, He J, Zhang H, Zhang S, Wang Y, Song M, Wang L. MBNM: multi-branch network based on memory features for long-tailed medical image recognition. Computer Methods and Programs in Biomedicine. 2021 Nov 1;212:106448.

5. Ju L, Wang X, Wang L, Liu T, Zhao X, Drummond T, Mahapatra D, Ge Z. Relational subsets knowledge distillation for long-tailed retinal diseases recognition. In Medical Image Computing and Computer Assisted Intervention–MICCAI 2021: 24th International Conference, Strasbourg, France, September 27–October 1, 2021, Proceedings, Part VIII 24 2021 (pp. 3-12). Springer International Publishing.

6. Yang Z, Pan J, Yang Y, Shi X, Zhou HY, Zhang Z, Bian C. ProCo: Prototype-Aware Contrastive Learning for Long-Tailed Medical Image Classification. In Medical Image Computing and Computer Assisted Intervention–MICCAI 2022: 25th International Conference, Singapore, September 18-22, 2022, Proceedings, Part VIII 2022 Sep 16 (pp. 173-182). Cham: Springer Nature Switzerland.

7. Chen H, Miao S, Xu D, Hager GD, Harrison AP. Deep hierarchical multi-label classification of chest X-ray images. In International Conference on Medical Imaging with Deep Learning 2019 May 24 (pp. 109-120). PMLR.

8. Wang G, Wang P, Cong J, Liu K, Wei B. BB-GCN: A Bi-modal Bridged Graph Convolutional Network for Multi-label Chest X-Ray Recognition. arXiv preprint arXiv:2302.11082. 2023 Feb 22.

9. Chen B, Li J, Lu G, Yu H, Zhang D. Label co-occurrence learning with graph convolutional networks for multi-label chest x-ray image classification. IEEE Journal of Biomedical and Health Informatics. 2020 Jan 16;24(8):2292-302.

10. Johnson AE, Pollard TJ, Greenbaum NR, Lungren MP, Deng CY, Peng Y, Lu Z, Mark RG, Berkowitz SJ, Horng S. MIMIC-CXR-JPG, a large publicly available database of labeled chest radiographs. arXiv preprint arXiv:1901.07042. 2019 Jan 21.

11. PhysioNet. MIMIC-CXR-JPG - chest radiographs with structured labels [Internet]. Available from: https://physionet.org/content/mimic-cxr-jpg/2.0.0/.

12. Moukheiber D, Mahindre S, Moukheiber L, Moukheiber M, Wang S, Ma C, Shih G, Peng Y, Gao M. Few-Shot Learning Geometric Ensemble for Multi-label Classification of Chest X-Rays. In Data Augmentation, Labelling, and Imperfections: Second MICCAI Workshop, DALI 2022, Held in Conjunction with MICCAI 2022, Singapore, September 22, 2022, Proceedings 2022 Sep 16 (pp. 112-122). Cham: Springer Nature Switzerland.

13. CodaLab. CXR-LT: Multi-Label Long-Tailed Classification on Chest X-Rays [Internet]. Available from: https://codalab.lisn.upsaclay.fr/competitions/12599.

14. Holste G, Zhou Y, Wang S, Jaiswal A, Lin M, Zhuge S, Yang Y, Kim D, Nguyen-Mau TH, Tran MT, Jeong J. Towards long-tailed, multi-label disease classification from chest X-ray: Overview of the CXR-LT challenge. arXiv preprint arXiv:2310.16112. 2023 Oct 24.