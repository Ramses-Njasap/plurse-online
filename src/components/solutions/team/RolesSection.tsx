// RolesSection.tsx — Zone 2
// Role cards with descriptions and department grouping

"use client";
import { ROLES, DEPARTMENTS } from "@/data/solutions/team/data";


const RolesSection = () => {
    return (
        <section
            className="relative z-10 px-5 sm:px-8 py-24 sm:py-32"
            style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}
        >
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-14">
                    <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "var(--brand)" }}>
                        Roles & Departments
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                        <h2
                            className="text-[2rem] sm:text-[2.25rem] font-bold tracking-[-0.025em] leading-[1.12]"
                            style={{ color: "var(--foreground)", fontFamily: "var(--font-geist-sans)", margin: 0 }}
                        >
                            You define who does what.
                            <br /><span style={{ color: "var(--brand)" }}>Plurse enforces it.</span>
                        </h2>
                        <p
                            className="text-[14px] leading-[1.7] sm:text-right"
                            style={{ color: "var(--text-muted)", maxWidth: "300px", margin: 0, flexShrink: 0 }}
                        >
                            Five preset roles cover every position in your business.
                            Assign a role, and their access is set automatically.
                        </p>
                    </div>
                </div>

                <div
                    className="flex flex-col md:grid gap-10 md:gap-16 items-start"
                    style={{ gridTemplateColumns: "1.2fr 1fr" }}
                >
                    {/* Role cards */}
                    <div className="flex flex-col gap-3">
                        {ROLES.map((role, i) => (
                            <div
                                key={role.id}
                                className="flex items-start gap-4 p-5 rounded-xl"
                                style={{
                                    background: "var(--background)",
                                    border: "1px solid var(--border)",
                                    transition: "border-color 200ms",
                                }}
                                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(59,130,246,0.3)")}
                                onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
                            >
                                {/* Role number */}
                                <div
                                    className="flex items-center justify-center rounded-lg shrink-0 font-bold"
                                    style={{
                                        width: "32px",
                                        height: "32px",
                                        background: i === 0 ? "var(--brand)" : "var(--brand-light)",
                                        color: i === 0 ? "white" : "var(--brand)",
                                        fontSize: "11px",
                                        fontFamily: "var(--font-geist-mono)",
                                        border: i === 0 ? "none" : "1px solid rgba(59,130,246,0.2)",
                                    }}
                                >
                                    {String(i + 1).padStart(2, "0")}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-3 mb-1">
                                        <p className="text-[14px] font-bold" style={{ color: "var(--foreground)" }}>
                                            {role.label}
                                        </p>
                                        <p
                                            className="text-[10px] font-semibold shrink-0"
                                            style={{ color: "var(--text-subtle)", fontFamily: "var(--font-geist-mono)" }}
                                        >
                                            {role.permissions.length} permissions
                                        </p>
                                    </div>
                                    <p className="text-[13px] leading-[1.65]" style={{ color: "var(--text-muted)" }}>
                                        {role.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right: departments + employee profile fields */}
                    <div className="flex flex-col gap-8">
                        {/* Departments */}
                        <div>
                            <p className="text-[11px] font-bold tracking-[0.14em] uppercase mb-4" style={{ color: "var(--text-subtle)" }}>
                                Departments
                            </p>
                            <div className="flex flex-col gap-2">
                                {DEPARTMENTS.map((dept, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between px-4 py-3 rounded-xl"
                                        style={{ background: "var(--background)", border: "1px solid var(--border)" }}
                                    >
                                        <span className="text-[13.5px] font-medium" style={{ color: "var(--foreground)" }}>
                                            {dept.name}
                                        </span>
                                        <span
                                            className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                                            style={{
                                                background: "var(--brand-light)",
                                                color: "var(--brand)",
                                                border: "1px solid rgba(59,130,246,0.18)",
                                                fontFamily: "var(--font-geist-mono)",
                                            }}
                                        >
                                            {dept.headcount} staff
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Image */}
                        <div
                            className="relative rounded-2xl overflow-hidden w-full"
                            style={{
                                aspectRatio: "4/3",
                                border: "1px solid var(--border)",
                                boxShadow: "0 12px 40px rgba(15,23,42,0.08)",
                            }}
                        >
                            <img
                                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=85"
                                alt="Business team working with role-based access"
                                className="w-full h-full object-cover"
                            />
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.05) 0%, transparent 55%)" }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default RolesSection;