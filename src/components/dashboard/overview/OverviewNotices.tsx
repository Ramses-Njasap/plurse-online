// src/components/dashboard/overview/OverviewNotices.tsx

import Link from "next/link";
import type { SourceFailure } from "@/app/(dashboard)/dashboard/data/useOverviewData";
import { AlertIcon } from "./OverviewIcons";

export function SessionExpiredNotice({ message }: { message: string }) {
    return (
        <div
            className="mx-auto my-12 max-w-md rounded-2xl border p-6 text-center"
            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
            <div
                className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
                style={{ background: "rgba(245,158,11,0.10)", color: "#d97706" }}
            >
                <AlertIcon size={22} />
            </div>
            <h3 className="text-[15px] font-semibold" style={{ color: "var(--foreground)" }}>Session expired</h3>
            <p className="mt-2 text-[13px]" style={{ color: "var(--text-subtle)" }}>{message}</p>
            <Link
                href="/login"
                className="mt-5 inline-flex h-9 items-center justify-center rounded-lg px-4 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: "var(--foreground)" }}
            >
                Sign back in
            </Link>
        </div>
    );
}

/** Shown above the content when some (not all) data sources failed. */
export function PartialFailureNotice({ failures, onRetry }: { failures: SourceFailure[]; onRetry: () => void }) {
    return (
        <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3"
            style={{ background: "rgba(245,158,11,0.06)", borderColor: "rgba(245,158,11,0.3)" }}
        >
            <div className="flex items-center gap-3">
                <span style={{ color: "#d97706" }}><AlertIcon size={16} /></span>
                <p className="text-[13px]" style={{ color: "#92400E" }}>
                    <span className="font-semibold">Some data couldn&apos;t be loaded</span>
                    {" "}({failures.map((f) => f.source).join(", ")}). Figures below may be incomplete.
                </p>
            </div>
            <button
                type="button"
                onClick={onRetry}
                className="h-8 rounded-lg border px-3 text-[12px] font-semibold transition-colors"
                style={{ borderColor: "rgba(245,158,11,0.4)", color: "#92400E", background: "var(--surface)" }}
            >
                Try again
            </button>
        </div>
    );
}