"use client";

// PaymentMethods.tsx — Zone 3

import { PAYMENT_METHODS } from "@/data/solutions/sales/data";


const PaymentMethods = () => {
    return (
        <section
            className="relative z-10 px-5 sm:px-8 py-24 sm:py-32"
            style={{ background: "var(--background)", borderTop: "1px solid var(--border)" }}
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
                        boxShadow: "0 24px 64px rgba(15,23,42,0.1), 0 4px 16px rgba(59,130,246,0.06)",
                        border: "1px solid var(--border)",
                    }}
                >
                    <img
                        src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1000&q=85"
                        alt="Payment methods and transaction tracking"
                        className="w-full h-full object-cover"
                    />
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.06) 0%, transparent 55%)" }}
                    />
                </div>

                {/* Right: text + breakdown */}
                <div className="flex flex-col">
                    <p
                        className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-4"
                        style={{ color: "var(--brand)" }}
                    >
                        Payment Methods
                    </p>
                    <h2
                        className="text-[1.75rem] sm:text-[2.25rem] font-bold tracking-[-0.025em] leading-[1.12] mb-5"
                        style={{ color: "var(--foreground)", fontFamily: "var(--font-geist-sans)" }}
                    >
                        Understand exactly
                        <br />
                        <span style={{ color: "var(--brand)" }}>how your business gets paid.</span>
                    </h2>
                    <p
                        className="text-[15px] leading-[1.75] mb-8"
                        style={{ color: "var(--text-muted)" }}
                    >
                        Cash, mobile money, card or credit — every transaction is tagged with
                        how it was paid. See your payment method breakdown at a glance and
                        spot which channels your customers prefer.
                    </p>

                    {/* Payment breakdown bars */}
                    <div className="flex flex-col gap-4">
                        {PAYMENT_METHODS.map(method => (
                            <div key={method.id}>
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-[13.5px] font-semibold" style={{ color: "var(--foreground)" }}>
                                        {method.label}
                                    </span>
                                    <span
                                        className="text-[13px] font-bold"
                                        style={{ color: method.color, fontFamily: "var(--font-geist-mono)" }}
                                    >
                                        {method.pct}%
                                    </span>
                                </div>
                                {/* Bar */}
                                <div
                                    className="w-full rounded-full overflow-hidden"
                                    style={{ height: "6px", background: "var(--border)" }}
                                >
                                    <div
                                        style={{
                                            height: "100%",
                                            width: `${method.pct}%`,
                                            background: method.color,
                                            borderRadius: "999px",
                                            transition: "width 800ms cubic-bezier(0.4,0,0.2,1)",
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <p
                        className="text-[12px] mt-5"
                        style={{ color: "var(--text-subtle)", fontFamily: "var(--font-geist-mono)" }}
                    >
                        Example breakdown — your actual data will differ
                    </p>
                </div>
            </div>
        </section>
    );
}

export default PaymentMethods;