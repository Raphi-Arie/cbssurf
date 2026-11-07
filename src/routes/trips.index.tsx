import { createFileRoute } from "@tanstack/react-router";
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
  const { upcoming, past } = Route.useLoaderData();
  return (
    <div className="mx-auto max-w-6xl px-5 pt-14">
      <h1 className="text-5xl font-extrabold md:text-6xl">Our trips</h1>
      <p className="mt-3 max-w-xl text-lg text-muted-foreground">Pick your wave. Every trip is planned for good surf, good food and good company.</p>
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {upcoming.map((t) => <TripCard key={t.id} trip={t} />)}
      </div>
      {upcoming.length === 0 && <p className="mt-6 text-muted-foreground">New trips coming soon.</p>}
      {past.length > 0 && (
        <>
          <h2 className="mt-20 text-3xl font-extrabold">Past trips</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((t) => <TripCard key={t.id} trip={t} past />)}
          </div>
        </>
      )}
    </div>
  );
}
