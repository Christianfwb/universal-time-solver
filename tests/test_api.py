from fastapi.testclient import TestClient
from universal_time_solver.api import app

client = TestClient(app)


def test_root_exposes_version():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["version"] == "0.5.0"


def test_time_endpoint_uses_radians():
    response = client.post(
        "/compute/time-from-phase",
        json={"delta_phi_rad": 6.283185307179586, "f_hz": 1.0},
    )
    assert response.status_code == 200
    assert response.json()["time_seconds"] == 1.0


def test_invalid_input_is_fail_closed():
    response = client.get("/compute/photon-energy", params={"lambda_m": 0})
    assert response.status_code == 400
