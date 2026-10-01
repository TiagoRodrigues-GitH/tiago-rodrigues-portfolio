/**
 * Production (GitHub Pages). apiUrl stays null until the backend is deployed:
 * login and visit statistics are off and the site makes no API call.
 * After deploying portfolio-backend, set its origin here (for example
 * 'https://portfolio-backend-xxxx.onrender.com') AND add the same origin to
 * connect-src in the Content-Security-Policy meta tag of src/index.html.
 */
export const environment = {
  production: true,
  apiUrl: null as string | null,
};
