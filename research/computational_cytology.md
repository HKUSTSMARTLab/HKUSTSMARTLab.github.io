---
title: Computational Cytology
layout: default
group: computational_cytology
---

<script>
    function isMobileDevice() {
        return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    }

    window.onload = function () {
        if (isMobileDevice()) {
            alert(
                'This website is not optimized for mobile devices. Please use a desktop browser for the best experience.',
            );
        }
    };
</script>

<h1>Computational Cytology</h1>
Welcome to the Computational Cytology project page! This project aims to understand the underlying mechanisms of cytological images and develop deep learning models for automated cytological image analysis. We focus on the following research directions:

1. **Data Standardization**: We develop data standardization techniques to preprocess cytological images and ensure the quality of the training data.
2. **Advanced Algorithms for Cell-Level and WSI-level Analysis**: We design deep learning models for cell detection, segmentation, classification, and quantification in cytological images.
3. **Applications in Early Cancer Detection**: We apply deep learning models to early cancer detection tasks, such as cervical cancer screening, to reduce cytologists' workload and improve diagnostic accuracy.
4. **Integrated Systems for Imaging and Human-Machine Collaboration**: We build integrated systems that combine imaging devices, deep learning models, and human-machine collaboration for cytological image analysis.


<hr style="margin-top: 20px; margin-bottom: 20px" />

    <p>
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
    </p>
    <p class="my-5 text-center">
        <small>
            <i> Last Update: {{'now' | date: "%h %d, %Y"}} </i>
            <br />
            &copy; 2025 <a href="https://hkustsmartlab.github.io/" target="_blank">HKUST Smart Lab</a>
        </small>
    </p>
