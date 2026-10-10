"""Top patent applicants by office and year, from official publications only -> src/assets/patent-stats/rankings.json.

    python scripts/patent-stats/build_patent_rankings.py [--cache DIR]     (needs: pypdf, openpyxl)

Sources (downloaded once into --cache; every URL is written into the JSON so the page can link to it):

* INPI (Brazil) - annual "Ranking de depositantes" of invention-patent filings, residents and non-residents,
  2020-2025 (top 50 each; ties at the cut are all listed).
* EPO (European Patent Office, 39 member states) - Patent Index / Technology Dashboard, top applicants of
  European patent applications (direct filings + Euro-PCT regional phase), first-named applicant, 2020-2025.

Not included, on purpose: USPTO (the latest "Patenting by Organizations" report found covers up to 2005; recent rankings are
third-party, e.g. IFI Claims) and CNIPA (no applicant ranking found in an official, verifiable publication).
2026 has no data yet: both offices publish a year's ranking in the following year.

Counting rules are the offices' own. This script only (1) keeps companies (INPI residents: universities,
institutes, foundations, public bodies and individuals are dropped), (2) merges spellings of one name across
years (one name is a word-prefix of the other: "HUAWEI" / "HUAWEI TECHNOLOGIES CO., LTD.") and documented renames
(ALIASES), and (3) picks the ten companies with the largest sum of published counts over 2020-2025. A company
missing from a year's list is null with the list's cut-off (its count was at most that), never zero.
"""

from __future__ import annotations

import argparse
import json
import logging
import re
import unicodedata
import urllib.request
from dataclasses import dataclass, field
from datetime import date
from pathlib import Path

YEARS = list(range(2020, 2027))
INPI = "https://www.gov.br/inpi/pt-br/central-de-conteudo/estatisticas/arquivos/estatisticas-preliminares/"
INPI_RESIDENTS = {
    2020: INPI + "rankdepositantesresidentes-2020.pdf",
    2021: INPI + "rankdepositantesresidentes-vf_2021.pdf",
    2022: INPI + "ranking-de-depositantes-residentes-2022.pdf",
    2023: INPI + "ranking-de-depositantes-residentes-2023.pdf",
    2024: INPI + "inpi-rankings-de-depositantes-2024.pdf",
    2025: INPI + "inpi-rankings-de-depositantes-2025.pdf",
}
INPI_NON_RESIDENTS = {
    2020: INPI + "rankdepositantesnaoresidentes-2020.pdf",
    2021: INPI + "rankdepositantesnaoresidentes-vf_2021.pdf",
    2022: INPI + "ranking-de-depositantes-nao-residentes-2022.pdf",
    2023: INPI + "ranking-de-depositantes-nao-residentes-2023.pdf",
    2024: INPI_RESIDENTS[2024],  # from 2024 on, one report holds both rankings
    2025: INPI_RESIDENTS[2025],
}
EPO_FILES = {
    2020: "https://report-archive.epo.org/files/babylon/patent_index_2020_top_applicants_en_.xlsx",
    2021: "https://report-archive.epo.org/files/babylon/Patent_Index_2021_Top_applicants_en.xlsx",
    2022: "https://report-archive.epo.org/files/babylon/Patent_Index_2022_Top_applicants.xlsx",
    2023: "https://link.epo.org/web/about-us/statistics/en-patent-index-2023-at-a-glance.pdf",
    2024: "https://link.epo.org/web/about-us/statistics/en-patent-index-2024-at-a-glance.pdf",
    2025: "https://link.epo.org/web/about-us/statistics/en-technology-dashboard-2025-at-a-glance.pdf",
}
EPO_PAGES = {
    2020: "https://report-archive.epo.org/about-us/annual-reports-statistics/statistics/2020/statistics/applicants.html",
    2021: "https://report-archive.epo.org/about-us/annual-reports-statistics/statistics/2021/statistics/applicants.html",
    2022: "https://report-archive.epo.org/about-us/annual-reports-statistics/statistics/2022/statistics/applicants.html",
    2023: "https://www.epo.org/en/about-us/statistics/patent-index-2023",
    2024: "https://www.epo.org/en/about-us/statistics/patent-index-2024",
    2025: "https://www.epo.org/en/about-us/statistics/technology-dashboard-2025",
}
# Renames documented by the companies or registries (same entity, new name): old key -> new key.
ALIASES = {
    "RAYTHEON": ("RTX", "Raytheon Technologies Corporation renamed RTX Corporation on 17 July 2023 (SEC Form 8-K).",
                             "https://www.sec.gov/Archives/edgar/data/101829/000119312523187728/d708798d8k.htm"),
    "FCAFIATCHRYSLERAUTOMOVEISBRASIL": ("STELLANTISAUTOMOVEISBRASIL",
                                        "FCA Fiat Chrysler Automóveis Brasil Ltda became Stellantis Automóveis Brasil Ltda, same CNPJ 16.701.716/0001-56 (contract record, Comprasnet).",
                                        "https://contratos.comprasnet.gov.br/gescon/consulta/download-arquivo-contrato/641667"),
    "PHILIPS": ("ROYALPHILIPS", "Short form of Royal Philips used in the EPO 2024 list.", ""),
    "TELEFONAKTIEBOLAGETLMERICSSON": ("ERICSSON", "Telefonaktiebolaget LM Ericsson is the legal name of Ericsson (INPI used the short name in 2020-2021).",
                                      ""),
}
GENERIC_WORDS = r"\b(TECHNOLOGIES|TECHNOLOGY|HOLDINGS|HOLDING|IP|INTERNATIONAL|COMPANY|THE)\b"  # dropped from match keys
LEGAL_FORMS = r"\b(LTDA|LIMITADA|S\.?\s?A\.?|S/A|A/?S|EIRELI|INC(ORPORATED)?|CORP(ORATION)?|CO\.?|LTD\.?|LIMITED|GMBH|AG|SE|OY|AB|B\.?V\.?|N\.?V\.?|LLC|PLC|KABUSHIKI KAISHA|K\.?K\.?|PUBL)\b"
NOT_COMPANY = r"UNIVERSIDADE|UNIVERSIT|INSTITUTO|INSTITUTE|FUNDA[CÇ][AÃ]O|SERVI[CÇ]O NACIONAL|COMISS[AÃ]O|EMPRESA BRASILEIRA DE PESQUISA|CENTRO DE PESQUISA|FRAUNHOFER|COMMISSARIAT|CENTRE NATIONAL"


