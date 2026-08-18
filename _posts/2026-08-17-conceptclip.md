---
published: True
title: '[Nature Biomedical Engineering] An Explainable Biomedical Foundation Model via Large-Scale Concept-Enhanced Vision–Language Pre-training'
author: Yuxiang Nie
layout: post
group: news
cover: /static/img/news/2026_conceptclip_cover.png
oneline_description: 'A new study from HKUST SmartX Lab introduces ConceptCLIP, a biomedical foundation model for accurate, generalizable, and explainable medical image analysis that is now published in Nature Biomedical Engineering.'
last_updated: 2026/08/17
---

<img src="/static/img/news/2026_conceptclip_cover.png" alt="ConceptCLIP article published in Nature Biomedical Engineering" style="width: 100%;"/>

Recently, the SmartX Lab team led by Professor Hao Chen at the Hong Kong University of Science and Technology (HKUST), in collaboration with Harvard University, Shenzhen People’s Hospital, Tencent YouTu Lab, the Chinese University of Hong Kong, Southern Medical University, Union Hospital of Tongji Medical College, Westlake University, and several other institutions, has made an important advance in **explainable biomedical foundation models**.

Published in *Nature Biomedical Engineering*, this work introduces **ConceptCLIP**, a biomedical foundation model designed to combine strong diagnostic performance and broad generalizability with explanations that clinicians can understand, verify, and challenge. The study addresses a central obstacle to clinical AI: high-performing models often operate as opaque “black boxes,” while conventional explainable-AI methods usually depend on extensive expert annotations tailored to a single disease, modality, or clinical setting.

To bridge this gap, the team curated **MedConcept-23M**, a large-scale dataset containing 23 million biomedical image–text–concept triplets, and developed a dual-alignment pre-training strategy. **Image–Text Alignment (IT-Align)** captures the global meaning shared by an image and its caption, while **Region–Concept Alignment (RC-Align)** learns local correspondences between image regions and standardized medical concepts.

Across a comprehensive benchmark of **78 datasets spanning 10 medical imaging modalities**, ConceptCLIP demonstrates leading performance in medical image diagnosis, cross-modal retrieval, visual question answering, report generation, pathology whole-slide image analysis, and multiple explainability tasks. In a clinician user study, its concept-based explanations also help clinicians verify correct predictions, identify potential AI errors, and improve the accuracy of recognizing diagnostic findings.

<img src="/static/img/news/2026_conceptclip_fig1.png" alt="ConceptCLIP framework and evaluation overview" style="width: 100%;"/>

**Figure 1 \| Overview of ConceptCLIP.** **a–c,** Image types, modality-level concept distributions, and representative medical concepts in MedConcept-23M. **d–e,** ConceptCLIP learns global image–text representations through IT-Align and local image-region–UMLS-concept correspondences through RC-Align. **f,** The evaluation benchmark spans diverse medical imaging modalities and tasks. **g,** Overall performance in diagnosis, retrieval, visual question answering, report generation, whole-slide image analysis, and explainable AI. **h,** ConceptCLIP supports multimodal input, general-purpose medical image analysis, and concept-level explanations.

## Introduction

Clinical adoption of medical imaging AI requires two capabilities at the same time: diagnostic accuracy that approaches specialist performance, and interpretability that supports clinical decision-making. A model should not only answer *what* it predicts, but should also provide evidence about *where* it is looking, *which medical concepts* support the prediction, and whether an incorrect result can be recognized from its explanation.

Biomedical foundation models are attractive because one pre-trained model can be transferred across X-ray, CT, MRI, ultrasound, pathology, fundus photography, dermoscopy, and other modalities. The same representation can support diagnosis, retrieval, question answering, report generation, and additional downstream applications. Yet strong benchmark performance does not automatically make a system trustworthy. Most multimodal foundation models are trained only with image–text pairs and primarily learn global semantic correspondence; they do not explicitly learn fine-grained, standardized medical concepts that can be inspected by clinicians.

