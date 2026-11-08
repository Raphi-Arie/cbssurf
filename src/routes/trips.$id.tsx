import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, Check, MapPin, MessageCircle } from "lucide-react";
import { getTrips } from "@/lib/sheets.functions";
import { canRequest, formatDateRange, formatMonthRange, includedItems, splitParagraphs, todayIso, whatsappLink, type Trip } from "@/lib/sheets";
import { Button } from "@/components/ui/button";
import { LoadError, StatusBadge } from "@/components/site";

export const Route = createFileRoute("/trips/$id")({
  loader: async ({ params }) => {
    const trip = (await getTrips()).find((t) => t.id === params.id);
    if (!trip) throw notFound();
    return { trip, requestable: canRequest(trip, todayIso()), past: !!trip.end_date && trip.end_date < todayIso() };
  },
  head: ({ loaderData }) => {
    const t = loaderData?.trip;
    const title = t ? `${t.title} surf trip — CBS Surf` : "Trip — CBS Surf";
    const desc = t?.short_description || "A CBS Surf trip.";
    const image = t?.image_url || t?.gallery[0];
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(image?.startsWith("https://") ? [{ property: "og:image", content: image }, { name: "twitter:image", content: image }] : []),
      ],
    };
  },
  component: TripPage,
  errorComponent: ({ error }) => <LoadError error={error} />,
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <h1 className="text-3xl font-bold">Trip not found</h1>
      <Link to="/trips" className="mt-4 inline-block font-semibold text-primary">See all trips</Link>
    </div>
  ),
});

