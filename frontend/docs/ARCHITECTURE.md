# Architecture of the interactive project pages

Scope: the three interactive modules added to the portfolio in October 2026 — the street-routing page
(`/projects/street-routing`), the patent guide with applicant statistics (`/projects/patent-assistant`) and the guided defect
triage (`/projects/defect-triage`; the former `/projects/compact-llm` redirects to it). Structure follows arc42 (Starke & Hruschka) with C4-style views (Brown); quality goals
follow ISO/IEC 25010.

## 1. Quality goals

| Goal (ISO/IEC 25010) | What it means here |
| --- | --- |
| Functional correctness | Exact algorithms return the shortest route (tested against Dijkstra); every number on the patent chart traces to an official file |
| Performance efficiency | A search on São Paulo (113 k intersections) never freezes the page; drawing a replay never slows the computation |
| Usability and accessibility | WCAG 2.2 AA: keyboard operation, visible focus, colour never the only cue, 44 px touch targets, layouts reorganised (not shrunk) on phones |
| Maintainability | Algorithms, playback, rendering and texts are separate units with tests; adding an algorithm is one registry entry |
| Security and privacy | No server, no third-party requests, no personal data collected; the strict Content-Security-Policy is unchanged |

## 2. Street routing: building blocks

```text
street-routing.component (page: places, areas, picking, orchestration)
 ├── algorithm-panel/        selector, description, parameters           (presentation)
 ├── playback/
 │   ├── playback-bar        run, play/pause, step, restart, skip, speed (presentation)
 │   ├── playback-controller requestAnimationFrame loop → steps per frame (application)
 │   ├── map-trace-renderer  TraceRenderer for MapLibre (feature-state)   (adapter)
 │   └── map-legend          colour + shape legend                        (presentation)
 ├── oneway-demo/            didactic directed graph in SVG (reuses engine, controller, bar, legend)
 ├── routing-client ──postMessage──► routing.worker → routing-protocol    (infrastructure)
 ├── map-view                MapLibre layers, no tile server              (adapter)
 └── engine/                 pure TypeScript, no Angular                  (domain)
     ├── street-graph        CSR out-edges and in-edges, one-way streets
     ├── exact-search        Dijkstra, A*, ALT, bidirectional, Bellman-Ford-Moore, BFS, greedy
     ├── metaheuristics      ant colony, genetic algorithm, simulated annealing
     ├── search-trace        recorders: what each algorithm did, step by step
     ├── search-player       replays a trace; PlaybackClock: time → steps
     └── algorithm-catalog   registry: order, parameters, exactness, run()
```

Dependencies point inwards (Martin, *Clean Architecture*): `engine/` imports nothing from Angular, MapLibre or the
worker; the controller depends on the `TraceRenderer` interface, not on the map (dependency inversion), so the
city map and the SVG demo share it.

## 3. Decisions

