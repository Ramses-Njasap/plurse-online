// src/components/contact/ContactHero.tsx

export function ContactHero() {
    return (
        <header className="mx-auto max-w-3xl text-center">
            <span
                className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.2em]"
                style={{
                    borderColor: "rgba(59,130,246,0.25)",
                    background: "var(--brand-light)",
                    color: "var(--brand)",
                }}
            >
                <span className="h-px w-3" style={{ background: "var(--brand)" }} />
                Contact
            </span>

            <h1
                className="mt-6 text-[40px] font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl"
                style={{ color: "var(--foreground)" }}
            >
                Got a question?
                <br />
                <span style={{ color: "var(--brand)" }}>Let&apos;s sort it out.</span>
            </h1>

            <p
                className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed sm:text-[17px]"
                style={{ color: "var(--text-muted)" }}
            >
                Questions, complaints or payment trouble: send us a message and it lands straight in
                our WhatsApp. Prefer a conversation? Call us directly.
            </p>
        </header>
    );
}