# CLI and API reference

Install from the repository root: `python -m pip install -e .`.
Both `python -m universal_time_solver` and `universal-time-solver` invoke the CLI.

| Calculation | CLI option | API method and path | CLI / API result key |
|---|---|---|---|
| Compton frequency | `--m KG` | GET `/compute/compton-frequency?m_kg=…` | `f_hz` |
| Mass | `--f HZ` | GET `/compute/mass-from-frequency?f_hz=…` | `m_kg` |
| Duration | `--time-from-phi RAD HZ` | POST `/compute/time-from-phase` | `T_seconds` / `time_seconds` |
| Photon energy | `--photon-energy-lambda METRES` | GET `/compute/photon-energy?lambda_m=…` | `E_eV` / `energy_eV` |
| Energy | `--energy-from-f HZ` | GET `/compute/energy-from-frequency?f_hz=…` | `E_joules` / `energy_joule` |
| Explanation | `--explain TEXT` | GET `/explain?q=…` | Topic-specific object |

Time POST body: `{"delta_phi_rad": 6.283185307179586, "f_hz": 1}`.
The different historical result keys are retained for compatibility.

All inputs must be finite. Mass and energy-conversion frequencies are nonnegative;
time frequency and wavelength are strictly positive. Phase may be signed and is
accumulated in radians. Results outside the representable float range are rejected.
Zero phase returns zero duration; zero frequency is outside this calculation's domain.

The CLI emits strict JSON on success (exit 0); invalid input produces a message on
stderr and exit 2. No arguments shows help. An unknown explanation returns a note.
API domain/range errors return 400; malformed or missing request fields return 422.
Install `.[api]` and run `uvicorn universal_time_solver.api:app --reload` for local
use. Interactive OpenAPI documentation is at `http://127.0.0.1:8000/docs`.

Query recognition accepts German and English; the explanation text is primarily English.
Use `--explain help` for canonical topics, all of which are routed.

## Development checks

```bash
python -m pip install -e ".[api,test,notebook]" build
python -m pytest
python -m ruff check .
python -m build
```

The source distribution includes the catalog needed by its tests. The wheel contains
the Python software and typing marker; the notebook, ontology and catalog remain
repository/source-release resources. See the [demo guide](../demo/frequenz-pendel-v3/README.md)
for Node and browser tests. CI tests the source archive and wheel separately.