| # | Decision | Reason |
| --- | --- | --- |
| R1 | Algorithms record a **trace** (typed arrays) and the page **replays** it | Separates computation from animation: the speed, pause and single step act on the replay, never on the algorithm; traces move out of the worker without copying |
| R2 | Algorithms run in a **Web Worker** (`routing-client`/`routing.worker`), with the same handler in the page as fallback | Bellman-Ford or an ant colony on São Paulo take seconds; the main thread keeps drawing and answering input. `default-src 'self'` already allows a same-origin worker |
| R3 | The map shows search states with MapLibre **feature-state** on streets and nodes (ids = edge/node index) | Each frame updates only the features that changed, instead of re-uploading GeoJSON with thousands of points |
| R4 | **Registry** of algorithms (`ALGORITHMS`, Strategy pattern, Gamma et al.) | Adding an algorithm touches one file (open/closed principle); the selector, parameters and tests iterate over the registry |
| R5 | Graph stores **out- and in-edges** (CSR) and an optional `oneway` list in the payload | Directed edges are enforced by construction; the backward half of bidirectional search and ALT's reverse distances need in-edges |
| R6 | One-way streets come from **OpenStreetMap**, matched offline to the IBGE edges; the map credits OSM (ODbL) | IBGE block faces carry no direction. The pipeline matches OSM `oneway` ways by distance and angle and repairs dead ends (its ADR 13-14); unmatched streets stay two-way, so the route may be shorter than the legal one there (notably Brasília's wide avenues, 2 % of edges matched) |
| R7 | Colours: Okabe & Ito palette; **blue only for the final route**; every state also has a shape (line, dash, ring, dot) | Colour-blind safety and WCAG 1.4.1 (use of colour); intermediate search states can never be taken for the result |
| R8 | Phones: the map and playback bar are **sticky** above the scrolling controls; landscape phones place them side by side | The map stays visible while configuring and running, without shrinking the controls below touch size |
| R9 | Clicks inside the loaded area always mark a point; cities are offered as buttons and as clickable boxes on the map | A small screen fits the city at a low zoom; the earlier zoom threshold silently ignored the first clicks |
| R10 | Cities split by roads without block faces keep **all parts with ≥ 20 km of streets**; no link is invented | Brasília (75 parts) and Florianópolis (5) would otherwise lose most of their streets; between parts the search honestly finds no route |

The graph data come from the georeferencing-street-routing-algorithms repository (its own ARCHITECTURE.md records
the tiled rasterisation, the UTM zone per city and the multi-municipality areas).

## 4. Patent guide and statistics

- **Content as data**: `guide-content.ts` holds every text in PT/EN/DE behind one interface; `guide-links.ts` holds
  the official URLs once. Legal statements cite their article of Law 9,279/1996; fees are copied from INPI's table
  in force on the checked date, which the page shows.
- **Statistics pipeline**: `scripts/patent-stats/build_patent_rankings.py` downloads INPI's annual rankings and the
  EPO's Patent Index/Technology Dashboard files, parses them, and writes `rankings.json` with the source URL of every
  year. Companies missing from a year's list are `null` with the list's cut-off, never zero; 2026 is "not
  published". Renames are merged only when documented (`ALIASES`). CNIPA is shown as unavailable, with the reason, because
  no official, verifiable ranking was found. The USPTO is left out: it publishes no company ranking for 2020-2026
  (author's decision, 2026-10-10).
- **Chart**: `stats-chart.ts` (pure geometry, tested) + `patent-stats` component. Line chart for evolution, colour
  slots that follow the company (a removed company never repaints the others), crosshair tooltip on hover and on
  keyboard focus, and the full table always visible as the text alternative.
- **Tabs**: WAI-ARIA Authoring Practices tabs pattern (arrow keys, Home, End); the existing assistant replay is
  projected into the first tab, so it is preserved unchanged.

## 5. Guided triage

Interaction design: one decision per screen (Hick's law; Nielsen's "recognition rather than recall"), icon cards
and three large answer buttons (touch targets ≥ 44 px, WCAG 2.5.5) that advance on tap, a progress bar, examples
and explanations behind toggles (progressive disclosure), and a result screen where a bar chart replaces prose and
every answer is a chip that reopens its question. Animations are transforms/opacity only and stop under
`prefers-reduced-motion`. The free-text classifier became the "Not sure" path; dataset complaints can be sent
into it.

`triage-flow.ts` is a small state machine without Angular: categories mapped to the classifier's five classes,
follow-up questions per category, the rule that hides the injury question unless a crash or fire was reported (no
presumption of harm), validation per step and an urgency rule. `triage-wizard` renders it; the classifier is
injected as a `Suggest` function by the triage section (dependency inversion). Nothing is sent or stored; no
personal data are asked (data minimisation, LGPD art. 6, III).

## 6. Tests

| Unit | What is checked |
| --- | --- |
| `engine/*.spec.ts` | Exact algorithms agree with Dijkstra; A*/ALT expand no more; BFS minimises segments; one-way edges respected by all ten algorithms; no route; origin = destination; traces; replay equivalence (one jump vs. many steps); clock |
| `oneway-demo/demo-graph.spec.ts` | One-way grid forces the expected detour |
| `patent-guide/stats-chart.spec.ts` | Nice axis maximum, scales, no line across missing years, stable colour slots |
| `triage/triage-flow.spec.ts` | Steps per path, conditional questions, validation, pruning of answers, urgency; texts with the same shape in PT/EN/DE and short labels |
| End-to-end (Playwright, headless Chrome) | Six cities load and route; pause/step/speed/restart; no-route and same-point cases; 1440×900, 390×844 and 844×390 without horizontal overflow; one-way arrows and OSM credit; guide tabs by keyboard; chart tooltip; triage: auto-advance, focus on each new screen, back, urgent notice, result bars, edit from a chip, sample to wizard, reduced motion; legacy redirect |

## References

- Bass, L.; Clements, P.; Kazman, R. *Software Architecture in Practice*. 4th ed. Addison-Wesley, 2021.
- Brown, S. *The C4 model for visualising software architecture*, c4model.com.
- Fowler, M. *Refactoring*. 2nd ed. Addison-Wesley, 2018.
- Gamma, E.; Helm, R.; Johnson, R.; Vlissides, J. *Design Patterns*. Addison-Wesley, 1994.
- ISO/IEC 25010:2023. *Systems and software Quality Requirements and Evaluation (SQuaRE): Product quality model*.
- Martin, R. C. *Clean Architecture*. Prentice Hall, 2017.
- Okabe, M.; Ito, K. *Color Universal Design (CUD): how to make figures and presentations that are friendly to
  colorblind people*, 2002 (rev. 2008).
- Starke, G.; Hruschka, P. *arc42* template, arc42.org.
- W3C. *Web Content Accessibility Guidelines (WCAG) 2.2*, 2023; *WAI-ARIA Authoring Practices Guide: Tabs pattern*.
- Goldberg, A. V.; Harrelson, C. Computing the shortest path: A* search meets graph theory. *SODA*, 2005.
- Hick, W. E. On the rate of gain of information. *Quarterly Journal of Experimental Psychology*, 4(1), 11-26, 1952.
- Nielsen, J. *10 Usability Heuristics for User Interface Design*. Nielsen Norman Group, 1994 (updated 2024).
- OpenStreetMap Foundation. *Copyright and License* (ODbL 1.0), openstreetmap.org/copyright.
