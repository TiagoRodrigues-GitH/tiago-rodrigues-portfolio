/**
 * Vector sprites for Trilha da Capivara (original artwork, drawn in code). Every sprite is an SVG of
 * 128 × 128 units, side view facing right, rasterised at 256 px so it stays sharp on high-density screens.
 */

export type SpriteName = 'capybara' | 'pup' | 'jaguar' | 'acai' | 'caju' | 'jabuticaba' | 'rock' | 'log';

const svg = (body: string): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 128 128">${body}</svg>`;

/** Capybara body shared by the mother and the pups (pups are lighter, rounder and have bigger eyes). */
function capybara(o: { light: string; mid: string; dark: string; eye: number; leader: boolean }): string {
  return svg(`
  <defs>
    <radialGradient id="fur" cx="45%" cy="35%" r="70%">
      <stop offset="0" stop-color="${o.light}"/><stop offset=".55" stop-color="${o.mid}"/><stop offset="1" stop-color="${o.dark}"/>
    </radialGradient>
    <linearGradient id="head" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${o.light}"/><stop offset="1" stop-color="${o.mid}"/>
    </linearGradient>
  </defs>
  <ellipse cx="62" cy="112" rx="46" ry="7" fill="#000" opacity=".28"/>
  <g fill="${o.dark}">
    <rect x="26" y="88" width="13" height="22" rx="6"/><rect x="44" y="90" width="12" height="20" rx="6"/>
    <rect x="70" y="90" width="12" height="20" rx="6"/><rect x="86" y="88" width="13" height="22" rx="6"/>
  </g>
  <path d="M14 70 C12 44 38 32 64 34 C88 36 100 50 100 70 C100 92 80 100 58 100 C34 100 16 92 14 70Z" fill="url(#fur)"/>
  <path d="M28 84 C40 94 74 96 92 84" stroke="${o.light}" stroke-width="4" fill="none" opacity=".45" stroke-linecap="round"/>
  <g stroke="${o.dark}" stroke-width="2" stroke-linecap="round" opacity=".35" fill="none">
    <path d="M34 50 q4 4 2 9"/><path d="M50 44 q4 4 2 9"/><path d="M66 46 q4 4 2 9"/><path d="M42 64 q4 4 2 9"/><path d="M60 62 q4 4 2 9"/>
  </g>
  <path d="M80 42 C88 28 108 28 118 40 C126 50 124 68 112 74 C102 78 88 76 82 68 C76 60 76 50 80 42Z" fill="url(#head)"/>
  <ellipse cx="119" cy="52" rx="5" ry="7" fill="#3b2412"/>
  <path d="M114 66 q-6 4 -12 2" stroke="#3b2412" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <ellipse cx="86" cy="32" rx="7" ry="6" fill="${o.dark}"/><ellipse cx="86" cy="33" rx="3.5" ry="3" fill="#e9a37a"/>
  <circle cx="101" cy="44" r="${o.eye}" fill="#1b120b"/>
  <circle cx="${101 + o.eye * 0.35}" cy="${44 - o.eye * 0.35}" r="${o.eye * 0.38}" fill="#fff"/>
  ${o.leader ? `
  <path d="M74 46 C78 60 80 72 76 86" stroke="#009c3b" stroke-width="9" fill="none" stroke-linecap="round"/>
  <path d="M74 46 C78 60 80 72 76 86" stroke="#ffdf00" stroke-width="3" fill="none" stroke-linecap="round"/>
  <circle cx="79" cy="66" r="5" fill="#002776" stroke="#ffdf00" stroke-width="1.5"/>` : ''}
  `);
}

