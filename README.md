# MakeBusinessShine

[![CI](https://github.com/HenryQuanNZ/MakeBusinessShine/actions/workflows/ci.yml/badge.svg)](https://github.com/HenryQuanNZ/MakeBusinessShine/actions/workflows/ci.yml)

A bilingual website for a Wellington-based small-business web studio. This repository
is two things at once:

1. **The studio's public website** — five pages in English plus five in 中文,
   marketing the studio's three packages and Care Plan.
2. **A working demo of how I build sites** — the same testing rigour I sell to
   clients is wired into this repo. Push a commit, CI runs Playwright across
   every page in two viewports, and a green badge above proves it.

## Stack

| Concern | Choice |
|---|---|
| Framework | [Astro 6](https://astro.build) (static output) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) with `@theme` design tokens |
| i18n | Astro built-in i18n routing (`en` default, `zh` prefixed) |
| Forms | [Formspree](https://formspree.io) (free tier) |
| Tests | [Playwright](https://playwright.dev) — desktop + mobile (380px) |
| CI | GitHub Actions (build + E2E on every push) |
| Hosting | [Cloudflare Pages](https://pages.cloudflare.com) (free tier) |
| Fonts | Self-hosted IBM Plex Sans / Mono + Noto Sans SC via `@fontsource` |

## Structure

```
src/
├── components/   # Header, Footer, Button, PackageCard, Scorecard, WorkCard
├── i18n/         # ui.ts dictionary + getLangFromUrl / localizedPath helpers
├── layouts/      # BaseLayout (SEO meta, hreflang, OG, skip-link)
├── pages/        # / /packages /work /about /contact
│   └── zh/       # 中文 versions
└── styles/
    └── global.css  # Tailwind @theme tokens + font imports
public/
├── favicon.svg   # Brand mark
├── og.svg        # Open Graph card (1200×630)
└── robots.txt
tests/            # Playwright specs
```

## Commands

| Command | Action |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Dev server at `localhost:4321` |
| `npm run build` | Static build to `./dist/` |
| `npm run preview` | Serve the built site locally |
| `npm test` | Run Playwright E2E across desktop + 380px mobile |
| `npm run test:ui` | Open Playwright UI mode |

## What CI verifies on every push

- Every page (10 routes × 2 viewports) returns 200 and renders the right title
- `<html lang>` switches between `en-NZ` and `zh-CN` correctly
- Language toggle round-trips (`/packages` ↔ `/zh/packages`) on every page
- Each page has a canonical URL and a non-trivial meta description
- No horizontal scroll at 380px viewport on any page
- Top-nav links land on the right URL
- Contact form (EN + ZH): all fields work, submission POSTs the expected
  payload to Formspree (network stubbed in tests)
- Honeypot field is present and hidden

## Design tokens

Defined once in `src/styles/global.css` via Tailwind 4's `@theme` directive:

```
--color-ink:     #1C2127   /* near-black cool grey */
--color-paper:   #F7F8F6   /* cool off-white */
--color-pounamu: #0E6B5C   /* NZ greenstone, brand colour */
--color-pass:    #2BA84A   /* test-pass green, scorecard only */
--color-line:    #D8DCD9   /* borders & dividers */
--color-mono-bg: #EDF0EE   /* code / report-card background */
```

## Deploy

Cloudflare Pages picks this repo up automatically. Build command: `npm run build`,
output dir: `dist/`. The `site` URL in `astro.config.mjs` should match the
production domain so canonical URLs, sitemap, and OG image absolutes resolve.

## License

Code: MIT. Studio name and copy: all rights reserved.
