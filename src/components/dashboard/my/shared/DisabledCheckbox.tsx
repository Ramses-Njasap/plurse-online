import { useRef, useState } from "react";
import { createPortal } from "react-dom";

// ---------------------------------------------------------------------------
// Stylish red "X" — filled tapering petals instead of a plain stroked path.
// ---------------------------------------------------------------------------
function StylishX() {
    return (
        <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <defs>
                <filter id="stylish-x-shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow
                        dx="0"
                        dy="0.5"
                        stdDeviation="0.6"
                        floodColor="#000"
                        floodOpacity="0.25"
                    />
                </filter>
            </defs>
            <g filter="url(#stylish-x-shadow)" fill="#dc2626">
                {/* stroke 1: top-left to bottom-right */}
                <path d="M3,3 Q14.5,9.5 21,21 Q9.5,14.5 3,3 Z" />
                {/* stroke 2: top-right to bottom-left */}
                <path d="M21,3 Q14.5,14.5 3,21 Q9.5,9.5 21,3 Z" />
            </g>
        </svg>
    );
}

// ---------------------------------------------------------------------------
// Portal tooltip positioning hook — renders to document.body via a portal so
// it can never be clipped by a scrolling/overflow-hidden table container.
// Flips from centered to left-anchored if it would overflow the viewport.
// ---------------------------------------------------------------------------
function usePortalTooltip() {
    const anchorRef = useRef<HTMLDivElement>(null);
    const [pos, setPos] = useState<{ top: number; left: number; flip: boolean } | null>(null);

    const show = () => {
        const el = anchorRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const tooltipWidth = 220;
        const wouldOverflowLeft = rect.left + rect.width / 2 - tooltipWidth / 2 < 8;

        setPos({
            top: rect.top - 8, // 8px gap above the checkbox
            left: wouldOverflowLeft ? rect.left : rect.left + rect.width / 2,
            flip: wouldOverflowLeft,
        });
    };

    const hide = () => setPos(null);

    return { anchorRef, pos, show, hide };
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export function DisabledKeyCheckbox({
    isSelected,
    isRowDisabled,
    onSelectOne,
    keyId,
    tooltipText = "You can't select or delete an access key for a business you don't directly own.",
}: {
    isSelected: boolean;
    isRowDisabled: boolean;
    onSelectOne: (id: string) => void;
    keyId: string;
    tooltipText?: string;
}) {
    const { anchorRef, pos, show, hide } = usePortalTooltip();

    return (
        <div
            ref={anchorRef}
            className="relative inline-block"
            onMouseEnter={isRowDisabled ? show : undefined}
            onMouseLeave={isRowDisabled ? hide : undefined}
        >
            <label
                className={`
          relative flex h-4 w-4 items-center justify-center rounded border transition-colors
          ${isRowDisabled
                        ? "cursor-not-allowed border-gray-200 bg-gray-50"
                        : "cursor-pointer border-gray-300 bg-white aria-checked:bg-[var(--brand)] aria-checked:border-[var(--brand)]"
                    }
        `}
                aria-checked={!isRowDisabled && isSelected}
            >
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => !isRowDisabled && onSelectOne(keyId)}
                    disabled={isRowDisabled}
                    className="sr-only"
                />

                {/* Disabled state: stylish red X, tips reaching toward the corners */}
                {isRowDisabled && <StylishX />}

                {/* Active selected state: standard checkmark */}
                {!isRowDisabled && isSelected && (
                    <svg
                        className="h-2.5 w-2.5 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </label>

            {pos &&
                createPortal(
                    <div
                        role="tooltip"
                        style={{
                            position: "fixed",
                            top: pos.top,
                            left: pos.left,
                            transform: pos.flip ? "translateY(-100%)" : "translate(-50%, -100%)",
                            zIndex: 9999,
                        }}
                        className="pointer-events-none w-52 rounded-lg bg-gray-900 px-3 py-2 text-center text-[11px] font-medium leading-snug text-white shadow-lg"
                    >
                        {tooltipText}
                        <div
                            className="absolute h-2 w-2 rotate-45 bg-gray-900"
                            style={
                                pos.flip
                                    ? { bottom: -4, left: 16 }
                                    : { bottom: -4, left: "50%", marginLeft: -4 }
                            }
                        />
                    </div>,
                    document.body
                )}
        </div>
    );
}