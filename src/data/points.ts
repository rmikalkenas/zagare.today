import type { ImageMetadata } from "astro";

// Auto-discover images from src/assets/points/. Reference by filename only —
// no per-image import boilerplate when adding new points.
const pointImages = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/points/*.{jpg,jpeg,png,webp}",
  { eager: true },
);

const img = (filename: string): ImageMetadata => {
  const mod = pointImages[`../assets/points/${filename}`];
  if (!mod) throw new Error(`Point image not found: ${filename}`);
  return mod.default;
};

export type Category =
  | "historical"
  | "attraction"
  | "grocery"
  | "church"
  | "pharmacy"
  | "food"
  | "crafts"
  | "hiking"
  | "camping";

export interface Point {
  id: string;
  name: string;
  description: string;
  category: Category;
  lat: number;
  lng: number;
  images?: ImageMetadata[];
  wikiUrl?: string;
  instagramUrl?: string;
}

export const CATEGORIES: Record<Category, { label: string; color: string }> = {
  historical: { label: "Istoriniai paminklai", color: "#1f2937" },
  attraction: { label: "Lankytinos vietos", color: "#c2410c" },
  grocery: { label: "Parduotuvės", color: "#ca8a04" },
  church: { label: "Bažnyčios", color: "#6b21a8" },
  pharmacy: { label: "Vaistinės", color: "#0e7490" },
  food: { label: "Maistas", color: "#b91c1c" },
  crafts: { label: "Amatai", color: "#78350f" },
  hiking: { label: "Pažintiniai takai", color: "#166534" },
  camping: { label: "Stovyklavietės", color: "#047857" },
};

export const CATEGORY_KEYS = Object.keys(CATEGORIES) as Category[];

export const POINTS: Point[] = [
  {
    id: "zagares-dvaras",
    name: "Žagarės dvaras",
    description:
      "XIX a. architektūrinis ansamblis Naujosios Žagarės pakraštyje su neoklasicistiniais rūmais, žirgynu ir 72 ha peizažiniu parku, kurį suprojektavo vokietis Georgas Kuphaltas. Dabartinius rūmus 1857 m. pastatė Dmitrijus Naryškinas.",
    category: "historical",
    lat: 56.362418,
    lng: 23.26457,
    images: [img("dvaras-1.webp"), img("dvaras-2.webp"), img("dvaras-3.webp")],
    wikiUrl: "https://lt.wikipedia.org/wiki/Žagarės_dvaras",
  },
  {
    id: "arklininko-namas",
    name: "Arklininko namas",
    description:
      "Istorinis XIX a. pastatas Žagarės dvaro ansamblyje, priklausęs dvaro arklininkui.",
    category: "historical",
    lat: 56.362694,
    lng: 23.265734,
    images: [img("arklininko-namas.webp")],
  },
  {
    id: "svetes-uztvanka",
    name: "Švėtės upės užtvanka",
    description:
      "Užtvanka ant Švėtės upės, formuojanti ramų tvenkinį netoli Žagarės dvaro – populiari vieta pasivaikščiojimams.",
    category: "attraction",
    lat: 56.364569,
    lng: 23.262718,
    images: [img("svetes-uztvanka.webp")],
  },
  {
    id: "dvaro-vejo-malunas",
    name: "Žagarės dvaro vėjo malūnas",
    description:
      "Mūrinis XIX a. vėjo malūnas, priklausantis Žagarės dvaro ansambliui – vienas iš nedaugelio Lietuvoje išlikusių tokio tipo malūnų.",
    category: "historical",
    lat: 56.36536,
    lng: 23.269762,
    images: [img("dvaro-malunas.webp")],
  },
  {
    id: "vysniu-sodas",
    name: "Žagarės vyšnių sodas",
    description:
      "Tradicinis Žagarės simbolis – vyšnių sodas, kuriam skirta kasmetinė Vyšnių šventė, vykstanti liepos mėnesį.",
    category: "attraction",
    lat: 56.369117,
    lng: 23.26877,
  },
  {
    id: "puodu-namas",
    name: "Edmundo Vaičiulio puodų namas",
    description:
      "Neįprastas buvusios žydų parduotuvės pastatas, kurio sienos ir dalis stogo apkabinėti puodais. Viduje – vertinga senienų kolekcija, tarp jų Žagarėje rasta Tora ir archeologinių artefaktų.",
    category: "attraction",
    lat: 56.361398,
    lng: 23.250185,
  },
  {
    id: "norfa",
    name: "Norfa",
    description:
      "Lietuviškas prekybos tinklas – kasdieninės maisto ir buities prekės.",
    category: "grocery",
    lat: 56.360504,
    lng: 23.254939,
    images: [img("norfa.webp")],
  },
  {
    id: "zirnis",
    name: "Žirnis",
    description: "Vietinė maisto ir kasdienių prekių parduotuvė.",
    category: "grocery",
    lat: 56.359545,
    lng: 23.255917,
    images: [img("zirnis.webp")],
  },
  {
    id: "parduotuve-kestucio",
    name: "Parduotuvė",
    description: "Maisto prekių parduotuvė.",
    category: "grocery",
    lat: 56.357202,
    lng: 23.254975,
    images: [img("parduotuve-kestucio.webp")],
  },
  {
    id: "delikatesas",
    name: "Parduotuvė „Delikatesas“",
    description: "Parduotuvė ir greito maisto užkandinė.",
    category: "grocery",
    lat: 56.360176,
    lng: 23.254334,
    images: [img("delikatesas.webp")],
  },
  {
    id: "baznycia-1",
    name: "Pirmoji Šv. apaštalų Petro ir Povilo bažnyčia",
    description:
      "Viena iš dviejų Žagarės katalikų bažnyčių, pavadintų Šv. apaštalų Petro ir Povilo vardu.",
    category: "church",
    lat: 56.359293,
    lng: 23.258251,
    images: [img("baznycia-1.webp")],
  },
  {
    id: "baznycia-2",
    name: "Antroji Šv. apaštalų Petro ir Povilo bažnyčia",
    description:
      "Antroji Žagarės Šv. apaštalų Petro ir Povilo katalikų bažnyčia, kitame miestelio gale.",
    category: "church",
    lat: 56.361557,
    lng: 23.25235,
    images: [img("baznycia-2.webp")],
  },
  {
    id: "pesciuju-tiltas",
    name: "Pėsčiųjų tiltas per Švėtę",
    description:
      "Pėsčiųjų tiltas per Švėtės upę, jungiantis abi miestelio puses.",
    category: "attraction",
    lat: 56.361409,
    lng: 23.253391,
    images: [img("pesciuju-tiltas.webp")],
  },
  {
    id: "atodanga",
    name: "Žagarės atodanga",
    description:
      "Valstybinės reikšmės geologinis paminklas – dolomito sluoksnių atodanga, susiformavusi devono periode prieš 360 mln. metų. Iki 1964 m. čia veikė dolomito karjeras.",
    category: "attraction",
    lat: 56.36508,
    lng: 23.256977,
    wikiUrl: "https://lt.wikipedia.org/wiki/Žagarės_atodanga",
  },
  {
    id: "miesto-aikste",
    name: "Žagarės miesto aikštė",
    description: "Centrinė miestelio aikštė – istorinė Žagarės turgaus vieta.",
    category: "attraction",
    lat: 56.359377,
    lng: 23.25505,
  },
  {
    id: "vaistine",
    name: "Vaistinė",
    description: "Miestelio vaistinė.",
    category: "pharmacy",
    lat: 56.35901,
    lng: 23.254662,
  },
  {
    id: "sinagogu-kompleksas",
    name: "Sinagogų kompleksas",
    description:
      "Išlikę XIX a. sinagogų pastatai – svarbi Žagarės žydų bendruomenės paveldo dalis.",
    category: "attraction",
    lat: 56.358102,
    lng: 23.255239,
  },
  {
    id: "beigeliai",
    name: "Žagarės Beigeliai",
    description:
      "Vietinė beigelių kepykla. Veikia tik kartą per mėnesį – pasiteiraukite vietinių.",
    category: "food",
    lat: 56.358901,
    lng: 23.251631,
    instagramUrl: "https://www.instagram.com/zagares_beigeliai",
  },
  {
    id: "dolce-vita",
    name: "Dolce Vita Pizza",
    description: "Pica ir desertai. Veikia tik savaitgaliais.",
    category: "food",
    lat: 56.358717,
    lng: 23.245592,
  },
  {
    id: "craftsmen-on-the-road",
    name: "Craftsmen On The Road",
    description: "Vietinių amatininkų studija ir parduotuvė.",
    category: "crafts",
    lat: 56.358815,
    lng: 23.246143,
  },
  {
    id: "piliakalnis",
    name: "Žagarės I piliakalnis",
    description:
      "I tūkstantmečio viduryje įrengtas piliakalnis – archeologinis paminklas Žagarės pakraštyje.",
    category: "attraction",
    lat: 56.357088,
    lng: 23.230843,
  },
  {
    id: "ozas",
    name: "Žagarės ozas",
    description:
      "Gamtos paminklas – ledyninis kalvagūbris (ozas), susiformavęs paskutinio ledynmečio pabaigoje.",
    category: "attraction",
    lat: 56.356443,
    lng: 23.229182,
  },
  {
    id: "ozo-takas",
    name: "Ozo pažintinis takas",
    description:
      "Pažintinis takas, vedantis per Žagarės ozo kalvagūbrį ir apylinkių miškus.",
    category: "hiking",
    lat: 56.357763,
    lng: 23.231492,
  },
  {
    id: "poilsio-erdve",
    name: "Poilsio erdvė",
    description: "Poilsio ir stovyklavimo vieta gamtoje netoli Žagarės.",
    category: "camping",
    lat: 56.350831,
    lng: 23.224338,
  },
];

export const CATEGORY_COUNTS: Record<Category, number> = Object.fromEntries(
  CATEGORY_KEYS.map((c) => [c, POINTS.filter((p) => p.category === c).length]),
) as Record<Category, number>;
