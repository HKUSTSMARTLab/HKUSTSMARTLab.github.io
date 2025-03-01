---
title: Computational Cytology
layout: default
group: computational_cytology
---

<h1>Computational Cytology</h1>
Invovled research personnel: [Hao Jiang](https://hjiangaz.github.io/), [Cheng Jin](https://academic.peterkam.top/) 

<img class="rounded mx-auto d-block" src="/static/img/research/computational_cytology.png" alt="ai4ccyto" style="width: 75%; height: auto;">

Welcome to the Computational Cytology project page! This project aims to understand the underlying mechanisms of cytological images and develop deep learning models for automated cytological image analysis. We focus on the following research directions:

1. **Data Standardization**: We develop data standardization techniques to preprocess cytological images and ensure the quality of the training data.
2. **Advanced Algorithms for Cell-Level and WSI-level Analysis**: We design deep learning models for cell detection, segmentation, classification, and quantification in cytological images.
3. **Applications in Early Cancer Detection**: We apply deep learning models to early cancer detection tasks, such as cervical cancer screening, to reduce cytologists' workload and improve diagnostic accuracy.
4. **Integrated Systems for Imaging and Human-Machine Collaboration**: We build integrated systems that combine imaging devices, deep learning models, and human-machine collaboration for cytological image analysis.

We have also collected current research datasets in the field of computational cytology below:

<div class="container-fluid p-3">
    <h2 class="mb-4">Private Datasets</h2>
    <div class="table-responsive">
        <table class="table table-striped table-bordered table-hover">
            <thead class="bg-dark text-white">
                <tr>
                    <th scope="col">Dataset</th>
                    <th scope="col">Number</th>
                    <th scope="col">Task</th>
                    <th scope="col">Organ</th>
                    <th scope="col">Level</th>
                </tr>
            </thead>
            <tbody class="align-middle">
                <tr>
                    <td>CCS-123K</td>
                    <td>123,549 (48 Centers)</td>
                    <td>Whole Slide Image Classification</td>
                    <td>Cervical</td>
                    <td>Whole Slide Image</td>
                </tr>
                <tr>
                    <td>CCS-Cell</td>
                    <td>104,979 (13 Centers)</td>
                    <td>Cell Detection</td>
                    <td>Cervical</td>
                    <td>Cell-level</td>
                </tr>
                <tr>
                    <td>CPS</td>
                    <td>137 Images, 9,255 Masks</td>
                    <td>Cell Segmentation</td>
                    <td>Cervical</td>
                    <td>Cell-level</td>
                </tr>
                <tr>
                    <td>Urine</td>
                    <td>1,030 Whole Slide Images</td>
                    <td>Whole Slide Image Classification</td>
                    <td>Urine</td>
                    <td>Whole Slide Image</td>
                </tr>
                <tr>
                    <td>PWH</td>
                    <td>2,616 Whole Slide Images</td>
                    <td>Whole Slide Image Classification</td>
                    <td>Mixed</td>
                    <td>Whole Slide Image</td>
                </tr>
            </tbody>
        </table>
    </div>

    <h2 class="my-4">Public Datasets</h2>
    <div class="table-responsive">
        <table class="table table-striped table-bordered table-hover">
            <thead class="bg-dark text-white">
                <tr>
                    <th scope="col">Dataset</th>
                    <th scope="col">Number</th>
                    <th scope="col">Task</th>
                    <th scope="col">Organ</th>
                    <th scope="col">Level</th>
                </tr>
            </thead>
            <tbody class="align-middle">
                <tr>
                    <td>ISBI2014</td>
                    <td>945 Images</td>
                    <td>Instance Segmentation</td>
                    <td>Cervical</td>
                    <td>Cell-level</td>
                </tr>
                <tr>
                    <td>CNSeg</td>
                    <td>3,010 Images</td>
                    <td>Segmentation</td>
                    <td>Cervical</td>
                    <td>Cell-level</td>
                </tr>
                <tr>
                    <td>SegPC</td>
                    <td>775 Images</td>
                    <td>Instance Segmentation</td>
                    <td>Plasma Bone</td>
                    <td>Cell-level</td>
                </tr>
                <tr>
                    <td>HiCervix</td>
                    <td>40,229 Images</td>
                    <td>Classification</td>
                    <td>Cervical</td>
                    <td>Cell-level</td>
                </tr>
                <tr>
                    <td>Sipakmed</td>
                    <td>4,049 Images</td>
                    <td>Image Classification</td>
                    <td>Cervical</td>
                    <td>Cell-level</td>
                </tr>
            </tbody>
        </table>
    </div>

    <h2 class="my-4">Exploratory Tasks</h2>
    <div class="table-responsive">
        <table class="table table-striped table-bordered table-hover">
            <thead class="bg-dark text-white">
                <tr>
                    <th scope="col">Task</th>
                    <th scope="col">Extra Information</th>
                </tr>
            </thead>
            <tbody class="align-middle">
                <tr>
                    <td>Survival Prognosis</td>
                    <td class="text-wrap">Paired Report & Histology</td>
                </tr>
                <tr>
                    <td>Cancer Origin Prediction</td>
                    <td class="text-wrap">Dataset Request Sent</td>
                </tr>
                <tr>
                    <td>Single-Cell Correlation Discovery</td>
                    <td class="text-wrap">Paired Image</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>



<hr style="margin-top: 20px; margin-bottom: 20px" />

<small>
    If you find this project helpful, please consider referencing it in your research papers in the following format:
    <br />
    <!-- in bibtext code format -->
    <code>
        @article{jiang2023deep,
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;title = {Deep learning for computational cytology: A survey},
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;author = {Jiang, Hao and Zhou, Yanning and Lin, Yi and Chan, Ronald CK and Liu, Jiang and Chen, Hao},
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;journal = {Medical Image Analysis},
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;volume = {84},
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;pages = {102691},
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;year = {2023},
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;publisher = {Elsevier}
        <br />
        }
    </code>
    <br />
    <!-- in bibtext code format -->
    <code>
        @article{jiangjin2025generalizable,
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;title = {Generalizable Cervical Cancer Screening via Large-scale Pretraining and Test-Time Adaptation},
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;author = {Jiang, Hao and Jin, Cheng and Lin, Huangjing and Zhou, Yanning and Wang, Xi and Ma, Jiabo and Ding, Li and Hou, Jun and Liu, Runsheng and Chai, Zhizhong and others},
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;journal = {arXiv preprint arXiv:2502.09662},
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;year = {2025}
        <br />
        }
    </code>
</small>

<p class="my-5 text-center">
<small>
    <i> Last Update: {{'now' | date: "%h %d, %Y"}} </i>
    <br />
    &copy; 2025 <a href="https://hkustsmartlab.github.io/" target="_blank">HKUST Smart Lab</a>
</small>
</p>
