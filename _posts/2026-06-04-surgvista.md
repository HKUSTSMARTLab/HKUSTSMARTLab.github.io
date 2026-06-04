---
published: True
title: "[npj Digital Medicine] Large-scale Self-supervised Video Foundation Model for Intelligent Surgery"
author: Cheng Jin
layout: post
group: news
cover: /static/img/news/2026_surgvista_fig0.png
oneline_description: SmartX Lab introduces SurgVISTA, a large-scale self-supervised video foundation model for intelligent surgery.
last_updated: 2026/06/04
---

Recently, the SmartX Lab team, in collaboration with the German Cancer Research Center (DKFZ, Heidelberg), the Hong Kong Polytechnic University, the National University of Singapore, Tongji Hospital of Tongji University School of Medicine, and the Chinese University of Hong Kong, completed a project on a video-level foundation model for intelligent surgery. Accepted by **npj Digital Medicine**, this work introduces **SurgVISTA (Surgical Video-level Spatial-Temporal Architecture)**, a large-scale self-supervised surgical video foundation model designed to support broad surgical scene understanding tasks, including workflow recognition, instrument and action understanding, fine-grained interaction modeling, and cross-task generalization analysis.

<img src="/static/img/news/2026_surgvista_fig0.png" alt="SurgVISTA title image" style="width: 100%;"/>

The paper, **Large-scale self-supervised video foundation model for intelligent surgery**, was published in **npj Digital Medicine** in 2026. The corresponding authors are Professor Lena Maier-Hein from the German Cancer Research Center (Heidelberg) and Professor Hao Chen from the Department of Computer Science and Engineering at the Hong Kong University of Science and Technology. Correspondence can be directed to l.maier-hein@dkfz-heidelberg.de and jhc@ust.hk.

## Background

Artificial intelligence has advanced rapidly in medical image analysis, yet most existing surgical AI models are still trained primarily on static images and therefore lack a comprehensive understanding of real intraoperative dynamics. Compared with natural-scene videos, surgical videos contain complex instrument motion, tissue interaction, long-range workflow transitions, and fine-grained anatomical structures. These characteristics make conventional image-level pretraining insufficient for real surgical environments. At the same time, high-quality surgical video data are expensive to collect, and public large-scale resources for surgical video pretraining remain limited, constraining the development of general-purpose foundation models for intelligent surgery.

To address these challenges, SmartX Lab and its collaborators constructed one of the largest surgical video pretraining datasets to date. As shown in Fig. 1, the dataset contains approximately **3,650 surgical videos** and more than **3.55 million frames**, covering over **20 surgical procedures** and more than **10 anatomical structures** across real clinical scenarios such as laparoscopic surgery, robot-assisted surgery, and ophthalmic surgery.

Based on this resource, the team proposed **SurgVISTA**, the first unified video-level spatial-temporal representation learning framework in the surgical domain, providing foundational capabilities for understanding complex intraoperative scenes.

<img src="/static/img/news/2026_surgvista_fig1.png" alt="Fig. 1. Overall SurgVISTA framework, including the pretraining dataset, asymmetric encoder-decoder architecture, and downstream evaluation benchmark" style="width: 100%;"/>

## Model Construction and Experimental Design

SurgVISTA is built on one of the largest surgical video pretraining resources currently available. The team collected and curated videos from multiple surgical scenarios, yielding roughly **3,650 videos**, more than **3.55 million frames**, over **20 surgical workflows**, and more than **10 key anatomical structures**. Unlike prior pretraining methods that mainly rely on static surgical images, video-level data provide richer temporal dynamics for learning complex intraoperative behavior and anatomical change. By using a large-scale, multi-procedure pretraining dataset, SurgVISTA can learn visual representations shared across surgical scenarios and serve as a unified foundation model for downstream surgical understanding tasks.

To fully exploit spatial-temporal information in surgical videos, SurgVISTA adopts an **asymmetric encoder-decoder architecture**. A unified encoder learns both spatial structures and temporal dynamics, while two decoders handle complementary learning objectives. The video-level reconstruction branch recovers masked video content, guiding the model to capture long-range temporal relationships and surgical workflow dynamics. The image-level knowledge distillation branch uses supervision from a high-performance visual teacher model to strengthen the model's understanding of anatomical structures and fine-grained spatial information. By combining video-level self-supervised learning with image-level knowledge transfer, SurgVISTA balances temporal modeling and spatial representation learning to obtain more generalizable surgical video features.

For systematic evaluation, the team established one of the most comprehensive surgical video benchmarks, spanning **13 downstream datasets**, **6 surgical types**, and **4 core task categories**:

