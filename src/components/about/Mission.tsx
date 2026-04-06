// AboutMission.tsx — Zone 2
// What Plurse is and where it's going — editorial split layout

const NAVBAR_H = 68;
const SECTION_MIN_H = `calc(100vh - ${NAVBAR_H}px)`;


const Mission = () => {
    return (
        <section
            className="relative z-10 px-5 sm:px-8 py-24 sm:py-32"
            style={{ minHeight: SECTION_MIN_H, background: "var(--surface)", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center" }}
        >
            <div
                className="max-w-6xl mx-auto w-full flex flex-col md:grid gap-12 md:gap-24"
                style={{ gridTemplateColumns: "1fr 1fr" }}
            >
                {/* Left: image */}
                <div
                    className="relative rounded-2xl overflow-hidden w-full"
                    style={{
                        aspectRatio: "3/4",
                        border: "1px solid var(--border)",
                        boxShadow: "0 24px 64px rgba(15,23,42,0.08)",
                    }}
                >
                    <img
                        src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=900&q=85"
                        alt="African business and technology landscape"
                        className="w-full h-full object-cover"
                    />
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: "linear-gradient(180deg, transparent 40%, rgba(15,23,42,0.5) 100%)" }}
                    />
                    {/* Overlaid caption */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                        <p
                            className="text-[13px] font-medium leading-[1.6]"
                            style={{ color: "rgba(255,255,255,0.85)", fontFamily: "var(--font-geist-sans)" }}
                        >
                            "The tools that exist were built for businesses
                            in Europe or America. That is not most of Africa."
                        </p>
                        <p
                            className="text-[11px] mt-2"
                            style={{ color: "rgba(255,255,255,0.45)" }}
                        >
                            — Ramses Njasap, Founder
                        </p>
                    </div>
                </div>

                {/* Right: mission text */}
                <div className="flex flex-col justify-center">

                    <p
                        className="text-[11px] font-bold tracking-[0.2em] uppercase mb-6"
                        style={{ color: "var(--brand)" }}
                    >
                        The Mission
                    </p>

                    <h2
                        className="font-bold tracking-[-0.025em] leading-[1.12] mb-8"
                        style={{
                            fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                            color: "var(--foreground)",
                            fontFamily: "var(--font-geist-sans)",
                        }}
                    >
                        Not just a product.
                        <br />
                        <span style={{ color: "var(--brand)" }}>Infrastructure.</span>
                    </h2>

                    <div className="flex flex-col gap-5">
                        <p className="text-[15px] leading-[1.8]" style={{ color: "var(--text-muted)" }}>
                            Plurse started as a business management tool — inventory, sales,
                            cashflow. But the vision has always been larger than that.
                        </p>
                        <p className="text-[15px] leading-[1.8]" style={{ color: "var(--text-muted)" }}>
                            African businesses don't just need software. They need intelligence —
                            data and insights about their industry and market.
                            They need education — practical knowledge from people who have built
                            real businesses in real conditions.
                            They need community — a network of operators solving the same problems.
                        </p>
                        <p className="text-[15px] leading-[1.8]" style={{ color: "var(--text-muted)" }}>
                            Plurse is building all of that. Not as separate products — as one
                            interconnected platform. The operating system for African business.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Mission;