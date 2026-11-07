import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero-surf.jpg";

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
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-14">
      <h1 className="text-5xl font-extrabold md:text-6xl">About us</h1>
      <div className="mt-10 grid items-center gap-10 md:grid-cols-2">
        <img src={hero} alt="CBS Surf crew on the beach" loading="lazy" className="aspect-[4/3] w-full rounded-3xl object-cover shadow-soft" />
        <div className="space-y-5 text-lg text-foreground/85">
          <p>CBS Surf is a community of people who love the ocean, sunshine and good company. We organize surf trips where beginners and experienced surfers travel together.</p>
          <p>We take care of the planning — accommodation, coaching, boards and the best spots — so you can focus on catching waves and making friends.</p>
          <p>No pressure, no ego. Just salty hair, sunsets and a crew that feels like family.</p>
          <Link to="/trips" className="inline-flex rounded-full bg-accent px-6 py-3 font-bold text-accent-foreground">Join a trip</Link>
        </div>
      </div>
    </div>
  );
}