def fetch(url: str, cache: Path) -> Path:
    path = cache / re.sub(r"[^A-Za-z0-9_.-]", "_", url.split("//", 1)[1])
    if not path.exists():
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (portfolio data build)"})
        with urllib.request.urlopen(req, timeout=120) as r:
            data = r.read()
        if not (data[:4] == b"%PDF" or data[:2] == b"PK"):
            raise RuntimeError(f"{url} did not return a PDF or XLSX file")
        path.write_bytes(data)
    return path


def pdf_text(path: Path) -> str:
    from pypdf import PdfReader

    text = "\n".join(page.extract_text() or "" for page in PdfReader(str(path)).pages)
    digits = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]
    return re.sub(r"/(" + "|".join(digits) + r")\.fitted", lambda m: str(digits.index(m.group(1))), text)  # EPO 2024 glyphs


def key(name: str) -> str:
    ascii_name = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode().upper()
    ascii_name = re.sub(LEGAL_FORMS, " ", ascii_name)
    ascii_name = re.sub(GENERIC_WORDS, " ", ascii_name)
    return re.sub(r"[^A-Z0-9]", "", ascii_name)


def has_legal_form(name: str) -> bool:
    return bool(re.search(LEGAL_FORMS, unicodedata.normalize("NFKD", name.upper()).encode("ascii", "ignore").decode()))


def is_organisation(name: str) -> bool:
    """Universities, institutes, foundations and public research bodies (not companies)."""
    return bool(re.search(NOT_COMPANY, name.upper()))


@dataclass
class YearList:
    rows: list[tuple[int, str, int]]  # rank, name as published, count
    total: int | None = None  # all filings of this group of applicants that year, when published
    source: str = ""
    page: str = ""

    @property
    def cutoff(self) -> int:
        return min(c for _, _, c in self.rows)


ROW = re.compile(r"^\s*(\d{1,3})\s+(.+?)\s+(\d{1,3}(?:\.\d{3})*|\d+)\s+\d+,\d+\s*%?\s*$")


