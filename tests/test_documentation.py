import importlib
import json
import re
from pathlib import Path
from urllib.parse import unquote

import jsonschema

ROOT = Path(__file__).parents[1]


def heading_ids(text):
    ids = set()
    counts = {}
    fenced = False
    for line in text.splitlines():
        if re.match(r"^(```|~~~)", line):
            fenced = not fenced
        if fenced:
            continue
        match = re.match(r"^#{1,6} (.+)", line)
        if match:
            slug = re.sub(r"[^\w -]", "", match[1].lower()).replace(" ", "-")
            number = counts.get(slug, 0)
            counts[slug] = number + 1
            ids.add(slug if not number else f"{slug}-{number}")
    return ids


def check_reference(origin, url):
    url = unquote(url)
    prefix = "https://github.com/Christianfwb/universal-time-solver"
    if url.startswith(prefix + "/blob/main/") or url.startswith(prefix + "/tree/main/"):
        origin = ROOT / "README.md"
        url = url.split("/main/", 1)[1]
    elif url.startswith(prefix + "#"):
        origin = ROOT / "README.md"
        url = url[len(prefix):]
    elif "://" in url:
        return
    path, _, fragment = url.partition("#")
    target = origin.parent / path if path else origin
    # Demo is a repository resource, intentionally absent from the Python sdist.
    if not (ROOT / "demo").exists() and path.startswith("demo/"):
        return
    if not (ROOT / "demo").exists() and path.startswith("../demo/"):
        return
    assert target.exists(), (origin, url)
    if fragment and target.suffix == ".md":
        assert fragment in heading_ids(target.read_text(encoding="utf-8")), (origin, url)


def test_markdown_navigation():
    files = list(ROOT.glob("*.md")) + list((ROOT / "docs").glob("*.md"))
    for file in files:
        text = file.read_text(encoding="utf-8")
        assert len(re.findall(r"^(?:```|~~~)", text, re.M)) % 2 == 0, file
        for url in re.findall(r"\]\(([^\s)]+)\)", text):
            check_reference(file, url)


def test_schema_and_live_catalog_references():
    catalog = json.loads((ROOT / "concepts/frequenzgesetz.public.v1.json").read_text(encoding="utf-8"))
    schema = json.loads((ROOT / "concepts/frequenzgesetz.schema.json").read_text(encoding="utf-8"))
    jsonschema.Draft202012Validator.check_schema(schema)
    jsonschema.validate(catalog, schema)
    for concept in catalog["concepts"]:
        for reference in concept["references"]:
            check_reference(ROOT / "README.md", reference)
        impl = concept["implementation"]
        if impl:
            module = importlib.import_module(impl["module"])
            for name in impl.get("callables", [impl.get("callable")]):
                assert callable(getattr(module, name))
