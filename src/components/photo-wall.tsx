import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { TripPhoto } from "@/lib/sheets";
import { PHOTO_PAGE_SIZE } from "@/lib/previews";

export function PhotoWall({ photos }: { photos: TripPhoto[] }) {
  // Photos arrive pre-mixed by pastPhotos (round-robin across trips); keep that order so the
  // wall stays balanced and SSR-consistent.
  const items = photos;
  const [limit, setLimit] = useState(PHOTO_PAGE_SIZE);
  const [active, setActive] = useState<number | null>(null);
  const move = (direction: number) => setActive((index) => index === null || !items.length ? null : (index + direction + items.length) % items.length);
  const photo = active === null ? undefined : items[active];
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (event: React.TouchEvent) => { const touch = event.touches[0]; if (touch) touchStart.current = { x: touch.clientX, y: touch.clientY }; };
  const onTouchEnd = (event: React.TouchEvent) => { const touch = event.changedTouches[0]; const start = touchStart.current; if (touch && start) { const dx = touch.clientX - start.x; const dy = touch.clientY - start.y; if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1); } touchStart.current = null; };
  return <>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{items.slice(0, limit).map((item, i) => <Button key={`${item.src}-${i}`} variant="ghost" className="block aspect-[4/3] h-auto w-full overflow-hidden rounded-lg p-0" onClick={() => setActive(i)} aria-label={`Open ${item.trip} photo ${i + 1}`}><img src={item.src} alt={`${item.trip} impression`} loading="lazy" className="h-full w-full object-cover transition duration-300 hover:scale-105" /></Button>)}</div>
    {limit < items.length && <div className="mt-8 text-center"><Button variant="outline" onClick={() => setLimit((current) => current + PHOTO_PAGE_SIZE)}>Show more</Button></div>}
    <Dialog open={active !== null} onOpenChange={(open) => { if (!open) setActive(null); }}><DialogContent className="h-[100dvh] max-w-none rounded-none border-0 bg-ocean-deep p-5 text-primary-foreground sm:rounded-none" onKeyDown={(e) => { if (e.key === "ArrowLeft") move(-1); if (e.key === "ArrowRight") move(1); }} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <DialogTitle className="pr-10">{photo?.trip}</DialogTitle><DialogDescription className="sr-only">Trip photo viewer</DialogDescription>
      {photo && <img src={photo.src} alt={photo.trip} className="h-[75dvh] w-full object-contain" />}
      <div className="flex items-center justify-center gap-6"><Button variant="secondary" size="icon" aria-label="Previous photo" onClick={() => move(-1)}><ChevronLeft /></Button><span>{active === null ? 0 : active + 1} / {items.length}</span><Button variant="secondary" size="icon" aria-label="Next photo" onClick={() => move(1)}><ChevronRight /></Button></div>
    </DialogContent></Dialog>
  </>;
}