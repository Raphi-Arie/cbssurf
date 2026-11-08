import { createFileRoute, Link } from "@tanstack/react-router";
import { getTrips } from "@/lib/sheets.functions";
import { splitTrips, todayIso } from "@/lib/sheets";
import { LoadError, TripCard } from "@/components/site";

export const Route = createFileRoute("/trips/")({
  head: () => ({
    meta: [
      { title: "Surf trips — CBS Surf" },
      { name: "description", content: "All upcoming and past CBS Surf trips." },
      { property: "og:title", content: "Surf trips — CBS Surf" },
      { property: "og:description", content: "All upcoming and past CBS Surf trips." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: async () => splitTrips(await getTrips(), todayIso()),
  component: Trips,
  errorComponent: ({ error }) => <LoadError error={error} />,
  notFoundComponent: () => <LoadError error={new Error("Not found.")} />,
});

function Trips() {
  const { upcoming } = Route.useLoaderData();
  return (
    <div className="mx-auto max-w-6xl px-5 pt-14">
      <h1 className="text-5xl font-extrabold md:text-6xl">Our trips</h1>
      <p className="mt-3 max-w-xl text-lg text-muted-foreground">Pick your wave. Every trip is planned for good surf, good food and good company.</p>
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {upcoming.map((t) => <TripCard key={t.id} trip={t} />)}
      </div>
      {upcoming.length === 0 && <p className="mt-6 text-muted-foreground">New trips coming soon.</p>}
      <Link to="/past-trips" className="mt-10 inline-block font-semibold text-primary">See our past trips →</Link>
    </div>
  );
}
