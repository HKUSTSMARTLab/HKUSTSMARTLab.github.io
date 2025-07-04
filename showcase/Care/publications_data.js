// Publication data from Google Spreadsheet
const publicationsData = [
    {
        title: "Mitigating feature bias in dl models for cervical cytology",
        publication: "WIML workshop, NeurIPS",
        year: "2024",
        application: "Mitigating feature bias",
        organ: "Cervix",
        methodology: "Bias-Agnostic and Bias-Mitigating approach",
        data: "CRIC",
        mainResults: "demonnstrated feature bias: high variability in the representation of various features across classes.",
        tasks: "Comprihensive Anlysis"
    },
    {
        title: "Point-of-care digital cytology with artificial intelligence for cervical cancer screening in a resource-limited setting",
        publication: "JAMA network open",
        year: "2021",
        application: "Cervical cancer screening",
        organ: "Cervix",
        methodology: "CNN",
        data: "740 cervical smears",
        mainResults: "a AUC of 0.94, a sensitivity of 95.7% (95% CI, 85.5%-99.5%), and a specificity of 84.7% (95% CI, 80.2%-88.5%)",
        tasks: "WSI Analysis"
    },
    {
        title: "Accuracy and efficiency of deep-learning–based automation of dual stain cytology in cervical cancer screening",
        publication: "Journal of the National Cancer Institute",
        year: "2021",
        application: "Cervical cancer screening",
        organ: "Cervix",
        methodology: "CNN, Inception-v3",
        data: "4253 p16/Ki-67 dual-stained slides",
        mainResults: "Compared with Pap, AI-based DS reduced referral to colposcopy by one-third (41.9% vs 60.1%, P < .001).",
        tasks: "WSI Analysis"
    },
    {
        title: "Deep learning based cervical screening by the cross-modal integration of colposcopy, cytology, and hpv test",
        publication: "International Journal of Medical Informatics",
        year: "2022",
        application: "Cervical cancer screening",
        organ: "Cervix",
        methodology: "Cross-modal integration of colposcopy (saline image, acetic acid image, and iodine image), cytology, and HPV test:\nVGG-16;\nMultivariable logistic regression",
        data: "2160 cases",
        mainResults: "colposcopy(AUC of 0.760 saline, 0.791 acetic acid, and 0.840 iodine, 0.845 combine):\nvisual inspection (AUC= 0.751);\ncytology (AUC=0.749);\nHPV (AUC=0.742);\nCytology-HPV (AUC = 0.837);\nCross-modal (AUC = 0.921)",
        tasks: "Multi-modal"
    },
    {
        title: "Cost-effectiveness of artificial intelligence-assisted liquid-based cytology testing for cervical cancer screening in china",
        publication: "The Lancet Regional Health–Western Pacific",
        year: "2023",
        application: "Find a most cost-effective strategy for cervical cancer screening",
        organ: "Cervix",
        methodology: "Markov modela",
        data: "100,000 cases",
        mainResults: "AI-assisted LBC screening once every 5 years could be more cost-effective than manually-read LBC.",
        tasks: "Comprihensive Anlysis"
    },
    {
        title: "Machine learning-based automated sponge cytology for screening of oesophageal squamous cell carcinoma and adenocarcinoma of the oesophagogastric junction: a nationwide, multicohort, prospective study",
        publication: "The Lancet Gastroenterology & Hepatology",
        year: "2023",
        application: "Screening of oesophageal squamous cell carcinoma and adenocarcinoma of the oesophagogastric junction",
        organ: "Gastrointestinal",
        methodology: "logistic regression, adaptive boosting, light-gradient boosting machine, extreme gradient boosting, random forest,and support vector machine;\n105 cytological and 15 epidemiological features",
        data: "multicohort prospective study (17 498 from 39 tertiary or secondary hospitals in China)",
        mainResults: "AUC=0.960 (95% CI 0.937 to 0.977) and average precision=0.482 (0.470 to 0.494);\nThe model achieved similar performance to consensus of cytologists with AI assistance;\nsensitivity = 94.5% (95% CI 88.8 to 97.5), specificity = 91.9% (91.2 to 92.5);\n90.3% of endoscopies could be avoided",
        tasks: "Comprihensive Anlysis"
    },
    {
        title: "Context-aware text-assisted multimodal framework for cervical cytology cell diagnosis and chatting",
        publication: "IEEE ICME",
        year: "2024",
        application: "Cervical cytology cell classification and chatting",
        organ: "Cervix",
        methodology: "Multimodal Transformer, Context-aware, Large\nLanguage Model, Vicuna-7b",
        data: "39239 cell samples, and 15020 instruction-tuning data",
        mainResults: "F1=87.52， Accuracy=88.40",
        tasks: "Multi-modal"
    },
    {
        title: "Automated report generation for lung cytological images using a cnn vision classifier and multiple-transformer text decoders: preliminary study",
        publication: "arXiv:2403.18151",
        year: "2024",
        application: "Automated report generation",
        organ: "Lung",
        methodology: "Vision encoder:CNN\nText Decoder:Transformer",
        data: "71 benign and 135 malignant pulmonary cytology specimens",
        mainResults: "sensitivity and specificity were\n100% and 96.4% for classification",
        tasks: "Report Generation"
    },
    {
        title: "Effectiveness of data-augmentation on deep learning in evaluating rapid on-site cytopathology at endoscopic ultrasound-guided fine needle aspiration",
        publication: "Scientific reports",
        year: "2024",
        application: "Rapid on‑site cytopathology",
        organ: "Pancreas",
        methodology: "ViT with augmentation (geometric transformation, color space transformation, and kernel fltering)",
        data: "4059  EUS-FNA images with\nDif-Quik stained",
        mainResults: "accuracy=88.2%;\ngeometric transformation was most efective",
        tasks: "Cell Classification"
    },
    {
        title: "Towards the mobile detection of cervical lesions: a region-based approach for the analysis of microscopic images.",
        publication: "IEEE Access",
        year: "2021",
        application: "Mobile detection of cervical lesions",
        organ: "Cervix",
        methodology: "Resnet50 and Mobilenet v2.",
        data: "mobile HFF regions dataset (21 LBC samples) and SIPAKMED",
        mainResults: "mAP of 0.37798, AR of 0.63651",
        tasks: "Cell Classification"
    },
    {
        title: "Assessing the robustness of deep learning-assisted pathological image analysis under practical variables of imaging system",
        publication: "IEEE ICASSP",
        year: "2023",
        application: "Assessing the system robustness",
        organ: "Cervix",
        methodology: "8 convolutional-based structures and  6 transformer-based structures",
        data: "4200 WSIs",
        mainResults: "the deep learning models are sensitive to luminancerelated scanner parameters",
        tasks: "Comprihensive Anlysis"
    },
    {
        title: "Global-local attention network for weakly supervised cervical cytology roi analysis",
        publication: "ISBI",
        year: "2022",
        application: "ROI classification",
        organ: "Cervix",
        methodology: "YOLOv4, LSTM, ViT",
        data: "900 ROIs",
        mainResults: "Acc=73.33",
        tasks: "Cell Classification"
    },
    {
        title: "Is the aspect ratio of cells important in deep learning? a robust comparison of deep learning methods for multi-scale cytopathology cell image classification: from convolutional neural networks to visual transformers",
        publication: "Computers in biology and medicine",
        year: "2022",
        application: "Cell classification",
        organ: "Cervix",
        methodology: "18 CNN and 4 Transformers",
        data: "SIPaKMeD\nHerlev",
        mainResults: "-0.33% accuracy change using scaled SIPaKMeD data;\n+0.33% accuracy change using scaled Herlev data;\ndeep learning models are robust to changes in the aspect ratio of cells in cervical cytopathological images",
        tasks: "Comprihensive Anlysis"
    },
    {
        title: "Decentralized health: federated deep learning for cervical cytology image segmentation",
        publication: "international Conference on Computing, Communication and Learning",
        year: "2024",
        application: "Cervical Cytology Image Segmentation",
        organ: "Cervix",
        methodology: "UNet, UNet++, UNet3+",
        data: "Cx22",
        mainResults: "Dice = 0.95",
        tasks: "Segmentation"
    },
    {
        title: "Digital/computational technology for molecular cytology testing: a short technical note with literature review",
        publication: "Acta Cytologica",
        year: "2021",
        application: "Detect cancer cell and perform molecular analysis",
        organ: "Lung",
        methodology: "U-Net",
        data: "6 cases",
        mainResults: "the system can be connected to full automation by combining digital cytopathology with AI application to detect target cancer cells and to perform molecular analysis",
        tasks: "Frontier Discussion"
    },
    {
        title: "The multimodality cell segmentation challenge: toward universal solutions",
        publication: "Nature Methods",
        year: "2024",
        application: "Cell segmentation",
        organ: "General",
        methodology: "Transformer",
        data: "1,500 labeled images",
        mainResults: "The challenge produced a top-performing Transformer-based deep learning model that outperformed existing methods and generalized well across over 50 diverse microscopy datasets without manual tuning, advancing universal cell segmentation solutions",
        tasks: "Multi-modal"
    },
    {
        title: "Weakly supervised myeloma cells segmentation based on point annotation",
        publication: "BIBM",
        year: "2023",
        application: "Cells Segmentation",
        organ: "Bone marrow",
        methodology: "Transformer",
        data: "SegPC",
        mainResults: "achieves 98% of its fully-supervised performance with only 10 annotated random points per instance",
        tasks: "Segmentation"
    },
    {
        title: "Few-shot cervical cell images instance segmentation based on adversarial training",
        publication: "CCDC",
        year: "2024",
        application: "Cells Instance Segmentation",
        organ: "Cervix",
        methodology: "U-Net, GAN",
        data: "CCEDD",
        mainResults: "Dice=0.92",
        tasks: "Segmentation"
    },
    {
        title: "Examining longitudinal markers of bladder cancer recurrence through a semiautonomous machine learning system for quantifying specimen atypia from urine cytology",
        publication: "Cancer cytopathology",
        year: "2023",
        application: "Examining longitudinal markers of bladder cancer recurrence",
        organ: "Urine",
        methodology: "AutoParis‐X",
        data: "1259 specimens",
        mainResults: "imaging predictors extracted using AutoParis‐X can predict recurrence",
        tasks: "Frontier Discussion"
    },
    {
        title: "Optimizing z-stack plane selection within urothelial clusters in 3d urine cytology via ai to improve bladder cancer screening and surveillance: ongoing multicenter study",
        publication: "Journal of the American Society of Cytopathology",
        year: "2024",
        application: "Bladder Cancer Screening",
        organ: "Urine",
        methodology: "AutoParis‐X",
        data: "44 WSI",
        mainResults: "AI-assisted optimization of Z-stack focal planes in 3D urine cytology enhances diagnostic accuracy for urothelial atypia, potentially improving bladder cancer screening and surveillance.",
        tasks: "Frontier Discussion"
    },
    {
        title: "Accurate and rapid detection of peritoneal metastasis from gastric cancer by ai-assisted stimulated raman molecular cytology",
        publication: "Advanced science",
        year: "2023",
        application: "Detection of Peritoneal Metastasis from Gastric Cancer",
        organ: "Gastrointestinal",
        methodology: "Stardist cell segmentation",
        data: "53 951 exfoliated cells",
        mainResults: "81.5% sensitivity, 84.9% specificity, and the AUC of 0.85, within 20 minutes for each patient",
        tasks: "Frontier Discussion"
    },
    {
        title: "Label‐free virtual peritoneal lavage cytology via deep‐learning‐assisted single‐color stimulated raman scattering microscopy",
        publication: "Advanced Intelligent Systems",
        year: "2024",
        application: "Virtual staining",
        organ: "Peritoneal Lavage",
        methodology: "CyleGAN",
        data: "7319 exfoliated cells of 32 ascites specimens",
        mainResults: "structural similarity of 0.820 ± 0.041;\nclasification:  0.938 accuracy,  0.924 mean average precision, 0.906 AUC",
        tasks: "Virtual Staining"
    },
    {
        title: "Accurate and rapid molecular cytology with transformer-based stimulated raman microscopy",
        publication: "Optics in Health Care and Biomedical Optics XIV",
        year: "2024",
        application: "Detection of Peritoneal Metastasis from Gastric Cancer",
        organ: "Peritoneal Lavage",
        methodology: "Transformer",
        data: "816 stimulated Raman cytology images from 80 locally advanced gastric cancer patients",
        mainResults: "88.89% sensitivity, 86.36% specificity, and an AUC of 0.903",
        tasks: "Frontier Discussion"
    },
    {
        title: "Improving mobile-based cervical cytology screening: a deep learning nucleus-based approach for lesion detection",
        publication: "Applied Sciences",
        year: "2023",
        application: "Cervical cancer screening",
        organ: "Cervix",
        methodology: "SSD",
        data: "nucleus annotations of 31,698 normal squamous cells and 1395 lesions",
        mainResults: "A deep learning model using mobile-acquired cytology images significantly improved lesion detection accuracy in cervical cancer screening, achieving up to 22.9% higher recall and 16.0% higher F1 scores compared to previous methods",
        tasks: "Frontier Discussion"
    },
    {
        title: "Deep learning predicts the 1-year prognosis of pancreatic cancer patients using positive peritoneal washing cytology",
        publication: "Scientific reports",
        year: "2024",
        application: "1‑year prognosis",
        organ: "Pancreas",
        methodology: "ViT and CNN",
        data: "88 specimens",
        mainResults: "0.8056 and 0.8009 AUC;\nViT is better than Kaplan-meier;\nObservation: Intraperitoneal neutrophils may be a novel prognostic marker and therapeutic target for CY-positive patients with pancreatic cancer.",
        tasks: "Frontier Discussion"
    },
    {
        title: "A deep learning framework for predicting endometrial cancer from cytopathologic images with different staining styles",
        publication: "Plos one",
        year: "2024",
        application: "Endometrial cancer screening",
        organ: "Cervix",
        methodology: "channel attention,\nmulti-level semantic supervision",
        data: "H&E-stained and papanicolaou-stained 3,620 positive images and 2,380 negative images",
        mainResults: "an accuracy of 98.50%, a precision of 99.32% and a sensitivity of 97.67%",
        tasks: "WSI Analysis"
    },
    {
        title: "Cytopathology image super-resolution of portable microscope based on convolutional window-integration transformer",
        publication: "IEEE Transactions on Computational Imaging",
        year: "2025",
        application: "Super-Resolution",
        organ: "Cervix",
        methodology: "Transformer",
        data: "239,100 paired portable microscope\nimages and standard microscope images",
        mainResults: "PSNR=30.67, SSIM=0.8372, LPIPS=0.3980",
        tasks: "Super Resolution"
    },
    {
        title: "Predicting tumour origin with cytology-based deep learning: hype or hope?",
        publication: "Nature Reviews Clinical Oncology",
        year: "2024",
        application: "Predicting tumour origin",
        organ: "Pleural and peritoneal effusions",
        methodology: "Researchers developed TORCH",
        data: "90,572 cytological smear images from 76,183 patients across four hospitals in China (2010–2023),4,520 patients from Tianjin Cancer Hospital  12,467 from Yantai Hospital 496 images used to assess pathologist performance with and without AI assistance",
        mainResults: "Achieved AUC scores of 0.953–0.991 for cancer diagnosis.AUC of 0.953–0.979 for tumour origin localization. TORCH significantly improved diagnostic accuracy, especially for junior pathologists",
        tasks: "Frontier Discussion"
    },
    {
        title: "Deep learning‑based cell segmentation for rapid optical cytopathology of thyroid cancer",
        publication: "Scientific reports",
        year: "2024",
        application: "Cell segmentation",
        organ: "Thyroid",
        methodology: "U-Net",
        data: "train: 90 images with 850 cells\ntest: 34 images with 601 cells",
        mainResults: "the model segmented 15.8% more cells than the human operator",
        tasks: "Frontier Discussion"
    },
    {
        title: "Automated adequacy assessment of cervical cytology samples using deep learning",
        publication: "Iberian Conference on Pattern Recognition and Image Analysis",
        year: "2022",
        application: "Adequacy assessment",
        organ: "Cervix",
        methodology: "EfficientDet",
        data: "41 samples with a total of 42387 nuclei annotation",
        mainResults: "AP of 82.4%, Accuracy of 79.8%, Recall of\n73.8% and F1 score of 81.5%",
        tasks: "Comprihensive Anlysis"
    },
    {
        title: "Assessing artificial intelligence enabled liquid-based cytology for triaging hpv-positive women: a population-based cross-sectional study",
        publication: "Acta Obstetricia et Gynecologica Scandinavica",
        year: "2023",
        application: "Cervical cancer screening",
        organ: "Cervix",
        methodology: "multiple instance learning",
        data: "3514 cases",
        mainResults: "sensitivity=86.49%, substantially higher than HPV16/18 typing at detecting CIN2+ (86.49%\nvs 54.05%, P= 0.002).",
        tasks: "WSI Analysis"
    },
    {
        title: "Molecular testing in urinary cytology specimens: current status and future directions",
        publication: "Urologic Oncology: Seminars and Original Investigations. Elsevier",
        year: "2025",
        application: "Enhances bladder cancer detection and monitoring using genetic markers in urine samples.",
        organ: "Urine",
        methodology: "PCR, NGS, FISH, and methylation analysis on urine samples.",
        data: "Urine samples from bladder cancer patients analyzed with molecular tools.",
        mainResults: "Improved detection of high-grade bladder cancer using key genetic markers.",
        tasks: "Frontier Discussion"
    },
    {
        title: "Current role of cytopathology in the molecular and computational era: the perspective of young pathologists",
        publication: "Cancer Cytopathology",
        year: "2024",
        application: "Enhances cancer diagnosis, risk stratification, and personalized treatment through integration with molecular and computational tools.",
        organ: "General",
        methodology: "The paper reviews the integration of next-generation sequencing, digital pathology, and AI into cytopathology to improve diagnostic precision and efficiency.",
        data: "No dataset; it\'s a review based on expert opinions and literature.",
        mainResults: "Cytopathology, when combined with molecular and computational advances, significantly boosts diagnostic accuracy, especially in ambiguous cases, and supports the shift toward precision medicine.",
        tasks: "Frontier Discussion"
    },
    {
        title: "Interpretable pap-smear image retrieval for cervical cancer detection with rotation invariance mask generation deep hashing",
        publication: "Computers in Biology and Medicine",
        year: "2023",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "spatial attention, rotational invariance deep hashing network",
        data: "SIPaKMeD and Mendeley LBC",
        mainResults: "64.85(SIPaKMeD) and 69.81(Mendeley LBC)",
        tasks: "Retrival"
    },
    {
        title: "Diagnostic agreement in whole slide digital images of cervical cytology and cell blocks",
        publication: "Diagnostic Cytopathology",
        year: "2025",
        application: "Diagnostic agreement analysis",
        organ: "Cervix",
        methodology: "",
        data: "82 specimens (41 LBC and 41 Cell block) were evaluated independently by three observers.",
        mainResults: "The overall agreement was 0.463 for all 82 cases including both LBC and cell block;\nAgreement was highest for HSIL, NILM, cancers and lower for borderline (ASC-US, ASC-H)",
        tasks: "Comprihensive Anlysis"
    },
    {
        title: "Are synthetic cytology images ready for prime time? a comparative assessment of real and synthetic urine cytology images",
        publication: "Journal of the American Society of Cytopathology",
        year: "2023",
        application: "Cytology image synthesis",
        organ: "Urine",
        methodology: "conditional StyleGAN3;\nA total of 12 participants were recruited to answer the 60-image survey",
        data: "13,746 images",
        mainResults: "There was no significant difference in diagnostic error rates between real and synthetic images",
        tasks: "Generation"
    },
    {
        title: "Artificial intelligence-driven morphology-based enrichment of malignant cells from body fluid",
        publication: "Modern Pathology",
        year: "2023",
        application: "Enrichment of Malignant Cells",
        organ: "Body fluid",
        methodology: "InceptionV3",
        data: "2,597,910 images",
        mainResults: "a higher sensitivity for detection of tumor fractions and critical somatic variant mutations that were initially at low levels or undetectable in presort patient samples",
        tasks: "Comprihensive Anlysis"
    },
    {
        title: "Validation of ai-assisted thinprep® pap test screening using the geniustm digital diagnostics system",
        publication: "Journal of Pathology Informatics",
        year: "2024",
        application: "Compare AI system with cytologists",
        organ: "Cervix",
        methodology: "validated the Genius™ Digital Diagnostics System (Hologic) by comparing the performance to traditional manual light microscopic diagnosis of ThinPrep® Pap test slides.",
        data: "319 ThinPrep® Pap test cases",
        mainResults: "62.1% vs 55.8%(TBS) \n76.8% vs 71.5%(condensed diagnostic categories)",
        tasks: "Comprihensive Anlysis"
    },
    {
        title: "Multi-modal fusion learning for cervical dysplasia diagnosis",
        publication: "ISBI",
        year: "2019",
        application: "cervical dysplasia diagnosis",
        organ: "Cervix",
        methodology: "Fused Faster R-CNN",
        data: "colposcopic (i.e., acetic and iodine) images and other\nclinical (i.e., Pap and HPV) test results. 995 positive cases\n(HSIL+) and 939 negative cases (normal/LSIL).",
        mainResults: "an average accuracy of 87.4% (88.6% sensitivity and 86.1% specificity)",
        tasks: "Multi-modal"
    },
    {
        title: "Digital cytology combined with artificial intelligence compared to conventional microscopy for anal cytology: a preliminary study",
        publication: "Cytopathology",
        year: "2025",
        application: "Screening of anal precancerous lesions",
        organ: "Anal",
        methodology: "Genius Cervical AI, HOLOGIC Inc., USA",
        data: "124 consecutive anal cytology specimens",
        mainResults: "The AI system detected more cases of\nhigher severity compared to the conventional cytology",
        tasks: "Cell Classification"
    },
    {
        title: "Computational technology with artificial intelligence and machine learning: what should a cytologist do with it?",
        publication: "Acta Cytologica",
        year: "2021",
        application: "Explores how AI and machine learning can support cytologists in diagnosis, workflow efficiency, and precision medicine.",
        organ: "General",
        methodology: "A perspective-based editorial reviewing historical and current computational tools in cytology, highlighting the evolution from early digital imaging to modern AI-driven systems.",
        data: "No dataset",
        mainResults: "AI and ML offer transformative potential for cytology, but their success depends on thoughtful integration, standardization, and collaboration between technologists and cytologists.",
        tasks: "Frontier Discussion"
    },
    {
        title: "Is it real or not? toward artificial intelligence-based realistic synthetic cytology image generation to augment teaching and quality assurance in pathology",
        publication: "Journal of the American Society of Cytopathology",
        year: "2022",
        application: "Cytology image synthesis",
        organ: "Urine",
        methodology: "StyleGAN3",
        data: "1000 malignant urothelial\ncytology image",
        mainResults: "Generate realistic, morphologically diverse examples of malignant urine cytology images",
        tasks: "Generation"
    },
    {
        title: "Evaluating image quality and reproducibility of digital scanners for whole-slide imaging in urine cytology slides for artificial intelligence applications",
        publication: "Journal of the American Society of Cytopathology",
        year: "2023",
        application: "Evaluating Image Quality and Reproducibility of Digital Scanners",
        organ: "Urine",
        methodology: "Each resulting WSI was evaluated by a senior cytologist for image quality",
        data: "20 urine cytology slides",
        mainResults: "Cytopreparation: Cytospin, ThinPrep-non-GYN, ThinPrep-UroCyte, and SurePath;\nScanners:Roche DP200, DP600, and Hamamatsu Nanozoomer S360;\nScan mode: default, manual, and advanced manual",
        tasks: "Comprihensive Anlysis"
    },
    {
        title: "Development of an artificial intelligence model for classifying major cell types in peritoneal washings from patients with ovarian high-grade serous carcinoma",
        publication: "Journal of the American Society of Cytopathology",
        year: "2022",
        application: "Classifying Major Cell Types",
        organ: "Peritoneal Washings",
        methodology: "Trained a deep learning model on labeled peritoneal washing images to classify key cell types.",
        data: "31,066 cell annotations",
        mainResults: "The AI model accurately classified major cell types in peritoneal washings from ovarian cancer patients, achieving high performance and demonstrating potential to assist cytologists in diagnosis.",
        tasks: "Cell Classification"
    },
    {
        title: "Developing a deep learning approach for label-free isolation and enrichment of cancer cells in body fluids for cytological and molecular analysis",
        publication: "Journal of the American Society of Cytopathology",
        year: "2021",
        application: "Isolation and Enrichment of Cancer Cells",
        organ: "Body fluid",
        methodology: "ConvNet",
        data: "20 body fluid samples",
        mainResults: "achieving purities of 60-85% in the final sorted sample",
        tasks: "Frontier Discussion"
    },
    {
        title: "An evaluation of cell-type specific artificial intelligence algorithms in adenocarcinoma in situ in papanicolaou tests",
        publication: "Journal of the American Society of Cytopathology",
        year: "2022",
        application: "Diagnosis of adenocarcinoma in situ",
        organ: "Cervix",
        methodology: "QuPath",
        data: "70 cases",
        mainResults: "AUC=0.847;classify the AIS cases with good accuracy",
        tasks: "Cell Classification"
    },
    {
        title: "Exploring the efficacy of an artificial intelligence model for fungal screening in bronchoalveolar lavage cytology specimens",
        publication: "Journal of the American Society of Cytopathology",
        year: "2024",
        application: "Fungal Screening",
        organ: "Bronchoalveolar Lavage",
        methodology: "Trained a deep learning model to detect fungi in lavage cytology images.",
        data: "12 silver-stained CytoSpin slide",
        mainResults: "accuracy is 64.58%",
        tasks: "Cell Classification"
    },
    {
        title: "Total abnormal cells in bladder cancer screening: the role of artificial intelligence-based logistic models in urine cytology",
        publication: "Journal of the American Society of Cytopathology",
        year: "2022",
        application: "Bladder Cancer Screening",
        organ: "Urine",
        methodology: "AIxURO, Logistic Regression Models",
        data: "2,025 cytology slide images (471 positives and 1,554 negatives)",
        mainResults: "AI-based logistic models significantly improved the accuracy of detecting total abnormal cells in urine cytology, enhancing bladder cancer screening performance.",
        tasks: "Cell Classification"
    },
    {
        title: "How does artificial intelligence redefine n:c ratio thresholds for diagnosing high-grade urothelial carcinoma?",
        publication: "Journal of the American Society of Cytopathology",
        year: "2022",
        application: "Redefine N:C Ratio Thresholds",
        organ: "Urine",
        methodology: "AIxURO",
        data: "109 patients",
        mainResults: "A lower N:C ratio cut-off between 0.65-0.68 in addition to considering nuclear area as a criterion, may be more predictive of HGUC than the current >0.7 TPS algorithm.",
        tasks: "Comprihensive Anlysis"
    },
    {
        title: "Deep learning algorithm for malignant pleural fluids cytology",
        publication: "Journal of the American Society of Cytopathology",
        year: "2022",
        application: "Detecting metastatic pulmonary cancers.",
        organ: "Pleural and peritoneal effusions",
        methodology: "Inception ResNet v2",
        data: "583 WSIs",
        mainResults: "The AI model, using YOLOv11, accurately classified mesothelial and adenocarcinoma cells in pleural fluid cytology with an IoU score of 0.72, outperforming earlier models and supporting improved diagnostic precision in malignant pleural effusions",
        tasks: "Cell Classification"
    },
    {
        title: "Validation of a deep-learning-based algorithm for risk stratification and diagnosis of bladder cancer in digital urine cytology",
        publication: "Journal of the American Society of Cytopathology",
        year: "2022",
        application: "Risk Stratification and Diagnosis of Bladder Cancer",
        organ: "Urine",
        methodology: "Trained AI on urine cytology images; applied logistic regression.",
        data: "104 WSIs",
        mainResults: "sensitivity=91.2%\naccuracy=97.1%",
        tasks: "Comprihensive Anlysis"
    },
    {
        title: "Diagnostic performance of the hologic genius digital diagnostics system for low-grade squamous intraepithelial lesion (lsil) thinprep papanicolaou tests",
        publication: "Journal of the American Society of Cytopathology",
        year: "2025",
        application: "Cervical cancer screening",
        organ: "Cervix",
        methodology: "Hologic Genius Digital Diagnostic System",
        data: "146 LSIL cases",
        mainResults: "Kendall’s W coefficient was 0.792 with strong agrement among cytopathologists",
        tasks: "Comprihensive Anlysis"
    },
    {
        title: "Implications of chatgpt for cytopathology and recommendations for updating jasc guidelines on the responsible use of artificial intelligence",
        publication: "Journal of the American Society of Cytopathology",
        year: "2023",
        application: "Explores how generative AI like ChatGPT can support education, research, and documentation in cytopathology.",
        organ: "General",
        methodology: "A perspective and policy-focused review analyzing current AI tools and proposing updates to professional guidelines.",
        data: "No formal dataset",
        mainResults: "Recommends cautious, transparent, and ethical use of generative AI in cytopathology, emphasizing human oversight and the need to update JASC guidelines accordingly",
        tasks: "LLM"
    },
    {
        title: "Usage of artificial intelligence in understanding gynecologic cytopathology reports: an exploratory study",
        publication: "Journal of the American Society of Cytopathology",
        year: "2023",
        application: "Simplify gynecologic cytopathology reports",
        organ: "Cervix",
        methodology: "Six board-certified pathologists",
        data: "180 evaluations",
        mainResults: "ChatGPT",
        tasks: "LLM"
    },
    {
        title: "Whole slide level ai classification for bladder cancer in urine cytology with largest dataset yields high accuracy results",
        publication: "Journal of the American Society of Cytopathology",
        year: "2023",
        application: "Classification for Bladder Cancer",
        organ: "Urine",
        methodology: "CLAM",
        data: "4,711 whole slide images from 200 institutes",
        mainResults: "0.99 AUC, 0.97 Accuracy",
        tasks: "WSI Analysis"
    },
    {
        title: "Let it shine: autofluorescence of papanicolaou-stain improves AI-based cytological oral cancer detection",
        publication: "Computers in Biology and Medicine",
        year: "2025",
        application: "Oral cancer detection",
        organ: "Oral",
        methodology: "Co-Attention Fusion Network(CAFNet)",
        data: "Public dataset: 766565 images in 4 classes",
        mainResults: "CAFNet achieved an accuracy of 91.79% and an F1-score of 83.34%.",
        tasks: "Cell Classification"
    },
    {
        title: "A lightweight xAI approach to cervical cancer classification",
        publication: "Medical & Biological Engineering & Computing",
        year: "2024",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "CNN",
        data: "Public dataset: 963 images in 4 classes",
        mainResults: "The model reached an accuracy of 97.50%.",
        tasks: "Cell Classification"
    },
    {
        title: "Cervical cancer classification from pap smear images using deep convolutional neural network models",
        publication: "Interdisciplinary Sciences: Computational Life Sciences",
        year: "2024",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "13 pre-trained CNN",
        data: "Herlev",
        mainResults: "DenseNet-201 obtained an accuracy of 87.02% and a recall of 63.41%.",
        tasks: "Cell Classification"
    },
    {
        title: "An attention-based deep learning for acute lymphoblastic leukemia classification",
        publication: "Scientific Reports",
        year: "2024",
        application: "Leukemia detection",
        organ: "Bone marrow",
        methodology: "Deep Dilated Residual Convolutional Neural Network (DDRNet)",
        data: "Blood Cell Images (From Kaggle)",
        mainResults: "The model achieved an accuracy of 91.98% and an F1-score of 96.00%",
        tasks: "Cell Classification"
    },
    {
        title: "Deep integrated fusion of local and global features for cervical cell classification",
        publication: "Computers in Biology and Medicine",
        year: "2024",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "CNN + Transformer blocks + DIFF blocks",
        data: "Sipakmed, CRIC, Herlev",
        mainResults: "Accuracy results across datasets: SIPaKMeD – 96.02%, CRIC – 85.06%, Herlev – 94.55%.",
        tasks: "Cell Classification"
    },
    {
        title: "Classification of acute myeloid leukemia by pre-trained deep neural networks: A comparison with different activation functions",
        publication: "Medical Engineering & Physics",
        year: "2025",
        application: "Leukemia detection",
        organ: "Bone marrow",
        methodology: "VGG16, Inception V3, ResNet50v2 (With different activation functions)",
        data: "ASH Image Bank",
        mainResults: "VGG16 with SELU activation achieved 92.83% accuracy; InceptionV3 with GELU reached 94.02%; ResNet50v2 with GELU attained 92.53%.",
        tasks: "Cell Classification"
    },
    {
        title: "Engineered feature embeddings meet deep learning: A novel strategy to improve bone marrow cell classification and model transparency",
        publication: "Journal of Pathology Informatics",
        year: "2024",
        application: "Hematological diseases detection",
        organ: "Bone marrow",
        methodology: "Xception and ResNet50 (With region-attention embedding )",
        data: "An Expert-Annotated Dataset of Bone Marrow Cytology in Hematologic Malignancies (Bone-Marrow-Cytomorphology MLL Helmholtz Fraunhofer)",
        mainResults: "Xception with region-attention embedding achieved an F1-score of 0.56, while ResNet50 with the same embedding scored 0.54.",
        tasks: "Cell Classification"
    },
    {
        title: "Transferable automatic hematological cell classification: Overcoming data limitations with self-supervised learning",
        publication: "Computer Methods and Programs in Biomedicine",
        year: "2025",
        application: "Hematological diseases detection",
        organ: "Bone marrow",
        methodology: "XCiT: cross-covariance image transformer",
        data: "One punlic bone marrow dataset: Matek bone marrow (BM) dataset; three peripheral blood datasets: Matek, Acevedo, and Raabin blood datasets",
        mainResults: "Transfer learning achieved 64–63% accuracy from bone marrow to blood smears, and 42% in reverse.",
        tasks: "Cell Classification"
    },
    {
        title: "Improving the generalizability of white blood cell classification with few-shot domain adaptation",
        publication: "Journal of Pathology Informatics",
        year: "2024",
        application: "Hematological diseases detection",
        organ: "Peripheral blood",
        methodology: "EfficientNet",
        data: "10 public datasets: Barcelona, Jiangxi Tecom, Jin Woo Choi, BCCD, LISC, Munich 2021, Munich 2019, Raabin, JSLH, Tianjin",
        mainResults: "After fine tune, accuracy is higher than 0.8 for each target dataset",
        tasks: "Cell Classification"
    },
    {
        title: "Enhancing advanced cervical cell categorization with cluster-based intelligent systems by a novel integrated CNN approach with skip mechanisms and GAN-based augmentation",
        publication: "Scientific Reports",
        year: "2024",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "CNN",
        data: "SIPaKMeD (with Generative Adversarial Networks augmentation)",
        mainResults: "The model achieved an accuracy of 98.08%.",
        tasks: "Cell Classification"
    },
    {
        title: "A hybrid approach based on multipath Swin transformer and ConvMixer for white blood cells classification",
        publication: "Health Information Science and Systems",
        year: "2024",
        application: "Hematological diseases detection",
        organ: "Bone marrow",
        methodology: "Swin Transformer and ConvMixer based Multipath mixer (SC-MP-Mixer)",
        data: "3 public datasets: BCCD, PBC, Raabin",
        mainResults: "On the BCCD, PBC, and Raabin datasets, the model achieved accuracies of 95.66%, 99.65%, and 98.68%, respectively.",
        tasks: "Cell Classification"
    },
    {
        title: "Efficient leukocytes detection and classification in microscopic blood images using convolutional neural network coupled with a dual attention network",
        publication: "Computers in Biology and Medicine",
        year: "2024",
        application: "Hematological diseases detection",
        organ: "Bone marrow",
        methodology: "DCGAN based data augmentation; MobileNetV2 with dual attention technique followed by region proposed network",
        data: "3 public datasets: PBC, LISC, Raabin",
        mainResults: "On the PBC, Raabin, and LISC datasets, the model achieved accuracies of 99.83%, 99.60%, and 99.35%, respectively.",
        tasks: "Cell Classification"
    },
    {
        title: "Comprehensive data analysis of white blood cells with classification and segmentation by using deep learning approaches",
        publication: "Cytometry Part A – the Journal of Quantitative Cell Science",
        year: "2024",
        application: "Hematological diseases detection",
        organ: "Bone marrow",
        methodology: "CNN",
        data: "CellaVision, Raabin, Kaggle blood cell images dataset, LISC, Blood cell detection (BCD) dataset",
        mainResults: "The model achieved an accuracy of 97.27%.",
        tasks: "Cell Classification"
    },
    {
        title: "Evaluation of deep learning training strategies for the classification of bone marrow cell images",
        publication: "Computer Methods and Programs in Biomedicine",
        year: "2024",
        application: "Hematological diseases detection",
        organ: "Bone marrow",
        methodology: "VGG, ResNet, RegNet, VisionTransformer (ViT)",
        data: "3 public datasets: Bone marrow cell dataset,Comparison detector (CD) dataset, PatchCamelyon (PCam) dataset",
        mainResults: "RegNet achieved its best performance with an accuracy of 78.7% ± 6.0%.",
        tasks: "Cell Classification"
    },
    {
        title: "Deep learning model for differentiating acute myeloid and lymphoblastic leukemia in peripheral blood cell images via myeloblast and lymphoblast classification",
        publication: "Digital Health",
        year: "2024",
        application: "Hematological diseases detection",
        organ: "Bone marrow",
        methodology: "EfficientNet",
        data: "Private dataset: 42386 images in 12 classes",
        mainResults: "The model achieved an accuracy of 88.58% and an F1-score of 73.61%.",
        tasks: "Cell Classification"
    },
    {
        title: "An efficient fusion-purification network for cervical pap-smear image classification",
        publication: "Computer Methods and Programs in Biomedicine",
        year: "2024",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "End-to-end fusion-purification model termed FPNC",
        data: "SIPaKMeD and CCID (private dataset with 148762 images in 15 classes)",
        mainResults: "On SIPaKMeD and CCID datasets, the model achieved accuracies of 95.90% and 99.38%, respectively.",
        tasks: "Cell Classification"
    },
    {
        title: "ReRNet: A Deep Learning Network for Classifying Blood Cells",
        publication: "Technology in Cancer Research & Treatment",
        year: "2023",
        application: "Hematological diseases detection",
        organ: "Bone marrow",
        methodology: "ResNet50-based ensemble of randomized neural networks (ReRNet)",
        data: "Public Kaggle dataset: Blood Cell Images",
        mainResults: "The model achieved an accuracy of 99.97%.",
        tasks: "Cell Classification"
    },
    {
        title: "Developing a Tuned Three-Layer Perceptron Fed with Trained Deep Convolutional Neural Networks for Cervical Cancer Diagnosis",
        publication: "Diagnostics",
        year: "2023",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "VGG, ResNet and a multi-layer perceptron neural (MLP) network",
        data: "Herlev, SIPaKMeD",
        mainResults: "On the Herlev and SIPaKMeD datasets, the model achieved accuracies of 97.65% and 99.71%, respectively.",
        tasks: "Cell Classification"
    },
    {
        title: "White Blood Cells Classification Using Entropy-Controlled Deep Features Optimization",
        publication: "Diagnostics",
        year: "2023",
        application: "Hematological diseases detection",
        organ: "Bone marrow",
        methodology: "DarkNet53, DenseNet201",
        data: "WBC",
        mainResults: "The model achieved an accuracy of 99.60%.",
        tasks: "Cell Classification"
    },
    {
        title: "Equilibrium Optimization Algorithm with Ensemble Learning Based Cervical Precancerous Lesion Classification Model",
        publication: "Healthcare",
        year: "2022",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "The EOEL-PCLCCI, uses a DenseNet-264 feature extractor, EO hyperparameter optimizer, and weighted voting classifier.",
        data: "Herlev",
        mainResults: "The model achieved an accuracy of 98.94%.",
        tasks: "Cell Classification"
    },
    {
        title: "Cervical cell multi-classification algorithm using global context information and attention mechanism",
        publication: "Tissue and Cell",
        year: "2022",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "L-PCNN: ResNet-50 with a pyramid pooling layer and a long short-term memory module (LSTM)",
        data: "SIPaKMeD",
        mainResults: "The model achieved an accuracy of 98.89%, with sensitivity of 99.90%, specificity of 99.80%, and F-measure of 99.89%.",
        tasks: "Cell Classification"
    },
    {
        title: "High precision cervical precancerous lesion classification method based on ConvNeXt",
        publication: "Bioengineering",
        year: "2023",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "ConvNeXt",
        data: "Deep Cervical Cytological Levels (DCCL) dataset",
        mainResults: "The model achieved an accuracy of 63.08% and an F1-score of 62.82%.",
        tasks: "Cell Classification"
    },
    {
        title: "Using deep DenseNet with cyclical learning rate to classify leukocytes for leukemia identification",
        publication: "Frontiers in Oncology",
        year: "2023",
        application: "Hematological diseases detection",
        organ: "Bone marrow",
        methodology: "DenseNet-161 with cyclical learning rate",
        data: "BCCD",
        mainResults: "The model achieved an accuracy of 99.80%.",
        tasks: "Cell Classification"
    },
    {
        title: "A new weighted deep learning feature using particle swarm and ant lion optimization for cervical cancer diagnosis on Pap smear images",
        publication: "Diagnostics",
        year: "2023",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "Support Vector Machine",
        data: "Herlev",
        mainResults: "The model achieved an accuracy of 98.90%.",
        tasks: "Cell Classification"
    },
    {
        title: "Explainable CAD system for classification of acute lymphoblastic leukemia based on a robust white blood cell segmentation",
        publication: "Cancers",
        year: "2023",
        application: "Hematological diseases detection",
        organ: "Bone marrow",
        methodology: "ResNet-50",
        data: "Leukemia Dataset, CellaVision , JTSC , SMC_ID (Blood_Seg), Raabin, ALL_IDB2",
        mainResults: "The model achieved an accuracy of 99.90%.",
        tasks: "Cell Classification"
    },
    {
        title: "Accurate deep learning model using semi-supervised learning and Noisy Student for cervical cancer screening in low magnification images",
        publication: "PLoS One",
        year: "2023",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "EfficientNet",
        data: "Private dataset: 56996 in 2 classes",
        mainResults: "The model achieved an accuracy of 87.3%, F1-score of 83.3%, and AUC of 0.908.",
        tasks: "Cell Classification"
    },
    {
        title: "Leukocytes classification for leukemia detection using quantum inspired deep feature selection",
        publication: "Cancers",
        year: "2023",
        application: "Hematological diseases detection",
        organ: "Bone marrow",
        methodology: "DarkNet53, DenseNet201 and Quantum Inspired Evolutionary Algorithm",
        data: "Dataset generated from a public dataset using convolutional generative adversarial network: 5000 images in 5 classes",
        mainResults: "The model achieved an accuracy and F1-score of 99.8%.",
        tasks: "Cell Classification"
    },
    {
        title: "Leukocyte subtype classification with multi-model fusion",
        publication: "Medical & Biological Engineering & Computing",
        year: "2023",
        application: "Hematological diseases detection",
        organ: "Bone marrow",
        methodology: "ResNet",
        data: "Private dataset: 11102 images in 11 classes",
        mainResults: "The model achieved 97.03% ± 0.05% accuracy, 96.76% ± 0.05% sensitivity, 99.65% ± 0.05% specificity, and 96.54% ± 0.05% precision.",
        tasks: "Cell Classification"
    },
    {
        title: "Hybrid loss-constrained lightweight convolutional neural networks for cervical cell classification",
        publication: "Sensors",
        year: "2022",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "CNNs with a hybrid loss function",
        data: "SIPaKMeD",
        mainResults: "ShuffleNetV2, DenseNet-121, and GhostNet achieved accuracies of 96.18%, 96.79%, and 96.39%, respectively.",
        tasks: "Cell Classification"
    },
    {
        title: "A multi-task feature fusion model for cervical cell classification",
        publication: "IEEE journal of biomedical and health informatics",
        year: "2022",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "Neural Discriminative Dimensionality Reduction-CNN",
        data: "SIPaKMeD and a private dataset called HUSTC with 70197 in 5 classes",
        mainResults: "In the HUSTC dataset, the model achieved 99.82% sensitivity and 98.12% specificity.",
        tasks: "Cell Classification"
    },
    {
        title: "ALNett: A cluster layer deep convolutional neural network for acute lymphoblastic leukemia classification",
        publication: "Computers in Biology and Medicine",
        year: "2022",
        application: "Leukemia detection",
        organ: "Bone marrow",
        methodology: "ALNett",
        data: "ISBI 2019 dataset",
        mainResults: "Training accuracy was 99.73%, testing accuracy was 91.13%, and F1-score was 96.00%.",
        tasks: "Cell Classification"
    },
    {
        title: "A content-based image retrieval system for the diagnosis of lymphoma using blood micrographs: An incorporation of deep learning with a traditional learning approach",
        publication: "Computers in Biology and Medicine",
        year: "2022",
        application: "Lymphoma cell detection",
        organ: "Lymph",
        methodology: "ResNet-101",
        data: "A pubilc dataset: 1326 images in 4 classes",
        mainResults: "The model achieved an overall accuracy of 98.25% and an average precision of 98.74%.",
        tasks: "Cell Classification"
    },
    {
        title: "HiCervix: An extensive hierarchical dataset and benchmark for cervical cytology classification",
        publication: "IEEE transactions on medical imaging",
        year: "2024",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "HierSwin: Swin Transformer with hierarchical classification",
        data: "HiCervix: a public dataset with 40229 images in 26 classes",
        mainResults: "The model achieved 92.08% accuracy for coarse-level classification and 82.93% average accuracy across all three levels.",
        tasks: "Cell Classification"
    },
    {
        title: "Self-supervised learning using diverse cell images for cervical cancer\nclassification",
        publication: "Measurement",
        year: "2025",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "Self-supervised learning",
        data: "CytoImageNet, Cell Image Library (CIL), Cell Tracking Benchmark (CTB), Human Protein Atlas (HPA), LIVECell, EVICAN, CEM500K",
        mainResults: "The model achieved an accuracy of 97.63%.",
        tasks: "Cell Classification"
    },
    {
        title: "Exploring foundation models fine-tuning for cytology classification",
        publication: "Image and Video Processing",
        year: "2024",
        application: "Cytological classification",
        organ: "General",
        methodology: "CLIP,  QUILT, BiomedCLIP, UNI, ViT",
        data: "Body Cavity Fluid Cytology (BCFC), Mendeley LBC Cervical Cancer (MLCC), SIPaKMeD, HiCervix",
        mainResults: "Average accuracy across four datasets: CLIP – 83.59%, QUILT – 86.15%, BiomedCLIP – 81.32%, UNI – 88.91%, ViT – 85.72%.",
        tasks: "Cell Classification"
    },
    {
        title: "Computer-aided diagnosis tool for cervical cancer screening with weakly supervised localization and detection of abnormalities using adaptable and explainable classifier",
        publication: "Medical Image Analysis",
        year: "2021",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "CNN with a loss called classification under regression constraint",
        data: "Herlev",
        mainResults: "The model achieved 66.8% accuracy in severity classification, 95.2% in normal/abnormal classification, 87.0% KAPPA score, 80.4% in weakly supervised localization, and 66.1% in general abnormal cell detection.",
        tasks: "Cell Classification"
    },
    {
        title: "SCKansformer: Fine-grained classification of bone marrow cells via Kansformer backbone and hierarchical attention mechanisms",
        publication: "IEEE Journal of Biomedical and Health Informatics",
        year: "2024",
        application: "Hematological diseases detection",
        organ: "Bone marrow",
        methodology: "SCKansformer",
        data: "A private dataset called BMCD-FGCD with 92335 images in 39 classes",
        mainResults: "The model achieved an accuracy of 83.23% and an F1-score of 84.34%.",
        tasks: "Cell Classification"
    },
    {
        title: "Cervical cell classification using multi-scale feature fusion and channel-wise cross-attention",
        publication: "IEEE 20th International Symposium on Biomedical Imaging (ISBI)",
        year: "2023",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "Multi-head channelwise cross-attention",
        data: "SIPaKMeD, Herlev and Motic,",
        mainResults: "SIPaKMeD: 97.46%±0.30 accuracy, Herlev: 97.67% ± 0.20 accuracy, Motic: 93.01 accuracy.",
        tasks: "Cell Classification"
    },
    {
        title: "CervixFuzzyFusion for cervical cancer cell image classification",
        publication: "Biomedical Signal Processing and Control",
        year: "2023",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "A novel cervix feature fusion method (CFF) that fuses the features of the pre-trained DenseNet201 and vision transformer",
        data: "SIPaKMeD",
        mainResults: "The model achieved an accuracy of 96.13%.",
        tasks: "Cell Classification"
    },
    {
        title: "CAM-VT: A Weakly supervised cervical cancer nest image identification approach using conjugated attention mechanism and visual transformer",
        publication: "Computers in Biology and Medicine",
        year: "2023",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "Conjugated Attention Mechanism and Visual Transformer (CAM-VT)",
        data: "A private dataset with 3931 images in 5 classes and 2 pubilc datasets: Hematoxylin, Eosin",
        mainResults: "The top 5 and top 10 positive probability values for cervical nests were 97.36% and 96.84%, respectively.",
        tasks: "Cell Classification"
    },
    {
        title: "Improving cervical cancer classification with imbalanced datasets combining taming transformers with T2T-ViT",
        publication: "Multimedia Tools and Applications",
        year: "2022",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "Tokens-to-Token Vision Transformers (T2T-ViT)",
        data: "The liquid-based cytology Pap smear dataset, SIPaKMeD, Herlev",
        mainResults: "On the liquid-based cytology Pap smear dataset, SIPaKMeD, and Herlev, the model achieved accuracies of 98.79%, 99.58%, and 99.88%, respectively.",
        tasks: "Cell Classification"
    },
    {
        title: "A comparative analysis of deep learning models for automated cross-preparation diagnosis of multi-cell liquid Pap smear images",
        publication: "Diagnostics",
        year: "2022",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "CNNs, CNN with autoencoder (AE)",
        data: "A private dataset ThinPrep Pap dataset with 230 images in 4 classes and a public dataset SurePath dataset",
        mainResults: "AE-CNN achieved 96.54% accuracy on the SurePath dataset; ResNet101 achieved 92.65% on the ThinPrep Pap dataset.",
        tasks: "Cell Classification"
    },
    {
        title: "BO-ALLCNN: Bayesian-based optimized CNN for acute lymphoblastic leukemia detection in microscopic blood smear images",
        publication: "Sensors",
        year: "2022",
        application: "Leukemia detection",
        organ: "Bone marrow",
        methodology: "Bayesian-based optimized CNNs",
        data: "ALL-IDB1 and the ALL-IDB2",
        mainResults: "The optimal model achieved 100% accuracy, sensitivity, and specificity in detecting ALL on the test set.",
        tasks: "Cell Classification"
    },
    {
        title: "DeepCyto: a hybrid framework for cervical cancer classification by using deep feature fusion of cytology images",
        publication: "Mathematical Biosciences and Engineering",
        year: "2022",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "XceptionNet, VGG16, VGG19, ResNet50 with 2 proposed workflows",
        data: "Herlev, Sipakmed, LBC",
        mainResults: "Best performance in 20 epochs: Herlev – 97.95%, SIPaKMeD – 99.71%, LBC – 100%.",
        tasks: "Cell Classification"
    },
    {
        title: "Comparison of fine-tuned deep convolutional neural networks for the automated classification of lung cancer cytology images with integration of additional classifiers",
        publication: "Asian Pacific Journal of Cancer Prevention",
        year: "2022",
        application: "Lung cancer detection",
        organ: "Lung",
        methodology: "AlexNet, GoogLeNet, VGG16 and ResNet50 with different machine learning classifiers",
        data: "A private dataset with 298 images in 3 classes",
        mainResults: "Classification accuracies: AlexNet – 74.0%, GoogLeNet – 66.8%, VGG16 – 76.8%, ResNet50 – 74.0%.",
        tasks: "Cell Classification"
    },
    {
        title: "Deep learning-based classification of cancer cells in leptomeningeal metastasis using cytomorphologic features of cerebrospinal fluid",
        publication: "Frontiers in Oncology",
        year: "2022",
        application: "Leptomeningeal disease detection",
        organ: "Brain",
        methodology: "CNN",
        data: "A private dataset with 53255 images in 5 classes (used to train CNN1) and a private dataset with 8499 images in 4 classes(Used to train CNN2)",
        mainResults: "CNN1 matched expert-level accuracy; CNN2 exceeded expert accuracy by 10% and was three times faster.",
        tasks: "Cell Classification"
    },
    {
        title: "LeuFeatx: Deep learning–based feature extractor for the diagnosis of acute leukemia from microscopic images of peripheral blood smear",
        publication: "Computers in Biology and Medicine",
        year: "2022",
        application: "Hematological diseases detection",
        organ: "Bone marrow",
        methodology: "VGG16",
        data: "AML Morphology Dataset, PBS-HCB, ALL_IDB2",
        mainResults: "The model achieved 96.15% accuracy on the ALL_IDB2 dataset.",
        tasks: "Cell Classification"
    },
    {
        title: "Deep convolutional neural network-based classification of cancer cells on cytological pleural effusion images",
        publication: "Modern Pathology",
        year: "2022",
        application: "Lung cancer detection",
        organ: "Lung",
        methodology: "Deep convolutional neural network (DCNN) with weakly supervised learning",
        data: "A private dataset with 2465606 images in 2 classes",
        mainResults: "The model achieved 91.67% accuracy, 87.50% sensitivity, and 94.44% specificity.",
        tasks: "Cell Classification"
    },
    {
        title: "A screening assistance system for cervical cytology of squamous cell atypia based on a two-step combined CNN algorithm with label smoothing",
        publication: "Cancer Medicine",
        year: "2022",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "YOLOv4 and ResNeSt",
        data: "Randomly selected from cases of Pap tests performed at Sapporo Medical University between 2015 and 2018",
        mainResults: "The model achieved average accuracy and F-measure of 90.5% and 70.5%, respectively.",
        tasks: "Cell Classification"
    },
    {
        title: "Is the aspect ratio of cells important in deep learning? A robust comparison of deep learning methods for multi-scale cytopathology cell image classification: From convolutional neural networks to visual transformers",
        publication: "Computers in Biology and Medicine",
        year: "2022",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "CNNs",
        data: "SIPaKMeD, Herlev",
        mainResults: "The study evaluated 22 different model performances.",
        tasks: "Cell Classification"
    },
    {
        title: "Urine cell image recognition using a deep-learning model for an automated slide evaluation system",
        publication: "BJU International",
        year: "2022",
        application: "Urothelial cancer detection",
        organ: "Kidney",
        methodology: "EfficientNetB6, Arcface",
        data: "A private dataset with 4637 images in 2 classes",
        mainResults: "The ROC AUC was 0.99 (95% CI: 0.98–0.99), with 95% accuracy, 97% sensitivity, and 95% specificity.",
        tasks: "Cell Classification"
    },
    {
        title: "CytoNet: an efficient dual attention based automatic prediction of cancer sub-types in cytology studies",
        publication: "Scientific Reports",
        year: "2024",
        application: "Cancer detection",
        organ: "General",
        methodology: "Efficient-Net with Dual Attention Module (DAM)",
        data: "A private thyroid carcinomas dataset with 1400 images in 2 classes and Mendeley Cervical dataset",
        mainResults: "The model achieved 99% accuracy on the thyroid dataset; on the Mendeley Cervical dataset, precision was 99.2%, recall 98.5%, and F1-score 97.7%.",
        tasks: "Cell Classification"
    },
    {
        title: "Convolutional neural network classification of cancer cytopathology images: taking breast cancer as an example",
        publication: "ICMVA \'24: Proceedings of the 2024 7th International Conference on Machine Vision and Applications",
        year: "2024",
        application: "Breast cancer detection",
        organ: "Breast",
        methodology: "CNNs",
        data: "BreakHis dataset",
        mainResults: "Accuracy exceeded 92% across all four magnification coefficients.",
        tasks: "Cell Classification"
    },
    {
        title: "Cervical cancer diagnosis based on multi-domain features using deep learning enhanced by handcrafted descriptors",
        publication: "Applied Sciences",
        year: "2023",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "MobileNet, ShuffleNet and ResNet-18",
        data: "Mendeley LBC Pap Smear Slides Dataset",
        mainResults: "The best configuration achieved 100% accuracy.",
        tasks: "Cell Classification"
    },
    {
        title: "Automated bone marrow cytology using deep learning to generate a histogram of cell types",
        publication: "Communications Medicine",
        year: "2022",
        application: "Leukemia detection",
        organ: "Bone marrow",
        methodology: "CNNs",
        data: "A private dataset with 26782 annotated objects in 19 classes",
        mainResults: "The system achieved 97% accuracy and 0.99 ROC AUC in region detection, 0.75 mAP, 0.78 F1-score, and 0.31 log-average miss rate in cell detection/classification.",
        tasks: "Cell Classification"
    },
    {
        title: "Enhancing cervical cancer detection and robust classification through a fusion of deep learning models",
        publication: "Scientific Reports",
        year: "2024",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "Alexnet, Resnet-101, Resnet-152, InceptionV3",
        data: "SIPaKMeD",
        mainResults: "ResNet152 achieved an accuracy of 98.08%.",
        tasks: "Cell Classification"
    },
    {
        title: "Label credibility correction based on cell morphological differences for cervical cells classification",
        publication: "Scientific Reports",
        year: "2025",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "Label credibility correction (LCC-Net)",
        data: "Herlev and a private dataset with 58,326 images in 5 classes",
        mainResults: "The method achieved 92.41% accuracy in 2-class and 85.98% in 5-class tasks.",
        tasks: "Cell Classification"
    },
    {
        title: "Classification of cervical cancer using Dense CapsNet with Seg-UNet and denoising autoencoders",
        publication: "Scientific Reports",
        year: "2024",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "Dense CapsNet and data augmentation methods Multi-modal GANs model",
        data: "SIPaKMeD",
        mainResults: "The model achieved an accuracy of 99.65%.",
        tasks: "Cell Classification"
    },
    {
        title: "Enhancing advanced cervical cell categorization with cluster-based intelligent systems by a novel integrated CNN approach with skip mechanisms and GAN-based augmentation",
        publication: "Scientific Reports",
        year: "2024",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "CNN and data augmentation methods GANs",
        data: "SIPaKMeD",
        mainResults: "The model achieved 99.11% accuracy, 98.698% precision, 98.635% recall, and 98.478% F1-score.",
        tasks: "Cell Classification"
    },
    {
        title: "MSCCNet: Multi-scale convolution-capsule network for cervical cell classification",
        publication: "IEEE international conference on bioinformatics and biomedicine (BIBM)",
        year: "2023",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "MSCCNet, the cross-layer attention-based feature fusion module is used to obtain multi-scale discriminative features",
        data: "SIPaKMeD and a private dataset DSCC",
        mainResults: "MSCCNet achieved 87.88% accuracy on DSCC and 97.90% on SIPaKMeD.",
        tasks: "Cell Classification"
    },
    {
        title: "Medical knowledge guided intra-specimen reference network for cervical cell classification",
        publication: "IEEE 20th International Symposium on Biomedical Imaging (ISBI)",
        year: "2023",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "Intra-specimen reference network (IsrNet) and CNNs",
        data: "A private dataset with 634129 images in 3 classes",
        mainResults: "The best configuration achieved 94.91% accuracy and 93.04% F1-score.",
        tasks: "Cell Classification"
    },
    {
        title: "Channel spatial collaborative attention network for fine-grained classification of cervical cells",
        publication: "Neural Information Processing",
        year: "2022",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "CNNs with channel spatial collaborative attention (CSCA) model",
        data: "Herlev, SIPaKMeD and a private dataset named LTCCD with 10,294 images in 5 classes",
        mainResults: "CSCA-ResNet50 achieved 98.76% accuracy on SIPaKMeD.",
        tasks: "Cell Classification"
    },
    {
        title: "Disentanglement of content and style features in multi-center cytology images via contrastive self-supervised learning",
        publication: "Biomedical Signal Processing and Control",
        year: "2024",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "ResNet-50 with a dual-branch feature decoupling network",
        data: "2 private datasets, one with a total of 350,006 images and the other with a total of 674,849 images",
        mainResults: "The model achieved an average accuracy of 80.4%.",
        tasks: "Cell Classification"
    },
    {
        title: "Cervical cell classification based on attention mechanism and multi-resolution feature fusion",
        publication: "International Conference on Information Science, Parallel and Distributed Systems (ISPDS)",
        year: "2022",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "ViT with Attention Mechanism and Multi-resolution Feature Fusion Module (AMFM),",
        data: "A private dataset with 4000 images in 4 classes",
        mainResults: "Compared to the baseline, accuracy improved by 3.93% and AUC increased by 0.022.",
        tasks: "Cell Classification"
    },
    {
        title: "Deep reinforcement learning for efficient digital Pap smear analysis",
        publication: "Computation",
        year: "2023",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "ResNet50",
        data: "A dataset obtained from the bachelor’s thesis of Topapanta with 100 images in 2 classes and a private dataset with 963 images in 4 classes",
        mainResults: "Classification accuracies: HSIL – 89.88%, LSIL – 92.27%, NILM – 98.51%, SCC – 83.40%.",
        tasks: "Cell Classification"
    },
    {
        title: "HiAt-Net: A novel three-layered encoder-decoder with hierarchical attention for classifying cervical cancer with cytology images",
        publication: "International Conference on Intelligent Systems and Advanced Applications (ICISAA)",
        year: "2024",
        application: "Cervical cancer classification",
        organ: "Cervix",
        methodology: "Novel three-layered encoder-decoder with hierarchical attention",
        data: "Private research dataset",
        mainResults: "The model achieved strong performance in HSIL+ detection, with 95.2% accuracy, an AUC of 0.98, and a sensitivity of 96.5% for HSIL/SCC cases.",
        tasks: "Cell Classification"
    },
    {
        title: "Parallel classification of cells in thinprep cytology test image for cervical cancer screening",
        publication: "Cancer Prevention Through Early Detection",
        year: "2022",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "ResNet with a parallel classification framework",
        data: "A Patch-level private dataset with 7734 images in 3 classes and 2 private Subject-Level dataset including one with 308 subjects in 2 classes (Dataset-1) while the other with 328 in 2 classes (Dataset-2)",
        mainResults: "Patch-level AUC was 0.9121 ± 0.0115; subject-level AUCs were 0.8297 (Acc=69.48%) and 0.8065 (Acc=51.83%) for Dataset-1 and Dataset-2, respectively.",
        tasks: "Cell Classification"
    },
    {
        title: "MaxCerVixT: A novel lightweight vision transformer-based Approach for precise cervical cancer detection",
        publication: "Knowledge-Based Systems",
        year: "2024",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "Multi-Axis Vision Transformer (MaxViT)",
        data: "SIPaKMeD, Mendeley LBC dataset",
        mainResults: "The model achieved 99.02% accuracy on SIPaKMeD and 99.48% on LBC.",
        tasks: "Cell Classification"
    },
    {
        title: "Multi-scale window transformer for cervical cytopathology image recognition",
        publication: "Computational and Structural Biotechnology Journal",
        year: "2024",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "Multi-scale Window Transformer (MWT)",
        data: "Two private multi-center cervical cell classification datasets of two-category 192,123 images (ten cohorts) and four-category 174,138 images (seven cohorts).",
        mainResults: "Internal test accuracies: 96.1% (2-category), 89.1% (4-category).",
        tasks: "Cell Classification"
    },
    {
        title: "MASKED-AP: Attention pyramid convolutional neural network with mask for cervical cell classification",
        publication: "IEEE International Conference on Acoustics, Speech and Signal Processing (ICASSP)",
        year: "2023",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "CNNs with Masked-AP model",
        data: "LDCC: 17476 images in 5 classes",
        mainResults: "The method achieved 74.11% accuracy, 74.11% recall, 74.19% precision, and 74.07% F1-score.",
        tasks: "Cell Classification"
    },
    {
        title: "HematoNet: Expert-level classification of bone marrow cytology morphology in hematological malignancy with deep learning",
        publication: "Artificial Intelligence in the Life Sciences",
        year: "2022",
        application: "Hematological diseases detection",
        organ: "Bone marrow",
        methodology: "CoAtNet, ResNext2, EfficientNetV2",
        data: "Matek",
        mainResults: "CoAtNet model outperformed both of the other models",
        tasks: "Cell Classification"
    },
    {
        title: "CVM-Cervix: A hybrid cervical Pap-smear image classification framework using CNN, visual transformer and multilayer perceptron",
        publication: "Pattern Recognition",
        year: "2022",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "CNN for local features and a Visual Transformer for global features. An MLP then merges them for classification.",
        data: "CRIC, SIPaKMeD",
        mainResults: "The model achieved 91.72% accuracy, 91.70% F1-score, 91.60% recall, and 91.80% precision.",
        tasks: "Cell Classification"
    },
    {
        title: "MSHT: multi-stage hybrid transformer for the ROSE image analysis of pancreatic cancer",
        publication: "IEEE Journal of Biomedical and Health Informatics",
        year: "2023",
        application: "Pancreatic cancer detection",
        organ: "Pancreas",
        methodology: "Multi-stage hybrid Transformer (MSHT)",
        data: "A private dataset with 4240 images in 2 classes",
        mainResults: "The model achieved 95.68% classification accuracy with improved attention regions.",
        tasks: "Cell Classification"
    },
    {
        title: "MSENet: Mean and standard deviation based ensemble network for cervical cancer detection",
        publication: "Engineering Applications of Artificial Intelligence",
        year: "2023",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "Mean and Standard Deviation-based Ensemble Network (MSENet)",
        data: "SIPaKMeD",
        mainResults: "Using 5-fold cross-validation, the model achieved 97.21% accuracy.",
        tasks: "Cell Classification"
    },
    {
        title: "DCGAN-based cytology image augmentation for cervical cancer cell classification using transfer learning",
        publication: "Procedia Computer Science",
        year: "2025",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "CNNs with Deep Convolutional Generative Adversarial Network",
        data: "A private dataset with 419 images in 3 classes",
        mainResults: "The model achieved 96% accuracy with Xception and MobileNet, and 94% with ResNet50V2.",
        tasks: "Cell Classification"
    },
    {
        title: "Analysing cerebrospinal fluid with explainable deep learning: From diagnostics to insights",
        publication: "Neuropathology and Applied Neurobiology",
        year: "2023",
        application: "Cerebrospinal fluid analysis",
        organ: "Brain",
        methodology: "CNN",
        data: "A public dataset with 123,181 digitised cerebrospinal fluid objects",
        mainResults: "Mean AUC 97.3%",
        tasks: "Cell Classification"
    },
    {
        title: "Deep learning-based computational cytopathologic diagnosis of metastatic breast carcinoma in pleural fluid",
        publication: "Cells",
        year: "2023",
        application: "Metastatic Breast Carcinoma detection",
        organ: "Breast",
        methodology: "Inception-ResNet-V2",
        data: "A private dataset with 207,037 images in 2 classes",
        mainResults: "The model surpassed pathologists with higher accuracy (81.1% vs. 68.7%), sensitivity (95.0% vs. 72.5%), and specificity (98.6% vs. 88.9%).",
        tasks: "Cell Classification"
    },
    {
        title: "An intelligent neural network model to detect red blood cells for various blood structure classification in microscopic medical images",
        publication: "Heliyon",
        year: "2024",
        application: "Red blood cells identified",
        organ: "Peripheral blood",
        methodology: "RCNN",
        data: "Kaggle public dataset with 12,500 augmented microscopic images of different types of blood cells in JPEG format",
        mainResults: "Training accuracy reaching 99.06% and testing accuracy at 91.21%",
        tasks: "Detection"
    },
    {
        title: "WBC YOLO-ViT: 2 Way - 2 stage white blood cell detection and classification with a combination of YOLOv5 and vision transformer",
        publication: "Computers in Biology and Medicine",
        year: "2024",
        application: "White blood cell detection",
        organ: "Bone marrow",
        methodology: "A hybrid architecture that combines the strengths of YOLO and ViT",
        data: "A private dataset with 4445 labeled blood cell images in 16 classes",
        mainResults: "Acc=96.49%",
        tasks: "Detection"
    },
    {
        title: "A task decomposing and cell comparing method for cervical lesion cell detection",
        publication: "IEEE Transactions on Medical Imaging",
        year: "2022",
        application: "Cervical lesion cells detection",
        organ: "Cervix",
        methodology: "TDCC-Net framework",
        data: "A private dataset with 6935 images with 22054 annotation boxes in 5 classes",
        mainResults: "AP=25.6, AP.5=47.7, AP.75=25.5, AR=51.1",
        tasks: "Detection"
    },
    {
        title: "Cervical glandular cell detection from whole slide image with out-of-distribution data",
        publication: "arXiv:2205.14625",
        year: "2024",
        application: "Cervical glandular cell detection",
        organ: "Cervix",
        methodology: "PolarNet: obtains a polar attention score matrix by computing the self-attention inside the eight-neighbor of features",
        data: "A private dataset with 14861 images",
        mainResults: "Incorporating PolarNet improved top-20 GC detection accuracy on external WSIs by 8.8%, with a 14.4-second increase in computation time.",
        tasks: "Detection"
    },
    {
        title: "Holistic and historical instance comparison for cervical cell detection",
        publication: "IEEE International Conference on Bioinformatics and Biomedicine (BIBM)",
        year: "2024",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "CNNs, RoI-level Instance Comparison (RIC), Class-level Instance Comparison (CIC)",
        data: "2 private datasets CC-L and CC-S containing 39,006 and 17,301 images and the CC-L dataset contains 114,513 box annotations",
        mainResults: "Achieved AP50 gains of 13.8% and 11.3% over the baseline with ResNet50 and ResNet101, respectively.",
        tasks: "Detection"
    },
    {
        title: "Exploring contextual relationships for cervical abnormal cell detection",
        publication: "IEEE Journal of Biomedical and Health Informatics",
        year: "2023",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "Double-Head Faster R-CNN, RoI-relationship attention module (RRAM) and global RoI attention module (GRAM)",
        data: "Cervical Cell Detection (CCD) dataset: consisting of 40,000 images with 194,880 object instance bounding boxes",
        mainResults: "With multi-scale training as in Deformable DETR, our method achieves 34.2 AP, surpassing all general and cervical cell detectors.",
        tasks: "Detection"
    },
    {
        title: "Sample hardness based gradient loss for long-tailed cervical cell detection",
        publication: "MICCAI",
        year: "2022",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "CNNs with Gradient Libra Loss",
        data: "CCA-LT dataset",
        mainResults: "Achieved much higher (7.8%) mAP than that trained using crossentropy classification loss",
        tasks: "Detection"
    },
    {
        title: "Distillation of multi-class cervical lesion cell detection via synthesis-aided pre-training and patch-level feature alignment",
        publication: "Neural Networks",
        year: "2024",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "CNNs with Balanced Pre-training Model (BPM), Score Correction Loss (SCL) and Patch Correlation Consistency (PCC)",
        data: "ComparisonDetector dataset and a private dataset called DST with 3807 images",
        mainResults: "ComparisonDetector achieves APs of 24.6, 44.7, and 23.6, with an AR of 46.6; DST achieves APs of 15.4, 26.3, and 16.5, with an AR of 45.1.",
        tasks: "Detection"
    },
    {
        title: "Scac: A semi-supervised learning approach for cervical abnormal cell detection",
        publication: "IEEE Journal of Biomedical and Health Informatics",
        year: "2024",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "CNNs with Global Attention Feature Pyramid Network (GAFPN), semi-supervised learning",
        data: "Tianchi dataset, ComparisonDetector dataset and a private unlabled cervical abnormal cell dataset comprising 3092 WSIs",
        mainResults: "Under best configuration, AP=29.4, AP50=51.5, AP75=29.5",
        tasks: "Detection"
    },
    {
        title: "An improved yolov5s based on transformer backbone network for detection and classification of bronchoalveolar lavage cells",
        publication: "Computational and Structural Biotechnology Journal",
        year: "2023",
        application: "Lung biopsy pathology",
        organ: "Lung",
        methodology: "Yolov5s, Transformer",
        data: "BALF dataset",
        mainResults: "Achieve mAP of 81.29% and Recall of 80.47%",
        tasks: "Detection"
    },
    {
        title: "From wsi-level to patch-level: structure prior guided binuclear cell fine-grained detection",
        publication: "Medical Image Analysis",
        year: "2023",
        application: "Leukemia detection",
        organ: "Bone marrow",
        methodology: "CNNs",
        data: "A private dataset with 11,188 images in 4 classes",
        mainResults: "Under best configuration, AP=0.798, AP50=0.959, Recall50=0.933",
        tasks: "Detection"
    },
    {
        title: "Ma-det: A discriminative morphology-aware detector for cervical lesion cell clumps",
        publication: "ICASSP",
        year: "2025",
        application: "Cervical lesion detection",
        organ: "Cervix",
        methodology: "Morphology-aware detector with adaptive features and global context",
        data: "CDetector dataset",
        mainResults: "mAP = 64.8%, +2.2% over YOLOv7 with fewer parameters (30.7M vs. 34.8M)",
        tasks: "Detection"
    },
    {
        title: "Interpretable detector for cervical cytology using self-attention and cell origin group guidance",
        publication: "Engineering Applications of Artificial Intelligence",
        year: "2024",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "Dual-stream self-attention based feature fusion and origin grouping network (DSA-FFOGNet)",
        data: "A private dataset contains 4765 images with 11,401 annotated boxes in 4 classes",
        mainResults: "Many comparisons under different configurations are shown in this article",
        tasks: "Detection"
    },
    {
        title: "Abnormal region detection in cervical smearimages based on fully convolutional network",
        publication: "IET Image Processing",
        year: "2019",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "Size-sensitive fully convolutional network (R-FCN)",
        data: "A private dataset with 62 images",
        mainResults: "An average precision of 93.2% is achieved for abnormal region detection in cervical smear images",
        tasks: "Detection"
    },
    {
        title: "Detection of cervical cancer cells in complex situation based on improved yolov3 network",
        publication: "Multimedia Tools and Applications",
        year: "2022",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "YOLOv3: a third-generation derivative network derived from the development and optimization of the YOLO network",
        data: "Herlev and a private dataset of Beijing Jiaotong University",
        mainResults: "Achieves mAP of 78.87%",
        tasks: "Detection"
    },
    {
        title: "Detection of cervical lesion cell based on the difference of context cells",
        publication: "Neurocomputing",
        year: "2025",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "GLFLC-Net: the backbone with FPN, the region proposal network (RPN), the proposed Global–Local Feature Fusion Detection Head and the Local Features Contrastive Auxiliary Head",
        data: "A private dataset contains 28974 images with 48626 annotated abnormal cervical cell bounding boxes",
        mainResults: "Achieves an AP of 50.7%",
        tasks: "Detection"
    },
    {
        title: "Detection of cervical lesion cell/clumps based on adaptive feature extraction",
        publication: "Bioengineering",
        year: "2024",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "AFE-Net (built upon YOLOv7)",
        data: "CDetector",
        mainResults: "Achieves the mean Average Precision (mAP) of 64.8%",
        tasks: "Detection"
    },
    {
        title: "Dpd-net: dual-path proposal discriminative network for abnormal cell detection in cervical cytology images",
        publication: "Biomedical Signal Processing and Control",
        year: "2024",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "CNNs",
        data: "CLBC, CRIC",
        mainResults: "In CLBC: mAP=13.28, F1=34.05; In CRIC: mAP=35.17, F1=58.35",
        tasks: "Detection"
    },
    {
        title: "Robust cervical abnormal cell detection via distillation from local-scale consistency refinement",
        publication: "MICCAI",
        year: "2023",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "FPN, Patch Correction Network(PCN), Classification Ranking Loss",
        data: "A private dataset with 3761 images",
        mainResults: "AP=51.1, AP.5=86.6, AP.75=54.3, AR=62.5",
        tasks: "Detection"
    },
    {
        title: "LFANet: Lightweight feature attention network for abnormal cell segmentation in cervical cytology images",
        publication: "Computers in Biology and Medicine",
        year: "2022",
        application: "Cervical cancer screening",
        organ: "Cervix",
        methodology: "Lightweight Feature Attention Network (LFANet) with depth-wise separable convolution, residual connections, and feature layer attention module",
        data: "Four public datasets (Including Herlev)",
        mainResults: "State-of-the-art segmentation accuracy for nucleus/cytoplasm with low computational complexity",
        tasks: "Segmentation"
    },
    {
        title: "Semantic segmentation of low magnification effusion cytology images: A semi-supervised approach",
        publication: "Computers in Biology and Medicine",
        year: "2022",
        application: "Effusion malignancy detection",
        organ: "Pleural and peritoneal effusions",
        methodology: "Extended MixMatch & FixMatch with reverse augmentation for semantic segmentation",
        data: "Labelled 10X & unlabelled 4X cytology images (internal dataset)",
        mainResults: "Average F-score improvement ≈9% for 4X images; 62% sub-regions eliminated from high-mag scanning",
        tasks: "Segmentation"
    },
    {
        title: "HVS-Unsup: Unsupervised cervical cell instance segmentation method based on human visual simulation",
        publication: "Computers in Biology and Medicine",
        year: "2024",
        application: "Cervical cancer diagnosis",
        organ: "Cervix",
        methodology: "HVS-Unsup with NEM, MAS modules, CW-droploss, self-training, prior knowledge integration",
        data: "MS-cellSeg, Cx22, ISBI2015",
        mainResults: "AJI 53.59% (cytoplasm), Recall 87.97% on MS-cellSeg; SOTA on Cx22 & ISBI2015",
        tasks: "Segmentation"
    },
    {
        title: "Automatic segmentation and classification of Papanicolaou-stained cells",
        publication: "Computers in Biology & Medicine",
        year: "2024",
        application: "Oral cancer detection",
        organ: "Oral",
        methodology: "CNN (DenseNet-169 + LinkNet with temperature scaling)",
        data: "UFRGS Pap-OMD dataset (52 patients, 1,563 images) + 5 public cervical datasets",
        mainResults: "Expert-level performance (ICC), robust cross-dataset segmentation/classification, most diverse oral mucosa dataset",
        tasks: "Segmentation"
    },
    {
        title: "Oral epithelial cell segmentation from fluorescent multichannel cytology images using deep learning",
        publication: "Computer Methods and Programs in Biomedicine",
        year: "2022",
        application: "Oral cancer detection",
        organ: "Oral",
        methodology: "U-Net; Modified U-Net; ResNet-34; InceptionV3; Artefact-Net",
        data: "2730 multichannel fluorescent images (MAA:2364, SNA-1:366)",
        mainResults: "U-Net/modified U-Net: IoU=0.73-0.76 (SEC IoU=0.79); Artefact-Net classification F1=0.96",
        tasks: "Segmentation"
    },
    {
        title: "CNN-based joint segmentation and quantification of nuclei and NORs in AgNOR-stained images",
        publication: "Computer Methods and Programs in Biomedicine",
        year: "2023",
        application: "Early oral cancer detection",
        organ: "Oral",
        methodology: "DenseNet-169 + LinkNet with Focal Loss; Semi-automatic annotation; Overlapping nuclei exclusion",
        data: "AgECOM dataset (public): 1,171 images from 48 patients",
        mainResults: "Dice=0.90, IoU=0.84; Nuclei precision=0.94/recall=0.90; AgNORs precision=0.82/recall=0.74; ICC=0.91 (nuclei)/0.81 (AgNORs)",
        tasks: "Segmentation"
    },
    {
        title: "Artificial intelligence-driven morphology-based enrichment of malignant cells from body fluid",
        publication: "Modern Pathology",
        year: "2023",
        application: "Malignant cell enrichment for molecular analysis",
        organ: "Pleural and peritoneal effusions",
        methodology: "Microfluidic sorting + InceptionV3 CNN + morphology analysis",
        data: "37 patient samples (34 UCLA + commercial sources)",
        mainResults: "Increased tumor fraction detection sensitivity (including low-level variants), validated by WGS & targeted sequencing",
        tasks: "Segmentation"
    },
    {
        title: "Sparse Cascade: Multi-stage cascade fusion and shape dictionary guided network for segmentation of microscopic cytology images",
        publication: "Neurocomputing",
        year: "2025",
        application: "Microscopic cytology image segmentation",
        organ: "General",
        methodology: "MSCF architecture with SCG branch, Cascade Mask R-CNN-based",
        data: "EmbryCell (private), ISBI2014 (public)",
        mainResults: "Bbox mAP: +2.51% (EmbryCell), +3.92% (ISBI2014); Segmentation mAP: +2.82%, +4.70%",
        tasks: "Segmentation"
    },
    {
        title: "Dual supervised sampling networks for real-time segmentation of cervical cell nucleus",
        publication: "Computational and Structural Biotechnology Journal",
        year: "2022",
        application: "Cervical nucleus segmentation",
        organ: "Cervix",
        methodology: "DSSNet (Dual-Supervised Sampling Network), supervised down-sampling module + W-NECK residual blocks + boundary detection",
        data: "TJ_sparse, TJ_dense (private), Mendeley-LBC, ISBI2014, DIC-HeLa datasets",
        mainResults: "5× faster inference speed than UNet with comparable accuracy (mIoU 80.2%)",
        tasks: "Segmentation"
    },
    {
        title: "A deep learning approach for automated cytoplasm and nuclei cervical segmentation",
        publication: "Biomedical Signal Processing and Control,",
        year: "2023",
        application: "Cervical cancer screening",
        organ: "Cervix",
        methodology: "EfficientNet + Feature Pyramid Network (FPN)",
        data: "Herlev dataset (917 images, normal/abnormal)",
        mainResults: "F1=0.91, IoU=0.85, Precision=0.91, Recall=0.92, Specificity=0.96 (class average, 5-fold cross-validation)",
        tasks: "Segmentation"
    },
    {
        title: "Dual supervised sampling networks for real-time segmentation of cervical cell nucleus",
        publication: "Computational and Structural Biotechnology Journal",
        year: "2022",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "Dual-supervised sampling network (DSSNet) with supervised down-sampling module, wide-bottleneck residual blocks, boundary detection supervision",
        data: "Private datasets (TJ_sparse, TJ_dense), Mendeley-LBC, ISBI2014, DIC–HeLa",
        mainResults: "5× faster inference speed than UNet with comparable accuracy (mIoU 72–82%)",
        tasks: "Segmentation"
    },
    {
        title: "Adaptive shape prediction model (ASPM) for touched and overlapping cell segmentation in cytology images",
        publication: "Software Impacts",
        year: "2023",
        application: "Touched and overlapping cell segmentation in cytology images",
        organ: "Cervix",
        methodology: "Adaptive Shape Prediction Model (Contour-based + shape-based deformation with Procrustes transformation & morphological operations)",
        data: "Cervical cells dataset (ISBI 2014 challenge): synthetic images with varying overlapping degrees",
        mainResults: "Dice=0.85, TPp=0.81, FPp=0.003; Efficient low-complexity model; Fails on unclear cluster boundaries",
        tasks: "Segmentation"
    },
    {
        title: "Liquid-based cytological diagnosis of pancreatic neuroendocrine tumors using hyperspectral imaging and deep learning",
        publication: "EngMedicine",
        year: "2025",
        application: "Pancreatic neuroendocrine tumors detection",
        organ: "Pancreas",
        methodology: "HSI + ResNet18 CNN",
        data: "EUS-FNA/FNB-derived LBC images (29 PanNETs, 23 benign cases)",
        mainResults: "HSI group achieved AUCs 0.9981/0.9815 with accuracies 94.92%/93.19%, outperforming RGB (89.85%/80.63%)",
        tasks: "Segmentation"
    },
    {
        title: "Segmentation of multiple myeloma plasma cells in microscopy images with noisy labels",
        publication: "arXiv:2111.05125v1",
        year: "2021",
        application: "Multiple Myeloma plasma cell segmentation",
        organ: "Bone marrow",
        methodology: "Mask R-CNN, HTC, SCNet with ResNet/ResNeSt backbones; Heavy augmentation; Model ensemble",
        data: "SegPC-2021 dataset (498 train, 277 test images)",
        mainResults: "mIoU=0.9389 on final test set",
        tasks: "Segmentation"
    },
    {
        title: "DES-SAM: distillation-enhanced semantic SAM for cervical nuclear segmentation with box annotation",
        publication: "MICCAI",
        year: "2022",
        application: "Cervical nuclear segmentation",
        organ: "Cervix",
        methodology: "SAM-based self-distillation prompting + Multi-scale Lightweight Detection + Edge-aware Enhanced Loss",
        data: "CNSeg dataset (124k nuclei) + 2014 ISBI Challenge (16 EDF + 945 synthetic images)",
        mainResults: "DICE=83.58% (ClusterSeg), PQ=70.16% (ClusterSeg), 83.98% DICE on 2014ISBI test",
        tasks: "Segmentation"
    },
    {
        title: "LIDACS: a lightweight domain adaptive cell segmentation framework",
        publication: "AIMLR(Asia Conference on AI, Machine Learning)",
        year: "2023",
        application: "Multiple myeloma diagnosis via cell instance segmentation",
        organ: "Bone marrow",
        methodology: "Three-stage hierarchical framework with SSL+SL, GDCA augmentation, Mask R-CNN/HTC backbones",
        data: "SegPC-2021 dataset: 132 fully + 366 partially annotated training images, 277 test images",
        mainResults: "0.9505 mIoU on SegPC-2021 (SOTA), 19.55% parameters of 1st-place ensemble model",
        tasks: "Segmentation"
    },
    {
        title: "Combination of image enhancement and U-Net architecture for cervical cell semantic segmentation",
        publication: "JITE",
        year: "2024",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "U-Net + CLAHE + Adaptive Gamma Correction + Median Filter + Data Augmentation",
        data: "Herlev dataset (917 images)",
        mainResults: "Accuracy=89%, IoU=78%, RMSE≈20%, Precision=89%, Recall=89%, F1-score=88.67%",
        tasks: "Segmentation"
    },
    {
        title: "Accurate cervical tumor cell segmentation and classification from overlapping clumps in pap smear images",
        publication: "Proceedings of the NIELIT\'s International Conference on Communication, Electronics and Digital Technology",
        year: "2023",
        application: "Cervical cancer detection and stage classification",
        organ: "Cervix",
        methodology: "SVM, RF, ECNN",
        data: "Pap smear test images",
        mainResults: "ECNN: Acc=92%; RF: Acc=87%; SVM: Acc=90%",
        tasks: "Segmentation"
    },
    {
        title: "ACNet: enhancing occlusion awareness and multi-scale feature capture for cervical cell segmentation",
        publication: "International Conference on Bioinformatics and Biomedicine (BIBM)",
        year: "2024",
        application: "Cervical cancer early screening",
        organ: "Cervix",
        methodology: "ACNet framework (EDS, FRM, SEM, PSM modules) with Cascade Mask R-CNN backbone",
        data: "Two occlusion cytology image datasets",
        mainResults: "Superior segmentation performance on occluded/multi-scale cells compared to SOTA",
        tasks: "Segmentation"
    },
    {
        title: "An enhanced mask transformer for overlapping cervical cell segmentation based on DETR",
        publication: "IEEE Access",
        year: "2024",
        application: "Overlapping cervical cell segmentation",
        organ: "Cervix",
        methodology: "Enhanced Mask Transformer (DETR-based) with dynamic anchor box initialization, noised GT box embedding",
        data: "ISBI2014 (810 synthetic + 8 real test images), ISBI2015 (9 real test images)",
        mainResults: "ISBI2014: DSC=0.974, TPRp=0.971 (SOTA +3.4% DSC, +2% TPRp, +1.88% FNRo). ISBI2015: Metrics surpass averaged SOTA.",
        tasks: "Segmentation"
    },
    {
        title: "Artificial intelligence role in subclassifying cytology of thyroid follicular neoplasm",
        publication: "Asian Pacific Journal of Cancer Prevention",
        year: "2023",
        application: "Subclassification of Bethesda IV thyroid cytology",
        organ: "Thyroid",
        methodology: "CNN",
        data: "43 cases (886 cytology images)",
        mainResults: "Acc=78%, Sensitivity=88.4%, Specificity=64%, AUC=0.87 for adenoma/carcinoma subclassification",
        tasks: "Segmentation"
    },
    {
        title: "Mask guidance pyramid network for overlapping cervical cell edge detection",
        publication: "Applied Sciences",
        year: "2023",
        application: "Cervical cancer cell edge detection",
        organ: "Cervix",
        methodology: "Mask-guided pyramid network (MGP-Net) with MGM and RAM modules, edge consistency loss",
        data: "Not specified",
        mainResults: "Outperformed existing edge detection methods in accuracy",
        tasks: "Segmentation"
    },
    {
        title: "Automated cervical cytology image cell segmentation using enhanced MultiResUNet with DCT and spectral domain attention mechanisms",
        publication: "IEEE Access",
        year: "2024",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "Enhanced MultiResUNet with DCT and spectral domain attention",
        data: "Cx22, ISBI 2014, CCEDD",
        mainResults: "Cytoplasm: Dice=94.5%; Nucleus: Dice=81.1% (4% improvement)",
        tasks: "Segmentation"
    },
    {
        title: "A deep neural network for cervical cell classification based on cytology images",
        publication: "IEEE Access",
        year: "2022",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "Deep convolutional neural network (DeepCELL) with multi-size kernels and dilated convolutions",
        data: "Public datasets: Herlev (917 images, 7 classes), SIPaKMeD (4,049 images, 5 classes)",
        mainResults: "Accuracy=95.628%, Precision=95.685%, Recall=95.647%, F-score=95.636% on SIPaKMeD; high performance on Herlev",
        tasks: "Segmentation"
    },
    {
        title: "Background subtraction approach to unsupervised cell segmentation: toward excluding spurious features in degraded cytology slides",
        publication: "IEEE 20th International Symposium on Biomedical Imaging (ISBI)",
        year: "2023",
        application: "Cell segmentation for cytological diagnosis",
        organ: "Oral",
        methodology: "U-Net-based unsupervised model with low-rank & sparse decomposition, nuclear norm, ℓ2,1 norm, TV regularization",
        data: "ISBI 2014 dataset (45 train/valid, 90 test); Oral cytology images (6,897 from 31 subjects)",
        mainResults: "Achieved 93.2% mean DSC for cell detection (comparable to supervised methods); successfully removed spurious background features in oral cytology",
        tasks: "Segmentation"
    },
    {
        title: "Explainable cad system for classification of acute lymphoblastic leukemia",
        publication: "Cancers",
        year: "2023",
        application: "Acute Lymphoblastic Leukemia (ALL) classification",
        organ: "Bone marrow",
        methodology: "U-Net + image processing segmentation + Modified ResNet-50 + Grad-CAM XAI",
        data: "6 databases (Leukemia Dataset, CellaVision, JTSC, BloodSeg, Raabin_WBC, ALL_IDB2) Total 2,823 images",
        mainResults: "IoU=0.91 (segmentation), Acc=99.9% (classification), Grad-CAM confirmed nucleus focus",
        tasks: "Segmentation"
    },
    {
        title: "Cell instance segmentation using z-stacks in digital cytology",
        publication: "IEEE 19th International Symposium on Biomedical Imaging (ISBI)",
        year: "2022",
        application: "Cell instance segmentation in cytology for diagnosis",
        organ: "Bladder",
        methodology: "Modified ResNet backbone with SOLO",
        data: "CISD (3911 samples)",
        mainResults: "SOLO achieves F1=0.946, IoU=0.947; 86% faster processing with Z-stack inputs",
        tasks: "Segmentation"
    },
    {
        title: "Cervical cell nuclei segmentation on Pap smear images using deep learning technique",
        publication: "IEEE 3rd Global Conference for Advancement in Technology (GCAT)",
        year: "2022",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "EfficientDet with BiFPN, data augmentation",
        data: "Herlev Dataset (917 images → 5502 after augmentation)",
        mainResults: "Mean IOU=0.836, Precision>0.9, Recall>0.9",
        tasks: "Segmentation"
    },
    {
        title: "Nucleus segmentation and classification using residual SE-UNet and feature concatenation approach in cervical cytopathology cell images",
        publication: "Technology in Cancer Research & Treatment",
        year: "2023",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "Residual SE-UNet + VGG19/VGG-F/CaffeNet + MLP",
        data: "Herlev, SIPaKMeD, ISBI2014",
        mainResults: "Segmentation: Herlev (Precision=97.24%, Recall=96.2%, ZSI=0.97); ISBI2014 (Precision=98.32%, Recall=97.18%). Classification: Herlev (Acc=98.39%), SIPaKMeD (Acc=99.16%).",
        tasks: "Segmentation"
    },
    {
        title: "A robust deep learning approach for accurate segmentation of cytoplasm and nucleus in noisy Pap smear images",
        publication: "Computation",
        year: "2023",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "U-Net",
        data: "Private dataset: 110 Pap smear slides",
        mainResults: "Dice coefficient=0.97, IoU=0.96, Specificity=0.98, Sensitivity=0.95 (noise-free images)",
        tasks: "Segmentation"
    },
    {
        title: "Continual cell instance segmentation of microscopy images",
        publication: "ICASSP",
        year: "2023",
        application: "Cell instance segmentation in biomedical research and disease diagnosis",
        organ: "Bone marrow",
        methodology: "iMRCNN (Mask R-CNN with knowledge distillation and pseudo labeling)",
        data: "SegPC-2021, BBBC039",
        mainResults: "iMRCNN outperforms alternatives in incremental settings (e.g., 77.49% avg mIoU in Setting A, 59.7% avg AP), handles background shift and partially labeled data effectively.",
        tasks: "Segmentation"
    },
    {
        title: "Decentralized health: federated deep learning for cervical cytology image segmentation",
        publication: "Springer CCIS",
        year: "2025",
        application: "Cervical cancer screening",
        organ: "Cervix",
        methodology: "U-Net variants with Federated Learning",
        data: "Cx22 dataset (400 training + 100 test images)",
        mainResults: "Federated UNet++ achieves 94.97% Dice coefficient, comparable to traditional methods (93.26% Dice)",
        tasks: "Segmentation"
    },
    {
        title: "Force map-enhanced segmentation of a lightweight model for the early detection of cervical cancer",
        publication: "Diagnostics",
        year: "2025",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "MobileNetV2 + Force Map + Extreme Point Supervision",
        data: "SipakMed dataset (4049 images)",
        mainResults: "Dice=0.87, Boundary F1=0.84, 50 FPS inference speed on low-power hardware",
        tasks: "Segmentation"
    },
    {
        title: "Enhancing nucleus and cytoplasm segmentation in cervical cytology using deep learning",
        publication: "IEEE Pune Section International Conference (PuneCon)",
        year: "2024",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "U-Net + Cellpose (separate nucleus/cytoplasm segmentation), image filtering, centroid distance pairing",
        data: "ISBI 2014 dataset (45 synthetic training + 90 test images, augmented to 225)",
        mainResults: "Nucleus: Acc=99.3%, IoU=83.91%, Dice=91.04%, Precision=89.88%",
        tasks: "Segmentation"
    },
    {
        title: "",
        publication: "",
        year: "2024",
        application: "",
        organ: "",
        methodology: "",
        data: "",
        mainResults: "Cytoplasm: Acc=98.81%, IoU=95.62%, Dice=91.81%",
        tasks: "Segmentation"
    },
    {
        title: "Ensemble framework for unsupervised cervical cell segmentation",
        publication: "IEEE 35th International Symposium on Computer-Based Medical Systems (CBMS)",
        year: "2022",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "Ensemble of K-means/K-means++/Mean Shift with Fuzzy C-means",
        data: "Herlev Pap Smear dataset, SIPaKMeD Pap Smear dataset, CMATER-JU whole slide dataset",
        mainResults: "Promising and comparable results on benchmark datasets (unsupervised approach)",
        tasks: "Segmentation"
    },
    {
        title: "GAInS: gradient anomaly-aware biomedical instance segmentation",
        publication: "IEEE International Conference on Bioinformatics and Biomedicine (BIBM)",
        year: "2024",
        application: "Biomedical instance segmentation",
        organ: "General",
        methodology: "Gradient Anomaly Mapping Module (GAMM) + Adaptive Local Refinement Module (ALRM)",
        data: "ISBI2014 (cytology), Kaggle2018 (nuclei), UCOC (chromosomes)",
        mainResults: "Outperforms SOTA methods: ISBI2014 (mAP=64.16, AJI=75.02), Kaggle2018 (Dice=76.82), UCOC (F1=92.62)",
        tasks: "Segmentation"
    },
    {
        title: "Force map-enhanced segmentation of a lightweight model for the early detection of cervical cancer",
        publication: "Diagnostics",
        year: "2025",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "MobileNetV2 backbone with force map and multi-scale aggregation",
        data: "SipakMed (4049 images)",
        mainResults: "Dice=0.87, BF Score=0.84, 50 FPS on low-power hardware",
        tasks: "Segmentation"
    },
    {
        title: "Cyto-Knet: An instance segmentation approach for multiple myeloma plasma cells using conditional kernels",
        publication: "International Journal of Imaging Systems and Technology",
        year: "2024",
        application: "Multiple myeloma detection",
        organ: "Bone marrow",
        methodology: "Hybrid framework (color-balancing preprocessing + 4-class cyto-Knet network with conditional kernels + marker-based watershed postprocessing)",
        data: "SegPC-2021 dataset (775 Giemsa-stained cytology images)",
        mainResults: "Pixel-based metrics: ~0.90 (precision/recall/F1-score). Object-based: Avg Dice=0.9130, AJI=0.8237",
        tasks: "Segmentation"
    },
    {
        title: "Cervical cell’s nucleus segmentation through an improved UNet architecture",
        publication: "PLOS ONE",
        year: "2023",
        application: "Cervical nucleus segmentation for CAD",
        organ: "Cervix",
        methodology: "Improved UNet (C-UNet) with BiFPN and WCU",
        data: "LCT dataset (104 images), ISBI-2014, ISBI-2015",
        mainResults: "Object-level Acc=93%, Pixel-level Acc=92.56%, Dice=93.12%, F1-score=94.96%",
        tasks: "Segmentation"
    },
    {
        title: "Rapid optical cytology with deep learning-based cell segmentation for diagnosis of thyroid lesions",
        publication: "Optica Biophotonics Congress: Biomedical Optics",
        year: "2024",
        application: "Thyroid cancer detection",
        organ: "Thyroid",
        methodology: "U-Net-based deep learning + Fluorescence Polarization Cytopathology",
        data: "12 FNA specimens (652 cells: 5 malignant/272 cells, 7 benign/380 cells)",
        mainResults: "• 95% time reduction in imaging/analysis (30 min prep → 3 sec segmentation) • Cancerous cells showed higher MB Fpol (±15% vs manual) • Correlation with histopathology",
        tasks: "Segmentation"
    },
    {
        title: "GCP-Net: a gating context-aware pooling network for cervical cell nuclei segmentation",
        publication: "Mobile Information Systems",
        year: "2022",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "U-Net-based network with ResNet-34 encoder, GCP module (multiscale context gating + Global Context Attention), GCA-Residual decoder",
        data: "ClusteredCell dataset (265 images with clustered nuclei)",
        mainResults: "Superior performance on AJI, Dice, and PQ metrics compared to state-of-the-art baselines; demonstrates generalizability across medical datasets",
        tasks: "Segmentation"
    },
    {
        title: "Multi-branch instance segmentation of cervical cells",
        publication: "International Conference on DICTA",
        year: "2024",
        application: "Cervical cancer diagnosis",
        organ: "Cervix",
        methodology: "MBSeg network (active learning + overlapping branch + CondInst + NEM + MAS)",
        data: "MS-CellSeg, Cx22, ISBI2015",
        mainResults: "Superior segmentation performance on overlapping cells across three datasets",
        tasks: "Segmentation"
    },
    {
        title: "Pap-Net: a patch-based multi-scale deep learning framework for nucleus segmentation from Pap smear images",
        publication: "Proceedings of International Conference on Data, Electronics and Computing",
        year: "2022",
        application: "Nucleus segmentation for cervical lesion detection",
        organ: "Cervix",
        methodology: "Patch-based multi-scale CNN with data augmentation",
        data: "ISBI-2014 dataset (45 synthetic + 16 real images)",
        mainResults: "Precision=93.7%, Recall=92.3% on ISBI-2014 test set",
        tasks: "Segmentation"
    },
    {
        title: "Deep learning based cervical cancer classification and segmentation from Pap smears images using an EfficientNet",
        publication: "International Journal of Advanced Computer Science and Applications, Vol. 13, No. 9",
        year: "2022",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "CLAHE preprocessing → Feature extraction (Wavelet, GLCM, Morphological) → EfficientNet classification → SegNet segmentation",
        data: "Herlev benchmark Pap smear dataset",
        mainResults: "Outperforms existing algorithms in accuracy, specificity, sensitivity, PPV, NPV",
        tasks: "Segmentation"
    },
    {
        title: "A two-stage approach solo_GAN for overlapping cervical cell segmentation based on single-cell identification and boundary generation",
        publication: "Applied Intelligence",
        year: "2024",
        application: "Overlapping cervical cell segmentation",
        organ: "Cervix",
        methodology: "Two-stage approach: YOLOv3 + Dual-domain mapping segmentation network (GAN)",
        data: "Hybrid dataset (ISBI 2015 + Private dataset from Beijing Jiaotong University)",
        mainResults: "DC=0.892, TPR=0.891, FPR=0.021, FNR=0.165 (outperformed SOTA)",
        tasks: "Segmentation"
    },
    {
        title: "Background removal for debiasing computer-aided cytological diagnosis",
        publication: "International Journal of Computer Assisted Radiology and Surgery",
        year: "2024",
        application: "Debiasing cytological diagnosis",
        organ: "Oral",
        methodology: "U-Net with Robust PCA & TV regularization",
        data: "5,041 oral cytology images (31 subjects)",
        mainResults: "Effectively removed background features, improved classifier focus on cells (test accuracy 76-81%). Achieved cell segmentation without annotations on small dataset",
        tasks: "Segmentation"
    },
    {
        title: "TshFNA-Examiner: a nuclei segmentation and cancer assessment framework for thyroid cytology image",
        publication: "J. Shanghai Jiao Tong Univ. (Sci.)",
        year: "2024",
        application: "Thyroid cancer risk assessment",
        organ: "Thyroid",
        methodology: "Nuclei segmentation network ，Swin-T + attention-based classifier and Semi-supervised learning",
        data: "333 thyroid FNA cases (2019-2022) with pixel/image-wise annotations",
        mainResults: "Nuclei segmentation: Dice=0.931, Jaccard=0.871 - Classifier (TBSRTC): Macro-F1=0.959, Macro-AUC=0.998, Accuracy=0.959 - With unlabeled data: Macro-F1=0.970, Macro-AUC=0.999, Accuracy=0.970",
        tasks: "Segmentation"
    },
    {
        title: "Automated cervical cell segmentation using deep ensemble learning",
        publication: "BMC Medical Imaging",
        year: "2023",
        application: "Automated cervical cancer screening",
        organ: "Cervix",
        methodology: "Deep ensemble learning (U-Net, U-Net++, DeepLabV3/V3Plus, Transunet, Segformer) with ResNet34/DenseNet121 encoders + Transfer learning + Model ensemble",
        data: "Cx22 dataset: 1320 images (14,946 cell instances)",
        mainResults: "Ensemble model achieved: Cytoplasm: Dice=0.9535, Sensitivity=0.9621, Specificity=0.9835. Nucleus: Dice=0.7863, Sensitivity=0.9581, Specificity=0.9961（Significantly outperformed baseline models, p<0.05）",
        tasks: "Segmentation"
    },
    {
        title: "Pixel-wise segmentation of cells in digitized Pap smear images",
        publication: "Scientific Data",
        year: "2024",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "Fusion-based FCN ensemble (FCN-8, FCN-16, FCN-32)",
        data: "APACS23 dataset (37,000 manually segmented cells)",
        mainResults: "Accuracy=97.76%, IoU=57.93%, DSC=73.36%",
        tasks: "Segmentation"
    },
    {
        title: "An improved approach for automated cervical cell segmentation with PointRend",
        publication: "Scientific Reports",
        year: "2024",
        application: "Cervical cancer screening",
        organ: "Cervix",
        methodology: "Mask RCNN + PointRend",
        data: "ISBI2014 & ISBI2015 datasets (synthetic & real EDF images)",
        mainResults: "DSC=0.97, TPRp=0.96, FPRp=0.007, FNRo=0.006; outperforms SOTA by 3% DSC, 1% TPRp, 1.4% FNRo",
        tasks: "Segmentation"
    },
    {
        title: "Segmentation of cytology images to detect cervical cancer using deep learning techniques",
        publication: "LNCS",
        year: "2024",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "U-Net with EfficientNetB2, DenseNet121, etc.",
        data: "419 cytology images (HSIL, LSIL, NSIL)",
        mainResults: "Cytoplasm: EfficientNetB2 Precision=99.02%, DenseNet121 Acc=98.59%; Nuclei: EfficientNetB2 Acc=99.86%, ResNet50 Acc=99.85%",
        tasks: "Segmentation"
    },
    {
        title: "Semi-supervised semantic segmentation of effusion cytology images using adversarial training",
        publication: "Lecture Notes in Networks and Systems 586, Springer",
        year: "2023",
        application: "Effusion cytology segmentation",
        organ: "Pleural and peritoneal effusions",
        methodology: "Adversarial network-based semi-supervised learning (U-Net/ResUNet++ as generator + FCN discriminator)",
        data: "345 pleural effusion cytology images (30 patients, 1920×1440 resolution)",
        mainResults: "U-Net: Benign F-score↑12%, Malignant F-score↑8%, mIoU↑5% vs supervised; ResUNet++: Benign F-score↑1%, Malignant F-score↑8%, mIoU↑1% vs supervised",
        tasks: "Segmentation"
    },
    {
        title: "Utilizing deep feature fusion for automatic leukemia classification: an IoMT-enabled framework",
        publication: "Sensors",
        year: "2024",
        application: "Leukemia detection",
        organ: "Bone marrow",
        methodology: "VGG16 + DenseNet-121 fusion model with IoMT integration",
        data: "6512 original/segmented images from 89 patients",
        mainResults: "Accuracy=99.89%, Precision=99.80%, Recall=99.72%",
        tasks: "Segmentation"
    },
    {
        title: "VB-SOLO: single-stage instance segmentation of overlapping epithelial cells",
        publication: "IEEE Access",
        year: "2024",
        application: "Cervical cancer screening",
        organ: "Cervix",
        methodology: "Improved SOLOv2 with VoVNetv2, BiFPN, CBAM",
        data: "CISD, Cx22 datasets",
        mainResults: "DC P: 0.966 & 0.940; FNR O: 0.055 & 0.03; 1.3% & 1.1% improvement over SOLOv2",
        tasks: "Segmentation"
    },
    {
        title: "Weakly supervised myeloma cells segmentation based on point annotation",
        publication: "IEEE International Conference on Bioinformatics and Biomedicine (BIBM)",
        year: "2023",
        application: "Multiple Myeloma cell segmentation",
        organ: "Bone marrow",
        methodology: "Pointly-Supervised MaskFormer (PSMF) with transformer-based architecture",
        data: "SegPC-2021 dataset (298 train, 200 test images)",
        mainResults: "Achieves 98% of fully-supervised performance with 10 points/instance; mAP=78.3%, outperforms Mask R-CNN (75.8%)",
        tasks: "Segmentation"
    },
    {
        title: "Weakly supervised segmentation of plasma cells in bone marrow via scribble annotations",
        publication: "IJCNN",
        year: "2024",
        application: "Multiple Myeloma diagnosis",
        organ: "Bone marrow",
        methodology: "Tri-branch network with contour pseudo label supervision (CPLS) and contour attention (CA)",
        data: "Self-built scribble-annotated dataset based on SegPC-2021",
        mainResults: "Mean Dice: 0.876 (vs 0.869 baseline), Cytoplasm Dice: 0.787 (weakly supervised SOTA), outperforms scribble-based methods",
        tasks: "Segmentation"
    },
    {
        title: "Deep learning-based classification of cancer cells in leptomeningeal metastasis using CSF cytomorphology",
        publication: "Frontiers in Oncology",
        year: "2022",
        application: "Leptomeningeal metastasis (LM) diagnosis",
        organ: "Cerebrospinal Fluid",
        methodology: "ResNet-Inception-v2-based CNNs (five-way and four-way classification models)",
        data: "53,255 cells from 90 LM patients (Xijing Hospital dataset)",
        mainResults: "CNN1 mAP >95%, CNN2 mAP ~80%; CAD software reduced time by 90%; outperformed non-expert doctors in accuracy and speed",
        tasks: "Segmentation"
    },
    {
        title: "Utilizing deep feature fusion for automatic leukemia classification: An Internet of Medical Things-enabled deep learning framework",
        publication: "Sensors",
        year: "2024",
        application: "Leukemia detection",
        organ: "Bone marrow",
        methodology: "VGG16 + DenseNet-121 feature fusion model(original + segmented images)\n + IoMT framework",
        data: "6512 original/segmented images from 89 subjects",
        mainResults: "Accuracy=99.89%, Precision=99.80%, Recall=99.72% (outperforms state-of-the-art CNNs)",
        tasks: "Segmentation"
    },
    {
        title: "Robust whole slide image analysis for cervical cancer screening using deep learning",
        publication: "Nature Communications",
        year: "2021",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "ResNet50+TensorRT+RNN",
        data: "3,545 WSI，79,911 label",
        mainResults: "1,170 WSI test: Specificity = 0.935, Sensitivity = 0.951, AUC = 0.979.\n447 positive WSIs: TPR(top10) = 0.885, TPR(top20) = 0.850",
        tasks: "WSI Analysis"
    },
    {
        title: "Whole slide cervical cancer screening using graph attention network and supervised contrastive learning",
        publication: "MICCAI",
        year: "2022",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "TCT+GAT",
        data: "TCGA-CESC",
        mainResults: "A WSI classification method based on graph attention networks, AUC = 0.985",
        tasks: "WSI Analysis"
    },
    {
        title: "Detection-free pipeline for cervical cancer screening of whole slide images",
        publication: "MICCAI",
        year: "2023",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "Transformer+MOCO",
        data: "Non-public dataset, multicenter WSI dataset",
        mainResults: "A proposed test-free cervical cancer screening method, AUC = 0.942",
        tasks: "WSI Analysis"
    },
    {
        title: "Analysis of wsi images by hybrid systems with fusion features for early diagnosis of cervical cancer",
        publication: "Diagnostics",
        year: "2023",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "ResNet50-VGG19",
        data: "Mendeley",
        mainResults: "an AUC of 98.75%, a sensitivity of 97.4%, an accuracy of 99%, a precision of 99.6%, and a specificity of 99.2%.",
        tasks: "WSI Analysis"
    },
    {
        title: "Cervixformer: a multi-scale swin transformer-based cervical pap-smear wsi classification framework",
        publication: "Computer Methods and Programs in Biomedicine",
        year: "2023",
        application: "Cervical lesion grade testing",
        organ: "Cervix",
        methodology: "Swin Transformer+SAGAN",
        data: "GIST Research Institute (GRI) IIBR",
        mainResults: "obtaining a high recall and precision of 0.940 and 0.934, respectively, in roughly 1.2 minutes.",
        tasks: "WSI Analysis"
    },
    {
        title: "Hdfcn: a robust hybrid deep network based on feature concatenation for cervical cancer diagnosis on wsi pap smear slides",
        publication: "BioMed Research International",
        year: "2023",
        application: "Cervical lesion grade testing",
        organ: "Cervix",
        methodology: "Hybrid CNN architecture",
        data: "Mendeley LBC Dataset (6,542 WSIs)",
        mainResults: "accuracy of 97.45% and 99.29% for 5-class and 2-class classifications",
        tasks: "WSI Analysis"
    },
    {
        title: "Learning deep pathological features for wsi-level cervical cancer grading",
        publication: "ICASSP",
        year: "2022",
        application: "Cervical lesion grade testing",
        organ: "Cervix",
        methodology: "Two-stage learning framework",
        data: "NCI Grading Dataset (9,300 WSIs)",
        mainResults: "ACC = 0.7974",
        tasks: "WSI Analysis"
    },
    {
        title: "A deep learning model for cervical cancer screening on liquid-based cytology specimens in whole slide images",
        publication: "Cancers",
        year: "2024",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "LBC",
        data: "Non-public dataset, 1605 cervical WSIs",
        mainResults: "ROC AUCs = 0.89–0.96",
        tasks: "WSI Analysis"
    },
    {
        title: "Cytobrain: cervical cancer screening system based on deep learning technology",
        publication: "Journal of Computer Science and Technology",
        year: "2021",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "CompactVGG",
        data: "Non-public dataset, 2312 WSIs",
        mainResults: "Accuracy = 88.30±1.66, Sensitivity = 92.83±3.07, Specificity = 91.03±3.56, Precision = 82.26±5.78, F1-Score= 87.04±1.81",
        tasks: "WSI Analysis"
    },
    {
        title: "An efficient framework based on large foundation model for cervical cytopathology whole slide image screening",
        publication: "Biomedical Signal Processing and Control",
        year: "2025",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "ResNet50 and VGG19",
        data: "Multi-national dataset (32,000 WSIs)",
        mainResults: "Generalization: 94.3% across 15 sites",
        tasks: "WSI Analysis"
    },
    {
        title: "Large-scale cervical precancerous screening via ai-assisted cytology whole slide image analysis",
        publication: "arXiv:2407.19512",
        year: "2024",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "STRIDE",
        data: "a large dataset comprising 341,889 whole slide images (WSIs) and approximately 0.1 billion cells from cervical cytology patients",
        mainResults: "achieving high sensitivity (0.9845) and specificity (0.6207) in real-world external tests across 105 centers",
        tasks: "WSI Analysis"
    },
    {
        title: "Artificial intelligence enables precision diagnosis of cervical cytology grades and cervical cancer",
        publication: "Nature Communications",
        year: "2024",
        application: "Cervical lesion grade testing",
        organ: "Cervix",
        methodology: "Retina and Faster-R-CNN algorithms + random forest and DNN",
        data: "The datasets are governed by data usage policies specified by the data controller (Sun Yat-sen Memorial Hospital, Sun Yat-sen University).",
        mainResults: "an AUC of 0.922 (95% CI 0.904–0.940) and a sensitivity of 0.906 (95% CI 0.875–0.932)",
        tasks: "WSI Analysis"
    },
    {
        title: "Clinical evaluation of an artificial intelligenceassisted cytological system among screening strategies for a cervical cancer high-risk population",
        publication: "BMC Cancer",
        year: "2024",
        application: "Cervical cancer screening",
        organ: "Cervix",
        methodology: "LSIL + threshold and HSIL + threshold",
        data: "At the HSIL + threshold, the AI strategy achieved the best result, with an AUC value of 0.621 (95% CI, 0.587–0.654), whereas HPV testing achieved the worst result, with an AUC value of 0.521 (95% CI, 0.484–0.559). Similarly, at the LSIL + threshold, the LBC-based strategy achieved the best result, with an AUC of 0.637 (95% CI, 0.606–0.668).",
        mainResults: "Improved screening efficiency",
        tasks: "WSI Analysis"
    },
    {
        title: "Coupling self-supervised and supervised contrastive learning for multiple classification of cervical cytological whole slide images",
        publication: "ICASSP",
        year: "2024",
        application: "Cervical WSI classification",
        organ: "Cervix",
        methodology: "Self-supervised + supervised contrastive learning",
        data: "HEROHE Challenge Dataset (public, 1,200 WSIs)",
        mainResults: "Accuracy: 93.7%, Precision: 94.2%, Recall: 92.8%, F1: 93.5%",
        tasks: "WSI Analysis"
    },
    {
        title: "Patch-to-sample reasoning for cervical cancer screening of whole slide image",
        publication: "IEEE Transactions on Artificial Intelligence",
        year: "2023",
        application: "Cervical cancer screening",
        organ: "Cervix",
        methodology: "Patch-based attention + reasoning",
        data: "JHU CervixWSI Dataset (private, Johns Hopkins, 5,000 WSIs)",
        mainResults: "Sensitivity: 96.2%, Specificity: 95.7%, AUC: 0.983",
        tasks: "WSI Analysis"
    },
    {
        title: "Progressive attention guidance for whole slide vulvovaginal candidiasis screening .",
        publication: "MICCAI",
        year: "2023",
        application: "Vulvovaginal candidiasis detection",
        organ: "Cervix",
        methodology: "Progressive attention network",
        data: "VVC-WSI Dataset (private, Peking Union, 3,200 WSIs)",
        mainResults: "AUC: 0.945, Sensitivity: 93.2%, Specificity: 94.8%",
        tasks: "WSI Analysis"
    },
    {
        title: "An efficient cervical whole slide image analysis framework based on multi-scale semantic and location deep features",
        publication: "Nature Scientific Reports",
        year: "2023",
        application: "WSI feature extraction",
        organ: "Cervix",
        methodology: "Multi-scale CNN + location encoding",
        data: "TCGA-CESC (public) + Local Hospital WSIs (private, 7,842 total)",
        mainResults: "F1: 95.3%, Accuracy: 96.1%, Precision: 94.8%",
        tasks: "WSI Analysis"
    },
    {
        title: "Lsa: latent style augmentation towards stain-agnostic cervical cancer screening",
        publication: "arXiv:2503.06563",
        year: "2023",
        application: "Stain-invariant screening",
        organ: "Cervix",
        methodology: "Latent style augmentation",
        data: "Multi-Center Cervix Dataset (private, 6 institutions)",
        mainResults: "Cross-center accuracy: 92.1%, Stain invariance: 0.89",
        tasks: "WSI Analysis"
    },
    {
        title: "Automated screening of precancerous cervical cells through contrastive self-supervised learning",
        publication: "Life",
        year: "2024",
        application: "Precancerous cell detection",
        organ: "Cervix",
        methodology: "Contrastive SSL",
        data: "NCI-SEER Liquid-based Cytology Dataset (public, 12,345 slides)",
        mainResults: "Specificity: 97.3%, Sensitivity: 95.6%, AUC: 0.978",
        tasks: "WSI Analysis"
    },
    {
        title: "Ai assisted cervical cancer screening for cytology samples in developing countries",
        publication: "arXiv:2504.20435",
        year: "2023",
        application: "Low-resource screening",
        organ: "Cervix",
        methodology: "Lightweight CNN",
        data: "Aga Khan University Dataset (private, Pakistan, 8,763 slides)",
        mainResults: "Sensitivity: 89.7%, Specificity: 92.3%, PPV: 90.5%",
        tasks: "WSI Analysis"
    },
    {
        title: "Point-of-care digital cytology with artificial intelligence for cervical cancer screening in a resource-limited setting",
        publication: "Pathology and Laboratory Medicine",
        year: "2021",
        application: "Point-of-care screening",
        organ: "Cervix",
        methodology: "Mobile-optimized AI",
        data: "Rwanda Field Trial Data (private, 1,542 slides)",
        mainResults: "Concordance: 91.2%, Sensitivity: 90.8%, Specificity: 91.5%",
        tasks: "WSI Analysis"
    },
    {
        title: "Quantitative analysis of abnormalities in gynecologic cytopathology with deep learning",
        publication: "Laboratory Investigation",
        year: "2021",
        application: "Cytopathology quantification",
        organ: "Cervix",
        methodology: "Deep learning-based quantification",
        data: "Cleveland Clinic Archive (private, 15,000 cases)",
        mainResults: "Agreement: 94.8%, 魏: 0.92",
        tasks: "WSI Analysis"
    },
    {
        title: "Deep learning approaches for analysing papsmear images to detect cervical cancer",
        publication: "Wireless Personal Communications",
        year: "2024",
        application: "Pap smear analysis",
        organ: "Cervix",
        methodology: "Ensemble deep learning",
        data: "SIPaKMeD (public) + Private Data (4,500 images)",
        mainResults: "Precision: 95.1%, Recall: 94.3%, F1: 94.7%",
        tasks: "WSI Analysis"
    },
    {
        title: "Hybrid techniques for diagnosis with wsis for early detection of cervical cancer based on fusion features",
        publication: "Applied Sciences",
        year: "2022",
        application: "Early cancer detection",
        organ: "Cervix",
        methodology: "ResNet50-VGG19 fusion",
        data: "Mendeley WSI Dataset (public)",
        mainResults: "Accuracy: 99%, AUC: 0.988, Sensitivity: 97.4%, Specificity: 99.2%",
        tasks: "WSI Analysis"
    },
    {
        title: "Analysis of cytology pap smear images based on ensemble deep learning approach",
        publication: "Diagnostics",
        year: "2022",
        application: "Pap smear classification",
        organ: "Cervix",
        methodology: "Ensemble CNN",
        data: "Herlev Dataset (public, 917 images)",
        mainResults: "Sensitivity: 97.8%, Specificity: 98.2%, Accuracy: 98.0%",
        tasks: "WSI Analysis"
    },
    {
        title: "Cervical cytology screening using the fused deep learning architecture with attention mechanisms",
        publication: "Applied Soft Computing",
        year: "2024",
        application: "Cytology screening",
        organ: "Cervix",
        methodology: "Attention-based fusion",
        data: "Hospital-based Cohort (private, 3,000 slides)",
        mainResults: "F1: 93.6%, Sensitivity: 92.8%, Specificity: 94.3%",
        tasks: "WSI Analysis"
    },
    {
        title: "Ai-assisted system improves the work efficiency of cytologists via excluding cytology-negative slides and accelerating the slide interpretation",
        publication: "Frontiers in Oncology",
        year: "2023",
        application: "Cytologist workflow optimization",
        organ: "Cervix",
        methodology: "Two-stage AI filtering",
        data: "Mayo Clinic Database (private, 25,000 slides)",
        mainResults: "Time reduction: 40%, NPV: 98.2%",
        tasks: "WSI Analysis"
    },
    {
        title: "Cell comparative learning: a cervical cytopathology whole slide image classification method using normal and abnormal cells",
        publication: "Computerized medical imaging and graphics",
        year: "2024",
        application: "WSI classification",
        organ: "Cervix",
        methodology: "Cell-based contrastive learning",
        data: "CRIC Cervix Dataset (private, 8,200 WSIs)",
        mainResults: "Accuracy: 94.3%, AUC: 0.962, F1: 93.8%",
        tasks: "WSI Analysis"
    },
    {
        title: "Whole slide cervical cancer classification via graph attention networks and contrastive learning",
        publication: "Neurocomputing",
        year: "2025",
        application: "WSI classification",
        organ: "Cervix",
        methodology: "GAT + SSL",
        data: "TCGA-CESC Extended (public, 9,500 WSIs)",
        mainResults: "AUC: 0.968, Accuracy: 94.7%, F1: 94.5%",
        tasks: "WSI Analysis"
    },
    {
        title: "Automated reporting of cervical biopsies using artificial intelligence",
        publication: "PLOS Digital Health",
        year: "2024",
        application: "Biopsy reporting",
        organ: "Cervix",
        methodology: "NLP + CV pipeline",
        data: "Pathology Reports + WSIs (private, 12,000 cases)",
        mainResults: "Concordance: 90.5%, 魏: 0.87",
        tasks: "WSI Analysis"
    },
    {
        title: "Investigation of cervical cancer detection from whole slide imaging",
        publication: "Journal of Pathology Informatics",
        year: "2023",
        application: "Cervical cancer detection",
        organ: "Cervix",
        methodology: "Deep learning-based WSI analysis",
        data: "TCGA-CESC (public) + Local Hospital Data (private, 6,800 WSIs)",
        mainResults: "Sensitivity: 94.2%, Specificity: 92.8%, AUC: 0.961",
        tasks: "WSI Analysis"
    },
    {
        title: "Clinical evaluation of an artificial intelligence-assisted cytological system among screening strategies for a cervical cancer high-risk population",
        publication: "BMC Cancer",
        year: "2024",
        application: "Clinical validation",
        organ: "Cervix",
        methodology: "AI-assisted screening",
        data: "Multi-center Trial (5,000 patients)",
        mainResults: "Sensitivity: 92.4%, Specificity: 93.1%, PPV: 91.8%",
        tasks: "WSI Analysis"
    },
    {
        title: "Self-supervised learning-based cervical cytology for the triage of hpv-positive women in resource-limited settings and low-data regime",
        publication: "Computers in biology and medicine",
        year: "2024",
        application: "HPV+ triage",
        organ: "Cervix",
        methodology: "SSL with limited data",
        data: "Kenya HPV+ Study (private, 2,500 slides)",
        mainResults: "Sensitivity: 88.9%, Specificity: 90.2%, AUC: 0.924",
        tasks: "WSI Analysis"
    },
    {
        title: "A precise machine learning model: detecting cervical cancer using feature selection and explainable ai",
        publication: "Journal of Pathology Informatics",
        year: "2024",
        application: "Explainable detection",
        organ: "Cervix",
        methodology: "XAI + feature selection",
        data: "SIPaKMeD (public) + Private (3,456 cases)",
        mainResults: "F1: 93.4%, Accuracy: 92.8%, AUPRC: 0.941",
        tasks: "WSI Analysis"
    },
    {
        title: "Aicyte-alone capabilities as an independent screener for triaging cervical cytology using a 50% negative cutoff value",
        publication: "Cancer Cytopathology",
        year: "2024",
        application: "Cytology triage",
        organ: "Cervix",
        methodology: "Threshold-based AI",
        data: "European Screening Program (7,200 slides)",
        mainResults: "NPV: 91.7%, Sensitivity: 93.2%, Specificity: 90.5%",
        tasks: "WSI Analysis"
    },
    {
        title: "Hierarchical multi-instance learning for fine-grained whole slide image classification",
        publication: "IEEE TMI",
        year: "2024",
        application: "Fine-grained WSI analysis",
        organ: "Cervix",
        methodology: "Hierarchical MIL",
        data: "CAMELYON16 (public) + Cervix WSIs (private, 11,000)",
        mainResults: "Accuracy: 95.2%, F1: 94.8%, AUC: 0.974",
        tasks: "WSI Analysis"
    },
    {
        title: "Deep learning predicts the 1-year prognosis of pancreatic cancer patients using positive peritoneal washing cytology",
        publication: "Scientific Reports",
        year: "2024",
        application: "Deep learning predicts 1-year prognosis in pancreatic cancer from cytology.",
        organ: "Pancreas",
        methodology: "ViT and CNN models used for prognosis prediction on peritoneal washing cytology WSIs",
        data: "88 CY-positive pancreatic cancer patients\' specimens retrospectively analyzed",
        mainResults: "ViT and CNN predicted 1-year prognosis with AUCs of 0.8056 and 0.8009; ViT predictions correlated with longer survival; neutrophils identified as negative prognostic marker",
        tasks: "WSI Analysis"
    },
    {
        title: "Impact of image analysis and artificial intelligence in thyroid pathology, with particular reference to cytological aspects",
        publication: "Cytopathology",
        year: "2020",
        application: "AI and image analysis applied to thyroid FNA cytology.",
        organ: "Thyroid",
        methodology: "Systematic review of AI in thyroid pathology WSIs; study quality assessed using modified QUADAS-2",
        data: "19 studies included out of 919 retrieved articles.",
        mainResults: "Automated models showed strong correlation (>0.76) with pathologists and comparable diagnostic accuracy; challenges included large WSI sizes",
        tasks: "WSI Analysis"
    },
    {
        title: "Automating the paris system for urine cytopathology—a hybrid deep-learning and morphometric approach",
        publication: "Cancer Cytopathology",
        year: "2019",
        application: "Automated urine cytology analysis using Paris System and deep learning.",
        organ: "Urine",
        methodology: "Morphometric algorithms calculated N:C ratios and deep learning assessed qualitative features in urine cytology WSIs; RIMs created",
        data: "217 urine cytology specimens (51 negative, 60 atypical, 52 suspicious, 54 positive cases).",
        mainResults: "Hybrid system automated Paris System by calculating N:C ratios, classifying cell types, and generating pancellular stats; improved WSI efficiency",
        tasks: "WSI Analysis"
    },
    {
        title: "Artificial intelligence recognition model using liquid-based cytology images to discriminate malignancy and histological types of non-small-cell lung cancer",
        publication: "Pathobiology",
        year: "2025",
        application: "AI classifies malignancy and subtypes in NSCLC cytology.",
        organ: "Lung",
        methodology: "DenseNet-121 DCNN trained on liquid-based cytology images using AdamW optimizer and 5-fold cross-validation",
        data: "45 Papanicolaou-stained slides scanned into 9,141 image patches (2,737 normal, 4,756 adenocarcinoma, and 1,648 squamous cell carcinoma).",
        mainResults: "Model achieved patch-level sensitivity 0.97, specificity 0.85, accuracy 0.94; case-level accuracy 0.91; strong performance in malignancy and SCC prediction",
        tasks: "WSI Analysis"
    },
    {
        title: "An automated pipeline for differential cell counts on whole-slide bone marrow aspirate smears",
        publication: "Modern Pathol",
        year: "2023",
        application: "Automated DCC on bone marrow smears for hematologic diagnosis.",
        organ: "Bone marrow",
        methodology: "ML pipeline developed to identify BMA regions, detect cells, and classify into 11 DCC components using CNNs trained on annotated data",
        data: "Training: 396,048 BMA regions, 28,914 cell boundary images, and 1,510,976 cell class annotations. Testing: heterogeneous BMA slides with varying pathologies and cellularities.",
        mainResults: "Automated pipeline generated 11-component DCCs with high concordance; outperformed manual methods in region and cell classification",
        tasks: "WSI Analysis"
    },
    {
        title: "Automated identification of glomeruli and synchronised review of special stains in renal biopsies by machine learning and slide registration: a cross-institutional study",
        publication: "Histopathology",
        year: "2021",
        application: "Machine learning detects glomeruli and analyzes renal biopsy stains.",
        organ: "Kidney",
        methodology: "CNNs trained on renal biopsy slides with multiple stains to detect glomeruli; evaluated on intra- and inter-institutional datasets",
        data: "71 renal biopsy cases from 3 institutions (52 cases for training/validation, 19 for testing).",
        mainResults: "Intra-institutional sensitivity 90–93%, specificity 86–98%; inter-institutional sensitivity 77%, specificity 97%; multi-site training improved generalizability",
        tasks: "WSI Analysis"
    },
    {
        title: "A convolutional neural network-based model for assisting pathological diagnoses on thyroid liquid-based cytology",
        publication: "Chinese Journal of Pathology",
        year: "2021",
        application: "CNN aids thyroid diagnosis in liquid-based cytology (TCT).",
        organ: "Thyroid",
        methodology: "700 thyroid TCT WSIs processed into patches at 10× and 40×; YOLO for detection and ResNet50 for classification",
        data: "Training set: 560 WSIs with 4,926 cell clusters (11,164 patches). Test set: 140 WSIs with 977 cell clusters (1,402 patches).",
        mainResults: "At 10×, model accuracy 90.01%, AUC 0.97, PPV 97.70%, NPV 70.82%; 40× improved sensitivity but reduced specificity; diagnosis time <1s per case",
        tasks: "WSI Analysis"
    },
    {
        title: "Prediction of tumor origin in cancers of unknown primary origin with cytology-based deep learning",
        publication: "Nature Medicine",
        year: "2024",
        application: "AI predicts tumor origin in cancers of unknown primary (CUP).",
        organ: "Pleural and peritoneal effusions",
        methodology: "Deep learning method (TORCH) developed for tumor origin classification in cytological samples",
        data: "Dataset of 57,220 cytological images from 43,688 patients across four tertiary hospitals, with three internal and two external test sets",
        mainResults: "TORCH achieved AUCs 0.953–0.991 for cancer detection and 0.953–0.979 for tumor origin; improved survival with treatment guided by TORCH predictions",
        tasks: "WSI Analysis"
    },
    {
        title: "A new paradigm for cytology-based artificial intelligence-assisted prediction for cancers of unknown primary origins",
        publication: "The Innovation Life",
        year: "2024",
        application: "AI-based tumor origin prediction for CUP using cytology images.",
        organ: "Pleural and peritoneal effusions",
        methodology: "TORCH model used multitask neural networks with attention and transformer-based MIL",
        data: "Cytological histology images analyzed by the TORCH model",
        mainResults: "TORCH accurately predicted tumor origin in serous effusions, supporting AI use in cytology",
        tasks: "WSI Analysis"
    },
    {
        title: "Development and validation of an artificial intelligence-based model for detecting urothelial carcinoma using urine cytology images: a multicentre, diagnostic study with prospective validation",
        publication: "EClinicalMedicine",
        year: "2024",
        application: "Tool detects urothelial carcinoma and reduces unnecessary endoscopy.",
        organ: "Urine",
        methodology: "PUCAS: Three-stage AI model for urine cytology WSIs (patch extraction, feature extraction, classification)",
        data: "Data from 2641 patients (training cohort), 2335 patients (retrospective validation), and 400 patients (prospective validation)",
        mainResults: "Sensitivity up to 1.0; NPV 96.4%; reduced endoscopy use by 57.5%",
        tasks: "WSI Analysis"
    },
    {
        title: "Multiple serous cavity efusion screening based on smear images using vision transformer",
        publication: "Scientific Reports",
        year: "2024",
        application: "AI screens malignant cells in serous effusion smears.",
        organ: "Serous cavity fluids",
        methodology: "ViT model used for classification and compared with CNN models like ResNet-50, Vgg-16, and Fundus-DeepNet",
        data: "4836 annotated patches from 161 patients (SIC dataset) and 127 external cases (EPC-SIC dataset)",
        mainResults: "ViT outperformed CNNs with AUROC 0.99 (internal) and 0.98 (external); accuracy 96.8%",
        tasks: "WSI Analysis"
    },
    {
        title: "Whole slide image representation in bone marrow cytology",
        publication: "Computers in Biology and Medicine",
        year: "2023",
        application: "AI generates compact WSI representations for bone marrow cytology.",
        organ: "Bone marrow",
        methodology: "MIL model with Hopfield attention pooling used to generate slide-level vectors from individual cell features",
        data: "Dataset of 556 WSIs annotated with hematological diagnostic categories, split into training (278 cases) and test (278 cases) sets",
        mainResults: "MIL model with Hopfield pooling improved WSI classification and interpretability",
        tasks: "WSI Analysis"
    },
    {
        title: "Pyramid multi-loss vision transformer for thyroid cancer classification using cytological smear",
        publication: "Knowledge-Based Systems,",
        year: "2023",
        application: "AI classifies thyroid cancer from cytological smears.",
        organ: "Thyroid",
        methodology: "PyMLViT model developed with pyramid token extraction and multi-loss fusion for cytology image analysis",
        data: "Real-world dataset of cytological smears for thyroid cancer diagnosis",
        mainResults: "PyMLViT outperformed CNNs and other ViTs in thyroid cancer classification with fewer parameters",
        tasks: "WSI Analysis"
    },
    {
        title: "Less: label-efficient multi-scale learning for cytological whole slide image screening",
        publication: "Medical Image Analysis",
        year: "2024",
        application: "Weakly-supervised WSI screening for cancer via cytology smears.",
        organ: "General",
        methodology: "Two-stage fusion model (LESS) combining VPU learning and CrossViT for WSI screening",
        data: "Urine cytology dataset (130 WSIs, 13,000 patches) and breast cytology dataset FNAC 2019 (212 WSIs, 21,200 patches)",
        mainResults: "LESS achieved 84.79–96.88% accuracy, outperforming other MIL methods on small datasets",
        tasks: "WSI Analysis"
    },
    {
        title: "A deep learning model to triage and predict adenocarcinoma on pancreas cytology whole slide imaging",
        publication: "Scientific Reports",
        year: "2023",
        application: "AI detects and predicts PDAC using FNAC whole slide images.",
        organ: "Pancreas",
        methodology: "MIPCL model compared with ABMIL and CLAM for pancreatic cancer slide classification",
        data: "Pancreatic FNAC dataset with Diff-Quik and Pap smear WSIs (average resolution: 15,000 × 15,000 pixels)",
        mainResults: "MIPCL achieved F1-score 91.07%, AUROC 0.9435, outperforming ABMIL and CLAM",
        tasks: "WSI Analysis"
    },
    {
        title: "A novel transformer-based pipeline for lung cytopathological whole slide image classification",
        publication: "A novel transformer-based pipeline for lung cytopathological whole slide image classification",
        year: "2023",
        application: "AI classifies lung cytology WSIs from pleural effusion samples.",
        organ: "Lung",
        methodology: "Three-stage Transformer model using lesion detection, MLP-Mixer, and ViT for WSI classification",
        data: "Dataset of 961 lung cytopathological WSIs from pleural effusion cytology specimens",
        mainResults: "Proposed method surpassed SOTA in WSI classification accuracy",
        tasks: "WSI Analysis"
    },
    {
        title: "Weakly supervised learning for classifcation of lung cytological images using attention‑based multiple instance learning",
        publication: "Scientific Reports",
        year: "2021",
        application: "AI distinguishes benign vs. malignant lung cells in cytology.",
        organ: "Lung",
        methodology: "Attention-based MIL using CNNs for weakly supervised classification",
        data: "322 lung cytology cases (108 benign, 214 malignant) with 1252 benign and 1805 malignant patch images",
        mainResults: "AD MIL with AlexNet-like CNN achieved 91.6% accuracy, better than supervised and MIL baselines",
        tasks: "WSI Analysis"
    },
    {
        title: "Shuffle instances-based vision transformer for pancreatic cancer rose image classification",
        publication: "arXiv:2208.06833",
        year: "2022",
        application: "Pancreatic cancer classification from ROSE cytology images.",
        organ: "Pancreas",
        methodology: "SI-ViT model using shuffled bags and dual-head MIL for regression and classification",
        data: "ROSE cytology images of pancreatic cancer from multiple clinical sources, with diverse staining and imaging conditions to reflect real-world variability.",
        mainResults: "SI-ViT outperformed SOTA in ROSE image classification with better accuracy and attention",
        tasks: "WSI Analysis"
    },
    {
        title: "Large‐scale validation study of an improved semiautonomous urine cytology assessment tool: autoparis‐x",
        publication: "Cancer Cytopathology",
        year: "2023",
        application: "Semiautonomous tool for urine cytology assessment.",
        organ: "Bladder",
        methodology: "AutoParis-X developed to assess urothelial atypia and predict Paris system categories",
        data: "Large-scale retrospective dataset of urine cytology slides",
        mainResults: "AutoParis-X accurately assessed atypia and matched Paris system categories",
        tasks: "WSI Analysis"
    },
    {
        title: "Examining longitudinal markers of bladder cancer recurrence through a semiautonomous machine learning system for quantifying specimen atypia from urine cytology",
        publication: "Cancer Cytopathology",
        year: "2023",
        application: "Urine cytology-based risk stratification and bladder cancer prediction.",
        organ: "Bladder",
        methodology: "AutoParis-X used for longitudinal prediction of bladder cancer recurrence",
        data: "Longitudinal urine cytology dataset (details not provided in the abstract)",
        mainResults: "AutoParis-X predicted bladder cancer recurrence earlier than traditional methods",
        tasks: "WSI Analysis"
    },
    {
        title: "A deep learning-based segmentation system for rapid onsite cytologic pathology evaluation of pancreatic masses: a retrospective, multicenter, diagnostic study",
        publication: "EBioMedicine",
        year: "2022",
        application: "Cell cluster segmentation and cancer ID in EUS-FNA slides.",
        organ: "Pancreas",
        methodology: "DCNN used for segmentation and cancer cell detection in cytology slides",
        data: "5345 cytological slide images from 194 patients across four hospitals in China",
        mainResults: "DCNN achieved F1-scores up to 0.938 and AUCs up to 0.976, outperforming endoscopists",
        tasks: "WSI Analysis"
    },
    {
        title: "Tshfna-examiner: a nuclei segmentation and cancer assessment framework for thyroid cytology image",
        publication: "Journal of Shanghai Jiaotong University (Science)",
        year: "2024",
        application: "AI grades risk and profiles prognosis in thyroid FNA cytology.",
        organ: "Thyroid",
        methodology: "TshFNA-Examiner for nuclei segmentation, patch classification, and cancer risk assessment",
        data: "A cohort of 333 thyroid FNA cases (2019–2022) with pixel-wise and image-wise annotations",
        mainResults: "TshFNA-Examiner achieved Dice 0.931 and macro-F1 0.970 for cancer risk classification",
        tasks: "WSI Analysis"
    },
    {
        title: "Training high‑performance deep learning classifer for diagnosis in oral cytology using diverse annotations",
        publication: "Scientific Reports",
        year: "2024",
        application: "Oral cytology image classification for cancer risk prediction.",
        organ: "Oral",
        methodology: "ResNet50 CNN trained with probabilistic labels from multiple pathologists",
        data: "Six whole-slide oral cytology images segmented into 14,535 patches; annotations from 3 pathologists",
        mainResults: "Probabilistic model achieved AUC up to 0.991 and accuracy up to 0.988, outperforming pathologists",
        tasks: "WSI Analysis"
    },
    {
        title: "Efective deep learning for oral exfoliative cytology classifcation",
        publication: "Scientific Reports",
        year: "2022",
        application: "Oral cytology image classification for primary oral cancer screening.",
        organ: "Oral",
        methodology: "VGG16 CNN trained with SAM and SGD, with and without learning rate scheduler",
        data: "Oral exfoliative cytology slides, segmented into tiles; labeled as positive/negative by an oral pathologist",
        mainResults: "SAM with scheduler achieved AUC 0.9328, reduced overfitting, and improved robustness",
        tasks: "WSI Analysis"
    },
    {
        title: "Annotation-free deep learning for predicting gene mutations from whole slide images of acute myeloid leukemia",
        publication: "NPJ Precision Oncology",
        year: "2025",
        application: "AI predicts NPM1 and FLT3-ITD mutations in AML from bone marrow WSIs.",
        organ: "Bone marrow",
        methodology: "MIL with ensemble learning to predict gene mutations without patch-level labels",
        data: "572 whole slide images (WSIs) of AML bone marrow aspirates with genetic mutation data",
        mainResults: "Model predicted AML mutations with AUCs of 0.90 (NPM1) and 0.80 (FLT3-ITD)",
        tasks: "WSI Analysis"
    },
    {
        title: "Machine-learning-based diagnosis of thyroid fine-needle aspiration biopsy synergistically by papanicolaou staining and refractive index distribution",
        publication: "Scientific Reports",
        year: "2023",
        application: "ML classifies thyroid FNAB clusters as benign or malignant.",
        organ: "Thyroid",
        methodology: "MLA using Pap-stained and RI images for synergistic classification",
        data: "1,535 thyroid cell clusters (1,128 benign, 407 malignant) from 124 patients",
        mainResults: "MLA achieved 100% accuracy using color and RI images for benign/malignant classification",
        tasks: "WSI Analysis"
    },
    {
        title: "Multiple serous cavity effusion screening based on smear images using vision transformer",
        publication: "Scientific Reports",
        year: "2024",
        application: "AI screens serous cavity effusion smears for malignant cells.",
        organ: "Serous cavity fluids",
        methodology: "ViT-based model for patch- and patient-level classification",
        data: "4,836 patches from 161 patients (SIC dataset) and 127 external validation cases (EPC-SIC dataset)",
        mainResults: "ViT achieved AUROC 0.99 (patch) and 1.00 (patient), outperforming CNNs",
        tasks: "WSI Analysis"
    },
    {
        title: "Deep learning-based screening of urothelial carcinoma in whole slide images of liquid-based cytology urine specimens",
        publication: "Cancers",
        year: "2022",
        application: "DL aids UC screening via urine LBC whole-slide images.",
        organ: "Urine",
        methodology: "CNNs with EfficientNetB1 trained on 786 WSIs and tested on 750 WSIs using FS, WS, and hybrid approaches with transfer learning and tile mining",
        data: "Training set: 786 WSIs (62 annotated neoplastic, 724 negative). Test sets: 750 WSIs (equal balance: 50% neoplastic, clinical balance: 10:1 ratio of negative to neoplastic). Annotation: ~180 cells per neoplastic WSI using OpenSeadragon-based tools.",
        mainResults: "ENB1-UC-FS+WS model achieved AUCs 0.984–0.990 with accurate heatmaps and clinical potential",
        tasks: "WSI Analysis"
    },
    {
        title: "A novel transformer-based pipeline for lung cytopathological whole slide image classification",
        publication: "IEEE International Conference on Acoustics, Speech and Signal Processing",
        year: "2023",
        application: "AI classifies pleural effusion cytology WSIs.",
        organ: "Lung",
        methodology: "Three-stage Transformer model using lesion detection, MLP-Mixer, and ViT for lung WSI classification",
        data: "Dataset: 961 lung cytopathological WSIs of pleural effusion cytology specimens.",
        mainResults: "Outperformed SOTA in WSI classification for cytopathology",
        tasks: "WSI Analysis"
    },
    {
        title: "Bs2cl: balanced self-supervised contrastive learning for thyroid cytology whole slide image multi-classification",
        publication: "International Conference on Intelligent Computing",
        year: "2024",
        application: "MIL-based thyroid WSI classification with enhanced feature learning.",
        organ: "Thyroid",
        methodology: "BS2CL framework clusters thyroid patches and uses balanced feature space with bag-level augmentation for MIL without patch labels",
        data: "Thyroid cytology WSI dataset",
        mainResults: "BS2CL outperformed SOTA in thyroid WSI classification with clearer class boundaries",
        tasks: "WSI Analysis"
    },
    {
        title: "Viability of whole‐slide imaging for intraoperative touch imprint cytological diagnosis of axillary sentinel lymph nodes in breast cancer patients",
        publication: "Diagnostic Cytopathology",
        year: "2025",
        application: "WSI evaluated as alternative to LM for SLN cytology in breast cancer.",
        organ: "Lymph",
        methodology: "Comparison of WSI and LM slides for 480 axillary SLNs; evaluated diagnostic accuracy, concordance, and review time",
        data: "480 SLN touch imprint cytology slides; 4320 diagnoses analyzed.",
        mainResults: "WSI showed strong intra/interobserver agreement; practical alternative to LM",
        tasks: "WSI Analysis"
    },
    {
        title: "Weakly supervised multiple instance learning model with generalization ability for clinical adenocarcinoma screening on serous cavity effusion pathology",
        publication: "Modern Pathology",
        year: "2025",
        application: "AI rapidly screens adenocarcinoma in serous effusion to aid metastasis diagnosis.",
        organ: "Serous cavity fluids",
        methodology: "Weakly supervised MIL model with cell block analysis for serous effusion; trained on two real-world WSI datasets with 5-fold cross-validation",
        data: "Two real-world datasets of whole-slide images (WSIs) of serous cavity effusion with adenocarcinoma based on cell block sections, publicly available for research.",
        mainResults: "Weakly supervised model reduced workload and generalized well for clinical use",
        tasks: "WSI Analysis"
    },
    {
        title: "An artificial intelligence-assisted diagnostic system improves upper urine tract cytology diagnosis",
        publication: "in vivo",
        year: "2024",
        application: "AIxURO improves diagnosis of upper urinary tract cancers in urine cytology.",
        organ: "Urine",
        methodology: "AIxURO trained on annotated urine cytology images; evaluated against TPS categories with expert validation and discrepancy analysis",
        data: "185 cytology samples categorized as NHGUC (168), AUC (14), SHGUC (2), and HGUC (1) according to TPS.",
        mainResults: "AIxURO improved accuracy and consistency, especially for atypical urothelial cells",
        tasks: "WSI Analysis"
    },
    {
        title: "Cellular spatial-semantic embedding for multi-label classification of cell clusters in thyroid fine needle aspiration biopsy whole slide images",
        publication: "Pattern Recognition Letters",
        year: "2025",
        application: "Multi-label classification of thyroid FNAB WSIs for CAD support.",
        organ: "Thyroid",
        methodology: "Cellular spatial-semantic embedding using wCvT encoder and Transformer decoder with category masking and ASL for FNAB-WSI classification",
        data: "Self-built FNAB-WSI cell cluster dataset",
        mainResults: "Achieved 90.26% accuracy with low parameter count and strong generalization",
        tasks: "WSI Analysis"
    },
    {
        title: "Deep learning model for diagnosis of thyroid nodules with size less than 1 cm: a multicenter, retrospective study",
        publication: "European Journal of Radiology Open",
        year: "2024",
        application: "AI enables early diagnosis of small thyroid nodules to reduce overtreatment.",
        organ: "Thyroid",
        methodology: "TNT-Net dual-channel model using transverse and longitudinal ultrasound images of thyroid nodules; compared with CNN and Swin Transformer",
        data: "9649 nodules (8455 patients) from five hospitals, divided into training, internal test, and external test datasets.",
        mainResults: "TNT-Net outperformed CNNs and Swin Transformer in thyroid nodule classification",
        tasks: "WSI Analysis"
    },
    {
        title: "An ensemble deep learning for automatic prediction of papillary thyroid carcinoma using fine needle aspiration cytology",
        publication: "Expert Systems with Applications",
        year: "2022",
        application: "DL-based CAD differentiates PTC from benign tissues to aid diagnosis.",
        organ: "Thyroid",
        methodology: "CNN-based framework using stain-normalized ThinPrep FNAC images; ROIs extracted with Canny edge detection; ensemble of DenseNet, ResNet, Inception",
        data: "Cytological FNAC images",
        mainResults: "DenseNet161 + ensemble reached 99.71% accuracy; Reinhard normalization best",
        tasks: "WSI Analysis"
    },
    {
        title: "Evaluating artificial intelligence–enhanced digital urine cytology for bladder cancer diagnosis",
        publication: "Cancer Cytopathology",
        year: "2024",
        application: "AIxURO enhances bladder cancer screening via urine cytology.",
        organ: "Bladder",
        methodology: "AIxURO compared with microscopy and WSI review for bladder cancer diagnosis per TPS; evaluated diagnostic metrics and observer agreement",
        data: "116 deidentified urine cytology slides (NHGUC: 86, AUC: 12, SHGUC: 11, HGUC: 7) from urology patients between 2021 and 2022, stained with Papanicolaou stain and digitized at 40× magnification.",
        mainResults: "AIxURO improved sensitivity and reduced screening time vs. microscopy and WSI",
        tasks: "WSI Analysis"
    },
    {
        title: "Quel apport de l’intelligence artificielle en cytologie urinaire ?what contribution can make artificial intelligence to urinary cytology?",
        publication: "Elsevier Masson",
        year: "2024",
        application: "AI improves urinary cytology under The Paris System for HGUC detection.",
        organ: "Urine",
        methodology: "Study explored AI to address TPS limitations in urinary cytology; highlighted reproducibility issues and lack of validated AI tools",
        data: "Not specified",
        mainResults: "AI can enhance TPS-based urinary cytology; few tools clinically validated",
        tasks: "WSI Analysis"
    },
    {
        title: "Deep learning-based computational cytopathologic diagnosis of metastatic breast carcinoma in pleural fluid",
        publication: "Cells",
        year: "2023",
        application: "DL assists metastatic breast carcinoma diagnosis in pleural fluid cytology.",
        organ: "Pleural and peritoneal effusions",
        methodology: "569 Pap-stained WSIs processed with z-stacking and color normalization; Inception-ResNet-V2 trained on patches for binary classification",
        data: "569 WSIs collected from AI-Hub\'s Open AI Dataset project, including 5506 WSIs for various cancer types and benign cases.",
        mainResults: "AI model outperformed pathologists in accuracy, sensitivity, and specificity",
        tasks: "WSI Analysis"
    },
    {
        title: "Breaking barriers in thyroid cytopathology: harnessing deep learning for accurate diagnosis",
        publication: "Bioengineering",
        year: "2025",
        application: "AI improves accuracy and interpretability in PTC diagnosis.",
        organ: "Thyroid gland",
        methodology: "TCS-CNN and AD-MIL frameworks for thyroid malignancy classification; achieved high accuracy and interpretable predictions",
        data: "151 whole-slide images (WSIs) of thyroid cancer cases, analyzed at both patch and bag levels.",
        mainResults: "TCS-CNN and AD-MIL achieved 96–97% accuracy with interpretable predictions",
        tasks: "WSI Analysis"
    },
    {
        title: "An ensemble deep learning for automatic prediction of papillary thyroid carcinoma using fine needle aspiration cytology",
        publication: "Expert Systems with Applications",
        year: "2022",
        application: "AI boosts confidence and accuracy in PTC diagnosis using FNAC images.",
        organ: "Thyroid gland",
        methodology: "High-res FNAC images segmented into ROIs; CNNs fine-tuned; ensemble learning and certainty computation used for patient-level prediction",
        data: "Digital FNAC images of papillary thyroid carcinoma (PTC), segmented into non-overlapping patches for training, validation, and testing.",
        mainResults: "DenseNet161 + ensemble achieved 99.71% accuracy; Reinhard normalization helped",
        tasks: "WSI Analysis"
    },
    {
        title: "Artificial intelligence in cytopathology: a neural network to identify papillary carcinoma on thyroid fine-needle aspiration cytology smears",
        publication: "Journal of pathology informatics",
        year: "2018",
        application: "ANN distinguishes PTC from other thyroid lesions in FNAC smears.",
        organ: "Thyroid gland",
        methodology: "ANN trained on 186 papillary and 184 non-papillary thyroid images; tested on 174 images; FNAC used as diagnostic reference",
        data: "186 microphotographs of papillary carcinoma and 184 microphotographs of nonpapillary thyroid lesions for training. 174 microphotographs used for testing. Images acquired at 10× and 40× magnifications.",
        mainResults: "ANN reached 85.06% accuracy; misclassified some benign follicular cells",
        tasks: "WSI Analysis"
    },
    {
        title: "Assessing the quality of whole slide images in cytology from nuclei features",
        publication: "Journal of Pathology Informatics",
        year: "2025",
        application: "Quality control module ensures ML reliability in digital pathology.",
        organ: "General",
        methodology: "Quality control module using nuclei feature distributions to validate WSI preparation protocols with weighted distance metrics",
        data: "Empirical analysis was conducted on WSIs from seven distinct preparation protocols. Additional validation was performed on a larger dataset from routine laboratory workflows.",
        mainResults: "Quality control module detected prep protocol issues with minimal data",
        tasks: "WSI Analysis"
    },
    {
        title: "A preliminary study of morphogo, a digital artificial intelligence (ai) tool for urine cytology analysis",
        publication: "Journal of the American Society of Cytopathology",
        year: "2022",
        application: "CNN-based Morphogo evaluates UC in urine cytology slides.",
        organ: "Urine",
        methodology: "CNN trained on 37 annotated ThinPrep urine slides; tested on 66 additional slides; Morphogo evaluated at different cell ID thresholds",
        data: "1910 benign and 1978 abnormal (atypical and above) cellular images were annotated for training. The test dataset included 66 urine cytology slides: 31 from non-cancer patients (hematuria, other diseases, and asymptomatic cases) and 35 from UC patients (4 low-grade UC, 31 high-grade UC).",
        mainResults: "Morphogo improved sensitivity and NPV at higher cell ID thresholds",
        tasks: "WSI Analysis"
    }
];

