"""Exports the compact-LLM research results to the site (src/assets/llm-lab/), in Portuguese, English and German.

Run it again whenever the GPU queue finishes a model; models without results are marked as pending.

  nhtsa-classifier.json  TF-IDF + logistic regression that classifies a defect description typed in Portuguese,
                         English or German in the visitor's browser, plus reference texts the TypeScript port must
                         reproduce. Trained on the English complaints plus machine translations of a balanced subset.
  nhtsa.json             benchmark table and held-out complaints with every model's prediction (the models saw the
                         English original; the shown complaints were translated by hand, see manual_translations.json)
  patents.json           benchmark table and the test questions with the passages each model received, the
                         reference answer and every model's answer, machine-translated to English and German

Translations: translate.py (OPUS-MT on the CPU, cached in scripts/llm-lab/cache/).
Python environment: the research venv (FineTuning_LLM_ADAS\\.venv: torch, transformers, scikit-learn, pandas,
huggingface_hub, sentencepiece, sacremoses).

    python scripts/llm-lab/export_llm_lab.py [--pesquisa <03_Codigo_e_Scripts folder>]
"""
from __future__ import annotations

import argparse
import csv
import json
import random
import sys
from datetime import date
from pathlib import Path

AQUI = Path(__file__).resolve().parent
SITE = AQUI.parents[1]
SAIDA = SITE / "src" / "assets" / "llm-lab"
PESQUISA = Path.home() / "Desktop" / "Residência_AI" / "03_Codigo_e_Scripts"
sys.path.insert(0, str(AQUI))
from translate import Tradutor  # noqa: E402

TERMOS_NAVEGADOR = 20000      # three languages share the vocabulary of the in-browser classifier
TRADUZIDAS_POR_CLASSE = 500   # training complaints machine-translated to PT and to DE, per class
AVALIACAO_POR_CLASSE = 60     # evaluation complaints machine-translated to measure PT and DE
AMOSTRAS_POR_CLASSE = 3       # complaints shown on the page (translated by hand)
MANUAIS = json.loads((AQUI / "manual_translations.json").read_text(encoding="utf-8")) \
    if (AQUI / "manual_translations.json").exists() else {}


def r6(x: float | None) -> float | None:
    """Metrics keep 6 decimals: the page rounds them once (rounding 0.84247 to 4 and then to 3 places gives 0.843)."""
    return None if x is None else round(float(x), 6)


def ler_json(p: Path):
    return json.loads(p.read_text(encoding="utf-8")) if p.exists() else None


def gravar(nome: str, dados) -> None:
    SAIDA.mkdir(parents=True, exist_ok=True)
    texto = json.dumps(dados, ensure_ascii=False, separators=(",", ":"))
    (SAIDA / nome).write_text(texto, encoding="utf-8")
    print(f"  {nome}: {len(texto) / 1024:.0f} KB", flush=True)


def por_classe(rotulos: list[str], n: int, semente: int) -> list[int]:
    """The first n indices of each class in an order fixed by the seed: a larger n keeps the smaller selection, so the
    translation cache stays valid."""
    idx = []
    for rotulo in sorted(set(rotulos)):
        da_classe = [i for i, y in enumerate(rotulos) if y == rotulo]
        random.Random(f"{semente}-{rotulo}").shuffle(da_classe)
        idx += sorted(da_classe[:n])
    return idx


