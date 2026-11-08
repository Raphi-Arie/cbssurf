import { createFileRoute } from "@tanstack/react-router";
import { getNews } from "@/lib/sheets.functions";
import { pageHead } from "@/lib/metadata";
import { LoadError, NewsCard } from "@/components/site";

export const Route = createFileRoute("/stories")({
  head: () => pageHead("Stories", "Short updates and longer trip reports from the CBS Surf community."),
  loader: () => getNews(), component: Stories,
  errorComponent: ({ error }) => <LoadError error={error} />,
});
function Stories() {
  const stories = Route.useLoaderData();
  return <div className="mx-auto max-w-6xl px-5 pt-14"><h1 className="text-5xl font-extrabold md:text-6xl">Stories</h1><div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{stories.map((item, i) => <NewsCard key={i} item={item} />)}</div>{!stories.length && <p className="mt-8 text-muted-foreground">New stories coming soon.</p>}</div>;
}