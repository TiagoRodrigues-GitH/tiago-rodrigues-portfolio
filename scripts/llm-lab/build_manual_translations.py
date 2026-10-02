"""Writes manual_translations.json: hand translations of the texts visitors read first (they replace the machine
translation of the same source text in export_llm_lab.py).

  nhtsa     the 15 complaints shown on the page (English original -> pt, de), in the order the export selects them
  patents   the 52 test questions (Portuguese original -> en, de), in test-set order

Run with the research venv after changing the sample selection:  python scripts/llm-lab/build_manual_translations.py
"""
from __future__ import annotations

import json
import random
import sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent
PESQUISA = Path.home() / "Desktop" / "Residência_AI" / "03_Codigo_e_Scripts"

NHTSA_PT = [
    "tl* O reclamante possui um BMW 328i 1999. Recebeu um aviso de recall da campanha NHTSA nº 19V851000 (airbags) e foi informado de que as peças não estavam disponíveis e de que a data de disponibilidade continuava desconhecida. O reclamante não havia falado com o fabricante sobre o recall e não havia sofrido nenhuma falha. A consulta pelo VIN confirma que as peças não estão disponíveis.",
    "tl* O reclamante possui um Pontiac Vibe 2004. Recebeu avisos das campanhas NHTSA nº 15V385000 (airbags) e 15V043000 (airbags); porém, as peças necessárias para o reparo não estavam disponíveis. O reclamante afirmou que o fabricante excedeu um prazo razoável para o reparo do recall. O fabricante não foi notificado. O reclamante não havia sofrido nenhuma falha. Atualizado em 11/06/15*lj, atualizado em 2/2/2016*js *cn",
    "Jeep Grand Cherokee 2004. O consumidor escreve sobre a falta de peças de reposição para o reparo do recall 15V-673 (módulo de controle do sistema de retenção dos ocupantes). *smd O consumidor afirmou que há mais de um ano recebe avisos de recall. Depois de dirigir duas horas para fazer o reparo, porque a concessionária disse que a peça havia chegado, ele soube no fim da tarde que o reparo não tinha sido feito, pois o módulo estava novamente em falta. *jb",
    "A abertura de emergência do porta-malas falhou. Esse sistema deveria ser mecânico e não deveria falhar. Continua sem funcionar com a energia elétrica ligada, com os acessórios ligados ou com o interruptor acionado, e também continua sem funcionar com a chave.",
    "tl* O reclamante possui uma Ford Windstar 2004. Afirmou que as luzes de advertência do painel de instrumentos acendiam de forma intermitente. O veículo não foi diagnosticado nem reparado. O fabricante não foi notificado da falha. A quilometragem no momento da falha era desconhecida.",
    "tl* O reclamante possui um Chevrolet Malibu 2002. Afirmou que o motor do veículo morreu várias vezes, de forma intermitente. O VIN do veículo não estava incluído na campanha NHTSA nº 14V047000 (sistema elétrico) nem na campanha nº 14V252000 (sistema elétrico). O veículo foi agendado para diagnóstico e reparo. O fabricante foi notificado da falha. A quilometragem aproximada no momento da falha era desconhecida.",
    "tl* O reclamante possui um Jeep Cherokee 1997. Ao pisar no pedal do freio, ele foi até o assoalho. O reclamante afirmou que houve perda total de frenagem. A concessionária (Cueter Chrysler Jeep Dodge Ram, em Ypsilanti, Michigan) foi informada da falha. O veículo não foi diagnosticado nem reparado. O fabricante foi informado da falha. A quilometragem no momento da falha era de 215.138 milhas.",
    "Saindo da minha garagem em marcha à ré, devagar, a cerca de 3 mph (5 km/h) e virando o volante para a esquerda, o rádio mostrou a mensagem \"service brake assistance\" (verificar a assistência de frenagem). Ao mesmo tempo, perdi o freio, e as luzes do controle de tração e do ABS acenderam no painel. Por sorte eu estava devagar, e o carro parou na lixeira do meu vizinho. Não quero nem pensar no que aconteceria se passasse outro carro ou alguém a pé. Agora tenho medo de dirigir.",
    "Dirigindo pela cidade, percebi que os freios estavam esponjosos e que era preciso pisar mais fundo no pedal. A luz \"check brake system\" (verificar o sistema de freios) acendeu e, ao inspecionar, notei que o fluido de freio estava baixo. Completei o reservatório até a marca de máximo. No dia seguinte, a mesma luz acendeu; inspecionei melhor as linhas de freio e descobri que as que vão da unidade do ABS até a traseira estavam corroídas pela ferrugem e vazando muito. *tr",
    "tl* O reclamante possui uma Dodge Ram 2500 2001. Afirmou que o painel começou a apresentar rachaduras. O veículo não foi levado à concessionária. O fabricante foi informado da falha. O veículo não foi reparado. A quilometragem no momento da falha e a atual eram de 84.000 milhas.",
    "Comprei este veículo recentemente e só depois da compra percebi como a ferrugem era grave. A parte de baixo está extremamente enferrujada e há vários furos de ferrugem no lado do passageiro dianteiro. Saber que, a qualquer momento, um buraco pode terminar o serviço e romper o chassi não é nada bom. Um recall para esse dano extremo por ferrugem seria muito bem-vindo, já que não tenho outra forma de consertar isso.",
    "Recall Takata – dirigindo por uma estrada rural escura, a motorista perdeu o controle do veículo, saiu da pista e bateu numa árvore. Com o impacto, o Jeep pegou fogo. A motorista foi retirada porque estava presa dentro do Jeep em chamas. O Jeep teve perda total por causa do incêndio.",
    "tl* O reclamante possui um Ford Focus 2000. Dirigia a 35 mph (cerca de 56 km/h) quando o motor não voltou à marcha lenta. O veículo não passou por inspeção nem diagnóstico e não foi reparado. O fabricante foi notificado e informou que o veículo não estava incluído no recall da campanha NHTSA nº 00V302000 (controle de velocidade do veículo). A quilometragem aproximada no momento da falha era de 140.000 milhas.",
    "Isso tem sido um problema muito grande nos chassis de todas as picapes e SUVs da Toyota: são uma porcaria e enferrujam todos exatamente no mesmo lugar. Se não for visto a tempo, pode causar um erro fatal e muitos processos. Se puderam fazer recall de todas as Tacomas que tinham o mesmo problema, por que não das 4Runner? A maioria das que ainda rodam tem muitos remendos no chassi para continuar rodando e minimamente seguras.",
    "tl* O reclamante possui uma Dodge Ram 3500 2002. A 50 mph (cerca de 80 km/h), a luz de advertência de serviço do veículo acendeu e o motor morreu. O veículo foi rebocado até a residência do reclamante. Não foi diagnosticado nem reparado. O fabricante foi informado da falha e disse que voltaria a entrar em contato. A quilometragem no momento da falha era de 130.000 milhas.",
]

