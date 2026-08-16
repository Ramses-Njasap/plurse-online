"use client";

import { useState, useEffect } from "react";

export function ScrollHeader({ children }: { children: React.ReactNode }) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header
            className="fixed top-0 inset-x-0 z-50"
            style={{
                transition: "background 250ms ease, border-color 250ms ease, box-shadow 250ms ease",
                background: scrolled ? "rgba(250,250,249,0.9)" : "transparent",
                backdropFilter: scrolled ? "blur(16px) saturate(1.6)" : "none",
                WebkitBackdropFilter: scrolled ? "blur(16px) saturate(1.6)" : "none",
                borderBottom: `1px solid ${scrolled ? "rgba(59,130,246,0.12)" : "transparent"}`,
                boxShadow: scrolled ? "0 1px 24px rgba(15,23,42,0.05)" : "none",
            }}
        >
            {children}
        </header>
    );
}