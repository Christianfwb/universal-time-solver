"""Public package interface for Universal Time Solver."""

from .core import (
    EV,
    C,
    H,
    compton_frequency,
    energy_from_frequency,
    mass_from_frequency,
    photon_energy_eV,
    time_from_phase,
)

__version__ = "0.5.0"
__all__ = [
    "C",
    "EV",
    "H",
    "compton_frequency",
    "energy_from_frequency",
    "mass_from_frequency",
    "photon_energy_eV",
    "time_from_phase",
]
