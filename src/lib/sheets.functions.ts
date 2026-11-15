import { createServerFn } from "@tanstack/react-start";
import { parseCsv, toTestimonials, toTrips, toStats, toSettings } from "./sheets";
import { defaultSettings } from "./site-settings";

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

export const getTestimonials = createServerFn({ method: "GET" }).handler(async () =>
  toTestimonials(await fetchCsv("533034055")),
);

export const getStats = createServerFn({ method: "GET" }).handler(async () =>
  toStats(await fetchCsv("1025576896")),
);

// Never throws: a missing or broken Settings tab falls back to the built-in images and number.
export const getSettings = createServerFn({ method: "GET" }).handler(async () => {
  try {
    return toSettings(await fetchCsv("1036658696"), defaultSettings);
  } catch {
    return defaultSettings;
  }
});

// Older open preview tabs can still call this RPC until they reload.
// Keep a no-content response without fetching the retired News CSV.
export const getNews = createServerFn({ method: "GET" }).handler(async () => []);
