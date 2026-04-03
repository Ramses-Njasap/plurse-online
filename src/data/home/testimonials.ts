// testimonials.ts — single source of truth for all testimonial content.
// To add, edit or remove a testimonial, only touch this file.
// Photos: use a real URL or leave photo as null to show the default avatar.

export interface Testimonial {
  id:       string;
  name:     string;
  business: string;
  role:     string;
  quote:    string;
  photo:    string | null; // null = show default avatar
  initial:  string;        // shown when photo is null
  avatarBg: string;        // fallback avatar background color
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id:       "sataa",
    name:     "Sataa's Plumbing",
    business: "Plumbing Services",
    role:     "Owner",
    quote:    "Activity logging ensures we never miss a detail. Plurse keeps us completely in control — even with a large team working across multiple sites.",
    photo:    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    initial:  "S",
    avatarBg: "#3b82f6",
  },
  {
    id:       "michy",
    name:     "Michy's Empire",
    business: "Beauty & Cosmetics",
    role:     "Founder",
    quote:    "Real-time updates eliminated our inventory errors overnight. I used to spend hours reconciling stock — now Plurse does it automatically. It's a must-have.",
    photo:    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80",
    initial:  "M",
    avatarBg: "#8b5cf6",
  },
  {
    id:       "lifespring",
    name:     "Life Spring",
    business: "Pharmacy",
    role:     "Manager",
    quote:    "Customer tracking has genuinely transformed how we serve our clients. We know what they need before they ask. Plurse delivers on every single promise.",
    photo:    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&q=80",
    initial:  "L",
    avatarBg: "#10b981",
  },
  {
    id:       "placeholder-1",
    name:     "Your Business Here",
    business: "Your Industry",
    role:     "Owner",
    quote:    "This is where your story goes. We'd love to hear how Plurse has helped your business grow. Get in touch and share your experience with us.",
    photo:    null,
    initial:  "Y",
    avatarBg: "#f59e0b",
  },
];

// Pair testimonials for desktop view — [left, right]
// Adjust pairing order here without touching any component.
export const PAIRS: [Testimonial, Testimonial][] = [
  [TESTIMONIALS[0], TESTIMONIALS[1]],
  [TESTIMONIALS[2], TESTIMONIALS[3]],
];