NHTSA_DE = [
    "tl* Die meldende Person besitzt einen BMW 328i, Baujahr 1999. Sie erhielt eine Rückrufmitteilung zur NHTSA-Kampagne Nr. 19V851000 (Airbags) und wurde informiert, dass die Teile nicht verfügbar seien und weiterhin unklar sei, wann sie verfügbar würden. Sie hatte mit dem Hersteller nicht über den Rückruf gesprochen und keinen Ausfall erlebt. Die VIN-Abfrage bestätigt, dass die Teile nicht verfügbar sind.",
    "tl* Die meldende Person besitzt einen Pontiac Vibe, Baujahr 2004. Sie erhielt Mitteilungen zu den NHTSA-Kampagnen Nr. 15V385000 (Airbags) und 15V043000 (Airbags); die für die Reparatur nötigen Teile waren jedoch nicht verfügbar. Laut der meldenden Person hat der Hersteller eine angemessene Frist für die Rückrufreparatur überschritten. Der Hersteller wurde nicht informiert. Es war kein Ausfall aufgetreten. Aktualisiert 11/06/15*lj, aktualisiert 2/2/2016*js *cn",
    "Jeep Grand Cherokee, Baujahr 2004. Der Verbraucher schreibt wegen fehlender Ersatzteile für die Rückrufreparatur 15V-673 (Steuergerät des Insassenrückhaltesystems). *smd Der Verbraucher gab an, seit über einem Jahr Rückrufmitteilungen zu erhalten. Nachdem er zwei Stunden gefahren war, um den Rückruf erledigen zu lassen, weil der Händler mitgeteilt hatte, das Teil sei eingetroffen, erfuhr er am späten Nachmittag, dass die Reparatur nicht durchgeführt worden war, da das Modul erneut nicht vorrätig war. *jb",
    "Die Notentriegelung des Kofferraums hat versagt. Dieses System sollte mechanisch sein und nicht ausfallen. Sie funktioniert weiterhin nicht, egal ob die Stromversorgung an ist, das Zubehör eingeschaltet ist oder der Schalter betätigt wird, und auch nicht mit dem Schlüssel.",
    "tl* Die meldende Person besitzt einen Ford Windstar, Baujahr 2004. Sie gab an, dass die Warnleuchten im Kombiinstrument zeitweise aufleuchteten. Das Fahrzeug wurde weder diagnostiziert noch repariert. Der Hersteller wurde über den Fehler nicht informiert. Die Laufleistung zum Zeitpunkt des Ausfalls war unbekannt.",
    "tl* Die meldende Person besitzt einen Chevrolet Malibu, Baujahr 2002. Sie gab an, dass der Motor mehrfach unvermittelt ausging. Die VIN des Fahrzeugs war weder in der NHTSA-Kampagne Nr. 14V047000 (Elektrik) noch in der Kampagne Nr. 14V252000 (Elektrik) enthalten. Für das Fahrzeug wurden eine Diagnose und eine Reparatur eingeplant. Der Hersteller wurde über den Fehler informiert. Die ungefähre Laufleistung beim Ausfall war unbekannt.",
    "tl* Die meldende Person besitzt einen Jeep Cherokee, Baujahr 1997. Beim Betätigen des Bremspedals ging es bis zum Bodenblech durch. Laut der meldenden Person fiel die Bremswirkung vollständig aus. Der Händler (Cueter Chrysler Jeep Dodge Ram in Ypsilanti, Michigan) wurde über den Ausfall informiert. Das Fahrzeug wurde weder diagnostiziert noch repariert. Der Hersteller wurde über den Ausfall informiert. Die Laufleistung beim Ausfall betrug 215.138 Meilen.",
    "Als ich langsam, mit etwa 3 mph (5 km/h), rückwärts aus meiner Einfahrt fuhr und das Lenkrad nach links drehte, zeigte das Radio die Meldung \"service brake assistance\" an. Im selben Moment fiel die Bremse aus, und die Kontrollleuchten für Traktionskontrolle und ABS gingen im Armaturenbrett an. Zum Glück war ich langsam, sodass das Auto an der Mülltonne meines Nachbarn stehen blieb. Ich will mir nicht vorstellen, was passiert wäre, wenn ein anderes Auto oder jemand zu Fuß vorbeigekommen wäre. Jetzt habe ich Angst zu fahren.",
    "Bei einer Fahrt durch die Stadt bemerkte ich, dass sich die Bremsen schwammig anfühlten und das Pedal weiter durchgetreten werden musste. Die Warnleuchte \"check brake system\" ging an, und bei der Kontrolle stellte ich fest, dass zu wenig Bremsflüssigkeit vorhanden war. Ich füllte den Behälter bis zur Max-Markierung auf. Am nächsten Tag leuchtete dieselbe Warnleuchte wieder, und bei genauerer Prüfung der Bremsleitungen zeigte sich, dass die Leitungen vom ABS-Block nach hinten durchgerostet und stark undicht waren. *tr",
    "tl* Die meldende Person besitzt einen Dodge Ram 2500, Baujahr 2001. Sie gab an, dass sich im Armaturenbrett Risse gebildet hätten. Das Fahrzeug wurde nicht zum Händler gebracht. Der Hersteller wurde über den Mangel informiert. Das Fahrzeug wurde nicht repariert. Die Laufleistung beim Auftreten des Mangels und aktuell betrug 84.000 Meilen.",
    "Ich habe dieses Fahrzeug vor Kurzem gekauft und erst nach dem Kauf bemerkt, wie stark es verrostet ist. Der Unterboden ist extrem verrostet, und auf der Beifahrerseite vorne gibt es mehrere Rostlöcher. Zu wissen, dass jederzeit eine Bodenwelle dem Rahmen den Rest geben könnte, ist nicht gerade beruhigend. Ein Rückruf wegen der extremen Rostschäden wäre sehr willkommen, da ich keine andere Möglichkeit habe, das zu reparieren.",
    "Takata-Rückruf – auf einer dunklen Landstraße verlor die Fahrerin die Kontrolle über das Fahrzeug, kam von der Straße ab und prallte gegen einen Baum. Beim Aufprall ging der Jeep in Flammen auf. Die Fahrerin wurde herausgezogen, weil sie im brennenden Jeep eingeschlossen war. Der Jeep erlitt durch das Feuer einen Totalschaden.",
    "tl* Die meldende Person besitzt einen Ford Focus, Baujahr 2000. Bei 35 mph (ca. 56 km/h) kehrte der Motor nicht in den Leerlauf zurück. Das Fahrzeug wurde weder geprüft noch diagnostiziert und nicht repariert. Der Hersteller wurde informiert und teilte mit, dass das Fahrzeug nicht unter den Rückruf der NHTSA-Kampagne Nr. 00V302000 (Geschwindigkeitsregelung) falle. Die ungefähre Laufleistung beim Ausfall betrug 140.000 Meilen.",
    "Das ist ein sehr großes Problem bei den Rahmen aller Pickups und SUVs von Toyota: Sie sind Schrott und rosten alle an genau derselben Stelle durch. Wenn man das nicht rechtzeitig bemerkt, kann das zu einem tödlichen Fehler und vielen Klagen führen. Wenn man alle Tacomas mit demselben Problem zurückrufen konnte, warum dann nicht die 4Runner? Die meisten, die noch fahren, haben viele Flicken am Rahmen, damit sie fahrbereit und einigermaßen sicher bleiben.",
    "tl* Die meldende Person besitzt einen Dodge Ram 3500, Baujahr 2002. Bei 50 mph (ca. 80 km/h) leuchtete die Service-Warnleuchte auf, und der Motor ging aus. Das Fahrzeug wurde zum Wohnort der meldenden Person abgeschleppt. Es wurde weder diagnostiziert noch repariert. Der Hersteller wurde über den Ausfall informiert und kündigte an, sich wieder zu melden. Die Laufleistung beim Ausfall betrug 130.000 Meilen.",
]

