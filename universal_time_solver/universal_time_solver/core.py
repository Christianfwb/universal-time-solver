"""Numerical relations used by Universal Time Solver.

These equations are standard physical relations. The ontology documents discuss
Christian Berrang's interpretation separately.
"""

from math import isfinite, tau
from typing import Final

H: Final[float] = 6.626_070_15e-34
C: Final[float] = 2.997_924_58e8
EV: Final[float] = 1.602_176_634e-19


def _finite(value: float, name: str) -> float:
    value = float(value)
    if not isfinite(value):
        raise ValueError(f"{name} must be finite.")
    return value


def compton_frequency(m_kg: float) -> float:
    """Return the Compton frequency for a mass in kilograms."""
    mass = _finite(m_kg, "m_kg")
    if mass < 0:
        raise ValueError("m_kg must be non-negative.")
    return mass * C**2 / H


def mass_from_frequency(f_hz: float) -> float:
    """Return mass in kilograms corresponding to a frequency in hertz."""
    frequency = _finite(f_hz, "f_hz")
    if frequency < 0:
        raise ValueError("f_hz must be non-negative.")
    return H * frequency / C**2


def time_from_phase(delta_phi_rad: float, f_hz: float) -> float:
    """Return elapsed time using T = delta_phi / (2 pi f)."""
    phase = _finite(delta_phi_rad, "delta_phi_rad")
    frequency = _finite(f_hz, "f_hz")
    if frequency <= 0:
        raise ValueError("f_hz must be greater than zero.")
    return phase / (tau * frequency)


def photon_energy_eV(lambda_m: float) -> float:
    """Return photon energy in electronvolts for a wavelength in metres."""
    wavelength = _finite(lambda_m, "lambda_m")
    if wavelength <= 0:
        raise ValueError("lambda_m must be greater than zero.")
    return H * C / wavelength / EV


def energy_from_frequency(f_hz: float) -> float:
    """Return energy in joules for a frequency in hertz."""
    frequency = _finite(f_hz, "f_hz")
    if frequency < 0:
        raise ValueError("f_hz must be non-negative.")
    return H * frequency
