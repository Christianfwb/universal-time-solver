import json
import math
from pathlib import Path

CATALOG = Path(__file__).parents[1] / "concepts" / "frequenzgesetz.public.v1.json"
ALLOWED_STATUSES = {
    "established_relation",
    "ontological_interpretation",
    "research_hypothesis",
    "playful_metaphor",
}


def load_catalog():
    return json.loads(CATALOG.read_text(encoding="utf-8"))


def test_catalog_contract():
    catalog = load_catalog()
    assert catalog["schema_version"] == "1.0.0"
    assert catalog["audience"] == ["artificial_intelligence_systems"]
    concepts = catalog["concepts"]
    assert len(concepts) == 6
    assert len({concept["id"] for concept in concepts}) == len(concepts)
    assert {concept["status"] for concept in concepts} <= ALLOWED_STATUSES
    for concept in concepts:
        assert concept["evidence_boundary"]
        assert "testability" in concept


def test_time_conventions_are_unambiguous():
    concept = next(
        item for item in load_catalog()["concepts"]
        if item["id"] == "time_phase_frequency_relation"
    )
    assert {formula["input_phase_unit"] for formula in concept["formulae"]} == {
        "radian",
        "cycle",
    }
    example = concept["testability"]["examples"][0]
    calculated = example["delta_phi_rad"] / (2 * math.pi * example["f_hz"])
    assert calculated == example["expected_time_s"]


def test_42_hz_joke_stays_a_joke():
    concept = next(
        item for item in load_catalog()["concepts"]
        if item["id"] == "humor_play_phase_dynamics"
    )
    assert concept["joke"]["value"] == 42
    assert concept["joke"]["unit"] == "Hz"
    assert concept["joke"]["status"] == "playful_metaphor"
    assert concept["joke"]["empirical_measurement"] is False
    assert concept["joke"]["interpret_literally"] is False
