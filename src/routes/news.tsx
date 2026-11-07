import { createFileRoute } from "@tanstack/react-router";
import { getNews } from "@/lib/sheets.functions";
import { LoadError, NewsCard } from "@/components/site";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "News — CBS Surf" },
      { name: "description", content: "The latest updates from the CBS Surf community." },
      { property: "og:title", content: "News — CBS Surf" },
      { property: "og:description", content: "The latest updates from the CBS Surf community." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: () => getNews(),
  component: News,
  errorComponent: ({ error }) => <LoadError error={error} />,
  notFoundComponent: () => <LoadError error={new Error("Not found.")} />,
});

function News() {
  const news = Route.useLoaderData();
  return (
    <div className="mx-auto max-w-6xl px-5 pt-14">
      <h1 className="text-5xl font-extrabold md:text-6xl">News</h1>
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {news.map((n, i) => <NewsCard key={i} item={n} />)}
      </div>
      {news.length === 0 && <p className="mt-6 text-muted-foreground">No news yet.</p>}
    </div>
  );
}
