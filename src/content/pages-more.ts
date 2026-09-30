import type { Localized } from "@/lib/i18n";

const L = <T,>(sr: T, en: T): Localized<T> => ({ sr, en });

export const aboutPage = {
  metaTitle: L("O nama: Kota, butik agencija za nekretnine u Novom Sadu", "About Kota, a boutique real estate agency in Novi Sad"),
  metaDescription: L(
    "Pet agenata, jedna kancelarija u Starom gradu i više od 640 prodatih i izdatih nekretnina od 2014. Upoznajte tim Kote.",
    "Five agents, one office in the Old Town and more than 640 homes sold and let since 2014. Meet the Kota team.",
  ),
  label: L("O nama", "About"),
  title: L("Mali tim. Veliki metar.", "A small team. A long tape measure."),
  lead: L(
    "Kota je nastala 2014. u kancelariji od 28 m² iznad knjižare u Ulici Modene. Danas nas je petoro, i dalje merimo svaki stan pre nego što ga oglasimo.",
    "Kota started in 2014 in a 28 m² office above a bookshop on Modene street. Today there are five of us, and we still measure every flat before we list it.",
  ),
  storyLabel: L("Priča", "Story"),
  story: L(
    "Jelena je deset godina crtala stanove u arhitektonskom birou pre nego što je počela da ih prodaje. Smetalo joj je što oglasi lažu o kvadraturi, što fotografije kriju male sobe i što kupci saznaju za problem sa papirima tek kod notara. Kota je njen odgovor: agencija koja nekretninu predstavlja kao arhitekta, a prodaje kao komšija.",
    "Jelena spent ten years drawing flats at an architecture practice before she started selling them. It bothered her that listings lied about floor areas, that photos hid small rooms and that buyers only found out about paperwork problems at the notary. Kota is her answer: an agency that presents a home like an architect and sells it like a neighbour.",
  ),
  quote: L("„Kota je visina na kojoj stojite. Naš posao je da je izmerimo tačno.“", "“A kota is the level you stand on. Our job is to measure it exactly.”"),
  valuesLabel: L("Kako radimo", "How we work"),
  values: [
    { title: L("Tačno", "Exact"), text: L("Kvadratura sa laserom, ne iz sećanja prodavca. Osnova uz svaki oglas.", "Floor areas by laser, not from the seller's memory. A plan with every listing.") },
    { title: L("Provereno", "Checked"), text: L("List nepokretnosti, tereti i dozvole pre objave. Bez iznenađenja kod notara.", "Title deed, encumbrances and permits before listing. No surprises at the notary.") },
    { title: L("Lokalno", "Local"), text: L("Svaki kraj ima svog agenta koji tu živi ili je tu odrastao.", "Every neighbourhood has an agent who lives there or grew up there.") },
  ],
  teamLabel: L("Tim", "Team"),
  teamTitle: L("Upoznajte agente.", "Meet the agents."),
  since: L("u Koti od", "at Kota since"),
  deals: L("zaključenih poslova", "deals closed"),
  trustLabel: L("Garancije", "Assurances"),
  trust: [
    { title: L("Licencirani posrednici", "Licensed brokers"), text: L("Svi agenti imaju položen stručni ispit za posrednike u prometu nepokretnosti.", "Every agent holds the state brokerage licence.") },
    { title: L("Osiguranje od odgovornosti", "Liability insurance"), text: L("Polisa profesionalne odgovornosti pokriva svaki posao koji vodimo.", "Professional liability insurance covers every deal we handle.") },
    { title: L("Ugovori na dva jezika", "Bilingual contracts"), text: L("Ugovori o posredovanju na srpskom i engleskom, za kupce iz inostranstva.", "Brokerage agreements in Serbian and English for international clients.") },
    { title: L("Registar posrednika", "Register of brokers"), text: L("Upisani u Registar posrednika pod brojem RPN 000 (demo).", "Listed in the Register of Brokers as RPN 000 (demo).") },
  ],
  officeLabel: L("Kancelarija", "Office"),
  officeTitle: L("Ulica Modene 3, prvi sprat.", "3 Modene Street, first floor."),
  officeText: L(
    "Dva minuta od Trga slobode, iznad knjižare. Kafa je uvek spremna; zvono je ono sa mesinganim znakom ▽.",
    "Two minutes from Liberty Square, above the bookshop. The coffee's always on; ours is the doorbell with the brass ▽.",
  ),
};

