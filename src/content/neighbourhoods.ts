import type { Localized } from "@/lib/i18n";

export type HoodId =
  | "stari-grad"
  | "liman"
  | "grbavica"
  | "podbara"
  | "petrovaradin"
  | "sremska-kamenica"
  | "detelinara"
  | "novo-naselje";

export type Img = { src: string; alt: Localized<string>; portrait?: boolean };

export type Chapter = { kicker: Localized<string>; title: Localized<string>; text: Localized<string>; image: Img };

export type Hood = {
  id: HoodId;
  name: Localized<string>;
  /** Only the six guided neighbourhoods have a page. */
  slug?: Localized<string>;
  bank: "north" | "south";
  /** SVG map geometry, viewBox 0 0 1000 700 */
  shape: string;
  center: [number, number];
  pricePerM2: number;
  tagline: Localized<string>;
  intro?: Localized<string>;
  hero?: Img;
  chapters?: Chapter[];
  gallery?: Img[];
  stats?: { schools: number; parks: number; cafes: number; toCenter: number };
  character?: Localized<string[]>;
};

const img = (name: string, sr: string, en: string, portrait = false): Img => ({
  src: `/images/city/${name}.jpg`,
  alt: { sr, en },
  portrait,
});

export const hoods: Hood[] = [
  {
    id: "stari-grad",
    name: { sr: "Stari grad", en: "Stari grad" },
    slug: { sr: "stari-grad", en: "old-town" },
    bank: "north",
    shape: "M420 290 L560 250 L640 300 L622 440 L470 426 Z",
    center: [540, 352],
    pricePerM2: 3150,
    tagline: { sr: "Visoki plafoni, kaldrma i sve na pet minuta.", en: "High ceilings, cobblestones and everything five minutes away." },
    intro: {
      sr: "Centar Novog Sada je grad u malom: Trg slobode, Zmaj Jovina, Dunavska i Dunavski park, sve na razdaljini jedne šetnje. Stanovi u austrougarskim zgradama imaju plafone od 3,4 metra, drvene podove i prozore koji gledaju na krošnje. Kupci ovde plaćaju adresu, ali dobijaju život bez automobila.",
      en: "Central Novi Sad is a city in miniature: Liberty Square, Zmaj Jovina, Dunavska street and the Danube Park, all within one stroll. Flats in Austro-Hungarian buildings come with 3.4-metre ceilings, timber floors and windows onto treetops. Buyers pay for the address and get a car-free life in return.",
    },
    hero: img("trg-slobode", "Trg slobode sa Gradskom kućom i katedralom", "Liberty Square with the City Hall and the cathedral"),
    chapters: [
      {
        kicker: { sr: "Jutro", en: "Morning" },
        title: { sr: "Kafa na Zmaj Jovinoj", en: "Coffee on Zmaj Jovina" },
        text: {
          sr: "Pešačka zona se budi oko osam. Pekare na Dunavskoj, pijaca na Futoškoj za deset minuta, a Katolička porta je najlepša prečica do posla koju ćete ikada imati.",
          en: "The pedestrian zone wakes around eight. Bakeries on Dunavska, the Futoška market ten minutes away, and the Catholic Churchyard is the prettiest shortcut to work you will ever have.",
        },
        image: img("zmaj-jovina", "Ulica Zmaj Jovina u predvečerje", "Zmaj Jovina street at dusk", true),
      },
      {
        kicker: { sr: "Arhitektura", en: "Architecture" },
        title: { sr: "Secesija iz prve ruke", en: "Art Nouveau up close" },
        text: {
          sr: "Fasade sa kraja 19. veka, unutrašnja dvorišta i stepeništa od kamena. Kada kupujete ovde, pitajte za stanje krova i instalacija; mi to proveravamo pre nego što stan uopšte oglasimo.",
          en: "Late-19th-century façades, inner courtyards and stone staircases. When you buy here, ask about the roof and the wiring; we check both before a flat is ever listed.",
        },
        image: img("palata-secesija", "Secesijska palata u centru Novog Sada", "Art Nouveau palace in central Novi Sad", true),
      },
      {
        kicker: { sr: "Veče", en: "Evening" },
        title: { sr: "Grad koji se ne gasi", en: "A city that stays lit" },
        text: {
          sr: "Pozorište, bioskop Arena, vinski barovi u Laze Telečkog. Ako volite tišinu, tražite stan koji gleda u dvorište; mi znamo koje zgrade to imaju.",
          en: "The National Theatre, Arena cinema, wine bars on Laze Telečkog. If you love quiet, look for a flat facing the courtyard; we know which buildings have one.",
        },
        image: img("tresnja-vrata", "Rascvetala trešnja ispred starih vrata", "Cherry blossom in front of an old doorway"),
      },
    ],
    gallery: [
      img("katedrala", "Katedrala Imena Marijinog", "The Name of Mary Church", true),
      img("gradska-kuca-noc", "Gradska kuća noću", "City Hall at night"),
      img("prolaz", "Uski prolaz u starom gradu", "Narrow passage in the old town", true),
      img("vladicanski-dvor", "Vladičanski dvor", "The Bishop's Palace", true),
      img("centar-katedrala-ulica", "Ulica sa pogledom na katedralu", "Street with a view of the cathedral"),
      img("kupola-cvece", "Kupola i cveće", "Dome and blossoms", true),
    ],
    stats: { schools: 9, parks: 3, cafes: 140, toCenter: 0 },
    character: {
      sr: ["Pešačka zona", "Stanovi 1890–1935", "Plafoni 3,2–3,6 m", "Parking: zona 0"],
      en: ["Pedestrian zone", "Buildings 1890–1935", "Ceilings 3.2–3.6 m", "Parking: zone 0"],
    },
  },
  {
    id: "liman",
    name: { sr: "Liman", en: "Liman" },
    slug: { sr: "liman", en: "liman" },
    bank: "north",
    shape: "M300 460 L470 426 L612 441 L602 478 L470 524 L340 562 Z",
    center: [455, 485],
    pricePerM2: 2950,
    tagline: { sr: "Kej, Štrand i univerzitet u istom komšiluku.", en: "The quay, the city beach and the university on one block." },
    intro: {
      sr: "Liman je planiran šezdesetih za ljude koji žele svetlo i zelenilo. Široki bulevari, zgrade sa terasama i Sunčani kej na kome se trči, vozi bicikl i gleda zalazak. Liman IV je najtraženiji, Liman I najmirniji.",
      en: "Liman was planned in the sixties for people who wanted light and greenery. Wide boulevards, buildings with balconies and the Sunny Quay for running, cycling and sunsets. Liman IV is the most sought-after, Liman I the calmest.",
    },
    hero: img("strand-most", "Štrand i Most slobode", "Štrand beach and the Liberty Bridge"),
    chapters: [
      {
        kicker: { sr: "Kej", en: "The quay" },
        title: { sr: "Tri kilometra uz reku", en: "Three kilometres of riverfront" },
        text: {
          sr: "Sunčani kej vodi od Štranda do Varadinskog mosta. Stanovi sa pogledom na Dunav ovde dostižu i 3.600 €/m², a oni u drugom redu su 15% povoljniji i jednako blizu.",
          en: "The Sunny Quay runs from Štrand to the Varadin Bridge. River-view flats reach €3,600/m² here; the second row is 15% cheaper and just as close.",
        },
        image: img("most-slobode", "Most slobode sa keja", "The Liberty Bridge from the quay"),
      },
      {
        kicker: { sr: "Porodice", en: "Families" },
        title: { sr: "Škola preko puta", en: "School across the road" },
        text: {
          sr: "Pet osnovnih škola, dve gimnazije i kampus. Blokovi imaju unutrašnja dvorišta sa igralištima, pa deca rastu napolju.",
          en: "Five primary schools, two gymnasiums and the campus. The blocks have inner courtyards with playgrounds, so kids grow up outdoors.",
        },
        image: img("liman-zgrada", "Stambena zgrada na Limanu", "Apartment building in Liman", true),
      },
      {
        kicker: { sr: "Leto", en: "Summer" },
        title: { sr: "Štrand u papučama", en: "The beach in flip-flops" },
        text: {
          sr: "Gradska plaža je na deset minuta hoda. Od juna do septembra ovo je najtraženiji deo grada za izdavanje.",
          en: "The city beach is a ten-minute walk. From June to September this is the most requested part of town for rentals.",
        },
        image: img("labudovi", "Labudovi na Dunavu", "Swans on the Danube"),
      },
    ],
    gallery: [
      img("most-slobode-jesen", "Most slobode u jesen", "The Liberty Bridge in autumn"),
      img("dunav-leto", "Dunav leti", "The Danube in summer"),
      img("dunav-most-dusk", "Dunav i most u sumrak", "The Danube and bridge at dusk"),
    ],
    stats: { schools: 7, parks: 4, cafes: 85, toCenter: 15 },
    character: {
      sr: ["Kej i Štrand", "Zgrade 1965–1985 i novogradnja", "Terase kao standard", "Blizu univerziteta"],
      en: ["Quay and beach", "Buildings 1965–1985 and new builds", "Balconies as standard", "Next to the university"],
    },
  },
  {
    id: "grbavica",
    name: { sr: "Grbavica", en: "Grbavica" },
    slug: { sr: "grbavica", en: "grbavica" },
    bank: "north",
    shape: "M250 305 L420 292 L470 426 L300 458 Z",
    center: [360, 372],
    pricePerM2: 2650,
    tagline: { sr: "Kuće sa baštama pored novogradnje. Pola sata od svega, peške.", en: "Houses with gardens next to new builds. Half an hour from everything, on foot." },
    intro: {
      sr: "Grbavica se poslednjih deset godina menja brže od ostatka grada. Stare prizemne kuće ustupaju mesto zgradama od pet spratova, ali ulice su ostale tihe, a Promenada i Bulevar su na par minuta.",
      en: "Grbavica has changed faster than the rest of the city over the last decade. Old single-storey houses are giving way to five-storey buildings, but the streets have stayed quiet, and Promenada mall and the Boulevard are minutes away.",
    },
    hero: img("grbavica-kuca", "Stara kuća sa radnjom na Grbavici", "Old house with a shop in Grbavica"),
    chapters: [
      {
        kicker: { sr: "Novogradnja", en: "New builds" },
        title: { sr: "Najviše novih stanova u gradu", en: "The most new flats in town" },
        text: {
          sr: "Ovde proveravamo investitora, građevinsku dozvolu i upotrebnu dozvolu pre nego što preporučimo stan. Uknjižen stan vredi 8 do 12% više od onog koji to još nije.",
          en: "Here we check the developer, the building permit and the occupancy permit before recommending a flat. A registered flat is worth 8–12% more than one that isn't yet.",
        },
        image: img("ulica-kuce", "Ulica sa kućama i drvoredom", "Street with houses and trees"),
      },
      {
        kicker: { sr: "Ritam", en: "Rhythm" },
        title: { sr: "Bulevar za posao, ulica za život", en: "The Boulevard for work, the side street for life" },
        text: {
          sr: "Bulevar oslobođenja vozi vas do centra i stanice za deset minuta. Dva bloka dalje čujete samo komšije i ptice.",
          en: "Liberation Boulevard gets you to the centre or the station in ten minutes. Two blocks in, you only hear neighbours and birds.",
        },
        image: img("bulevar-plavi-sat", "Bulevar u plavi sat", "The Boulevard at blue hour"),
      },
      {
        kicker: { sr: "Komšiluk", en: "Neighbourhood" },
        title: { sr: "Male radnje, veliki izbor", en: "Small shops, big choice" },
        text: {
          sr: "Pekare, cvećare i kafići sa baštama. Grbavica je mesto gde vas prodavačica zna po imenu posle druge nedelje.",
          en: "Bakeries, florists and cafés with gardens. Grbavica is where the shop assistant knows your name by week two.",
        },
        image: { src: "/images/life/kafic-ulica.jpg", alt: { sr: "Kafić sa baštom na uglu ulice", en: "Corner café with a terrace" } },
      },
    ],
    gallery: [
      img("ulica-centar", "Ulica ka centru", "Street towards the centre", true),
      img("blokovi", "Stambeni blokovi", "Residential blocks", true),
      img("grad-plavi-sat", "Grad u plavi sat", "The city at blue hour"),
    ],
    stats: { schools: 5, parks: 2, cafes: 60, toCenter: 18 },
    character: {
      sr: ["Novogradnja", "Mirne ulice", "Blizu Promenade", "Dobra cena po m²"],
      en: ["New builds", "Quiet streets", "Near Promenada mall", "Good value per m²"],
    },
  },
  {
    id: "podbara",
    name: { sr: "Podbara", en: "Podbara" },
    slug: { sr: "podbara", en: "podbara" },
    bank: "north",
    shape: "M560 250 L700 182 L850 250 L812 384 L700 442 L640 300 Z",
    center: [718, 316],
    pricePerM2: 2450,
    tagline: { sr: "Najstariji deo grada koji se tek otkriva.", en: "The oldest part of town, only now being discovered." },
    intro: {
      sr: "Podbara je nastala uz Dunav, oko Almaške crkve i ribarskih kuća. Danas tu žive arhitekte, muzičari i porodice koje su htele centar bez gužve centra. Cene rastu brže nego igde u gradu, i dalje sa niže osnove.",
      en: "Podbara grew up along the Danube, around the Almaška church and fishermen's houses. Today architects, musicians and families who wanted the centre without its crowds live here. Prices are rising faster than anywhere else in town, still from a lower base.",
    },
    hero: img("zezeljev-zalazak", "Žeželjev most u zalazak sunca", "The Žeželj Bridge at sunset"),
    chapters: [
      {
        kicker: { sr: "Istorija", en: "History" },
        title: { sr: "Fasade u boji", en: "Façades in colour" },
        text: {
          sr: "Žute, zelene i oker kuće sa kapijama. Mnoge su zaštićene, pa proveravamo šta se sme menjati pre kupovine.",
          en: "Yellow, green and ochre houses with carriage gates. Many are protected, so we check what may be altered before you buy.",
        },
        image: img("fasada-zuta", "Žuta fasada stare kuće", "Yellow façade of an old house", true),
      },
      {
        kicker: { sr: "Reka", en: "The river" },
        title: { sr: "Dunav na kraju ulice", en: "The Danube at the end of the street" },
        text: {
          sr: "Novi Žeželjev most i nasip su postali omiljena staza za trčanje. Zalazak odavde je najlepši u gradu.",
          en: "The new Žeželj Bridge and the embankment have become a favourite running route. The sunset from here is the best in town.",
        },
        image: img("zezeljev-most", "Žeželjev most preko Dunava", "The Žeželj Bridge over the Danube"),
      },
      {
        kicker: { sr: "Investicija", en: "Investment" },
        title: { sr: "Gde raste vrednost", en: "Where value grows" },
        text: {
          sr: "Cena po kvadratu je od 2019. porasla 41%. Stanovi za renoviranje su i dalje dostupni, a mi imamo proverene izvođače.",
          en: "Price per square metre is up 41% since 2019. Flats to renovate are still available, and we have vetted contractors.",
        },
        image: img("lavanda-most", "Lavanda i most u sumrak", "Lavender and the bridge at dusk"),
      },
    ],
    gallery: [
      img("fasada-zuta-2", "Detalj žute fasade", "Detail of a yellow façade", true),
      img("most-noc", "Most noću", "The bridge at night"),
      img("zezeljev-sunce", "Žeželjev most na suncu", "The Žeželj Bridge in the sun"),
    ],
    stats: { schools: 3, parks: 2, cafes: 35, toCenter: 10 },
    character: {
      sr: ["Stare kuće i dvorišta", "Blizu Dunava", "Najbrži rast cena", "Mirno noću"],
      en: ["Old houses and courtyards", "Close to the Danube", "Fastest price growth", "Quiet at night"],
    },
  },
  {
    id: "petrovaradin",
    name: { sr: "Petrovaradin", en: "Petrovaradin" },
    slug: { sr: "petrovaradin", en: "petrovaradin" },
    bank: "south",
    shape: "M560 542 L660 500 L760 462 L860 420 L900 520 L760 602 L600 612 Z",
    center: [735, 540],
    pricePerM2: 2300,
    tagline: { sr: "Život ispod tvrđave, sa pogledom na ceo grad.", en: "Life beneath the fortress, with the whole city in view." },
    intro: {
      sr: "Petrovaradin je mali barokni grad preko reke. Kuće sa dvorištima, uske ulice Podgrađa i tvrđava koja leti postaje EXIT, a ostatak godine najmirniji park u gradu. Ovde se kupuju kuće, ne kvadrati.",
      en: "Petrovaradin is a small baroque town across the river. Houses with courtyards, the narrow lanes of the Lower Town, and a fortress that hosts EXIT in summer and is the city's quietest park the rest of the year. People buy houses here, not square metres.",
    },
    hero: img("tvrdjava-leto", "Petrovaradinska tvrđava iznad Dunava", "Petrovaradin Fortress above the Danube"),
    chapters: [
      {
        kicker: { sr: "Sat", en: "The clock" },
        title: { sr: "Sat koji laže", en: "The clock that lies" },
        text: {
          sr: "Na satu tvrđave velika kazaljka pokazuje sate, a mala minute, da bi ih lađari videli sa reke. Ovde se vreme meri drugačije, i to se oseća.",
          en: "On the fortress clock the big hand shows the hours and the small one the minutes, so boatmen could read it from the river. Time runs differently here, and you feel it.",
        },
        image: img("sat-kula-mesec", "Sat kula i pun mesec", "The clock tower under a full moon"),
      },
      {
        kicker: { sr: "Podgrađe", en: "Lower Town" },
        title: { sr: "Kaldrma i kapije", en: "Cobbles and gates" },
        text: {
          sr: "Kuće u Podgrađu su pod zaštitom. Renoviranje traži saglasnost Zavoda, ali rezultat je dom koji niko drugi u gradu nema.",
          en: "Houses in the Lower Town are protected. Renovation needs heritage approval, but the result is a home nobody else in town has.",
        },
        image: img("petrovaradin-kaldrma", "Kaldrmisana ulica u Petrovaradinu", "Cobbled street in Petrovaradin", true),
      },
      {
        kicker: { sr: "Pogled", en: "The view" },
        title: { sr: "Crveni krovovi", en: "Red rooftops" },
        text: {
          sr: "Sa bedema se vidi ceo Novi Sad. Kuće na obroncima ka Fruškoj gori imaju isti pogled iz dnevne sobe.",
          en: "From the ramparts you can see all of Novi Sad. Houses on the slopes towards Fruška Gora have the same view from the living room.",
        },
        image: img("petrovaradin-krovovi", "Krovovi Petrovaradina odozgo", "Petrovaradin rooftops from above"),
      },
    ],
    gallery: [
      img("tvrdjava-stepenice", "Stepenice ka tvrđavi", "Steps up to the fortress", true),
      img("petrovaradin-ulica", "Ulica u Petrovaradinu", "Street in Petrovaradin", true),
      img("petrovaradin-crkva", "Crkva u Petrovaradinu", "Church in Petrovaradin"),
      img("sat-kula-zalazak", "Sat kula u zalazak", "The clock tower at sunset", true),
      img("petrovaradin-zalazak", "Zalazak u Petrovaradinu", "Sunset in Petrovaradin", true),
      img("tvrdjava-sat-dan", "Tvrđava i sat danju", "The fortress and clock by day"),
    ],
    stats: { schools: 3, parks: 5, cafes: 30, toCenter: 20 },
    character: {
      sr: ["Kuće sa dvorištem", "Zaštićeno Podgrađe", "Pogled na grad", "EXIT svakog jula"],
      en: ["Houses with courtyards", "Protected Lower Town", "City views", "EXIT every July"],
    },
  },
  {
    id: "sremska-kamenica",
    name: { sr: "Sremska Kamenica", en: "Sremska Kamenica" },
    slug: { sr: "sremska-kamenica", en: "sremska-kamenica" },
    bank: "south",
    shape: "M220 652 L360 612 L500 576 L540 642 L420 700 L230 700 Z",
    center: [385, 650],
    pricePerM2: 2100,
    tagline: { sr: "Vinogradi, šuma i Dunav. Grad je preko mosta.", en: "Vineyards, forest and the Danube. The city is across the bridge." },
    intro: {
      sr: "Kamenica je Novi Sad za one koji žele baštu, bazen i tišinu, a da im centar ostane na petnaest minuta vožnje. Čardak, Popovica i Tatarsko brdo su najtraženiji delovi: vile na padinama Fruške gore sa pogledom na reku.",
      en: "Kamenica is Novi Sad for people who want a garden, a pool and silence while keeping the centre fifteen minutes' drive away. Čardak, Popovica and Tatarsko brdo are the most sought-after spots: villas on the slopes of Fruška Gora looking over the river.",
    },
    hero: img("dunav-okuka", "Okuka Dunava sa Fruške gore", "The Danube bend seen from Fruška Gora"),
    chapters: [
      {
        kicker: { sr: "Padine", en: "The slopes" },
        title: { sr: "Kuća sa pogledom", en: "A house with a view" },
        text: {
          sr: "Placevi od 600 do 2.000 m². Proveravamo namenu zemljišta, pristupni put i priključke; ovde su to pitanja od kojih zavisi cena.",
          en: "Plots from 600 to 2,000 m². We check zoning, road access and utility connections; here they decide the price.",
        },
        image: img("tvrdjava-padina", "Zelena padina iznad Dunava", "Green slope above the Danube"),
      },
      {
        kicker: { sr: "Priroda", en: "Nature" },
        title: { sr: "Fruška gora iza ugla", en: "Fruška Gora round the corner" },
        text: {
          sr: "Staze, vinarije i manastiri su na desetak minuta. Vikendom ovde ne morate da idete nigde.",
          en: "Trails, wineries and monasteries are ten minutes away. At weekends you don't need to go anywhere.",
        },
        image: img("pogled-sa-tvrdjave", "Pogled na grad sa druge obale", "View of the city from the far bank", true),
      },
      {
        kicker: { sr: "Veče", en: "Evening" },
        title: { sr: "Zalazak nad rekom", en: "Sunset over the river" },
        text: {
          sr: "Kuće okrenute severu gledaju u grad koji se pali. Zato je ovde terasa važnija od dnevne sobe.",
          en: "North-facing houses look at the city lighting up. That's why here the terrace matters more than the living room.",
        },
        image: img("dunav-sumrak", "Dunav u sumrak", "The Danube at dusk"),
      },
    ],
    gallery: [
      img("silueta-zalazak", "Silueta tvrđave u zalazak", "Fortress silhouette at sunset"),
      img("krovovi-zalazak", "Krovovi u zalazak sunca", "Rooftops at sunset"),
      { src: "/images/life/park-staza.jpg", alt: { sr: "Šumska staza", en: "Forest path" } },
    ],
    stats: { schools: 2, parks: 6, cafes: 18, toCenter: 25 },
    character: {
      sr: ["Vile i placevi", "Fruška gora", "Bazeni i bašte", "15 min kolima do centra"],
      en: ["Villas and plots", "Fruška Gora", "Pools and gardens", "15 min drive to the centre"],
    },
  },
  {
    id: "detelinara",
    name: { sr: "Detelinara", en: "Detelinara" },
    bank: "north",
    shape: "M230 152 L400 122 L420 292 L250 305 L240 300 Z",
    center: [325, 215],
    pricePerM2: 2250,
    tagline: { sr: "Zelen, miran i praktičan za porodice.", en: "Green, calm and practical for families." },
  },
  {
    id: "novo-naselje",
    name: { sr: "Novo naselje", en: "Novo naselje" },
    bank: "north",
    shape: "M60 252 L230 222 L250 305 L300 458 L90 420 Z",
    center: [175, 330],
    pricePerM2: 2200,
    tagline: { sr: "Veliki stanovi, parkovi i najviše parkinga u gradu.", en: "Large flats, parks and the most parking in town." },
  },
];

