// Pure parsing + business rules for the Google Sheet content.

export type TripStatus = "open" | "coming soon" | "sold out";

export interface Trip {
  id: string;
  title: string;
  location: string;
  start_date: string;
  end_date: string;
  price: string;
  status: TripStatus;
  status_note: string;
  image_url: string;
  short_description: string;
  description: string;
  program: string[];
  included: string;
  camp_link: string;
  gallery: string[];
}

export interface Testimonial {
  order: number;
  name: string;
  trip: string;
  quote: string;
  photo_url: string;
}

export function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  const header = rows[0];
  const body = rows.slice(1);
  if (!header) return [];
  const keys = header.map((h) => h.trim().toLowerCase());
  return body
    .filter((r) => r.some((v) => v.trim() !== ""))
    .map((r) => Object.fromEntries(keys.map((k, i) => [k, (r[i] ?? "").trim()])));
}

export function cloudinary(url: string): string {
  if (!url || !url.includes("res.cloudinary.com") || url.includes("f_auto,q_auto,w_1600")) return url;
  return url.replace("/upload/", "/upload/f_auto,q_auto,w_1600/");
}

const g = (r: Record<string, string>, k: string): string => r[k] ?? "";

const isVisible = (r: Record<string, string>) => g(r, "visible").toLowerCase() === "yes";

function normalizeStatus(s: string): TripStatus {
  const v = s.toLowerCase().trim();
  if (v === "open" || v === "sold out") return v;
  return "coming soon";
}

export function toTrips(rows: Record<string, string>[]): Trip[] {
  return rows.filter(isVisible).map((r) => ({
    id: g(r, "id").trim() || [g(r, "title"), g(r, "start_date")]
      .join("-")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, ""),
    title: g(r, "title"),
    location: g(r, "location"),
    start_date: g(r, "start_date"),
    end_date: g(r, "end_date"),
    price: g(r, "price"),
    status: normalizeStatus(g(r, "status")),
    status_note: g(r, "status_note") ?? "",
    image_url: cloudinary(g(r, "image_url")),
    short_description: g(r, "short_description") ?? "",
    description: g(r, "description") ?? "",
    program: g(r, "program").split(/\r?\n/).map((l) => l.trim()).filter(Boolean),
    included: g(r, "included") ?? "",
    camp_link: g(r, "camp_link") ?? "",
    gallery: g(r, "gallery_urls").split(",").map((u) => u.trim()).filter(Boolean).map(cloudinary),
  }));
}

export function toTestimonials(rows: Record<string, string>[]): Testimonial[] {
  return rows
    .filter(isVisible)
    .map((r) => ({ order: Number(g(r, "order")) || 0, name: g(r, "name"), trip: g(r, "trip"), quote: g(r, "quote"), photo_url: cloudinary(g(r, "photo_url")) }))
    .sort((a, b) => a.order - b.order);
}

export function todayIso(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export function splitTrips(trips: Trip[], today: string) {
  const byStart = [...trips].sort((a, b) => a.start_date.localeCompare(b.start_date));
  return {
    upcoming: byStart.filter((t) => !(t.end_date && t.end_date < today)),
    past: byStart.filter((t) => t.end_date && t.end_date < today).reverse(),
  };
}

export function canRequest(trip: Trip, today: string): boolean {
  return trip.status === "open" && !(trip.end_date && trip.end_date < today);
}

export function whatsappLink(trip: Trip, name: string, people: number): string {
  const dates = formatDateRange(trip.start_date, trip.end_date);
  const msg = `Hi CBS Surf! I'm ${name} and I'd like to join the ${trip.title} trip (${dates}) with ${people} ${people === 1 ? "person" : "people"}.`;
  return `https://wa.me/4915735462749?text=${encodeURIComponent(msg)}`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

export interface Stat { order: number; number: string; label: string; note: string; show_on_home: boolean }
export function toStats(rows: Record<string, string>[]): Stat[] {
  return rows.map((r) => ({ order: Number(g(r, "order")) || 0, number: g(r, "number"), label: g(r, "label"), note: g(r, "note"), show_on_home: g(r, "show_on_home").toLowerCase() === "yes" })).sort((a, b) => a.order - b.order);
}
export function statTarget(value: string): number | null {
  return /^\d+\+?$/.test(value) ? Number(value.replace(/\+$/, "")) : null;
}
export function formatMonth(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
}
export function formatDateRange(start: string, end: string): string {
  if (!start || !end) return formatDate(start || end);
  const a = formatDate(start), b = formatDate(end);
  const sameYear = start.slice(0, 4) === end.slice(0, 4);
  if (sameYear && start.slice(5, 7) === end.slice(5, 7)) return `${a.replace(/ [A-Za-z]+ \d{4}$/, "")}–${b}`;
  return `${sameYear ? a.replace(/ \d{4}$/, "") : a} – ${b}`;
}
export function formatMonthRange(start: string, end: string): string {
  if (!start || !end || start.slice(0, 7) === end.slice(0, 7)) return formatMonth(start || end);
  const a = new Date(start + "T00:00:00Z"), b = new Date(end + "T00:00:00Z");
  if (isNaN(a.getTime()) || isNaN(b.getTime())) return formatMonth(start);
  const sameYear = start.slice(0, 4) === end.slice(0, 4);
  const opts: Intl.DateTimeFormatOptions = { month: "short", timeZone: "UTC" };
  const ma = a.toLocaleDateString("en-GB", opts);
  const mb = b.toLocaleDateString("en-GB", sameYear ? opts : { ...opts, year: "numeric" });
  return `${ma} – ${mb}${sameYear ? " " + start.slice(0, 4) : ""}`;
}
export function splitParagraphs(text: string): string[] {
  return text.split(/\r?\n\s*\r?\n/).map((p) => p.replace(/\r?\n/g, " ").trim()).filter(Boolean);
}
export function includedItems(text: string): string[] {
  return text.split(",").map((item) => item.trim()).filter(Boolean);
}
export interface TripPhoto { src: string; trip: string }
// Mix photos evenly across trips: round-robin up to 4 per trip first, then fill with the rest,
// so no single trip dominates the archive wall.
export function pastPhotos(trips: Trip[], perTripFirst = 4): TripPhoto[] {
  const first: TripPhoto[] = [];
  const rest: TripPhoto[] = [];
  for (let round = 0; round < perTripFirst; round++) {
    for (const trip of trips) {
      const src = trip.gallery[round];
      if (src) first.push({ src, trip: trip.title });
    }
  }
  for (const trip of trips) {
    for (const src of trip.gallery.slice(perTripFirst)) rest.push({ src, trip: trip.title });
  }
  return [...first, ...rest];
}