Existing explainable-AI methods address part of this problem, but often require manually annotated lesions, regions, attributes, or concept labels for a narrowly defined clinical task. Such supervision is expensive to obtain and difficult to scale across modalities and diseases.

ConceptCLIP takes a different route: it introduces standardized medical concepts directly into large-scale vision–language pre-training. The concepts are linked to the **Unified Medical Language System (UMLS)**, which connects synonymous terms from resources such as SNOMED CT, MeSH, and RxNorm through shared **Concept Unique Identifiers (CUIs)**. As a result, the model learns not only whether an image matches a caption, but also whether a particular image region corresponds to concepts such as *pleural effusion*, *pneumothorax*, *marked spiculation*, or a *hypoechoic mass*.

MedConcept-23M was derived from approximately 6.2 million open-access scientific articles. The curation pipeline yielded 23,289,898 biomedical image–text pairs, of which 23 million were used for pre-training and 289,898 were retained for evaluation and benchmark curation. The resulting evaluation suite covers 78 datasets across 10 imaging modalities, including medical image diagnosis, cross-modal retrieval, visual question answering, medical report generation, pathology whole-slide image analysis, medical concept annotation, inherently interpretable diagnosis, and concept–disease association discovery.

## Background

Current medical AI systems face several persistent gaps that limit their clinical use:

* **Biomedical foundation models are powerful but opaque.** They can generalize across tasks and modalities, yet their predictions are often based on latent features that clinicians cannot directly inspect.
* **Conventional explainability methods are difficult to scale.** Many require disease-specific concept labels or pixel- and region-level expert annotations, making broad multimodal deployment costly.
* **Image–text pre-training lacks fine-grained supervision.** Global image–caption matching can capture overall semantics without reliably grounding specific clinical concepts in local image regions.
* **Clinical trust must be calibrated, not assumed.** Useful explanations should strengthen confidence when the model is correct and expose questionable reasoning when the model is wrong.

ConceptCLIP addresses these limitations by integrating standardized concept supervision into foundation-model pre-training and preserving those concepts as usable signals during inference.

## Method

ConceptCLIP is built around a large-scale concept-enriched dataset and two complementary alignment objectives.

### MedConcept-23M: from image–text pairs to image–text–concept triplets

MedConcept-23M is constructed from the PubMed Central Open Access Subset through a three-stage concept-curation pipeline:

1. **Biomedical entity recognition.** Candidate clinical entities are identified in scientific figure captions.
2. **Semantic disambiguation and UMLS linking.** The SciSpacy UMLS Entity Linker maps each entity to candidate UMLS concepts, while similarity filtering removes low-confidence matches.
3. **Contextual validation.** A PubMedBERT-based textual-entailment model verifies whether each candidate concept is central to the meaning of the caption. The final dataset retains the standardized concept name and its CUI.

For example, a caption describing a chest X-ray with pleural effusion and pneumothorax is converted into a triplet containing the image, the original caption, and standardized concepts linked to their UMLS identifiers. This process unifies synonymous expressions across publications and reduces the noise that would result from simple keyword matching.

### Dual alignment: understanding the whole image and grounding local concepts

The ConceptCLIP image encoder is initialized from **SigLIP-ViT-400M-16**, and the text encoder is initialized from **PubMedBERT**. The model jointly optimizes two objectives:

* **Image–Text Alignment (IT-Align)** learns global cross-modal representations. A complete biomedical image and its full caption are mapped into a shared embedding space, bringing matched image–text pairs closer while separating unmatched pairs.
* **Region–Concept Alignment (RC-Align)** learns fine-grained local correspondence. The image is represented as patch-level regional features, while each medical concept is represented using the corresponding caption tokens. For every concept, the model searches for its best-matching image region and uses this correspondence as a weak supervisory signal.

Because RC-Align learns from caption-level concepts, ConceptCLIP does not require manually drawn region annotations for each pre-training image. The model can therefore acquire local, concept-level grounding at a scale that would be impractical with conventional expert annotation.

## Diagnostic Validation

