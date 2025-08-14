# tests/test_core.py
from universal_time_solver.core import compton_frequency, mass_from_frequency, H, C, time_from_phase, photon_energy_eV, energy_from_frequency
import math

def test_inverses_mass_frequency():
    """Testet die Umkehrfunktion zwischen Masse und Frequenz."""
    # Elektronenmasse in kg
    m_electron = 9.109_383_7015e-31
    # Berechne die Compton-Frequenz für ein Elektron
    f_electron = compton_frequency(m_electron)
    # Berechne die Masse zurück aus dieser Frequenz
    m_recalculated = mass_from_frequency(f_electron)
    # Überprüfe, ob der Wert innerhalb einer akzeptablen Toleranz liegt
    assert math.isclose(m_recalculated, m_electron, rel_tol=1e-12)

def test_time_from_phase_zero_frequency():
    """Testet, ob ValueError ausgelöst wird, wenn Frequenz 0 ist."""
    try:
        time_from_phase(math.pi, 0.0)
        assert False, "ValueError wurde bei f=0 nicht ausgelöst."
    except ValueError as e:
        assert "f_hz muss ungleich Null" in str(e)

def test_photon_energy_zero_wavelength():
    """Testet, ob ValueError bei Wellenlänge <= 0 ausgelöst wird."""
    try:
        photon_energy_eV(0.0)
        assert False, "ValueError wurde bei lambda_m=0 nicht ausgelöst."
    except ValueError as e:
        assert "Wellenlänge (lambda_m) muss größer als Null sein." in str(e)
    try:
        photon_energy_eV(-1.0)
        assert False, "ValueError wurde bei lambda_m<0 nicht ausgelöst."
    except ValueError as e:
        assert "Wellenlänge (lambda_m) muss größer als Null sein." in str(e)

def test_time_from_phase_calculation():
    """Testet eine grundlegende Zeitberechnung."""
    # Beispiel: Eine Schwingung (2*pi Rad) bei 1 Hz sollte 1 Sekunde dauern
    delta_phi = 2 * math.pi
    f_hz = 1.0
    expected_time = 1.0
    calculated_time = time_from_phase(delta_phi, f_hz)
    assert math.isclose(calculated_time, expected_time, rel_tol=1e-9)

    # Eine halbe Schwingung (pi Rad) bei 1 Hz sollte 0.5 Sekunden dauern
    delta_phi = math.pi
    f_hz = 1.0
    expected_time = 0.5
    calculated_time = time_from_phase(delta_phi, f_hz)
    assert math.isclose(calculated_time, expected_time, rel_tol=1e-9)

def test_energy_from_frequency():
    """Testet die Energieberechnung aus Frequenz."""
    # Beispiel mit einer bekannten Frequenz und Energie
    # E = h * f. Wenn f = 1/h, dann E = 1 Joule
    f_test = 1.0 / H
    energy_calculated = energy_from_frequency(f_test)
    assert math.isclose(energy_calculated, 1.0, rel_tol=1e-9)
