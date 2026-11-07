import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Instagram, Menu, X, CalendarDays, MapPin } from "lucide-react";
import { formatDate, type NewsItem, type Trip } from "@/lib/sheets";

const nav = [
  { to: "/trips", label: "Trips" },
  { to: "/news", label: "News" },
  { to: "/about", label: "About us" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="font-display text-2xl font-extrabold text-ocean-deep">
          CBS<span className="text-accent">.</span>surf
        </Link>
        <nav className="hidden gap-8 md:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="font-medium text-foreground/80 hover:text-primary" activeProps={{ className: "text-primary" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <button className="md:hidden" aria-label="Menu" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t border-border px-5 py-3 md:hidden">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-2 text-lg font-medium">
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 bg-ocean-deep text-primary-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-12 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-2xl font-extrabold">CBS<span className="text-sun">.</span>surf</p>
          <p className="mt-1 text-primary-foreground/70">Surf trips with friends. Salt, sun & good people.</p>
        </div>
        <a href="https://instagram.com/cbs.surf" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-5 py-3 font-medium hover:bg-primary-foreground/20">
          <Instagram className="h-5 w-5" /> @cbs.surf
        </a>
      </div>
    </footer>
  );
}

export function StatusBadge({ status }: { status: Trip["status"] }) {
  const cls =
    status === "open"
      ? "bg-primary text-primary-foreground"
      : status === "sold out"
        ? "bg-accent text-accent-foreground"
        : "bg-sun text-sun-foreground";
  return <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${cls}`}>{status}</span>;
}

export function TripCard({ trip, past = false }: { trip: Trip; past?: boolean }) {
  return (
    <Link to="/trips/$id" params={{ id: trip.id }} className={`group overflow-hidden rounded-3xl bg-card shadow-soft transition hover:-translate-y-1 ${past ? "opacity-75" : ""}`}>
      <div className="relative aspect-[4/3] overflow-hidden">
        {trip.image_url && <img src={trip.image_url} alt={trip.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />}
        {!past && <div className="absolute left-4 top-4"><StatusBadge status={trip.status} /></div>}
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold">{trip.title}</h3>
        <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{trip.location}</span>
          <span className="inline-flex items-center gap-1"><CalendarDays className="h-4 w-4" />{formatDate(trip.start_date)} – {formatDate(trip.end_date)}</span>
        </p>
        {trip.short_description && <p className="mt-3 text-foreground/80">{trip.short_description}</p>}
        {!past && trip.status_note && <p className="mt-3 text-sm font-semibold text-accent">{trip.status_note}</p>}
        {trip.price && <p className="mt-4 font-display text-lg font-bold text-primary">{trip.price}</p>}
      </div>
    </Link>
  );
}

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="overflow-hidden rounded-3xl bg-card shadow-soft">
      {item.image_url && <img src={item.image_url} alt={item.title} loading="lazy" className="aspect-[16/10] w-full object-cover" />}
      <div className="p-6">
        <time className="text-xs font-semibold uppercase tracking-wider text-accent">{formatDate(item.date)}</time>
        <h3 className="mt-2 text-xl font-bold">{item.title}</h3>
        <p className="mt-2 text-foreground/80">{item.text}</p>
      </div>
    </article>
  );
}

export function LoadError({ error }: { error: unknown }) {
  return (
    <div role="alert" className="mx-auto max-w-xl px-5 py-24 text-center">
      <h1 className="text-3xl font-bold">The waves are flat right now</h1>
      <p className="mt-2 text-muted-foreground">{error instanceof Error ? error.message : "Content couldn't load."} Please refresh.</p>
    </div>
  );
}
