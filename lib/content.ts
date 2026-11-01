// Default website content.
// The admin panel (/admin) saves edits to Firestore (document content/main).
// Saved edits are laid over these defaults, so anything not edited keeps the value below.

export const defaultContent = {
  seo: {
    title: "Vehicle Tracker Installation in Lagos and Nigeria | The Tracker Guy",
    description:
      "The Tracker Guy installs GPS vehicle trackers on cars, bikes, keke, trucks, buses, boats and fleets. Same day installation in Lagos. Live location on your phone, instant alerts and trip history.",
  },

  business: {
    name: "The Tracker Guy",
    whatsapp: "2347049381183",
    phone: "+234 704 938 1183",
    email: "fawas@thetrackerguy.com.ng",
    location: "Lagos, Nigeria",
    url: "https://thetrackerguy.com.ng",
  },

  nav: {
    links: [
      { href: "#top", label: "Home" },
      { href: "#services", label: "Services" },
      { href: "#about", label: "About" },
      { href: "#plans", label: "Pricing" },
      { href: "#faq", label: "FAQ" },
    ],
    call: "Call us",
    quote: "Get a quote",
  },

  hero: {
    title: "Always know where your vehicle is",
    text: "We install GPS trackers in cars, bikes, trucks and fleets. Follow your vehicle live from your phone, get instant alerts and review every trip.",
    ctaPrimary: "Get a free quote",
    ctaSecondary: "See our services",
    statusLabel: "Vehicle status",
    statusValue: "Moving, 62 km/h",
    statusTag: "Live",
    trackerTitle: "GPS tracker",
    trackerSub: "Signal strong",
    distanceLabel: "Today's distance",
    distanceValue: "48.2 km",
  },

  vehicles: {
    title: "Trackers for every kind of vehicle",
    items: [
      { icon: "car", label: "Cars" },
      { icon: "bike", label: "Bikes" },
      { icon: "keke", label: "Keke" },
      { icon: "truck", label: "Trucks" },
      { icon: "bus", label: "Buses" },
      { icon: "boat", label: "Boats" },
      { icon: "fleet", label: "Fleets" },
    ],
  },

  how: {
    title: "How we keep your vehicle protected",
    text: "From the first call to the day it is installed, we handle the whole process. You get a working tracker and a simple app to follow your vehicle.",
    steps: ["Tell us your vehicle and needs", "We install the tracker", "Follow it live on your phone"],
    support: [
      { icon: "wrench", title: "Professional installation", text: "We fit the tracker and test it with you before we leave, so you know it works." },
      { icon: "pin", title: "Live monitoring", text: "Open the app any time to see where your vehicle is and where it has been." },
      { icon: "phone", title: "Support when you need it", text: "Call or message us on WhatsApp if you have a question or need a check-up." },
    ],
  },

  services: {
    title: "Our services",
    text: "Everything you need to install, follow and protect your vehicle.",
    items: [
      { icon: "wrench", title: "Tracker installation", text: "Clean, tested installation on cars, bikes, keke, trucks, buses and boats." },
      { icon: "pin", title: "Real-time tracking", text: "Check where your vehicle is from your phone, any time." },
      { icon: "shield", title: "Anti-theft protection", text: "Get an alert if your vehicle moves when it should not, with help to recover it." },
      { icon: "fleet", title: "Fleet tracking", text: "See all your company vehicles in one place and review trips and mileage. Message us for a quote." },
      { icon: "bike", title: "Motorcycle tracking", text: "Small trackers that suit bikes, for owners and dispatch riders." },
      { icon: "phone", title: "Support and check-ups", text: "Need help with your tracker or app? Call or message us." },
    ],
  },

  features: {
    title: "Features you get with every tracker",
    text: "Simple tools that help you keep your vehicle safe and keep an eye on how it is used.",
    cta: "Get a quote",
    live: {
      title: "Live tracking",
      text: "See the exact location of your vehicle on the map, updated as it moves.",
      chipTitle: "Your car",
      chipSub: "Moving, 62 km/h",
    },
    alerts: {
      title: "Instant alerts",
      text: "Get notified when your vehicle starts, leaves an area you set or moves when it should not.",
      items: [
        { icon: "power", title: "Ignition on", time: "2 min ago", warn: false },
        { icon: "bell", title: "Left safe zone", time: "Just now", warn: true },
        { icon: "shield", title: "Back in safe zone", time: "Today", warn: false },
      ],
    },
    trips: {
      title: "Trip history",
      text: "Replay past trips, see where it stopped and how far it went.",
      chipTitle: "Trip history",
      chipSub: "Routes, stops, distance",
    },
  },

  meet: {
    eyebrow: "Meet The Tracker Guy",
    title: "Hi, I'm Fawas",
    photoAlt: "Fawas, The Tracker Guy",
    badges: ["Family in the trade since 2010", "1,000+ trackers installed"],
    paragraphs: [
      "Most people just call me the Tracker Guy. My family has been fitting vehicle trackers since 2010, and today I run my own business doing the same. Between us, we have installed over 1,000 trackers in cars, boats, trucks and fleets.",
      "Here is what most people get wrong. They treat a tracker like a gadget you buy. It is not. Placement is the job, and the wiring is the easy part. A tracker a thief finds in four seconds was never protecting anything.",
    ],
    stepsTitle: "How I install",
    steps: [
      "We photograph your vehicle before we touch it.",
      "We fit the tracker where nobody thinks to check.",
      "We do not leave until you have seen your own vehicle live on your phone.",
    ],
    promise: "Message me on WhatsApp between 7 a.m. and 10 p.m. and you will be talking to me, a real person.",
    messageButton: "Message Fawas",
    fitsTitle: "What we fit",
    fitsText: "Trackers for every kind of vehicle, across selected states in Nigeria.",
    fits: [
      { icon: "car", label: "Cars" },
      { icon: "bike", label: "Bikes" },
      { icon: "keke", label: "Keke" },
      { icon: "truck", label: "Trucks" },
      { icon: "bus", label: "Buses" },
      { icon: "boat", label: "Boats" },
    ],
    whereTitle: "Where we install",
    whereText: "We come to you.",
    sameDayLabel: "Same day",
    sameDay: ["Lagos"],
    otherStatesLabel: "Other states",
    otherStates: ["Abuja", "Port Harcourt", "Ogun State", "Ibadan", "Kaduna", "Nasarawa"],
    otherDays: "Same day or up to 3 days",
    notListed: "Not on the list? Message us and we will tell you.",
  },

  benefits: {
    title: "Why people choose a tracker",
    items: [
      "Help recover a vehicle if it is stolen",
      "Alerts straight to your phone",
      "Know where drivers and staff vehicles are",
      "Mileage and trip reports",
      "Peace of mind when you are away",
    ],
    listTitle: "My vehicles",
    listTag: "2 online",
    rows: [
      { icon: "car", name: "Camry", sub: "Parked, Home", on: true },
      { icon: "truck", name: "Delivery van", sub: "Moving, 48 km/h", on: true },
      { icon: "bike", name: "Bike", sub: "Offline", on: false },
    ],
    cardTitle: "The Tracker Guy",
    cardSub: "Here to help",
    badge: "Tracker installed and online",
  },

  plans: {
    title: "Two trackers. Simple prices.",
    text: "Both trackers do the same tracking. The Advanced tracker adds audio monitoring.",
    tiers: [
      {
        id: "standard",
        name: "Standard tracker",
        price: "₦100,000",
        tag: "One-time payment",
        blurb: "Full GPS tracking and alerts for your vehicle.",
        badge: "",
        points: ["Every tracking feature listed below"],
        missing: "In-car audio monitoring",
        fee: "₦20,000 yearly renewal after the first year",
        note: "The renewal keeps your tracker online. It covers server hosting, app access and system maintenance.",
        plan: "Standard tracker (₦100,000)",
        button: "Get the Standard tracker",
      },
      {
        id: "advanced",
        name: "Advanced tracker",
        price: "₦125,000",
        tag: "One-time payment",
        blurb: "Everything in Standard, plus audio monitoring.",
        badge: "Includes audio monitoring",
        points: [
          "Every tracking feature listed below",
          "In-car audio monitoring",
          "Its own app, with an optional subscription for extra features from ₦599 per month",
        ],
        missing: "",
        fee: "No yearly renewal fee",
        note: "Accounts with more than two vehicles need the in-app subscription. Audio monitoring is for vehicles you own, so tell drivers and passengers it is fitted.",
        plan: "Advanced tracker (₦125,000)",
        button: "Get the Advanced tracker",
      },
    ],
    simNote: "SIM data is not included. You pay for the tracker's SIM data yourself, on both trackers.",
    fleetText: "Tracking a fleet? Fleet pricing is quoted separately.",
    fleetLink: "Message us for a quote",
    fleetMessage: "Hello, I would like a fleet tracking quote.",
    featuresTitle: "Both trackers include",
    features: [
      "Real-time GPS tracking",
      "Mobile app access",
      "Live location updates",
      "Ignition alerts",
      "Geo-fencing alerts",
      "Route playback",
      "Position reports",
      "Last known location",
      "Alarm reports",
      "Speed reports",
      "Sign-in activity reports",
      "Anti-tamper alerts",
    ],
  },

  faq: {
    title: "Questions people ask",
    text: "Cannot find your answer? Message us and we will help.",
    items: [
      { q: "How long does installation take?", a: "In Lagos we install the same day. In other states we install the same day or within up to 3 days. We come to you." },
      { q: "Can I follow my vehicle from my phone?", a: "Yes. You use an app on your phone to see where the vehicle is and where it has been." },
      { q: "Do you track motorcycles and trucks?", a: "Yes. We install trackers on cars, bikes, keke, trucks, buses, boats and fleets." },
      { q: "What does the yearly renewal cover?", a: "On the Standard tracker, the ₦20,000 renewal after the first year covers server hosting, app access and system maintenance." },
      { q: "Who pays for the SIM data?", a: "You do. The tracker uses a SIM card to send its location, and the data for it is paid for by you on both trackers." },
      { q: "What is audio monitoring?", a: "The Advanced tracker has a microphone, so you can listen to what is happening inside the vehicle. The Standard tracker does not have this." },
      { q: "Where do you install?", a: "We come to you. Installation is same day in Lagos. In other states, such as Abuja, Port Harcourt, Ogun State, Ibadan, Kaduna and Nasarawa, it is same day or up to 3 days." },
      { q: "Who will I speak to?", a: "A real person, on WhatsApp from 7 a.m. to 10 p.m. That is me, Fawas." },
    ],
  },

  quote: {
    title: "Get a free quote",
    nameLabel: "Your name",
    namePlaceholder: "Enter your name",
    phoneLabel: "Phone number",
    phonePlaceholder: "Enter your phone number",
    vehicleLabel: "Vehicle",
    vehicleOptions: ["Car", "Bike", "Keke", "Truck", "Bus", "Boat", "Fleet"],
    messageLabel: "Message",
    optionalLabel: "(optional)",
    messagePlaceholder: "Tell us about your vehicle",
    button: "Send on WhatsApp",
    note: "This opens WhatsApp with your details filled in.",
    errorNote: "Please fill in your name and phone number.",
    sendingNote: "Opening WhatsApp...",
    whatsappIntro: "Hello, I would like a tracker quote.",
    planMessage: "I am interested in the {plan}.",
  },

  footer: {
    tagline: "Vehicle tracker installation and support.",
    whatsappButton: "Chat on WhatsApp",
    companyTitle: "Company",
    contactTitle: "Contact",
    followTitle: "Follow us",
    rights: "All rights reserved.",
  },

  // The installation form page at /form (shared by link, not in the menu).
  installForm: {
    title: "Vehicle Tracker Installation Form",
    description: "Please provide your details and vehicle information to complete your tracker installation and set up.",
    requiredNote: "* Indicates required question",
    nameLabel: "Name",
    addressLabel: "Address",
    emailLabel: "Email Address",
    vehicleLabel: "Vehicle make",
    phoneLabel: "Phone number",
    plateLabel: "Plate Number If Available",
    requiredError: "This is a required question",
    emailError: "Must be a valid email",
    submitButton: "Submit",
    clearButton: "Clear form",
    sendingText: "Submitting...",
    successText: "Your response has been recorded.",
    anotherLink: "Submit another response",
    errorText: "Something went wrong. Please try again, or message us on WhatsApp.",
  },

  socials: [
    { label: "TikTok", href: "https://www.tiktok.com/@thetrackerguy_" },
    { label: "Instagram", href: "https://www.instagram.com/thetrackerguy_" },
    { label: "Facebook", href: "https://www.facebook.com/share/1D2Kxeji55/?mibextid=wwXIfr" },
    { label: "X (Twitter)", href: "https://x.com/thetrackerguy_" },
  ],
};

