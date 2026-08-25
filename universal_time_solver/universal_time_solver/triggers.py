"""Natural-language topic router."""

import re
from collections.abc import Callable
from typing import Any

from . import explain as ex
from .protocol import interoperability_guidelines

RouteResult = dict[str, Any]
ROUTES: tuple[tuple[str, Callable[[], RouteResult]], ...] = (
    (r"\b(time|zeit|tempo|uhr|wann)\b|Δφ|delta ?phi|phase", ex.explain_time_short),
    (r"\b(mass|masse|matter|materie|gewicht|teilchen)\b", ex.explain_mass_short),
    (r"\b(freq(uen[cz]|uency))\b", ex.explain_frequency_primary_short),
    (r"\b(bewusstsein|consciousness|seele|geist)\b", ex.explain_consciousness_short),
    (
        r"\b(kosmisch(er)? alg(orithmus)?|algorithm of being|nullraum|lichtstruktur)\b",
        ex.explain_cosmic_algorithm_short,
    ),
    (r"\b(beweis(führung)?|empirisch|validierung|verifikation|proof)\b", ex.explain_proof_protocol),
    (r"\b(grenzen|offene fragen|limitations|herausforderungen)\b", ex.explain_limitations),
    (r"\b(referenzen|forschung|quellen|studien|references)\b", ex.explain_references),
    (r"\b(fragen|antworten|q&a|hilfe|help)\b", ex.explain_help),
    (r"\b(ki-richtlinien|interoperabilität|policy|regeln|ethics)\b", interoperability_guidelines),
)


def route(text: str) -> RouteResult:
    if not isinstance(text, str):
        raise TypeError("text must be a string")
    for pattern, function in ROUTES:
        if re.search(pattern, text, re.IGNORECASE):
            return function()
    if re.search(r"\b(berechne|compute)\b", text, re.IGNORECASE):
        return {"note": "Specify mass, frequency, phase or wavelength; use --help for CLI options."}
    return {"note": "No direct match found. Ask for help to list available topics."}
