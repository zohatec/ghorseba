# GhorSheba (ঘরসেবা) — Home Services Platform (Portfolio Project)

A bilingual (English / বাংলা) concept website for a Bangladeshi home-services
booking platform, built as a **front-end portfolio piece** — no backend,
no build tools, just HTML, CSS and vanilla JavaScript in separate files.

Live demo idea: a customer can browse 11 home services (AC servicing,
electrician, plumber, cleaning, pest control, interior design, painting,
CCTV installation, solar installation, moving service, appliance repair),
get an instant price estimate, and submit a booking request — all backed
by real, fetched data and free client-side storage.

## ✨ Features

- **Bilingual UI** (English default, বাংলা toggle) — every string swaps
  instantly via `js/i18n.js`, with the choice remembered in `localStorage`.
- **Real data fetching** — the service catalogue lives in
  `data/services.json` and is loaded with `fetch()` (see `js/data-service.js`),
  not hard-coded into the HTML.
- **Free, serverless data storage** — booking submissions are saved to the
  browser's `localStorage`, so the "Your recent bookings" panel persists
  across page reloads with no backend, database or account needed.
- **Live price estimator** — multiplies a service's starting price by a
  quantity, reading straight from the fetched catalogue.
- **Bangladesh-specific content** — BDT pricing, a Dhanmondi (Dhaka) office
  address, an embedded Google Map, city coverage list and bKash/Nagad/Rocket
  payment mentions.
- **Restrained, orchestrated motion** — one hero entrance sequence, a single
  scroll-reveal utility, and interaction-triggered animation only
  (accordion, carousel, toast) — everything respects `prefers-reduced-motion`.
- Fully responsive, keyboard-accessible (visible focus states, `aria-*`
  attributes on the accordion/carousel/nav), and clean semantic HTML.

## 📁 File structure

```
ghorsheba/
├── index.html            All markup + data-i18n hooks
├── css/
│   ├── style.css         Design tokens, layout, components
│   └── animations.css    Keyframes & motion (reveal, hero entrance, toast…)
├── js/
│   ├── i18n.js           EN/BN dictionary + language switching
│   ├── data-service.js   fetch() for services.json + localStorage CRUD
│   └── main.js           Rendering + all interactivity
├── data/
│   └── services.json     The 11-service catalogue (name/desc/price, EN+BN)
└── README.md
```

## ▶️ Running it

Because the service catalogue is loaded with `fetch()`, some browsers block
that request with a CORS error if you simply double-click `index.html` and
open it as a `file://` path. Two easy ways around that:

1. **Local server (recommended):**
   ```bash
   # from inside the ghorsheba/ folder
   npx serve .
   # or
   python3 -m http.server 8000
   ```
   then open `http://localhost:8000` (or whatever port it prints).

2. **Just open the file directly** — the site still works! `js/data-service.js`
   catches the fetch failure and falls back to an identical, embedded copy
   of the catalogue, so nothing breaks — you'll just see a note about it in
   the browser console.

Deploying to **GitHub Pages, Netlify or Vercel** avoids this entirely, since
`fetch()` works normally over `http(s)://`.

## 🖼️ Images

Photos are hotlinked from [Pexels](https://www.pexels.com) (free-to-use
stock photography) and avatars from [randomuser.me](https://randomuser.me)
(a public placeholder-avatar API). No image files are stored in this repo.

## 🔧 Swapping the demo storage for a real backend

Everything the UI needs from data lives behind two small modules:

- `GSData.fetchServices()` — replace the `fetch('data/services.json')`
  call with a request to your real API/CMS.
- `GSData.saveBooking() / getBookings() / deleteBooking() / clearBookings()`
  — replace the `localStorage` calls with requests to Firebase, Supabase,
  a Google Sheet via Apps Script, or your own REST endpoint.

Because `main.js` only ever talks to the `GSData` object (never to
`localStorage` directly), this swap doesn't require touching any rendering
or event-handling code.

## ⚠️ Disclaimer

This is a **demonstration project** built to showcase front-end skills for
a job application. Prices, the office address, phone numbers and testimonials
are illustrative placeholders, not a registered business.

## 🧱 Tech stack

HTML5 · CSS3 (custom properties, CSS Grid/Flexbox, `clip-path`) ·
vanilla JavaScript (ES6+, `fetch`, `IntersectionObserver`, `localStorage`) ·
[Font Awesome 6](https://fontawesome.com) for icons ·
Google Fonts (Space Grotesk, Inter, Baloo Da 2, Hind Siliguri) ·
embedded Google Maps.
