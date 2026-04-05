// Credit.tsx — Zone 4
// Credit history from the customer's perspective

import { CUSTOMER_PROFILE, CREDIT_HISTORY } from "@/data/solutions/customers/data";


const Credit = () => {
    return (
        <section
            className="relative z-10 px-5 sm:px-8 py-24 sm:py-32"
            style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}
        >
            <div
                className="max-w-6xl mx-auto flex flex-col md:grid md:items-center gap-12 md:gap-20"
                style={{ gridTemplateColumns: "1fr 1fr" }}
            >
                {/* Left: image */}
                <div
                    className="relative rounded-2xl overflow-hidden w-full"
                    style={{
                        aspectRatio: "4/3",
                        border: "1px solid var(--border)",
                        boxShadow: "0 24px 64px rgba(15,23,42,0.08)",
                    }}
                >
                    <img
                        src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1000&q=85"
                        alt="Business owner reviewing customer credit history"
                        className="w-full h-full object-cover"
                    />
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.05) 0%, transparent 55%)" }}
                    />
                </div>

                {/* Right: text + credit card */}
                <div className="flex flex-col">
                    <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "var(--brand)" }}>
                        Credit History
                    </p>
                    <h2
                        className="text-[1.75rem] sm:text-[2.25rem] font-bold tracking-[-0.025em] leading-[1.12] mb-5"
                        style={{ color: "var(--foreground)", fontFamily: "var(--font-geist-sans)" }}
                    >
                        Extend credit wisely.
                        <br /><span style={{ color: "var(--brand)" }}>Know before you lend.</span>
                    </h2>
                    <p className="text-[15px] leading-[1.75] mb-8" style={{ color: "var(--text-muted)" }}>
                        Before agreeing to another credit sale, see the customer's full
                        repayment record — total extended, total repaid, outstanding balance
                        and whether they pay on time. The history is always there.
                    </p>

                    {/* Credit stats card */}
                    <div
                        className="rounded-2xl overflow-hidden"
                        style={{ border: "1px solid var(--border)", background: "var(--background)" }}
                    >
                        {/* Card header */}
                        <div
                            className="flex items-center justify-between px-5 py-3.5"
                            style={{ borderBottom: "1px solid var(--border)", background: "var(--surface-muted)" }}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="flex items-center justify-center rounded-full text-[11px] font-bold"
                                    style={{
                                        width: "26px", height: "26px",
                                        background: "var(--brand-light)",
                                        color: "var(--brand)",
                                        border: "1px solid rgba(59,130,246,0.2)",
                                    }}
                                >
                                    {CUSTOMER_PROFILE.name[0]}
                                </div>
                                <span className="text-[12px] font-semibold" style={{ color: "var(--foreground)" }}>
                                    {CUSTOMER_PROFILE.name}
                                </span>
                            </div>
                            <span className="text-[11px]" style={{ color: "var(--text-subtle)", fontFamily: "var(--font-geist-mono)" }}>
                                Credit Summary
                            </span>
                        </div>

                        {/* Credit rows */}
                        <div className="flex flex-col">
                            {CREDIT_HISTORY.map((row, i) => {
                                const isLast = i === CREDIT_HISTORY.length - 1;
                                return (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between px-5 py-3.5 gap-4"
                                        style={{ borderBottom: isLast ? "none" : "1px solid var(--border)" }}
                                    >
                                        <div>
                                            <p className="text-[12.5px] font-medium" style={{ color: "var(--foreground)" }}>
                                                {row.label}
                                            </p>
                                            {row.note && (
                                                <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                                                    {row.note}
                                                </p>
                                            )}
                                        </div>
                                        <span
                                            className="font-bold text-[13px] shrink-0"
                                            style={{ color: "var(--brand)", fontFamily: "var(--font-geist-mono)" }}
                                        >
                                            {row.value}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Credit;