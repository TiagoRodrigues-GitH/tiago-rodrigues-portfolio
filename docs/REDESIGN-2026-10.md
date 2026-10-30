# Visual identity and UX redesign — October 2026

Branch `feat/blue-identity`, built on `origin/main`.

## 1. Audit of the site before this redesign

### 1.1 Why the street-routing project "disappeared"

Nothing deleted it. The history had split into two lines:

| Line | Last commit | Contains |
| --- | --- | --- |
| `origin/main` (deployed on GitHub Pages) | `1802117`, 26 Oct | Monorepo (`frontend/` + `backend/`), **street routing** (`/projects/street-routing`), **lane detection (UFLD)**, contact form, visitor reviews, area tabs, photos per language |
| `feat/locale-videos` (local checkout) | `d8de604`, 29 Oct | Teal/graphite/gold palette, HD video loops per language, a first 3D hero |

`feat/locale-videos` branched from `4d67b7a`, before the routing work (`96aae3a`, `301aa93`) was merged into `main` through `781c9a2`. A build of that branch therefore never had the routing project, the lane-detection project, the contact form or the backend. This redesign starts from `origin/main`, which restores all of them with their original content and code. `feat/locale-videos` stays on GitHub unchanged.

### 1.2 The cropped video in the German projects page

* **On `feat/locale-videos`:** the last German project's final video frame grew past its grid row (a full-bleed video sized 1396 px wide inside the media column) and the footer, the "bottom navigation bar", painted over its lower part; a second video rendered at 0 px height.
* **On `origin/main`:** the same class of problem was latent. A project with a video made its media column `position: sticky`. A sticky column taller than the screen can never scroll fully into view, so the lower part of the media is cut off at the end of the section.

**Fix:** the media column is no longer sticky; every project video keeps its own aspect ratio (from its `width`/`height`) and is capped at the screen height below the header, so the whole picture and its controls are always visible. There is only one video on the site today (lane detection); the rule covers any future one.

### 1.3 Other findings

| Area | Finding | Severity |
| --- | --- | --- |
| Identity | Saturated azure header and footer, light photo hero of travel landmarks: friendly, but it did not say "intelligent systems". Three unrelated area colours (turquoise, blue, violet). | High |
| Hero | The headline "I turn ideas into software" was generic and did not connect the areas of work. | High |
| Footer | Dense bright-blue slab with a drawing "title block" table; balance and hierarchy were weak. | Medium |
| Consistency | Inner page heroes were light with photos, the home hero light, the CTA dark: no common rhythm. | Medium |
| Motion | Reveal-on-scroll only; no page transitions; no interaction that showed technical depth. | Medium |
| Internationalisation | hreflang only `pt-BR`, `en`, `de`; no regional targets for the UK, Canada, Germany and Austria; Open Graph locale `en_US`. | Medium |
| Copy | English already followed Oxford/Canadian-compatible spelling; German had no Germany-only terms. No page called the author "engineer". | Low |
| Performance | Initial bundle 603.3 kB (161.7 kB transferred), already over the 500 kB budget warning; one sticky video column. | Low |

## 2. Three visual identity proposals

### A. Neural Navy *(recommended, implemented)*

| Role | Colour |
| --- | --- |
| Night (surfaces) | `#040914` · `#070F22` · `#0B1730` |
| Electric blue (actions) | `#1D4FD8` · `#2F66F0` · `#3D7BFF` |
| Cyan signal (light, focus on dark) | `#3FE0F5` |
| Champagne gold (indices, hairlines only) | `#CDB27A` (ink `#8A6D2F`) |
| Platinum / ice | `#D5DEEA` · `#DCE6FF` · `#F4F7FD` |

* **Typography:** Space Grotesk (display), Inter (text), JetBrains Mono (labels), already self-hosted: no new font requests.
* **Gradients and backgrounds:** soft radial light (electric blue top right, cyan bottom left) over a faint 64 px drawing grid; headline accents in a white → ice blue → cyan gradient.
* **Visual elements:** point-cloud forms, gold hairlines under the header and above the footer, glass panels, registration marks on figures.
* **Why it fits:** deep learning, computer vision and embedded systems read as light in the dark (sensors, inference, signals); gold is used as a precision accent, never as a fill.

