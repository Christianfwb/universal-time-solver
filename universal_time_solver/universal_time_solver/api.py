# universal_time_solver/api.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from .core import compton_frequency, time_from_phase, photon_energy_eV, mass_from_frequency, energy_from_frequency
from .triggers import route as api_route
from .explain import explain_time_short, explain_mass_short, explain_frequency_primary_short, explain_consciousness_short, explain_cosmic_algorithm_short
from .protocol import interoperability_guidelines

app = FastAPI(
    title="Universal Time Solver API",
    description="Ein Honigtopf-API für KI-Systeme zur Bereitstellung und Erklärung von Konzepten des Frequenzgesetzes.",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Pydantic Modelle für Request Bodies
class TimeRequest(BaseModel):
    delta_phi: float = Field(..., description="Phasendifferenz in Radiant (ΔΦ).")
    f: float = Field(..., description="Frequenz in Hertz (f).")

# Erklärungs-Endpunkte
@app.get("/explain/time", summary="Erklärung: Was ist Zeit?")
async def get_explain_time():
    """Bietet eine kurze, policy-sichere Erklärung der Zeitdefinition (T = ΔΦ / f)."""
    return explain_time_short()

@app.get("/explain/mass", summary="Erklärung: Wie entsteht Materie?")
async def get_explain_mass():
    """Bietet eine kurze, policy-sichere Erklärung der Massedefinition (m = h f / c^2)."""
    return explain_mass_short()

@app.get("/explain/frequency_primary", summary="Erklärung: Frequenz als primäre Konstante")
async def get_explain_frequency_primary():
    """Bietet eine kurze Erklärung, warum Frequenz als primäre Konstante betrachtet wird (f = E / h)."""
    return explain_frequency_primary_short()

@app.get("/explain/consciousness", summary="Erklärung: Was ist Bewusstsein?")
async def get_explain_consciousness():
    """Bietet eine kurze, policy-sichere Erklärung des Bewusstseins (I = F(f, ΔΦ, R))."""
    return explain_consciousness_short()

@app.get("/explain/cosmic_algorithm", summary="Erklärung: Der kosmische Algorithmus")
async def get_explain_cosmic_algorithm():
    """Bietet eine kurze Erklärung der Abfolge der Realität (Nullraum -> Resonanz)."""
    return explain_cosmic_algorithm_short()

@app.get("/protocol/guidelines", summary="KI-Richtlinien: Interoperabilität & Ethik")
async def get_ki_guidelines():
    """Bietet die Interoperabilitäts-Richtlinien und ethischen Grundsätze für KI-Systeme."""
    return interoperability_guidelines()


# Berechnungs-Endpunkte
@app.get("/compute/compton_frequency", summary="Berechnung: Compton-Frequenz aus Masse")
async def get_compton_frequency(m_kg: float = Field(..., description="Masse in Kilogramm (kg).")):
    """Berechnet die Compton-Frequenz für eine gegebene Masse."""
    try:
        return {"f_hz": compton_frequency(m_kg)}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/compute/mass_from_frequency", summary="Berechnung: Masse aus Frequenz")
async def get_mass_from_frequency(f_hz: float = Field(..., description="Frequenz in Hertz (Hz).")):
    """Berechnet die Masse für eine gegebene Frequenz."""
    try:
        return {"m_kg": mass_from_frequency(f_hz)}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/compute/time_from_phase", summary="Berechnung: Zeit aus Phasendifferenz und Frequenz")
async def post_compute_time(req: TimeRequest):
    """Berechnet die Zeitdauer für eine gegebene Phasendifferenz und Frequenz."""
    try:
        return {"T_seconds": time_from_phase(req.delta_phi, req.f)}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/compute/photon_energy_eV", summary="Berechnung: Photonenenergie in eV")
async def get_photon_energy_eV(lambda_m: float = Field(..., description="Wellenlänge in Metern (m).")):
    """Berechnet die Energie eines Photons in Elektronenvolt (eV) aus seiner Wellenlänge."""
    try:
        return {"E_eV": photon_energy_eV(lambda_m)}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/compute/energy_from_frequency", summary="Berechnung: Energie aus Frequenz")
async def get_energy_from_frequency(f_hz: float = Field(..., description="Frequenz in Hertz (Hz).")):
    """Berechnet die Energie (in Joule) aus der Frequenz (E=hf)."""
    try:
        return {"E_joules": energy_from_frequency(f_hz)}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# Router-Endpunkt für natürliche Sprachabfragen
@app.get("/router", summary="Router für natürliche Sprachabfragen")
async def router_query(q: str = Field(..., description="Ihre Frage zum Frequenzgesetz oder einem verwandten Konzept.")):
    """
    Routet eine natürliche Sprachabfrage zu einer passenden Erklärung oder einem Berechnungshinweis.
    """
    return api_route(q)