def inpi_table(text: str, start: str, label: str) -> tuple[list[tuple[int, str, int]], int | None]:
    """Rows of the table that starts at the last occurrence of `start` followed by a header (not the contents list)."""
    for found in re.finditer(re.escape(start), text):
        if re.match(r"\s*\.{5,}", text[found.end():found.end() + 30]):
            continue  # an entry of the contents list (dot leaders), not the table
        body = text[found.start():]
        end = re.search(r"RESUMO|Resumo", body)
        body = body[: end.start() + 400 if end else None]
        rows = []
        pending = ""
        for line in body[: end.start() if end else None].splitlines():
            line, pending = (f"{pending} {line}" if pending else line), ""
            if re.match(r"^\s*\d{1,3}\s+\D", line) and not ROW.match(line) and not re.search(r"\d+,\d+", line):
                pending = line.strip()  # a long name wrapped onto the next line
                continue
            m = ROW.match(line)
            if m:
                rows.append((int(m.group(1)), m.group(2).strip(" -–"), int(m.group(3).replace(".", ""))))
        if rows:
            total = re.search(rf"Total de dep[oó]sitos de (?:patentes de invenção de )?{label}s?\D*?([\d.]+)", body)
            return rows, int(total.group(1).replace(".", "")) if total else None
    raise RuntimeError(f"no rows under {start!r}")


def inpi_lists(cache: Path, resident: bool) -> dict[int, YearList]:
    out = {}
    for year, url in (INPI_RESIDENTS if resident else INPI_NON_RESIDENTS).items():
        text = pdf_text(fetch(url, cache))
        if year >= 2024:
            start = "Tabela 1 – Ranking de Depositantes Residentes de Patentes de Invenção" if resident else "Tabela 6 – Ranking de Depositantes Não Residentes de Patentes de Invenção"
        else:
            start = "Residente - Patente De Invenção" if resident else "Não Residente - Patente De Invenção"
        rows, total = inpi_table(text, start, "residente" if resident else "não residente")
        out[year] = YearList(rows, total, url, "https://www.gov.br/inpi/pt-br/inpi-data/relatorios/ranking-depositantes")
    return out


# "12. Nokia 1 186", "1. Huawei 5071", "18. CATL3 832" (footnote 3 glued to the name)
EPO_ROW = re.compile(r"(?<![\d.])(\d{1,2})\.\s([A-Za-z][A-Za-z&.,'’ \-]{0,40}?[A-Za-z.)])\d?\s(\d{1,2}\s\d{3}|\d{3,4})(?=\s|$)")


def epo_lists(cache: Path) -> dict[int, YearList]:
    import openpyxl

    out = {}
    for year, url in EPO_FILES.items():
        path = fetch(url, cache)
        if url.endswith(".xlsx"):
            ws = openpyxl.load_workbook(path, data_only=True)["Top 50"]
            rows = [(int(r[0]), str(r[1]).strip(), int(r[2])) for r in ws.iter_rows(min_row=4, values_only=True)
                    if isinstance(r[0], (int, float)) and r[1] and isinstance(r[2], (int, float))]
        else:
            text = re.sub(r"\s+", " ", pdf_text(path))
            text = re.sub(r"\bT (?=[a-z])", "T", text)  # "T oyota", "T obacco": a kerning artefact of the PDFs
            # the PDF holds several numbered lists (countries, applicants): split them into runs that start at
            # rank 1 and keep the run of applicants, the one that names the leading applicants of every year
            runs: list[list[tuple[int, str, int]]] = []
            for m in EPO_ROW.finditer(text):
                rank, name, count = int(m.group(1)), m.group(2).strip(), int(m.group(3).replace(" ", ""))
                if rank == 1 or not runs:
                    runs.append([])
                if rank <= 50:
                    runs[-1].append((rank, name, count))
            rows = next(r for r in runs if any(re.fullmatch(r"(?i)huawei|samsung", n) for _, n, _ in r))
        rows.sort()
        out[year] = YearList(rows, None, url, EPO_PAGES[year])
    return out


@dataclass
class Entity:
    key: str
    names: dict[int, str] = field(default_factory=dict)
    values: dict[int, int] = field(default_factory=dict)
    ranks: dict[int, int] = field(default_factory=dict)

    @property
    def total(self) -> int:
        return sum(self.values.values())


def resolve(k: str) -> str:
    return ALIASES.get(k, (k,))[0]


EXCLUDED: set[str] = set()