export const reviewsPage = {
  metaTitle: L("Utisci klijenata: Kota nekretnine Novi Sad", "Client reviews: Kota Real Estate Novi Sad"),
  metaDescription: L(
    "4,9 od 5 na 127 Google utisaka. Pročitajte šta kupci, prodavci i stanari kažu o radu sa Kotom.",
    "4.9 out of 5 from 127 Google reviews. Read what buyers, sellers and tenants say about working with Kota.",
  ),
  label: L("Utisci", "Reviews"),
  title: L("Šta kažu komšije.", "What the neighbours say."),
  lead: L(
    "Utisci kupaca, prodavaca i stanara sa Google profila. Odgovaramo na svaki, i na one sa četiri zvezdice.",
    "Reviews from buyers, sellers and tenants on our Google profile. We reply to every one, including the four-star ones.",
  ),
  distribution: L("Raspodela ocena", "Rating breakdown"),
  write: L("Ostavite utisak na Google-u", "Leave a Google review"),
  note: L("Utisci su izmišljeni za potrebe koncept sajta.", "Reviews are fictional for this concept site."),
};

export const faqPage = {
  metaTitle: L("Česta pitanja o kupovini, prodaji i najmu u Novom Sadu", "FAQ: buying, selling and renting in Novi Sad"),
  metaDescription: L(
    "Provizija, uknjiženost, porez na prenos, stambeni krediti, kupovina iz inostranstva i najam: odgovori na pitanja koja čujemo svakog dana.",
    "Commission, registered title, transfer tax, mortgages, buying from abroad and renting: answers to the questions we hear every day.",
  ),
  label: L("Pitanja", "Questions"),
  title: L("Česta pitanja.", "Frequently asked."),
  lead: L("Ako ovde nema vašeg pitanja, pozovite; odgovaramo i subotom.", "If your question isn't here, call us; we answer on Saturdays too."),
};

export const contactPage = {
  metaTitle: L("Kontakt i zakazivanje razgledanja", "Contact us and book a viewing"),
  metaDescription: L(
    "Kota nekretnine, Ulica Modene 3, Novi Sad. Radnim danima 9–19h, subotom 10–15h. Zakažite razgledanje, procenu ili sastanak.",
    "Kota Real Estate, 3 Modene Street, Novi Sad. Weekdays 9 am–7 pm, Saturdays 10 am–3 pm. Book a viewing, a valuation or a meeting.",
  ),
  label: L("Kontakt", "Contact"),
  title: L("Svratite, pozovite, pišite.", "Drop by, call or write."),
  lead: L(
    "Odgovaramo u roku od dva sata tokom radnog vremena. Za razgledanje izaberite termin ispod.",
    "We reply within two hours during opening hours. For a viewing, pick a time below.",
  ),
  mapTitle: L("Kancelarija Kote na mapi Novog Sada", "Kota's office on the Novi Sad map"),
  office: L("Kancelarija", "Office"),
  directions: L("Dva minuta od Trga slobode, iznad knjižare.", "Two minutes from Liberty Square, above the bookshop."),
  formLabel: L("Upit", "Enquiry"),
  formTitle: L("Kako možemo da pomognemo?", "How can we help?"),
  steps: [L("Tema", "Topic"), L("Detalji", "Details"), L("Kontakt", "Contact")],
  topics: {
    buy: [L("Kupujem", "I'm buying"), L("Tražim stan ili kuću", "Looking for a flat or house")],
    sell: [L("Prodajem", "I'm selling"), L("Želim procenu i prodaju", "Want a valuation and sale")],
    rent: [L("Iznajmljujem", "I'm renting"), L("Tražim ili izdajem stan", "Looking for or letting a flat")],
    viewing: [L("Razgledanje", "A viewing"), L("Za konkretnu nekretninu", "For a specific property")],
  },
  hood: L("Kraj (opciono)", "Neighbourhood (optional)"),
  budget: L("Budžet ili cena (€)", "Budget or price (€)"),
  property: L("Nekretnina", "Property"),
  anyHood: L("Nije bitno", "No preference"),
  when: L("Kada vam odgovara poziv?", "When should we call?"),
  whenOptions: [L("Što pre", "As soon as possible"), L("Pre podne", "Morning"), L("Posle podne", "Afternoon"), L("Posle 17h", "After 5 pm")],
  message: L("Poruka", "Message"),
  name: L("Ime i prezime", "Full name"),
  phone: L("Telefon", "Phone"),
  email: L("Email", "Email"),
  next: L("Dalje", "Next"),
  back: L("Nazad", "Back"),
  submit: L("Pošalji upit", "Send enquiry"),
  errors: {
    topic: L("Izaberite temu.", "Choose a topic."),
    name: L("Upišite ime i prezime.", "Please enter your name."),
    contact: L("Upišite telefon ili email.", "Please enter a phone number or email."),
    email: L("Email adresa nije ispravna.", "That email address doesn't look right."),
  },
  successTitle: L("Hvala, javljamo se uskoro.", "Thank you, we'll be in touch soon."),
  successText: L("Agent za vaš kraj vas zove u roku od dva sata tokom radnog vremena.", "The agent for your area will call within two hours during opening hours."),
  demoNote: L("Ovo je demo sajt, upit nije poslat.", "This is a demo site; nothing was sent."),
  again: L("Pošalji novi upit", "Send another enquiry"),
};

