import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import hero from "@/assets/hero-surf.jpg";
import { getNews, getTrips } from "@/lib/sheets.functions";
import { splitTrips, todayIso } from "@/lib/sheets";
import { LoadError, NewsCard, TripCard } from "@/components/site";

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
    const [trips, news] = await Promise.all([getTrips(), getNews()]);
    return { upcoming: splitTrips(trips, todayIso()).upcoming.slice(0, 3), news: news.slice(0, 3) };
  },
  component: Home,
  errorComponent: ({ error }) => <LoadError error={error} />,
  notFoundComponent: () => <LoadError error={new Error("Not found.")} />,
});

function Home() {
  const { upcoming, news } = Route.useLoaderData();
  return (
    <>
      <section className="relative flex min-h-[88vh] items-end overflow-hidden">
        <img src={hero} alt="Friends walking into the surf at sunset" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-16 text-primary-foreground md:pb-24">
          <p className="mb-4 inline-block rounded-full bg-sun px-4 py-1 text-sm font-bold text-sun-foreground">Surf trips · Community · Sunshine</p>
          <h1 className="max-w-3xl text-5xl font-extrabold leading-[0.95] md:text-7xl">Chase waves. Find your crew.</h1>
          <p className="mt-5 max-w-xl text-lg text-primary-foreground/90">We pack the boards, you bring the good vibes.</p>
          <Link to="/trips" className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 font-bold text-accent-foreground shadow-soft transition hover:scale-105">
            See our trips <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-20">
        <SectionHead title="Upcoming trips" to="/trips" />
        {upcoming.length ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{upcoming.map((t) => <TripCard key={t.id} trip={t} />)}</div>
        ) : (
          <p className="text-muted-foreground">New trips coming soon.</p>
        )}
      </section>

      {news.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 pt-20">
          <SectionHead title="Latest news" to="/news" />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{news.map((n, i) => <NewsCard key={i} item={n} />)}</div>
        </section>
      )}
    </>
  );
}

function SectionHead({ title, to }: { title: string; to: "/trips" | "/news" }) {
  return (
    <div className="mb-8 flex items-end justify-between">
      <h2 className="text-4xl font-extrabold md:text-5xl">{title}</h2>
      <Link to={to} className="inline-flex items-center gap-1 font-semibold text-primary">
        View all <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
