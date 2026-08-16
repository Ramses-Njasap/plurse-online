"use client";

import { Toast } from "./Toast";
import type { ToastItem, ToastType } from "./types";

/** How many silhouette edges to show behind the active card before collapsing into a "+N" badge. */
const MAX_PEEK = 3;

interface ToastStackProps {
    type: ToastType;
    /** Toasts of this type only, oldest first. */
    items: ToastItem[];
    exitingIds: Set<string>;
    onDismiss: (id: string) => void;
}

/**
 * Renders one type's queue as a single, mostly-overlapping stack: the newest toast sits on
 * top, fully visible and interactive with its own countdown running. Everything older waits
 * behind it as a slightly-offset sliver -- no countdown, no close button, not interactive.
 * The moment the front toast fully disappears, the next one in line is promoted (this is
 * driven by ToastProvider re-computing who's "front" once the array actually shrinks), so
 * only one toast per type is ever counting down at once.
 */
export function ToastStack({ items, exitingIds, onDismiss }: ToastStackProps) {
    // Newest last in `items` -> flip so index 0 is the front/active card.
    const ordered = [...items].reverse();
    const front = ordered[0];
    const behind = ordered.slice(1);

    const visiblePeek = Math.min(behind.length, MAX_PEEK);
    const hiddenCount = behind.length - visiblePeek;

    if (!front) return null;

    return (
        <div
            className="relative w-full max-w-sm"
            style={{ paddingBottom: visiblePeek > 0 ? visiblePeek * 7 + 6 : 0 }}
        >
            {/* Silhouettes for toasts still waiting their turn -- drawn back-to-front so z-index stacking is correct. */}
            {Array.from({ length: visiblePeek }).map((_, i) => {
                const depth = visiblePeek - i;
                const source = behind[depth - 1];
                return (
                    <div
                        key={source?.id ?? `peek-${depth}`}
                        aria-hidden
                        className="absolute inset-x-3 bottom-0 rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 ease-out"
                        style={{
                            bottom: -(depth * 7),
                            transform: `scale(${1 - depth * 0.035})`,
                            opacity: Math.max(0.3, 1 - depth * 0.24),
                            zIndex: 10 - depth,
                            height: 14,
                        }}
                    />
                );
            })}

            {/* The one and only interactive, counting-down card for this type right now. */}
            <div className="relative" style={{ zIndex: 20 }}>
                <Toast toast={front} leaving={exitingIds.has(front.id)} onDismiss={onDismiss} />
            </div>

            {hiddenCount > 0 && (
                <span
                    aria-hidden
                    className="absolute -bottom-2 right-3 z-30 rounded-full bg-gray-900 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white shadow"
                >
                    +{hiddenCount}
                </span>
            )}
        </div>
    );
}