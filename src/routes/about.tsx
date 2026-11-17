import { createFileRoute, Link } from "@tanstack/react-router";
import { getStats, getTeam } from "@/lib/sheets.functions";
import { StatsGrid } from "@/components/stats";
import { Team } from "@/components/team";
import { useSiteSettings } from "@/lib/site-settings";
import { Button } from "@/components/ui/button";
import { LoadError } from "@/components/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About us — CBS Surf" },
      { name: "description", content: "CBS Surf is a community of friends who travel together to chase waves and sunshine." },
      { property: "og:title", content: "About us — CBS Surf" },
      { property: "og:description", content: "A community of friends chasing waves and sunshine." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: async () => {
    const [stats, team] = await Promise.all([getStats(), getTeam()]);
    return { stats, team };
  },
  component: About,
  errorComponent: ({ error }) => <LoadError error={error} />,
});

function About() {
  const { stats, team } = Route.useLoaderData();
  const { aboutHeroImage, aboutStoryImage } = useSiteSettings();
  return (
    <>
      <section className="relative flex min-h-[45vh] items-end md:min-h-[60vh]"><img src={aboutHeroImage} alt="Surf friends on the beach" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-hero-overlay" /><div className="relative mx-auto w-full max-w-6xl px-5 pb-12 text-primary-foreground"><h1 className="text-4xl font-extrabold md:text-6xl">We are CBS Surf</h1></div></section>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-12 md:grid-cols-2 md:py-16"><div><h2 className="text-3xl font-extrabold md:text-4xl">Our story</h2><p className="mt-5 text-lg leading-relaxed text-foreground/85">It starts with a love for the ocean, and grows with every person who joins us. CBS Surf brings people together for waves, sunshine and the kind of moments you talk about long after coming home.</p><p className="mt-4 text-lg text-foreground/85">From the first wave to the last sunset, it's the people who make each trip a story worth sharing.</p></div><img src={aboutStoryImage} alt="Friends heading into the surf" className="aspect-[4/3] w-full rounded-3xl object-cover" /></section>
      <section className="bg-secondary py-12 md:py-16"><div className="mx-auto max-w-6xl px-5"><h2 className="text-3xl font-extrabold md:text-4xl">CBS Surf in numbers</h2><p className="mb-10 mt-3 text-lg text-muted-foreground">Some numbers we're proud of</p><StatsGrid stats={stats} /></div></section>
      <Team members={team} />
      <section className="border-t border-border px-5 py-12 text-center"><h2 className="text-3xl font-extrabold">Want to be part of the next story?</h2><Button asChild className="mt-6 rounded-full bg-primary text-primary-foreground hover:bg-primary-hover"><Link to="/trips">Explore trips</Link></Button></section>
    </>
  );
}
