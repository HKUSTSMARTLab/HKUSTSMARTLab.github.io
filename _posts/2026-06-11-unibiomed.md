---
published: True
title: '[Nature Communications] A universal foundation model for grounded biomedical image interpretation'
author: Cheng Jin
layout: post
group: news
cover: /static/img/news/2026_unibiomed_cover.png
oneline_description: 'A new study from HKUST Smart Lab introduces UniBiomed, a universal foundation model for grounded biomedical image interpretation that is now published in Nature Communications.'
last_updated: 2026/06/04
---

Recently, the HKUST Smart Lab team has completed a groundbreaking project on biomedical image analysis. Published in **<font color="red">Nature Communications</font>**, this work presents a universal foundation model for grounded biomedical image interpretation.

## Introduction

The integration of AI-assisted biomedical image analysis into clinical practice demands AI-generated findings that are not only accurate but also interpretable. However, existing models generally lack the ability to simultaneously generate diagnostic findings and localize corresponding targets. This limitation makes it challenging to correlate AI-generated findings with visual evidence and interpret the results. To this end, we introduce UniBiomed, a universal foundation model for grounded biomedical image interpretation, which is capable of generating accurate diagnostic findings and segmenting the biomedical targets. UniBiomed is based on an integration of Multi-modal Large Language Model and Segment Anything Model, which can unify diverse biomedical tasks in universal training for advancing grounded interpretation. To develop UniBiomed, we curate a large-scale dataset comprising 27 million triplets of images, region annotations, and text descriptions. Extensive validation on 70 internal and 14 external datasets demonstrated the state-of-the-art performance of UniBiomed in diverse biomedical tasks.

<img src="/static/img/news/2026_unibiomed1.png" alt="unibiomed" style="width: 100%;"/>


## Method

<img src="/static/img/news/2026_unibiomed2.png" alt="unibiomed" style="width: 100%;"/>

The architecture of UniBiomed. Specifically, the user instruction is processed by a pre-trained text tokenizer BERT and input to LLM. The input image is encoded by the vision encoder of MLLM, and then the vision tokens are also injected into LLM for generating the diagnostic findings. Following previous methods, we combine the output of the MLLM with the tokenized user instructions as the language embeddings and inject them into SAM2’s prompt encoder for producing segmentation masks. Notably, we use LoRA to finetune the MLLM as previous methods. In SAM2, the prompt encoder and mask decoder are fine-tuned, while the vision encoder is frozen.

## Results

<img src="/static/img/news/2026_unibiomed3.png" alt="unibiomed" style="width: 100%;"/>

Comparison of biomedical image segmentation. a. Comparison of Dice
scores between UniBiomed and the best-competing segmentation foundation model
BiomedParse across nine modalities, with the mean (±s.d.) reported. Significance
levels at which UniBiomed outperforms BiomedParse, with a two-sided paired ttest P -value of ****P < 1 × 10−4. Notably, UniBiomed outperforms BiomedParse
by an average of 10.25% in dice scores on 60 internal and external datasets. b. Radar
chart comparisons with several representative segmentation foundation models, MedSAM, SegVol, SAT, and BiomedParse. Specifically, SAT is only applicable to 3D modalities like CT and MRI. SegVol is solely available for CT datasets. c. Qualitative segmentation results of UniBiomed. Specifically, the colors of segmentation masks for internal and external validations are green and orange,
respectively. d. Box plot comparisons between UniBiomed and BiomedParse. Significance levels at which UniBiomed outperforms BiomedParse, with two-sided
paired t-test P -values of ****P < 1 × 10−4 for both internal and external validations.e. Ablation studies of UniBiomed. We compare UniBiomed under two settings: (1)
train on only segmentation datasets, and (2) train on large-scale multi-modal datasets,
including segmentation, VQA, and report generation datasets. It can be seen that
with large-scale multi-modal datasets for training, the segmentation performance can
be further improved, the two-sided paired t-test P -values are **P < 1 × 10−2 and
****P < 1×10−4 for internal and external validations, respectively. f. Overall application comparisons with representative biomedical segmentation models. Referring segmentation represents using text instructions as prompts for segmentation, which eliminates the efforts of providing tight bounding boxes for the biomedical objects. Notably, UniBiomed not only supports multi-modal biomedical image segmentation but also establishes remarkable capabilities in ROI classification, VQA, and report generation, where state-of-the-art segmentation models fail to establish.

<img src="/static/img/news/2026_unibiomed4.png" alt="unibiomed" style="width: 100%;"/>

Comparison of grounded disease recognition and grounded report
generation. a. We curate a new dataset for grounded disease recognition. Specifically, this dataset contains 270K images with 15 types of abnormalities. The details of
the dataset are presented in Extended Data Table A6. b. We compare UniBiomed
with two state-of-the-art methods, LISA and GLaMM, in segmentation dice
scores and disease recognition accuracy. Notably, UniBiomed outperforms the best
competing method LISA by 3.86% in dice scores and 3.29% in accuracy, with twosided paired t-test P -values of ****P < 1 × 10−4 and **P < 1 × 10−2. c. Radar chart
comparisons across 15 types of abnormalities. d. Dice scores comparisons between
UniBiomed and LISA across 15 types of abnormalities, with the mean (±s.d.)
reported. e. The qualitative visualization results of grounded disease recognition.
The template user instruction is shown in the blue box. Given template instructions,
UniBiomed can recognize the abnormalities in the images and highlight the precise
localizations. f. Comparisons of grounded report generation on the RadGenome 
dataset. We re-implement GLaMM and LISA on this dataset for comparison.
We report dice scores results for segmentation evaluation, BLEU, METEOR,
and ROUGE-L results for report generation evaluation. g. Radar chart comparisons across different metrics in grounded report generation. h. An example of
grounded report generation on abdominal CT images. The template user instruction
is shown in the blue box. The text in green indicates the correct contents. Reference
denotes the ground truth from the RadGenome dataset. The segmentation mask
indicates the location of the corresponding organ (esophagus in the example) described
in the report.

