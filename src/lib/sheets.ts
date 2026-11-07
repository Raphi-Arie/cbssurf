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

export interface NewsItem {
  title: string;
  date: string;
  text: string;
  image_url: string;
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
    id: g(r, "id"),
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

export function toNews(rows: Record<string, string>[]): NewsItem[] {
  return rows
    .filter(isVisible)
    .map((r) => ({ title: g(r, "title"), date: g(r, "date"), text: g(r, "text"), image_url: cloudinary(g(r, "image_url")) }))
    .sort((a, b) => b.date.localeCompare(a.date));
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
  const msg = `Hi Jonas! I’m ${name} and I’d like to join the trip ${trip.title} from ${trip.start_date} to ${trip.end_date} with ${people} people.`;
  return `https://wa.me/4915735462749?text=${encodeURIComponent(msg)}`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}
