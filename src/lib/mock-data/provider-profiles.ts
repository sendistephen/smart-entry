import { PortfolioMedia, ProviderProfile, ProviderReview } from "@/types";

// Placeholder media: picsum.photos serves a stable image per seed, and the MDN
// sample clip stands in for provider-uploaded work videos in this prototype.
const SAMPLE_VIDEO =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

const photo = (
  id: string,
  seed: string,
  width: number,
  height: number,
  caption: string
): PortfolioMedia => ({
  id,
  kind: "image",
  src: `https://picsum.photos/seed/${seed}/${width}/${height}`,
  aspect: width / height,
  caption,
});

const clip = (id: string, seed: string, caption: string): PortfolioMedia => ({
  id,
  kind: "video",
  src: SAMPLE_VIDEO,
  poster: `https://picsum.photos/seed/${seed}/540/960`,
  aspect: 9 / 16,
  caption,
  platform: "file",
});

const review = (
  id: string,
  author: string,
  unit: string,
  rating: number,
  comment: string,
  date: string
): ProviderReview => ({ id, author, unit, rating, comment, date });

export const providerProfiles: Record<string, ProviderProfile> = {
  "srv-1": {
    providerId: "srv-1",
    tagline: "Leak-free homes, fixed right the first time.",
    yearsExperience: 12,
    completedJobs: 640,
    responseTime: "Under 45 min",
    languages: ["English", "Luganda"],
    services: ["Leak detection", "Pressure pump install", "Pipe repair", "Bathroom fittings", "Drain unclogging"],
    certifications: ["Licensed Master Plumber", "UNBS Fittings Certified"],
    portfolio: [
      photo("p1-1", "plumb-a", 800, 1000, "Bathroom re-pipe in Kololo"),
      clip("p1-2", "plumb-b", "Pressure pump install, start to finish"),
      photo("p1-3", "plumb-c", 800, 600, "Concealed leak repair"),
      photo("p1-4", "plumb-d", 800, 800, "New sanitary fittings"),
      photo("p1-5", "plumb-e", 800, 1100, "Rooftop tank plumbing"),
      photo("p1-6", "plumb-f", 800, 650, "Kitchen sink relocation"),
      clip("p1-7", "plumb-g", "Quick tour: drain unclogging"),
    ],
    reviews: [
      review("r1-1", "Sarah N.", "Acacia Heights, B-201", 5, "Arrived within 35 minutes of request. Replaced the burst connector cleanly and left zero mess.", "2026-09-28"),
      review("r1-2", "Daniel K.", "Nakasero Court, A-12", 5, "Found a hidden leak two other plumbers missed. Fair price, clear explanation.", "2026-09-10"),
      review("r1-3", "Grace A.", "Kololo Towers, 7C", 4, "Great work on the pump. Slightly late, but he called ahead.", "2026-08-22"),
    ],
  },
  "srv-2": {
    providerId: "srv-2",
    tagline: "Safe wiring and reliable backup power.",
    yearsExperience: 9,
    completedJobs: 520,
    responseTime: "Under 1 hr",
    languages: ["English", "Luganda", "Swahili"],
    services: ["House wiring", "Inverter installation", "Breaker panels", "Lighting design", "Fault finding"],
    certifications: ["Certified Electrician (ERA)", "Solar & Inverter Installer"],
    portfolio: [
      photo("p2-1", "elec-a", 800, 1000, "Inverter and battery bank"),
      photo("p2-2", "elec-b", 800, 600, "New distribution board"),
      clip("p2-3", "elec-c", "Wiring a new apartment"),
      photo("p2-4", "elec-d", 800, 900, "Feature lighting, living room"),
      photo("p2-5", "elec-e", 800, 700, "Security floodlights"),
      photo("p2-6", "elec-f", 800, 1100, "Meter room rewire"),
    ],
    reviews: [
      review("r2-1", "Peter M.", "Bukoto Gardens, C-4", 5, "Inverter installed in one afternoon, and the tidy wiring impressed our landlord.", "2026-09-19"),
      review("r2-2", "Ruth T.", "Naguru Heights, 3B", 5, "Diagnosed a tripping breaker in minutes. Explained everything.", "2026-09-02"),
    ],
  },
  "srv-3": {
    providerId: "srv-3",
    tagline: "Spotless spaces with eco-friendly products.",
    yearsExperience: 6,
    completedJobs: 410,
    responseTime: "Same day",
    languages: ["English", "Luganda"],
    services: ["Deep cleaning", "Move-in / move-out", "Carpet washing", "Sofa shampooing"],
    certifications: ["Eco-Safe Products Partner"],
    portfolio: [
      photo("p3-1", "clean-a", 800, 600, "Before and after: kitchen deep clean"),
      photo("p3-2", "clean-b", 800, 1000, "Carpet restoration"),
      clip("p3-3", "clean-c", "Sofa shampoo time-lapse"),
      photo("p3-4", "clean-d", 800, 800, "Move-out sanitization"),
      photo("p3-5", "clean-e", 800, 1050, "Bathroom descaling"),
    ],
    reviews: [
      review("r3-1", "Joan B.", "Acacia Heights, A-105", 5, "My carpets look brand new. The team was punctual and polite.", "2026-09-25"),
      review("r3-2", "Moses O.", "Bugolobi Flats, 2A", 4, "Thorough move-out clean, got our full deposit back.", "2026-08-30"),
    ],
  },
  "srv-4": {
    providerId: "srv-4",
    tagline: "Hardwood craftsmanship, made to fit your home.",
    yearsExperience: 14,
    completedJobs: 290,
    responseTime: "Within 24 hrs",
    languages: ["English", "Luganda"],
    services: ["Cabinet installation", "Door fitting", "Custom shelving", "Deck refurbishment", "Lock alignment"],
    certifications: ["Vocational Carpentry Diploma"],
    portfolio: [
      photo("p4-1", "wood-a", 800, 1050, "Walk-in wardrobe"),
      photo("p4-2", "wood-b", 800, 650, "Kitchen cabinets, mahogany"),
      photo("p4-3", "wood-c", 800, 900, "Solid hardwood door"),
      clip("p4-4", "wood-d", "Deck refurbishment walkthrough"),
      photo("p4-5", "wood-e", 800, 750, "Floating shelves"),
    ],
    reviews: [
      review("r4-1", "Alice W.", "Muyenga Terrace, 5D", 5, "The wardrobe fits the alcove perfectly. Beautiful finish.", "2026-09-14"),
    ],
  },
  "srv-5": {
    providerId: "srv-5",
    tagline: "Fast diagnostics, honest repairs.",
    yearsExperience: 8,
    completedJobs: 380,
    responseTime: "Under 1 hr",
    languages: ["English", "Luganda"],
    services: ["Washing machines", "Refrigerators", "Microwaves", "Split AC service"],
    certifications: ["Manufacturer-Trained Technician"],
    portfolio: [
      photo("p5-1", "appl-a", 800, 700, "AC deep service"),
      clip("p5-2", "appl-b", "Fridge compressor swap"),
      photo("p5-3", "appl-c", 800, 1000, "Washing machine rebuild"),
      photo("p5-4", "appl-d", 800, 800, "Split unit install"),
    ],
    reviews: [
      review("r5-1", "Esther L.", "Kololo Towers, 9A", 5, "Fixed our fridge the same day and saved us a replacement.", "2026-09-21"),
      review("r5-2", "Samuel R.", "Bugolobi Flats, 4C", 4, "AC is colder than ever. Good value.", "2026-08-12"),
    ],
  },
  "srv-6": {
    providerId: "srv-6",
    tagline: "Gardens that make the compound feel alive.",
    yearsExperience: 7,
    completedJobs: 230,
    responseTime: "Within 24 hrs",
    languages: ["English", "Luganda"],
    services: ["Lawn mowing", "Hedge trimming", "Pest control", "Flower bed design"],
    certifications: ["Horticulture Certificate"],
    portfolio: [
      photo("p6-1", "garden-a", 800, 600, "Estate lawn makeover"),
      photo("p6-2", "garden-b", 800, 1000, "Flower bed design"),
      photo("p6-3", "garden-c", 800, 800, "Hedge sculpting"),
      clip("p6-4", "garden-d", "Compound reset in one day"),
      photo("p6-5", "garden-e", 800, 1100, "Tropical corner planting"),
    ],
    reviews: [
      review("r6-1", "Henry S.", "Wakiso Gardens, Villa 8", 5, "Our compound has never looked this good.", "2026-09-05"),
    ],
  },
  "srv-7": {
    providerId: "srv-7",
    tagline: "Crisp finishes, protected walls.",
    yearsExperience: 5,
    completedJobs: 160,
    responseTime: "Within 24 hrs",
    languages: ["English", "Luganda"],
    services: ["Interior painting", "Exterior sealant", "Textured coatings", "Trim repainting"],
    certifications: [],
    portfolio: [
      photo("p7-1", "paint-a", 800, 1000, "Textured accent wall"),
      photo("p7-2", "paint-b", 800, 650, "Exterior waterproof coat"),
      clip("p7-3", "paint-c", "Roller technique and prep"),
      photo("p7-4", "paint-d", 800, 850, "Two-tone living room"),
    ],
    reviews: [
      review("r7-1", "Irene P.", "Naguru Heights, 6A", 5, "Neat edges and no splatter anywhere.", "2026-09-01"),
    ],
  },
  "srv-8": {
    providerId: "srv-8",
    tagline: "Keeping gates, barriers and intercoms running.",
    yearsExperience: 11,
    completedJobs: 310,
    responseTime: "Under 1 hr",
    languages: ["English", "Luganda", "Swahili"],
    services: ["Intercom repair", "Barrier servicing", "Swing gate automation", "Security lighting"],
    certifications: ["Access Control Systems Certified"],
    portfolio: [
      photo("p8-1", "gate-a", 800, 700, "Automated swing gate"),
      photo("p8-2", "gate-b", 800, 1000, "Intercom panel upgrade"),
      clip("p8-3", "gate-c", "Barrier motor service"),
      photo("p8-4", "gate-d", 800, 900, "Perimeter security lights"),
      photo("p8-5", "gate-e", 800, 600, "Gate control board repair"),
    ],
    reviews: [
      review("r8-1", "Estate Manager", "Acacia Heights", 5, "Our barrier has not failed once since the service.", "2026-09-17"),
      review("r8-2", "Mark J.", "Kololo Towers", 5, "Responded to a gate emergency at night. Excellent.", "2026-08-27"),
    ],
  },
};
