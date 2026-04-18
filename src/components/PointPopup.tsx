import type { ReactNode } from "react";
import { CATEGORIES, type Point } from "../data/points";

interface Props {
  point: Point;
}

export default function PointPopup({ point }: Props) {
  const { label, color } = CATEGORIES[point.category];
  const hero = point.images?.[0];

  return (
    <div className="font-sans w-[240px]">
      {hero && (
        <img
          src={hero.src}
          alt={point.name}
          width={hero.width}
          height={hero.height}
          loading="lazy"
          className="block w-full h-[140px] object-cover mb-3 border border-ink/20"
        />
      )}
      <p
        className="font-mono text-[9px] uppercase tracking-[0.22em]"
        style={{ color }}
      >
        {label}
      </p>
      <h3 className="font-display italic text-[22px] leading-[1.05] text-ink mt-1 mb-1.5">
        {point.name}
      </h3>
      <p className="text-[13px] leading-[1.55] text-ink/80">
        {point.description}
      </p>
      {(point.wikiUrl || point.instagramUrl) && (
        <div className="mt-3 flex flex-col gap-1.5">
          {point.wikiUrl && (
            <ExternalLink href={point.wikiUrl}>
              Skaityti Wikipedia →
            </ExternalLink>
          )}
          {point.instagramUrl && (
            <ExternalLink href={point.instagramUrl}>Instagram →</ExternalLink>
          )}
        </div>
      )}
    </div>
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
