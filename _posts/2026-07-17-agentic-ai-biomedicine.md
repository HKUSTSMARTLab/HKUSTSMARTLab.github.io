---
published: True
title: '[IEEE RBME] The Next Paradigm in Medical AI: A Survey of Agentic AI in Biomedicine'
author: Cheng Jin
layout: post
group: news
cover: /static/img/news/2026_agentic_ai_cover.png
oneline_description: 'A methodological review led by HKUST SmartX Lab presents a unified framework for defining, classifying, evaluating, and governing agentic AI systems in biomedicine.'
last_updated: 2026/07/17
---

Recently, the methodological review "The Next Paradigm in Medical AI: A Survey of Agentic AI in Biomedicine," led by the HKUST SmartX Lab, was published online in **<font color="red">IEEE Reviews in Biomedical Engineering</font>** (Impact Factor: 16).

This article systematically reviews the emerging transition of biomedical artificial intelligence from static predictive models to agentic AI systems. Such systems can maintain task-relevant state, plan and execute multi-step workflows, invoke external tools, adapt subsequent decisions based on feedback, and operate under explicit human and institutional oversight.

The review provides an operational definition of biomedical agency, distinguishes fully realized agentic systems from models with only partial agent-enabling capabilities, and traces the development pathway from biomedical foundation-model pretraining through domain adaptation to governable agentic systems. It also introduces a three-axis taxonomy of biomedical agents, surveys major clinical and scientific applications, develops a comprehensive evaluation framework, and discusses the challenges and future directions for reliable and accountable deployment.

## Introduction

Artificial intelligence has demonstrated strong performance in medical image analysis, clinical text processing, electronic health record interpretation, diagnostic support, and biomedical research. Most conventional AI models, however, are static one-shot predictors: they receive an input and directly produce an output without maintaining a continuously updated internal state or dynamically adapting subsequent actions to intermediate observations.

Real-world biomedical workflows are substantially more complex. Clinical decision-making often involves multiple sequential steps, heterogeneous data sources, changing patient information, institutional policies, specialized software tools, and repeated interactions between clinicians and computational systems. A complete diagnostic process, for example, may require retrieving prior examinations, analyzing medical images, consulting clinical guidelines, ordering additional tests, reassessing uncertainty, and escalating difficult cases to specialists.

These demands are driving the development of agentic biomedical AI. Rather than producing a single prediction, an agentic system operates through a closed loop: **perceive, plan, act, and observe**. It maintains task-relevant information across steps, selects actions based on intermediate results, invokes external tools when needed, and updates subsequent decisions in response to new observations.

The term "agent" is currently used inconsistently in the literature. Some models are described as agentic merely because they incorporate retrieval-augmented generation, chain-of-thought prompting, or a single tool call, even when they lack persistent state, conditional decision-making, or a complete feedback loop. To address this conceptual ambiguity, the review clearly distinguishes individual agent-enabling capabilities from fully realized agency.

Focusing on advances from 2022 to 2026, the review examines how foundation models are evolving into biomedical and clinical agents with state management, tool use, multimodal understanding, and governability.

<img src="/static/img/news/2026_agentic_ai1.png" alt="Conceptual workflow of biomedical agentic AI" style="width: 100%;"/>

The conceptual workflow integrates heterogeneous biomedical input modalities with six core agent-enabling capabilities: planning, tool use, memory, dialogue, collaboration, and reflection. The resulting systems can orchestrate workflows for diagnosis, therapeutic planning, drug discovery and design, scientific discovery, education and simulation, and biomedical data analysis and retrieval.

## Conceptual Framework and Taxonomy

### What Qualifies as a Biomedical Agent?

The review defines a fully realized biomedical agentic system as one that maintains task-relevant state across multiple steps, selects conditional actions based on intermediate observations, updates subsequent decisions according to the outcomes of prior actions, and operates within a closed perceive-plan-act-observe loop.

In high-risk biomedical settings, this loop must also be subject to explicit governance constraints, including human oversight, access control, auditability, uncertainty management, and predefined escalation mechanisms. The review therefore does not treat every system with reasoning, retrieval, or tool-calling functions as a complete agent. Instead, these functions are foundational components that can be composed and orchestrated to produce agentic behavior.

