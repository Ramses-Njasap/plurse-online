// Profile.tsx — Zone 2
// A customer as a person — profile card + purchase history

import { CUSTOMER_PROFILE, PURCHASE_HISTORY } from "@/data/solutions/customers/data";


const Profile = () => {
    return (
        <section
            className="relative z-10 px-5 sm:px-8 py-24 sm:py-32"
            style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}
        >
            <div
                className="max-w-6xl mx-auto flex flex-col md:grid md:items-start gap-12 md:gap-20"
                style={{ gridTemplateColumns: "1fr 1.1fr" }}
            >
                {/* Left: text */}
                <div className="flex flex-col">
                    <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "var(--brand)" }}>
                        Customer Profiles
                    </p>
                    <h2
                        className="text-[1.75rem] sm:text-[2.25rem] font-bold tracking-[-0.025em] leading-[1.12] mb-5"
                        style={{ color: "var(--foreground)", fontFamily: "var(--font-geist-sans)" }}
                    >
                        Every customer.
                        <br /><span style={{ color: "var(--brand)" }}>Fully remembered.</span>
                    </h2>
                    <p className="text-[15px] leading-[1.75] mb-8" style={{ color: "var(--text-muted)" }}>
                        Every named customer builds a profile automatically as they
                        transact with your business. Contact details, purchase history,
                        credit behaviour and buying preferences — all in one place,
                        always up to date.
                    </p>
                    <div className="flex flex-col gap-3">
                        {[
                            "Contact info — phone, email, address",
                            "Full purchase history with dates and amounts",
                            "Payment method preferences tracked automatically",
                            "Outstanding credit balance always visible",
                            "Customer since date and total lifetime spend",
                        ].map((c, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <span
                                    className="flex items-center justify-center rounded-full shrink-0 mt-0.5"
                                    style={{
                                        width: "20px", height: "20px",
                                        background: "var(--brand-light)",
                                        border: "1px solid rgba(59,130,246,0.2)",
                                    }}
                                >
                                    <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                                        <path d="M3 8l4 4 6-7" stroke="var(--brand)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                                <span className="text-[13.5px] leading-[1.6]" style={{ color: "var(--foreground)" }}>{c}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: profile card mockup */}
                <div className="flex flex-col gap-4">

                    {/* Profile card */}
                    <div
                        className="rounded-2xl overflow-hidden"
                        style={{ border: "1px solid var(--border)", background: "var(--background)", boxShadow: "0 16px 48px rgba(15,23,42,0.07)" }}
                    >
                        {/* Card top bar */}
                        <div
                            className="flex items-center justify-between px-5 py-3.5"
                            style={{ borderBottom: "1px solid var(--border)", background: "var(--surface-muted)" }}
                        >
                            <div className="flex items-center gap-2">
                                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fc5c57" }} />
                                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fdbc2c" }} />
                                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#33c748" }} />
                            </div>
                            <span className="text-[11px] font-medium" style={{ color: "var(--text-subtle)", fontFamily: "var(--font-geist-mono)" }}>
                                Customer Profile
                            </span>
                            <span style={{ width: "60px" }} />
                        </div>

                        <div className="p-5">
                            {/* Identity */}
                            <div className="flex items-center gap-4 mb-5">
                                <div
                                    className="flex items-center justify-center rounded-full text-[18px] font-bold shrink-0"
                                    style={{
                                        width: "52px",
                                        height: "52px",
                                        background: "var(--brand-light)",
                                        color: "var(--brand)",
                                        border: "1px solid rgba(59,130,246,0.25)",
                                    }}
                                >
                                    {CUSTOMER_PROFILE.name[0]}
                                </div>
                                <div>
                                    <p className="text-[16px] font-bold" style={{ color: "var(--foreground)" }}>
                                        {CUSTOMER_PROFILE.name}
                                    </p>
                                    <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                                        Customer since {CUSTOMER_PROFILE.since}
                                    </p>
                                </div>
                            </div>

                            {/* Contact details */}
                            <div className="flex flex-col gap-2 mb-5" style={{ borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
                                {[
                                    { l: "Phone", v: CUSTOMER_PROFILE.phone },
                                    { l: "Email", v: CUSTOMER_PROFILE.email },
                                    { l: "Address", v: CUSTOMER_PROFILE.address },
                                    { l: "Preferred", v: CUSTOMER_PROFILE.preferredMethod },
                                ].map(row => (
                                    <div
                                        key={row.l}
                                        className="flex items-center justify-between"
                                        style={{ paddingBottom: "8px", borderBottom: "1px solid var(--border)" }}
                                    >
                                        <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>{row.l}</span>
                                        <span className="text-[12.5px] font-medium" style={{ color: "var(--foreground)" }}>{row.v}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Stats row */}
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { label: "Total spend", value: CUSTOMER_PROFILE.totalSpend },
                                    { label: "Orders", value: String(CUSTOMER_PROFILE.totalOrders) },
                                    { label: "Outstanding", value: CUSTOMER_PROFILE.outstanding },
                                ].map((s, i) => (
                                    <div
                                        key={i}
                                        className="flex flex-col gap-0.5 p-3 rounded-xl text-center"
                                        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                                    >
                                        <span
                                            className="font-bold text-[13px]"
                                            style={{
                                                color: i === 2 ? "#f59e0b" : "var(--brand)",
                                                fontFamily: "var(--font-geist-mono)",
                                            }}
                                        >
                                            {s.value}
                                        </span>
                                        <span className="text-[10px]" style={{ color: "var(--text-subtle)" }}>{s.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Purchase history */}
                    <div
                        className="rounded-2xl overflow-hidden"
                        style={{ border: "1px solid var(--border)", background: "var(--background)" }}
                    >
                        <div
                            className="px-5 py-3.5"
                            style={{ borderBottom: "1px solid var(--border)", background: "var(--surface-muted)" }}
                        >
                            <span className="text-[11px] font-medium" style={{ color: "var(--text-subtle)", fontFamily: "var(--font-geist-mono)" }}>
                                Purchase History
                            </span>
                        </div>
                        {PURCHASE_HISTORY.map((p, i) => {
                            const isLast = i === PURCHASE_HISTORY.length - 1;
                            return (
                                <div
                                    key={i}
                                    className="flex items-center justify-between px-5 py-3.5 gap-3"
                                    style={{ borderBottom: isLast ? "none" : "1px solid var(--border)" }}
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[12.5px] font-medium truncate" style={{ color: "var(--foreground)" }}>
                                            {p.product}
                                        </p>
                                        <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>
                                            {p.method} · {p.date}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span
                                            className="text-[12.5px] font-bold"
                                            style={{ color: "var(--foreground)", fontFamily: "var(--font-geist-mono)" }}
                                        >
                                            {p.amount}
                                        </span>
                                        <span
                                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                            style={{
                                                background: p.status === "paid" ? "rgba(16,185,129,0.08)" : "rgba(245,158,11,0.08)",
                                                color: p.status === "paid" ? "#10b981" : "#f59e0b",
                                                border: p.status === "paid" ? "1px solid rgba(16,185,129,0.2)" : "1px solid rgba(245,158,11,0.2)",
                                            }}
                                        >
                                            {p.status}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Profile;