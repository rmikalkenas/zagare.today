import type { ImageMetadata } from "astro";

import laisvamaniuScena from "../assets/laisvamaniu-scena.webp";
import zygisPoZagare from "../assets/zygis-po-zagare.webp";
import zygisSvete from "../assets/zygis-svete.webp";

export interface EventItem {
  /** Path on this site, e.g. "/zygis-svete". Also used as the React key. */
  href: string;
  name: string;
  /** ISO 8601 with offset. Drives the upcoming / past split. */
  startDate: string;
  /** ISO 8601 with offset. Omit for single-moment events. */
  endDate?: string;
  /** Lithuanian human-readable date + time, as shown on the event page. */
  dateLabel: string;
  location: string;
  /** One or two sentences for the index card. */
  summary: string;
  /** Hero illustration. Optional - the index card falls back to a placeholder. */
  image?: ImageMetadata;
  imageAlt?: string;
}

/** Newest first. Both sections on /renginiai preserve this order. */
export const EVENTS: EventItem[] = [
  {
    href: "/zygis-po-zagare",
    name: "Šiltnamis. Žygis po Žagarę ir jos apylinkes",
    startDate: "2026-09-20T15:30:00+03:00",
    dateLabel: "Rugsėjo 20 d., 15.30 val.",
    location: "Žagarės miesto aikštė",
    summary:
      "Patirtinis žygis po miestą su istorike Alma Kančialskiene, žiemgalių skonių edukacija prie Žvelgaičio kalno ir krašto produktų degustacija. Nemokama, būtina registracija.",
    image: zygisPoZagare,
    imageAlt:
      "Iliustracija - žalio šiltnamio kontūras, gaubiantis Žagarės kraštovaizdį su balta raudonstoge bažnyčia, upe, tilteliu ir medžiais.",
  },
  {
    href: "/zygis-svete",
    name: "Žygis Švėtės dugnu",
    startDate: "2026-07-18T12:00:00+03:00",
    dateLabel: "Liepos 18 d., 12.00 val.",
    location: "Uolos g. pabaiga, Žagarė",
    summary:
      "Žygis pačia Švėtės upės vaga su gidu Žygimantu Ruškiu - brendant vandeniu per miestelio vidurį. Nemokamas, būtina registracija.",
    image: zygisSvete,
    imageAlt:
      "Iliustracija - Švėtės upė vingiuoja žalios S formos vaga su gandru, antimis, arkliu ir karklais.",
  },
  {
    href: "/laisvamaniu-scena",
    name: "Laisvamanių scena",
    startDate: "2026-07-18T20:00:00+03:00",
    dateLabel: "Liepos 18 d., 20.00 val.",
    location: "Rekreacinė zona prie Žvelgaičių ežero, Žagarė",
    summary:
      "Elektroninės muzikos vakaras Žagarės paplūdimyje - smėlis, vanduo ir muzika iki saulėtekio. Patekimas su „Vyšnių festivalio“ bilietu.",
    image: laisvamaniuScena,
    imageAlt:
      "Iliustracija - dvi vyšnios, kurių vaisiai pavaizduoti kaip vinilo plokštelės, žaliais koteliais ir lapu.",
  },
];

/**
 * An event counts as past once its end (or start, when there is no end) has
 * gone by. Evaluated at BUILD time - a site that is not rebuilt will keep
 * showing a finished event under "Artimiausi". See CLAUDE.md.
 */
export function splitEvents(now: Date = new Date()): {
  upcoming: EventItem[];
  past: EventItem[];
} {
  const upcoming: EventItem[] = [];
  const past: EventItem[] = [];

  for (const event of EVENTS) {
    const ends = new Date(event.endDate ?? event.startDate);
    (ends.getTime() >= now.getTime() ? upcoming : past).push(event);
  }

  // Soonest first when they are still ahead, most recent first once they are
  // history.
  upcoming.sort((a, b) => a.startDate.localeCompare(b.startDate));
  past.sort((a, b) => b.startDate.localeCompare(a.startDate));

  return { upcoming, past };
}

/** "2026 07 18" - mono metadata style used across the site. */
export function stampDate(iso: string): string {
  return iso.slice(0, 10).replace(/-/g, " ");
}