### Six Core Agent-Enabling Capabilities

Biomedical agents are organized around six core capabilities. **Memory** maintains clinical context and retrieves relevant knowledge, prior cases, medical guidelines, and historical interactions. **Planning** decomposes complex objectives into coordinated subtasks. **Reflection** supports self-evaluation, uncertainty estimation, result verification, and selective abstention when evidence is insufficient. **Tool use** connects agents to clinical information systems, databases, medical AI models, and laboratory platforms. **Dialogue** enables context-aware communication and shared decision-making. **Collaboration** allows specialized agents and human experts to work together through structured roles, shared information, and verification mechanisms.

### A Three-Axis Taxonomy

The review proposes three complementary dimensions for systematically describing and comparing biomedical agents.

**Modality.** Agents may process medical text, medical images, molecular and chemical data, structured health records, physiological time series, or multimodal combinations of these data types.

**Cognitive complexity.** Systems may progress from basic reactive behavior to deliberative planning, feedback-based learning, and collaborative multi-agent reasoning.

**Degree of autonomy.** Agents may be scripted systems that follow predefined workflows, guided agents that operate under human supervision, or autonomous agents that generally function only in highly controlled and explicitly governed environments.

This taxonomy captures both technical capability and operational boundaries rather than reducing all systems to a binary distinction between "agent" and "non-agent."

<img src="/static/img/news/2026_agentic_ai2.png" alt="Agentic workflow for breast cancer diagnosis" style="width: 100%;"/>

The breast cancer diagnosis case study illustrates how the perceive-plan-act-observe loop can operate in practice. During perception, the agent combines clinical images and electronic health record metadata with semantic memory containing medical guidelines and episodic memory containing prior clinical cases. During planning and action, it decomposes the diagnostic objective into retrieving prior scans, localizing and assessing the lesion, and invoking specialized tools to generate a preliminary report. During observation, a selective-abstention module evaluates confidence in the model output and the integrated diagnosis. Low-confidence cases are escalated to a radiologist for explicit supervision and feedback, while verified results return to the closed loop for continued calibration and safe operation.

### From Biomedical Foundation Models to Agentic Systems

The review also maps the technical pathway through which biomedical foundation models acquire capabilities needed for agentic workflows. Pretraining encompasses language-only biomedical foundation models, bioinformatics and molecular foundation models, vision-language models, and multimodal foundation models. These models can then be adapted through prompting and alignment, parameter-efficient fine-tuning, retrieval and knowledge augmentation, and cognitive augmentation for planning, memory, reflection, validation, and tool integration.

These steps do not automatically produce agency. Rather, they provide the perceptual, reasoning, and interactive capabilities required to support stateful and governable agentic behavior.

<img src="/static/img/news/2026_agentic_ai3.png" alt="Pretraining and adaptation pathways for biomedical foundation agents" style="width: 100%;"/>

The end-to-end pathway connects biomedical foundation-model pretraining to downstream adaptation. Language, molecular, vision-language, and multimodal foundation models can be enhanced through alignment, lightweight fine-tuning, memory, planning, validation, and tool integration to support agentic behavior in clinical and scientific workflows.

## Applications, Evaluation, and Key Findings

### Applications of Biomedical Agentic AI

The review organizes current and emerging applications into four major areas.

In **diagnosis and therapeutic planning**, agentic systems can coordinate information retrieval, multimodal data interpretation, test selection, disease diagnosis, report generation, and treatment planning. Representative applications include medical imaging assistants, electronic-health-record-based diagnostic agents, adaptive clinical decision-support systems, and agents that assist with interventional procedures or surgery.

In **medical education and simulation**, agents can act as virtual patients, adaptive tutors, assessment assistants, and interactive simulation environments. Unlike fixed branching dialogue scripts, these systems can respond dynamically to learner questions while preserving clinical consistency and providing structured feedback.

