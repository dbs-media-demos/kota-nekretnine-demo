import type { Localized } from "@/lib/i18n";

const L = <T,>(sr: T, en: T): Localized<T> => ({ sr, en });

export const homeCopy = {
  metaTitle: L("Kota nekretnine: stanovi i kuće u Novom Sadu", "Kota Real Estate: flats and houses in Novi Sad"),
  metaDescription: L(
    "Butik agencija za nekretnine u Novom Sadu. Stanovi i kuće na Limanu, Grbavici, u Starom gradu, Petrovaradinu i Kamenici. Izmerene kvadrature, provereni papiri, besplatna procena.",
    "A boutique real estate agency in Novi Sad. Flats and houses in Liman, Grbavica, the Old Town, Petrovaradin and Kamenica. Measured floor areas, checked paperwork, free valuations.",
  ),
  heroKicker: L("Butik agencija · Novi Sad · od 2014.", "Boutique agency · Novi Sad · since 2014"),
  heroLine1: L("Dom na", "A home at"),
  heroLine2: L("pravoj", "the right"),
  heroLine3: L("visini.", "level."),
  heroLead: L(
    "Stanovi i kuće u Novom Sadu, izmereni do centimetra, sa proverenim papirima i pravom cenom po kvadratu.",
    "Flats and houses in Novi Sad, measured to the centimetre, with checked paperwork and an honest price per square metre.",
  ),
  heroScroll: L("Skrolujte, penjemo se", "Scroll, we're going up"),
  heroPhoto: L("Stari grad u zalazak sunca, pogled na katedralu", "The Old Town at sunset, looking towards the cathedral"),
  quickSearch: L("Brza pretraga", "Quick search"),
  anyHood: L("Ceo grad", "Whole city"),
  search: L("Traži", "Search"),

  elevatorLabel: L("Kako radimo", "How we work"),
  elevatorTitle: L("Pet nivoa do ključeva.", "Five levels to the keys."),
  floors: [
    {
      kota: 0,
      name: L("Temelj", "Foundation"),
      title: L("Papiri pre fotografija.", "Paperwork before photos."),
      text: L(
        "Pre nego što oglasimo stan, proveravamo list nepokretnosti, terete, dozvole i da li kvadratura u katastru odgovara stvarnosti. Ako nešto ne štima, to rešavamo odmah, ne na dan potpisivanja.",
        "Before we list a flat we check the title deed, encumbrances, permits and whether the registered floor area matches reality. If something is off, we fix it now, not on signing day.",
      ),
      image: "/images/listings/l05/04.jpg",
      alt: L("Ulaz u kuću sa staklenim stepeništem", "House entrance with a glass staircase"),
    },
    {
      kota: 3.2,
      name: L("Osnova", "Floor plan"),
      title: L("Izmereno, ne procenjeno.", "Measured, not guessed."),
      text: L(
        "Svaki stan meri laserom naša osnivačica ili neko od agenata, i crtamo osnovu. Kupci znaju gde će stati orman pre prvog razgledanja.",
        "Every flat is laser-measured by our founder or one of our agents, and we draw the floor plan. Buyers know where the wardrobe goes before the first viewing.",
      ),
      image: "/images/listings/l01/01.jpg",
      alt: L("Dnevna soba sa kuhinjskim ostrvom od teraca", "Living room with a terrazzo kitchen island"),
    },
    {
      kota: 6.4,
      name: L("Svetlo", "Light"),
      title: L("Fotografisano u pravo doba dana.", "Photographed at the right hour."),
      text: L(
        "Dolazimo kad sunce ulazi u dnevnu sobu, ne kad nam odgovara. Zato naši oglasi izgledaju kao stan u kom biste želeli da živite.",
        "We come when the sun reaches the living room, not when it suits us. That's why our listings look like a home you'd want to live in.",
      ),
      image: "/images/listings/l07/01.jpg",
      alt: L("Svetla dnevna soba u prirodnim materijalima", "Bright living room in natural materials"),
    },
    {
      kota: 9.6,
      name: L("Razgledanje", "Viewing"),
      title: L("Kad vama odgovara.", "When it suits you."),
      text: L(
        "Radnim danima do 19h, subotom do 15h, nedeljom uz najavu. Za kupce iz inostranstva radimo video razgledanja uživo.",
        "Weekdays until 7 pm, Saturdays until 3 pm, Sundays by appointment. For buyers abroad we run live video viewings.",
      ),
      image: "/images/listings/l11/04.jpg",
      alt: L("Krovna terasa sa pogledom na grad", "Roof terrace overlooking the city"),
    },
    {
      kota: 12.4,
      name: L("Pogled", "The view"),
      title: L("I onda, ključevi.", "And then, the keys."),
      text: L(
        "Prosečna prodaja nam traje 34 dana. Od predugovora do primopredaje vodimo vas kroz notara, banku i katastar, a posle ostajemo komšije.",
        "Our average sale takes 34 days. From pre-contract to handover we guide you through the notary, the bank and the land registry, and afterwards we stay neighbours.",
      ),
      image: "/images/city/tvrdjava-sa-dunava.jpg",
      alt: L("Petrovaradinska tvrđava sa Dunava", "Petrovaradin Fortress seen from the Danube"),
    },
  ],

  featuredLabel: L("Izdvojeno iz ponude", "Featured listings"),
  featuredTitle: L("Trenutno na našim kotama.", "Currently on our levels."),
  featuredAll: L("Pogledajte svih 17 nekretnina", "See all 17 listings"),

  mapLabel: L("Novi Sad, kraj po kraj", "Novi Sad, block by block"),
  mapTitle: L("Gde se živi kako.", "Where life feels like what."),
  mapLead: L(
    "Prosečne cene po kvadratu iz naših prodaja u 2025–2026. Pređite preko kraja da ga vidite na mapi.",
    "Average prices per square metre from our 2025–2026 sales. Hover a neighbourhood to find it on the map.",
  ),
  guide: L("Vodič", "Guide"),

  manifesto: L(
    "Ne prodajemo kvadrate. Merimo ih, fotografišemo u pravo doba dana, proveravamo papire i tek onda vam kažemo koliko stan zaista vredi.",
    "We don't sell square metres. We measure them, photograph them at the right hour, check the paperwork, and only then tell you what a home is really worth.",
  ),
  stats: [
    { value: 640, suffix: "+", label: L("prodatih i izdatih nekretnina", "homes sold and let") },
    { value: 34, suffix: "", label: L("dana prosečna prodaja", "days average sale") },
    { value: 4.9, suffix: "★", decimals: 1, label: L("na 127 Google utisaka", "from 127 Google reviews") },
    { value: 0, suffix: " €", label: L("ako posao ne uspe", "if the deal doesn't close") },
  ],

  hoodsLabel: L("Vodiči kroz krajeve", "Neighbourhood guides"),
  hoodsTitle: L("Šest krajeva, šest ritmova.", "Six neighbourhoods, six rhythms."),

  valLabel: L("Procena", "Valuation"),
  valTitle: L("Koliko vredi vaš stan?", "What is your home worth?"),
  valLead: L(
    "Unesite kraj i kvadraturu i dobićete okvirnu cenu odmah. Agent je potvrđuje u roku od 24 sata, na osnovu stvarnih prodaja u vašoj ulici.",
    "Enter the neighbourhood and floor area for an instant estimate. An agent confirms it within 24 hours, based on real sales in your street.",
  ),
  valArea: L("Kvadratura (m²)", "Floor area (m²)"),
  valHood: L("Kraj", "Neighbourhood"),
  valRange: L("Okvirna vrednost", "Estimated value"),
  valCta: L("Detaljna procena", "Full valuation"),

  reviewsLabel: L("Utisci", "Reviews"),
  reviewsTitle: L("Šta kažu komšije.", "What the neighbours say."),
  reviewsAll: L("Svi utisci", "All reviews"),

  teamLabel: L("Tim", "The team"),
  teamTitle: L("Pet ljudi. Svaki kraj ima svoje ime.", "Five people. Every neighbourhood has a name."),
  teamAll: L("Upoznajte nas", "Meet us"),
};
