// Presentation limits only; all archive content remains available on its full page.
export const PHOTO_PAGE_SIZE = 12;
export function homePastTrips<T>(trips: T[]): T[] {
  return trips.slice(0, 6);
}

// Trip detail back link depends on whether the trip already happened.
export type TripBackLink = { to: "/trips" | "/past-trips"; label: string };
export function tripBackLink(past: boolean): TripBackLink {
  return past ? { to: "/past-trips", label: "Past trips" } : { to: "/trips", label: "All trips" };
}