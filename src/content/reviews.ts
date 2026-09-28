import type { Localized } from "@/lib/i18n";

export type Review = {
  name: string;
  rating: number;
  date: string;
  context: Localized<string>;
  text: Localized<string>;
};

/** Fictional Google-style reviews for the concept site. */
export const reviews: Review[] = [
  {
    name: "Milan P.",
    rating: 5,
    date: "2026-09-14",
    context: { sr: "Kupio stan na Limanu IV", en: "Bought a flat in Liman IV" },
    text: {
      sr: "Ana je primetila da u listu nepokretnosti fali upis terase i sredila to sa prodavcem pre predugovora. Bez nje bismo platili 11 m² koji na papiru ne postoje.",
      en: "Ana noticed the terrace was missing from the title deed and sorted it out with the seller before the pre-contract. Without her we'd have paid for 11 m² that didn't exist on paper.",
    },
  },
  {
    name: "Ivana & Dejan K.",
    rating: 5,
    date: "2026-08-30",
    context: { sr: "Prodali kuću u Petrovaradinu", en: "Sold a house in Petrovaradin" },
    text: {
      sr: "Nikola je doveo fotografa, izmerio kuću i napravio osnovu. Prodato za 31 dan, 4% iznad cene koju su nam druge agencije predlagale.",
      en: "Nikola brought a photographer, measured the house and drew a floor plan. Sold in 31 days, 4% above what other agencies suggested.",
    },
  },
  {
    name: "Sanja M.",
    rating: 5,
    date: "2026-08-19",
    context: { sr: "Kupovina iz Minhena", en: "Bought from Munich" },
    text: {
      sr: "Živim u Nemačkoj i kupila sam stan a da nisam došla ni jednom. Stefan je radio video razgledanja uživo, preporučio notara i sve završio preko punomoćja.",
      en: "I live in Germany and bought a flat without coming once. Stefan did live video viewings, recommended a notary and handled everything via power of attorney.",
    },
  },
  {
    name: "Petar V.",
    rating: 5,
    date: "2026-07-28",
    context: { sr: "Iznajmio stan na Grbavici", en: "Rented a flat in Grbavica" },
    text: {
      sr: "Prvi put da agencija odgovori na poruku u 21h. Razgledanje sutradan, ugovor za tri dana, sve jasno napisano.",
      en: "The first agency ever to answer a message at 9 pm. Viewing the next day, contract in three days, everything written clearly.",
    },
  },
  {
    name: "Jovana R.",
    rating: 5,
    date: "2026-07-11",
    context: { sr: "Kupila garsonjeru u centru", en: "Bought a studio in the centre" },
    text: {
      sr: "Marija zna istoriju svake zgrade u centru. Rekla nam je koje zgrade planiraju zamenu krova, pa smo izbegli trošak od 3.000 €.",
      en: "Marija knows the history of every building in the centre. She told us which ones were planning a roof replacement, and we avoided a €3,000 bill.",
    },
  },
  {
    name: "Aleksandar T.",
    rating: 4,
    date: "2026-06-22",
    context: { sr: "Procena stana na Detelinari", en: "Valuation in Detelinara" },
    text: {
      sr: "Online procena je bila 6% niža od onoga što sam očekivao, ali su mi na sastanku pokazali tri prodaje iz moje ulice. Imali su pravo. Prodato za 38 dana.",
      en: "The online estimate was 6% lower than I'd hoped, but at the meeting they showed me three sales from my street. They were right. Sold in 38 days.",
    },
  },
  {
    name: "Tamara i Luka S.",
    rating: 5,
    date: "2026-06-05",
    context: { sr: "Prva kupovina, stambeni kredit", en: "First purchase, with a mortgage" },
    text: {
      sr: "Kalkulator na sajtu nam je pokazao realnu ratu, a Jelena nas je povezala sa dve banke. Bez stresa od prvog razgledanja do ključeva.",
      en: "The calculator on the site showed us a realistic monthly payment, and Jelena put us in touch with two banks. No stress from the first viewing to the keys.",
    },
  },
  {
    name: "Goran D.",
    rating: 5,
    date: "2026-05-17",
    context: { sr: "Izdavanje stana na Limanu", en: "Letting a flat in Liman" },
    text: {
      sr: "Izdaju mi stan već treću godinu. Stanari provereni, kirija na vreme, a izveštaj dobijam svakog meseca.",
      en: "They've managed my flat for three years now. Vetted tenants, rent on time, and a report every month.",
    },
  },
  {
    name: "Mirjana B.",
    rating: 5,
    date: "2026-04-29",
    context: { sr: "Prodala stan u Podbari", en: "Sold a flat in Podbara" },
    text: {
      sr: "Fotografije i opis su bili lepši od mog stana. Šalim se, ali su stvarno umeli da pokažu ono najbolje. Tri ozbiljne ponude za dve nedelje.",
      en: "The photos and description were nicer than my flat. Joking, but they really knew how to show its best side. Three serious offers in two weeks.",
    },
  },
];

/** Review summary for the badge and structured data. */
export const ratingSummary = { value: 4.9, count: 127, distribution: [118, 6, 2, 1, 0] };
