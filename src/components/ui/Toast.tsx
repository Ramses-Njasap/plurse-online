"use client";

import { useEffect, useState, JSX } from "react";
import type { ToastItem, ToastType } from "./types";

const ICONS: Record<ToastType, JSX.Element> = {
    success: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
    ),
    error: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M12 21a9 9 0 100-18 9 9 0 000 18z" />
        </svg>
    ),
    warning: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
    ),
    info: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25h.75v5.25h.75M12 7.5h.008v.008H12V7.5zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
};

const STYLES: Record<ToastType, { iconWrap: string; bar: string }> = {
    success: { iconWrap: "bg-emerald-50 text-emerald-600", bar: "bg-emerald-500" },
    error: { iconWrap: "bg-red-50 text-red-600", bar: "bg-red-500" },
    warning: { iconWrap: "bg-amber-50 text-amber-600", bar: "bg-amber-500" },
    info: { iconWrap: "bg-blue-50 text-blue-600", bar: "bg-blue-500" },
};

interface ToastProps {
    toast: ToastItem;
    /** True while this toast is fading out (set by the provider, not managed locally). */
    leaving: boolean;
    /** Requests that this toast start closing. The provider owns the actual removal timing. */
    onDismiss: (id: string) => void;
}

/**
 * Renders exactly one toast card. Only ever mounted for the front-most/active toast of a
 * type's stack -- the ones waiting behind it are drawn separately as lightweight silhouettes
 * by <ToastStack>, so this component doesn't need to know about stacking at all.
 */
export function Toast({ toast, leaving, onDismiss }: ToastProps) {
    const [entered, setEntered] = useState(false);

    useEffect(() => {
        const raf = requestAnimationFrame(() => setEntered(true));
        return () => cancelAnimationFrame(raf);
    }, []);

    const style = STYLES[toast.type];
    const hasTimer = toast.duration !== undefined && Number.isFinite(toast.duration);

    return (
        <div
            role={toast.type === "error" ? "alert" : "status"}
            aria-live={toast.type === "error" ? "assertive" : "polite"}
            className={`pointer-events-auto w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg ring-1 ring-black/5 transition-all duration-200 ease-out ${entered && !leaving ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
                }`}
        >
            <div className="flex items-start gap-3 p-4">
                <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${style.iconWrap}`}>
                    {ICONS[toast.type]}
                </div>

                <div className="min-w-0 flex-1 pt-0.5">
                    {toast.title && (
                        <p className="text-sm font-semibold text-gray-900">{toast.title}</p>
                    )}
                    <p className="whitespace-pre-line text-sm text-gray-600">{toast.message}</p>
                </div>

                <button
                    type="button"
                    onClick={() => onDismiss(toast.id)}
                    aria-label="Dismiss notification"
                    className="flex-shrink-0 rounded-md p-1 text-gray-400 transition hover:bg-gray-50 hover:text-gray-600"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {hasTimer && (
                <div className="h-0.5 w-full bg-gray-100">
                    <div
                        key={toast.id}
                        className={`h-full ${style.bar}`}
                        style={{
                            animation: `toast-shrink ${toast.duration}ms linear forwards`,
                            // Freeze the bar wherever it was if the toast is closed early by hand,
                            // instead of visibly snapping to 0 right before the card fades out.
                            animationPlayState: leaving ? "paused" : "running",
                        }}
                    />
                </div>
            )}
        </div>
    );
}