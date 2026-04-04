// EmployeeProfiles.tsx — Zone 5
// Full employee profiles + multi-branch support

import { EMPLOYEE_PROFILE_FIELDS, BRANCH_FEATURES } from "@/data/solutions/team/data";


const EmployeeProfiles = () => {
    return (
        <section
            className="relative z-10 px-5 sm:px-8 py-24 sm:py-32"
            style={{ background: "var(--background)", borderTop: "1px solid var(--border)" }}
        >
            <div
                className="max-w-6xl mx-auto flex flex-col md:grid md:items-center gap-12 md:gap-20"
                style={{ gridTemplateColumns: "1fr 1fr" }}
            >
                {/* Left: text + profile fields */}
                <div className="flex flex-col">
                    <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "var(--brand)" }}>
                        Employee Profiles
                    </p>
                    <h2
                        className="text-[1.75rem] sm:text-[2.25rem] font-bold tracking-[-0.025em] leading-[1.12] mb-5"
                        style={{ color: "var(--foreground)", fontFamily: "var(--font-geist-sans)" }}
                    >
                        Every team member.
                        <br /><span style={{ color: "var(--brand)" }}>Fully documented.</span>
                    </h2>
                    <p className="text-[15px] leading-[1.75] mb-8" style={{ color: "var(--text-muted)" }}>
                        Each employee has a complete profile — contact details, department,
                        date of joining, emergency contact, salary and all their documents
                        in one place. Never search a filing cabinet again.
                    </p>

                    {/* Profile fields grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {EMPLOYEE_PROFILE_FIELDS.map((field, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg"
                                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                            >
                                <div
                                    style={{
                                        width: "5px", height: "5px",
                                        borderRadius: "50%",
                                        background: "var(--brand)",
                                        flexShrink: 0,
                                    }}
                                />
                                <span className="text-[12px] font-medium" style={{ color: "var(--foreground)" }}>
                                    {field}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: image + multi-branch */}
                <div className="flex flex-col gap-8">
                    <div
                        className="relative rounded-2xl overflow-hidden w-full"
                        style={{
                            aspectRatio: "4/3",
                            border: "1px solid var(--border)",
                            boxShadow: "0 12px 40px rgba(15,23,42,0.08)",
                        }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&q=85"
                            alt="Employee profile management and team documentation"
                            className="w-full h-full object-cover"
                        />
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.05) 0%, transparent 55%)" }}
                        />
                    </div>

                    {/* Multi-branch */}
                    <div>
                        <p className="text-[11px] font-bold tracking-[0.14em] uppercase mb-4" style={{ color: "var(--text-subtle)" }}>
                            Multi-branch support
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {BRANCH_FEATURES.map((f, i) => (
                                <div
                                    key={i}
                                    className="p-4 rounded-xl"
                                    style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                                >
                                    <p className="text-[13px] font-semibold mb-1" style={{ color: "var(--foreground)" }}>
                                        {f.title}
                                    </p>
                                    <p className="text-[12px] leading-[1.6]" style={{ color: "var(--text-muted)" }}>
                                        {f.body}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default EmployeeProfiles;