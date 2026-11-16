import { useEffect, useRef, useState } from "react";
import type { TeamMember } from "@/lib/sheets";

function MemberPhoto({ name, url }: { name: string; url: string }) {
  const [failed, setFailed] = useState(false);
  const img = useRef<HTMLImageElement>(null);
  // A server-rendered image can fail before React hydrates and attaches onError.
  useEffect(() => {
    const el = img.current;
    if (el?.complete && el.naturalWidth === 0) setFailed(true);
  }, [url]);
  return url && !failed ? (
    <img
      ref={img}
      src={url}
      alt={name}
      onError={() => setFailed(true)}
      loading="lazy"
      width={128}
      height={128}
      className="mx-auto h-32 w-32 rounded-full object-cover"
    />
  ) : (
    <div
      className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-secondary font-display text-5xl font-bold text-ocean"
      role="img"
      aria-label={name}
    >
      {Array.from(name.trim())[0]?.toUpperCase() || "?"}
    </div>
  );
}

export function Team({ members }: { members: TeamMember[] }) {
  if (!members.length) return null;
  return (
    <section aria-labelledby="team-heading" className="mx-auto max-w-6xl px-5 py-12 md:py-16">
      <h2 id="team-heading" className="mb-10 text-3xl font-extrabold md:text-4xl">
        The team
      </h2>
      {/* Flex-wrap instead of grid so an incomplete last row stays centred: 1 / 2 / 3 per row. */}
      <div className="flex flex-wrap justify-center gap-8">
        {members.map((m, i) => (
          <article
            key={`${m.order}-${m.name}-${i}`}
            className="w-full rounded-3xl bg-card p-6 text-center shadow-soft sm:w-[calc((100%_-_2rem)/2)] lg:w-[calc((100%_-_4rem)/3)]"
          >
            <MemberPhoto name={m.name} url={m.photo_url} />
            <h3 className="mt-6 break-words text-2xl font-bold">{m.name}</h3>
            {m.role && <p className="mt-1 font-semibold text-ocean">{m.role}</p>}
            {m.intro && (
              <p className="mt-3 whitespace-pre-line break-words text-muted-foreground">
                {m.intro}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