# (en, de) for the 52 test questions, in test-set order
LEI = "Law No. 9,279/1996", "des Gesetzes Nr. 9.279/1996"
MANUAL = "What does the INPI Patent Manual explain about “{}”?", "Was erläutert das Patenthandbuch des INPI zu „{}“?"
BLOCO1 = ("What do the INPI Examination Guidelines (Block I — content of the application) say about “{}”?",
          "Was sagen die Prüfungsrichtlinien des INPI (Block I – Inhalt der Anmeldung) zu „{}“?")
BLOCO2 = ("What do the INPI Examination Guidelines (Block II — patentability) say about “{}”?",
          "Was sagen die Prüfungsrichtlinien des INPI (Block II – Patentierbarkeit) zu „{}“?")
RADAR_EV = ("What does INPI’s Technology Radar on electric and hybrid vehicles explain about “{}”?",
            "Was erläutert das Technologie-Radar des INPI zu Elektro- und Hybridfahrzeugen zu „{}“?")


def lei(art: str, en: str, de: str) -> tuple[str, str]:
    return (f"What does Art. {art} of {LEI[0]} establish, in the section “{en}”?",
            f"Was regelt Art. {art} {LEI[1]} im Abschnitt „{de}“?")


def modelo(par: tuple[str, str], en: str, de: str) -> tuple[str, str]:
    return par[0].format(en), par[1].format(de)


