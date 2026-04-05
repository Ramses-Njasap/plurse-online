"use client";

// Segments.tsx — Zone 3
// Four segment types — tabbed on desktop, stacked on mobile

import { useState } from "react";
import { SEGMENTS } from "@/data/solutions/customers/data";


const Segments = () => {
    const [activeIdx, setActiveIdx] = useState(0);
    const segment = SEGMENTS[activeIdx];

    return (
        <section
            className="relative z-10 px-5 sm:px-8 py-24 sm:py-32"
            style={{ background: "var(--background)", borderTop: "1px solid var(--border)" }}
        >
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-12">
                    <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "var(--brand)" }}>
                        Customer Intelligence
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                        <h2
                            className="text-[2rem] sm:text-[2.25rem] font-bold tracking-[-0.025em] leading-[1.12]"
                            style={{ color: "var(--foreground)", fontFamily: "var(--font-geist-sans)", margin: 0 }}
                        >
                            Not just a list of buyers.
                            <br /><span style={{ color: "var(--brand)" }}>A map of your best ones.</span>
                        </h2>
                        <p
                            className="text-[14px] leading-[1.7] sm:text-right"
                            style={{ color: "var(--text-muted)", maxWidth: "300px", margin: 0, flexShrink: 0 }}
                        >
                            Plurse automatically segments your customers so you always
                            know who matters most and why.
                        </p>
                    </div>
                </div>

                {/* Segment tabs */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {SEGMENTS.map((seg, i) => (
                        <button
                            key={seg.id}
                            onClick={() => setActiveIdx(i)}
                            className="rounded-lg font-medium text-[13.5px]"
                            style={{
                                padding: "9px 18px",
                                background: i === activeIdx ? "var(--brand)" : "var(--surface)",
                                color: i === activeIdx ? "white" : "var(--text-muted)",
                                border: i === activeIdx ? "1px solid var(--brand)" : "1px solid var(--border-strong)",
                                cursor: "pointer",
                                transition: "all 200ms ease",
                                fontFamily: "var(--font-geist-sans)",
                            }}
                            onMouseEnter={e => {
                                if (i === activeIdx) return;
                                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--brand)";
                                (e.currentTarget as HTMLButtonElement).style.color = "var(--foreground)";
                            }}
                            onMouseLeave={e => {
                                if (i === activeIdx) return;
                                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-strong)";
                                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
                            }}
                        >
                            {seg.label}
                        </button>
                    ))}
                </div>

                {/* Active segment content */}
                <div
                    key={activeIdx}
                    className="flex flex-col md:grid gap-10 md:gap-16 items-start"
                    style={{
                        gridTemplateColumns: "1fr 1fr",
                        animation: "segFadeIn 300ms ease both",
                    }}
                >
                    {/* Left: description + stat */}
                    <div className="flex flex-col gap-6">
                        <div
                            className="flex items-center gap-6 p-6 rounded-2xl"
                            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                        >
                            <div className="flex flex-col">
                                <span
                                    className="font-bold tracking-[-0.02em]"
                                    style={{ fontSize: "2rem", color: "var(--brand)", fontFamily: "var(--font-geist-mono)" }}
                                >
                                    {segment.stat}
                                </span>
                                <span className="text-[12px] font-medium mt-0.5" style={{ color: "var(--text-muted)" }}>
                                    {segment.statLabel}
                                </span>
                            </div>
                            <div
                                style={{ width: "1px", alignSelf: "stretch", background: "var(--border)", flexShrink: 0 }}
                            />
                            <p className="text-[14px] leading-[1.7]" style={{ color: "var(--text-muted)" }}>
                                {segment.desc}
                            </p>
                        </div>

                        {/* Image */}
                        <div
                            className="relative rounded-2xl overflow-hidden w-full"
                            style={{
                                aspectRatio: "16/9",
                                border: "1px solid var(--border)",
                                boxShadow: "0 12px 40px rgba(15,23,42,0.07)",
                            }}
                        >
                            <img
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=85"
                                alt="Customer relationship and business intelligence"
                                className="w-full h-full object-cover"
                            />
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.05) 0%, transparent 55%)" }}
                            />
                        </div>
                    </div>

                    {/* Right: example customer list */}
                    <div className="flex flex-col">
                        <p className="text-[11px] font-bold tracking-[0.14em] uppercase mb-4" style={{ color: "var(--text-subtle)" }}>
                            Example — {segment.label}
                        </p>
                        <div className="flex flex-col gap-3">
                            {segment.example.map((customer, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-4 p-4 rounded-xl"
                                    style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                                >
                                    {/* Avatar */}
                                    <div
                                        className="flex items-center justify-center rounded-full shrink-0 font-bold text-[13px]"
                                        style={{
                                            width: "38px",
                                            height: "38px",
                                            background: "var(--brand-light)",
                                            color: "var(--brand)",
                                            border: "1px solid rgba(59,130,246,0.2)",
                                        }}
                                    >
                                        {customer.name[0]}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[13.5px] font-semibold" style={{ color: "var(--foreground)" }}>
                                            {customer.name}
                                        </p>
                                        <p className="text-[11.5px]" style={{ color: "var(--text-muted)" }}>
                                            Customer since {customer.since}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <span
                                            className="text-[13px] font-bold"
                                            style={{ color: "var(--brand)", fontFamily: "var(--font-geist-mono)" }}
                                        >
                                            {customer.visits}×
                                        </span>
                                        <p className="text-[10px]" style={{ color: "var(--text-subtle)" }}>visits</p>
                                    </div>
                                </div>
                            ))}

                            {/* Call to action within segment */}
                            <div
                                className="flex items-center gap-3 p-4 rounded-xl mt-1"
                                style={{ background: "var(--brand-light)", border: "1px solid rgba(59,130,246,0.18)" }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.9A16 16 0 0 0 15 15.91l.82-.82a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                                <p className="text-[12.5px] leading-[1.6]" style={{ color: "var(--brand)" }}>
                                    {segment.id === "bulk"
                                        ? "Call these customers when you need to move stock fast."
                                        : segment.id === "loyal"
                                            ? "Warn these customers before their product runs out."
                                            : segment.id === "consistent"
                                                ? "These customers drive your most predictable revenue."
                                                : "These are your most engaged buyers — reward them."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes segFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </section>
    );
}

export default Segments;