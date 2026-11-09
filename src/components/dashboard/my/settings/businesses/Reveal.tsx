// src/components/dashboard/my/settings/businesses/Reveal.tsx

"use client";

import { useEffect, useState } from "react";

/** Fades and lifts its child in on mount, staggered by index. Honors reduced-motion. */
export function Reveal({ index, children }: { index: number; children: React.ReactNode }) {
    const [shown, setShown] = useState(false);

    useEffect(() => {
        const id = requestAnimationFrame(() => setShown(true));
        return () => cancelAnimationFrame(id);
    }, []);

    return (
        <div
            className="h-full transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none"
            style={{
                opacity: shown ? 1 : 0,
                transform: shown ? "translateY(0)" : "translateY(8px)",
                transitionDelay: shown ? `${Math.min(index, 8) * 35}ms` : "0ms",
            }}
        >
            {children}
        </div>
    );
}