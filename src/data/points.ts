import type { ImageMetadata } from "astro";

// Auto-discover images from src/assets/points/. Reference by filename only -
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
  websiteUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  phone?: string;
  hours?: { days: string; time: string }[];
}

export const CATEGORIES: Record<Category, { label: string; color: string }> = {
  historical: { label: "Istoriniai paminklai", color: "#1f2937" },
  attraction: { label: "Lankytinos vietos", color: "#c2410c" },
  grocery: { label: "Parduotuvės", color: "#ca8a04" },
  church: { label: "Bažnyčios", color: "#6b21a8" },
  pharmacy: { label: "Vaistinės", color: "#0e7490" },
  food: { label: "Maistas", color: "#b91c1c" },
  crafts: { label: "Amatai ir edukacijos", color: "#78350f" },
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
      "Užtvanka ant Švėtės upės, formuojanti ramų tvenkinį netoli Žagarės dvaro - populiari vieta pasivaikščiojimams.",
    category: "attraction",
    lat: 56.364569,
    lng: 23.262718,
    images: [img("svetes-uztvanka.webp")],
  },
  {
    id: "dvaro-vejo-malunas",
    name: "Žagarės dvaro vėjo malūnas",
    description:
      "Mūrinis XIX a. vėjo malūnas, priklausantis Žagarės dvaro ansambliui - vienas iš nedaugelio Lietuvoje išlikusių tokio tipo malūnų.",
    category: "historical",
    lat: 56.36536,
    lng: 23.269762,
    images: [img("dvaro-malunas.webp")],
  },
  {
    id: "vysniu-sodas",
    name: "Žagarės vyšnių sodas",
    description:
      "Tradicinis Žagarės simbolis - vyšnių sodas, kuriam skirta kasmetinė Vyšnių šventė, vykstanti liepos mėnesį.",
    category: "attraction",
    lat: 56.369117,
    lng: 23.26877,
  },
  {
    id: "puodu-namas",
    name: "Edmundo Vaičiulio puodų namas",
    description:
      "Neįprastas buvusios žydų parduotuvės pastatas, kurio sienos ir dalis stogo apkabinėti puodais. Viduje - vertinga senienų kolekcija, tarp jų Žagarėje rasta Tora ir archeologinių artefaktų.",
    category: "attraction",
    lat: 56.361398,
    lng: 23.250185,
    images: [img("puodu-namas.webp")],
  },
  {
    id: "norfa",
    name: "Norfa",
    description:
      "Lietuviškas prekybos tinklas - kasdieninės maisto ir buities prekės.",
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
      "Valstybinės reikšmės geologinis paminklas - dolomito sluoksnių atodanga, susiformavusi devono periode prieš 360 mln. metų. Iki 1964 m. čia veikė dolomito karjeras.",
    category: "attraction",
    lat: 56.36508,
    lng: 23.256977,
    wikiUrl: "https://lt.wikipedia.org/wiki/Žagarės_atodanga",
  },
  {
    id: "miesto-aikste",
    name: "Žagarės miesto aikštė",
    description: "Centrinė miestelio aikštė - istorinė Žagarės turgaus vieta.",
    category: "attraction",
    lat: 56.359377,
    lng: 23.25505,
  },
  {
    id: "vaistine",
    name: "Gintarinė vaistinė",
    description: "",
    category: "pharmacy",
    lat: 56.35901,
    lng: 23.254662,
    hours: [
      { days: "I-V", time: "8:00-18:00" },
      { days: "VI", time: "9:00-13:00" },
      { days: "VII", time: "nedirba" },
    ],
    websiteUrl: "https://www.gintarine.lt/",
    phone: "+370 618 52578",
  },
  {
    id: "sinagogu-kompleksas",
    name: "Sinagogų kompleksas",
    description:
      "Išlikę XIX a. sinagogų pastatai - svarbi Žagarės žydų bendruomenės paveldo dalis.",
    category: "attraction",
    lat: 56.358102,
    lng: 23.255239,
  },
  {
    id: "beigeliai",
    name: "Žagarės Beigeliai",
    description:
      "Vietinė beigelių kepykla. Veikia tik kartą per mėnesį - pasiteiraukite vietinių.",
    category: "food",
    lat: 56.358901,
    lng: 23.251631,
    instagramUrl: "https://www.instagram.com/zagares_beigeliai",
    facebookUrl: "https://www.facebook.com/profile.php?id=61570187465609",
  },
  {
    id: "dolce-vita",
    name: "Dolce Vita Pizza",
    description: "Pica ir desertai. Veikia tik savaitgaliais.",
    category: "food",
    lat: 56.358717,
    lng: 23.245592,
    facebookUrl: "https://www.facebook.com/SodybaPrieMalunoDOLCEVITA",
  },
  {
    id: "svedlaukis",
    name: "Kavinė „Švedlaukis“",
    description:
      "Kavinėje galima pavalgyti dienos pietus, bei užsisakyti maistą išsinešimui ar pristatymui į namus. Kavinėje priimami užsakymai pobūviams.",
    category: "food",
    lat: 56.3586342,
    lng: 23.2550523,
    phone: "+370 647 66031",
    images: [img("svedlaukis.webp")],
    facebookUrl: "https://www.facebook.com/profile.php?id=100088636721862",
  },
  {
    id: "tiga-kebabine",
    name: "Tiga kebabinė",
    description: "Greito maisto užkandinė, kebabinė.",
    category: "food",
    lat: 56.361591,
    lng: 23.250015,
    facebookUrl: "https://www.facebook.com/profile.php?id=61590516220273",
    phone: "+370 669 97933",
  },
  {
    id: "rakte",
    name: "Kavinė „Raktė“",
    description:
      "Kavinė dirba sezono metu (pavasarį, vasarą, rudenį). Ne sezono metu kavinėje priimami užsakymai pobūviams (būtina suderinti iš anksto).",
    category: "food",
    lat: 56.3598197,
    lng: 23.2520577,
    phone: "+370 616 88949",
  },
  {
    id: "craftsmen-on-the-road",
    name: "Juvelyrinės dirbtuvės „Craftsmen on the road“",
    description:
      "Juvelyrinės dirbtuvės „Craftsmen on the road“ Žagarėje kviečia kūrybinių patirčių ieškotojus susipažinti su juvelyro darbo procesu, susikurti savo originalų papuošalą iš žalvario vielos, natūralių akmenų bei rankų darbo stiklo. Edukacijos trukmė apie dvi valandas.",
    category: "crafts",
    lat: 56.358815,
    lng: 23.246143,
    images: [img("craftsmen-on-the-road.webp")],
    facebookUrl: "https://www.facebook.com/SodybaPrieMalunoDOLCEVITA",
    phone: "+370 637 57518",
  },
  {
    id: "klecku-puota",
    name: "Kleckų puota",
    description:
      "Žiemgalos kulinarinio paveldo asociacija organizuoja edukacijas - degustacijas, pristatančias Žiemgalos krašto kulinarinio paveldo pasididžiavimą: kleckus (ruginius virtinius su lašinukais ir raugintais kopūstais), sūrį (5 rūšių), zaptę (uogienę), kumpį ir lašinius, vaisinius saldainius, ruginius blynus su zapte, miežinį naminį alų, naminį vyną (vyšnių, obuolių, juodųjų serbentų), Žvelgaičių piliakalnio papėdės žolelių arbatą, sulą (pavasarį - šviežią, kitais metų laikais - raugintą). Kaina sutartinė, paprastai trukmė - iki 2 valandų. Būtina registracija telefonu.",
    category: "crafts",
    lat: 56.341787,
    lng: 23.2073277,
    images: [img("klecku-puota.webp")],
    websiteUrl: "https://www.ziemgalospaveldas.lt/",
    phone: "+370 685 99800",
  },
  {
    id: "kaliausiu-fabrikelis",
    name: "Kaliausių fabrikėlis",
    description:
      "Tautodailininkės Aušros Petrauskienės įkurtos kaliausių dirbtuvės ant Švėtės upės kranto - čia vedamos kaliausių kūrimo edukacijos vaikams ir suaugusiems. Per Vyšnių festivalį virsta linksmybių centru su kaliausių lenktynėmis, raliu ir gražiausios kaliausės rinkimais.",
    category: "crafts",
    lat: 56.3643858,
    lng: 23.2599064,
    images: [img("kaliausiu-fabrikelis.webp")],
    facebookUrl: "https://www.facebook.com/zagares.kaliauses/",
    phone: "+370 612 85668",
  },
  {
    id: "leliu-namai",
    name: "Lėlių namai",
    description:
      "Tautodailininkė A. Petrauskienė vykdo užsakomąsias lėlių kūrybos edukacijas. Įkvepiančioje ir jaukioje lėlių muziejaus aplinkoje lankytojai praturtina žinias, susikuria pageidaujamą lėlytę atminimui bei patiria kūrybos džiaugsmą.",
    category: "crafts",
    lat: 56.3605795,
    lng: 23.255343,
    images: [img("leliu-namai.webp")],
    phone: "+370 612 85668",
  },
  {
    id: "piliakalnis",
    name: "Žagarės I piliakalnis",
    description:
      "I tūkstantmečio viduryje įrengtas piliakalnis - archeologinis paminklas Žagarės pakraštyje.",
    category: "attraction",
    lat: 56.357088,
    lng: 23.230843,
  },
  {
    id: "ozas",
    name: "Žagarės ozas",
    description:
      "Gamtos paminklas - ledyninis kalvagūbris (ozas), susiformavęs paskutinio ledynmečio pabaigoje.",
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
  {
    id: "sodyba-prie-maluno",
    name: "Sodyba prie malūno",
    description: "Kaimo turizmo sodyba su stovyklaviete prie malūno.",
    category: "camping",
    lat: 56.358815,
    lng: 23.246143,
    facebookUrl: "https://www.facebook.com/SodybaPrieMalunoDOLCEVITA",
  },
];

export const CATEGORY_COUNTS: Record<Category, number> = Object.fromEntries(
  CATEGORY_KEYS.map((c) => [c, POINTS.filter((p) => p.category === c).length]),
) as Record<Category, number>;