function TripPage() {
  const { trip, requestable, past } = Route.useLoaderData();
  const cover = trip.image_url || trip.gallery[0];
  return (
    <>
      <section className="relative flex min-h-[50vh] items-end overflow-hidden md:min-h-[60vh]">
        {cover && <img src={cover} alt={trip.title} className="absolute inset-0 h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-12 text-primary-foreground">
          <Link to="/trips" className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-primary-foreground/90"><ArrowLeft className="h-4 w-4" /> All trips</Link>
          {!past && <div className="mb-3"><StatusBadge status={trip.status} /></div>}
          <h1 className="text-4xl font-extrabold md:text-7xl">{trip.title}</h1>
          <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-primary-foreground/90">
            <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{trip.location}</span>
            <span className="inline-flex items-center gap-1"><CalendarDays className="h-4 w-4" />{past ? formatMonthRange(trip.start_date, trip.end_date) : formatDateRange(trip.start_date, trip.end_date)}</span>
          </p>
        </div>
      </section>

      <div className={`mx-auto grid max-w-6xl gap-10 px-5 pt-8 md:gap-12 md:pt-12 ${past ? "" : "lg:grid-cols-[1fr_380px]"} ${requestable ? "pb-24 lg:pb-0" : ""}`}>
        <div className="space-y-10 md:space-y-12">
          {trip.description && <div className="space-y-4">{splitParagraphs(trip.description).map((paragraph, i) => <p key={i} className="text-lg leading-relaxed text-foreground/85">{paragraph}</p>)}</div>}
          {trip.program.length > 0 && (
            <section>
              <h2 className="text-2xl font-extrabold md:text-3xl">Program</h2>
              <ol className="mt-4 space-y-2 md:mt-6 md:space-y-3">
                {trip.program.map((line, i) => {
                  const m = line.match(/^(Day[^:]*):\s*(.*)$/i);
                  const label = m ? m[1]! : `Day ${i + 1}`;
                  const dm = label.match(/^(Day\s*\d+)\s*\(([^)]*)\)\s*$/i);
                  return (
                    <li key={i} className="rounded-2xl bg-card p-4 shadow-soft md:p-5">
                      <div className="flex flex-col gap-2 md:flex-row md:items-start md:gap-4">
                        <div className="flex items-baseline gap-2 self-start md:w-32 md:shrink-0">
                          <span className="shrink-0 rounded-full bg-sun px-3 py-1 text-xs font-bold text-sun-foreground md:text-sm">{dm ? dm[1] : label}</span>
                          {dm && <span className="text-xs text-muted-foreground">{dm[2]}</span>}
                        </div>
                        <span className="text-sm leading-relaxed md:pt-0.5 md:text-base">{m ? m[2] : line}</span>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>
          )}
          {trip.included && (
            <section>
              <h2 className="text-2xl font-extrabold md:text-3xl">What's included</h2>
              {includedItems(trip.included).length > 1 ? (
                <ul className="mt-4 space-y-2">
                  {includedItems(trip.included).map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-lg text-foreground/85">
                      <Check className="mt-1 h-5 w-5 shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-lg text-foreground/85">{trip.included}</p>
              )}
            </section>
          )}
          {trip.camp_link && (
            <a href={trip.camp_link} target="_blank" rel="noreferrer" className="inline-block font-semibold text-primary underline">Visit the camp website</a>
          )}
          {trip.gallery.length > 0 && (
            <section>
              <h2 className="text-2xl font-extrabold md:text-3xl">Gallery</h2>
              <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
                {trip.gallery.map((src, i) => (
                  <a key={i} href={src} target="_blank" rel="noreferrer" className={`overflow-hidden rounded-2xl ${i === 0 ? "col-span-2 row-span-2" : ""}`}>
                    <img src={src} alt={`${trip.title} photo ${i + 1}`} loading="lazy" className="h-full w-full object-cover transition hover:scale-105" />
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
        {!past && <aside className="lg:sticky lg:top-24 lg:self-start">
          <div id="request-form" className="scroll-mt-24 rounded-3xl bg-card p-6 shadow-soft">
            {trip.price && <p className="font-display text-3xl font-extrabold text-primary">{trip.price}</p>}
            {trip.status_note && <p className="mt-2 font-semibold text-accent">{trip.status_note}</p>}
            {requestable ? <RequestForm trip={trip} /> : (
              <p className="mt-4 text-muted-foreground">
                {past ? "This trip has already happened." : trip.status === "sold out" ? "This trip is sold out." : "Requests open soon — follow us on Instagram for updates."}
              </p>
            )}
          </div>
        </aside>}
        {past && <section className="border-t border-border py-10 text-center"><h2 className="text-3xl font-bold">Want to join the next one?</h2><Button asChild className="mt-5 rounded-full bg-accent text-accent-foreground"><Link to="/trips">Explore upcoming trips</Link></Button></section>}
      </div>
      {requestable && <StickyRequestBar trip={trip} />}
    </>
  );
}

function StickyRequestBar({ trip }: { trip: Trip }) {
  const [formVisible, setFormVisible] = useState(false);
  useEffect(() => {
    const form = document.getElementById("request-form");
    if (!form) return;
    const observer = new IntersectionObserver(([entry]) => setFormVisible(!!entry?.isIntersecting), { threshold: 0.15 });
    observer.observe(form);
    return () => observer.disconnect();
  }, []);
  return (
    <div className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur transition-transform duration-300 lg:hidden ${formVisible ? "translate-y-full" : "translate-y-0"}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 p-4">
        {trip.price && <p className="font-display text-xl font-extrabold text-primary">{trip.price}</p>}
        <Button className="rounded-full bg-accent px-6 font-bold text-accent-foreground" onClick={() => document.getElementById("request-form")?.scrollIntoView({ behavior: "smooth", block: "start" })}>
          Request a spot
        </Button>
      </div>
    </div>
  );
}

function RequestForm({ trip }: { trip: Trip }) {
  const [name, setName] = useState("");
  const [people, setPeople] = useState("1");
  const n = parseInt(people, 10);
  const valid = name.trim().length > 0 && name.length <= 100 && Number.isFinite(n) && n >= 1;
  return (
    <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
      <label className="block">
        <span className="text-sm font-semibold">Your name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} required className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">Number of people</span>
        <input type="number" min={1} value={people} onChange={(e) => setPeople(e.target.value)} required className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
      </label>
      {valid ? (
        <a
          href={whatsappLink(trip, name.trim(), n)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-auto w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 font-bold text-accent-foreground transition hover:scale-[1.02]"
        >
          <MessageCircle className="h-5 w-5" /> Request via WhatsApp
        </a>
      ) : (
        <Button disabled className="inline-flex h-auto w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 font-bold text-accent-foreground disabled:opacity-50">
          <MessageCircle className="h-5 w-5" /> Request via WhatsApp
        </Button>
      )}
    </form>
  );
}
