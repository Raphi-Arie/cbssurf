# CBS Surf

Website for **CBS Surf** (CBS = Copenhagen Business School), a community that organizes surf trips. Visitors browse upcoming and past trips, see the program and what's included, and request a spot with a pre-filled WhatsApp message. Built by Arie Harperath & Raphael Thomas.

**Live site:** coming soon (will be hosted on Vercel)

## What it does

- **Trips:** upcoming trips (sorted by start date) and past trips. Each trip page has a description, a day-by-day program, what's included, a photo gallery and a link to the camp.
- **Status per trip:** open, coming soon or sold out, with an optional note. Only open trips show the request button.
- **Request flow:** name and number of people, then WhatsApp opens with a pre-filled message. The site handles no payments on purpose.
- **Community:** testimonials carousel, community stats, photo wall, About page, "How it works" with an FAQ, and a privacy page.
- **Mobile-first**, because most visitors arrive from Instagram.

## Content without touching code

The organizers edit a Google Sheet, not the code. Trips, testimonials and stats are published as CSV, and the site fetches them. The rules live in `src/lib/sheets.ts` and are covered by unit tests:

- only rows with `visible = yes` are shown
- trips are split into upcoming and past by their end date
- Cloudinary image URLs get `f_auto,q_auto,w_1600`, so images load smaller and faster

A new trip is a new row in the sheet. Closing a trip is a change in its status column.

## Stack

React, TypeScript, TanStack Start (router and query), Tailwind CSS, shadcn/ui (Radix), Vite and Vitest.
Google Sheets is the content source, and Cloudinary hosts the images.

## How it was built

The product requirements were planned in a chat with Claude: pages, a booking flow without payments, and updates that don't need a developer. The site was then built step by step with [Lovable](https://lovable.dev), an AI app builder, and the code is synced to this repo. `roadmap.md` lists the iterations, such as the palette, the mobile layout and the testimonials carousel.

## Run it locally

```sh
npm install
npm run dev     # start the dev server
npm test        # run the tests
npm run build   # production build
```

## Project structure

| Path | What it is |
|---|---|
| `src/routes/` | The pages: home, trips, trip detail, past trips, how it works, about, privacy |
| `src/components/` | Shared parts such as the trip cards, photo wall, testimonials and stat
| `src/lib/sheets.ts` | Parsing the sheets and the business rules (status, past or upcoming, images) |
| `src/lib/sheets.functions.ts` | Fetching the published sheets |
