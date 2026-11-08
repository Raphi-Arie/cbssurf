import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Testimonial } from "@/lib/sheets";

function TravelerPhoto({ name, url }: { name: string; url: string }) {
  const [failed, setFailed] = useState(false);
  return url && !failed ? (
    <img src={url} alt={name} onError={() => setFailed(true)} loading="lazy" className="h-14 w-14 shrink-0 rounded-full object-cover" />
  ) : (
    <span aria-label={name} className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sun font-display text-xl font-bold text-sun-foreground">{Array.from(name.trim())[0]?.toUpperCase() || "?"}</span>
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
    <section aria-labelledby="testimonials-heading" aria-roledescription="carousel" className="border-b border-border bg-secondary/30 py-16 md:py-20"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
      onTouchStart={(event) => { const touch = event.touches[0]; if (touch) touchStart.current = { x: touch.clientX, y: touch.clientY }; setTouching(true); }}
      onTouchEnd={(event) => { const touch = event.changedTouches[0]; const start = touchStart.current; if (touch && start) { const dx = touch.clientX - start.x; const dy = touch.clientY - start.y; if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1); } touchStart.current = null; setTouching(false); }}
      onTouchCancel={() => { touchStart.current = null; setTouching(false); }}>
      <div className="mx-auto max-w-5xl px-5 text-center">
        <h2 id="testimonials-heading" className="text-3xl font-extrabold md:text-4xl">What our travelers say</h2>
        <Quote aria-hidden="true" className="mx-auto mb-4 mt-8 h-9 w-9 text-accent" />
        <div className="grid" aria-live={paused ? "polite" : "off"}>
          {items.map((item, index) => (
            <figure key={`${item.order}-${item.name}-${index}`} aria-hidden={index !== selected} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${count}`} className={`col-start-1 row-start-1 flex min-w-0 flex-col items-center justify-between gap-8 px-2 md:px-12 ${index === selected ? "visible" : "invisible"}`}>
              <blockquote className="max-w-3xl whitespace-pre-line break-words font-display text-2xl font-medium leading-relaxed text-ocean-deep md:text-3xl">“{item.quote}”</blockquote>
              <figcaption className="flex max-w-full flex-col items-center gap-3">
                <TravelerPhoto name={item.name} url={item.photo_url} />
                <p className="break-words font-semibold">{item.name}{item.trip && <span className="font-normal text-muted-foreground"> · {item.trip}</span>}</p>
              </figcaption>
            </figure>
          ))}
        </div>
        {count > 1 && <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button variant="outline" size="icon" className="shrink-0 rounded-full" aria-label="Previous testimonial" title="Previous testimonial" onClick={() => move(-1)}><ArrowLeft /></Button>
          <div className="flex max-w-full flex-wrap justify-center">
            {items.map((item, index) => <Button key={index} variant="ghost" size="icon" className="h-8 w-8 rounded-full" aria-label={`Show testimonial ${index + 1}`} title={item.name} aria-pressed={selected === index} onClick={() => setActive(index)}><span className={`h-2.5 w-2.5 rounded-full ${selected === index ? "bg-primary" : "bg-border"}`} /></Button>)}
          </div>
          <Button variant="outline" size="icon" className="shrink-0 rounded-full" aria-label="Next testimonial" title="Next testimonial" onClick={() => move(1)}><ArrowRight /></Button>
        </div>}
      </div>
    </section>
  );
}