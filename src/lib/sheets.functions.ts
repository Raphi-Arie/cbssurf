import { createServerFn } from "@tanstack/react-start";
import { parseCsv, toNews, toTrips, toStats } from "./sheets";

const BASE =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTESVoeBWENGtVi5PwPJojmsHJKimSCPvim4NpA9v8mNy5dO3xm4H5bhnbgJRUtDRROQW42DwZ83djQ/pub";

async function fetchCsv(gid: string) {
  const res = await fetch(`${BASE}?gid=${gid}&single=true&output=csv&t=${Date.now()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Could not load content (${res.status})`);
  return parseCsv(await res.text());
}

export const getTrips = createServerFn({ method: "GET" }).handler(async () =>
  toTrips(await fetchCsv("478495005")),
);

export const getNews = createServerFn({ method: "GET" }).handler(async () =>
  toNews(await fetchCsv("925126147")),
);

export const getStats = createServerFn({ method: "GET" }).handler(async () =>
  toStats(await fetchCsv("1025576896")),
);