* **Workflow recognition**
* **Action recognition**
* **Triplet recognition**
* **Skill assessment**

This benchmark covers multiple real clinical settings, including laparoscopic, ophthalmic, and robot-assisted surgery, enabling a broad assessment of the model's ability to understand complex intraoperative dynamics and spatial-temporal relationships.

The team further compared SurgVISTA with natural-domain image models, natural-domain video models, and surgical-domain pretrained models. Natural-domain models are mainly pretrained on large-scale natural images or videos, while earlier surgical-domain models primarily learn from static surgical images. In contrast, SurgVISTA performs large-scale surgical video pretraining for unified spatial-temporal modeling, allowing it to learn dynamic changes and interaction processes in complex intraoperative scenes. Internal testing, external testing, and cross-center evaluation further validated the model's generalization ability and robustness in real clinical settings.

In addition to standard performance comparisons, the study systematically analyzed the effects of pretraining data scale, cross-scenario generalization across surgical types, the contribution of video-level spatial-temporal modeling to complex tasks, and the impact of knowledge distillation on representation quality. These ablation and extended analyses confirmed the importance of large-scale video-level surgical pretraining for building general-purpose intelligent surgical foundation models.

## Experimental Results

In surgical workflow recognition, the team first compared SurgVISTA with natural-domain image and video pretrained models. As shown in Fig. 2, SurgVISTA significantly outperforms existing natural-domain image and video models on multiple representative public datasets, including **Cholec80**, **M2CAI16-Workflow**, **PmLR50**, and **CATARACTS**. It achieves leading results in video-level accuracy and phase-level Jaccard, demonstrating stronger capacity for long-range intraoperative dynamic modeling and more stable workflow and phase recognition in complex scenes.

<img src="/static/img/news/2026_surgvista_fig2.png" alt="Fig. 2. Comparison of natural-domain pretrained methods and SurgVISTA on surgical workflow recognition datasets" style="width: 100%;"/>

Fig. 2 compares different natural-domain pretraining methods and SurgVISTA on surgical workflow recognition datasets. Panels (a)-(d) correspond to in-domain testing datasets, while panels (e)-(h) correspond to out-of-domain testing datasets. To better analyze generalization, the study reports the proportions of relevant anatomical structures and surgical types shared between the pretraining and downstream data, visualized with ring charts: red denotes anatomical-structure overlap and blue denotes surgical-type overlap. The evaluation metrics include image-level accuracy, video-level accuracy, and phase-level Jaccard, enabling performance assessment at multiple granularities. Statistical significance values are reported when SurgVISTA achieves better performance than competing methods.

Beyond workflow recognition, the team evaluated SurgVISTA on more complex surgical understanding tasks. As shown in Fig. 3, SurgVISTA maintains stable and leading performance on action recognition, surgical triplet recognition, and surgical skill assessment. Compared with traditional natural-domain pretrained models, SurgVISTA shows stronger spatial-temporal modeling and task-transfer capabilities, indicating that it learns not only dataset-specific surface patterns but also deeper spatial-temporal semantics and dynamic regularities shared across tasks. These capabilities provide an important technical foundation for intelligent surgical analysis and clinical decision support in real surgical environments.

<img src="/static/img/news/2026_surgvista_fig3.png" alt="Fig. 3. SurgVISTA performance on action recognition, triplet recognition, and skill assessment tasks" style="width: 100%;"/>

Fig. 3 summarizes results beyond surgical workflow recognition. Panel (a) shows surgical action recognition results using accuracy and mean average precision (mAP). Panels (b)-(c) show surgical triplet recognition results measured by triplet mAP and 2-tuple mAP. Panels (d)-(e) show surgical skill assessment results, again using accuracy and mAP.

The study also compared natural-domain pretraining with surgical-domain video pretraining. As shown in Fig. 4, although natural video models can learn generic visual semantics, they remain limited in understanding complex intraoperative dynamics, instrument interactions, and fine-grained anatomical structures. In contrast, through large-scale surgical video pretraining, SurgVISTA more effectively captures instrument motion patterns, tissue dynamics, and long-range temporal dependencies. Across multiple downstream tasks, surgical-domain video pretraining consistently outperforms traditional natural-domain image and video pretraining, further demonstrating the importance of domain-specific video pretraining for intelligent surgical scene understanding.

<img src="/static/img/news/2026_surgvista_fig4.png" alt="Fig. 4. Comparison between SurgVISTA and surgical-domain pretraining methods on surgical workflow recognition datasets" style="width: 100%;"/>

