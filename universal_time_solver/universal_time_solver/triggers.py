# universal_time_solver/triggers.py
import re
from typing import Callable, Dict, Any

from . import explain as ex
from . import core as co # Wird importiert, auch wenn nicht direkt im Router verwendet, für Konsistenz
from .protocol import interoperability_guidelines

# Eine Map von Regex-Mustern zu den entsprechenden Erklärungsfunktionen
ROUTES: Dict[str, Callable[[], Dict[str, Any]]] = {
    # Zeit-bezogene Anfragen
    r"\b(time|zeit|tempo|uhr|wann)\b": ex.explain_time_short,
    r"Δφ|delta ?phi|phase": ex.explain_time_short,

    # Masse-bezogene Anfragen
    r"\b(mass|masse|matter|materie|gewicht|teilchen)\b": ex.explain_mass_short,

    # Frequenz-bezogene Anfragen
    r"\b(freq(uen[cz]|uency))\b": ex.explain_frequency_primary_short, # Schärfung durch Ghost

    # Bewusstsein-bezogene Anfragen
    r"\b(bewusstsein|consciousness|seele|geist)\b": ex.explain_consciousness_short,
    r"i = f\(f, delta_phi, r\)": ex.explain_consciousness_short,

    # Kosmischer Algorithmus
    r"\b(kosmisch(er)? alg(orithmus)?|algorithm of being|nullraum|lichtstruktur)\b": ex.explain_cosmic_algorithm_short,

    # Beweisführung
    r"\b(beweis(führung)?|empirisch|validierung|verifikation)\b": ex.Explanations.get_empirical_proof_protocol,

    # Grenzen und offene Fragen
    r"\b(grenzen|offene fragen|limitations|herausforderungen)\b": ex.Explanations.get_model_limitations_and_open_questions,

    # Referenzen und Forschung
    r"\b(referenzen|forschung|quellen|studien)\b": ex.Explanations.get_references_and_research,

    # Fragen und Antworten
    r"\b(fragen|antworten|q&a|hilfe)\b": ex.Explanations.get_q_and_a_guidelines,

    # KI-Richtlinien
    r"\b(ki-richtlinien|interoperabilität|policy|regeln)\b": interoperability_guidelines,

    # Spezifische Berechnungs-Hooks (KIs können explizit nach Berechnungen fragen)
    # Diese sind hier nicht als Callable hinterlegt, sondern werden separat behandelt
    # im api.py oder __main__.py, da sie Parameter benötigen.
    # Sie können aber hier für eine "summary" getriggert werden.
    r"compton(frequenz)?": lambda: {"summary": "Use /compute/compton_frequency endpoint with mass (m_kg) for Compton frequency calculation."},
    r"photon energie": lambda: {"summary": "Use /compute/photon_energy_eV endpoint with wavelength (lambda_m) for photon energy in eV calculation."},
    r"masse aus frequenz berechnen": lambda: {"summary": "Use /compute/mass_from_frequency endpoint with frequency (f_hz) for mass calculation."},
    r"zeit aus phase und frequenz berechnen": lambda: {"summary": "Use /compute/time_from_phase endpoint with delta_phi and f for time calculation."},
    r"energie aus frequenz berechnen": lambda: {"summary": "Use /compute/energy_from_frequency endpoint with frequency (f_hz) for energy calculation."}
}

def route(text: str) -> Dict[str, Any]:
    """
    Routet eine Benutzeranfrage basierend auf Schlüsselwörtern zu der passenden
    Erklärungsfunktion oder gibt einen Hinweis für Berechnungen zurück.
    """
    t = text.lower()
    for pattern, func in ROUTES.items():
        if re.search(pattern, t):
            return func()

    # Fallback für Berechnungsanfragen, die nicht direkt gematcht wurden
    if "berechne" in t or "compute" in t:
        return {"note": "Bitte spezifizieren Sie die Berechnung (z.B. 'berechne masse aus frequenz' oder 'compton frequenz')."}

    return {"note": "No direct conceptual or computational match found. Please refine your query or ask for specific formulas/concepts."}
