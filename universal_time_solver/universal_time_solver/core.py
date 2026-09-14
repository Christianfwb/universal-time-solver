"""Numerical relations used by Universal Time Solver.

These equations are standard physical relations. The ontology documents discuss
Christian Berrang's interpretation separately.
"""

from math import frexp, isfinite, ldexp, tau
from typing import Final

H: Final[float] = 6.626_070_15e-34
C: Final[float] = 2.997_924_58e8
EV: Final[float] = 1.602_176_634e-19


def _finite(value: float, name: str) -> float:
    value = float(value)
    if not isfinite(value):
        raise ValueError(f"{name} must be finite.")
    return value


def _result(value: float, nonzero: bool = False) -> float:
    if not isfinite(value) or (value == 0 and nonzero):
        raise ValueError("Result is outside the representable floating-point range.")
    return value


def compton_frequency(m_kg: float) -> float:
    """Return the Compton frequency for a mass in kilograms."""
    mass = _finite(m_kg, "m_kg")
    if mass < 0:
        raise ValueError("m_kg must be non-negative.")
    return _result(mass * (C**2 / H), mass != 0)


def mass_from_frequency(f_hz: float) -> float:
    """Return mass in kilograms corresponding to a frequency in hertz."""
    frequency = _finite(f_hz, "f_hz")
    if frequency < 0:
        raise ValueError("f_hz must be non-negative.")
    return _result(frequency * (H / C**2), frequency != 0)


def time_from_phase(delta_phi_rad: float, f_hz: float) -> float:
    """Return signed duration for accumulated phase at constant frequency (radians)."""
    phase = _finite(delta_phi_rad, "delta_phi_rad")
    frequency = _finite(f_hz, "f_hz")
    if frequency <= 0:
        raise ValueError("f_hz must be greater than zero.")
    # Scaling prevents overflow in 2*pi*f and in phase/f before division by tau.
    phase_m, phase_e = frexp(phase)
    frequency_m, frequency_e = frexp(frequency)
    try:
        result = ldexp(phase_m / frequency_m / tau, phase_e - frequency_e)
    except OverflowError as exc:
        raise ValueError("Result is outside the representable floating-point range.") from exc
    return _result(result, phase != 0)


def photon_energy_eV(lambda_m: float) -> float:
    """Return photon energy in electronvolts for a wavelength in metres."""
    wavelength = _finite(lambda_m, "lambda_m")
    if wavelength <= 0:
        raise ValueError("lambda_m must be greater than zero.")
    return _result((H * C / EV) / wavelength, True)


def energy_from_frequency(f_hz: float) -> float:
    """Return energy in joules for a frequency in hertz."""
    frequency = _finite(f_hz, "f_hz")
    if frequency < 0:
        raise ValueError("f_hz must be non-negative.")
    return _result(H * frequency, frequency != 0)
