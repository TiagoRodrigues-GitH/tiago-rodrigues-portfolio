"""Top company assignees of US utility patents per grant year, from the USPTO's PatentsView tables.

Indicator: utility patents granted by the USPTO, counted once per patent under its first-named assignee
(``assignee_sequence`` 0, as the EPO counts the first-named applicant), companies only (assignee types 2 and 3:
US and foreign company or corporation; 12 and 13 for part interests), by year of grant. Names are PatentsView's
disambiguated organisation names; distinct subsidiaries stay separate. Grants are not applications: this view
must not be compared directly with the INPI and EPO views.

Source: PatentsView granted-patent tables ``g_patent`` and ``g_assignee_disambiguated``, distributed since March
2026 by the USPTO Open Data Portal (product ``pvgpatdis``), which requires a free USPTO.gov account and API key:

* with ``USPTO_API_KEY`` set, the files are downloaded into the cache;
* otherwise put ``g_patent.tsv.zip`` and ``g_assignee_disambiguated.tsv.zip`` in ``--uspto-dir``.
"""

from __future__ import annotations

import json
import os
import urllib.request
from pathlib import Path

PRODUCT = "pvgpatdis"
PRODUCT_URL = f"https://api.uspto.gov/api/v1/datasets/products/{PRODUCT}"
PAGE = "https://data.uspto.gov/bulkdata/datasets/pvgpatdis"
FILES = ("g_patent.tsv.zip", "g_assignee_disambiguated.tsv.zip")
COMPANY_TYPES = {2, 3, 12, 13}
TOP = 50


def _download_with_key(cache: Path, key: str) -> Path:
    """Fetches the two tables through the Open Data Portal API (x-api-key header; redirects followed)."""
    req = urllib.request.Request(PRODUCT_URL, headers={"x-api-key": key, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=120) as r:
        product = json.loads(r.read().decode("utf-8"))
    uris = {}

    def walk(node):  # the file list is nested in the product record; collect every download URI by file name
        if isinstance(node, dict):
            uri = node.get("fileDownloadURI")
            name = node.get("fileName") or (uri.rsplit("/", 1)[-1] if uri else None)
            if uri and name:
                uris[name] = uri
            for v in node.values():
                walk(v)
        elif isinstance(node, list):
            for v in node:
                walk(v)

    walk(product)
    folder = cache / "uspto"
    folder.mkdir(parents=True, exist_ok=True)
    for name in FILES:
        target = folder / name
        if target.exists():
            continue
        if name not in uris:
            raise RuntimeError(f"{name} not listed in {PRODUCT}; files: {sorted(uris)}")
        req = urllib.request.Request(uris[name], headers={"x-api-key": key})
        with urllib.request.urlopen(req, timeout=3600) as r, open(target.with_suffix(".part"), "wb") as f:
            while chunk := r.read(1 << 20):
                f.write(chunk)
        target.with_suffix(".part").replace(target)
    return folder


def locate(cache: Path, folder: Path | None) -> Path | None:
    """Folder holding both tables, or None when they are not available (no key, no local copy)."""
    for candidate in [folder, cache / "uspto"]:
        if candidate and all((candidate / f).exists() for f in FILES):
            return candidate
    key = os.environ.get("USPTO_API_KEY")
    return _download_with_key(cache, key) if key else None


def top_assignees(folder: Path, years: list[int]) -> tuple[dict[int, list[tuple[int, str, int]]], str]:
    """{year: [(rank, organisation, grants), ...]} (top 50 with ties) and the last grant date in the data."""
    import pandas as pd

    patents = pd.read_csv(folder / FILES[0], sep="\t", usecols=["patent_id", "patent_type", "patent_date"],
                          dtype=str, compression="zip")
    patents = patents[patents["patent_type"].str.lower() == "utility"]
    patents["year"] = patents["patent_date"].str[:4].astype(int)
    patents = patents[patents["year"].isin(years)]
    last_date = str(patents["patent_date"].max())
    assignees = pd.read_csv(folder / FILES[1], sep="\t", compression="zip", dtype=str,
                            usecols=["patent_id", "assignee_sequence", "disambig_assignee_organization", "assignee_type"])
    assignees = assignees[(assignees["assignee_sequence"] == "0") & assignees["disambig_assignee_organization"].notna()]
    assignees = assignees[pd.to_numeric(assignees["assignee_type"], errors="coerce").isin(COMPANY_TYPES)]
    merged = patents.merge(assignees, on="patent_id")
    counts = merged.groupby(["year", "disambig_assignee_organization"]).size().reset_index(name="grants")
    out: dict[int, list[tuple[int, str, int]]] = {}
    for year, group in counts.groupby("year"):
        group = group.sort_values(["grants", "disambig_assignee_organization"], ascending=[False, True])
        cutoff = group["grants"].iloc[min(TOP, len(group)) - 1]
        kept = group[group["grants"] >= cutoff]  # ties at the cut are all kept, as INPI does
        rank, rows, previous = 0, [], None
        for i, (name, grants) in enumerate(zip(kept["disambig_assignee_organization"], kept["grants"])):
            if grants != previous:
                rank, previous = i + 1, grants
            rows.append((rank, name, int(grants)))
        out[int(year)] = rows
    return out, last_date
