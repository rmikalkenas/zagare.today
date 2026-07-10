import type { ImageMetadata } from "astro";

// Auto-discover festival photos from src/assets/festival/. Reference by
// filename only - no per-image import boilerplate when adding new points.
const festivalImages = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/festival/*.{jpg,jpeg,png,webp}",
  { eager: true },
);

export const img = (filename: string): ImageMetadata => {
  const mod = festivalImages[`../assets/festival/${filename}`];
  if (!mod) throw new Error(`Festival image not found: ${filename}`);
  return mod.default;
};

// Marker glyphs available per point (Lucide-derived). Extend FESTIVAL_ICON_PATHS
// in FestivalMap.tsx when adding a new name here.
export type FestivalIcon = "cherry" | "star";

// Optional per-point programme, grouped by day.
export interface FestivalScheduleItem {
  time?: string; // single "17:00" or range "12:00-21:00" (plain hyphen only)
  text: string;
  heading?: boolean; // render as a section sub-header spanning both columns
}
export interface FestivalScheduleDay {
  day: string; // e.g. "Penktadienis · liepos 17 d."
  items: FestivalScheduleItem[];
}

// Flat set of festival locations - no category filtering (see Map page). Each
// point may pick its own marker icon; defaults to "star".
export interface FestivalPoint {
  id: string;
  name: string;
  description?: string;
  lat: number;
  lng: number;
  icon?: FestivalIcon;
  schedule?: FestivalScheduleDay[];
  images?: ImageMetadata[];
  path?: [number, number][]; // drawn on the map when this point is selected
  links?: { label: string; href: string }[];
  wikiUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
}

// Žagarės miesto aikštė - fallback map view until points are added.
export const FESTIVAL_CENTER: [number, number] = [56.359377, 23.25505];

export const FESTIVAL_POINTS: FestivalPoint[] = [
  {
    id: "miesto-aikste",
    name: "Žagarės miesto aikštė",
    lat: 56.359377,
    lng: 23.25505,
    icon: "cherry",
    schedule: [
      {
        day: "Penktadienis · liepos 17 d.",
        items: [
          { time: "12:00-21:00", text: "Žagarės vyšnių festivalio amatų mugė" },
          { time: "17:00", text: "Grupės „Bernužėliai“ koncertas" },
        ],
      },
      {
        day: "Šeštadienis · liepos 18 d.",
        items: [
          { time: "09:00-21:00", text: "Žagarės vyšnių festivalio amatų mugė" },
          { time: "09:00-16:00", text: "Bagažinturgis" },
          {
            time: "10:00",
            text: "Amatų mugės atidarymas. Kapelų dūzgės, pramogos ir žaidimai",
          },
          { time: "13:00-14:30", text: "Pauliaus Stalionio koncertas" },
          { time: "15:00-16:00", text: "Edmundo Kučinsko koncertas" },
        ],
      },
      {
        day: "Sekmadienis · liepos 19 d.",
        items: [
          { time: "09:00-17:00", text: "Žagarės vyšnių festivalio amatų mugė" },
        ],
      },
    ],
  },
  {
    id: "naujosios-zagares-baznycia",
    name: "Naujosios Žagarės Šv. apaštalų Petro ir Povilo bažnyčia",
    lat: 56.359293,
    lng: 23.258251,
    icon: "cherry",
    schedule: [
      {
        day: "Ketvirtadienis · liepos 16 d.",
        items: [
          {
            time: "18:00",
            text: "Šv. Mišios, skirtos Žagarės vyšnių festivaliui. Dalyvauja Žagarės kultūros centro moterų choras /vad. Meilutė Girskienė, vargonininkė Laima Mažuolytė/",
          },
        ],
      },
    ],
  },
  {
    id: "dvaro-rumai",
    name: "Žagarės dvaro rūmai",
    lat: 56.362418,
    lng: 23.26457,
    icon: "cherry",
    schedule: [
      {
        day: "Ketvirtadienis · liepos 16 d.",
        items: [
          { time: "19:30", text: "Žagarės vyšnių festivalio atidarymas" },
          {
            time: "",
            text: "Klezmerių muzikos šventė „Skambanti Žagarės atmintis!“. Koncertuoja „Rakija Klezmer Band“. Edukacija „Klezmerių muzikos instrumentai ir tradicija“",
          },
          {
            time: "",
            text: "Arbatos salonas „Vulfo Visockio arbatos kelias: iš Žagarės į pasaulį“",
          },
        ],
      },
      {
        day: "Penktadienis · liepos 17 d.",
        items: [
          {
            time: "19:30",
            text: "Klasikinės muzikos koncertas „Operos zaptė“. Koncertuoja Rafailas Karpis ir Darius Mažintas",
          },
        ],
      },
      {
        day: "Šeštadienis · liepos 18 d.",
        items: [
          {
            time: "13:00",
            text: "Gintarės Aukselės knygos „LRezidentė“ pristatymas",
          },
        ],
      },
    ],
  },
  {
    id: "miesto-stadionas",
    name: "Žagarės miesto stadionas",
    lat: 56.358934,
    lng: 23.267465,
    icon: "cherry",
    schedule: [
      {
        day: "Penktadienis · liepos 17 d.",
        items: [
          {
            time: "11:00",
            text: "Vaikų futbolo varžybos Žagarė-Gruzdžiai",
          },
        ],
      },
      {
        day: "Šeštadienis · liepos 18 d.",
        items: [
          {
            time: "10:30",
            text: "Atnaujinto Žagarės miesto stadiono atidarymo šventė",
          },
          { time: "11:00", text: "Veteranų futbolo varžybos" },
        ],
      },
    ],
  },
  {
    id: "sinagoga",
    name: "Žagarės sinagoga",
    lat: 56.358242,
    lng: 23.254967,
    icon: "cherry",
    schedule: [
      {
        day: "Penktadienis · liepos 17 d.",
        items: [
          {
            time: "18:00",
            text: "Žydiškos muzikos koncertas ir edukacija „Šofaro garsas“. Atlieka Tadas Daujotas / šofaras ir Yevgenii Musijets / bajanas",
          },
        ],
      },
      {
        day: "Šeštadienis · liepos 18 d.",
        items: [
          {
            time: "12:00-18:00",
            text: "JEWEL Art Residency: Memory & Heritage menininkų rezidencijos darbų paroda",
          },
        ],
      },
      {
        day: "Sekmadienis · liepos 19 d.",
        items: [
          {
            time: "10:00-13:00",
            text: "JEWEL Art Residency: Memory & Heritage menininkų rezidencijos darbų paroda",
          },
        ],
      },
    ],
  },
  {
    id: "rekreacine-zona",
    name: "Rekreacinė zona prie Žvelgaičių ežero",
    lat: 56.351331,
    lng: 23.225414,
    icon: "cherry",
    schedule: [
      {
        day: "Penktadienis · liepos 17 d.",
        items: [
          {
            heading: true,
            text: "Koncertinė programa „Pažinimas“ didžiojoje scenoje · tik su bilietais",
          },
          { time: "16:00-17:00", text: "DJ Rubin" },
          { time: "17:00-17:45", text: "Mantville" },
          { time: "17:45-18:45", text: "bielskis" },
          { time: "18:45-20:00", text: "Žalvarinis" },
          { time: "20:00-21:30", text: "Tautumeitas" },
          { time: "21:30-22:45", text: "Sisters on Wire" },
          { time: "22:45-00:00", text: "Kamanių šilelis" },
          { time: "00:00-01:15", text: "Natalija Bunkė" },
          { time: "01:15", text: "Festivalio šansas - DJ Žygis" },
        ],
      },
      {
        day: "Šeštadienis · liepos 18 d.",
        items: [
          {
            time: "15:00",
            text: "Pažinimo erdvė (saugomų teritorijų produkto ženklo turėtojų mugė, edukacijos, žaidimai, gamtos atradimai, invazinių rūšių pažinimas)",
          },
          {
            time: "15:00-18:00",
            text: "Lėlių namų edukacija „Lėlės iš žolių“",
          },
          {
            time: "15:30",
            text: "Seminaras apie invazines rūšis „Be vizų: ateiviai mūsų gamtoje“. Lektorius gamtininkas Almantas Kulbis",
          },
          { time: "16:00-17:00", text: "Aviacijos šou" },
          {
            heading: true,
            text: "Koncertinė programa „Pažinimas“ didžiojoje scenoje · tik su bilietais",
          },
          { time: "16:45-17:40", text: "DJ Rubin" },
          { time: "17:40-18:50", text: "„Baltic Rock Project“" },
          {
            time: "18:50-20:35",
            text: "Brolių Tautkų Rondo ir Šampaninis Kauno choras",
          },
          { time: "20:35-21:35", text: "Adomas Vyšniauskas" },
          {
            time: "21:35-22:50",
            text: "Monika Liu ir mini orkestras „Los Secretos de Pablo“",
          },
          { time: "22:50-00:00", text: "Beissoul ir Einius" },
          { time: "00:00-01:15", text: "„Poliarizuoti stiklai“" },
          { time: "01:15-01:45", text: "DJ laisvamanis" },
          { time: "01:45-03:00", text: "Orkesta Mendoza (Meksika)" },
          { time: "03:00-04:00", text: "DJ Rubin" },
          { heading: true, text: "Žagarė for Today | Laisvamanių scena" },
          { time: "20:00-21:30", text: "Rokas" },
          { time: "21:30-23:00", text: "Artūras" },
          { time: "23:00-00:30", text: "DJ el brujo" },
          { time: "00:30-02:00", text: "Edvinas M" },
          { time: "02:00", text: "Alxo" },
        ],
      },
    ],
  },
  {
    id: "hipodromas",
    name: "Žagarės dvaro parko hipodromas",
    lat: 56.362781,
    lng: 23.270958,
    icon: "cherry",
    schedule: [
      {
        day: "Šeštadienis · liepos 18 d.",
        items: [
          { time: "12:00-18:00", text: "Istorinės technikos suvažiavimas" },
        ],
      },
      {
        day: "Sekmadienis · liepos 19 d.",
        items: [
          {
            time: "10:00-17:00",
            text: "Žagarės vyšnių festivalio žirgų konkūrų varžybos",
          },
        ],
      },
    ],
  },
  {
    id: "kulturos-centras",
    name: "Žagarės kultūros centras",
    lat: 56.358494,
    lng: 23.255914,
    icon: "cherry",
    schedule: [
      {
        day: "Šeštadienis · liepos 18 d.",
        items: [
          { time: "11:00-15:00", text: "Edukacijų kiemelis" },
          { time: "15:00", text: "Kultūros pulsas" },
          {
            text: "Menininko Evaldo Janso parodos „Po tuo pačiu dangumi“ atidarymas ir filmų programa „Etnografija“. N-16",
          },
        ],
      },
      {
        day: "Sekmadienis · liepos 19 d.",
        items: [
          {
            time: "10:00-13:00",
            text: "Menininko Evaldo Janso paroda „Po tuo pačiu dangumi“ ir filmų programa „Etnografija“ N-16",
          },
        ],
      },
    ],
  },
  {
    id: "zygis-svete",
    name: "Žygis Švėtės dugnu",
    lat: 56.362167,
    lng: 23.246915,
    icon: "cherry",
    links: [{ label: "Registracija", href: "https://zagare.today/zygis-svete" }],
    schedule: [
      {
        day: "Šeštadienis · liepos 18 d.",
        items: [
          {
            time: "12:00",
            text: "Žygis Švėtės dugnu. Žagarės upės istorijos su gidu Žygimantu Ruškiu.",
          },
        ],
      },
    ],
  },
  {
    id: "tilto-galerija",
    name: "Tilto galerija",
    lat: 56.360093,
    lng: 23.251684,
    icon: "cherry",
    schedule: [
      {
        day: "Šeštadienis · liepos 18 d.",
        items: [{ time: "12:30", text: "Tilto galerijos atidarymas" }],
      },
      {
        day: "Sekmadienis · liepos 19 d.",
        items: [{ time: "Visą parą", text: "Tilto galerija" }],
      },
    ],
  },
  {
    id: "kaliausiu-plaukimas",
    name: "Švėtės upe nuo Barboros tilto iki paplūdimio Vilniaus g.",
    lat: 56.361432,
    lng: 23.253475,
    icon: "cherry",
    // Švėtės upės vaga nuo Barboros tilto iki paplūdimio (OSM waterway).
    path: [
      [56.361432, 23.253475],
      [56.361689, 23.254168],
      [56.361911, 23.254746],
      [56.362188, 23.255106],
      [56.362643, 23.255481],
      [56.362995, 23.255879],
      [56.363226, 23.256431],
      [56.363462, 23.257705],
      [56.363755, 23.259892],
      [56.363747, 23.260299],
    ],
    schedule: [
      {
        day: "Šeštadienis · liepos 18 d.",
        items: [
          {
            time: "13:00",
            text: "Tradicinis kaliausių plaukimas „Invazinių kaliausių vestuvių puota“",
          },
        ],
      },
    ],
  },
  {
    id: "leliu-namai",
    name: "Lėlių namai",
    lat: 56.3605795,
    lng: 23.255343,
    icon: "cherry",
    schedule: [
      {
        day: "Sekmadienis · liepos 19 d.",
        items: [
          {
            time: "12:00-14:00",
            text: "Lėlių namų edukacija „Lietuviškų lėlyčių dirbtuvėlės“",
          },
        ],
      },
    ],
  },
  {
    id: "dolce-vita",
    name: "Picerija „Dolce Vita“",
    description: "Picerija. Pusryčiai su bandelėmis ir kava.",
    lat: 56.358606,
    lng: 23.245493,
    icon: "cherry",
    facebookUrl: "https://www.facebook.com/SodybaPrieMalunoDOLCEVITA",
    schedule: [
      {
        day: "Darbo laikas",
        items: [
          { time: "16 d.", text: "17:00-20:00" },
          { time: "17 d.", text: "11:30-17:00" },
          { time: "18 d.", text: "11:00-18:00 (arba kol baigsis tešla)" },
          { time: "19 d.", text: "11:30-17:00" },
        ],
      },
    ],
  },
  {
    id: "beigeliai",
    name: "Žagarės beigeliai",
    lat: 56.358809,
    lng: 23.251614,
    icon: "cherry",
    facebookUrl: "https://www.facebook.com/profile.php?id=61570187465609",
    schedule: [
      {
        day: "Darbo laikas",
        items: [
          { time: "18 d.", text: "10:00-15:00" },
          { time: "19 d.", text: "10:00-15:00" },
        ],
      },
    ],
  },
];
