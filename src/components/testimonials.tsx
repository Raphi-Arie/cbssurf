import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Testimonial } from "@/lib/sheets";

function TravelerPhoto({ name, url }: { name: string; url: string }) {
  const [failed, setFailed] = useState(false);
  return url && !failed ? (
    <img src={url} alt={name} onError={() => setFailed(true)} loading="lazy" className="h-20 w-20 shrink-0 rounded-full object-cover ring-4 ring-background md:h-24 md:w-24" />
  ) : (
    <span aria-label={name} className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-sun font-display text-3xl font-bold text-sun-foreground ring-4 ring-background md:h-24 md:w-24">{Array.from(name.trim())[0]?.toUpperCase() || "?"}</span>
  );
}

export function Testimonials({ items }: { items: Testimonial[] }) {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [touching, setTouching] = useState(false);
  const [focused, setFocused] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const count = items.length;
  const selected = count ? active % count : 0;
  const paused = hovered || touching || focused;
  const move = (direction: number) => setActive((current) => (current + direction + count) % count);

  useEffect(() => {
    if (paused || count < 2) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % count), 6000);
    return () => window.clearInterval(timer);
  }, [paused, count, active]);

  if (!count) return null;
  return (
    <section aria-labelledby="testimonials-heading" aria-roledescription="carousel" className="sand-highlight border-b border-border bg-accent py-10 md:py-12"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
      onTouchStart={(event) => { const touch = event.touches[0]; if (touch) touchStart.current = { x: touch.clientX, y: touch.clientY }; setTouching(true); }}
      onTouchEnd={(event) => { const touch = event.changedTouches[0]; const start = touchStart.current; if (touch && start) { const dx = touch.clientX - start.x; const dy = touch.clientY - start.y; if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1); } touchStart.current = null; setTouching(false); }}
      onTouchCancel={() => { touchStart.current = null; setTouching(false); }}>
      <div className="mx-auto max-w-3xl px-5 text-center">
        <h2 id="testimonials-heading" className="text-2xl font-bold md:text-3xl">What our travelers say</h2>
        <Quote aria-hidden="true" className="mx-auto mb-3 mt-6 h-6 w-6 text-ocean" />
        <div className="grid" aria-live={paused ? "polite" : "off"}>
          {items.map((item, index) => (
            <figure key={`${item.order}-${item.name}-${index}`} aria-hidden={index !== selected} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${count}`} className={`col-start-1 row-start-1 flex min-w-0 flex-col items-center justify-between gap-6 px-2 md:px-10 ${index === selected ? "visible" : "invisible"}`}>
              <blockquote className="max-w-xl whitespace-pre-line break-words font-display text-lg font-medium leading-relaxed text-ocean-deep md:text-xl">“{item.quote}”</blockquote>
              <figcaption className="flex max-w-full flex-col items-center gap-3">
                <TravelerPhoto name={item.name} url={item.photo_url} />
                <div className="max-w-full"><p className="break-words text-sm font-semibold">{item.name}</p>{item.trip && <p className="mt-1 break-words text-xs text-muted-foreground">{item.trip}</p>}</div>
              </figcaption>
            </figure>
          ))}
        </div>
        {count > 1 && <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button variant="ghost" size="icon" className="shrink-0 rounded-full text-muted-foreground" aria-label="Previous testimonial" title="Previous testimonial" onClick={() => move(-1)}><ArrowLeft /></Button>
          <div className="flex max-w-full flex-wrap justify-center">
            {items.map((item, index) => <Button key={index} variant="ghost" size="icon" className="h-8 w-7 rounded-full hover:bg-transparent focus-visible:bg-secondary" aria-label={`Show testimonial ${index + 1}`} title={item.name} aria-pressed={selected === index} onClick={() => setActive(index)}><span className={`h-2 w-2 rounded-full ${selected === index ? "bg-ocean" : "bg-muted-foreground"}`} /></Button>)}
          </div>
          <Button variant="ghost" size="icon" className="shrink-0 rounded-full text-muted-foreground" aria-label="Next testimonial" title="Next testimonial" onClick={() => move(1)}><ArrowRight /></Button>
        </div>}
      </div>
    </section>
  );
}