In **drug discovery and design**, agents can plan chemical synthesis routes, retrieve scientific evidence, invoke cheminformatics tools, evaluate molecular constraints, generate experimental protocols, and coordinate robotic laboratory systems. Existing evidence generally supports hybrid architectures in which foundation models perform high-level planning while specialized deterministic tools execute precise chemical and experimental operations.

In **scientific discovery and biomedical data analysis**, agentic systems are being applied to literature synthesis, hypothesis generation, experimental design, bioinformatics analysis, automated tool discovery, and autonomous laboratory coordination.

### Evaluation Beyond Final-Answer Accuracy

Traditional endpoint metrics such as accuracy and area under the curve are insufficient for evaluating agentic systems. A system can produce the correct final answer while following an unsafe, irreproducible, or clinically noncompliant reasoning and execution process.

The review therefore argues that biomedical agents should be evaluated as constrained sequential decision systems. Evaluation should address the fidelity of plans and intermediate actions, the efficiency and correctness of tool use, evidence grounding and data provenance, uncertainty handling and selective abstention, failure recovery, robustness and safety, the effectiveness of human oversight, and real-world clinical utility and operational feasibility.

The article also surveys representative benchmarks that expose intermediate behavioral signals, including multi-turn interactions, tool-call trajectories, dynamic internal state, reasoning steps, expert actions, and evidence annotations.

### Key Findings

A central conclusion is that tool use alone does not establish full agency. Likewise, retrieval-augmented generation, chain-of-thought prompting, or multi-agent dialogue should not automatically be treated as sufficient evidence of a complete agentic system. Full biomedical agency requires persistent task-relevant state, conditional action, intermediate observations, and closed-loop updating.

The literature also indicates that fully autonomous deployment remains insufficiently validated for most high-risk clinical settings. A more practical path to clinical translation is the guided-agent model, incorporating selective abstention, transparent evidence, auditable execution traces, and explicit human approval checkpoints.

## Conclusion and Outlook

This review provides a unified framework for understanding the evolution of biomedical foundation models into agentic AI systems. Its primary contribution is not a single new model, but a systematic conceptual and technical foundation for designing, comparing, evaluating, and governing biomedical agents.

Several major challenges remain. **Data and provenance governance** must address sensitive, heterogeneous, multi-institutional data through stronger privacy protection, transparent data-flow records, version tracking, model and tool update documentation, and machine-readable evidence for decisions.

**Process fidelity and execution reliability** require more than a correct final output. Agentic systems may violate tool preconditions, misinterpret tool outputs, depend on undocumented assumptions, or generate plausible but unsafe execution plans. Typed tool interfaces, schema validation, execution monitoring, and reproducible audit trails are therefore needed to improve reliability.

**Robustness, adversarial safety, and operational feasibility** must be maintained as imaging devices, patient populations, clinical documentation styles, institutional policies, and external tools change. Agents must remain dependable under missing modalities, distribution shifts, tool failures, and strict latency and computing constraints. They must also resist prompt injection, retrieval-data poisoning, and tool manipulation, because these threats can propagate and amplify through multi-step closed-loop workflows.

The review identifies three principal research directions. **Dynamic general-purpose medical agents** should integrate heterogeneous modalities, adapt to institutional requirements, and update knowledge without sacrificing stability. **Trustworthy and privacy-preserving agents at scale** will require risk-tiered autonomy, selective abstention, policy-based escalation, tamper-evident audit logs, federated learning, local adaptation, and reliable de-identification. **Collaborative intelligence in healthcare workflows** should clearly divide responsibilities between clinicians and agents while enabling specialized agents to cooperate through auditable planner-executor-reviewer architectures.

Ultimately, biomedical agentic AI should not be judged by autonomy alone. Meaningful progress depends on whether these systems become reliable, transparent, governable, and clinically useful collaborators while ensuring that humans retain final responsibility for high-risk medical decisions.

---

## Resources

**Paper:** [The Next Paradigm in Medical AI: A Survey of Agentic AI in Biomedicine](https://doi.org/10.1109/RBME.2026.3704162), IEEE Reviews in Biomedical Engineering, 2026.
