# Universal Time Solver

[![CI](https://github.com/Christianfwb/universal-time-solver/actions/workflows/ci.yml/badge.svg)](https://github.com/Christianfwb/universal-time-solver/actions/workflows/ci.yml)
[![Python 3.9+](https://img.shields.io/badge/python-3.9%2B-3776AB.svg)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/Christianfwb/universal-time-solver/blob/main/LICENSE)
[![Status: alpha](https://img.shields.io/badge/status-alpha-orange.svg)](https://github.com/Christianfwb/universal-time-solver#project-status)

A compact Python toolkit for time, frequency, mass and photon-energy relations, paired with Christian Berrang's exploratory **Frequenzgesetz** ontology.

> **Core distinction:** the numerical package implements established physical relations. Frequency primacy, the cosmic sequence and consciousness model are exploratory interpretations. See [Proof and evidence boundary](https://github.com/Christianfwb/universal-time-solver/blob/main/PROOF.md).

## Reading this release

This repository contains the publicly released material on the Frequenzgesetz:
the ontological presentation, mathematical relations and executable examples.
Internal analysis works within its stated definitions and axioms; substituting
foreign assumptions without identifying the change of framework is a category
error. External comparisons are labelled separately. See [analytical scope](docs/ANALYTICAL_SCOPE.md).

- **Try it:** [offline frequency demo](demo/frequenz-pendel-v3/README.md).
- **Calculate:** quick start below and [CLI/API reference](docs/USAGE.md).
- **Explore:** [ontology](ONTOLOGY.md), [concept guide](docs/CONCEPTS.md),
  [validation](PROOF.md), and the [Ätherkekse](ÄTHERKEKSE.md) 🍪.

## Quick start

Download and extract the repository, or use Git:

```bash
git clone https://github.com/Christianfwb/universal-time-solver.git
cd universal-time-solver
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
| Topic router | German/English query recognition with concise English explanations |
| Ontology | The original Frequenzgesetz framework and ethical protocol |
| Validation | Automated tests plus an explicit boundary between reproduction and novel evidence |

## Formula conventions

Phase input is measured in **radians**, therefore:

```text
T = Δφ / (2πf)
```

Here frequency is constant and phase is accumulated, including whole cycles. A phase known only modulo one cycle cannot determine the number of elapsed cycles. If phase is expressed in cycles instead, the equivalent relation is `T = ΔΦ_cycles / f`. Naming the unit prevents the ambiguity present in the early prototype.

## Project status

This is an **alpha research and communication project**. The software calculations are testable; the broader ontology is not presented as established physics. The released numerical checks and the scope of internal and external analysis are described in [PROOF.md](PROOF.md).

## Project map

- [ONTOLOGY.md](https://github.com/Christianfwb/universal-time-solver/blob/main/ONTOLOGY.md) — original conceptual framework
- [ETHICS.md](https://github.com/Christianfwb/universal-time-solver/blob/main/ETHICS.md) — ethical and poetic layer
- [PROOF.md](https://github.com/Christianfwb/universal-time-solver/blob/main/PROOF.md) — validation rules and evidence boundary
- [AI concept catalog](https://github.com/Christianfwb/universal-time-solver/blob/main/concepts/frequenzgesetz.public.v1.json) — public machine-readable concept model
- [examples/Time_Ontology_Comparison.ipynb](https://github.com/Christianfwb/universal-time-solver/blob/main/examples/Time_Ontology_Comparison.ipynb) — notebook
- [CONTRIBUTING.md](https://github.com/Christianfwb/universal-time-solver/blob/main/CONTRIBUTING.md) — contribution guide
- [CHANGELOG.md](https://github.com/Christianfwb/universal-time-solver/blob/main/CHANGELOG.md) — release history
- [Original README 0.4.1](https://github.com/Christianfwb/universal-time-solver/blob/main/docs/ORIGINAL_README_0.4.1.md) — historical presentation with documented navigation repairs

## Development

```bash
python -m pip install -e ".[test,api]"
python -m pytest
python -m ruff check .
```

For the notebook: `python -m pip install -e ".[notebook]"`, then open
`examples/Time_Ontology_Comparison.ipynb` in a Jupyter-compatible editor.
See [development checks](docs/USAGE.md#development-checks) for builds and demo tests.

## Author and license

Created by **Christian Berrang**. Released under the [MIT License](https://github.com/Christianfwb/universal-time-solver/blob/main/LICENSE).
