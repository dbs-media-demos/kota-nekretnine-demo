import type { Localized } from "@/lib/i18n";

export type Faq = { group: "buy" | "sell" | "rent" | "fees"; q: Localized<string>; a: Localized<string> };

export const faqGroups: Record<Faq["group"], Localized<string>> = {
  fees: { sr: "Provizija", en: "Fees" },
  buy: { sr: "Kupovina", en: "Buying" },
  sell: { sr: "Prodaja", en: "Selling" },
  rent: { sr: "Najam", en: "Renting" },
};

export const faqs: Faq[] = [
  {
    group: "fees",
    q: { sr: "Kolika je vaša provizija?", en: "What is your commission?" },
    a: {
      sr: "Za kupoprodaju 2% od kupoprodajne cene (plus PDV), koje plaća strana koja nas angažuje. Za najam 50% jedne mesečne kirije. Ako posao ne bude zaključen, ne plaćate ništa. Sve piše u ugovoru o posredovanju pre prvog razgledanja.",
      en: "For sales, 2% of the purchase price (plus VAT), paid by the party that hires us. For rentals, 50% of one month's rent. If the deal doesn't close, you pay nothing. It's all in the brokerage agreement before the first viewing.",
    },
  },
  {
    group: "fees",
    q: { sr: "Da li naplaćujete procenu?", en: "Do you charge for valuations?" },
    a: {
      sr: "Ne. Online procena je besplatna, a agent je potvrđuje ili koriguje u roku od 24 sata na osnovu stvarnih prodaja u vašoj ulici. Pismena procena za banku ili sud se radi preko ovlašćenog procenitelja i naplaćuje se od 150 €.",
      en: "No. The online valuation is free, and an agent confirms or adjusts it within 24 hours based on real sales in your street. A written valuation for a bank or court is done by a certified valuer and starts at €150.",
    },
  },
  {
    group: "buy",
    q: { sr: "Šta znači „uknjiženo“ i zašto je važno?", en: "What does “uknjiženo” mean and why does it matter?" },
    a: {
      sr: "Uknjižen stan je upisan u katastar na ime prodavca, bez tereta. Samo takav stan banka prihvata kao hipoteku za stambeni kredit. Za svaki stan koji oglasimo proveravamo list nepokretnosti pre objave.",
      en: "A registered flat is entered in the land registry in the seller's name, with no encumbrances. Only then will a bank accept it as security for a mortgage. We check the title deed of every flat before we list it.",
    },
  },
  {
    group: "buy",
    q: { sr: "Mogu li da kupim stan iz inostranstva?", en: "Can I buy from abroad?" },
    a: {
      sr: "Da. Radimo video razgledanja uživo, šaljemo kompletnu dokumentaciju i preporučujemo notara. Ugovor se može potpisati preko punomoćja overenog u konzulatu. Građani EU mogu kupovati nepokretnosti u Srbiji po principu reciprociteta.",
      en: "Yes. We run live video viewings, send the full paperwork and recommend a notary. The contract can be signed via a power of attorney certified at a consulate. EU citizens can buy property in Serbia on a reciprocity basis.",
    },
  },
  {
    group: "buy",
    q: { sr: "Kako funkcioniše stambeni kredit?", en: "How do mortgages work here?" },
    a: {
      sr: "Banke u Srbiji obično traže 20% učešća (10% uz NKOSK osiguranje), a finansiraju do 30 godina. Naš kalkulator na svakoj nekretnini pokazuje okvirnu ratu; tačnu ponudu daje banka posle provere kreditne sposobnosti.",
      en: "Serbian banks usually require a 20% deposit (10% with NKOSK insurance) and lend for up to 30 years. The calculator on every listing shows an indicative payment; the exact offer comes from the bank after a credit check.",
    },
  },
  {
    group: "buy",
    q: { sr: "Koji porezi idu uz kupovinu?", en: "Which taxes come with a purchase?" },
    a: {
      sr: "Kupac plaća porez na prenos apsolutnih prava od 2,5% (osim kod prve kupovine stana za kupce koji ispunjavaju uslove, i kod novogradnje sa PDV-om), plus overu kod notara i upis u katastar, obično 300–600 € ukupno.",
      en: "The buyer pays a 2.5% transfer tax (with exemptions for eligible first-time buyers and for new builds sold with VAT), plus notary fees and registry entry, usually €300–600 in total.",
    },
  },
  {
    group: "sell",
    q: { sr: "Koliko traje prodaja?", en: "How long does a sale take?" },
    a: {
      sr: "Naš prosek u 2025. bio je 34 dana od objave do predugovora. Od predugovora do ključeva prođe još 30 do 60 dana, zavisno od toga da li kupac uzima kredit.",
      en: "Our 2025 average was 34 days from listing to pre-contract. From pre-contract to handing over the keys takes another 30–60 days, depending on whether the buyer has a mortgage.",
    },
  },
  {
    group: "sell",
    q: { sr: "Šta uključuje vaš marketing?", en: "What does your marketing include?" },
    a: {
      sr: "Profesionalne fotografije, izmerenu osnovu, video šetnju, opis na srpskom i engleskom, objavu na svim portalima i direktnu ponudu kupcima sa naše liste. Sve je uključeno u proviziju.",
      en: "Professional photos, a measured floor plan, a video walkthrough, descriptions in Serbian and English, listing on every major portal and a direct offer to buyers on our list. It's all included in the commission.",
    },
  },
  {
    group: "rent",
    q: { sr: "Šta je potrebno za iznajmljivanje?", en: "What do I need to rent?" },
    a: {
      sr: "Lična karta ili pasoš, i obično depozit u visini jedne kirije. Ugovor je na srpskom i engleskom, minimalno na godinu dana, a stanodavac vas prijavljuje na adresu.",
      en: "An ID card or passport, and usually a deposit of one month's rent. The contract is in Serbian and English, for at least twelve months, and the landlord registers your address.",
    },
  },
  {
    group: "rent",
    q: { sr: "Da li su kućni ljubimci dozvoljeni?", en: "Are pets allowed?" },
    a: {
      sr: "Kod otprilike polovine stanova koje izdajemo, da. Na svakom oglasu piše „po dogovoru“ ili „ne“, a mi pregovaramo sa vlasnikom u vaše ime.",
      en: "For about half of the flats we let, yes. Each listing says “by arrangement” or “no”, and we negotiate with the owner on your behalf.",
    },
  },
];