ConceptCLIP was first evaluated on medical image diagnosis under three settings: zero-shot diagnosis, linear probing, and full fine-tuning.

In **zero-shot diagnosis**, the model receives no task-specific downstream training. Across 39 datasets and 10 medical imaging modalities, ConceptCLIP consistently outperforms previous general-domain and biomedical multimodal foundation models. Averaged across modalities, it improves AUC by **6.81 percentage points** over the previous best medically trained baseline (*P* < 0.001), with particularly large gains in CT (**+10.73 points**), ultrasound (**+10.06 points**), and fundus imaging (**+8.98 points**).

In **linear probing**, only a lightweight linear classifier is trained on top of the frozen foundation-model representation. ConceptCLIP remains strong when downstream labels are scarce. With only 1% of the training data in the X-ray category, it achieves an average AUC of **71.48%**, exceeding the second-best model, SigLIP-400M, by **3.75 percentage points** (*P* < 0.001).

In **full fine-tuning** across 39 datasets, ConceptCLIP achieves the best average performance in 8 of the 10 modalities, with statistically significant improvements in 6 modalities. These results show that ConceptCLIP is not only a strong zero-shot image–text model, but also a transferable medical vision backbone for supervised downstream tasks.

The study also examines distribution shifts that more closely resemble real-world deployment. On six datasets containing diseases that were novel or severely underrepresented in the pre-training corpus, ConceptCLIP achieves leading or competitive zero-shot performance on five benchmarks. Across nine private, multicentre clinical datasets spanning pathology, MRI, CT, and chest X-ray, it ranks first in AUC on every dataset, with statistically significant gains on eight. It also remains robust on four high-bit-depth clinical datasets, including raw 16-bit CT, 12-bit X-ray, and 32-bit MRI images. The comparison with a model variant without RC-Align indicates that local concept alignment contributes to robustness under these image-distribution shifts.

<img src="/static/img/news/2026_conceptclip_fig2.png" alt="Medical image diagnosis results" style="width: 100%;"/>

**Figure 2 \| Medical image diagnosis results.** **a,** Evaluation protocols for zero-shot diagnosis, linear probing, and full fine-tuning. **b,** Zero-shot diagnostic performance across 39 datasets and 10 modalities. **c,** Linear-probing results using 1%, 10%, and 100% of downstream training data. **d,** Full fine-tuning results across 39 datasets. ConceptCLIP serves both as a strong zero-shot vision–language model and as a transferable medical vision foundation model.

## Medical Imaging Analysis Tasks Beyond Diagnosis

The representations learned by ConceptCLIP transfer to a broad range of medical tasks beyond classification.

In **cross-modal retrieval**, ConceptCLIP achieves the best image-to-text and text-to-image performance on both PMC-9K and QUILT-1M. On PMC-9K, its image-to-text Recall@1 reaches **82.85%**, significantly above BiomedCLIP’s 73.41%. On QUILT-1M, its text-to-image Recall@200 reaches **32.50%**, an absolute improvement of 12.88 percentage points over BiomedCLIP.

In **medical visual question answering**, ConceptCLIP achieves overall accuracies of **83.86%** on SLAKE and **70.70%** on VQA-RAD. In **medical report generation**, it obtains the best or competitive results on most metrics for MIMIC-CXR and IU X-Ray; on MIMIC-CXR, its Macro F1 reaches **26.38%**, 4.28 percentage points above the second-best result. In **pathology whole-slide image analysis**, ConceptCLIP is evaluated on nine tasks involving cancer diagnosis, mutation prediction, and survival prediction, including an AUC of **91.65%** on BRACS-3 cancer diagnosis.

<img src="/static/img/news/2026_conceptclip_fig3.png" alt="Results on cross-modal retrieval, VQA, report generation, and whole-slide image analysis" style="width: 100%;"/>

