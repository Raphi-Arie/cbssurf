import { useEffect, useRef, useState } from "react";
import { statTarget, type Stat } from "@/lib/sheets";

function StatNumber({ value, compact = false }: { value: string; compact?: boolean }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [display, setDisplay] = useState(value);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      observer.disconnect();
      setVisible(true);
      const target = statTarget(value);
      if (target === null || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / 1100, 1);
        setDisplay(progress === 1 ? value : String(Math.round(target * (1 - Math.pow(1 - progress, 3)))));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.25 });
    observer.observe(element);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [value]);
  return <p ref={ref} aria-label={value} className={`stat-number break-words font-display font-extrabold text-primary transition duration-700 motion-reduce:transition-none ${compact ? "text-3xl leading-tight md:text-4xl" : "min-h-12 text-3xl md:min-h-16 md:text-5xl"} ${visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}><span aria-hidden="true">{display}</span></p>;
}
export function StatsGrid({ stats, compact = false }: { stats: Stat[]; compact?: boolean }) {
  return <div className={compact ? "grid grid-cols-2 gap-y-6 sm:flex sm:justify-center" : "grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4"}>{stats.map((stat, i) => <div key={`${stat.label}-${i}`} className={compact ? "min-w-0 flex-1 px-3 text-center sm:border-l sm:border-border sm:px-5 sm:first:border-l-0" : "min-w-0 text-center"}><StatNumber value={stat.number} compact={compact} /><p className={compact ? "mt-1 text-sm font-semibold" : "mt-2 font-bold"}>{stat.label}</p>{stat.note && <p className={compact ? "mx-auto mt-1 max-w-48 text-xs leading-relaxed text-muted-foreground" : "mt-2 text-sm text-muted-foreground"}>{stat.note}</p>}</div>)}</div>;
}