// ChatBubble.tsx — a single chat bubble + avatar, used by both desktop and mobile.
// side="left"  → light bubble, avatar bottom-left  (received message)
// side="right" → blue bubble,  avatar top-right     (sent message)

import Avatar from "./Avatar";
import type { Testimonial } from "@/data/home/testimonials";

interface Props {
  person: Testimonial;
  side:   "left" | "right";
}

const isLeft = (side: "left" | "right") => side === "left";

export default function ChatBubble({ person, side }: Props) {
  const left = isLeft(side);

  return (
    <div
      className="flex flex-col"
      style={{
        alignItems: left ? "flex-start" : "flex-end",
        width:      "100%",
      }}
    >
      {/* ── Right side: avatar sits top-right above the bubble ── */}
      {!left && (
        <div className="flex items-center gap-2 mb-3" style={{ alignSelf: "flex-end" }}>
          <div>
            <p
              className="text-[13px] font-semibold text-right"
              style={{ color: "var(--foreground)", fontFamily: "var(--font-geist-sans)" }}
            >
              {person.name}
            </p>
            <p
              className="text-[11px] text-right"
              style={{ color: "var(--text-muted)" }}
            >
              {person.role} · {person.business}
            </p>
          </div>
          <Avatar person={person} size={48} />
        </div>
      )}

      {/* ── Bubble ── */}
      <div
        style={{
          position:     "relative",
          maxWidth:     "88%",
          padding:      "16px 20px",
          borderRadius: left
            ? "4px 18px 18px 18px"   // received — flat top-left corner
            : "18px 4px 18px 18px",  // sent — flat top-right corner
          background:   left ? "var(--surface)" : "var(--brand)",
          border:       left ? "1px solid var(--border)" : "none",
          boxShadow:    left
            ? "0 2px 12px rgba(15,23,42,0.06)"
            : "0 4px 20px rgba(59,130,246,0.25)",
        }}
      >
        {/* Quote mark */}
        <span
          style={{
            display:    "block",
            fontSize:   "28px",
            lineHeight: 1,
            marginBottom: "6px",
            color:      left ? "var(--brand)" : "rgba(255,255,255,0.45)",
            fontFamily: "Georgia, serif",
          }}
          aria-hidden
        >
          "
        </span>

        <p
          style={{
            fontSize:   "15px",
            lineHeight: "1.72",
            color:      left ? "var(--foreground)" : "white",
            fontFamily: "var(--font-geist-sans)",
            margin:     0,
          }}
        >
          {person.quote}
        </p>

        {/* Timestamp-style label — adds to chat feel */}
        <p
          style={{
            fontSize:   "10px",
            marginTop:  "10px",
            textAlign:  "right",
            color:      left ? "var(--text-subtle)" : "rgba(255,255,255,0.5)",
            fontFamily: "var(--font-geist-mono)",
          }}
        >
          Plurse user ✓✓
        </p>
      </div>

      {/* ── Left side: avatar sits bottom-left below the bubble ── */}
      {left && (
        <div className="flex items-center gap-2 mt-3">
          <Avatar person={person} size={48} />
          <div>
            <p
              className="text-[13px] font-semibold"
              style={{ color: "var(--foreground)", fontFamily: "var(--font-geist-sans)" }}
            >
              {person.name}
            </p>
            <p
              className="text-[11px]"
              style={{ color: "var(--text-muted)" }}
            >
              {person.role} · {person.business}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}