**Figure 3 \| Results on other medical image analysis tasks.** **a,** Workflows for text-to-image retrieval, image-to-text retrieval, visual question answering, medical report generation, and pathology whole-slide image analysis. **b,** Cross-modal retrieval results on PMC-9K and QUILT-1M. **c,** Visual question answering on SLAKE and VQA-RAD. **d,** Report generation on MIMIC-CXR and IU X-Ray. **e,** Whole-slide image tasks covering cancer diagnosis, mutation prediction, and survival prediction.

## Explainable AI

A central contribution of ConceptCLIP is its ability to organize local visual evidence into medical concepts that can be examined by clinicians. The study evaluates this capability from three complementary perspectives.

### Zero-shot medical concept annotation

Across five datasets in dermatology, pathology, ultrasound, and CT, the concept-annotation benchmark includes 5,901 test images and 53 fine-grained clinical concepts. ConceptCLIP improves average performance by **10.9%** over PMC-CLIP and **10.4%** over BiomedCLIP (*P* < 0.001). Adding local region–concept evidence consistently outperforms a global-only variant on all five datasets. Visualizations show that the model can localize concepts such as an *irregular mass* or *irregular cellular morphology* to clinically plausible image regions.

### Inherently interpretable diagnosis

ConceptCLIP can serve as the backbone of a **Concept Bottleneck Model (CBM)**, in which the diagnostic prediction is explicitly derived from an intermediate layer of human-interpretable concepts rather than directly from opaque deep features. A CBM built on ConceptCLIP improves AUC by **6.13 percentage points** over the second-best CBM and, in some settings, matches or exceeds fully fine-tuned black-box models.

### Concept–disease association discovery

ConceptCLIP can also identify clinically meaningful associations across datasets. In chest X-rays, concepts such as *cavitation*, *consolidation*, *opacity*, and *lymphadenopathy* are enriched in tuberculosis images. In breast imaging, concepts such as *spiculation*, *lobulation*, and *irregular shape* are associated with malignancy. When pneumonia is inspected across multiple datasets, the model recovers a more consistent disease-level set of concepts, including *consolidation*, *infiltrates*, *atelectasis*, *effusion*, and *opacities*.

<img src="/static/img/news/2026_conceptclip_fig4.png" alt="Explainability experiments" style="width: 100%;"/>

**Figure 4 \| Explainability experiments.** **a,** Zero-shot medical concept annotation. **b,** Inherently interpretable diagnosis through a concept layer. **c–d,** Multimodal concept-annotation performance and the contribution of local alignment. **e,** Visual grounding between medical concepts and image regions. **f–g,** Concept bottleneck model performance and concept–class associations. **h,** Concept–disease association discovery across modalities. **i,** Disease-level concept inspection within and across datasets.

## Clinician Validation

Benchmark-level interpretability does not necessarily guarantee clinical usefulness. To test whether clinicians can act on the explanations, the study includes eight practicing clinicians from pathology, ultrasound, and radiology. They evaluated 92 unique cases, producing **252 clinician–case assessments**.

Each assessment followed a three-step protocol. First, the clinician reviewed the image and the AI prediction, recorded an initial judgment, and rated trust in the model. Second, the clinician viewed ConceptCLIP’s concept explanation heatmap and re-evaluated the case. Third, the clinician assessed the explanation’s specific clinical utility.

The explanations support **appropriate trust calibration**. When the AI prediction is correct, the explanation provides corroborating evidence and increases trust. When the prediction is incorrect, an implausible focus can expose flawed reasoning and reduce trust. The effect is clearest in radiology, where the average trust score increases by **1.25 points** for correct predictions and decreases by **1.08 points** for incorrect predictions (both *P* < 0.001).

More importantly, explanations improve clinicians’ ability to identify clinical findings. Overall accuracy rises from **68.1% to 76.2%**, an absolute gain of **8.1 percentage points** (*P* < 0.001). Improvements are observed in all three specialties, with ultrasound showing a gain of **10.6 percentage points**. Clinicians report that correct explanations can enhance confidence, improve efficiency, and provide diagnostic insight, while incorrect explanations can help reveal AI errors and support the rapid rejection of unreliable suggestions.

