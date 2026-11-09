// src/components/dashboard/my/settings/businesses/BusinessesSkeleton.tsx

/** Loading placeholder that mirrors the BusinessCard layout so the page doesn't jump. */
export function BusinessesSkeleton({ count = 4 }: { count?: number }) {
    return (
        <div className="space-y-5" aria-busy="true" aria-label="Loading businesses">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2">
                <Block className="h-10 w-[280px] rounded-lg" />
                <Block className="h-9 w-full max-w-[320px] rounded-lg" />
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {Array.from({ length: count }).map((_, i) => (
                    <div
                        key={i}
                        className="rounded-2xl border p-5"
                        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
                    >
                        <div className="flex items-start gap-3">
                            <Block className="h-10 w-10 rounded-xl" />
                            <div className="flex-1 space-y-2">
                                <Block className="h-4 w-2/5 rounded" />
                                <Block className="h-3 w-1/4 rounded" />
                            </div>
                            <Block className="h-5 w-20 rounded-full" />
                        </div>
                        <div
                            className="mt-4 grid grid-cols-2 gap-4 rounded-xl border p-3"
                            style={{ borderColor: "var(--border)", background: "var(--surface-muted)" }}
                        >
                            {Array.from({ length: 4 }).map((__, j) => (
                                <div key={j} className="space-y-2">
                                    <Block className="h-3 w-1/3 rounded" />
                                    <Block className="h-4 w-2/3 rounded" />
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                            <Block className="h-3 w-28 rounded" />
                            <Block className="h-3 w-20 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Block({ className }: { className: string }) {
    return <div className={`animate-pulse ${className}`} style={{ background: "var(--surface-muted)" }} />;
}