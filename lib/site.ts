// Edit this file to change contact details and page content.
export const site = {
  name: "The Tracker Guy",
  whatsapp: "2347049381183", 
  phone: "+234 704 938 1183", 
  email: "fawas@thetrackerguy.com.ng",
  location: "Lagos, Nigeria",
  url: "https://thetrackerguy.com.ng",
};

export const nav = [
  { href: "#top", label: "Home" },
  { href: "#services", label: "Services" },
  { href: "#about", label: "About" },
  { href: "#plans", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export const vehicles = [
  { icon: "car", label: "Cars" },
  { icon: "bike", label: "Bikes" },
  { icon: "keke", label: "Keke" },
  { icon: "truck", label: "Trucks" },
  { icon: "bus", label: "Buses" },
  { icon: "boat", label: "Boats" },
  { icon: "fleet", label: "Fleets" },
] as const;

export const steps = [
  "Tell us your vehicle and needs",
  "We install the tracker",
  "Follow it live on your phone",
];

export const support = [
  { icon: "wrench", title: "Professional installation", text: "We fit the tracker and test it with you before we leave, so you know it works." },
  { icon: "pin", title: "Live monitoring", text: "Open the app any time to see where your vehicle is and where it has been." },
  { icon: "phone", title: "Support when you need it", text: "Call or message us on WhatsApp if you have a question or need a check-up." },
] as const;

export const services = [
  { icon: "wrench", title: "Tracker installation", text: "Clean, tested installation on cars, bikes, keke, trucks, buses and boats." },
  { icon: "pin", title: "Real-time tracking", text: "Check where your vehicle is from your phone, any time." },
  { icon: "shield", title: "Anti-theft protection", text: "Get an alert if your vehicle moves when it should not, with help to recover it." },
  { icon: "fleet", title: "Fleet tracking", text: "See all your company vehicles in one place and review trips and mileage. Message us for a quote." },
  { icon: "bike", title: "Motorcycle tracking", text: "Small trackers that suit bikes, for owners and dispatch riders." },
  { icon: "phone", title: "Support and check-ups", text: "Need help with your tracker or app? Call or message us." },
] as const;

export const meet = {
  eyebrow: "Meet The Tracker Guy",
  title: "Hi, I'm Fawas",
  // Put a photo in /public (for example /public/fawas.jpg) and set photo: "/fawas.jpg". Empty shows the logo.
  photo: "/fawas.jpg",
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
  promise: "Message me on WhatsApp between 7\u00a0a.m. and 10\u00a0p.m. and you will be talking to me, a real person.",
  fits: [
    { icon: "car", label: "Cars" },
    { icon: "bike", label: "Bikes" },
    { icon: "keke", label: "Keke" },
    { icon: "truck", label: "Trucks" },
    { icon: "bus", label: "Buses" },
    { icon: "boat", label: "Boats" },
  ],
  sameDay: ["Lagos"],
  otherStates: ["Abuja", "Port Harcourt", "Ogun State", "Ibadan", "Kaduna", "Nasarawa"],
  otherDays: "Same day or up to 3 days",
};

export const commonFeatures = [
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
];

export const simNote = "SIM data is not included. You pay for the tracker's SIM data yourself, on both trackers.";

export const tiers = [
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
  },
];

export const faqs = [
  { q: "How long does installation take?", a: "In Lagos we install the same day. In other states we install the same day or within up to 3 days. We come to you." },
  { q: "Can I follow my vehicle from my phone?", a: "Yes. You use an app on your phone to see where the vehicle is and where it has been." },
  { q: "Do you track motorcycles and trucks?", a: "Yes. We install trackers on cars, bikes, keke, trucks, buses, boats and fleets." },
  { q: "What does the yearly renewal cover?", a: "On the Standard tracker, the ₦20,000 renewal after the first year covers server hosting, app access and system maintenance." },
  { q: "Who pays for the SIM data?", a: "You do. The tracker uses a SIM card to send its location, and the data for it is paid for by you on both trackers." },
  { q: "What is audio monitoring?", a: "The Advanced tracker has a microphone, so you can listen to what is happening inside the vehicle. The Standard tracker does not have this." },
  { q: "Where do you install?", a: "We come to you. Installation is same day in Lagos. In other states, such as Abuja, Port Harcourt, Ogun State, Ibadan, Kaduna and Nasarawa, it is same day or up to 3 days." },
  { q: "Who will I speak to?", a: "A real person, on WhatsApp from 7 a.m. to 10 p.m. That is me, Fawas." },
];

export const socials = [
  { label: "TikTok", href: "https://www.tiktok.com/@thetrackerguy_" },
  { label: "Instagram", href: "https://www.instagram.com/thetrackerguy_" },
  { label: "Facebook", href: "https://www.facebook.com/share/1D2Kxeji55/?mibextid=wwXIfr" },
  { label: "X (Twitter)", href: "https://x.com/thetrackerguy_" },
];
