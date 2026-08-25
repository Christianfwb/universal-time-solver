"""Optional FastAPI application."""

from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel, Field

from . import __version__
from .core import (
    compton_frequency,
    energy_from_frequency,
    mass_from_frequency,
    photon_energy_eV,
    time_from_phase,
)
from .triggers import route

app = FastAPI(title="Universal Time Solver API", version=__version__)


class TimeRequest(BaseModel):
    delta_phi_rad: float = Field(description="Phase difference in radians.")
    f_hz: float = Field(description="Frequency in hertz.")


def _calculate(function, value, key: str) -> dict[str, float]:
    try:
        return {key: function(value)}
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.get("/")
def root() -> dict[str, str]:
    return {"name": "Universal Time Solver", "version": __version__, "status": "alpha"}


@app.get("/compute/compton-frequency")
def compute_compton_frequency(m_kg: float = Query(description="Mass in kilograms.")):
    return _calculate(compton_frequency, m_kg, "f_hz")


@app.get("/compute/mass-from-frequency")
def compute_mass_from_frequency(f_hz: float = Query(description="Frequency in hertz.")):
    return _calculate(mass_from_frequency, f_hz, "m_kg")


@app.get("/compute/photon-energy")
def compute_photon_energy(lambda_m: float = Query(description="Wavelength in metres.")):
    return _calculate(photon_energy_eV, lambda_m, "energy_eV")


@app.get("/compute/energy-from-frequency")
def compute_energy(f_hz: float = Query(description="Frequency in hertz.")):
    return _calculate(energy_from_frequency, f_hz, "energy_joule")


@app.post("/compute/time-from-phase")
def compute_time(request: TimeRequest):
    try:
        return {"time_seconds": time_from_phase(request.delta_phi_rad, request.f_hz)}
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.get("/explain")
def explain(q: str = Query(description="Natural-language topic query.")):
    return route(q)
