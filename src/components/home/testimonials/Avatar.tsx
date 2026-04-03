// Avatar.tsx — shows photo if available, falls back to initial + color

import type { Testimonial } from "@/data/home/testimonials";

interface Props {
  person: Testimonial;
  size?:  number; // px
}

export default function Avatar({ person, size = 52 }: Props) {
  return person.photo ? (
    <img
      src={person.photo}
      alt={person.name}
      style={{
        width:        size,
        height:       size,
        borderRadius: "50%",
        objectFit:    "cover",
        flexShrink:   0,
        border:       "2px solid var(--border)",
        display:      "block",
      }}
    />
  ) : (
    <div
      style={{
        width:        size,
        height:       size,
        borderRadius: "50%",
        background:   person.avatarBg,
        display:      "flex",
        alignItems:   "center",
        justifyContent: "center",
        color:        "white",
        fontSize:     size * 0.38,
        fontWeight:   700,
        flexShrink:   0,
        fontFamily:   "var(--font-geist-sans)",
        border:       "2px solid var(--border)",
      }}
    >
      {person.initial}
    </div>
  );
}