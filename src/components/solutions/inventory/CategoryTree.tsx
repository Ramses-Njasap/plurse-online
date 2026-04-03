"use client";

// CategoryTreeSection.tsx — Zone 2
// Tree diagram built with flex — no absolute positioning, no overflow issues.
// Scales naturally to fit its container on all screen sizes.

import { CATEGORY_TREE, type CategoryNode } from "@/data/solutions/inventory/data";

const NAVBAR_H = 68;
const SECTION_MIN_H = `calc(100vh - ${NAVBAR_H}px)`;

// ── Node pill ─────────────────────────────────────────────────────────────────
const Node = ({ node, depth }: { node: CategoryNode; depth: number }) => {
    const isRoot = depth === 0;
    const isParent = depth === 1;
    const isChild = depth === 2;

    return (
        <div
            className="inline-flex flex-col items-center justify-center rounded-xl text-center whitespace-nowrap"
            style={{
                padding: isRoot ? "10px 20px" : isParent ? "8px 14px" : "6px 12px",
                background: isRoot ? "var(--brand)" :
                    isParent ? "var(--brand-light)" : "var(--surface)",
                border: isRoot ? "none" :
                    isParent ? "1.5px solid rgba(59,130,246,0.3)" : "1px solid var(--border)",
                color: isRoot ? "white" :
                    isParent ? "var(--brand)" : "var(--foreground)",
                boxShadow: isRoot ? "0 4px 16px var(--brand-ring)" : "0 1px 4px rgba(15,23,42,0.05)",
                fontSize: isRoot ? "13px" : isParent ? "12px" : "11px",
                fontWeight: isRoot || isParent ? 600 : 500,
                fontFamily: "var(--font-geist-sans)",
            }}
        >
            {node.name}
            {node.desc && (
                <span
                    style={{
                        display: "block",
                        fontSize: "9px",
                        fontWeight: 500,
                        marginTop: "2px",
                        opacity: 0.6,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                    }}
                >
                    {node.desc}
                </span>
            )}
        </div>
    );
}

// ── Vertical connector ────────────────────────────────────────────────────────
const VStem = ({ color = "var(--border-strong)", h = 16 }: { color?: string; h?: number }) => {
    return (
        <div
            style={{ width: "2px", height: `${h}px`, background: color, margin: "0 auto", flexShrink: 0 }}
        />
    );
}

// ── Recursive tree ────────────────────────────────────────────────────────────
// No absolute positioning — uses border-trick for horizontal connectors.
const TreeLevel = ({ node, depth = 0 }: { node: CategoryNode; depth?: number }) => {
    const hasChildren = node.children && node.children.length > 0;

    return (
        <div className="flex flex-col items-center" style={{ minWidth: 0 }}>
            <Node node={node} depth={depth} />

            {hasChildren && (
                <>
                    <VStem />

                    {/* Horizontal branch using border on children wrapper */}
                    <div className="flex items-start justify-center" style={{ gap: "0" }}>
                        {node.children!.map((child, i) => {
                            const isFirst = i === 0;
                            const isLast = i === node.children!.length - 1;
                            const isOnly = node.children!.length === 1;

                            return (
                                <div
                                    key={child.id}
                                    className="flex flex-col items-center"
                                    style={{ padding: "0 8px" }}
                                >
                                    {/* Top connector: horizontal + vertical stem */}
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                                        {/* Horizontal bar segment */}
                                        <div style={{ display: "flex", width: "100%", height: "2px", alignItems: "center" }}>
                                            {/* Left half */}
                                            <div
                                                style={{
                                                    flex: 1,
                                                    height: "2px",
                                                    background: isOnly || isFirst ? "transparent" : "var(--border-strong)",
                                                }}
                                            />
                                            {/* Center dot */}
                                            <div style={{ width: "2px", height: "2px", background: "var(--border-strong)", flexShrink: 0 }} />
                                            {/* Right half */}
                                            <div
                                                style={{
                                                    flex: 1,
                                                    height: "2px",
                                                    background: isOnly || isLast ? "transparent" : "var(--border-strong)",
                                                }}
                                            />
                                        </div>
                                        {/* Vertical drop */}
                                        <VStem h={14} />
                                    </div>

                                    <TreeLevel node={child} depth={depth + 1} />
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}

// ── Section ───────────────────────────────────────────────────────────────────
const CategoryTree = () => {
    return (
        <section
            className="relative z-10 px-5 sm:px-8 py-24 sm:py-32"
            style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}
        >
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-14">
                    <p
                        className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-4"
                        style={{ color: "var(--brand)" }}
                    >
                        How it's organised
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                        <h2
                            className="text-[2rem] sm:text-[2.25rem] font-bold tracking-[-0.025em] leading-[1.12]"
                            style={{ color: "var(--foreground)", fontFamily: "var(--font-geist-sans)", margin: 0 }}
                        >
                            Categories structured
                            <br />
                            <span style={{ color: "var(--brand)" }}>the way your business works.</span>
                        </h2>
                        <p
                            className="text-[14px] leading-[1.7] sm:text-right"
                            style={{ color: "var(--text-muted)", maxWidth: "300px", margin: 0, flexShrink: 0 }}
                        >
                            Organise products into parent and child categories that mirror your real
                            business structure — unlimited depth, images at every level.
                        </p>
                    </div>
                </div>

                {/* Tree + image — stacks on mobile, side by side on md+ */}
                <div
                    className="flex flex-col md:grid md:items-start gap-10 md:gap-14"
                    style={{ gridTemplateColumns: "1.2fr 1fr" }}
                >
                    {/* Tree diagram — scrollable horizontally only on very small screens */}
                    <div
                        className="rounded-2xl p-6 sm:p-10 overflow-x-auto"
                        style={{
                            background: "var(--background)",
                            border: "1px solid var(--border)",
                        }}
                    >
                        {/* Inner wrapper constrains the tree width naturally */}
                        <div style={{ minWidth: "320px" }}>
                            <TreeLevel node={CATEGORY_TREE} depth={0} />
                        </div>
                    </div>

                    {/* Right: image + callout list */}
                    <div className="flex flex-col gap-6">
                        <div
                            className="relative rounded-2xl overflow-hidden w-full"
                            style={{
                                aspectRatio: "4/3",
                                border: "1px solid var(--border)",
                                boxShadow: "0 12px 40px rgba(15,23,42,0.08)",
                            }}
                        >
                            <img
                                src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=900&q=85"
                                alt="Organised product shelving with clear category labels"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {[
                            { title: "Unlimited depth", body: "Create as many parent and child category levels as your business needs." },
                            { title: "Images at every level", body: "Attach an image to any category or product for instant visual reference." },
                            { title: "Sync-ready structure", body: "Every category carries a sync_id for seamless external system integration." },
                        ].map(f => (
                            <div key={f.title} className="flex items-start gap-3">
                                <span
                                    className="flex items-center justify-center rounded-lg shrink-0 mt-0.5"
                                    style={{
                                        width: "22px",
                                        height: "22px",
                                        background: "var(--brand-light)",
                                        border: "1px solid rgba(59,130,246,0.2)",
                                    }}
                                >
                                    <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                                        <path d="M3 8l4 4 6-7" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                                <div>
                                    <p className="text-[13.5px] font-semibold" style={{ color: "var(--foreground)" }}>{f.title}</p>
                                    <p className="text-[12.5px] leading-[1.6]" style={{ color: "var(--text-muted)" }}>{f.body}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CategoryTree;