// Function to generate publication HTML (compressed format)
function generatePublicationHTML(pub, index) {
    return `
        <div class="col-12">
            <div class="card mb-2" data-year="${pub.year}" data-task="${pub.tasks}" data-organ="${pub.organ}">
                <div class="card-body py-2 px-3">
                    <div class="row align-items-center">
                        <div class="col-md-8">
                            <h6 class="card-title mb-1">${pub.title}</h6>
                            <div class="row">
                                <div class="col-md-6">
                                    <small class="text-muted d-block"><strong>Publication:</strong> ${pub.publication} (${pub.year})</small>
                                    <small class="text-muted d-block"><strong>Organ:</strong> <span class="text-primary">${pub.organ}</span></small>
                                </div>
                                <div class="col-md-6">
                                    <small class="text-muted d-block"><strong>Application:</strong> ${pub.application}</small>
                                    <small class="text-muted d-block"><strong>Methodology:</strong> ${pub.methodology}</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 text-end">
                            <div class="d-flex flex-wrap justify-content-end gap-1 mb-1">
                                <span class="badge bg-primary">${pub.year}</span>
                                <span class="badge bg-secondary">${pub.tasks}</span>
                            </div>
                            <div class="d-flex justify-content-end gap-1">
                                <button class="btn btn-sm btn-outline-primary" onclick="showPublicationDetails(${index})">Details</button>
                                <a href="#" class="btn btn-sm btn-outline-secondary">PDF</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Function to load publications into the page (sorted by year, descending)
function loadPublications() {
    const publicationList = document.getElementById('publicationList');
    if (publicationList) {
        // Sort publications by year (descending) and then by title
        const sortedPublications = [...publicationsData].sort((a, b) => {
            const yearA = parseInt(a.year) || 0;
            const yearB = parseInt(b.year) || 0;
            if (yearB !== yearA) {
                return yearB - yearA; // Descending by year
            }
            return a.title.localeCompare(b.title); // Ascending by title if same year
        });

        publicationList.innerHTML = sortedPublications.map((pub, index) => generatePublicationHTML(pub, index)).join('');
    }
}

// Function to show publication details in a modal
function showPublicationDetails(index) {
    const pub = publicationsData[index];
    if (!pub) return;

    const modalHTML = `
        <div class="modal fade" id="publicationModal" tabindex="-1" aria-labelledby="publicationModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="publicationModalLabel">${pub.title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <p><strong>Publication:</strong> ${pub.publication}</p>
                                <p><strong>Year:</strong> ${pub.year}</p>
                                <p><strong>Application:</strong> ${pub.application}</p>
                                <p><strong>Organ:</strong> ${pub.organ}</p>
                                <p><strong>Tasks:</strong> ${pub.tasks}</p>
                            </div>
                            <div class="col-md-6">
                                <p><strong>Methodology:</strong> ${pub.methodology}</p>
                                <p><strong>Data:</strong> ${pub.data}</p>
                                <p><strong>Main Results:</strong> ${pub.mainResults}</p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <a href="#" class="btn btn-primary">View PDF</a>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal if any
    const existingModal = document.getElementById('publicationModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('publicationModal'));
    modal.show();
}
