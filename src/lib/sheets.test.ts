import { describe, expect, it } from "vitest";
import { canRequest, cloudinary, parseCsv, splitTrips, toTrips, whatsappLink, toStats, statTarget, formatDateRange, formatMonth, pastPhotos } from "./sheets";

const csv = `id,title,start_date,end_date,status,visible,program,gallery_urls
a,Alpha,2027-03-01,2027-03-07,open,yes,"Day 1: x
Day 2: y","https://res.cloudinary.com/x/image/upload/v1/a.jpg,https://res.cloudinary.com/x/image/upload/v1/b.jpg"
b,Beta,2027-01-01,2027-01-07,sold out,yes,,
c,Hidden,2027-01-01,2027-01-07,open,no,,
d,Old,2025-01-01,2025-01-07,open,yes,,`;
const trips = toTrips(parseCsv(csv));

describe("sheet rules", () => {
  it("sorts stats by order and preserves text numbers exactly", () => {
    const stats = toStats(parseCsv("order,number,label,note,show_on_home\n3,countless,Stories,,no\n1,400+,People,Good crew,yes\n2,∞,Waves,,yes"));
    expect(stats.map((s) => s.number)).toEqual(["400+", "∞", "countless"]);
    expect(stats.filter((s) => s.show_on_home).map((s) => s.number)).toEqual(["400+", "∞"]);
    expect(stats[0]?.note).toBe("Good crew");
  });
  it("counts only plain numbers or numbers with a trailing plus", () => {
    expect(statTarget("400+")).toBe(400);
    expect(statTarget("25")).toBe(25);
    expect(statTarget("∞")).toBeNull();
    expect(statTarget("countless")).toBeNull();
  });
  it("keeps a trip ending today upcoming and orders archive newest first", () => {
    const rows = toTrips(parseCsv("id,title,start_date,end_date,visible\na,Today,2026-11-01,2026-11-08,yes\nb,Older,2026-01-01,2026-01-07,yes\nc,Recent,2026-02-01,2026-02-07,yes"));
    const { upcoming, past } = splitTrips(rows, "2026-11-08");
    expect(upcoming.map((t) => t.id)).toEqual(["a"]);
    expect(past.map((t) => t.id)).toEqual(["c", "b"]);
    expect(canRequest({ ...rows[0], status: "open" } as typeof rows[number], "2026-11-08")).toBe(true);
  });
  it("formats upcoming ranges and past month labels", () => {
    expect(formatDateRange("2027-01-31", "2027-02-06")).toBe("31 Jan – 6 Feb 2027");
    expect(formatMonth("2026-02-01")).toBe("February 2026");
  });
  it("collects every past gallery photo with its trip title", () => {
    expect(pastPhotos(trips).map((p) => p.trip)).toEqual(["Alpha", "Alpha"]);
    expect(pastPhotos(trips)[0]?.src).toContain("a.jpg");
  });
  it("generates a usable trip identifier when the sheet's id header is missing", () => {
    const rows = parseCsv("´,title,start_date,visible\n,Fuerteventura,2027-01-31,yes\nmorocco-apr27,Morocco,2027-04-17,yes");
    expect(toTrips(rows).map((trip) => trip.id)).toEqual([
      "fuerteventura-2027-01-31", "morocco-2027-04-17",
    ]);
  });
  it("generates a trip identifier for a blank id without changing explicit ids", () => {
    const rows = parseCsv("id,title,start_date,visible\n,Fuerteventura,2027-01-31,yes\nmorocco-apr27,Morocco,2027-04-17,yes");
    expect(toTrips(rows).map((trip) => trip.id)).toEqual([
      "fuerteventura-2027-01-31", "morocco-apr27",
    ]);
  });
  it("only shows visible = yes", () => expect(trips.map((t) => t.id)).not.toContain("c"));
  it("sorts upcoming by start_date and moves ended trips to past", () => {
    const { upcoming, past } = splitTrips(trips, "2026-11-07");
    expect(upcoming.map((t) => t.id)).toEqual(["b", "a"]);
    expect(past.map((t) => t.id)).toEqual(["d"]);
  });
  it("only open, non-past trips can be requested", () => {
    const byId = (id: string) => trips.find((t) => t.id === id)!;
    expect(canRequest(byId("a"), "2026-11-07")).toBe(true);
    expect(canRequest(byId("b"), "2026-11-07")).toBe(false);
    expect(canRequest(byId("d"), "2026-11-07")).toBe(false);
  });
  it("splits program lines into days", () => expect(trips[0]!.program).toEqual(["Day 1: x", "Day 2: y"]));
  it("adds cloudinary transforms", () =>
    expect(cloudinary("https://res.cloudinary.com/x/image/upload/v1/a.jpg")).toBe(
      "https://res.cloudinary.com/x/image/upload/f_auto,q_auto,w_1600/v1/a.jpg",
    ));
  it("builds the WhatsApp message", () =>
    expect(decodeURIComponent(whatsappLink(trips[0]!, "Ana", 3))).toBe(
      "https://wa.me/4915735462749?text=Hi Jonas! I’m Ana and I’d like to join the trip Alpha from 2027-03-01 to 2027-03-07 with 3 people.",
    ));
});