Fig. 4 compares SurgVISTA with different surgical-domain pretraining methods on surgical workflow recognition datasets. Panels (a)-(c) correspond to in-domain testing datasets, while panels (d)-(f) correspond to out-of-domain testing datasets. The evaluation metrics include image-level accuracy, video-level accuracy, phase-level precision, phase-level recall, and phase-level Jaccard, providing a multi-granularity view of model performance.

The team further analyzed how pretraining data scale and the diversity of surgical types affect model performance. As shown in Fig. 5, as the number of pretraining videos and surgical categories increases, performance across **13 downstream surgical datasets** improves steadily. More importantly, large-scale and diverse surgical video data help the model gradually learn deep spatial-temporal semantics shared across procedures, further improving its understanding and generalization in complex intraoperative scenes. This result highlights the value of building large-scale surgical video foundation models.

<img src="/static/img/news/2026_surgvista_fig5.png" alt="Fig. 5. Effect of pretraining data scale on SurgVISTA performance and generalization across 13 surgical datasets" style="width: 100%;"/>

Fig. 5 analyzes the effect of different pretraining data scales on model performance and generalization. Panel (a) shows the distribution of surgical types in progressively constructed pretraining subsets. Panels (b)-(n) report model performance on thirteen surgical datasets under different data scales, together with data volume and proportion distributions. Phase-level Jaccard and image-level accuracy are visualized with dual-axis bar charts: blue bars on the left axis denote phase-level Jaccard, while purple bars on the right axis denote image-level accuracy.

Finally, the team conducted ablation studies on the knowledge distillation mechanism in SurgVISTA. As shown in Fig. 6, image-level knowledge distillation helps the model learn fine-grained anatomical structures and spatial semantics more effectively, thereby improving representation ability in complex intraoperative scenes. The study shows that video-level dynamic modeling and image-level semantic distillation are complementary. Compared with relying only on video reconstruction, knowledge distillation helps preserve both static spatial structures and dynamic temporal information, improving downstream performance and generalization.

<img src="/static/img/news/2026_surgvista_fig6.png" alt="Fig. 6. Ablation analysis of image-level knowledge distillation in SurgVISTA" style="width: 100%;"/>

Fig. 6 evaluates the effectiveness of the knowledge distillation mechanism. Panels (a)-(b) compare SurgVISTA performance with and without knowledge distillation. Using the Wilcoxon signed-rank one-sided test, the results show that expert knowledge distillation consistently improves model performance across different pretraining subsets and downstream datasets. Panels (c)-(d), based on Setting D, qualitatively show reconstruction results, including original video frames, masked inputs, reconstructions with and without knowledge distillation, and corresponding mean squared error (MSE) heatmaps. These results indicate that knowledge distillation better preserves fine-grained anatomical information, substantially reduces reconstruction errors in relevant regions, and improves reconstruction quality and spatial-temporal representation learning.

## Discussion and Outlook

SurgVISTA marks a transition in intelligent surgery from **static image understanding** to **dynamic video-level scene understanding**. Most existing surgical AI systems still rely primarily on static images and therefore lack a full understanding of real intraoperative processes. SurgVISTA is the first model to achieve video-level joint spatial-temporal surgical modeling, enabling simultaneous learning of fine-grained anatomical structures, instrument interactions, and long-range workflow dynamics.

The study also emphasizes that large-scale surgical video data are essential for building general-purpose surgical foundation models. As more surgical types, anatomical structures, and complex intraoperative scenarios are included in pretraining, models can increasingly learn shared spatial-temporal semantics across procedures, leading to stronger performance and generalization. Future progress in intelligent surgical AI will therefore depend heavily on the continued accumulation of large-scale, high-quality surgical video data.

Looking ahead, SurgVISTA provides a general foundation model for next-generation intelligent surgical systems. Beyond achieving leading performance on multiple public benchmarks, it demonstrates strong cross-scenario transfer ability and clinical application potential. Compared with traditional single-task models, video-level surgical foundation models are expected to advance intelligent intraoperative assistance, automated surgical analysis, robotic surgery, and clinical decision support. The team will continue expanding surgical video scale and multimodal capabilities while exploring more general intelligent surgical foundation model systems for real clinical deployment.

---

## Resources

For more details, please see our paper [Large-scale self-supervised video foundation model for intelligent surgery](https://doi.org/10.1038/s41746-026-02403-0) in npj Digital Medicine.

Code is available at [https://github.com/isyangshu/SurgVISTA](https://github.com/isyangshu/SurgVISTA).