<img src="/static/img/news/2026_unibiomed5.png" alt="unibiomed" style="width: 100%;"/>

Comparison of ROI classification and region-aware report generation. a. Comparisons with MedRegA and MedPLIB in ROI classification,
with the mean accuracy (±s.d.) reported. Significance levels at which UniBiomed outperforms MedPLIB, with two-sided paired t-test P -values are ****P < 1 × 10−4,
***P < 1 × 10−3, and ****P < 1 × 10−4 for CT, MRI, and pathology, respectively.b. Radar chart comparison with MedRegA and MedPLIB across ten diverse
biomedical imaging modalities. c. UniBiomed surpasses MedPLIB by 8.32% in
ROI classification accuracy, with two-sided paired t-test P -values of ****P < 1×10−4.d. Qualitative visualization results of ROI classification. The template user instruction is shown in the blue box. Specifically, given a bounding box prompt, UniBiomed
can effectively predict the class of biomedical targets within ROIs. e. Comparisons on
region-aware report generation in the MedTrinity dataset. We compare UniBiomed
with multiple representative MLLMs, including InternVL2.5, LLaVA-Med,
MedRegA, and MedPLIB. We report the results of BLEU, METEOR,
and ROUGE-L. f. Radar chart comparisons across different metrics in regionaware report generation. g. An example of region-aware report generation on chest
x-ray image. The template user instruction is shown in the blue box. The text in green
indicates the correct contents. Reference denotes the ground truth from the MedTrinity dataset.

## Conclusion 

In this work, we introduce UniBiomed, the first universal foundation model for grounded biomedical image interpretation. UniBiomed effectively unifies the generation of diagnostic findings with the segmentation of corresponding biomedical targets, enabling accurate biomedical image analysis across ten diverse imaging modalities. UniBiomed is based on an integration of advanced Multi-modal Large Language Model (MLLM) and Segment Anything Model (SAM), which can effectively leverage multi-modal biomedical information for tackling diverse biomedical tasks. To develop UniBiomed, we curate a large-scale dataset comprising 27 million triplets of images, region annotations, and text descriptions spanning ten biomedical imaging modalities, which is the largest and most comprehensive dataset for biomedical grounded interpretation. To evaluate the effectiveness of UniBiomed, we conduct a large-scale validation on 84 datasets with comprehensive comparisons of state-of-the-art methods. To evaluate the generalizability of our model, we involve 14 external datasets in validation, which are unseen in the training. Extensive experiments demonstrate that UniBiomed achieves state-of-the-art performance on a wide range of biomedical tasks, including biomedical image segmentation, disease recognition, region-aware diagnosis, and report generation. We further showcase that UniBiomed represents a paradigm shift in biomedical image analysis workflows, which effectively improves the efficiency of AI-assisted biomedical image analysis. These findings demonstrate the promising prospects of UniBiomed in clinical applications. 

Recent advances have attracted increasing attention to multimodal information for biomedical image analysis. Concretely, visual features extracted from biomedical images provide anatomical and functional information from cell to organ levels, while textual descriptions from clinical experts offer fine-grained information for interpreting biomedical images. Although recent biomedical AI models have showcased encouraging results in biomedical image analysis, it remains challenging to effectively integrate holistic vision and language information for assisting clinicians in practice. Specifically, the clinical adoption of biomedical AI models requires that the AI-generated results are both accurate and interpretable for clinicians to ensure reliability. Thus, it demands that biomedical AI models can output the diagnostic findings and simultaneously highlight the corresponding regions in the images, offering rich visual and textual information for assisting clinicians. To this end, we underscore the importance of grounded interpretation in biomedical image analysis, i.e., generating diagnostic findings and simultaneously segmenting the corresponding biomedical objects. This task enables models to extract important biomedical targets (e.g., lesions, tumors, cancer cells, or abnormal organs) and generate detailed descriptions (e.g., clinical reports) of corresponding objects to assist clinical experts in diagnosis, unlocking novel opportunities for end-to-end biomedical image analysis.

Although promising results have been demonstrated by UniBiomed, there are still several limitations for further improvement. Despite the extensive scale of our curated dataset, it may still lack incorporation of certain rare diseases or conditions, potentially limiting the model’s generalizability across all medical scenarios. For rare diseases, the bottleneck lies in the lack of annotated datasets for training and validation. In addition, while UniBiomed has achieved satisfactory performance on large-scale public datasets, further exploration of its clinical application is necessary to substantiate the effectiveness of our method. Moving forward, we will work closely with clinical practitioners to ensure that the model addresses practical needs and integrates seamlessly into existing workflows.

---

## Resources

For more details, please see our paper [A universal foundation model for grounded biomedical image interpretation](https://www.nature.com/articles/s41467-026-73986-1) via Nature Communications.

Code is available at [https://github.com/Luffy03/UniBiomed](https://github.com/Luffy03/UniBiomed).