export type Content = typeof defaultContent;

/** Images stay in /public and are not edited from the admin. */
export const images = { photo: "/fawas.jpg", logo: "/logo.png" };

type Plain = Record<string, unknown>;
const isObj = (v: unknown): v is Plain => !!v && typeof v === "object" && !Array.isArray(v);

/** Lay saved edits over the defaults. Objects merge key by key; arrays and values are replaced. */
export function mergeContent<T>(base: T, over: unknown): T {
  if (!isObj(base) || !isObj(over)) {
    if (Array.isArray(base)) {
      if (!Array.isArray(over)) return base;
      // Arrays of objects: keep the saved list, but fill any missing fields from the default shape.
      if (isObj(base[0])) return over.map((item, i) => mergeContent(base[i] ?? base[0], item)) as T;
      return over as T;
    }
    return (over === undefined || over === null || typeof over !== typeof base ? base : over) as T;
  }
  const out: Plain = { ...base };
  for (const k of Object.keys(base)) out[k] = mergeContent((base as Plain)[k], over[k]);
  return out as T;
}

/** "₦100,000" -> 100000 */
export const priceToNumber = (p: string) => Number(String(p).replace(/[^\d.]/g, "")) || 0;

/** Firestore location of the website content. */
export const CONTENT_DOC = { collection: "content", id: "main" };
