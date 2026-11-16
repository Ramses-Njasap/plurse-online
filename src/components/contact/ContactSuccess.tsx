// src/components/contact/ContactSuccess.tsx

import { CheckIcon, MessageIcon } from "./ContactIcons";

interface ContactSuccessProps {
    whatsappUrl: string;
    onReset: () => void;
}

/* Shown after the visitor presses "Send on WhatsApp".
   WhatsApp opens with the message pre-filled, but the visitor still has to
   tap Send inside WhatsApp, so this screen says that clearly. */
export function ContactSuccess({ whatsappUrl, onReset }: ContactSuccessProps) {
    return (
        <div className="flex flex-col items-center gap-5 py-6 text-center" role="status">
            <div
                className="flex h-14 w-14 items-center justify-center rounded-full"
                style={{ background: "rgba(34,197,94,0.12)", color: "#16a34a" }}
            >
                <CheckIcon size={26} />
            </div>

            <div className="max-w-sm">
                <h3 className="text-[18px] font-semibold" style={{ color: "var(--foreground)" }}>
                    Your message is ready in WhatsApp
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    WhatsApp should have opened with your message filled in. Tap{" "}
                    <strong style={{ color: "var(--foreground)" }}>Send</strong> there to deliver it to us.
                </p>
            </div>

            <div className="flex w-full max-w-sm flex-col gap-2">
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-[44px] items-center justify-center gap-2 rounded-xl text-[14px] font-semibold text-white transition-colors hover:bg-[var(--brand-hover)]"
                    style={{ background: "var(--brand)" }}
                >
                    <MessageIcon size={16} />
                    WhatsApp didn&apos;t open? Open it again
                </a>
                <button
                    type="button"
                    onClick={onReset}
                    className="h-[40px] rounded-xl border bg-white text-[13px] font-medium transition-colors hover:bg-[var(--surface-muted)]"
                    style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
                >
                    Send another message
                </button>
            </div>
        </div>
    );
}