<img src="/static/img/news/2026_conceptclip_fig5.png" alt="Clinician user study methodology and results" style="width: 100%;"/>

**Figure 5 \| Clinician user study methodology and results.** **a,** Eight clinicians, 92 unique cases, and 252 clinician–case evaluations across pathology, ultrasound, and radiology. **b,** The three-step protocol: initial assessment, re-evaluation after viewing the explanation, and evaluation of clinical utility. **c,** Explanations increase trust when AI is correct and decrease trust when AI is wrong. **d,** Accuracy in identifying clinical findings improves across all three specialties after explanations are shown. **e,** Clinician-reported utility, including enhanced confidence, improved efficiency, new diagnostic insight, and identification of AI errors.

## Translational Potential

ConceptCLIP offers four practical advances toward trustworthy clinical AI:

* **Strong performance with broad generalizability.** The model performs competitively across 78 datasets and 10 imaging modalities, including zero-shot, data-efficient, fine-tuned, private multicentre, and high-bit-depth clinical settings.
* **Scalable concept supervision.** MedConcept-23M transforms large-scale biomedical image–text data into concept-enriched triplets using standardized UMLS terminology, avoiding the need for region-level expert annotations across millions of images.
* **Performance and interpretability reinforce one another.** IT-Align captures broad image–text semantics, while RC-Align links local image evidence to medical concepts. The concept-enhanced representation supports both diagnostic accuracy and explanation quality.
* **Actionable evidence for clinician–AI collaboration.** Concept-level explanations are not intended to replace a clinician’s conclusion. Instead, they provide evidence that can be inspected, questioned, integrated, or rejected during clinical decision-making.

Several limitations remain. MedConcept-23M may underrepresent rare diseases; ConceptCLIP currently relies on predefined concepts, leaving open-set concept discovery and novel biomarker identification for future work. RC-Align uses a maximum-similarity region-selection mechanism and may occasionally focus on artifacts, acquisition noise, or other spurious local patterns in noisy clinical environments. More prospective validation is therefore needed in real-world workflows. ConceptCLIP’s explanations should be treated as decision-support evidence rather than a substitute for clinical judgment.

By embedding standardized medical concepts into foundation-model pre-training, ConceptCLIP provides a unified route toward medical AI that is accurate, generalizable, and explainable. The work moves explainability beyond a post-hoc visualization and toward a practical interface for examining the reasoning of biomedical foundation models.

---

## Resources

**Paper \|** *An Explainable Biomedical Foundation Model via Large-Scale Concept-Enhanced Vision-Language Pre-training*

**Journal \|** *Nature Biomedical Engineering* (2026)

**DOI \|** [https://doi.org/10.1038/s41551-026-01764-x](https://doi.org/10.1038/s41551-026-01764-x)

**Code \|** [https://github.com/JerrryNie/ConceptCLIP](https://github.com/JerrryNie/ConceptCLIP)

**Model weights \|** [https://huggingface.co/JerrryNie/ConceptCLIP](https://huggingface.co/JerrryNie/ConceptCLIP)

**MedConcept-23M dataset \|** [https://huggingface.co/datasets/JerrryNie/MedConcept-23M](https://huggingface.co/datasets/JerrryNie/MedConcept-23M)

**PMC-9K retrieval benchmark \|** [https://huggingface.co/datasets/JerrryNie/pmc9k](https://huggingface.co/datasets/JerrryNie/pmc9k)

**Co-first authors \|** Yuxiang Nie, Sunan He, and Yequan Bie

**Corresponding author \|** Hao Chen, The Hong Kong University of Science and Technology; jhc@ust.hk

**Collaborating institutions \|** The Hong Kong University of Science and Technology, Harvard University, Shenzhen People’s Hospital, Tencent YouTu Lab, the Chinese University of Hong Kong, Queen Mary Hospital, Southern Medical University, Union Hospital of Tongji Medical College at Huazhong University of Science and Technology, Sun Yat-Sen Memorial Hospital, Westlake University, and other collaborating institutions.
