import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import hero from "@/assets/hero-surf.jpg";
import { getTrips, getStats } from "@/lib/sheets.functions";
import { splitTrips, todayIso } from "@/lib/sheets";
import { StatsGrid } from "@/components/stats";
import { Button } from "@/components/ui/button";
import { LoadError, TripCard } from "@/components/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CBS Surf — Chase waves with friends" },
      { name: "description", content: "Join CBS Surf on sunny surf trips to Fuerteventura, Morocco, Portugal and beyond." },
      { property: "og:title", content: "CBS Surf — Chase waves with friends" },
      { property: "og:description", content: "Sunny surf trips for our community." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: async () => {
    const [trips, stats] = await Promise.all([getTrips(), getStats()]);
    const { upcoming, past } = splitTrips(trips, todayIso());
    return { upcoming: upcoming.slice(0, 3), past: past.slice(0, 3), stats: stats.filter((s) => s.show_on_home) };
  },
  component: Home,
  errorComponent: ({ error }) => <LoadError error={error} />,
  notFoundComponent: () => <LoadError error={new Error("Not found.")} />,
});

function Home() {
  const { upcoming, past, stats } = Route.useLoaderData();
  return (
    <>
      <section className="relative flex min-h-[68vh] items-end overflow-hidden md:min-h-[88vh]">
        <img src={hero} alt="Friends walking into the surf at sunset" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-12 text-primary-foreground md:pb-24">
          <p className="mb-4 inline-block rounded-full bg-sun px-4 py-1 text-sm font-bold text-sun-foreground">Surf trips · Community · Sunshine</p>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-[0.95] md:text-7xl">Chase waves. Find your crew.</h1>
          <p className="mt-5 max-w-xl text-lg text-primary-foreground/90">We pack the boards, you bring the good vibes.</p>
          <Link to="/trips" className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 font-bold text-accent-foreground hover:bg-sand-hover shadow-soft transition hover:scale-105">
            See our trips <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {stats.length > 0 && <section className="sand-highlight border-b border-border bg-accent py-12"><div className="mx-auto max-w-6xl px-5"><StatsGrid stats={stats} /><div className="mt-8 text-center"><Link to="/about" className="text-sm font-semibold text-primary">More about us →</Link></div></div></section>}

      <section className="mx-auto max-w-6xl px-5 pt-12 md:pt-20">
        <SectionHead title="Upcoming trips" to="/trips" />
        {upcoming.length ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{upcoming.map((t) => <TripCard key={t.id} trip={t} />)}</div>
        ) : (
          <p className="text-muted-foreground">New trips coming soon.</p>
        )}
      </section>

      {past.length > 0 && <section className="mx-auto max-w-6xl px-5 pt-12 md:pt-20">
        <h2 className="mb-8 text-3xl font-extrabold md:text-4xl">Past trips</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{past.map((t) => <TripCard key={t.id} trip={t} past compact />)}</div>
        <div className="mt-8"><Button asChild className="rounded-full bg-primary text-primary-foreground hover:bg-primary-hover"><Link to="/past-trips">Explore past trips <ArrowRight /></Link></Button></div>
      </section>}

    </>
  );
}

function SectionHead({ title, to }: { title: string; to: "/trips" }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <h2 className="text-3xl font-extrabold md:text-5xl">{title}</h2>
      <Link to={to} className="inline-flex items-center gap-1 font-semibold text-ocean">
        View all <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
