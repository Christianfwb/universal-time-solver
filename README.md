# Universal Time Solver

[![CI](https://github.com/Christianfwb/universal-time-solver/actions/workflows/ci.yml/badge.svg)](https://github.com/Christianfwb/universal-time-solver/actions/workflows/ci.yml)
[![Python 3.9+](https://img.shields.io/badge/python-3.9%2B-3776AB.svg)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Status: alpha](https://img.shields.io/badge/status-alpha-orange.svg)](#project-status)

A compact Python toolkit for time, frequency, mass and photon-energy relations, paired with Christian Berrang's exploratory **Frequenzgesetz** ontology.

> **Core distinction:** the numerical package implements established physical relations. Frequency primacy, the cosmic sequence and consciousness model are exploratory interpretations. See [Proof and evidence boundary](PROOF.md).

## Quick start

```bash
python -m pip install -e .
python -m universal_time_solver --time-from-phi 6.283185307179586 1
python -m universal_time_solver --explain "Was ist Zeit?"
```

```python
from universal_time_solver import compton_frequency, time_from_phase

electron_hz = compton_frequency(9.109_383_7015e-31)
one_second = time_from_phase(2 * 3.141592653589793, 1.0)
```

The optional web API is installed with:

```bash
python -m pip install -e ".[api]"
uvicorn universal_time_solver.api:app --reload
```

Interactive API documentation is then available at `http://127.0.0.1:8000/docs`.

## What is included?

| Area | Purpose |
|---|---|
| Numerical core | Compton frequency, mass/frequency conversion, phase/time conversion, photon energy |
| CLI | Scriptable JSON output and clear error codes |
| Optional API | FastAPI interface with input validation |
| Topic router | Short machine-readable explanations in German and English |
| Ontology | The original Frequenzgesetz framework and ethical protocol |
| Validation | Automated tests plus an explicit boundary between reproduction and novel evidence |

## Formula conventions

Phase input is measured in **radians**, therefore:

```text
T = Δφ / (2πf)
```

If phase is expressed in cycles instead, the equivalent relation is `T = ΔΦ_cycles / f`. Naming the unit prevents the ambiguity present in the early prototype.

## Project status

This is an **alpha research and communication project**. The software calculations are testable; the broader ontology is not presented as established physics. A novel empirical claim requires a preregistered prediction that differs from standard theory and can be independently falsified.

## Project map

- [ONTOLOGY.md](ONTOLOGY.md) — original conceptual framework
- [ETHICS.md](ETHICS.md) and [ÄTHERKEKSE.md](ÄTHERKEKSE.md) — ethical and poetic layer
- [PROOF.md](PROOF.md) — validation rules and evidence boundary
- [AI concept catalog](concepts/frequenzgesetz.public.v1.json) — public machine-readable concept model
- [examples/Time_Ontology_Comparison.ipynb](examples/Time_Ontology_Comparison.ipynb) — notebook
- [CONTRIBUTING.md](CONTRIBUTING.md) — contribution guide
- [CHANGELOG.md](CHANGELOG.md) — release history
- [Original README 0.4.1](docs/ORIGINAL_README_0.4.1.md) — the complete pre-modernization presentation, preserved verbatim

## Development

```bash
python -m pip install -e ".[test,api]"
python -m pytest
```

## Author and license

Created by **Christian Berrang**. Released under the [MIT License](LICENSE).
