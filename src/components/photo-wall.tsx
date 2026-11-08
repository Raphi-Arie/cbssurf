import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { TripPhoto } from "@/lib/sheets";

export function PhotoWall({ photos }: { photos: TripPhoto[] }) {
  const [items, setItems] = useState(photos);
  const [limit, setLimit] = useState(24);
  const [active, setActive] = useState<number | null>(null);
  useEffect(() => {
    const shuffled = [...photos];
    for (let i = shuffled.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const a = shuffled[i], b = shuffled[j]; if (a && b) { shuffled[i] = b; shuffled[j] = a; } }
    setItems(shuffled);
  }, [photos]);
  const move = (direction: number) => setActive((index) => index === null || !items.length ? null : (index + direction + items.length) % items.length);
  const photo = active === null ? undefined : items[active];
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (event: React.TouchEvent) => { const touch = event.touches[0]; if (touch) touchStart.current = { x: touch.clientX, y: touch.clientY }; };
  const onTouchEnd = (event: React.TouchEvent) => { const touch = event.changedTouches[0]; const start = touchStart.current; if (touch && start) { const dx = touch.clientX - start.x; const dy = touch.clientY - start.y; if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1); } touchStart.current = null; };
  return <>
    <div className="columns-2 gap-3 lg:columns-3">{items.slice(0, limit).map((item, i) => <Button key={`${item.src}-${i}`} variant="ghost" className="mb-3 block h-auto w-full break-inside-avoid overflow-hidden rounded-lg p-0" onClick={() => setActive(i)} aria-label={`Open ${item.trip} photo ${i + 1}`}><img src={item.src} alt={`${item.trip} impression`} loading="lazy" className="h-auto w-full transition duration-300 hover:scale-105" /></Button>)}</div>
    {limit < items.length && <div className="mt-8 text-center"><Button variant="outline" onClick={() => setLimit(limit + 24)}>Show more</Button></div>}
    <Dialog open={active !== null} onOpenChange={(open) => { if (!open) setActive(null); }}><DialogContent className="h-[100dvh] max-w-none rounded-none border-0 bg-ocean-deep p-5 text-primary-foreground sm:rounded-none" onKeyDown={(e) => { if (e.key === "ArrowLeft") move(-1); if (e.key === "ArrowRight") move(1); }} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <DialogTitle className="pr-10">{photo?.trip}</DialogTitle><DialogDescription className="sr-only">Trip photo viewer</DialogDescription>
      {photo && <img src={photo.src} alt={photo.trip} className="h-[75dvh] w-full object-contain" />}
      <div className="flex items-center justify-center gap-6"><Button variant="secondary" size="icon" aria-label="Previous photo" onClick={() => move(-1)}><ChevronLeft /></Button><span>{active === null ? 0 : active + 1} / {items.length}</span><Button variant="secondary" size="icon" aria-label="Next photo" onClick={() => move(1)}><ChevronRight /></Button></div>
    </DialogContent></Dialog>
  </>;
}