/* ── Step progress bar ── */

type Step = 1 | 2 | 3;

interface StepBarProps {
  current: Step;
}

export function StepBar({ current }: StepBarProps) {
  return (
    <div className="mb-8 flex gap-1.5">
      {([1, 2, 3] as Step[]).map((s) => (
        <div
          key={s}
          className="h-[2px] flex-1 rounded-full transition-all duration-500"
          style={
            s <= current
              ? { background: "var(--brand)" }
              : { background: "rgba(15,15,15,0.10)" }
          }
        />
      ))}
    </div>
  );
}