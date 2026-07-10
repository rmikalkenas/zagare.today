import { Fragment, useState, type ReactNode } from "react";
import type { FestivalPoint } from "../data/festival";

interface Props {
  point: FestivalPoint;
}

export default function FestivalPopup({ point }: Props) {
  const images = point.images ?? [];
  const [index, setIndex] = useState(0);
  const current = images[index];
  const hasMany = images.length > 1;

  const schedule = point.schedule ?? [];
  const hasSchedule = schedule.length > 0;

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div className={`font-sans ${hasSchedule ? "w-[288px]" : "w-[240px]"}`}>
      {current && (
        <div className="relative mb-3">
          <img
            src={current.src}
            alt={point.name}
            width={current.width}
            height={current.height}
            loading="lazy"
            className="block w-full h-[140px] object-cover border border-ink/20"
          />
          {hasMany && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Ankstesnė nuotrauka"
                className="absolute top-1/2 left-1.5 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center bg-paper/90 text-ink border border-ink/25 transition-colors hover:bg-paper focus-visible:bg-paper"
              >
                <Chevron direction="left" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Kita nuotrauka"
                className="absolute top-1/2 right-1.5 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center bg-paper/90 text-ink border border-ink/25 transition-colors hover:bg-paper focus-visible:bg-paper"
              >
                <Chevron direction="right" />
              </button>
              <span className="absolute bottom-1.5 right-1.5 inline-flex items-center bg-paper/90 text-ink border border-ink/25 px-1.5 py-0.5 font-mono text-[10px] tabular-nums tracking-[0.18em] uppercase">
                {String(index + 1).padStart(2, "0")} /{" "}
                {String(images.length).padStart(2, "0")}
              </span>
            </>
          )}
        </div>
      )}
      <h3 className="font-display italic text-[22px] leading-[1.05] text-ink mb-1.5">
        {point.name}
      </h3>
      {point.description && (
        <p className="text-[13px] leading-[1.55] text-ink/80">
          {point.description}
        </p>
      )}
      {hasSchedule && (
        <div className="mt-1 flex flex-col gap-3.5 max-h-[300px] overflow-y-auto pr-1">
          {schedule.map((d) => (
            <div key={d.day}>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand-600 pb-1.5 border-b border-ink/15">
                {d.day}
              </p>
              <div className="mt-2.5 grid grid-cols-[auto_1fr] gap-x-3 gap-y-2.5 items-baseline">
                {d.items.map((it, i) =>
                  it.heading ? (
                    <p
                      key={i}
                      className="col-span-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft mt-1.5 first:mt-0"
                    >
                      {it.text}
                    </p>
                  ) : (
                    <Fragment key={i}>
                      <span className="font-mono text-[12px] tabular-nums text-ink-soft whitespace-nowrap">
                        {it.time}
                      </span>
                      <span className="text-[14px] leading-[1.4] text-ink">
                        {it.text}
                      </span>
                    </Fragment>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {(point.wikiUrl ||
        point.instagramUrl ||
        point.facebookUrl ||
        point.links?.length) && (
        <div className="mt-3 flex flex-col gap-1.5">
          {point.links?.map((l) => (
            <ExternalLink key={l.href} href={l.href}>
              {l.label} →
            </ExternalLink>
          ))}
          {point.wikiUrl && (
            <ExternalLink href={point.wikiUrl}>
              Skaityti Wikipedia →
            </ExternalLink>
          )}
          {point.instagramUrl && (
            <ExternalLink href={point.instagramUrl}>Instagram →</ExternalLink>
          )}
          {point.facebookUrl && (
            <ExternalLink href={point.facebookUrl}>Facebook →</ExternalLink>
          )}
        </div>
      )}
    </div>
  );
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={direction === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
    </svg>
  );
}

function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="meta-link"
    >
      {children}
    </a>
  );
}
