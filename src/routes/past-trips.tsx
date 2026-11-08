import { createFileRoute } from "@tanstack/react-router";
import hero from "@/assets/hero-surf.jpg";
import { getTrips, getStats, getTestimonials } from "@/lib/sheets.functions";
import { splitTrips, todayIso, pastPhotos } from "@/lib/sheets";
import { pageHead } from "@/lib/metadata";
import { StatsGrid } from "@/components/stats";
import { PhotoWall } from "@/components/photo-wall";
import { Testimonials } from "@/components/testimonials";
import { LoadError, TripCard } from "@/components/site";

export const Route = createFileRoute("/past-trips")({
  loader: async () => { const [trips, stats, testimonials] = await Promise.all([getTrips(), getStats(), getTestimonials()]); const { past } = splitTrips(trips, todayIso()); return { past, stats: stats.filter((s) => s.show_on_home), photos: pastPhotos(past), testimonials }; },
  head: ({ loaderData }) => pageHead("Where we've been", "Impressions from past CBS Surf trips and the people who made them special.", loaderData?.past[0]?.image_url || loaderData?.past[0]?.gallery[0]),
  component: PastTrips, errorComponent: ({ error }) => <LoadError error={error} />,
});
function PastTrips() {
  const { past, stats, photos, testimonials } = Route.useLoaderData();
  const cover = past[0]?.image_url || past[0]?.gallery[0] || hero;
  return <>
    <section className="relative flex min-h-[45vh] items-end md:min-h-[55vh]"><img src={cover} alt="Our surf community" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-hero-overlay" /><div className="relative mx-auto w-full max-w-6xl px-5 py-12 text-primary-foreground"><h1 className="text-4xl font-extrabold md:text-6xl">Where we've been</h1><p className="mt-5 max-w-2xl text-lg">Over the years we've taken our community to some of the best surf spots around. Here are some impressions.</p></div></section>
    {stats.length > 0 && <section className="border-b border-border bg-background py-7 md:py-8"><div className="mx-auto max-w-5xl px-5"><StatsGrid stats={stats} compact /></div></section>}
    <Testimonials items={testimonials} />
    <section className="mx-auto max-w-6xl px-5 pt-10 md:pt-14"><div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{past.map((trip) => <TripCard key={trip.id} trip={trip} past />)}</div>{!past.length && <p className="text-muted-foreground">Past trip impressions coming soon.</p>}</section>
    {photos.length > 0 && <section className="mx-auto max-w-6xl px-5 pt-12 md:pt-16"><h2 className="mb-8 text-3xl font-extrabold md:text-4xl">Impressions</h2><PhotoWall photos={photos} /></section>}
  </>;
}