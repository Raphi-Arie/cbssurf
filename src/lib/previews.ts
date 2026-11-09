// Presentation limits only; all archive content remains available on its full page.
export const PHOTO_PAGE_SIZE = 12;
export function homePastTrips<T>(trips: T[]): T[] {
  return trips.slice(0, 6);
}