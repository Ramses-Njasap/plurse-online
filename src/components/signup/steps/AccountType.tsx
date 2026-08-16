/* ── Step 1: Account type selection ── */

import { PersonIcon, BuildingIcon } from "../shared-with-login/Icons";

export type AccountType = "individual" | "business";

interface Step1Props {
  accountType: AccountType | null;
  onSelect: (type: AccountType) => void;
  onContinue: () => void;
}

export function Step1AccountType({ accountType, onSelect, onContinue }: Step1Props) {
  const canContinue = accountType !== null;

  return (
    <div>
      <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.10em] text-[#0F0F0F]/35">
        Step 1 of 3
      </p>
      <h2 className="mb-7 text-[26px] font-medium leading-[1.25] text-[#0F0F0F]">
        Who is this
        <br />
        account for?
      </h2>

      <div className="mb-7 grid grid-cols-2 gap-3">
        {/* Individual card */}
        <button
          type="button"
          onClick={() => onSelect("individual")}
          className="rounded-xl border p-5 text-left transition-all duration-200"
          style={
            accountType === "individual"
              ? {
                  borderColor: "var(--brand)",
                  background: "white",
                  boxShadow: "0 1px 4px var(--brand-ring)",
                }
              : {
                  borderColor: "rgba(15,15,15,0.10)",
                  background: "white",
                }
          }
        >
          <div
            className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200"
            style={
              accountType === "individual"
                ? { background: "var(--brand)" }
                : { background: "rgba(15,15,15,0.05)" }
            }
          >
            <PersonIcon
              className={
                accountType === "individual" ? "text-white" : "text-[#0F0F0F]/40"
              }
            />
          </div>
          <p className="mb-1 text-[13px] font-medium text-[#0F0F0F]">Individual</p>
          <p className="text-[12px] leading-relaxed text-[#0F0F0F]/40">
            Solo operator or small business owner
          </p>
        </button>

        {/* Company card */}
        <button
          type="button"
          onClick={() => onSelect("business")}
          className="rounded-xl border p-5 text-left transition-all duration-200"
          style={
            accountType === "business"
              ? {
                  borderColor: "var(--brand)",
                  background: "white",
                  boxShadow: "0 1px 4px var(--brand-ring)",
                }
              : {
                  borderColor: "rgba(15,15,15,0.10)",
                  background: "white",
                }
          }
        >
          <div
            className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200"
            style={
              accountType === "business"
                ? { background: "var(--brand)" }
                : { background: "rgba(15,15,15,0.05)" }
            }
          >
            <BuildingIcon
              className={
                accountType === "business" ? "text-white" : "text-[#0F0F0F]/40"
              }
            />
          </div>
          <p className="mb-1 text-[13px] font-medium text-[#0F0F0F]">Business</p>
          <p className="text-[12px] leading-relaxed text-[#0F0F0F]/40">
            Business with a team and multiple users
          </p>
        </button>
      </div>

      <button
        type="button"
        onClick={() => canContinue && onContinue()}
        disabled={!canContinue}
        className="h-[44px] w-full rounded-lg text-[14px] font-medium text-white transition-all active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-25 disabled:active:scale-100"
        style={{ background: "var(--brand)" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "var(--brand-hover)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "var(--brand)")
        }
      >
        Continue
      </button>
    </div>
  );
}