# Layered Emergence Model

## Public release and analytical scope

This repository contains the publicly released material on the Frequenzgesetz:
its ontological presentation, mathematical relations and executable examples.

An internal analysis uses the ontology's own definitions, axioms and intended
categories. Silently replacing them with assumptions from another framework and
calling the result an internal refutation is a category error. Internal analysis
can still identify contradictions, undefined terms or invalid deductions within
the stated framework.

External comparisons are explicitly identified as external comparisons. Empirical
assessment concerns observable predictions and reproducible results. These are
different questions from internal coherence; neither is answered by silently
switching between the two. Reproducing a known equation verifies that calculation,
not a new causal interpretation by itself.

This document presents the public ontological structure of Christian Berrang's Frequenzgesetz. It is a conceptual model for discussing how timeless potential, periodic structure and measurable physical duration might relate.

> **Status:** The layer sequence is an exploratory ontology. The phase-to-time relation is operational mathematics. The mathematical relation does not by itself prove the causal interpretation.

## The model at a glance

~~~mermaid
flowchart TB
    N["Potential Layer<br/>Null Space"]
    K["Initiating Structure<br/>Light / Kernel"]
    F["Pattern Layer<br/>Frequency Space"]
    P["Transition<br/>Phase differentiation"]
    T["Manifest Layer<br/>Temporal reality"]

    N --> K
    K --> F
    F --> P
    P --> T
~~~

In compact form:

~~~text
POTENTIAL → INITIATING PULSE → FREQUENCY PATTERN
          → PHASE DIFFERENTIATION → MEASURABLE DURATION
~~~

## 1. Potential layer — Null Space

The model begins with a state called **Null Space**: timeless potential without an assumed human-scale spatial geometry. This is an ontological starting point, not a measured physical vacuum and not a claim that present physics has experimentally identified such a state.

Its purpose in the model is to name what precedes differentiation.

## 2. Initiating structure — Light / Kernel

**Light / Kernel** names the first ordering event: the conceptual transition from undifferentiated potential to pulse, cycle and wave.

“Kernel” is used as a metaphor for a minimal generative rule. It should not be confused with a literal computer program or with the complete electromagnetic theory of light.

## 3. Pattern layer — Frequency Space

**Frequency Space** is the model's name for an atemporal order of possible periodic patterns. It represents structure or blueprint rather than ordinary three-dimensional location.

At this level, frequency describes repeatability. Phase makes positions within a cycle distinguishable. This distinction prepares the transition from an ordered pattern to operationally measurable duration.

## 4. Transition — Phase differentiation

A phase difference records how far an oscillation has advanced. The unit must be stated explicitly:

- phase in cycles: **T = ΔΦ_cycles / f**
- phase in radians: **T = Δφ_rad / (2πf)**

The two expressions are equivalent because one complete cycle equals **2π** radians.

This is the mathematically testable bridge in the model. For example, one complete cycle at **1 Hz** lasts exactly one second:

~~~text
T = 2π / (2π × 1 Hz) = 1 s
~~~

## 5. Manifest layer — Temporal reality

**Temporal reality** is the layer in which ordered changes can be counted, compared and experienced as duration. The ontology interprets linear time as an interface or buffer between an atemporal pattern description and sequential physical observation.

That interpretation goes beyond the equation. The equation tells us how phase, frequency and duration relate; it does not establish that time is metaphysically produced by another realm.

## Reading the arrows correctly

The arrows express the proposed explanatory order:

1. potential permits differentiation;
2. differentiation begins as an ordering pulse;
3. repetition establishes frequency;
4. phase distinguishes states within repetition;
5. distinguishable change permits operational duration.

They do **not** yet represent experimentally established causal transitions. Turning an arrow into physics requires a defined mechanism, a quantitative prediction that differs from existing theory and an independent test capable of falsifying it.

## Scope and evidence boundary

The public model deliberately remains at the level shown above. It makes no hidden biological, linguistic or material-mechanism claims.

The project therefore separates three kinds of statement:

| Kind | Example | Status |
|---|---|---|
| Definition | One cycle is **2π** radians | Mathematical convention |
| Reproducible relation | **T = Δφ/(2πf)** | Operational and testable |
| Ontological interpretation | Temporal reality emerges through phase differentiation | Exploratory hypothesis |

This separation preserves the central idea while making clear which parts can already be calculated and which parts still need new evidence.

## Relationship to the software

The Python function **time_from_phase(delta_phi_rad, f_hz)** implements the radians form exactly. Automated tests verify complete and half-cycle examples and reject invalid frequencies.

See also:

- [README.md](README.md) for installation and use
- [PROOF.md](PROOF.md) for the evidence boundary
- [docs/ORIGINAL_ONTOLOGY.md](docs/ORIGINAL_ONTOLOGY.md) for the complete pre-modernization ontology file
