import { useEffect, useRef, useState } from "react";
import { statTarget, type Stat } from "@/lib/sheets";

function StatNumber({ value }: { value: string }) {
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
  return <p ref={ref} aria-label={value} className={`stat-number min-h-10 break-words font-display text-2xl font-extrabold leading-tight text-ocean transition duration-700 motion-reduce:transition-none sm:min-h-16 sm:text-5xl ${visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}><span aria-hidden="true">{display}</span></p>;
}
export function StatsGrid({ stats }: { stats: Stat[] }) {
  return <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-y-14">{stats.map((stat, i) => <div key={`${stat.label}-${i}`} className={`min-w-0 text-center ${stats.length % 2 === 1 && i === stats.length - 1 ? "col-span-2 mx-auto w-1/2" : ""}`}><StatNumber value={stat.number} /><p className="mt-4 text-sm font-bold sm:mt-5 sm:text-lg">{stat.label}</p>{stat.note && <p className="mx-auto mt-2 max-w-56 text-sm text-muted-foreground">{stat.note}</p>}</div>)}</div>;
}