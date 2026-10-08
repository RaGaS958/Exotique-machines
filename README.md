# Exotique Machines

Website for Exotique Machines, a showroom for new and pre-owned exotic and luxury cars in Gomti Nagar, Lucknow, with its own forged-wheel Atelier.

## Run it

Requires Node.js 18 or newer.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # type-checks, then builds to dist/
npm run preview
```

Deploys to Vercel as-is (`vercel.json` is included). Routing uses the URL hash (`/#/car/ferrari-roma`), so it also works on any static host.

## Pages

| Route | What it is |
| --- | --- |
| `#/` | Hero with the four featured cars, showroom rail, body-style menu, Atelier reveal, ownership, visit |
| `#/collection` | All cars, filterable by body style, marque, powertrain and condition (`?body=SUV`, `?marque=Ferrari`) |
| `#/car/:id` | Gallery, performance, the car's own details, equipment, finance estimate, viewing and enquiry |
| `#/atelier` | Forged wheels: the range, how a set is made, and a quotation request |
| `#/finance` | EMI calculator (`?car=:id` pre-fills the price), application form, questions |
| `#/trade-in` | Indicative valuation and inspection booking |
| `#/service` | Service programmes and booking |
| `#/viewing` | Three-step viewing and test-drive booking (`?car=:id` skips step one) |
| `#/visit` | Address, hours and contact |

Saved cars and bookings are kept in the browser (`localStorage`) and shown in the Saved panel (heart icon).

## Where to change things

- **Cars**: `src/data/cars.ts`. Each car has its specs, a short sales note, equipment and four Unsplash photo ids. `HERO_SLIDES` picks the cars that open the home page. Prices are in rupees and are indicative placeholders; check them before going live.
- **Showroom details, wheels, services, finance questions**: `src/data/site.ts`.
- **Colours, type and spacing**: `src/index.css` (the `@theme` block and the `.t-*` type classes).
- **Logo**: `src/components/Brand.tsx` draws the badge: the horse from the original logo (traced to a vector in `emblemPath.ts`) inside a silver half-ring that breaks where the horse crosses it. `public/favicon.svg` uses the same mark. The name itself is `BRAND` in `src/data/site.ts`.

## Design notes

- Type: Archivo at its widest setting for headings and model names, Newsreader for reading text. Both from Google Fonts.
- Colour: near-black stage, bone-white type, and a single brass accent, taken from the gold horse in the badge, for focus, progress and selected states.
- Motion: Lenis inertial scrolling on desktop (native on touch), one orchestrated intro on the first visit, odometer-style digits in the hero, and a scroll-driven zoom into the Atelier. Everything respects `prefers-reduced-motion`.
- Removed from the Luxura version on purpose: invented testimonials with stock portraits, unverifiable rating badges, the fake offer countdown, and scroll-jacking.

## Stack

React 19, TypeScript, Vite 6, Tailwind CSS 4, Motion, GSAP (body-style menu), Lenis, Lucide icons.
