// src/components/contact/CallCard.tsx

import { CONTACT_CONFIG } from "@/lib/contact/config";
import { ClockIcon, PhoneIcon } from "./ContactIcons";
import { CopyNumberButton } from "./CopyNumberButton";

/* tel: links open the phone's dialer on mobile (and the default calling app on desktop, if any). */
export function CallCard() {
    return (
        <div
            className="rounded-2xl border bg-white p-6"
            style={{ borderColor: "var(--border)" }}
        >
            <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: "var(--brand-light)", color: "var(--brand)" }}
            >
                <PhoneIcon size={18} />
            </div>

            <h2 className="mt-4 text-[16px] font-semibold" style={{ color: "var(--foreground)" }}>
                Prefer to talk?
            </h2>
            <p className="mt-1 text-[13px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Call us directly and speak to someone on the Plurse team.
            </p>

            <p
                className="mt-4 font-mono text-[18px] font-semibold tracking-wide"
                style={{ color: "var(--foreground)" }}
            >
                {CONTACT_CONFIG.phoneDisplay}
            </p>

            <div className="mt-4 space-y-2">
                <a
                    href={`tel:${CONTACT_CONFIG.phoneHref}`}
                    className="flex h-[44px] w-full items-center justify-center gap-2 rounded-xl text-[14px] font-semibold text-white transition-colors hover:bg-[var(--brand-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)]"
                    style={{ background: "var(--brand)" }}
                >
                    <PhoneIcon size={16} />
                    Call now
                </a>
                <CopyNumberButton value={CONTACT_CONFIG.phoneHref} />
            </div>

            <p
                className="mt-4 flex items-center gap-2 text-[12px]"
                style={{ color: "var(--text-subtle)" }}
            >
                <ClockIcon size={13} />
                {CONTACT_CONFIG.hours}
            </p>
        </div>
    );
}