import type { Localized } from "@/lib/i18n";
import type { HoodId } from "./neighbourhoods";

export type AgentId = "jelena" | "marija" | "nikola" | "stefan" | "ana";

export type Agent = {
  id: AgentId;
  name: string;
  role: Localized<string>;
  bio: Localized<string>;
  languages: string[];
  areas: HoodId[];
  since: number;
  deals: number;
  image: string;
  /** object-position for portrait crops */
  focus: string;
  email: string;
};

export const agents: Agent[] = [
  {
    id: "jelena",
    name: "Jelena Marković",
    role: { sr: "Osnivačica, licencirani posrednik", en: "Founder, licensed broker" },
    bio: {
      sr: "Osnovala je Kotu 2014. posle deset godina u arhitektonskom birou. I dalje meri svaki stan pre nego što ga oglasi, zato su naše kvadrature tačne na decimalu.",
      en: "Founded Kota in 2014 after ten years in an architecture practice. She still measures every flat before it is listed, which is why our floor areas are right to the decimal.",
    },
    languages: ["SR", "EN", "IT"],
    areas: ["stari-grad", "sremska-kamenica"],
    since: 2014,
    deals: 312,
    image: "/images/team/jelena.jpg",
    focus: "50% 30%",
    email: "jelena@kota-nekretnine.rs",
  },
  {
    id: "marija",
    name: "Marija Stojanović",
    role: { sr: "Agent za Stari grad i Podbaru", en: "Old Town & Podbara agent" },
    bio: {
      sr: "Istoričarka umetnosti koja zna svaku fasadu u centru. Specijalnost su joj stanovi u zaštićenim zgradama i sve dozvole koje uz njih idu.",
      en: "An art historian who knows every façade in the centre. Her specialty is flats in listed buildings and all the permits that come with them.",
    },
    languages: ["SR", "EN", "DE"],
    areas: ["stari-grad", "podbara"],
    since: 2016,
    deals: 188,
    image: "/images/team/marija.jpg",
    focus: "50% 25%",
    email: "marija@kota-nekretnine.rs",
  },
  {
    id: "nikola",
    name: "Nikola Babić",
    role: { sr: "Agent za kuće i placeve", en: "Houses & plots agent" },
    bio: {
      sr: "Dipl. inženjer građevine. Pre svake kuće koju prodaje, proveri temelje, krov i papire za plac. Pokriva Petrovaradin, Kamenicu i padine Fruške gore.",
      en: "A civil engineer by training. Before selling any house he checks the foundations, the roof and the plot paperwork. Covers Petrovaradin, Kamenica and the Fruška Gora slopes.",
    },
    languages: ["SR", "EN"],
    areas: ["petrovaradin", "sremska-kamenica"],
    since: 2017,
    deals: 154,
    image: "/images/team/nikola.jpg",
    focus: "50% 35%",
    email: "nikola@kota-nekretnine.rs",
  },
  {
    id: "stefan",
    name: "Stefan Ilić",
    role: { sr: "Izdavanje i kupci iz inostranstva", en: "Rentals & international buyers" },
    bio: {
      sr: "Radio je u Beču i Minhenu pre nego što se vratio u Novi Sad. Vodi naše klijente iz dijaspore kroz kupovinu na daljinu: video razgledanja, punomoćja i banke.",
      en: "Worked in Vienna and Munich before coming home to Novi Sad. He guides diaspora clients through buying remotely: video viewings, powers of attorney and banks.",
    },
    languages: ["SR", "EN", "DE"],
    areas: ["liman", "grbavica", "detelinara", "novo-naselje"],
    since: 2019,
    deals: 236,
    image: "/images/team/stefan.jpg",
    focus: "50% 30%",
    email: "stefan@kota-nekretnine.rs",
  },
  {
    id: "ana",
    name: "Ana Tomić",
    role: { sr: "Procene i pravna podrška", en: "Valuations & legal support" },
    bio: {
      sr: "Pravnica i sudski veštak-pripravnik za procenu nepokretnosti. Ona potvrđuje svaku procenu sa sajta u roku od 24 sata i proverava list nepokretnosti pre svakog predugovora.",
      en: "A lawyer and trainee court-certified property valuer. She confirms every online valuation within 24 hours and checks the title deed before any pre-contract.",
    },
    languages: ["SR", "EN"],
    areas: ["liman", "grbavica", "detelinara"],
    since: 2021,
    deals: 97,
    image: "/images/team/ana.jpg",
    focus: "50% 30%",
    email: "ana@kota-nekretnine.rs",
  },
];

export const agentById = (id: AgentId) => agents.find((a) => a.id === id)!;
