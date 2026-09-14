"""Short, machine-readable explanations for the router and API."""


def explain_time_short() -> dict:
    return {
        "title": "Time via phase and frequency",
        "definition": "For phase measured in radians: T = Δφ / (2πf).",
        "notes": [
            "The numerical relation is standard.",
            "Time as emergent from distinguishable states is the framework's interpretation.",
        ],
    }


def explain_mass_short() -> dict:
    return {
        "title": "Mass and frequency",
        "definition": "m = hf/c² follows from E = hf and E = mc².",
        "notes": [
            "The algebra is standard; 'solidified oscillation' is an ontological interpretation."
        ],
    }


def explain_frequency_primary_short() -> dict:
    return {
        "title": "Frequency as primary",
        "definition": "E = hf, equivalently f = E/h.",
        "notes": [
            "Frequency primacy is a proposed causal interpretation, not established by rearrangement alone."
        ],
    }


def explain_consciousness_short() -> dict:
    return {
        "title": "Consciousness as resonant oscillation",
        "definition": "I = F(f, ΔΦ, R)",
        "notes": [
            "This is a conceptual hypothesis; the function and falsifiable predictions remain open."
        ],
    }


def explain_cosmic_algorithm_short() -> dict:
    return {
        "title": "The cosmic algorithm",
        "sequence": "NULLSPACE → LIGHT_STRUCTURE → FREQUENCY → PHASE → TIME → MASS → RESONANCE",
        "notes": ["A compact statement of the project's exploratory ontology."],
    }


def explain_proof_protocol() -> dict:
    return {
        "title": "Validation path",
        "steps": [
            "Check dimensions.",
            "Reproduce numerical relations.",
            "Separate algebra from interpretation.",
            "Define a falsifiable prediction.",
        ],
        "note": "Reproducing a known equation confirms implementation, not the novel ontology.",
    }


def explain_limitations() -> dict:
    return {
        "title": "Limitations and open questions",
        "limitations": [
            "The numerical core implements established relations.",
            "Causal primacy, consciousness and the cosmic sequence are hypotheses.",
            "A novel quantitative prediction and independent experiment are still required.",
        ],
    }


def explain_references() -> dict:
    return {
        "title": "References and research",
        "references": [
            "Planck relation E = hf",
            "Mass-energy equivalence E = mc²",
            "CODATA constants",
        ],
        "note": "See PROOF.md for analytical scope and docs/CONCEPTS.md for source links.",
    }


def explain_help() -> dict:
    return {
        "title": "Available topics",
        "topics": [
            "time",
            "mass",
            "frequency",
            "consciousness",
            "cosmic algorithm",
            "proof",
            "limitations",
            "references",
            "ethics",
        ],
    }