PERGUNTAS = [
    lei("7", "Ownership", "Inhaberschaft"),
    lei("16", "Priority", "Priorität"),
    lei("21", "Filing of the application", "Einreichung der Anmeldung"),
    lei("32", "Procedure and examination of the application", "Verfahren und Prüfung der Anmeldung"),
    lei("46", "General provisions", "Allgemeine Bestimmungen"),
    lei("48", "General provisions", "Allgemeine Bestimmungen"),
    lei("64", "Licence offer", "Lizenzangebot"),
    lei("71", "Compulsory licence", "Zwangslizenz"),
    lei("76", "Certificate of addition of invention", "Zusatzzertifikat zur Erfindung"),
    modelo(MANUAL, "Ways of submitting documents and petitions", "Wege zur Einreichung von Dokumenten und Anträgen"),
    modelo(MANUAL, "Obligations of the patent holder", "Pflichten des Patentinhabers"),
    modelo(MANUAL, "Rights of inventors", "Rechte der Erfinder"),
    modelo(MANUAL, "Initial considerations on drafting a patent application or certificate of addition",
           "Erste Hinweise zum Abfassen einer Patentanmeldung oder eines Zusatzzertifikats"),
    modelo(MANUAL, "Description", "Beschreibung"),
    modelo(MANUAL, "Drawings", "Zeichnungen"),
    modelo(MANUAL, "Data of the patent application or certificate of addition of invention",
           "Angaben zur Patentanmeldung oder zum Zusatzzertifikat"),
    modelo(MANUAL, "Inventor data", "Angaben zum Erfinder"),
    modelo(MANUAL, "Tracking through ‘My applications’ in the Patent Database",
           "Verfolgung über ‚Meine Anmeldungen‘ in der Patentdatenbank"),
    modelo(MANUAL, "Reinstatement (examination fee)", "Wiederaufnahme (Prüfungsgebühr)"),
    ("Do I need to search whether the invention already exists?",
     "Muss ich recherchieren, ob die Erfindung bereits existiert?"),
    ("How do I apply for protection of an invention in other countries?",
     "Wie beantrage ich Schutz für eine Erfindung in anderen Ländern?"),
    modelo(BLOCO1, "Essential features", "Wesentliche Merkmale"),
    modelo(BLOCO1, "Defining the subject matter in terms of parameters", "Definition des Schutzgegenstands durch Parameter"),
    modelo(BLOCO1, "The term ‘in’", "Der Begriff ‚in‘"),
    modelo(BLOCO1, "References to the description or drawings", "Verweise auf Beschreibung oder Zeichnungen"),
    modelo(BLOCO1, "The abstract", "Die Zusammenfassung"),
    modelo(BLOCO2, "Therapeutic methods", "Therapeutische Verfahren"),
    modelo(BLOCO2, "Documents in a non-official language", "Dokumente in einer nicht amtlichen Sprache"),
    modelo(BLOCO2, "Establishing a publication date", "Festlegung eines Veröffentlichungsdatums"),
    modelo(BLOCO2, "Specific and generic terms", "Spezifische und generische Begriffe"),
    modelo(BLOCO2, "Determining the closest prior art", "Bestimmung des nächstliegenden Stands der Technik"),
    modelo(BLOCO2, "Obvious selection", "Naheliegende Auswahl"),
    modelo(BLOCO2, "Invention by changing elements", "Erfindung durch Veränderung von Elementen"),
    modelo(BLOCO2, "Overview", "Überblick"),
    modelo(BLOCO2, "Clarity and precision: need for qualitative/quantitative definitions",
           "Klarheit und Genauigkeit: Notwendigkeit qualitativer/quantitativer Definitionen"),
    ("What does INPI’s Technology Radar on the automotive sector explain about “The Brazilian automotive sector”?",
     "Was erläutert das Technologie-Radar des INPI zum Automobilsektor zu „Der brasilianische Automobilsektor“?"),
    modelo(RADAR_EV, "Motivation for the study", "Motivation der Studie"),
    modelo(RADAR_EV, "Conclusions", "Schlussfolgerungen"),
    modelo(RADAR_EV, "References", "Literaturverzeichnis"),
    ("What else does the INPI website say about patent searches (part 2)?",
     "Was sagt die INPI-Website außerdem zur Patentrecherche (Teil 2)?"),
    ("What else does the INPI website say about the plan to reduce the backlog (part 4)?",
     "Was sagt die INPI-Website außerdem zum Plan gegen den Prüfungsrückstau (Teil 4)?"),
    ("What else does the INPI website say about the search and preliminary opinion on patentability (part 2)?",
     "Was sagt die INPI-Website außerdem zur Recherche und vorläufigen Stellungnahme zur Patentierbarkeit (Teil 2)?"),
    ("What does the INPI website say about the steps to request fast-track examination?",
     "Was sagt die INPI-Website zu den Schritten für die Beantragung der beschleunigten Prüfung?"),
    ("What else does the INPI website say about the steps to request fast-track examination (part 3)?",
     "Was sagt die INPI-Website außerdem zu den Schritten für die Beantragung der beschleunigten Prüfung (Teil 3)?"),
    ("What is the difference between the automatic e-mail notifications and the messages in the personal mailbox "
     "of the Patent Services Module?",
     "Was ist der Unterschied zwischen den automatischen E-Mail-Benachrichtigungen und den Nachrichten im "
     "persönlichen Postfach des Patent-Servicemoduls?"),
    ("Where can I ask questions about the Patent Services Module?", "Wo kann ich Fragen zum Patent-Servicemodul stellen?"),
    ("How does an INPI case number show the type of protection?", "Wie zeigt die Aktennummer beim INPI die Schutzart an?"),
    ("What is fast-track examination of patents?", "Was ist die beschleunigte Prüfung von Patenten?"),
    ("What is the deadline for requesting examination of a patent application?",
     "Welche Frist gilt für den Prüfungsantrag einer Patentanmeldung?"),
    ("Can I patent the source code of a lane detection algorithm?",
     "Kann ich den Quellcode eines Algorithmus zur Fahrspurerkennung patentieren?"),
    ("Which autonomous-vehicle technologies does the automotive-sector Radar highlight?",
     "Welche Technologien für autonome Fahrzeuge hebt das Radar zum Automobilsektor hervor?"),
    ("Which categories of vehicle parts receive the most patent applications in Brazil?",
     "Auf welche Kategorien von Fahrzeugteilen entfallen in Brasilien die meisten Patentanmeldungen?"),
]


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    sys.path.insert(0, str(PESQUISA / "LLM_Benchmark_NHTSA"))
    sys.path.insert(0, str(PESQUISA / "LLM_Patentes_INPI"))
    sys.path.insert(0, str(AQUI))
    from bench.data import LABELS, load_split
    from export_llm_lab import AMOSTRAS_POR_CLASSE
    from patentes.dados import exemplos

    avaliacao = load_split("eval")
    rng = random.Random(7)  # same selection as export_llm_lab.nhtsa
    originais = []
    for rotulo in LABELS:
        candidatos = [i for i, (t, y) in enumerate(zip(avaliacao.texts, avaliacao.labels, strict=True))
                      if y == rotulo and 180 <= len(t) <= 480]
        originais += [avaliacao.texts[i] for i in sorted(rng.sample(candidatos, AMOSTRAS_POR_CLASSE))]
    perguntas = [e["pergunta"] for e in exemplos("test", "qa", "rag")]
    assert len(originais) == len(NHTSA_PT) == len(NHTSA_DE), len(originais)
    assert len(perguntas) == len(PERGUNTAS), len(perguntas)
    dados = {"nhtsa": {o: {"pt": pt, "de": de} for o, pt, de in zip(originais, NHTSA_PT, NHTSA_DE, strict=True)},
             "patents": {p: {"en": en, "de": de} for p, (en, de) in zip(perguntas, PERGUNTAS, strict=True)}}
    (AQUI / "manual_translations.json").write_text(json.dumps(dados, ensure_ascii=False, indent=1), encoding="utf-8")
    for o, pt in list(zip(originais, NHTSA_PT))[:3]:
        print("EN:", o[:90], "\nPT:", pt[:90], "\n")
    for p, (en, de) in list(zip(perguntas, PERGUNTAS))[-3:]:
        print("PT:", p, "\nEN:", en, "\nDE:", de, "\n")


if __name__ == "__main__":
    main()
