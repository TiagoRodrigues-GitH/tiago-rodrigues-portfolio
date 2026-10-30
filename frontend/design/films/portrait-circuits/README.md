# Archived home film: woman with circuits on her face

Home page background from 26 to 30 October 2026, replaced by the neon portrait (`home`, Pexels 6831846). Kept here, outside `src/assets`, so it is not published but can come back.

* Source: [Close up on young woman with circuits on her face](https://mixkit.co/free-stock-video/close-up-on-young-woman-with-circuits-on-her-face-50443/), Mixkit, Mixkit License.
* Files: seamless 9 s loop graded to the navy identity, as made by `scripts/encode-cinema.sh` (start 0.5 s, length 10 s): 1920 px (`portrait-circuits.mp4`), 960 px (`portrait-circuits-sm.mp4`) and the poster (`portrait-circuits.webp`).

To use it again, copy the three files to `src/assets/videos/cinema/` under a clip name (for example `circuits-portrait.mp4`, `circuits-portrait-sm.mp4`, `circuits-portrait.webp`), add that name to `CinemaClip` and `CINEMA_SOURCES` in `src/app/content/cinema.ts`, and point a page or a section (`data-film`) at it. Its face sits in the centre of the frame: on the home page it was shifted right on desktop (`width: 124%` in `shared/cinema/cinema.component.css`).
