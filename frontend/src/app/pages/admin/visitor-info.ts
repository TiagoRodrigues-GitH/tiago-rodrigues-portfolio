/** Small, dependency-free helpers to turn a raw visit row into readable columns for the admin table. */

export interface Agent {
  browser: string;
  os: string;
  device: 'desktop' | 'mobile' | 'tablet' | 'bot';
}

const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|embedly|curl|wget|python-requests/i;

export function parseUserAgent(ua: string | null | undefined): Agent {
  const s = ua ?? '';
  if (!s) {
    return { browser: '—', os: '—', device: 'desktop' };
  }
  if (BOT.test(s)) {
    const name = /([A-Za-z-]*bot|[A-Za-z-]*crawler|[A-Za-z-]*spider|HeadlessChrome|Lighthouse|curl|Wget)/i.exec(s)?.[1];
    return { browser: name ?? 'Bot', os: '—', device: 'bot' };
  }
  const browser =
    match(s, /Edg(?:e|A|iOS)?\/(\d+)/, 'Edge') ??
    match(s, /OPR\/(\d+)/, 'Opera') ??
    match(s, /SamsungBrowser\/(\d+)/, 'Samsung Internet') ??
    match(s, /Firefox\/(\d+)/, 'Firefox') ??
    match(s, /FxiOS\/(\d+)/, 'Firefox') ??
    match(s, /CriOS\/(\d+)/, 'Chrome') ??
    match(s, /Chrome\/(\d+)/, 'Chrome') ??
    match(s, /Version\/(\d+).*Safari/, 'Safari') ??
    'Other';
  const os =
    /Windows NT/.test(s) ? 'Windows' :
    /iPhone|iPad|iPod/.test(s) ? 'iOS' :
    /Android/.test(s) ? 'Android' :
    /CrOS/.test(s) ? 'ChromeOS' :
    /Mac OS X|Macintosh/.test(s) ? 'macOS' :
    /Linux/.test(s) ? 'Linux' : 'Other';
  const device = /iPad|Tablet/.test(s) || (/Android/.test(s) && !/Mobile/.test(s)) ? 'tablet' : /Mobi|iPhone|Android/.test(s) ? 'mobile' : 'desktop';
  return { browser, os, device };
}

function match(s: string, re: RegExp, name: string): string | null {
  const m = re.exec(s);
  return m ? `${name} ${m[1]}` : null;
}

/** Emoji flag for an ISO 3166 alpha-2 code ("BR" -> 🇧🇷). */
export function flag(code: string | null | undefined): string {
  if (!code || !/^[A-Za-z]{2}$/.test(code)) {
    return '';
  }
  return String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}

/** Country name in the admin's language, falling back to the code. */
export function countryName(code: string | null | undefined, locale: string): string {
  if (!code) {
    return '';
  }
  try {
    return new Intl.DisplayNames([locale], { type: 'region' }).of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}

/** Rough region from the browser time zone, used when the IP database has no answer ("America/Sao_Paulo" -> "Sao Paulo"). */
export function zoneCity(tz: string | null | undefined): string {
  if (!tz || !tz.includes('/')) {
    return tz ?? '';
  }
  return tz.slice(tz.lastIndexOf('/') + 1).replace(/_/g, ' ');
}

/** Host part of a referrer URL. */
export function refHost(url: string | null | undefined): string {
  if (!url) {
    return '';
  }
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

/** CSV text (RFC 4180 quoting) for spreadsheet export. */
export function toCsv(header: string[], rows: (string | number | null | undefined)[][]): string {
  const cell = (v: string | number | null | undefined) => {
    const t = v == null ? '' : String(v);
    return /[",\n;]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
  };
  return [header, ...rows].map((r) => r.map(cell).join(',')).join('\n');
}
