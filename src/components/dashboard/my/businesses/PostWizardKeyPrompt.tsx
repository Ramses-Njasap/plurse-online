"use client";

import { type Business } from "@/app/(dashboard)/dashboard/my/businesses/data/mockBusinessData";

interface PostWizardKeyPromptProps {
    business: Business;
    onAddKey: () => void;
    onSkip: () => void;
}

export function PostWizardKeyPrompt({ business, onAddKey, onSkip }: PostWizardKeyPromptProps) {
    return (
        <>
            <div className="fixed inset-0 z-50" style={{ background: "rgba(0,0,0,0.45)" }} onClick={onSkip} />

            <div
                className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-32px)] max-w-[460px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl shadow-2xl"
                style={{ background: "var(--surface)" }}
            >
                {/* Success header */}
                <div
                    className="flex items-center gap-3 px-6 py-5"
                    style={{ background: "rgba(34,197,94,0.07)", borderBottom: "1px solid rgba(34,197,94,0.15)" }}
                >
                    <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                        style={{ background: "rgba(34,197,94,0.12)" }}
                    >
                        <CheckIcon />
                    </div>
                    <div>
                        <p className="text-[14px] font-semibold" style={{ color: "#16a34a" }}>
                            Business created successfully
                        </p>
                        <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                            {business.name} · {business.region_city}, {business.country}
                        </p>
                    </div>
                </div>

                {/* Prompt body */}
                <div className="px-6 py-5">
                    <h3 className="mb-1 text-[16px] font-semibold" style={{ color: "var(--foreground)" }}>
                        Add an access key?
                    </h3>
                    <p className="mb-5 text-[13px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                        Your business is ready. Would you like to create and link an access key to it now?
                        You can always do this later from the access keys page.
                    </p>

                    {/* Option cards */}
                    <div className="mb-2 grid grid-cols-1 gap-2">
                        <button
                            type="button"
                            onClick={onAddKey}
                            className="flex items-center gap-4 rounded-xl border p-4 text-left transition-all"
                            style={{ borderColor: "rgba(59,130,246,0.25)", background: "var(--brand-light)" }}
                            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--brand)")}
                            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(59,130,246,0.25)")}
                        >
                            <div
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white"
                                style={{ background: "var(--brand)" }}
                            >
                                <KeyIcon />
                            </div>
                            <div>
                                <p className="text-[14px] font-semibold" style={{ color: "var(--foreground)" }}>
                                    Yes, add an access key
                                </p>
                                <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                                    Create a key and link it to {business.name} immediately.
                                </p>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={onSkip}
                            className="flex items-center gap-4 rounded-xl border p-4 text-left transition-all"
                            style={{ borderColor: "var(--border)", background: "var(--surface-muted)" }}
                            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-strong)")}
                            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                        >
                            <div
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                                style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
                            >
                                <SkipIcon />
                            </div>
                            <div>
                                <p className="text-[14px] font-semibold" style={{ color: "var(--foreground)" }}>
                                    Skip for now
                                </p>
                                <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                                    You can link a key to this business later.
                                </p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

function CheckIcon() {
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>;
}
function KeyIcon() {
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="7.5" cy="15.5" r="5.5" /><path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3" /></svg>;
}
function SkipIcon() {
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>;
}