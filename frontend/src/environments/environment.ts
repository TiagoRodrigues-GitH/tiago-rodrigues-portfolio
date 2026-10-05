/**
 * Development. apiUrl '' = same origin: run `npm run start:proxy`, which forwards
 * /api to the Spring Boot backend on http://localhost:8080 (proxy.conf.json).
 * null = no backend: login and visit statistics are off and no API call is made.
 */
export const environment = {
  production: false,
  apiUrl: '' as string | null,
};
