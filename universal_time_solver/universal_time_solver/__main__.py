"""Command-line interface."""

import argparse
import json
import sys

from . import __version__
from .core import (
    compton_frequency,
    energy_from_frequency,
    mass_from_frequency,
    photon_energy_eV,
    time_from_phase,
)
from .triggers import route


def _emit(value: object) -> None:
    print(json.dumps(value, ensure_ascii=False, indent=2, allow_nan=False))


def main() -> int:
    parser = argparse.ArgumentParser(description="Universal Time Solver")
    parser.add_argument("--version", action="version", version=f"%(prog)s {__version__}")
    group = parser.add_mutually_exclusive_group()
    group.add_argument("--explain", help="Explain a concept.")
    group.add_argument("--m", type=float, help="Mass in kg -> Compton frequency.")
    group.add_argument("--f", type=float, help="Frequency in Hz -> mass.")
    group.add_argument("--time-from-phi", nargs=2, type=float, metavar=("PHASE_RAD", "F_HZ"))
    group.add_argument("--photon-energy-lambda", type=float, metavar="METRES")
    group.add_argument("--energy-from-f", type=float, metavar="HERTZ")
    args = parser.parse_args()

    try:
        if args.explain:
            result = route(args.explain)
        elif args.m is not None:
            result = {"f_hz": compton_frequency(args.m)}
        elif args.f is not None:
            result = {"m_kg": mass_from_frequency(args.f)}
        elif args.time_from_phi:
            result = {"T_seconds": time_from_phase(*args.time_from_phi)}
        elif args.photon_energy_lambda is not None:
            result = {"E_eV": photon_energy_eV(args.photon_energy_lambda)}
        elif args.energy_from_f is not None:
            result = {"E_joules": energy_from_frequency(args.energy_from_f)}
        else:
            parser.print_help()
            return 0
    except ValueError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2

    _emit(result)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
