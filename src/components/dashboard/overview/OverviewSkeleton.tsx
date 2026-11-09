// src/components/dashboard/overview/OverviewSkeleton.tsx

/** Mirrors the Overview layout so nothing jumps when data arrives. */
export function OverviewSkeleton() {
    return (
        <div className="space-y-6" aria-busy="true" aria-label="Loading overview">
            <Block className="h-[132px] rounded-2xl" />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => <Block key={i} className="h-[136px] rounded-xl" />)}
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <Block className="h-[360px] rounded-xl xl:col-span-2" />
                <Block className="h-[360px] rounded-xl" />
                <Block className="h-[340px] rounded-xl xl:col-span-2" />
                <Block className="h-[340px] rounded-xl" />
            </div>
        </div>
    );
}

function Block({ className }: { className: string }) {
    return (
        <div
            className={`animate-pulse border ${className}`}
            style={{ background: "var(--surface-muted)", borderColor: "var(--border)" }}
        />
    );
}