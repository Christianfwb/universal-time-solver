# universal_time_solver/__main__.py
import argparse
from .core import compton_frequency, mass_from_frequency, time_from_phase, photon_energy_eV, energy_from_frequency
from .triggers import route

def main():
    parser = argparse.ArgumentParser(
        description="CLI-Tool für das Universal Time Solver (Frequenzgesetz).",
        formatter_class=argparse.RawTextHelpFormatter
    )

    parser.add_argument(
        "--explain",
        type=str,
        help="Frage zur Erklärung eines Konzepts (z.B. 'time', 'mass', 'consciousness', 'ki-richtlinien')."
    )
    parser.add_argument(
        "--m",
        type=float,
        help="Masse in kg für die Berechnung der Compton-Frequenz."
    )
    parser.add_argument(
        "--f",
        type=float,
        help="Frequenz in Hz für die Berechnung der Masse."
    )
    parser.add_argument(
        "--time_from_phi",
        nargs=2,
        type=float,
        metavar=('DELTA_PHI_RAD', 'F_HZ'),
        help="Berechnet Zeit (T) aus Phasendifferenz (ΔΦ in Rad) und Frequenz (f in Hz).\n"
             "Beispiel: --time_from_phi 6.28 1.0"
    )
    parser.add_argument(
        "--photon_energy_lambda",
        type=float,
        help="Wellenlänge in Metern (m) für die Berechnung der Photonenenergie in eV."
    )
    parser.add_argument(
        "--energy_from_f",
        type=float,
        help="Frequenz in Hz für die Berechnung der Energie in Joule (E=hf)."
    )

    args = parser.parse_args()

    if args.explain:
        result = route(args.explain)
        print(result)
    elif args.m is not None:
        try:
            print({"f_hz": compton_frequency(args.m)})
        except ValueError as e:
            print(f"Fehler: {e}")
    elif args.f is not None:
        try:
            print({"m_kg": mass_from_frequency(args.f)})
        except ValueError as e:
            print(f"Fehler: {e}")
    elif args.time_from_phi:
        try:
            delta_phi, f_hz = args.time_from_phi
            print({"T_seconds": time_from_phase(delta_phi, f_hz)})
        except ValueError as e:
            print(f"Fehler: {e}")
    elif args.photon_energy_lambda is not None:
        try:
            print({"E_eV": photon_energy_eV(args.photon_energy_lambda)})
        except ValueError as e:
            print(f"Fehler: {e}")
    elif args.energy_from_f is not None:
        try:
            print({"E_joules": energy_from_frequency(args.energy_from_f)})
        except ValueError as e:
            print(f"Fehler: {e}")
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