def entities(lists: dict[int, YearList], residents: bool) -> list[Entity]:
    """Companies of the lists. Resident lists also hold individuals: a resident counts as a company when some year
    lists it with a legal form (LTDA, S.A., ...). Non-resident and EPO lists (group names, often without a legal
    form) only drop universities and research bodies."""
    with_form = {resolve(key(n)) for yl in lists.values() for _, n, _ in yl.rows if has_legal_form(n)}
    found: dict[str, Entity] = {}
    for year, yl in sorted(lists.items()):
        for rank, name, count in yl.rows:
            if is_organisation(name) or (residents and resolve(key(name)) not in with_form):
                EXCLUDED.add(name)
                continue
            k = resolve(key(name))
            e = found.setdefault(k, Entity(k))
            e.values[year] = e.values.get(year, 0) + count  # two published entities merged by a rename
            e.ranks[year] = min(rank, e.ranks.get(year, rank))
            e.names[year] = name
    return sorted(found.values(), key=lambda e: -e.total)


# Short names for the chart (the names as published stay in "publishedNames").
DISPLAY = {"PETROLEOBRASILEIROPETROBRAS": "Petrobras", "ERICSSON": "Ericsson", "STELLANTISAUTOMOVEISBRASIL": "Stellantis Automóveis Brasil"}
ACRONYMS = {"LG", "BASF", "RTX", "CNH", "WEG", "LM", "SK", "ZTE", "CATL", "ABB", "NXP", "CEA", "BYD", "IBM", "IP"}


def display(k: str, name: str) -> str:
    if k in DISPLAY:
        return DISPLAY[k]
    cleaned = re.sub(r"\s*\((?:PUBL|publ)\)", "", name)
    cleaned = re.sub(r"[\s,.-]*\b(LTDA|LIMITADA|S\.?\s?A\.?|S/A|INC(ORPORATED)?|CO\.,? LTD\.?|CORPORATION|LLC|GMBH|SE|B\.V\.|AG)\.?\s*$", "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"[\s,.-]*\b(LTDA|LIMITADA|S\.?\s?A\.?|S/A|INC|CO\.?,? LTD\.?|LLC|GMBH|SE|B\.V\.|AG)\.?\s*$", "", cleaned, flags=re.IGNORECASE).strip(" ,.-")
    if cleaned != cleaned.upper():
        return cleaned
    return " ".join(w if w in ACRONYMS else w.capitalize() for w in cleaned.split())


def view(view_id: str, office: str, lists: dict[int, YearList], residents: bool, top: int = 10) -> dict:
    ents = entities(lists, residents)[:top]
    return {
        "id": view_id,
        "office": office,
        "years": {str(y): ({"published": True, "listSize": len(lists[y].rows), "cutoff": lists[y].cutoff, "total": lists[y].total,
                            "source": lists[y].source, "page": lists[y].page}
                           if y in lists else {"published": False}) for y in YEARS},
        "companies": [
            {
                "name": display(e.key, e.names[max(e.names)]),
                "publishedNames": sorted(set(e.names.values())),
                "values": {str(y): e.values.get(y) for y in YEARS},
                "ranks": {str(y): e.ranks.get(y) for y in YEARS},
            }
            for e in ents
        ],
    }


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--cache", type=Path, default=Path(__file__).with_name("cache"))
    ap.add_argument("--show-excluded", action="store_true", help="list the applicants left out as non-companies")
    ap.add_argument("--out", type=Path, default=Path(__file__).parents[2] / "src/assets/patent-stats/rankings.json")
    a = ap.parse_args()
    logging.getLogger("pypdf").setLevel(logging.ERROR)  # font-encoding notices of the INPI PDFs
    a.cache.mkdir(parents=True, exist_ok=True)
    views = [
        view("br-nonresidents", "INPI", inpi_lists(a.cache, resident=False), residents=False),
        view("br-residents", "INPI", inpi_lists(a.cache, resident=True), residents=True),
        view("epo", "EPO", epo_lists(a.cache), residents=False),
    ]
    data = {
        "generated": date.today().isoformat(),
        "years": YEARS,
        "views": views,
        "aliases": [{"from": old, "to": new, "note": note, "source": src} for old, (new, note, src) in ALIASES.items()],
    }
    a.out.parent.mkdir(parents=True, exist_ok=True)
    a.out.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
    if a.show_excluded:
        print("excluded:", " | ".join(sorted(EXCLUDED)))
    for v in data["views"]:
        print(v["id"], "->", ", ".join(f"{c['name']} {sum(x or 0 for x in c['values'].values())}" for c in v["companies"]))


if __name__ == "__main__":
    main()