const JAGUAR = svg(`
  <defs>
    <radialGradient id="jb" cx="45%" cy="30%" r="75%">
      <stop offset="0" stop-color="#ffd27a"/><stop offset=".6" stop-color="#f0a531"/><stop offset="1" stop-color="#b86b14"/>
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="55%" r="50%">
      <stop offset="0" stop-color="#ff5a2a" stop-opacity=".45"/><stop offset="1" stop-color="#ff5a2a" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <circle cx="64" cy="66" r="62" fill="url(#glow)"/>
  <ellipse cx="62" cy="112" rx="48" ry="7" fill="#000" opacity=".3"/>
  <path d="M18 64 C6 58 4 40 14 30" stroke="#d98a22" stroke-width="8" fill="none" stroke-linecap="round"/>
  <g fill="#c87a1c">
    <rect x="26" y="84" width="12" height="26" rx="6"/><rect x="42" y="86" width="11" height="24" rx="5.5"/>
    <rect x="70" y="86" width="11" height="24" rx="5.5"/><rect x="84" y="84" width="12" height="26" rx="6"/>
  </g>
  <path d="M18 66 C18 46 40 40 62 42 C84 44 96 52 96 68 C96 86 80 92 58 92 C34 92 18 86 18 66Z" fill="url(#jb)"/>
  <path d="M30 84 C44 90 72 90 88 82" stroke="#fff3d9" stroke-width="6" fill="none" opacity=".6" stroke-linecap="round"/>
  <g fill="none" stroke="#2b1a0c" stroke-width="3">
    <circle cx="34" cy="58" r="5"/><circle cx="50" cy="52" r="5.5"/><circle cx="68" cy="54" r="5"/><circle cx="82" cy="62" r="4.5"/>
    <circle cx="42" cy="72" r="5"/><circle cx="60" cy="70" r="5.5"/><circle cx="76" cy="76" r="4"/>
  </g>
  <g fill="#2b1a0c"><circle cx="34" cy="58" r="1.6"/><circle cx="50" cy="52" r="1.8"/><circle cx="60" cy="70" r="1.8"/><circle cx="12" cy="40" r="2.5"/><circle cx="8" cy="50" r="2.5"/></g>
  <circle cx="100" cy="50" r="22" fill="url(#jb)"/>
  <path d="M86 32 l-2 -10 l10 6Z M108 30 l6 -9 l2 11Z" fill="#c87a1c"/>
  <ellipse cx="112" cy="60" rx="10" ry="8" fill="#fff3d9"/>
  <path d="M117 55 l4 0 l-2 4Z" fill="#5b2b1a"/>
  <ellipse cx="104" cy="45" rx="4.5" ry="5" fill="#c8e35a"/><rect x="103" y="41" width="2" height="8" rx="1" fill="#111"/>
  <g fill="#2b1a0c"><circle cx="92" cy="40" r="2"/><circle cx="94" cy="58" r="2"/><circle cx="88" cy="50" r="1.8"/></g>
  <path d="M110 66 q4 3 8 0" stroke="#5b2b1a" stroke-width="1.8" fill="none" stroke-linecap="round"/>
`);

const ACAI = svg(`
  <defs><radialGradient id="a" cx="35%" cy="30%" r="70%"><stop offset="0" stop-color="#8e4a9c"/><stop offset=".6" stop-color="#4b1d52"/><stop offset="1" stop-color="#22091f"/></radialGradient></defs>
  <ellipse cx="64" cy="112" rx="34" ry="6" fill="#000" opacity=".25"/>
  <path d="M64 30 C62 18 70 10 82 8" stroke="#2f7d32" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M64 30 L44 52 M64 30 L64 56 M64 30 L84 52" stroke="#5d7a2e" stroke-width="3"/>
  ${[[44, 60], [64, 58], [84, 60], [34, 78], [54, 78], [74, 78], [94, 78], [44, 96], [64, 96], [84, 96]]
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="12" fill="url(#a)"/><circle cx="${x - 4}" cy="${y - 4}" r="3" fill="#fff" opacity=".55"/>`).join('')}
`);

const CAJU = svg(`
  <defs>
    <linearGradient id="c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd23f"/><stop offset=".45" stop-color="#ff8a2a"/><stop offset="1" stop-color="#d7261e"/></linearGradient>
    <linearGradient id="n" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9a68a"/><stop offset="1" stop-color="#7b6a52"/></linearGradient>
  </defs>
  <ellipse cx="64" cy="114" rx="30" ry="6" fill="#000" opacity=".25"/>
  <path d="M40 46 C40 34 88 34 88 46 C92 70 86 104 64 108 C42 104 36 70 40 46Z" fill="url(#c)"/>
  <path d="M50 52 C48 66 50 84 56 94" stroke="#fff" stroke-width="5" opacity=".35" fill="none" stroke-linecap="round"/>
  <path d="M46 40 C40 22 58 10 70 18 C80 24 78 34 68 34 C60 34 58 28 62 26" fill="url(#n)" stroke="#5f513e" stroke-width="2"/>
