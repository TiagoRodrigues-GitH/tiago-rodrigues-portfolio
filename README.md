# Tiago Rodrigues — Automotive Software Portfolio

Personal portfolio of **Tiago Rodrigues**, a software developer focused on Java, artificial intelligence and software for the automotive industry — in particular Advanced Driver Assistance Systems (ADAS) and perception for embedded platforms.

The site is available in **Portuguese, English and German**, follows **WCAG 2.2 level AA**, and was designed against **Nielsen's 10 usability heuristics**, **Shneiderman's Eight Golden Rules** and the usability definition of **ISO 9241-11**.

**Live site:** https://tiagorodrigues-gith.github.io/tiago-rodrigues-portfolio/

---

## Contents

1. [Highlights](#highlights)
2. [Pages](#pages)
3. [Design system](#design-system)
4. [Accessibility and usability](#accessibility-and-usability)
5. [Architecture](#architecture)
6. [Editing content](#editing-content)
7. [Getting started](#getting-started)
8. [Deployment](#deployment)
9. [Image credits](#image-credits)

---

## Highlights

- **Blueprint visual language.** A custom navy-to-ice blue scale, drawing grids, registration marks and "Fig." captions, inspired by engineering drawings. All illustrations are brand-neutral: public-domain technical drawings and two original SVG diagrams (an ADAS sensor layout and a lane-detection row-anchor diagram).
- **Technical article series.** *From perception to the road* is a three-chapter story on ADAS: what the systems are, how Brazilian regulation (MOVER programme, ISO 26262, ISO 21448/SOTIF, UN R79, TRL) shapes them, and why embedded lane detection must be fast as well as accurate. Every claim is referenced, with DOI links where available.
- **Trilingual by design.** Portuguese (pt-BR), English and German, with the page `lang` attribute, document title and all alternative texts localized. On a first visit the site follows the browser language.
- **Accessible by default.** Keyboard-complete navigation, skip link, visible focus, an accessible image dialog, live-region feedback, reduced-motion support and AA contrast on every text colour pair.

## Pages

| Route | Content |
| --- | --- |
| `/` | Hero with ADAS sensor blueprint, spec sheet, selected projects, article series and call to action |
| `/projects` | Project case studies with an accessible image viewer |
| `/about` | Timeline, education, languages, time in Germany, technical skills and CV download |
| `/contact` | E-mail (with copy-to-clipboard), LinkedIn and GitHub |
| `/login`, `/admin` | Authenticated project administration (requires the backend API) |

The language is selected with the `?lang=pt|en|de` query parameter, which every internal link preserves.

### Projects

| # | Project | Status |
| --- | --- | --- |
| 01 | **Vehicle management system** — Java Swing desktop application applying object-oriented design (abstract classes, inheritance, polymorphism, interfaces, exception handling) | Completed |
| 02 | **Compact LLM for the automotive industry** — a small language model fine-tuned on automotive standards, requirements and technical documentation, able to run locally | Coming soon |
| 03 | **Web app for car collectors** — catalogue, restoration history and documentation for classic-vehicle collections | Coming soon |

## Design system

Global tokens live in [`src/styles.css`](src/styles.css).

| Token | Hex | Typical use | Contrast |
| --- | --- | --- | --- |
| `--blue-950` | `#061634` | Blueprint surfaces, header, footer | — |
| `--blue-700` | `#14439a` | Strong accent, hover | 9.1 : 1 with white |
| `--blue-600` | `#1a55c2` | Primary actions, links | 6.7 : 1 on white |
| `--blue-300` | `#8fb8ff` | Accents on dark | 8.9 : 1 on `--blue-950` |
| `--blue-150` | `#d6e6ff` | Line drawings, primary button on dark | — |
| `--blue-50` | `#f3f8ff` | Graph-paper surfaces | — |
| `--signal` | `#6fd6ff` | Sensor fields of view, focus ring on dark | 10.9 : 1 on `--blue-950` |
| `--text` / `--text-muted` | `#0a1a36` / `#3b4d6b` | Body copy | 17.3 : 1 / 8.5 : 1 on white |

Typography: **Space Grotesk** (display), **Inter** (text) and **JetBrains Mono** (technical labels).

## Accessibility and usability

### WCAG 2.2 (level AA)

| Success criterion | Implementation |
| --- | --- |
| 1.1.1 Non-text content | Localized `alt` text for informative images; decorative images use `alt=""`; SVG diagrams expose `role="img"` with a title and description |
| 1.3.1 Info and relationships | Landmarks (`header`, `nav`, `main`, `footer`), one `h1` per page, ordered headings, `dl`/`ol`/`table` semantics |
| 1.4.3 / 1.4.11 Contrast | Text ≥ 6.3 : 1 across the palette; input borders and focus rings ≥ 3 : 1 |
| 1.4.4 / 1.4.10 Resize and reflow | Fluid type with `clamp()`, layouts reflow down to 320 px without horizontal scrolling |
| 2.1.1 Keyboard | Every control is a native link or button; the image viewer supports <kbd>Esc</kbd>, <kbd>←</kbd> and <kbd>→</kbd> |
| 2.2.2 Pause, stop, hide | The only animation (the hero drawing) runs once and finishes in under three seconds |
| 2.3.3 Animation from interactions | `prefers-reduced-motion` disables all motion |
| 2.4.1 Bypass blocks | "Skip to content" link |
| 2.4.2 Page titled | Localized title for every route |
| 2.4.3 Focus order | Focus moves to the new page after navigation; the image dialog traps focus and restores it on close |
| 2.4.4 Link purpose | Repeated links ("View details") carry the project name for screen readers; new-tab links are announced |
| 2.4.7 Focus visible | 3 px focus ring, re-coloured on dark surfaces |
| 2.5.3 Label in name | Language buttons are named "PT Português", "EN English", "DE Deutsch" |
| 2.5.8 Target size | Interactive targets are at least 24 × 24 px (most are 44 px) |
| 3.1.1 / 3.1.2 Language | `<html lang>` follows the selected language; language names carry their own `lang` |
| 3.3.1 / 4.1.3 Errors and status | Form errors use `role="alert"`; copy and save confirmations use `role="status"` |
| 4.1.2 Name, role, value | Menu button exposes `aria-expanded`/`aria-controls`; language buttons expose `aria-pressed`; the viewer is a modal `dialog` |

### Nielsen's 10 usability heuristics

1. **Visibility of system status** — active page and language are always highlighted; project status badges; loading and confirmation messages.
2. **Match with the real world** — language codes (PT/EN/DE) instead of country flags; engineering-drawing metaphors familiar to the automotive domain.
3. **User control and freedom** — the image viewer closes with <kbd>Esc</kbd>, a click outside or the Close button; articles collapse again; switching language keeps the reading position.
4. **Consistency and standards** — one token set, one button system and sentence case in all three languages; the logo always leads home.
5. **Error prevention** — deleting a project requires confirmation; required fields are marked before submission.
6. **Recognition rather than recall** — persistent navigation, numbered sections (01, 02, 03) and a parts list that decodes the diagram callouts.
7. **Flexibility and efficiency** — skip link, keyboard shortcuts in the viewer, copy-to-clipboard for the e-mail address, automatic language detection.
8. **Aesthetic and minimalist design** — long articles use progressive disclosure; redundant links were removed.
9. **Help users recover from errors** — plain-language, localized error messages next to the form.
10. **Help and documentation** — reading time on every chapter, figure captions and full references.

### Shneiderman's Eight Golden Rules

| Rule | Implementation |
| --- | --- |
| Strive for consistency | Shared tokens, components and terminology across pages and languages |
| Seek universal usability | WCAG 2.2 AA, three languages, reduced motion, responsive layouts |
| Offer informative feedback | Hover and focus states, `aria-pressed`, status messages |
| Design dialogs to yield closure | Clear open/close cycle for chapters and the image viewer; success messages after saving |
| Prevent errors | Confirmation before deletion, validation before submission |
| Permit easy reversal of actions | Cancel editing, collapse chapters, close dialogs, switch languages back |
| Keep users in control | No autoplay or carousels; scrolling and reading pace are left to the reader |
| Reduce short-term memory load | Persistent navigation, visible labels, numbered chapters and figures |

### ISO 9241-11

Usability is treated as the extent to which the intended users — recruiters, engineers and hiring managers — can reach their goals with **effectiveness**, **efficiency** and **satisfaction** in a specified context of use:

- **Effectiveness:** every page answers one question (Who is he? What has he built? What does he know about ADAS? How do I reach him?), and the CV and contact channels are one click from any page.
- **Efficiency:** the spec sheet summarises the profile in seconds; chapters show a lede and reading time before the full text is expanded.
- **Satisfaction:** a distinctive but restrained blueprint aesthetic that suits the automotive engineering context.

## Architecture

Angular 21 application (NgModule-based, **zoneless change detection** with signals, SSR-ready).

```text
src/
├── app/
│   ├── app.component.*          Shell: skip link, header, language switcher, footer
│   ├── app-routing.module.ts    Routes and legacy redirects
│   ├── content/
│   │   ├── articles.ts          Article series (PT/EN/DE) and references
│   │   └── credits.ts           Image sources and licences
│   ├── pages/                   home, projects, about, contact, login, admin
│   ├── services/
│   │   ├── i18n.service.ts      Interface texts in three languages
│   │   ├── locale.ts            `injectLocale()` — ?lang= as a signal
│   │   ├── auth.service.ts      JWT authentication for the admin area
│   │   └── project.service.ts   REST client for the admin area
│   ├── shared/
│   │   ├── adas-figure/         SVG: ADAS sensor layout (hero)
│   │   ├── lane-diagram/        SVG: lane detection by row anchors
│   │   └── portfolio-projects.ts  Localized project data
│   └── guards/auth.guard.ts
├── assets/images/blueprints/    Processed public-domain illustrations (WebP)
└── styles.css                   Design tokens and shared components
```

Because the application runs without zone.js, any state that changes asynchronously (HTTP responses, timers, route parameters) is held in signals so the view updates reliably.

## Editing content

| What | Where |
| --- | --- |
| Interface texts, spec sheet, about page | `src/app/services/i18n.service.ts` |
| Article chapters and references | `src/app/content/articles.ts` |
| Projects (text, stack, images, status) | `src/app/shared/portfolio-projects.ts` |
| CV | Source `cv/curriculo.html`, printed to `public/curriculo.pdf` (command in the file header) |

Each entry exists in all three languages. A unit test checks that the languages stay in sync and that the content contains no vehicle-manufacturer names.

## Getting started

Requirements: Node.js 20 or later and npm.

```bash
npm install
npm start          # http://localhost:4200
npm test           # unit tests (Vitest)
npm run build      # production build in dist/tiago-rodrigues-portfolio
```

The admin area calls a REST API under `/api`. For local development with the backend running on port 8080:

```bash
npm run start:proxy
```

## Deployment

Every push to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml): install, unit tests, production build, and publication to GitHub Pages. The base href is derived from the repository name, and `404.html` mirrors `index.html` so that deep links such as `/about` also work after a page reload.

## Image credits

All illustrations come from Wikimedia Commons and were converted to the site's blueprint duotone.

| Image | Author / source | Licence |
| --- | --- | --- |
| [Streamlined Car Carries Engine at Rear (1931)](https://commons.wikimedia.org/wiki/File:Streamlined_Car.png) | Everyday Science and Mechanics | Public domain |
| [Chassis](https://commons.wikimedia.org/wiki/File:Chassis_(PSF).jpg) | Pearson Scott Foresman | Public domain |
| [US Patent 652,851 — Automobile Vehicle (1900)](https://commons.wikimedia.org/wiki/File:Patent_Drawing_for_H._W._Libbey%27s_Automobile_Vehicle_-_NARA_-_7369158.jpg) | H. W. Libbey · U.S. National Archives | Public domain |
| [US Patent 2,269,452 — Fig. 1](https://commons.wikimedia.org/wiki/File:Fig_1_patent_2,269,452.jpg) | U.S. Patent Office | Public domain |
| [Green circuit board II](https://commons.wikimedia.org/wiki/File:Green_circuit_board_II_(2389301870).jpg) | Peter Shanks | CC BY 2.0 |

The ADAS sensor layout and the lane-detection diagram are original SVG illustrations of a generic vehicle.

---

© 2026 Tiago Rodrigues. All rights reserved.
