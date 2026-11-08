import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Instagram, Menu, X, CalendarDays, MapPin, MessageCircle } from "lucide-react";
import { formatDate, formatDateRange, formatMonth, type NewsItem, type Trip } from "@/lib/sheets";

import { Button } from "@/components/ui/button";

export const contactUrl = "https://wa.me/4915735462749?text=" + encodeURIComponent("Hi Jonas! I have a question about CBS Surf.");

const nav = [
  { to: "/trips", label: "Trips" },
  { to: "/past-trips", label: "Past trips" },
  { to: "/stories", label: "Stories" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/about", label: "About us" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link to="/" className="font-display text-2xl font-extrabold text-ocean-deep">
          CBS<span className="text-accent">.</span>surf
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="font-medium text-foreground/80 hover:text-primary" activeProps={{ className: "text-primary" }}>
              {n.label}
            </Link>
          ))}
        <Button asChild className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90"><a href={contactUrl} target="_blank" rel="noreferrer"><MessageCircle />Contact us</a></Button>
        </nav>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label={open ? "Close menu" : "Menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t border-border px-5 py-3 lg:hidden">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-2 text-lg font-medium">
              {n.label}
            </Link>
          ))}
          <Button asChild className="mt-2 bg-accent text-accent-foreground"><a href={contactUrl} target="_blank" rel="noreferrer">Contact us</a></Button>
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
        <div className="flex flex-wrap gap-3"><Button asChild variant="secondary"><a href={contactUrl} target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp</a></Button>
        <a href="https://instagram.com/cbs.surf" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-5 py-3 font-medium hover:bg-primary-foreground/20">
          <Instagram className="h-5 w-5" /> @cbs.surf
        </a></div>
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
  const image = trip.image_url || (past ? trip.gallery[0] : "");
  return (
    <Link to="/trips/$id" params={{ id: trip.id }} className={`group overflow-hidden rounded-3xl bg-card shadow-soft transition hover:-translate-y-1 ${past ? "opacity-75" : ""}`}>
      <div className="relative aspect-[4/3] overflow-hidden">
        {image ? <img src={image} alt={trip.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center bg-muted p-6 text-center text-lg font-bold text-muted-foreground">{trip.location}</div>}
        {!past && <div className="absolute left-4 top-4"><StatusBadge status={trip.status} /></div>}
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold">{trip.title}</h3>
        <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{trip.location}</span>
          <span className="inline-flex items-center gap-1"><CalendarDays className="h-4 w-4" />{past ? formatMonth(trip.start_date) : formatDateRange(trip.start_date, trip.end_date)}</span>
        </p>
        {trip.short_description && <p className="mt-3 text-foreground/80">{trip.short_description}</p>}
        {!past && trip.status_note && <p className="mt-3 text-sm font-semibold text-accent">{trip.status_note}</p>}
        {!past && trip.price && <p className="mt-4 font-display text-lg font-bold text-primary">{trip.price}</p>}
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
