// ActivityLog.tsx — Zone 3
// Every action logged — mirrors employee_activities schema

import { ACTIVITY_LOG } from "@/data/solutions/team/data";


const ActivityLog = () => {
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
                        Activity Logging
                    </p>
                    <h2
                        className="text-[1.75rem] sm:text-[2.25rem] font-bold tracking-[-0.025em] leading-[1.12] mb-5"
                        style={{ color: "var(--foreground)", fontFamily: "var(--font-geist-sans)" }}
                    >
                        Nothing happens
                        <br /><span style={{ color: "var(--brand)" }}>without a record of it.</span>
                    </h2>
                    <p className="text-[15px] leading-[1.75] mb-6" style={{ color: "var(--text-muted)" }}>
                        Every action taken by every team member is automatically logged —
                        what changed, what it was before, what it became, who did it, and when.
                        No editing history, no silent changes.
                    </p>
                    <p className="text-[15px] leading-[1.75] mb-8" style={{ color: "var(--text-muted)" }}>
                        Whether it's a stock adjustment, a sale, a payment or a price override —
                        the full trail is always there.
                    </p>
                    <div className="flex flex-col gap-3">
                        {[
                            "Old data and new data captured on every change",
                            "Linked to the exact record that was modified",
                            "Searchable by employee, date or action type",
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

                {/* Right: activity log mockup */}
                <div
                    className="flex flex-col rounded-2xl overflow-hidden"
                    style={{ border: "1px solid var(--border)", background: "var(--surface)", boxShadow: "0 16px 48px rgba(15,23,42,0.08)" }}
                >
                    {/* Header */}
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
                            Activity Log
                        </span>
                        <span className="text-[11px]" style={{ color: "var(--text-subtle)" }}>Today</span>
                    </div>

                    {/* Log entries */}
                    <div className="flex flex-col">
                        {ACTIVITY_LOG.map((entry, i) => {
                            const isLast = i === ACTIVITY_LOG.length - 1;
                            return (
                                <div
                                    key={i}
                                    className="flex items-start gap-4 px-5 py-4"
                                    style={{ borderBottom: isLast ? "none" : "1px solid var(--border)" }}
                                >
                                    {/* Avatar initial */}
                                    <div
                                        className="flex items-center justify-center rounded-full shrink-0 text-[11px] font-bold"
                                        style={{
                                            width: "30px",
                                            height: "30px",
                                            background: "var(--brand-light)",
                                            color: "var(--brand)",
                                            border: "1px solid rgba(59,130,246,0.2)",
                                            marginTop: "1px",
                                        }}
                                    >
                                        {entry.employee[0]}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-0.5">
                                            <p className="text-[12.5px] font-semibold" style={{ color: "var(--foreground)" }}>
                                                {entry.employee}
                                                <span
                                                    className="ml-2 text-[10px] font-medium px-1.5 py-0.5 rounded"
                                                    style={{
                                                        background: "var(--surface-muted)",
                                                        color: "var(--text-subtle)",
                                                        border: "1px solid var(--border)",
                                                    }}
                                                >
                                                    {entry.role}
                                                </span>
                                            </p>
                                            <span
                                                className="text-[10px] shrink-0"
                                                style={{ color: "var(--text-subtle)", fontFamily: "var(--font-geist-mono)" }}
                                            >
                                                {entry.time}
                                            </span>
                                        </div>
                                        <p className="text-[12.5px]" style={{ color: "var(--foreground)" }}>
                                            {entry.activity}
                                        </p>
                                        <p className="text-[11.5px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                                            {entry.detail}
                                        </p>
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

export default ActivityLog;