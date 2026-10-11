/**
 * Development. apiUrl '' = same origin: run `npm run start:proxy`, which forwards
 * /api to the Spring Boot backend on http://localhost:8080 (proxy.conf.json).
 * null = no backend: login, comments and visit statistics are off and no API call is made.
 * goatcounter stays null in development so local browsing is never counted.
 */
export const environment = {
  production: false,
  apiUrl: '' as string | null,
  goatcounter: null as string | null,
};
