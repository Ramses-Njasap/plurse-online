/* ── useCountdown hook — counts down from `seconds` then stops ── */

"use client";

import { useState, useEffect, useCallback } from "react";

export function useCountdown(initial: number) {
    const [seconds, setSeconds] = useState(initial);
    const [running, setRunning] = useState(true);

    useEffect(() => {
        if (!running) return;
        if (seconds <= 0) { setRunning(false); return; }

        const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
        return () => clearTimeout(id);
    }, [seconds, running]);

    const reset = useCallback(() => {
        setSeconds(initial);
        setRunning(true);
    }, [initial]);

    return { seconds, expired: seconds <= 0, reset };
}