# universal_time_solver/core.py
from typing import Final

# Naturkonstanten, wie im Frequenzgesetz definiert
H: Final[float] = 6.626_070_15e-34  # Plancksches Wirkungsquantum [J·s]
C: Final[float] = 2.997_924_58e8    # Lichtgeschwindigkeit im Vakuum [m/s]
EV: Final[float] = 1.602_176_634e-19 # Umrechnungsfaktor Joule zu Elektronenvolt

def compton_frequency(m_kg: float) -> float:
    """
    Berechnet die Compton-Frequenz (f) aus der Masse (m).
    Formel: f = m * c^2 / h (Umkehrung von P2)
    """
    if m_kg < 0:
        raise ValueError("Masse (m_kg) muss nicht-negativ sein.")
    return (m_kg * C**2) / H

def mass_from_frequency(f_hz: float) -> float:
    """
    Berechnet die Masse (m) aus der Frequenz (f).
    Formel: m = h * f / c^2 (P2: Masse als Frequenzprozess)
    """
    if f_hz < 0:
        raise ValueError("Frequenz (f_hz) muss nicht-negativ sein.")
    return (H * f_hz) / (C**2)

def time_from_phase(delta_phi_rad: float, f_hz: float) -> float:
    """
    Berechnet die Zeit (T) aus der Phasendifferenz (ΔΦ) und Frequenz (f).
    Formel: T = ΔΦ / f (P3: Zeit als Taktung von Unterschied)
    """
    if f_hz == 0:
        raise ValueError("Frequenz (f_hz) muss ungleich Null sein für die Zeitberechnung (T=ΔΦ/f). Bei f=0 ist keine operationale Zeit messbar.")
    return delta_phi_rad / f_hz

def photon_energy_eV(lambda_m: float) -> float:
    """
    Berechnet die Photonenenergie in Elektronenvolt (eV) aus der Wellenlänge (λ).
    Formel: E = h * c / λ (in eV)
    """
    if lambda_m <= 0:
        raise ValueError("Wellenlänge (lambda_m) muss größer als Null sein.")
    return (H * C / lambda_m) / EV

def energy_from_frequency(f_hz: float) -> float:
    """
    Berechnet die Energie (E) aus der Frequenz (f).
    Formel: E = h * f (P1: Energie als sekundärer Effekt der Frequenz).
    """
    if f_hz < 0:
        raise ValueError("Frequenz (f_hz) muss nicht-negativ sein.")
    return H * f_hz