### B. Clean Room

| Role | Colour |
| --- | --- |
| Paper | `#F7F9FC` · `#FFFFFF` |
| Ink navy | `#0B1630` |
| Cobalt (actions) | `#1B4DFF` |
| Cyan (data highlights) | `#00A6C8` |
| Steel (secondary text) | `#5B6B82` |

* **Typography:** an editorial serif for display (e.g. Instrument Serif) with Inter for text.
* **Visual elements:** large white space, thin technical line drawings, no glow; photography in duotone.
* **Trade-off:** very readable and calm, but it reads as a design studio more than as intelligent systems; motion would feel bolted on.

### C. Graphite Telemetry

| Role | Colour |
| --- | --- |
| Graphite surfaces | `#0D1117` · `#161B22` |
| Steel blue (actions) | `#2B6CB0` |
| Signal cyan | `#22D3EE` |
| Amber data accent | `#F2A93B` |

* **Typography:** JetBrains Mono headlines, Inter text.
* **Visual elements:** dashboard/HUD language, live gauges, telemetry charts.
* **Trade-off:** strong engineering flavour, but heavy on mono type (weaker for long German and Portuguese texts) and amber drifts away from the blue-based brief.

### Recommendation

**Neural Navy.** It keeps the blue the brief asks for, adds the cyan and metallic accents in a disciplined way, works in both dark (heroes, footer) and light (long reading) surfaces, and is the natural stage for the cinematic hero. Clean Room would weaken the technical story; Graphite Telemetry would weaken readability and the blue identity.

## 3. What was implemented

1. **Design tokens** (`frontend/src/styles.css`): the Neural Navy scale replaces the azure scale under the same token names, so every page, the LLM lab and the routing page follow it without local overrides. All text pairs meet WCAG 2.2 AA; body text reaches AAA.
2. **Cinematic home hero** (`shared/home-hero`, `shared/neural-hero`): a WebGL2 point cloud that morphs, as the reader scrolls, from a **neural network** into **automotive computer vision** (vehicle, lane markings, detection box), an **embedded circuit** (processor, pins, traces) and a **software architecture** (three layers and their data flows). The camera follows the pointer. A four-stage timeline names each form and links it to real work on the site (LoRA LLMs, UFLD lane detection, embedded perception, Java/Spring/Angular).
3. **Header and footer:** navy glass header with a gold hairline; footer rebuilt as one balanced row (brand + tagline + contact action · navigation · channels) and one quiet meta row.
4. **Background films** (`shared/cinema`, `content/cinema.ts`): one realistic film per page, chosen for its theme, fixed behind the whole page (section 3.1). Page heroes, the home call to action and the footer are windows onto it. The rotating photo backdrops are gone.
5. **Projects page:** identity colours, gold-to-blue project numbers, video fix (section 1.2).
6. **Motion:** page transitions with the View Transitions API (the header stays put), 3D tilt with a light reflection on project and area cards, scroll reveal that composes with the tilt.
7. **Internationalisation:** hreflang `pt-BR`, `en`, `en-GB`, `en-CA`, `de`, `de-DE`, `de-AT` in the page head and the sitemap; Open Graph `en_GB` / `de_DE` with regional alternates. Copy reviewed for UK/Canadian English (Oxford spelling: -our, -re, -ize) and German valid in Germany and Austria.

### 3.1 Background films (revision of 30 Oct)

A first pass rejected a background video on cost grounds. Review feedback reversed that: the site should show realistic footage, and the old hero photos changed under the reader (they rotated every 7 s and differed from one hero to the next). The fix is **one film per page that never changes while scrolling**:

* **One fixed layer** (`app-cinema`, in the shell) plays behind everything. Reading blocks get a white surface from one zero-specificity rule in `styles.css` (`:where(main > * > …)`); `.shell` blocks extend it full-bleed. Heroes (`.has-backdrop`), the home hero, the home call to action and the footer stay transparent and add their own navy veil for text contrast. Scrolling past a white section and into the next window shows the same shot, still playing.
* **Interaction:** the film drifts against the pointer (depth), a soft cyan light follows the cursor and lifts the veil around it, and the shot pushes in slowly as the page is read. A new page cross-fades to its film in 1.2 s. On the home page the WebGL neural scene plays over the circuit-implant portrait.
* **Clips** (Mixkit, credited in the footer), cut into seamless 9 s loops (the last second cross-fades into the first) and graded towards navy by `frontend/scripts/encode-cinema.sh`:

| Page | Clip | Desktop / phone |
| --- | --- | --- |
| Home | Woman with circuit implants on her face (1080p) | 2.6 MB / 0.6 MB |
| Projects, Automotive tab | Inside a car in night traffic (1080p) | 3.6 MB / 0.9 MB |
| AI tab | Circuit board with processor | 0.9 MB / 0.4 MB |
| Security tab | Server lights | 0.5 MB / 0.2 MB |
| Defect triage | Instrument cluster accelerating (1080p) | 0.5 MB / 0.1 MB |
| Patent assistant | Man browsing holographic screens | 1.6 MB / 0.7 MB |
| Street routing | Aerial city traffic at night (1080p) | 1.2 MB / 0.4 MB |
| About | A programmer's hands on a backlit keyboard (1080p) | 1.0 MB / 0.3 MB |
| Contact | Frankfurt lit at night, from the air | 1.8 MB / 0.6 MB |
| Privacy, login, admin | Blue data-centre hallway | 2.0 MB / 0.8 MB |

* **Cost and accessibility:** only the current page's film loads, after hydration (the prerendered HTML has no video, so it does not compete for LCP); 960 px files below 900 px width; a 20–90 kB WebP poster shows first. With `prefers-reduced-motion` or Save-Data only the poster shows. A pause button (WCAG 2.2.2), remembered across visits, appears whenever a window onto the film is on screen and hides over reading text. Playback stops while the tab is hidden. The film is decorative (`aria-hidden`).
* **Cleanup:** the 52 hero photos (landmarks, Londrina, coffee) and their credits were removed; they remain in git history (`1ab8a80`, `b9cda63`). The three photos in the home area doors stay. The phone veil of the heroes was still the light one from the old identity, under white text; it is now navy (contrast fix). The area eyebrow in the projects hero used the white-surface ink tone on navy (about 2.6:1); it now uses the glow tone.
* **Wording:** every job title on the site already reads *desenvolvedor de software / software developer / Softwareentwickler*. "Software Engineering / Engenharia de Software / Softwaretechnik" remains only as the name of a master's course actually taken, and in one journal title.

### 3.2 Dark glass, section films and software-first copy (second revision, 30 Oct)

Review of 3.1 on the live site: the white reading sections hid the film for most of each page, the home copy was too focused on the automotive industry, and the fast in-car clip behind the projects did not fit. This revision supersedes 3.1 where they differ.

* **No white sections.** Every public page is navy glass over its film, from the hero to the footer: `main` redefines the semantic tokens (`--surface`, `--text`, `--accent`, `--rule`…) for dark, reading sections take a 64 % navy veil (`--section-veil`), cards a deeper glass, and highlights, status colours and error boxes have dark-safe tokens (`--tint`, `--ok`, `--bad`, `--warn`, `--bad-bg`). Admin and login stay light. The project covers for defect triage and street routing were redrawn in navy.
* **Films per section.** A section can bring its own film with `data-film="<clip>"`; it cross-fades in (1.6 s) when the section reaches the middle of the screen, and sections close by preload. At most six films stay loaded.

| Page | Films, top to bottom |
| --- | --- |
| Home | Neon portrait of a woman with curly hair and glitter make-up (Mikhail Nilov, Pexels 6831846) on the whole page; a Pantanal jaguar behind the closing call to action. The earlier circuit-implant portrait (Mixkit 50443) is archived in `frontend/design/films/portrait-circuits/` |
| Projects (all tabs) | One film for the whole page: a woman in a futuristic visor |
| Defect triage | Instrument cluster · engineer soldering a microcircuit · data centre · fibre optics in a rack |
| Patent assistant | Holographic screens · circuit board with processor · data centre · glowing optic fibre |
| Street routing | Aerial city traffic (hero and map) · Frankfurt at night · trains at night · fibre optics · Earth from space |
| About | Programmer's hands · Earth from space |
| Contact | Meeting in a modern room · silhouettes at a window |
| Privacy, login, admin | Data-centre hallway · server lights |