# ---------------------------------------------------------------------------------------------------- NHTSA
def nhtsa(raiz: Path, tradutor: Tradutor) -> None:
    sys.path.insert(0, str(raiz))
    from bench.data import LABELS, load_split
    from bench.models import MODELS
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.linear_model import LogisticRegression
    from sklearn.metrics import accuracy_score, f1_score

    res = raiz / "results"
    treino, avaliacao, teste = load_split("train"), load_split("eval"), load_split("test")

    # in-browser classifier: English complaints + PT and DE machine translations of a balanced subset
    idx_tr = por_classe(treino.labels, TRADUZIDAS_POR_CLASSE, 11)
    idx_av = por_classe(avaliacao.labels, AVALIACAO_POR_CLASSE, 12)
    textos, rotulos = list(treino.texts), list(treino.labels)
    avaliar = {"en": (avaliacao.texts, avaliacao.labels)}
    for lingua in ("pt", "de"):
        textos += tradutor.traduzir([treino.texts[i] for i in idx_tr], f"en-{lingua}")
        rotulos += [treino.labels[i] for i in idx_tr]
        avaliar[lingua] = (tradutor.traduzir([avaliacao.texts[i] for i in idx_av], f"en-{lingua}"),
                           [avaliacao.labels[i] for i in idx_av])
    vec = TfidfVectorizer(ngram_range=(1, 2), min_df=2, sublinear_tf=True, max_features=TERMOS_NAVEGADOR)
    clf = LogisticRegression(max_iter=3000, C=4.0).fit(vec.fit_transform(textos), rotulos)
    metricas_lingua = {}
    for lingua, (x, y) in avaliar.items():
        p = clf.predict(vec.transform(x)).tolist()
        metricas_lingua[lingua] = {"accuracy": r6(accuracy_score(y, p)), "macroF1": r6(f1_score(y, p, average="macro")),
                                   "n": len(y)}
        print(f"  classificador do navegador, {lingua}: F1 macro {metricas_lingua[lingua]['macroF1']:.3f} "
              f"({len(y)} reclamações)", flush=True)
    pred_av = clf.predict(vec.transform(avaliacao.texts)).tolist()
    pred_te = clf.predict(vec.transform(teste.texts)).tolist()
    termos = sorted(vec.vocabulary_, key=vec.vocabulary_.get)
    conferir = [avaliacao.texts[i] for i in (0, 400, 800)] + [avaliar["pt"][0][0], avaliar["de"][0][5]] + [
        "The brake pedal went to the floor and the vehicle did not stop at the intersection.",
        "O pedal do freio afundou e o carro não parou no cruzamento.",
        "Der Airbag hat beim Unfall nicht ausgelöst und die Warnleuchte bleibt an.",
    ]
    gravar("nhtsa-classifier.json", {
        "labels": list(clf.classes_),
        "terms": termos,
        "idf": [round(float(x), 4) for x in vec.idf_],
        # weights[term * nLabels + label]
        "weights": [round(float(w), 4) for j in range(len(termos)) for w in clf.coef_[:, j]],
        "bias": [round(float(b), 4) for b in clf.intercept_],
        "maxChars": 1000,
        "metrics": {"accuracyEval": r6(accuracy_score(avaliacao.labels, pred_av)),
                    "macroF1Eval": r6(f1_score(avaliacao.labels, pred_av, average="macro")),
                    "macroF1Test": r6(f1_score(teste.labels, pred_te, average="macro")),
                    "byLanguage": metricas_lingua},
        "check": [{"text": t, "probs": [round(float(p), 4) for p in clf.predict_proba(vec.transform([t]))[0]]}
                  for t in conferir],
    })

    # benchmark table (the LLMs and the TF-IDF baseline of the study saw the English complaints only)
    def metricas(pasta: Path) -> dict | None:
        av, te = ler_json(pasta / "metrics_eval.json"), ler_json(pasta / "metrics_test.json")
        if not av:
            return None
        return {"accuracyEval": r6(av["accuracy"]), "macroF1Eval": r6(av["macro_f1"]),
                "macroF1Test": r6(te["macro_f1"]) if te else None,
                "perClassF1Eval": {k: r6(v) for k, v in av["per_class_f1"].items()},
                "confusionEval": av["confusion_matrix"]["matrix"],
                "examplesPerSecond": round(av["examples_per_s"], 1) if av.get("examples_per_s") else None}

    linhas = [{"model": "majority", "stage": "baseline", "status": "done",
               **(metricas(res / "baselines" / "majority") or {})},
              {"model": "tfidf", "stage": "baseline", "status": "done",
               **(metricas(res / "baselines" / "tfidf_logreg") or {})}]
    previsoes = {}
    for chave in MODELS:
        for etapa in ("zero_shot", "lora"):
            m = metricas(res / chave / etapa)
            status = "done" if m else ("needsLargerGpu" if chave == "mistral-7b" else "pending")
            info = ler_json(res / chave / "lora" / "train_info.json") if etapa == "lora" else None
            linhas.append({"model": chave, "stage": etapa, "status": status, **(m or {}),
                           "trainMinutes": round(info["seconds"] / 60) if info else None})
            arq = res / chave / etapa / "predictions_eval.csv"
            if arq.exists():
                with open(arq, encoding="utf-8") as fh:
                    linhas_csv = list(csv.DictReader(fh))
                assert [r["label"] for r in linhas_csv] == avaliacao.labels, f"{arq}: rows out of order"
                previsoes[f"{chave}/{etapa}"] = [r["pred"] for r in linhas_csv]

    # held-out complaints (2014-2024 split) shown on the page, short enough to read on a phone. The predictions are
    # the study's, made on the English original; the PT and DE texts come from manual_translations.json (machine
    # translation only as a fallback, flagged as such).
    rng = random.Random(7)
    amostras = []
    for rotulo in LABELS:
        candidatos = [i for i, (t, y) in enumerate(zip(avaliacao.texts, avaliacao.labels, strict=True))
                      if y == rotulo and 180 <= len(t) <= 480]
        for i in sorted(rng.sample(candidatos, AMOSTRAS_POR_CLASSE)):
            original = avaliacao.texts[i]
            manual = MANUAIS.get("nhtsa", {}).get(original, {})
            texto, origem = {"en": original}, {"en": "original"}
            for lingua in ("pt", "de"):
                if manual.get(lingua):
                    texto[lingua], origem[lingua] = manual[lingua], "manual"
                else:
                    texto[lingua], origem[lingua] = tradutor.traduzir([original], f"en-{lingua}")[0], "machine"
            amostras.append({"text": texto, "translation": origem, "label": rotulo,
                             "predictions": {"tfidf": pred_av[i], **{k: v[i] for k, v in previsoes.items()}}})
    gravar("nhtsa.json", {"generated": date.today().isoformat(), "labels": LABELS,
                          "browserModel": {"terms": len(termos)}, "rows": linhas, "samples": amostras})


