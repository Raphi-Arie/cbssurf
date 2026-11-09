import { describe, expect, it } from "vitest";
import { homePastTrips } from "./previews";

describe("Home archive preview", () => {
  it("shows six past trips and leaves the rest for Explore past trips", () => {
    const trips = Array.from({ length: 10 }, (_, id) => ({ id }));
    expect(homePastTrips(trips).map((trip) => trip.id)).toEqual([0, 1, 2, 3, 4, 5]);
    expect(trips).toHaveLength(10);
  });
});