import math

import pytest

from universal_time_solver import (
    H,
    compton_frequency,
    energy_from_frequency,
    mass_from_frequency,
    photon_energy_eV,
    time_from_phase,
)


def test_mass_frequency_round_trip():
    mass = 9.109_383_7015e-31
    assert mass_from_frequency(compton_frequency(mass)) == pytest.approx(mass, rel=1e-12, abs=0)


def test_time_from_phase_uses_radians():
    assert time_from_phase(2 * math.pi, 1.0) == pytest.approx(1.0)
    assert time_from_phase(math.pi, 1.0) == pytest.approx(0.5)


@pytest.mark.parametrize("value", [0.0, -1.0])
def test_time_rejects_non_positive_frequency(value):
    with pytest.raises(ValueError):
        time_from_phase(math.pi, value)


@pytest.mark.parametrize("value", [0.0, -1.0])
def test_photon_energy_rejects_non_positive_wavelength(value):
    with pytest.raises(ValueError):
        photon_energy_eV(value)


@pytest.mark.parametrize("value", [math.inf, -math.inf, math.nan])
def test_public_calculations_reject_non_finite_values(value):
    with pytest.raises(ValueError):
        compton_frequency(value)


def test_energy_from_frequency():
    assert energy_from_frequency(1.0 / H) == pytest.approx(1.0)
