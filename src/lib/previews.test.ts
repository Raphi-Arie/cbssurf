import { describe, expect, it } from "vitest";
import { homePastTrips, tripBackLink } from "./previews";

describe("Home archive preview", () => {
  it("shows six past trips and leaves the rest for Explore past trips", () => {
    const trips = Array.from({ length: 10 }, (_, id) => ({ id }));
    expect(homePastTrips(trips).map((trip) => trip.id)).toEqual([0, 1, 2, 3, 4, 5]);
    expect(trips).toHaveLength(10);
  });
});

describe("Trip detail back link", () => {
  it("points past trips at the archive and upcoming trips at the trip list", () => {
    expect(tripBackLink(true)).toEqual({ to: "/past-trips", label: "Past trips" });
    expect(tripBackLink(false)).toEqual({ to: "/trips", label: "All trips" });
  });
});