/**
 * Production (GitHub Pages). Both services stay off (null) until they exist; then run, from frontend/,
 *   node scripts/configure-services.mjs --api https://<service>.onrender.com --goatcounter <code>
 * which sets the values below AND the matching Content-Security-Policy entries (src/index.html, public/_headers).
 *
 * apiUrl: origin of the backend (comments, admin login, first-party visit statistics); null = no API call.
 * goatcounter: GoatCounter endpoint, e.g. 'https://<code>.goatcounter.com/count'; null = no GoatCounter.
 */
export const environment = {
  production: true,
  apiUrl: null as string | null,
  goatcounter: null as string | null,
};