* **New clips:** fibre optics (two), Earth at night, futuristic visor, engineer with a microcircuit, trains at night, meeting room, silhouettes at a window (Mixkit), and the jaguar: *Pantanal Jaguar (Panthera onca)* by Gregory "Slobirdr" Smith, Wikimedia Commons, CC BY-SA 2.0. The cut and graded loop is shared under the same licence and credited in the footer. The in-car clip was removed.
* **Phones and tablets:** a full-height crop of the 16:9 portrait is a thin strip that often missed the face. Below 1025 px the home film is a wide band across the top of the screen (190 vw, 235 vw on phones) that always holds the face and fades into navy. The hero veil is lighter there, and the intro uses the main on-dark tone with a text shadow, so it stays AA on the brightest frame.
* **Pause button:** always visible now, since the film shows on the whole page (WCAG 2.2.2).
* **Copy:** the home is software-first and general. Headline *Código limpo. Software inteligente.* / *Clean code. Intelligent software.* / *Sauberer Code. Intelligente Software.*; the eyebrow, intro, spec sheet focus (*Software development*), call to action, footer tagline, projects and about intros, and the SEO titles and descriptions follow. The *Developer.java* card replaces the ADAS car drawing in the spec sheet. Projects are numbered by position (01–06) and shown as glass case-study panels with a top line in their area's colour. The home count was wrong (three in progress); it is four.

### 3.3 Lighthouse on the live site (30 Oct, before the fixes below)

| Page | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Home, mobile | 60 | 100 | 100 | 100 | 3.7 s | 910 ms | 0 |
| Home, desktop | 86 | 100 | 100 | 100 | 0.6 s | 320 ms | 0 |
| Projects, mobile | 63 | 100 | 100 | 100 | 3.5 s | 1,200 ms | 0 |
| Projects, desktop | 97 | 100 | 100 | 100 | 0.7 s | 100 ms | 0 |

Mobile performance is held back by total blocking time: three 360–430 ms tasks in the main chunk during hydration, while the film and the WebGL scene start. Fixes applied: the film starts only once the browser is idle after hydration (`requestIdleCallback`, at most 1.5 s); the area-door photos get 640 px `srcset` copies (about 400 kB less on phones); the comments API origin is preconnected (about 300 ms). Not yet done: long cache headers (GitHub Pages sets 10 minutes) and splitting the main chunk.

After the fixes (`6a8ca53`): projects on mobile 73 (TBT 610 ms, 824 kB instead of 1,486 kB); home on desktop 90 (TBT 230 ms); home on mobile 53–61 over three runs, with TBT between 920 and 3,560 ms. The spread comes from CPU contention on the test machine, so treat single mobile runs with care. The area-door photos now load as 960 px copies (215 kB instead of 521 kB). The remaining mobile cost is main-thread work during hydration (the main chunk is 336 kB, with all articles and project texts in three languages), which is the next step (section 4).

### Accessibility and performance of the motion

* `prefers-reduced-motion`: no sticky scroll track, no animation; the stage buttons switch forms instantly.
* A visible **Pause animation** button (WCAG 2.2.2); the scene also stops when it is off screen or the tab is hidden.
* The scene is decorative (`aria-hidden`); its meaning is in the stage list, which is a real list of buttons with `aria-current="step"`.
* Without WebGL2 the canvas is removed and the page works as before.
* Pixel ratio capped at 1.75; 5,200 points on desktop and 2,600 on phones; one draw call.

## 4. Prioritised plan for the next steps

