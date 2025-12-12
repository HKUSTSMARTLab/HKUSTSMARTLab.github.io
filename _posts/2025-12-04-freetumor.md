---
published: True
title: '[Nature Communications] Large-scale generative tumor synthesis in computed tomography images for improving tumor recognition'
author: Cheng Jin
layout: post
group: news
cover: /static/img/news/2025_freetumor_cover.png
oneline_description: 'A new study from HKUST Smart Lab introduces FreeTumor, a Generative AI (GAI) model for tumor synthesis that is now published in Nature Communications.'
last_updated: 2025/12/04
---

Recently, the HKUST Smart Lab team has completed a groundbreaking project on a Generative AI (GAI) model for tumor synthesis. Published in **<font color="red">Nature Communications</font>**, this work presents a tumor synthesis model (FreeTumor) in CT images for improvint tumor recognition.

## Introduction

AI-driven tumor recognition unlocks new possibilities for precise tumor screening and diagnosis. However, the progress is heavily hampered by the scarcity of annotated datasets, demanding extensive efforts by radiologists. To this end, we introduce FreeTumor, a Generative AI framework to enable large-scale tumor synthesis for mitigating data scarcity. Specifically, FreeTumor effectively leverages limited labeled data and large-scale unlabeled data for training. Unleashing the power of large-scale data, FreeTumor is capable of synthesizing a large number of realistic tumors for augmenting training datasets. We curate a large-scale dataset comprising 161,310 Computed Tomography (CT) volumes for tumor synthesis and recognition, with only 2.3% containing annotated tumors. 13 board-certified radiologists are engaged to discern between synthetic and real tumors, rigorously validating the quality of synthetic tumors. Through high-quality tumor synthesis, FreeTumor showcases a notable superiority over state-of-the-art tumor recognition methods, indicating promising prospects in clinical applications.

<img src="/static/img/news/2025_freetumor1.png" alt="freetumor" style="width: 100%;"/>


## Method

<img src="/static/img/news/2025_freetumor2.png" alt="freetumor" style="width: 100%;"/>

The framework of FreeTumor, including two stages: (1) Large-Scale Generative Tumor Synthesis Training. We first leverage labeled data to train a baseline segmentation model as the discriminator of the tumor synthesis model. Second, we leverage both labeled and unlabeled data to train the tumor synthesis model. Specifically, we train the generator to synthesize tumors on health organs while the discriminator is utilized to discriminate the reality of synthetic tumors. (2) Tumor Synthesis for Large-Scale Segmentation Training. We employ the generator to synthesize tumors on healthy organs for augmenting segmentation training datasets, while the discriminator is employed for quality control of synthetic tumors.

## Results

To validate the fidelity of synthetic tumors, we engaged 13 board-certified radiologists in a Visual Turing Test to discern between synthetic and real tumors. Rigorous clinician evaluation validates the high quality of our synthetic tumors, as they achieved only 51.1% sensitivity and 60.8% accuracy in distinguishing our synthetic tumors from real ones.

<img src="/static/img/news/2025_freetumor3.png" alt="freetumor" style="width: 100%;"/>

Through high-quality tumor synthesis, FreeTumor scales up the recognition training datasets by over 40 times, showcasing a notable superiority over state-of-the-art AI methods including various synthesis methods and foundation models. 

<img src="/static/img/news/2025_freetumor4.png" alt="freetumor" style="width: 100%;"/>

## Conclusion 

AI-driven tumor recognition has received increasing attention in recent years, yet the progress is heavily hampered by the scarcity of annotated datasets. Early attempts mainly focus on advancing network architectures to improve tumor recognition. Although encouraging results have been demonstrated, the scarcity of annotated datasets still heavily hampered further development. 
To this end, numerous medical foundation models have been introduced to tackle the challenges of data scarcity. Although these foundation models can leverage unlabeled data in self-supervised pre-training, they still fail to utilize unlabeled data during segmentation training and remain constrained by the limited scale of annotated datasets. 

Thus, tumor synthesis emerges as a promising solution to mitigate the scarcity of annotated tumor datasets, which can synthesize a large number of tumors on images for augmenting training datasets. Early attempts investigated image processing and generative models for tumor synthesis. However, these methods fail to integrate large-scale data into synthesis training, thus hindering the improvements of downstream tumor recognition. In addition, these methods largely ignore the importance of quality control in synthesizing tumors, while low-quality synthetic tumors will pose a negative impact on downstream training.

To this end, we introduce FreeTumor to address the aforementioned challenges. First, FreeTumor adopts an effective adversarial-based synthesis training framework to leverage both labeled and unlabeled data, facilitating the integration of large-scale unlabeled data in synthesis training. Second, FreeTumor further employs an adversarial-based discriminator to discard low-quality synthetic tumors, enabling automatic quality control of large-scale synthetic tumors in the subsequent segmentation training. In this way, FreeTumor facilitates the utilization of large-scale data in both synthesis and segmentation training, demonstrating superior performances compared with previous methods.

Although FreeTumor has demonstrated promising results in tumor recognition, there are still numerous areas for growth and improvement. In our work, we collected 12 annotated datasets from public resources for training and validation, which are commonly used in existing research for the five types of tumors/lesions we studied. With more annotated tumor datasets for training, the performance of FreeTumor could be further improved. In the future, we will consistently collect more annotated datasets to advance our model.
Moving forward, we will extend the application of FreeTumor to encompass other tumor types. Furthermore, generative models, including GAN and diffusion models, have also demonstrated promising results in the applications of other medical imaging modalities, e.g., X-ray and pathology images. In the future, we will explore adapting FreeTumor to other medical imaging modalities, which require further dataset curation and more evaluation.

---

## Resources

For more details, please see our paper [Large-scale generative tumor synthesis in computed tomography images for improving tumor recognition](https://www.nature.com/articles/s41467-025-66071-6) via Nature Communications.

**Citation**:  
L. Wu, et al, "Large-scale generative tumor synthesis in computed tomography images for improving tumor recognition," in Nature Communications, doi: https://doi.org/10.1038/s41467-025-66071-6.
