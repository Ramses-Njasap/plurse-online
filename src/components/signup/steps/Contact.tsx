/* ── Step 2: Contact details ── */

interface Step2ContactProps {
  email: string;
  phone: string;
  onEmailChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function Step2Contact({
  email,
  phone,
  onEmailChange,
  onPhoneChange,
  onBack,
  onContinue,
}: Step2ContactProps) {
  const canContinue = email.trim().length > 0 && isValidEmail(email);

  return (
    <div>
      <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.10em] text-[#0F0F0F]/35">
        Step 2 of 3
      </p>
      <h2 className="mb-7 text-[26px] font-medium leading-[1.25] text-[#0F0F0F]">
        Your contact
        <br />
        details.
      </h2>

      <div className="mb-7 space-y-4">
        {/* Email */}
        <div>
          <label className="mb-1.5 flex items-baseline gap-2 text-[12px] font-medium uppercase tracking-wide text-[#0F0F0F]/50">
            Email address
            <span className="text-[11px] font-normal normal-case text-[#0F0F0F]/30">
              required
            </span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="you@business.com"
            autoComplete="email"
            className="h-[44px] w-full rounded-lg border border-[#0F0F0F]/10 bg-white px-4 text-[14px] text-[#0F0F0F] placeholder:text-[#0F0F0F]/20 transition-colors focus:outline-none"
            style={
              {
                "--tw-ring-color": "var(--brand-ring)",
              } as React.CSSProperties
            }
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(15,15,15,0.10)")}
          />
        </div>

        {/* Phone */}
        <div>
          <label className="mb-1.5 flex items-baseline gap-2 text-[12px] font-medium uppercase tracking-wide text-[#0F0F0F]/50">
            Phone number
            <span className="text-[11px] font-normal normal-case text-[#0F0F0F]/30">
              optional
            </span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="+237 6XX XXX XXX"
            autoComplete="tel"
            className="h-[44px] w-full rounded-lg border border-[#0F0F0F]/10 bg-white px-4 text-[14px] text-[#0F0F0F] placeholder:text-[#0F0F0F]/20 transition-colors focus:outline-none"
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(15,15,15,0.10)")}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="h-[44px] rounded-lg border border-[#0F0F0F]/10 px-5 text-[14px] font-medium text-[#0F0F0F]/50 transition-all hover:border-[#0F0F0F]/25 hover:text-[#0F0F0F]/70"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => canContinue && onContinue()}
          disabled={!canContinue}
          className="h-[44px] flex-1 rounded-lg text-[14px] font-medium text-white transition-all active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-25 disabled:active:scale-100"
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
    </div>
  );
}