export const guidedHoods = hoods.filter((h) => h.slug);
export const hoodById = (id: HoodId) => hoods.find((h) => h.id === id)!;

/** Landmarks used for walk times and on the map. */
export const landmarks = [
  { id: "park", name: { sr: "Dunavski park", en: "Danube Park" }, at: [592, 382] as [number, number] },
  { id: "fortress", name: { sr: "Petrovaradinska tvrđava", en: "Petrovaradin Fortress" }, at: [690, 520] as [number, number] },
  { id: "spens", name: { sr: "SPENS", en: "SPENS" }, at: [505, 420] as [number, number] },
  { id: "promenada", name: { sr: "Promenada", en: "Promenada mall" }, at: [432, 418] as [number, number] },
] as const;

/** Map river centreline and bridges. */
export const river = "M-20 612 C 120 618, 260 610, 360 578 S 540 505, 640 472 S 790 410, 860 368 S 960 318, 1020 300";
export const bridges = [
  { name: { sr: "Most slobode", en: "Liberty Bridge" }, d: "M414 522 L432 590" },
  { name: { sr: "Varadinski most", en: "Varadin Bridge" }, d: "M630 448 L652 500" },
  { name: { sr: "Žeželjev most", en: "Žeželj Bridge" }, d: "M772 404 L800 452" },
];

/**
 * Illustrative walking minutes on the map: 1 unit ≈ 7.5 m, 80 m/min walking,
 * +30% for real streets, +6 min when a bridge has to be crossed.
 */
export function walkMinutes(from: [number, number], to: [number, number], crossRiver: boolean) {
  const d = Math.hypot(from[0] - to[0], from[1] - to[1]);
  return Math.max(2, Math.round((d * 7.5 * 1.3) / 80 + (crossRiver ? 6 : 0)));
}

/** Serbian locative ("in/on …") for sentences like "Imate stan na Limanu?". */
export const locativeSr: Record<HoodId, string> = {
  "stari-grad": "u Starom gradu",
  liman: "na Limanu",
  grbavica: "na Grbavici",
  podbara: "na Podbari",
  petrovaradin: "u Petrovaradinu",
  "sremska-kamenica": "u Sremskoj Kamenici",
  detelinara: "na Detelinari",
  "novo-naselje": "u Novom naselju",
};
