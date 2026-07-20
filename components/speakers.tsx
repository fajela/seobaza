import Link from "next/link";
import { getAllKgPeople } from "@/lib/kg";

/**
 * Speaker cards for event pages, conference-site style: photo, name,
 * role · company. Data comes from the KG person profiles by their sb-ids.
 * MDX attributes here only carry strings (same as Carousel), so the ids come
 * pipe-separated. Usage in MDX: <Speakers ids="sb0002|sb0003" />
 */
export function Speakers({ ids }: { ids: string }) {
  const wanted = (ids ?? "").split("|").map((s) => s.trim()).filter(Boolean);
  const people = getAllKgPeople().filter((p) => wanted.includes(p.kgId));
  const ordered = wanted
    .map((id) => people.find((p) => p.kgId === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="not-prose grid grid-cols-2 lg:grid-cols-4 gap-4 my-6">
      {ordered.map((p) => (
        <Link key={p.kgId} href={`/kg/person/${p.kgId}`} className="group block">
          <div className="h-full rounded-xl border border-border bg-secondary/20 overflow-hidden group-hover:border-accent/60 group-hover:bg-secondary/40 transition-all">
            {p.image ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={p.image}
                srcSet={`/_next/image?url=${encodeURIComponent(p.image)}&w=384&q=75 1x, /_next/image?url=${encodeURIComponent(p.image)}&w=750&q=75 2x`}
                alt={p.name}
                width={384}
                height={384}
                loading="lazy"
                className="aspect-square w-full object-cover"
              />
            ) : (
              <div className="aspect-square w-full bg-accent/20 flex items-center justify-center text-accent font-display text-5xl">
                {p.name.charAt(0)}
              </div>
            )}
            <div className="p-4">
              <h3 className="font-display text-base leading-snug group-hover:text-accent transition-colors">
                {p.name}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground leading-snug">
                {p.role}
                {p.company ? `, ${p.company}` : ""}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
