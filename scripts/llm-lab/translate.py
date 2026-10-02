"""Machine translation for the compact-LLM demo, with a sentence cache (scripts/llm-lab/cache/<direction>.json).

CPU only (the GPU is busy with the experiments). Open models (Helsinki-NLP OPUS-MT):
  en-pt  opus-mt-en-ROMANCE with the >>pt_br<< target token (Apache-2.0)
  en-de  opus-mt-en-de (CC-BY-4.0)
  pt-en  opus-mt-ROMANCE-en (Apache-2.0)
  pt-de  pt-en followed by en-de (there is no direct OPUS-MT model)
Texts are translated sentence by sentence; the cache is keyed by sentence, so a re-export only translates what is new
(for example the answers of a model that has just finished). Needs sentencepiece and sacremoses.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

CACHE = Path(__file__).resolve().parent / "cache"
MODELOS = {
    "en-pt": ("Helsinki-NLP/opus-mt-en-ROMANCE", ">>pt_br<< "),
    "en-de": ("Helsinki-NLP/opus-mt-en-de", ""),
    "pt-en": ("Helsinki-NLP/opus-mt-ROMANCE-en", ""),
}
# A sentence ends at . ! ? followed by a capital letter (keeps "Art. 7º", "nº 9.279" and "p. 12" whole)
FIM_DE_FRASE = re.compile(r"(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÂÊÔÃÕÇ“\"(])")


def frases(texto: str) -> list[str]:
    return [f for f in FIM_DE_FRASE.split(texto.strip()) if f]


class Tradutor:
    def __init__(self, threads: int = 4, lote: int = 8):
        import torch
        torch.set_num_threads(threads)
        self.lote = lote
        self.modelos: dict[str, tuple] = {}
        self.caches: dict[str, dict[str, str]] = {}
        CACHE.mkdir(exist_ok=True)

    def _cache(self, direcao: str) -> dict[str, str]:
        if direcao not in self.caches:
            arq = CACHE / f"{direcao}.json"
            self.caches[direcao] = json.loads(arq.read_text(encoding="utf-8")) if arq.exists() else {}
        return self.caches[direcao]

    def _salvar(self, direcao: str) -> None:
        arq = CACHE / f"{direcao}.json"
        arq.write_text(json.dumps(self.caches[direcao], ensure_ascii=False, indent=0, sort_keys=True), encoding="utf-8")

    def _modelo(self, direcao: str):
        if direcao not in self.modelos:
            from transformers import MarianMTModel, MarianTokenizer
            nome, prefixo = MODELOS[direcao]
            self.modelos[direcao] = (MarianTokenizer.from_pretrained(nome), MarianMTModel.from_pretrained(nome).eval(),
                                     prefixo)
        return self.modelos[direcao]

    def _frases(self, lista: list[str], direcao: str) -> None:
        """Translates the sentences missing from the cache (longest first, in batches)."""
        import torch
        cache = self._cache(direcao)
        faltam = sorted({f for f in lista if f not in cache}, key=len, reverse=True)
        if not faltam:
            return
        tok, modelo, prefixo = self._modelo(direcao)
        print(f"  traduzindo {len(faltam)} frases ({direcao})", flush=True)
        for i in range(0, len(faltam), self.lote):
            parte = faltam[i:i + self.lote]
            with torch.no_grad():
                enc = tok([prefixo + f for f in parte], return_tensors="pt", padding=True, truncation=True,
                          max_length=512)
                saida = modelo.generate(**enc, num_beams=1, max_new_tokens=512)
            for fonte, alvo in zip(parte, tok.batch_decode(saida, skip_special_tokens=True), strict=True):
                cache[fonte] = alvo
            if (i // self.lote) % 25 == 24:
                self._salvar(direcao)
                print(f"    {i + len(parte)}/{len(faltam)}", flush=True)
        self._salvar(direcao)

    def traduzir(self, textos: list[str], direcao: str) -> list[str]:
        if direcao == "pt-de":
            return self.traduzir(self.traduzir(textos, "pt-en"), "en-de")
        partes = [frases(t) for t in textos]
        self._frases([f for p in partes for f in p], direcao)
        cache = self._cache(direcao)
        return [" ".join(cache[f] for f in p) for p in partes]
