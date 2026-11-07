import { describe, expect, it } from "vitest";
import { canRequest, cloudinary, parseCsv, splitTrips, toTrips, whatsappLink } from "./sheets";

const csv = `id,title,start_date,end_date,status,visible,program,gallery_urls
a,Alpha,2027-03-01,2027-03-07,open,yes,"Day 1: x
Day 2: y","https://res.cloudinary.com/x/image/upload/v1/a.jpg,https://res.cloudinary.com/x/image/upload/v1/b.jpg"
b,Beta,2027-01-01,2027-01-07,sold out,yes,,
c,Hidden,2027-01-01,2027-01-07,open,no,,
d,Old,2025-01-01,2025-01-07,open,yes,,`;
const trips = toTrips(parseCsv(csv));

describe("sheet rules", () => {
  it("only shows visible = yes", () => expect(trips.map((t) => t.id)).not.toContain("c"));
  it("sorts upcoming by start_date and moves ended trips to past", () => {
    const { upcoming, past } = splitTrips(trips, "2026-11-07");
    expect(upcoming.map((t) => t.id)).toEqual(["b", "a"]);
    expect(past.map((t) => t.id)).toEqual(["d"]);
  });
  it("only open, non-past trips can be requested", () => {
    const byId = Object.fromEntries(trips.map((t) => [t.id, t]));
    expect(canRequest(byId.a, "2026-11-07")).toBe(true);
    expect(canRequest(byId.b, "2026-11-07")).toBe(false);
    expect(canRequest(byId.d, "2026-11-07")).toBe(false);
  });
  it("splits program lines into days", () => expect(trips[0].program).toEqual(["Day 1: x", "Day 2: y"]));
  it("adds cloudinary transforms", () =>
    expect(cloudinary("https://res.cloudinary.com/x/image/upload/v1/a.jpg")).toBe(
      "https://res.cloudinary.com/x/image/upload/f_auto,q_auto,w_1600/v1/a.jpg",
    ));
  it("builds the WhatsApp message", () =>
    expect(decodeURIComponent(whatsappLink(trips[0], "Ana", 3))).toBe(
      "https://wa.me/4915735462749?text=Hi Jonas! I’m Ana and I’d like to join the trip Alpha from 2027-03-01 to 2027-03-07 with 3 people.",
    ));
});
