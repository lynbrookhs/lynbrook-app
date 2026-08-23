# OAuth bounce page

Google's OAuth web client only accepts **https** redirect URIs, but the app needs the
OAuth callback delivered to its `lhs://` scheme. This page bridges the two: Google
redirects here with `?code=...&state=...`, and the page immediately forwards those
params to `lhs://auth`.

The app opens the login flow with `WebBrowser.openAuthSessionAsync(authUrl, "lhs://auth")`
(see `screens/welcome/WelcomeScreen.tsx`), which resolves when the browser hits the
`lhs://` URL.

## Setup (one-time)

1. Host `index.html` at a stable https URL. Simplest: a `lhs-app-auth` repo under the
   `lynbrookhs` GitHub org with GitHub Pages enabled, giving
   `https://lynbrookhs.github.io/lhs-app-auth/`.
2. In Google Cloud console (project `lynbrook-high`), open the OAuth client used by the
   backend (`SOCIAL_AUTH_GOOGLE_KEY`) and add that URL to **Authorized redirect URIs**.
   This is additive — the old `auth.expo.io` entry can stay until the legacy app is retired.
3. If the URL differs from `https://lynbrookhs.github.io/lhs-app-auth/`, update
   `AUTH_REDIRECT_PAGE` in `screens/welcome/WelcomeScreen.tsx`.
