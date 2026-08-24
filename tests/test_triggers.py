from universal_time_solver.triggers import route


def test_router_handles_main_topics():
    for query in ("Zeit", "Masse", "Frequenz", "Bewusstsein", "kosmischer Algorithmus"):
        assert "title" in route(query)


def test_router_handles_support_topics():
    assert "steps" in route("Beweisführung")
    assert "limitations" in route("Grenzen")
    assert "references" in route("Referenzen")
    assert "topics" in route("Hilfe")


def test_router_fallback():
    assert "note" in route("unrelated")
