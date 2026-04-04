// Hero.tsx — Zone 1
// Text left, role permission matrix right — minimal, monochrome

"use client";
import Link from "next/link";
import { ROLES, ALL_PERMISSIONS } from "@/data/solutions/team/data";

const NAVBAR_H = 68;
const SECTION_MIN_H = `calc(100vh - ${NAVBAR_H}px)`;


const Hero = () => {
    return (
        <section
            className="relative z-10 px-5 sm:px-8"
            style={{ minHeight: SECTION_MIN_H, background: "var(--background)" }}
        >
            <div
                className="max-w-6xl mx-auto flex flex-col md:grid md:items-center gap-10 md:gap-16"
                style={{
                    minHeight: SECTION_MIN_H,
                    gridTemplateColumns: "1fr 1.1fr",
                    paddingTop: "clamp(3rem, 8vh, 5rem)",
                    paddingBottom: "clamp(3rem, 8vh, 5rem)",
                }}
            >
                {/* ── Left: text ── */}
                <div className="flex flex-col">

                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 mb-6" style={{ fontSize: "12px", color: "var(--text-subtle)" }}>
                        <Link href="/solutions" style={{ color: "var(--brand)", textDecoration: "none", fontWeight: 500 }}>
                            Solutions
                        </Link>
                        <span>/</span>
                        <span>Team & Access Control</span>
                    </div>

                    {/* Eyebrow */}
                    <div
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6 self-start"
                        style={{ background: "var(--brand-light)", border: "1px solid rgba(59,130,246,0.2)" }}
                    >
                        <span className="block w-3 h-[1.5px] rounded-full" style={{ background: "var(--brand)" }} />
                        <span className="text-[11px] font-bold tracking-[0.18em] uppercase" style={{ color: "var(--brand)" }}>
                            Team & Access Control
                        </span>
                    </div>

                    {/* Headline */}
                    <h1
                        className="font-bold tracking-[-0.03em] leading-[1.08] mb-5"
                        style={{
                            fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
                            color: "var(--foreground)",
                            fontFamily: "var(--font-geist-sans)",
                        }}
                    >
                        Your team, trusted.
                        <br />Your data, protected.
                        <br />
                        <span style={{ color: "var(--brand)" }}>Every action, recorded.</span>
                    </h1>

                    <p
                        className="text-[15px] sm:text-[16px] leading-[1.75] mb-8"
                        style={{ color: "var(--text-muted)", maxWidth: "440px" }}
                    >
                        Assign roles, restrict access, log every action and enforce approval
                        chains — all from one place. Run a business, not a guessing game.
                    </p>

                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="/download"
                            className="btn-primary"
                            style={{ fontSize: "15px", padding: "0.75rem 1.75rem", borderRadius: "0.625rem", textDecoration: "none" }}
                        >
                            Get started
                        </Link>
                        <Link
                            href="/download"
                            className="inline-flex items-center font-medium rounded-xl"
                            style={{
                                fontSize: "15px", padding: "0.75rem 1.75rem",
                                border: "1px solid var(--border-strong)", color: "var(--foreground)",
                                textDecoration: "none", transition: "border-color 150ms, color 150ms",
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--brand)";
                                (e.currentTarget as HTMLAnchorElement).style.color = "var(--brand)";
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border-strong)";
                                (e.currentTarget as HTMLAnchorElement).style.color = "var(--foreground)";
                            }}
                        >
                            Download Plurse
                        </Link>
                    </div>
                </div>

                {/* ── Right: permission matrix ── */}
                <div
                    className="rounded-2xl overflow-hidden w-full"
                    style={{
                        border: "1px solid var(--border)",
                        background: "var(--surface)",
                        boxShadow: "0 24px 64px rgba(15,23,42,0.08)",
                    }}
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
                            Role Permissions
                        </span>
                        <span style={{ width: "60px" }} />
                    </div>

                    {/* Matrix */}
                    <div className="overflow-x-auto">
                        <table className="w-full" style={{ borderCollapse: "collapse", minWidth: "420px" }}>
                            <thead>
                                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                                    <th
                                        className="text-left px-4 py-2.5 text-[11px] font-bold tracking-[0.1em] uppercase"
                                        style={{ color: "var(--text-subtle)", width: "110px" }}
                                    >
                                        Role
                                    </th>
                                    {ALL_PERMISSIONS.map(p => (
                                        <th
                                            key={p}
                                            className="px-2 py-2.5 text-[9px] font-bold tracking-[0.08em] uppercase text-center"
                                            style={{ color: "var(--text-subtle)", minWidth: "40px" }}
                                        >
                                            {p.split(" ")[0]}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {ROLES.map((role, i) => (
                                    <tr
                                        key={role.id}
                                        style={{ borderBottom: i < ROLES.length - 1 ? "1px solid var(--border)" : "none" }}
                                    >
                                        <td className="px-4 py-3">
                                            <span className="text-[12.5px] font-semibold" style={{ color: "var(--foreground)" }}>
                                                {role.label}
                                            </span>
                                        </td>
                                        {ALL_PERMISSIONS.map(p => {
                                            const has = role.permissions.includes(p);
                                            return (
                                                <td key={p} className="px-2 py-3 text-center">
                                                    {has ? (
                                                        <div
                                                            className="inline-flex items-center justify-center rounded-full mx-auto"
                                                            style={{
                                                                width: "18px",
                                                                height: "18px",
                                                                background: "var(--brand-light)",
                                                                border: "1px solid rgba(59,130,246,0.25)",
                                                            }}
                                                        >
                                                            <svg width="9" height="9" viewBox="0 0 16 16" fill="none">
                                                                <path d="M3 8l4 4 6-7" stroke="var(--brand)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className="inline-block rounded-full mx-auto"
                                                            style={{
                                                                width: "18px",
                                                                height: "18px",
                                                                background: "var(--surface-muted)",
                                                                border: "1px solid var(--border)",
                                                            }}
                                                        />
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;