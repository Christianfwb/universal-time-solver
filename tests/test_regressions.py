import json
import math
import subprocess
import sys

import pytest
from fastapi.testclient import TestClient
from universal_time_solver.api import app
from universal_time_solver.explain import explain_help
from universal_time_solver.proof_protocol import compton_check, get_full_proof_protocol
from universal_time_solver.triggers import route

from universal_time_solver import core


@pytest.mark.parametrize("fn,args", [
    (core.compton_frequency, (1e300,)),
    (core.photon_energy_eV, (5e-324,)),
    (core.time_from_phase, (1, 5e-324)),
    (core.mass_from_frequency, (5e-324,)),
    (core.energy_from_frequency, (5e-324,)),
])
def test_unrepresentable_result_is_rejected(fn, args):
    with pytest.raises(ValueError, match="representable"):
        fn(*args)


@pytest.mark.parametrize("phase,frequency", [(1e308, 1e308), (1e308, 0.1), (5e-324, 5e-324)])
def test_phase_scaling_avoids_intermediate_overflow_and_underflow(phase, frequency):
    from fractions import Fraction
    expected = float(Fraction(phase) / Fraction(frequency) / Fraction(math.tau))
    assert core.time_from_phase(phase, frequency) == pytest.approx(expected, rel=1e-14, abs=0)


def test_independent_numerical_reference_values():
    assert core.compton_frequency(9.1093837015e-31) == pytest.approx(1.2355899638e20, rel=1e-10, abs=0)
    assert core.photon_energy_eV(500e-9) == pytest.approx(2.479683968664, rel=1e-12, abs=0)
    assert core.mass_from_frequency(1.2355899638e20) == pytest.approx(9.1093837015e-31, rel=1e-10, abs=0)


@pytest.mark.parametrize("fn", [core.compton_frequency, core.mass_from_frequency, core.energy_from_frequency])
def test_zero_and_negative_domains(fn):
    assert fn(0) == 0
    with pytest.raises(ValueError):
        fn(-1)


@pytest.mark.parametrize("bad", [math.nan, math.inf, -math.inf])
def test_all_core_functions_reject_nonfinite(bad):
    for fn in (core.compton_frequency, core.mass_from_frequency, core.energy_from_frequency, core.photon_energy_eV):
        with pytest.raises(ValueError):
            fn(bad)
    for args in ((bad, 1), (1, bad)):
        with pytest.raises(ValueError):
            core.time_from_phase(*args)


def test_all_advertised_topics_route():
    for topic in explain_help()["topics"]:
        assert "No direct match" not in str(route(topic))
    assert "principle" in route("Ethik")


@pytest.mark.parametrize("args,code,key", [
    (["--time-from-phi", "6.283185307179586", "1"], 0, "T_seconds"),
    (["--m", "1e300"], 2, None),
    (["--m", "nan"], 2, None),
    (["--f", "-1"], 2, None),
])
def test_cli_contract(args, code, key):
    result = subprocess.run([sys.executable, "-m", "universal_time_solver", *args], capture_output=True, text=True)
    assert result.returncode == code
    if key:
        assert json.loads(result.stdout)[key] == 1
        assert not result.stderr
    else:
        assert not result.stdout
        assert "error:" in result.stderr


@pytest.mark.parametrize("path,params,key", [
    ("compton-frequency", {"m_kg": 1e-30}, "f_hz"),
    ("mass-from-frequency", {"f_hz": 1}, "m_kg"),
    ("photon-energy", {"lambda_m": 500e-9}, "energy_eV"),
    ("energy-from-frequency", {"f_hz": 1}, "energy_joule"),
])
def test_api_calculation_paths(path, params, key):
    response = TestClient(app).get("/compute/" + path, params=params)
    assert response.status_code == 200
    assert math.isfinite(response.json()[key])


def test_api_range_and_request_errors():
    client = TestClient(app, raise_server_exceptions=False)
    response = client.get("/compute/compton-frequency", params={"m_kg": "1e300"})
    assert response.status_code == 400
    assert client.post("/compute/time-from-phase", json={}).status_code == 422


def test_proof_protocol_checks_and_validation():
    assert all(row["match"] for row in get_full_proof_protocol()[3].data["table_rows"])
    for kwargs in ({"mass_kg": -1}, {"mass_kg": 1, "h_constant": 0}, {"mass_kg": 1, "rel_tol": -1}, {"mass_kg": 1, "expected_frequency_hz": math.inf}):
        with pytest.raises(ValueError):
            compton_check(**kwargs)
    assert compton_check(2, h_constant=2, c_constant=3).data["calculated_frequency_hz"] == 9