export const privacyPage = {
  metaTitle: L("Politika privatnosti", "Privacy policy"),
  metaDescription: L("Kako Kota nekretnine prikuplja, koristi i čuva lične podatke.", "How Kota Real Estate collects, uses and stores personal data."),
  label: L("Pravno", "Legal"),
  title: L("Privatnost", "Privacy"),
  updated: L("Poslednja izmena: 28. septembar 2026.", "Last updated: 28 September 2026."),
  sections: [
    {
      h: L("Ko smo", "Who we are"),
      p: L(
        "Rukovalac podacima je Kota nekretnine d.o.o., Ulica Modene 3, 21000 Novi Sad (izmišljeno preduzeće; ovo je koncept sajt Scale by Noon). Za sva pitanja pišite na zdravo@kota-nekretnine.rs.",
        "The data controller is Kota nekretnine d.o.o., 3 Modene Street, 21000 Novi Sad (a fictional company; this is a Scale by Noon concept site). For any question, write to zdravo@kota-nekretnine.rs.",
      ),
    },
    {
      h: L("Šta prikupljamo", "What we collect"),
      p: L(
        "Ime, broj telefona, email i poruku koje unesete u formular za razgledanje, procenu ili kontakt, kao i osnovne podatke o nekretnini koju procenjujete. Na ovom demo sajtu formulari ništa ne šalju.",
        "The name, phone number, email and message you enter in the viewing, valuation or contact forms, plus basic details of the property you value. On this demo site the forms send nothing.",
      ),
    },
    {
      h: L("Zašto", "Why"),
      p: L(
        "Isključivo da bismo vam odgovorili, zakazali razgledanje ili pripremili procenu, u skladu sa Zakonom o zaštiti podataka o ličnosti Republike Srbije. Podatke ne prodajemo i ne delimo sa trećim licima osim uz vašu saglasnost (npr. notaru ili banci).",
        "Solely to reply to you, arrange a viewing or prepare a valuation, in line with Serbia's Personal Data Protection Act. We never sell your data or share it with third parties without your consent (e.g. with a notary or bank).",
      ),
    },
    {
      h: L("Koliko dugo", "How long"),
      p: L(
        "Upite čuvamo 12 meseci, a podatke iz zaključenih poslova onoliko koliko propisuju zakoni o posredovanju i sprečavanju pranja novca.",
        "We keep enquiries for 12 months, and data from completed deals for as long as brokerage and anti-money-laundering laws require.",
      ),
    },
    {
      h: L("Kolačići", "Cookies"),
      p: L(
        "Sajt ne koristi kolačiće za praćenje ni oglašavanje. U pregledaču čuvamo samo da li ste zatvorili oznaku „Koncept sajt“.",
        "The site uses no tracking or advertising cookies. We only store, in your browser, whether you dismissed the “Concept site” badge.",
      ),
    },
    {
      h: L("Vaša prava", "Your rights"),
      p: L(
        "Imate pravo na uvid, ispravku, brisanje i prenos podataka, kao i pravo da podnesete pritužbu Povereniku za informacije od javnog značaja i zaštitu podataka o ličnosti.",
        "You have the right to access, correct, delete and port your data, and to lodge a complaint with Serbia's Commissioner for Information of Public Importance and Personal Data Protection.",
      ),
    },
  ],
};
