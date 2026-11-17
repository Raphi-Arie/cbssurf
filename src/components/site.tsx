import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Instagram, Menu, X, CalendarDays, MapPin, MessageCircle } from "lucide-react";
import { contactLink, INSTAGRAM_URL, formatDateRange, formatMonthRange, type Trip } from "@/lib/sheets";

import { Button } from "@/components/ui/button";

const logoUrl =
  "https://res.cloudinary.com/ugtwklc6/image/upload/f_auto,q_auto,w_160/v1794162612/332920328_608070644495587_1136323830952893030_n.jpg";

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <img src={logoUrl} alt="CBS Surf logo" className="h-10 w-10 shrink-0 rounded-full object-cover" />
      <span className={`font-display text-xl font-extrabold tracking-tight ${dark ? "text-primary-foreground" : "text-foreground"}`}>CBS Surf</span>
    </span>
  );
}

const nav = [
  { to: "/trips", label: "Trips" },
  { to: "/past-trips", label: "Past trips" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/about", label: "About us" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <>
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link to="/" aria-label="CBS Surf home">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="inline-flex h-9 items-center rounded-full px-4 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              inactiveProps={{ className: "text-foreground/80 hover:bg-secondary hover:text-ocean" }}
              activeProps={{ className: "bg-accent text-accent-foreground" }}
            >
              {n.label}
            </Link>
          ))}
        <Button asChild className="ml-3 rounded-full bg-primary text-primary-foreground hover:bg-primary-hover"><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"><Instagram />Contact us</a></Button>
        </nav>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label={open ? "Close menu" : "Menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </Button>
      </div>
    </header>
    {open && (
      <nav className="fixed inset-0 z-50 flex flex-col bg-background px-5 pb-8 pt-4 lg:hidden">
        <div className="flex items-center justify-between">
          <Logo />
          <Button variant="ghost" size="icon" aria-label="Close menu" onClick={() => setOpen(false)}>
            <X />
          </Button>
        </div>
        <div className="mt-8 flex flex-col items-start gap-1">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="inline-flex items-center rounded-full px-4 py-2 text-2xl font-bold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              activeProps={{ className: "bg-accent text-accent-foreground" }}
            >
              {n.label}
            </Link>
          ))}
        </div>
        <Button asChild className="mt-auto h-12 rounded-full bg-primary text-base font-bold text-primary-foreground hover:bg-primary-hover"><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"><Instagram />Contact us</a></Button>
      </nav>
    )}
    </>
  );
}

export function Footer({ whatsappNumber }: { whatsappNumber?: string }) {
  const contactUrl = contactLink(whatsappNumber);
  return (
    <footer className="mt-16 bg-ocean-deep text-primary-foreground md:mt-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.2fr_1fr_1fr] md:py-16">
        <div>
          <Logo dark />
          <p className="mt-4 max-w-xs text-footer-muted">Surf trips with friends. Salt, sun & good people.</p>
          <div className="mt-6 flex gap-3">
            <a href={contactUrl} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent text-accent-foreground transition hover:bg-sand-hover">
              <MessageCircle className="h-5 w-5" />
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent text-accent-foreground transition hover:bg-sand-hover">
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
        <nav aria-label="Footer">
          <p className="text-sm font-bold uppercase tracking-wider text-footer-muted">Explore</p>
          <ul className="mt-4 space-y-2.5">
            {nav.map((n) => (
              <li key={n.to}><Link to={n.to} className="font-medium text-footer-muted transition hover:text-primary-foreground">{n.label}</Link></li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-footer-muted">Legal</p>
          <ul className="mt-4 space-y-2.5">
            <li><Link to="/privacy" className="font-medium text-footer-muted transition hover:text-primary-foreground">Privacy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 px-5 py-5 text-center text-sm text-footer-muted">CBS Surf — chase waves, find your crew.</div>
    </footer>
  );
}

export function StatusBadge({ status }: { status: Trip["status"] }) {
  const cls =
    status === "open"
      ? "bg-success text-success-foreground"
      : status === "sold out"
        ? "bg-danger text-danger-foreground"
        : "bg-warning text-warning-foreground";
  return <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${cls}`}>{status}</span>;
}

export function TripCard({ trip, past = false, compact = false }: { trip: Trip; past?: boolean; compact?: boolean }) {
  const image = trip.image_url || (past ? trip.gallery[0] : "");
  return (
    <Link to="/trips/$id" params={{ id: trip.id }} className={`group overflow-hidden rounded-3xl bg-card shadow-soft transition hover:-translate-y-1 ${past ? "opacity-80" : ""}`}>
      <div className={`relative overflow-hidden ${compact ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
        {image ? <img src={image} alt={trip.title} loading="lazy" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center bg-muted p-6 text-center text-lg font-bold text-muted-foreground">{trip.location}</div>}
        {!past && <div className="absolute left-4 top-4"><StatusBadge status={trip.status} /></div>}
      </div>
      <div className={compact ? "p-3 md:p-4" : "p-6"}>
        <h3 className={compact ? "break-words text-base font-bold md:text-lg" : "text-2xl font-bold"}>{trip.title}</h3>
        <p className={`mt-2 flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground ${compact ? "text-xs md:text-sm" : "text-sm"}`}>
          <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{trip.location}</span>
          <span className="inline-flex items-center gap-1"><CalendarDays className="h-4 w-4" />{past ? formatMonthRange(trip.start_date, trip.end_date) : formatDateRange(trip.start_date, trip.end_date)}</span>
        </p>
        {!compact && trip.short_description && <p className="mt-3 text-foreground/80">{trip.short_description}</p>}
        {!past && trip.status_note && <p className="mt-3 text-sm font-semibold text-ocean">{trip.status_note}</p>}
        {!past && trip.price && <p className="mt-4 font-display text-lg font-bold text-primary">{trip.price}</p>}
      </div>
    </Link>
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