`);

const JABUTICABA = svg(`
  <defs><radialGradient id="j" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#6b3a74"/><stop offset=".5" stop-color="#2a0e2d"/><stop offset="1" stop-color="#0b0310"/></radialGradient></defs>
  <ellipse cx="64" cy="112" rx="34" ry="6" fill="#000" opacity=".25"/>
  <circle cx="64" cy="68" r="38" fill="url(#j)"/>
  <ellipse cx="50" cy="52" rx="11" ry="8" fill="#fff" opacity=".5" transform="rotate(-30 50 52)"/>
  <circle cx="80" cy="84" r="4" fill="#fff" opacity=".18"/>
  <path d="M58 32 l6 -8 l6 8 l-6 4Z" fill="#3f6b2a"/>
`);

const ROCK = svg(`
  <defs><radialGradient id="r" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="#c9ccd1"/><stop offset=".55" stop-color="#8a9099"/><stop offset="1" stop-color="#4c525b"/></radialGradient></defs>
  <ellipse cx="64" cy="110" rx="50" ry="8" fill="#000" opacity=".3"/>
  <path d="M14 100 C10 78 22 50 46 40 C64 32 92 38 106 56 C120 74 118 98 108 104 C84 112 40 112 14 100Z" fill="url(#r)"/>
  <path d="M40 52 C50 44 66 42 78 46" stroke="#fff" stroke-width="5" opacity=".35" fill="none" stroke-linecap="round"/>
  <path d="M60 74 l12 10 l-4 12 M84 66 l8 8" stroke="#3d424a" stroke-width="2.5" fill="none" opacity=".6" stroke-linecap="round"/>
  <path d="M18 98 C24 90 36 88 44 94 C36 100 26 102 18 98Z M92 100 C98 92 108 92 112 98 C106 104 98 104 92 100Z" fill="#4f9d3a"/>
`);

const LOG = svg(`
  <defs>
    <linearGradient id="l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a8703f"/><stop offset=".5" stop-color="#7a4a24"/><stop offset="1" stop-color="#4e2d14"/></linearGradient>
    <radialGradient id="e" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#f1c98d"/><stop offset="1" stop-color="#c0874a"/></radialGradient>
  </defs>
  <ellipse cx="64" cy="104" rx="56" ry="8" fill="#000" opacity=".3"/>
  <rect x="14" y="52" width="96" height="46" rx="10" fill="url(#l)"/>
  <g stroke="#3d2310" stroke-width="2" opacity=".55" stroke-linecap="round"><path d="M24 64 h40"/><path d="M34 76 h54"/><path d="M22 88 h30"/></g>
  <ellipse cx="108" cy="75" rx="13" ry="23" fill="url(#e)" stroke="#6b3f1c" stroke-width="3"/>
  <ellipse cx="108" cy="75" rx="7" ry="13" fill="none" stroke="#a46a33" stroke-width="2"/>
  <path d="M40 52 c2 -10 10 -14 16 -10 c-6 2 -8 6 -8 10Z" fill="#4f9d3a"/>
`);

export const SPRITE_SVG: Record<SpriteName, string> = {
  capybara: capybara({ light: '#d39a62', mid: '#9b6436', dark: '#5e3a1a', eye: 4.2, leader: true }),
  pup: capybara({ light: '#e8b98a', mid: '#b98352', dark: '#7a4f2a', eye: 5.5, leader: false }),
  jaguar: JAGUAR,
  acai: ACAI,
  caju: CAJU,
  jabuticaba: JABUTICABA,
  rock: ROCK,
  log: LOG,
};

/** Loads all sprites as images; calls onReady once every image has decoded (or failed). */
export function loadSprites(doc: Document, onReady: () => void): Partial<Record<SpriteName, HTMLImageElement>> {
  const images: Partial<Record<SpriteName, HTMLImageElement>> = {};
  const names = Object.keys(SPRITE_SVG) as SpriteName[];
  let pending = names.length;
  const done = () => {
    pending -= 1;
    if (pending === 0) onReady();
  };
  for (const name of names) {
    const img = doc.createElement('img');
    img.onload = done;
    img.onerror = () => {
      delete images[name];
      done();
    };
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(SPRITE_SVG[name])}`;
    images[name] = img;
  }
  return images;
}
