"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ToastStack } from "./ToastStack";
import type { ToastItem, ToastType } from "./types";

// Fixed display order for the type-clusters -- errors surface highest since they're most urgent.
const TYPE_PRIORITY: ToastType[] = ["error", "warning", "success", "info"];

interface ToastViewportProps {
    toasts: ToastItem[];
    exitingIds: Set<string>;
    onDismiss: (id: string) => void;
}

export function ToastViewport({ toasts, exitingIds, onDismiss }: ToastViewportProps) {
    // Portals need a client-side document, so only render once mounted.
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return createPortal(
        <>
            {/* Keyframe used for the auto-dismiss progress bar on each active toast. */}
            <style>{`
                @keyframes toast-shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
            <div
                aria-label="Notifications"
                className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-4 px-4 sm:inset-x-auto sm:right-4 sm:items-end"
            >
                {TYPE_PRIORITY.map((type) => {
                    const items = toasts.filter((t) => t.type === type);
                    if (items.length === 0) return null;
                    return (
                        <ToastStack
                            key={type}
                            type={type}
                            items={items}
                            exitingIds={exitingIds}
                            onDismiss={onDismiss}
                        />
                    );
                })}
            </div>
        </>,
        document.body
    );
}