# -------------------------------------------------------------------------------------------------- patents
def patentes(raiz: Path, tradutor: Tradutor) -> None:
    sys.path.insert(0, str(raiz))
    from patentes.avaliacao import cita, f1_tokens, rouge_l, suporte
    from patentes.dados import PALAVRAS_TRECHO, exemplos
    from patentes.modelos import MODELOS, PADRAO

    res = raiz / "resultados"

    def cortar(texto: str) -> str:
        w = texto.split()
        return " ".join(w[:PALAVRAS_TRECHO]) + (" [...]" if len(w) > PALAVRAS_TRECHO else "")

    def notas(e: dict, resposta: str) -> dict:
        return {"rougeL": r6(rouge_l(e["alvo"], resposta)), "f1": r6(f1_tokens(e["alvo"], resposta)),
                "cites": bool(cita(resposta, e["fontes"])), "support": r6(suporte(resposta, e["trechos"]))}

    exs = exemplos("test", "qa", "rag")
    respostas: dict[str, dict[str, str]] = {}
    for chave in PADRAO:
        for etapa in ("base", "ajustado"):
            arq = res / "modelos" / chave / f"avaliacao_{etapa}" / "qa_rag.jsonl"
            if not arq.exists():
                continue
            linhas = [json.loads(x) for x in arq.open(encoding="utf-8")]
            if len(linhas) != len(exs):
                continue  # evaluation still running
            for e, r in zip(exs, linhas, strict=True):
                assert e["id"] == r["id"] and [p["citacao"] for p in e["trechos"]] == r["trechos"], \
                    f"{arq}: passages differ from the current retrieval"
                respostas.setdefault(e["id"], {})[f"{chave}/{'base' if etapa == 'base' else 'fineTuned'}"] = \
                    r["resposta_modelo"]

    itens = []
    for e in exs:
        top = e["trechos"][0]
        bm25 = f"{' '.join(top['texto'].split()[:130])} ({top['citacao']})."
        itens.append({"id": e["id"], "category": e["categoria"], "question": e["pergunta"], "reference": e["alvo"],
                      "passages": [{"citation": p["citacao"], "text": cortar(p["texto"])} for p in e["trechos"]],
                      "answers": {"bm25": {"text": bm25, **notas(e, bm25)},
                                  **{k: {"text": v, **notas(e, v)} for k, v in respostas.get(e["id"], {}).items()}}})

    # every shown text in the three languages: the original Portuguese plus machine translations
    fontes = sorted({t for it in itens for t in [it["question"], it["reference"],
                                                  *(p["text"] for p in it["passages"]),
                                                  *(a["text"] for a in it["answers"].values())]})
    traducoes = {"pt": dict(zip(fontes, fontes))}
    for lingua in ("en", "de"):
        traducoes[lingua] = dict(zip(fontes, tradutor.traduzir(fontes, f"pt-{lingua}"), strict=True))
    manual = MANUAIS.get("patents", {})

    def em_tres(texto: str) -> dict[str, str]:
        return {lingua: manual.get(texto, {}).get(lingua) or traducoes[lingua][texto] for lingua in ("pt", "en", "de")}

    for it in itens:
        it["question"] = em_tres(it["question"])
        it["reference"] = em_tres(it["reference"])
        for p in it["passages"]:
            p["text"] = em_tres(p["text"])
        for a in it["answers"].values():
            a["text"] = em_tres(a["text"])

    base = ler_json(res / "linhas_de_base.json") or {}
    linhas = []
    if base:
        q = base["qa_extrativa_bm25"]["todas"]
        linhas.append({"model": "bm25", "stage": "baseline", "status": "done",
                       "qaRougeL": q["rouge_l"], "qaF1": q["f1"], "qaCites": q["citacao"], "qaSupport": q["suporte"]})
        for nome, k in (("majority", "ipc_maioria"), ("tfidf", "ipc_tfidf_logistica")):
            linhas.append({"model": nome, "stage": "baseline", "status": "done",
                           "ipcAccuracy": base[k]["acuracia"], "ipcMacroF1": base[k]["f1_macro"]})
    for chave in PADRAO:
        treino = ler_json(res / "modelos" / chave / "treino.json")
        for etapa in ("base", "ajustado"):
            m = ler_json(res / "modelos" / chave / f"avaliacao_{etapa}" / "metricas.json") or {}
            rag = m.get("qa_rag", {}).get("todas", {})
            linhas.append({
                "model": chave, "stage": "base" if etapa == "base" else "fineTuned",
                "status": "done" if "ipc" in m else "pending", "hfId": MODELOS[chave]["id"],
                "qaRougeL": rag.get("rouge_l"), "qaF1": rag.get("f1"), "qaCites": rag.get("citacao"),
                "qaSupport": rag.get("suporte"),
                "closedBookRougeL": m.get("qa_fechado", {}).get("todas", {}).get("rouge_l"),
                "ipcAccuracy": m.get("ipc", {}).get("acuracia"), "ipcMacroF1": m.get("ipc", {}).get("f1_macro"),
                "tokensPerSecond": m.get("qa_rag", {}).get("tokens_por_s"),
                "bestEpoch": treino.get("melhor_epoca") if treino and etapa == "ajustado" else None,
                "epochsRun": treino.get("epocas_rodadas") if treino and etapa == "ajustado" else None})
    hpo = ler_json(res / "hpo" / "melhor.json")
    gravar("patents.json", {
        "generated": date.today().isoformat(), "testQuestions": len(exs), "rows": linhas,
        "search": None if not hpo else {"model": hpo["modelo"], "lr": hpo["lr"], "rank": hpo["rank"],
                                        "runs": [{"lr": r["lr"], "rank": r["rank"], "bestEpoch": r["melhor_epoca"],
                                                  "epochsRun": r["epocas_rodadas"],
                                                  "valLoss": r6(r["melhor_val_loss"])} for r in hpo["todas"]]},
        "items": itens})


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--pesquisa", type=Path, default=PESQUISA)
    a = ap.parse_args()
    tradutor = Tradutor()
    print("patents", flush=True)
    patentes(a.pesquisa / "LLM_Patentes_INPI", tradutor)
    print("NHTSA", flush=True)
    nhtsa(a.pesquisa / "LLM_Benchmark_NHTSA", tradutor)


if __name__ == "__main__":
    main()
