// src/components/contact/HowItWorks.tsx

const STEPS = [
    {
        title: "Fill in the form",
        text: "Pick a topic and tell us what's going on.",
    },
    {
        title: "Tap Send on WhatsApp",
        text: "WhatsApp opens with your message ready. Press Send there.",
    },
    {
        title: "We reply in the same chat",
        text: "Our answer arrives on WhatsApp, so keep the chat open.",
    },
];

/* This is a real sequence, so numbering the steps is meaningful here. */
export function HowItWorks() {
    return (
        <div
            className="rounded-2xl border p-6"
            style={{ borderColor: "var(--border)", background: "var(--surface-muted)" }}
        >
            <h2 className="text-[14px] font-semibold" style={{ color: "var(--foreground)" }}>
                What happens when you send
            </h2>

            <ol className="mt-4 space-y-4">
                {STEPS.map((step, i) => (
                    <li key={step.title} className="flex gap-3">
                        <span
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white font-mono text-[11px] font-semibold"
                            style={{ border: "1px solid var(--border)", color: "var(--brand)" }}
                        >
                            {i + 1}
                        </span>
                        <div>
                            <p className="text-[13px] font-medium" style={{ color: "var(--foreground)" }}>
                                {step.title}
                            </p>
                            <p className="mt-0.5 text-[12px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                                {step.text}
                            </p>
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
}