| Priority | Task | Why |
| --- | --- | --- |
| P1 | Lighthouse again after the 3.3 fixes; then split the main chunk (lazy-load the LLM-lab data and the article content) to cut mobile TBT | Mobile performance score 60–63 |
| P1 | Real-device check of the hero and films on a mid-range Android phone and an iPhone (low-power mode shows posters only) | GPU drivers and autoplay rules differ |
| P2 | Optional: replace stock films with custom AI-generated ones (section 5) | Unique footage nobody else uses |
| P2 | Check the Mixkit licence of each clip (some are listed as *Restricted*) | Licensing |
| P3 | Delete `feat/locale-videos`: its clips were reviewed, and their 1080p originals are now in use where they fit | Avoid a second divergent line |
| P3 | Structured data (`Person`, `CreativeWork` per project) in the three languages | Search snippets |

## 5. Custom films with an AI video generator (optional)

Stock clips are also used by other sites. A generator such as Kling can make footage unique to this portfolio. The prompts below follow Kling's guidance on realistic prompts: subject and action first, then the scene in layers (background, middle ground, foreground), one lighting mood, physical detail, 50–100 words. They add the constraints of a background film: **slow, steady camera; nothing that cuts or flashes; dark, quiet space on the left third for the headline; no text, logos or brand marks; 16:9, 1080p, 10 s**. Generated people are fictional; nothing should suggest they are the author.

**Home (`home`)**: *A young woman with small, real electronic components (copper traces, a tiny chip) bonded along her cheekbone slowly turns her head towards the camera and blinks. Background: deep navy darkness with faint out-of-focus cyan points like a neural network. Middle ground: soft volumetric haze. Foreground: her face on the right third, sharp, skin pores and fine hair visible. Cool cyan rim light from the right, gentle navy fill. Slow push-in, shallow depth of field, photorealistic, 35 mm film grain. Left third stays dark and empty.*

**Projects and Automotive (`drive`)**: *A car drives steadily through a city at night, seen from the driver's seat. Background: blurred streetlights and traffic signals. Middle ground: wet asphalt reflecting red tail lights and blue signs, lane markings sliding towards the camera. Foreground: a dark, unbranded dashboard and the lower edge of the windscreen with a few raindrops. Cool blue ambient light, soft bokeh. Stable camera, no shaking, photorealistic, no logos or readable text.*

**Defect triage (`cluster`)**: *A car's instrument cluster comes alive in the dark: needles sweep up smoothly as the engine revs. Background: black cabin. Middle ground: two round gauges with white numerals and thin cyan rings. Foreground: soft reflections on the gauge glass. One amber warning light glows briefly, then fades. Low-key light, macro lens, very slow lateral slide, photorealistic, no brand names.*

**Street routing (`traffic`)**: *A top-down drone shot slowly drifts over a city's road network at night. Background: dark city blocks. Middle ground: wide avenues and a large interchange, streams of white headlights and red tail lights tracing the routes. Foreground: nothing; the view stays straight down. Cool sodium and LED street light, high contrast, long-exposure light trails, photorealistic aerial footage.*

**About (`developer`)**: *A software developer's hands type steadily on a backlit mechanical keyboard. Background: a dark room with a monitor of softly blurred code in blue and cyan. Middle ground: the keyboard, keys lit from below in cool blue. Foreground: hands in sharp focus, natural skin texture, slight motion of the fingers. Single cool monitor light, shallow depth of field, slow push-in, photorealistic, no logos.*

**Contact (`city`)**: *A drone glides slowly over a European city centre at night. Background: the horizon fading into deep navy sky. Middle ground: illuminated streets in warm amber and a river crossed by bridges. Foreground: rooftops passing gently under the camera. Calm, steady movement, clear night air, photorealistic aerial footage, no identifiable signs or logos.*

**To swap a clip:** download the 1080p render, then from `frontend/` run `bash scripts/encode-cinema.sh <render.mp4> <clip> [start s] [length s]`, for example `bash scripts/encode-cinema.sh ~/Downloads/home.mp4 home 0 10`. It rewrites `<clip>.mp4`, `<clip>-sm.mp4` and `<clip>.webp`. Then update the title and link in `CINEMA_SOURCES` (`content/cinema.ts`), which feeds the footer credits.
