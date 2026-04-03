// TransactionLedger.tsx — Zone 3
// Master transaction ledger mockup — cashin, cashout, transfer

import { TRANSACTIONS, TRANSACTION_TYPE_CONFIG } from "@/data/solutions/cashflow/data";


const TransactionLedger = () => {
    return (
        <section
            className="relative z-10 px-5 sm:px-8 py-24 sm:py-32"
            style={{ background: "var(--background)", borderTop: "1px solid var(--border)" }}
        >
            <div
                className="max-w-6xl mx-auto flex flex-col md:grid md:items-center gap-12 md:gap-20"
                style={{ gridTemplateColumns: "1fr 1fr" }}
            >
                {/* Left: text */}
                <div className="flex flex-col">
                    <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "var(--brand)" }}>
                        Transaction Ledger
                    </p>
                    <h2
                        className="text-[1.75rem] sm:text-[2.25rem] font-bold tracking-[-0.025em] leading-[1.12] mb-5"
                        style={{ color: "var(--foreground)", fontFamily: "var(--font-geist-sans)" }}
                    >
                        Every transaction.
                        <br /><span style={{ color: "var(--brand)" }}>Three types. One truth.</span>
                    </h2>
                    <p className="text-[15px] leading-[1.75] mb-8" style={{ color: "var(--text-muted)" }}>
                        Plurse's transaction ledger records every financial event in your business
                        as one of three types — Cash In, Cash Out or Transfer.
                        Transfers between accounts are never counted as income, so your
                        revenue figures are always honest.
                    </p>

                    {/* Type legend */}
                    <div className="flex flex-col gap-4">
                        {Object.entries(TRANSACTION_TYPE_CONFIG).map(([key, cfg]) => (
                            <div key={key} className="flex items-start gap-3">
                                <span
                                    className="inline-flex items-center justify-center rounded-lg shrink-0 text-[10px] font-bold tracking-[0.1em] uppercase"
                                    style={{
                                        width: "64px",
                                        height: "28px",
                                        background: cfg.bg,
                                        border: `1px solid ${cfg.border}`,
                                        color: cfg.color,
                                        fontFamily: "var(--font-geist-sans)",
                                    }}
                                >
                                    {cfg.label}
                                </span>
                                <p className="text-[13.5px] leading-[1.65]" style={{ color: "var(--text-muted)", paddingTop: "4px" }}>
                                    {key === "cashin" && "Money received — from sales, payments, and installments."}
                                    {key === "cashout" && "Money spent — on stock, shipping, and supplier costs."}
                                    {key === "transfer" && "Internal movement — till to bank. Never inflates revenue."}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: ledger mockup */}
                <div
                    className="flex flex-col rounded-2xl overflow-hidden"
                    style={{ border: "1px solid var(--border)", background: "var(--surface)", boxShadow: "0 16px 48px rgba(15,23,42,0.08)" }}
                >
                    {/* Header bar */}
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
                            Transactions
                        </span>
                        <span className="text-[11px]" style={{ color: "var(--text-subtle)" }}>Recent</span>
                    </div>

                    {/* Transactions list */}
                    <div className="flex flex-col">
                        {TRANSACTIONS.map((tx, i) => {
                            const cfg = TRANSACTION_TYPE_CONFIG[tx.type as keyof typeof TRANSACTION_TYPE_CONFIG];
                            const isLast = i === TRANSACTIONS.length - 1;
                            return (
                                <div
                                    key={i}
                                    className="flex items-center gap-3 px-5 py-3.5"
                                    style={{ borderBottom: isLast ? "none" : "1px solid var(--border)" }}
                                >
                                    {/* Type badge */}
                                    <span
                                        className="text-[9px] font-bold tracking-[0.1em] uppercase rounded-md shrink-0"
                                        style={{
                                            padding: "3px 7px",
                                            background: cfg.bg,
                                            border: `1px solid ${cfg.border}`,
                                            color: cfg.color,
                                            minWidth: "54px",
                                            textAlign: "center",
                                        }}
                                    >
                                        {cfg.label}
                                    </span>

                                    {/* Description */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[12.5px] font-medium truncate" style={{ color: "var(--foreground)" }}>
                                            {tx.desc}
                                        </p>
                                        <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>
                                            {tx.method} · {tx.date}
                                        </p>
                                    </div>

                                    {/* Amount */}
                                    <span
                                        className="text-[13px] font-bold shrink-0"
                                        style={{ color: cfg.color, fontFamily: "var(--font-geist-mono)" }}
                                    >
                                        {tx.amount}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default TransactionLedger;