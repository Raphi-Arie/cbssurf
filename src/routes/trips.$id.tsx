import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, CalendarDays, MapPin, MessageCircle } from "lucide-react";
import { getTrips } from "@/lib/sheets.functions";
import { canRequest, formatDate, todayIso, whatsappLink, type Trip } from "@/lib/sheets";
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
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(t?.image_url ? [{ property: "og:image", content: t.image_url }, { name: "twitter:image", content: t.image_url }] : []),
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
  return (
    <>
      <section className="relative flex min-h-[60vh] items-end overflow-hidden">
        {trip.image_url && <img src={trip.image_url} alt={trip.title} className="absolute inset-0 h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-12 text-primary-foreground">
          <Link to="/trips" className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-primary-foreground/90"><ArrowLeft className="h-4 w-4" /> All trips</Link>
          <div className="mb-3">{past ? <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold uppercase text-muted-foreground">Past trip</span> : <StatusBadge status={trip.status} />}</div>
          <h1 className="text-5xl font-extrabold md:text-7xl">{trip.title}</h1>
          <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-primary-foreground/90">
            <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{trip.location}</span>
            <span className="inline-flex items-center gap-1"><CalendarDays className="h-4 w-4" />{formatDate(trip.start_date)} – {formatDate(trip.end_date)}</span>
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-12 px-5 pt-12 lg:grid-cols-[1fr_380px]">
        <div className="space-y-12">
          {trip.description && <p className="text-lg leading-relaxed text-foreground/85">{trip.description}</p>}
          {trip.program.length > 0 && (
            <section>
              <h2 className="text-3xl font-extrabold">Program</h2>
              <ol className="mt-6 space-y-3">
                {trip.program.map((line, i) => {
                  const m = line.match(/^(Day[^:]*):\s*(.*)$/i);
                  return (
                    <li key={i} className="flex gap-4 rounded-2xl bg-card p-5 shadow-soft">
                      <span className="shrink-0 rounded-full bg-sun px-3 py-1 text-sm font-bold text-sun-foreground">{m ? m[1] : `Day ${i + 1}`}</span>
                      <span className="pt-0.5">{m ? m[2] : line}</span>
                    </li>
                  );
                })}
              </ol>
            </section>
          )}
          {trip.included && (
            <section>
              <h2 className="text-3xl font-extrabold">What's included</h2>
              <p className="mt-4 text-lg text-foreground/85">{trip.included}</p>
            </section>
          )}
          {trip.camp_link && (
            <a href={trip.camp_link} target="_blank" rel="noreferrer" className="inline-block font-semibold text-primary underline">Visit the camp website</a>
          )}
          {trip.gallery.length > 0 && (
            <section>
              <h2 className="text-3xl font-extrabold">Gallery</h2>
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
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl bg-card p-6 shadow-soft">
            {trip.price && <p className="font-display text-3xl font-extrabold text-primary">{trip.price}</p>}
            {trip.status_note && <p className="mt-2 font-semibold text-accent">{trip.status_note}</p>}
            {requestable ? <RequestForm trip={trip} /> : (
              <p className="mt-4 text-muted-foreground">
                {past ? "This trip has already happened." : trip.status === "sold out" ? "This trip is sold out." : "Requests open soon — follow us on Instagram for updates."}
              </p>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}

function RequestForm({ trip }: { trip: Trip }) {
  const [name, setName] = useState("");
  const [people, setPeople] = useState("1");
  const n = parseInt(people, 10);
  const valid = name.trim().length > 0 && name.length <= 100 && Number.isFinite(n) && n >= 1;
  return (
    <form
      className="mt-6 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (valid) window.open(whatsappLink(trip, name.trim(), n), "_blank", "noopener");
      }}
    >
      <label className="block">
        <span className="text-sm font-semibold">Your name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} required className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">Number of people</span>
        <input type="number" min={1} value={people} onChange={(e) => setPeople(e.target.value)} required className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
      </label>
      <button disabled={!valid} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 font-bold text-accent-foreground transition hover:scale-[1.02] disabled:opacity-50">
        <MessageCircle className="h-5 w-5" /> Request via WhatsApp
      </button>
    </form>
  );
}
