// Connect the static site to its external services, keeping the code and the Content-Security-Policy in step:
//
//   node scripts/configure-services.mjs --api https://website-tiago-rodrigues-api.onrender.com --goatcounter tiagorodrigues
//
// --api          origin of the backend (comments, admin login, first-party statistics); "none" turns it off
// --goatcounter  GoatCounter site code (https://<code>.goatcounter.com); "none" turns it off
//
// Updates src/environments/environment.prod.ts, the CSP meta tag in src/index.html and public/_headers.
// Run it from frontend/, commit, push.
import { readFileSync, writeFileSync } from 'node:fs';

const ENV = 'src/environments/environment.prod.ts';
const CSP_FILES = ['src/index.html', 'public/_headers'];
const GOATCOUNTER_SCRIPT = 'https://gc.zgo.at';

function argument(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : undefined;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

const api = argument('api');
const code = argument('goatcounter');
if (api === undefined && code === undefined) {
  fail('usage: node scripts/configure-services.mjs [--api https://host|none] [--goatcounter code|none]');
}
if (api !== undefined && api !== 'none' && !/^https:\/\/[a-z0-9.-]+$/i.test(api)) {
  fail('--api must be an https origin without a path, e.g. https://website-tiago-rodrigues-api.onrender.com');
}
if (code !== undefined && code !== 'none' && !/^[a-z0-9-]+$/.test(code)) {
  fail('--goatcounter must be the site code, e.g. tiagorodrigues');
}

// 1. environment.prod.ts: replace only the values given on the command line.
let env = readFileSync(ENV, 'utf8');
const setValue = (key, value) => {
  const literal = value === null ? 'null' : `'${value}'`;
  const pattern = new RegExp(`(\\n\\s*${key}: )[^\\n]*?( as string \\| null,)`);
  if (!pattern.test(env)) fail(`${key} not found in ${ENV}`);
  env = env.replace(pattern, `$1${literal}$2`);
};
if (api !== undefined) setValue('apiUrl', api === 'none' ? null : api);
if (code !== undefined) setValue('goatcounter', code === 'none' ? null : `https://${code}.goatcounter.com/count`);
writeFileSync(ENV, env);
console.log(`updated ${ENV}`);

// 2. CSP: rebuild the managed sources of script-src, connect-src and img-src from the current environment.
const current = (key) => env.match(new RegExp(`\\n\\s*${key}: '([^']+)'`))?.[1] ?? null;
const apiOrigin = current('apiUrl');
const goatOrigin = current('goatcounter') ? new URL(current('goatcounter')).origin : null;
const managed = /\s+https:\/\/(gc\.zgo\.at|[a-z0-9-]+\.goatcounter\.com|[a-z0-9.-]+\.onrender\.com)/gi;

const extra = {
  'script-src': goatOrigin ? [GOATCOUNTER_SCRIPT] : [],
  'connect-src': [apiOrigin, goatOrigin].filter(Boolean),
  'img-src': goatOrigin ? [goatOrigin] : [],
};
// Only the policy itself is edited: the content="..." of the CSP meta tag (index.html) or the value after
// "Content-Security-Policy:" (_headers). Comments elsewhere in the file may mention directive names too.
const POLICY = /(Content-Security-Policy"?\s*(?:content="|:[ \t]*))([^"\r\n]*)/;
for (const file of CSP_FILES) {
  let text = readFileSync(file, 'utf8');
  if (!POLICY.test(text)) fail(`Content-Security-Policy not found in ${file}`);
  text = text.replace(POLICY, (_m, prefix, policy) => {
    for (const [directive, sources] of Object.entries(extra)) {
      const pattern = new RegExp(`(^|;\\s*)(${directive} )([^;]*)`);
      if (!pattern.test(policy)) fail(`${directive} not found in the policy of ${file}`);
      policy = policy.replace(pattern, (_d, sep, head, values) => {
        const base = values.replace(managed, '').trim();
        return `${sep}${head}${[base, ...sources].join(' ')}`;
      });
    }
    return `${prefix}${policy}`;
  });
  writeFileSync(file, text);
  console.log(`updated ${file}`);
}
console.log(`api: ${apiOrigin ?? 'off'} | goatcounter: ${goatOrigin ?? 'off'}`);
