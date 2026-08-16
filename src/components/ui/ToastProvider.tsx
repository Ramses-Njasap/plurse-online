"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ToastViewport } from "./ToastViewport";
import type { ToastContextValue, ToastItem, ToastOptions, ToastType } from "./types";

const DEFAULT_DURATIONS: Record<ToastType, number> = {
    success: 4000,
    info: 4000,
    warning: 6000,
    error: 6000,
};

// How long the exit fade/slide takes -- must roughly match the transition duration in Toast.tsx.
const EXIT_ANIMATION_MS = 220;

const ToastContext = createContext<ToastContextValue | null>(null);

function makeId() {
    return typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `toast_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);
    // Toasts currently mid-exit-animation. Kept separate from `toasts` itself so the fade can
    // play out fully before the item is actually removed from the array.
    const [exitingIds, setExitingIds] = useState<Set<string>>(new Set());

    // Exactly one live countdown timer per TYPE. It always belongs to whichever toast of that
    // type is currently front-most (newest still on screen). When that toast is fully removed,
    // the effect below promotes the next-newest one of the same type and starts its timer --
    // never before. That's what makes toasts of a type resolve strictly one at a time.
    const activeTimers = useRef<Map<ToastType, { id: string; timeoutId: ReturnType<typeof setTimeout> | null }>>(new Map());
    // Per-toast timers that hold a dismissed toast on screen just long enough to finish fading out.
    const exitTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

    const remove = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        setExitingIds((prev) => {
            if (!prev.has(id)) return prev;
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
        const timer = exitTimers.current.get(id);
        if (timer) {
            clearTimeout(timer);
            exitTimers.current.delete(id);
        }
    }, []);

    const dismiss = useCallback(
        (id: string) => {
            setExitingIds((prev) => {
                if (prev.has(id)) return prev;
                const next = new Set(prev);
                next.add(id);
                return next;
            });
            if (!exitTimers.current.has(id)) {
                const timer = setTimeout(() => remove(id), EXIT_ANIMATION_MS);
                exitTimers.current.set(id, timer);
            }
        },
        [remove]
    );

    const push = useCallback((type: ToastType, message: string, options?: ToastOptions) => {
        const id = makeId();
        const duration = options?.duration ?? DEFAULT_DURATIONS[type];
        setToasts((prev) => [...prev, { id, type, message, title: options?.title, duration }]);
        return id;
    }, []);

    // Re-evaluate, per type, who's front-most and make sure exactly that toast has a running
    // timer. Runs whenever `toasts` changes -- including when a toast is actually removed after
    // its exit animation finishes, which is precisely the moment the next one should take over.
    useEffect(() => {
        const types: ToastType[] = ["error", "warning", "success", "info"];
        types.forEach((type) => {
            const stack = toasts.filter((t) => t.type === type);
            const front = stack[stack.length - 1];
            const tracked = activeTimers.current.get(type);

            if (!front) {
                if (tracked?.timeoutId) clearTimeout(tracked.timeoutId);
                activeTimers.current.delete(type);
                return;
            }

            // Same toast is already counting down -- leave it alone.
            if (tracked && tracked.id === front.id) return;

            // Front changed (new toast pushed on top, or previous front just got removed):
            // clear any stale timer and start a fresh one for the new front toast.
            if (tracked?.timeoutId) clearTimeout(tracked.timeoutId);

            if (Number.isFinite(front.duration)) {
                const timeoutId = setTimeout(() => dismiss(front.id), front.duration as number);
                activeTimers.current.set(type, { id: front.id, timeoutId });
            } else {
                // Infinity duration -- needs manual dismissal, but still record it as tracked
                // so we don't keep re-triggering this branch on every unrelated toasts update.
                activeTimers.current.set(type, { id: front.id, timeoutId: null });
            }
        });
    }, [toasts, dismiss]);

    // Belt-and-braces cleanup if the provider itself ever unmounts.
    useEffect(() => {
        return () => {
            activeTimers.current.forEach((t) => t.timeoutId && clearTimeout(t.timeoutId));
            exitTimers.current.forEach((t) => clearTimeout(t));
        };
    }, []);

    const value = useMemo<ToastContextValue>(
        () => ({
            success: (message, options) => push("success", message, options),
            error: (message, options) => push("error", message, options),
            warning: (message, options) => push("warning", message, options),
            info: (message, options) => push("info", message, options),
            dismiss,
        }),
        [push, dismiss]
    );

    return (
        <ToastContext.Provider value={value}>
            {children}
            <ToastViewport toasts={toasts} exitingIds={exitingIds} onDismiss={dismiss} />
        </ToastContext.Provider>
    );
}

export function useToast(): ToastContextValue {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error("useToast must be used within a <ToastProvider>. Wrap your root layout with it.");
    }
    return ctx;
}